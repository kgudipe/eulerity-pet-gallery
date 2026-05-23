import styled from 'styled-components';
import type { SortOption } from '../types';

interface GalleryControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  selectedCount: number;
  estimatedSizeLabel: string;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDownloadSelected: () => void;
  disableSelectAll: boolean;
  disableClear: boolean;
  disableDownload: boolean;
  helperMessage?: string;
}

const Wrapper = styled.section`
  background: var(--surface);
  border: 1px solid rgba(31, 45, 36, 0.12);
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 14px;
  box-shadow: var(--shadow);
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Heading = styled.h1`
  font-size: clamp(1.7rem, 2.4vw, 2.3rem);
`;

const Stats = styled.p`
  color: var(--text-muted);
  font-weight: 500;
`;

const Input = styled.input`
  width: min(420px, 100%);
  flex: 1;
  min-width: 220px;
  padding: 11px 12px;
  border-radius: 12px;
  border: 1px solid rgba(31, 45, 36, 0.2);
  background: var(--surface-strong);
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(31, 45, 36, 0.2);
  background: var(--surface-strong);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  border: 1px solid rgba(31, 45, 36, 0.2);
  background: var(--surface-strong);
  padding: 9px 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(ActionButton)`
  background: var(--brand);
  border-color: var(--brand);
  color: #ffffff;
`;

const HelperMessage = styled.p`
  color: var(--danger);
  font-size: 0.92rem;
`;

export const GalleryControls = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  selectedCount,
  estimatedSizeLabel,
  onSelectAll,
  onClearSelection,
  onDownloadSelected,
  disableSelectAll,
  disableClear,
  disableDownload,
  helperMessage,
}: GalleryControlsProps) => {
  return (
    <Wrapper>
      <Row>
        <Heading>Pet Gallery</Heading>
        <Stats>
          {selectedCount} selected • estimated size: {estimatedSizeLabel}
        </Stats>
      </Row>

      <Row>
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search title or description"
          aria-label="Search pets"
        />

        <Select
          value={sortOption}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          aria-label="Sort pets"
        >
          <option value="name-asc">Sort by Name A-Z</option>
          <option value="name-desc">Sort by Name Z-A</option>
          <option value="date-newest">Sort by Date (Newest First)</option>
          <option value="date-oldest">Sort by Date (Oldest First)</option>
        </Select>

        <ButtonGroup>
          <ActionButton onClick={onSelectAll} disabled={disableSelectAll}>
            Select All
          </ActionButton>
          <ActionButton onClick={onClearSelection} disabled={disableClear}>
            Clear Selection
          </ActionButton>
          <PrimaryButton onClick={onDownloadSelected} disabled={disableDownload}>
            Download Selected
          </PrimaryButton>
        </ButtonGroup>
      </Row>

      {helperMessage ? <HelperMessage>{helperMessage}</HelperMessage> : null}
    </Wrapper>
  );
};
