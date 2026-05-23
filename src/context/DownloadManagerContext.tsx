import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDownloadManager } from '../hooks/useDownloadManager';

type DownloadManagerContextValue = ReturnType<typeof useDownloadManager> & {
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
};

const DownloadManagerContext = createContext<DownloadManagerContextValue | null>(null);

interface DownloadManagerProviderProps {
  children: React.ReactNode;
}

export const DownloadManagerProvider = ({ children }: DownloadManagerProviderProps) => {
  const manager = useDownloadManager();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelOpen((previous) => !previous);
  }, []);

  useEffect(() => {
    if (manager.hasActiveDownloads) {
      setIsPanelOpen(true);
    }
  }, [manager.hasActiveDownloads]);

  const value = useMemo(
    () => ({
      ...manager,
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel,
    }),
    [manager, isPanelOpen, openPanel, closePanel, togglePanel],
  );

  return <DownloadManagerContext.Provider value={value}>{children}</DownloadManagerContext.Provider>;
};

export const useDownloadManagerContext = (): DownloadManagerContextValue => {
  const context = useContext(DownloadManagerContext);
  if (!context) {
    throw new Error('useDownloadManagerContext must be used within DownloadManagerProvider.');
  }

  return context;
};
