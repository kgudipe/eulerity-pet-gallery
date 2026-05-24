import { useCallback, useEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useDownloadManagerContext } from '../context/DownloadManagerContext';
import { useSelection } from '../context/SelectionContext';
import { DownloadManagerPanel } from './DownloadManagerPanel';

const DOWNLOAD_POPOVER_ID = 'download-manager-popover';
const DOWNLOAD_PANEL_TITLE_ID = 'download-manager-title';

const Shell = styled.div`
  min-height: 100vh;
`;

const SkipLink = styled.a`
  position: absolute;
  left: 16px;
  top: -52px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #0b57d0;
  color: #ffffff;
  font-weight: 700;
  z-index: 100;

  &:focus {
    top: 12px;
  }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  background: rgba(243, 247, 237, 0.84);
  border-bottom: 1px solid rgba(31, 45, 36, 0.12);
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const Brand = styled(NavLink)`
  font-family: 'Fraunces', serif;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledNavLink = styled(NavLink)`
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--text-muted);
  font-weight: 500;

  &.active {
    background: var(--surface-strong);
    color: var(--brand-strong);
    box-shadow: var(--shadow);
  }
`;

const SelectionBadge = styled.div`
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.13);
  color: var(--brand-strong);
  font-weight: 600;
  font-size: 0.9rem;
`;

const DownloadWrap = styled.div`
  position: relative;
`;

const DownloadButton = styled.button<{ $open: boolean }>`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(31, 45, 36, 0.18);
  background: ${({ $open }) => ($open ? '#dbeafe' : 'var(--surface-strong)')};
  color: var(--text-main);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const DownloadBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #1d4ed8;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0 4px;
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: min(430px, calc(100vw - 30px));
  z-index: 20;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Layout = () => {
  const { selectedCount } = useSelection();
  const {
    jobs,
    stats,
    zipStatusMessage,
    retryDownload,
    cancelDownload,
    cancelAll,
    retryFailed,
    clearFinished,
    isPanelOpen,
    togglePanel,
    closePanel,
  } = useDownloadManagerContext();
  const downloadWrapRef = useRef<HTMLDivElement>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const activeCount = stats.queued + stats.downloading;

  const closePanelAndRestoreFocus = useCallback(() => {
    closePanel();
    window.requestAnimationFrame(() => {
      downloadButtonRef.current?.focus();
    });
  }, [closePanel]);

  useEffect(() => {
    if (!isPanelOpen) {
      return;
    }

    window.requestAnimationFrame(() => {
      popoverRef.current?.focus();
    });

    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (downloadWrapRef.current?.contains(target)) {
        return;
      }

      closePanelAndRestoreFocus();
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanelAndRestoreFocus();
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, [isPanelOpen, closePanelAndRestoreFocus]);

  return (
    <Shell>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Header>
        <HeaderInner>
          <Brand to="/">Pet Atlas</Brand>
          <Nav aria-label="Primary navigation">
            <StyledNavLink to="/" end>
              Gallery
            </StyledNavLink>
            <StyledNavLink to="/about">About</StyledNavLink>
            <SelectionBadge role="status" aria-live="polite">
              {selectedCount} selected
            </SelectionBadge>
            <DownloadWrap ref={downloadWrapRef}>
              <DownloadButton
                ref={downloadButtonRef}
                type="button"
                $open={isPanelOpen}
                aria-label={
                  activeCount > 0
                    ? `Open download manager, ${activeCount} active download${activeCount === 1 ? '' : 's'}`
                    : 'Open download manager'
                }
                aria-haspopup="dialog"
                aria-expanded={isPanelOpen}
                aria-controls={DOWNLOAD_POPOVER_ID}
                onClick={togglePanel}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 4V14M12 14L8 10M12 14L16 10M5 18H19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {activeCount > 0 ? (
                  <DownloadBadge aria-hidden="true">{activeCount > 99 ? '99+' : activeCount}</DownloadBadge>
                ) : null}
              </DownloadButton>
              {isPanelOpen ? (
                <Popover
                  id={DOWNLOAD_POPOVER_ID}
                  ref={popoverRef}
                  role="dialog"
                  aria-modal="false"
                  aria-labelledby={DOWNLOAD_PANEL_TITLE_ID}
                  tabIndex={-1}
                >
                  <DownloadManagerPanel
                    jobs={jobs}
                    stats={stats}
                    onRetryItem={retryDownload}
                    onCancelItem={cancelDownload}
                    onCancelAll={cancelAll}
                    onRetryFailed={retryFailed}
                    onClearFinished={clearFinished}
                    onClose={closePanelAndRestoreFocus}
                    headingId={DOWNLOAD_PANEL_TITLE_ID}
                    statusMessage={zipStatusMessage}
                    compact
                    showWhenEmpty
                  />
                </Popover>
              ) : null}
            </DownloadWrap>
          </Nav>
        </HeaderInner>
      </Header>
      <Main id="main-content" tabIndex={-1}>
        <Outlet />
      </Main>
    </Shell>
  );
};
