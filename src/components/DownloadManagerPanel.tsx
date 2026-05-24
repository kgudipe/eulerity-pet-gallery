import styled from 'styled-components';
import type { DownloadManagerStats, DownloadQueueItem } from '../hooks/useDownloadManager';
import { formatBytes } from '../utils/format';

interface DownloadManagerPanelProps {
  jobs: DownloadQueueItem[];
  stats: DownloadManagerStats;
  onRetryItem: (petId: string) => void;
  onCancelItem: (petId: string) => void;
  onCancelAll: () => void;
  onRetryFailed: () => void;
  onClearFinished: () => void;
  onClose?: () => void;
  headingId?: string;
  statusMessage?: string;
  compact?: boolean;
  showWhenEmpty?: boolean;
}

const Panel = styled.section<{ $compact: boolean }>`
  background: var(--surface-strong);
  border: 1px solid rgba(31, 45, 36, 0.12);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: ${({ $compact }) => ($compact ? '12px' : '16px')};
  display: grid;
  gap: ${({ $compact }) => ($compact ? '10px' : '14px')};
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const TopInfo = styled.div`
  display: grid;
  gap: 4px;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  border: 1px solid rgba(31, 45, 36, 0.2);
  background: var(--surface-strong);
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Title = styled.h2<{ $compact: boolean }>`
  font-size: ${({ $compact }) => ($compact ? '1rem' : '1.2rem')};
`;

const StatsRow = styled.p`
  color: var(--text-muted);
  font-size: 0.82rem;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(31, 45, 36, 0.1);
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${Math.min(Math.max($percent, 0), 100)}%`};
  height: 100%;
  background: linear-gradient(90deg, #0f766e 0%, #25b18e 100%);
  transition: width 0.2s ease;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  border: 1px solid rgba(31, 45, 36, 0.2);
  background: var(--surface-strong);
  border-radius: 10px;
  padding: 7px 10px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.p`
  color: var(--text-muted);
  font-size: 0.82rem;
`;

const EmptyState = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.86rem;
`;

const JobList = styled.div<{ $compact: boolean }>`
  display: grid;
  gap: 8px;
  max-height: ${({ $compact }) => ($compact ? '320px' : 'none')};
  overflow-y: ${({ $compact }) => ($compact ? 'auto' : 'visible')};
  padding-right: ${({ $compact }) => ($compact ? '2px' : '0')};
`;

const JobCard = styled.article`
  border: 1px solid rgba(31, 45, 36, 0.12);
  border-radius: 10px;
  padding: 9px 10px;
  display: grid;
  gap: 7px;
`;

const JobTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
`;

const JobName = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
`;

const JobMeta = styled.p`
  color: var(--text-muted);
  font-size: 0.79rem;
`;

const StatusBadge = styled.span<{ $status: DownloadQueueItem['status'] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ $status }) => {
    if ($status === 'completed') {
      return 'rgba(16, 185, 129, 0.2)';
    }

    if ($status === 'failed' || $status === 'canceled') {
      return 'rgba(180, 35, 24, 0.15)';
    }

    if ($status === 'downloading') {
      return 'rgba(14, 116, 144, 0.17)';
    }

    return 'rgba(31, 45, 36, 0.13)';
  }};
  color: ${({ $status }) => {
    if ($status === 'completed') {
      return '#065f46';
    }

    if ($status === 'failed' || $status === 'canceled') {
      return '#991b1b';
    }

    if ($status === 'downloading') {
      return '#0e7490';
    }

    return '#334155';
  }};
`;

const JobActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SmallButton = styled.button`
  border: 1px solid rgba(31, 45, 36, 0.2);
  background: var(--surface-strong);
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 0.77rem;
  font-weight: 600;
  cursor: pointer;
`;

const statusLabel: Record<DownloadQueueItem['status'], string> = {
  queued: 'Queued',
  downloading: 'Downloading',
  completed: 'Done',
  failed: 'Failed',
  canceled: 'Canceled',
};

export const DownloadManagerPanel = ({
  jobs,
  stats,
  onRetryItem,
  onCancelItem,
  onCancelAll,
  onRetryFailed,
  onClearFinished,
  onClose,
  headingId,
  statusMessage,
  compact = false,
  showWhenEmpty = false,
}: DownloadManagerPanelProps) => {
  if (jobs.length === 0 && !showWhenEmpty) {
    return null;
  }

  return (
    <Panel $compact={compact} aria-busy={stats.downloading > 0}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {stats.downloading} active downloads, {stats.queued} queued, {stats.failed} failed.
      </p>

      <TopRow>
        <TopInfo>
          <Title id={headingId} $compact={compact}>
            Downloads
          </Title>
          <StatsRow>
            <span>{stats.downloading} active</span>
            <span>{stats.queued} queued</span>
            <span>{stats.failed} failed</span>
          </StatsRow>
        </TopInfo>

        <TopActions>
          {onClose ? (
            <CloseButton type="button" onClick={onClose} aria-label="Close download manager">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </CloseButton>
          ) : null}
        </TopActions>
      </TopRow>

      <ProgressTrack
        role="progressbar"
        aria-label="Overall download progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(stats.overallProgress)}
      >
        <ProgressFill $percent={stats.overallProgress} />
      </ProgressTrack>

      {statusMessage ? (
        <StatusMessage role="status" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </StatusMessage>
      ) : null}

      <Actions>
        <ActionButton
          type="button"
          onClick={onCancelAll}
          disabled={stats.queued + stats.downloading === 0}
          aria-label={`Cancel all active downloads (${stats.queued + stats.downloading} items)`}
        >
          Cancel All
        </ActionButton>
        <ActionButton
          type="button"
          onClick={onRetryFailed}
          disabled={stats.failed === 0}
          aria-label={`Retry all failed downloads (${stats.failed} items)`}
        >
          Retry Failed
        </ActionButton>
        <ActionButton
          type="button"
          onClick={onClearFinished}
          disabled={stats.completed + stats.failed + stats.canceled === 0}
          aria-label="Clear completed, failed, and canceled downloads"
        >
          Clear Done
        </ActionButton>
      </Actions>

      {jobs.length === 0 ? (
        <EmptyState>No downloads yet. Queue files from the gallery to get started.</EmptyState>
      ) : (
        <JobList $compact={compact} role="list" aria-label="Download queue items">
          {jobs.map((job) => {
            const progressLabel = job.bytesTotal
              ? `${formatBytes(job.bytesLoaded)} / ${formatBytes(job.bytesTotal)}`
              : job.progress > 0
                ? `${formatBytes(job.bytesLoaded)} / unknown`
                : 'Waiting for file size';

            return (
              <JobCard key={job.petId} role="listitem">
                <JobTop>
                  <JobName>{job.title}</JobName>
                  <StatusBadge $status={job.status}>{statusLabel[job.status]}</StatusBadge>
                </JobTop>

                <ProgressTrack
                  role="progressbar"
                  aria-label={`${job.title} download progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(job.progress)}
                >
                  <ProgressFill $percent={job.progress} />
                </ProgressTrack>

                <JobMeta>
                  {Math.round(job.progress)}% • {progressLabel} • Attempt {job.attempts}
                </JobMeta>

                {job.error ? (
                  <JobMeta role="status" aria-live="polite" aria-atomic="true">
                    {job.error}
                  </JobMeta>
                ) : null}

                <JobActions>
                  {job.status === 'downloading' || job.status === 'queued' ? (
                    <SmallButton
                      type="button"
                      onClick={() => onCancelItem(job.petId)}
                      aria-label={`Cancel download for ${job.title}`}
                    >
                      Cancel
                    </SmallButton>
                  ) : null}

                  {job.status === 'failed' || job.status === 'canceled' ? (
                    <SmallButton
                      type="button"
                      onClick={() => onRetryItem(job.petId)}
                      aria-label={`Retry download for ${job.title}`}
                    >
                      Retry
                    </SmallButton>
                  ) : null}
                </JobActions>
              </JobCard>
            );
          })}
        </JobList>
      )}
    </Panel>
  );
};
