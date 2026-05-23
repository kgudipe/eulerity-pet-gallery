import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePets } from './PetsContext';

interface SelectionContextValue {
  selectedIds: string[];
  selectedCount: number;
  estimatedTotalBytes: number;
  unknownSizeCount: number;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

const SELECTED_IDS_STORAGE_KEY = 'pet-gallery:selected-ids';
const FILE_SIZES_STORAGE_KEY = 'pet-gallery:file-sizes';

const SelectionContext = createContext<SelectionContextValue | null>(null);

interface SelectionProviderProps {
  children: React.ReactNode;
}

const loadStoredStringArray = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
};

const loadStoredNumberMap = (key: string): Record<string, number> => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }

    return Object.entries(parsed as Record<string, unknown>).reduce<Record<string, number>>(
      (accumulator, [itemKey, itemValue]) => {
        if (typeof itemValue === 'number' && Number.isFinite(itemValue) && itemValue > 0) {
          accumulator[itemKey] = itemValue;
        }

        return accumulator;
      },
      {},
    );
  } catch {
    return {};
  }
};

export const SelectionProvider = ({ children }: SelectionProviderProps) => {
  const { petsById } = usePets();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => loadStoredStringArray(SELECTED_IDS_STORAGE_KEY));
  const [fileSizes, setFileSizes] = useState<Record<string, number>>(() => loadStoredNumberMap(FILE_SIZES_STORAGE_KEY));
  const fileSizesRef = useRef(fileSizes);
  const pendingSizeChecksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fileSizesRef.current = fileSizes;
  }, [fileSizes]);

  useEffect(() => {
    localStorage.setItem(SELECTED_IDS_STORAGE_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    localStorage.setItem(FILE_SIZES_STORAGE_KEY, JSON.stringify(fileSizes));
  }, [fileSizes]);

  const estimateFileSize = useCallback(
    async (id: string) => {
      if (fileSizesRef.current[id] || pendingSizeChecksRef.current.has(id)) {
        return;
      }

      const pet = petsById[id];
      if (!pet?.imageUrl) {
        return;
      }

      pendingSizeChecksRef.current.add(id);

      try {
        const headResponse = await fetch(pet.imageUrl, {
          method: 'HEAD',
        });

        const headerValue = headResponse.headers.get('content-length');
        const parsedHeader = headerValue ? Number(headerValue) : Number.NaN;

        if (Number.isFinite(parsedHeader) && parsedHeader > 0) {
          setFileSizes((previous) => ({
            ...previous,
            [id]: parsedHeader,
          }));
          return;
        }

        const fullResponse = await fetch(pet.imageUrl);
        if (!fullResponse.ok) {
          return;
        }

        const blob = await fullResponse.blob();
        if (blob.size > 0) {
          setFileSizes((previous) => ({
            ...previous,
            [id]: blob.size,
          }));
        }
      } catch {
        // Best effort estimation for display only.
      } finally {
        pendingSizeChecksRef.current.delete(id);
      }
    },
    [petsById],
  );

  const toggleSelection = useCallback(
    (id: string) => {
      setSelectedIds((previous) => {
        const exists = previous.includes(id);
        if (exists) {
          return previous.filter((value) => value !== id);
        }

        void estimateFileSize(id);
        return [...previous, id];
      });
    },
    [estimateFileSize],
  );

  const selectAll = useCallback(
    (ids: string[]) => {
      const uniqueIds = [...new Set(ids)];

      setSelectedIds((previous) => {
        const merged = new Set([...previous, ...uniqueIds]);
        return Array.from(merged);
      });

      uniqueIds.forEach((id) => {
        void estimateFileSize(id);
      });
    },
    [estimateFileSize],
  );

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const estimatedTotalBytes = useMemo(() => {
    return selectedIds.reduce((sum, id) => sum + (fileSizes[id] ?? 0), 0);
  }, [selectedIds, fileSizes]);

  const unknownSizeCount = useMemo(() => {
    return selectedIds.reduce((count, id) => count + (fileSizes[id] ? 0 : 1), 0);
  }, [selectedIds, fileSizes]);

  const value = useMemo(
    () => ({
      selectedIds,
      selectedCount: selectedIds.length,
      estimatedTotalBytes,
      unknownSizeCount,
      toggleSelection,
      selectAll,
      clearSelection,
      isSelected: (id: string) => selectedSet.has(id),
    }),
    [selectedIds, estimatedTotalBytes, unknownSizeCount, toggleSelection, selectAll, clearSelection, selectedSet],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelection = (): SelectionContextValue => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used inside SelectionProvider.');
  }

  return context;
};
