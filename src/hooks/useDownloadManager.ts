import JSZip from 'jszip';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Pet } from '../types';
import { fileNameFromPet } from '../utils/format';

const MAX_CONCURRENT_DOWNLOADS = 2;

export type DownloadStatus = 'queued' | 'downloading' | 'completed' | 'failed' | 'canceled';

export interface DownloadQueueItem {
  petId: string;
  title: string;
  fileName: string;
  imageUrl: string;
  status: DownloadStatus;
  progress: number;
  bytesLoaded: number;
  bytesTotal: number | null;
  attempts: number;
  error: string | null;
}

export interface DownloadManagerStats {
  total: number;
  queued: number;
  downloading: number;
  completed: number;
  failed: number;
  canceled: number;
  overallProgress: number;
}

interface UseDownloadManagerResult {
  jobs: DownloadQueueItem[];
  stats: DownloadManagerStats;
  isZipRunning: boolean;
  zipStatusMessage: string;
  hasActiveDownloads: boolean;
  enqueueDownloads: (pets: Pet[]) => void;
  retryDownload: (petId: string) => void;
  cancelDownload: (petId: string) => void;
  cancelAll: () => void;
  retryFailed: () => void;
  clearFinished: () => void;
  downloadAsZip: (pets: Pet[]) => Promise<void>;
}

interface ProgressUpdate {
  loadedBytes: number;
  totalBytes: number | null;
  percent: number;
}

const triggerBrowserDownload = (blob: Blob, fileName: string): void => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
};

const readErrorName = (value: unknown): string | null => {
  if (typeof value !== 'object' || value === null || !('name' in value)) {
    return null;
  }

  const namedValue = value as { name?: unknown };
  return typeof namedValue.name === 'string' ? namedValue.name : null;
};

const extractErrorMessage = (value: unknown): string => {
  if (value instanceof Error) {
    return value.message;
  }

  if (typeof value === 'string') {
    return value;
  }

  return 'Unexpected download error.';
};

const isAbortError = (value: unknown): boolean => {
  const name = readErrorName(value);
  return name === 'AbortError';
};

const parseTotalBytes = (response: Response): number | null => {
  const headerValue = response.headers.get('content-length');
  const parsed = headerValue ? Number(headerValue) : Number.NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const fetchBlobWithProgress = async (
  imageUrl: string,
  signal?: AbortSignal,
  onProgress?: (update: ProgressUpdate) => void,
): Promise<Blob> => {
  const response = await fetch(imageUrl, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch image (${response.status})`);
  }

  const totalBytes = parseTotalBytes(response);

  if (!response.body) {
    const blob = await response.blob();
    onProgress?.({
      loadedBytes: blob.size,
      totalBytes: totalBytes ?? blob.size,
      percent: 100,
    });
    return blob;
  }

  const reader = response.body.getReader();
  const chunks: ArrayBuffer[] = [];
  let loadedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      const copy = new Uint8Array(value.byteLength);
      copy.set(value);
      chunks.push(copy.buffer);
      loadedBytes += value.byteLength;

      onProgress?.({
        loadedBytes,
        totalBytes,
        percent: totalBytes ? Math.min((loadedBytes / totalBytes) * 100, 99) : 0,
      });
    }
  } finally {
    reader.releaseLock();
  }

  const blob = new Blob(chunks, {
    type: response.headers.get('content-type') ?? 'application/octet-stream',
  });

  onProgress?.({
    loadedBytes: loadedBytes || blob.size,
    totalBytes: totalBytes ?? blob.size,
    percent: 100,
  });

  return blob;
};

export const useDownloadManager = (): UseDownloadManagerResult => {
  const [jobs, setJobs] = useState<DownloadQueueItem[]>([]);
  const [isZipRunning, setIsZipRunning] = useState(false);
  const [zipStatusMessage, setZipStatusMessage] = useState('');
  const controllersRef = useRef<Record<string, AbortController>>({});

  const updateJob = useCallback(
    (petId: string, updater: (current: DownloadQueueItem) => DownloadQueueItem) => {
      setJobs((previous) =>
        previous.map((item) => {
          if (item.petId !== petId) {
            return item;
          }

          return updater(item);
        }),
      );
    },
    [],
  );

  const startJobDownload = useCallback(
    (job: DownloadQueueItem) => {
      if (controllersRef.current[job.petId]) {
        return;
      }

      const controller = new AbortController();
      controllersRef.current[job.petId] = controller;

      updateJob(job.petId, (current) => ({
        ...current,
        status: 'downloading',
        error: null,
        attempts: current.attempts + 1,
      }));

      const run = async () => {
        try {
          const blob = await fetchBlobWithProgress(job.imageUrl, controller.signal, (progressUpdate) => {
            updateJob(job.petId, (current) => {
              if (current.status === 'canceled') {
                return current;
              }

              return {
                ...current,
                status: 'downloading',
                progress: progressUpdate.percent,
                bytesLoaded: progressUpdate.loadedBytes,
                bytesTotal: progressUpdate.totalBytes,
              };
            });
          });

          triggerBrowserDownload(blob, job.fileName);

          updateJob(job.petId, (current) => ({
            ...current,
            status: 'completed',
            progress: 100,
            bytesLoaded: current.bytesTotal ?? blob.size,
            bytesTotal: current.bytesTotal ?? blob.size,
            error: null,
          }));
        } catch (caughtError) {
          if (isAbortError(caughtError)) {
            updateJob(job.petId, (current) => ({
              ...current,
              status: 'canceled',
              error: 'Download canceled.',
            }));
            return;
          }

          updateJob(job.petId, (current) => ({
            ...current,
            status: 'failed',
            error: extractErrorMessage(caughtError),
          }));
        } finally {
          delete controllersRef.current[job.petId];
        }
      };

      void run();
    },
    [updateJob],
  );

  useEffect(() => {
    const runningCount = jobs.filter((job) => job.status === 'downloading').length;
    const slotsAvailable = MAX_CONCURRENT_DOWNLOADS - runningCount;

    if (slotsAvailable <= 0) {
      return;
    }

    const nextJobs = jobs.filter((job) => job.status === 'queued').slice(0, slotsAvailable);
    nextJobs.forEach((job) => {
      startJobDownload(job);
    });
  }, [jobs, startJobDownload]);

  useEffect(() => {
    return () => {
      Object.values(controllersRef.current).forEach((controller) => {
        controller.abort();
      });
      controllersRef.current = {};
    };
  }, []);

  const enqueueDownloads = useCallback((pets: Pet[]) => {
    setJobs((previous) => {
      const byPetId = new Map(previous.map((job) => [job.petId, job]));

      pets.forEach((pet) => {
        const existing = byPetId.get(pet.id);

        if (!existing) {
          byPetId.set(pet.id, {
            petId: pet.id,
            title: pet.title,
            fileName: fileNameFromPet(pet.title, pet.id, pet.imageUrl),
            imageUrl: pet.imageUrl,
            status: 'queued',
            progress: 0,
            bytesLoaded: 0,
            bytesTotal: null,
            attempts: 0,
            error: null,
          });
          return;
        }

        if (existing.status === 'downloading' || existing.status === 'queued') {
          return;
        }

        byPetId.set(pet.id, {
          ...existing,
          title: pet.title,
          fileName: fileNameFromPet(pet.title, pet.id, pet.imageUrl),
          imageUrl: pet.imageUrl,
          status: 'queued',
          progress: 0,
          bytesLoaded: 0,
          bytesTotal: null,
          error: null,
        });
      });

      return Array.from(byPetId.values());
    });
  }, []);

  const retryDownload = useCallback((petId: string) => {
    updateJob(petId, (current) => ({
      ...current,
      status: 'queued',
      progress: 0,
      bytesLoaded: 0,
      bytesTotal: null,
      error: null,
    }));
  }, [updateJob]);

  const cancelDownload = useCallback(
    (petId: string) => {
      const controller = controllersRef.current[petId];
      if (controller) {
        controller.abort();
        return;
      }

      updateJob(petId, (current) => {
        if (current.status !== 'queued') {
          return current;
        }

        return {
          ...current,
          status: 'canceled',
          error: 'Download canceled.',
        };
      });
    },
    [updateJob],
  );

  const cancelAll = useCallback(() => {
    Object.values(controllersRef.current).forEach((controller) => {
      controller.abort();
    });

    setJobs((previous) =>
      previous.map((job) => {
        if (job.status === 'downloading' || job.status === 'queued') {
          return {
            ...job,
            status: 'canceled',
            error: 'Download canceled.',
          };
        }

        return job;
      }),
    );
  }, []);

  const retryFailed = useCallback(() => {
    setJobs((previous) =>
      previous.map((job) => {
        if (job.status !== 'failed') {
          return job;
        }

        return {
          ...job,
          status: 'queued',
          progress: 0,
          bytesLoaded: 0,
          bytesTotal: null,
          error: null,
        };
      }),
    );
  }, []);

  const clearFinished = useCallback(() => {
    setJobs((previous) => previous.filter((job) => job.status === 'queued' || job.status === 'downloading'));
  }, []);

  const downloadAsZip = useCallback(async (pets: Pet[]) => {
    if (pets.length === 0) {
      setZipStatusMessage('No selected images to export as ZIP.');
      return;
    }

    setIsZipRunning(true);
    setZipStatusMessage('Preparing ZIP export...');

    try {
      const zip = new JSZip();
      let addedCount = 0;
      let failedCount = 0;

      for (const pet of pets) {
        setZipStatusMessage(`Fetching ${pet.title} (${addedCount + failedCount + 1}/${pets.length})...`);

        try {
          const blob = await fetchBlobWithProgress(pet.imageUrl);
          zip.file(fileNameFromPet(pet.title, pet.id, pet.imageUrl), blob);
          addedCount += 1;
        } catch {
          failedCount += 1;
        }
      }

      if (addedCount === 0) {
        throw new Error('ZIP export failed because all selected downloads failed.');
      }

      const zipBlob = await zip.generateAsync(
        {
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 },
        },
        (metadata) => {
          setZipStatusMessage(`Compressing ZIP... ${Math.round(metadata.percent)}%`);
        },
      );

      const dateStamp = new Date().toISOString().slice(0, 10);
      triggerBrowserDownload(zipBlob, `pet-gallery-${dateStamp}.zip`);

      if (failedCount > 0) {
        setZipStatusMessage(`ZIP downloaded with ${addedCount} file(s). ${failedCount} file(s) failed.`);
      } else {
        setZipStatusMessage(`ZIP downloaded with ${addedCount} file(s).`);
      }
    } catch (caughtError) {
      setZipStatusMessage(extractErrorMessage(caughtError));
    } finally {
      setIsZipRunning(false);
    }
  }, []);

  const stats = useMemo<DownloadManagerStats>(() => {
    const total = jobs.length;
    const queued = jobs.filter((job) => job.status === 'queued').length;
    const downloading = jobs.filter((job) => job.status === 'downloading').length;
    const completed = jobs.filter((job) => job.status === 'completed').length;
    const failed = jobs.filter((job) => job.status === 'failed').length;
    const canceled = jobs.filter((job) => job.status === 'canceled').length;
    const overallProgress =
      total === 0 ? 0 : jobs.reduce((sum, job) => sum + Math.min(Math.max(job.progress, 0), 100), 0) / total;

    return {
      total,
      queued,
      downloading,
      completed,
      failed,
      canceled,
      overallProgress,
    };
  }, [jobs]);

  const hasActiveDownloads = useMemo(() => {
    return jobs.some((job) => job.status === 'queued' || job.status === 'downloading');
  }, [jobs]);

  return {
    jobs,
    stats,
    isZipRunning,
    zipStatusMessage,
    hasActiveDownloads,
    enqueueDownloads,
    retryDownload,
    cancelDownload,
    cancelAll,
    retryFailed,
    clearFinished,
    downloadAsZip,
  };
};
