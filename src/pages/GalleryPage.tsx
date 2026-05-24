import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { GalleryControls } from '../components/GalleryControls';
import { PaginationControls } from '../components/PaginationControls';
import { PetCard } from '../components/PetCard';
import { useDownloadManagerContext } from '../context/DownloadManagerContext';
import { usePets } from '../context/PetsContext';
import { useSelection } from '../context/SelectionContext';
import type { SortOption } from '../types';
import { formatBytes } from '../utils/format';

const PAGE_SIZE = 12;

const PageStack = styled.div`
  display: grid;
  gap: 18px;
`;

const GalleryGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StateCard = styled.section`
  background: var(--surface);
  border: 1px solid rgba(31, 45, 36, 0.12);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 24px;
  display: grid;
  gap: 10px;
  text-align: center;
`;

const InlineButton = styled.button`
  justify-self: center;
  border: 1px solid rgba(31, 45, 36, 0.25);
  border-radius: 10px;
  background: var(--surface-strong);
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
`;

const getDateValue = (dateString: string): number => {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

export const GalleryPage = () => {
  const { pets, petsById, status, error, refetch } = usePets();
  const {
    selectedIds,
    selectedCount,
    estimatedTotalBytes,
    unknownSizeCount,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  } = useSelection();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date-newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMessage, setActionMessage] = useState('');
  const {
    isZipRunning,
    zipStatusMessage,
    enqueueDownloads,
    downloadAsZip,
    openPanel,
  } = useDownloadManagerContext();

  const filteredPets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return pets;
    }

    return pets.filter((pet) => {
      return (
        pet.title.toLowerCase().includes(normalizedQuery) ||
        pet.description.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [pets, searchQuery]);

  const sortedPets = useMemo(() => {
    const cloned = [...filteredPets];

    switch (sortOption) {
      case 'name-asc':
        cloned.sort((left, right) => left.title.localeCompare(right.title));
        break;
      case 'name-desc':
        cloned.sort((left, right) => right.title.localeCompare(left.title));
        break;
      case 'date-oldest':
        cloned.sort((left, right) => getDateValue(left.createdAt) - getDateValue(right.createdAt));
        break;
      case 'date-newest':
      default:
        cloned.sort((left, right) => getDateValue(right.createdAt) - getDateValue(left.createdAt));
    }

    return cloned;
  }, [filteredPets, sortOption]);

  const totalPages = Math.max(1, Math.ceil(sortedPets.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const currentPagePets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedPets.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedPets]);

  const estimatedSizeLabel = useMemo(() => {
    if (unknownSizeCount > 0) {
      return `${formatBytes(estimatedTotalBytes)} + ${unknownSizeCount} unknown`;
    }

    return formatBytes(estimatedTotalBytes);
  }, [estimatedTotalBytes, unknownSizeCount]);

  const handleSelectAll = () => {
    selectAll(sortedPets.map((pet) => pet.id));
  };

  const selectedPets = useMemo(() => {
    return selectedIds
      .map((id) => petsById[id])
      .filter((pet): pet is NonNullable<typeof pet> => Boolean(pet));
  }, [selectedIds, petsById]);

  const handleDownloadSelected = () => {
    if (selectedPets.length === 0) {
      return;
    }

    enqueueDownloads(selectedPets);
    openPanel();
    setActionMessage(`Queued ${selectedPets.length} selected image(s) for download.`);
  };

  const handleDownloadAsZip = () => {
    openPanel();
    void downloadAsZip(selectedPets);
  };

  if (status === 'loading') {
    return (
      <StateCard>
        <h2>Loading pets...</h2>
        <p>Fetching gallery data from the API.</p>
      </StateCard>
    );
  }

  if (status === 'error') {
    return (
      <StateCard>
        <h2>Unable to load pets</h2>
        <p>{error ?? 'Unexpected error while fetching /pets.'}</p>
        <InlineButton onClick={refetch}>Try again</InlineButton>
      </StateCard>
    );
  }

  if (status === 'empty') {
    return (
      <StateCard>
        <h2>No pets found</h2>
        <p>The API returned an empty list.</p>
        <InlineButton onClick={refetch}>Reload</InlineButton>
      </StateCard>
    );
  }

  return (
    <PageStack>
      <GalleryControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        selectedCount={selectedCount}
        estimatedSizeLabel={estimatedSizeLabel}
        onSelectAll={handleSelectAll}
        onClearSelection={clearSelection}
        onDownloadSelected={handleDownloadSelected}
        onDownloadAsZip={handleDownloadAsZip}
        disableSelectAll={sortedPets.length === 0}
        disableClear={selectedCount === 0}
        disableDownload={selectedCount === 0}
        disableZipDownload={selectedCount === 0 || isZipRunning}
        helperMessage={zipStatusMessage || actionMessage}
      />

      {currentPagePets.length === 0 ? (
        <StateCard>
          <h2>No matches</h2>
          <p>Adjust your search text to see more results.</p>
          {searchQuery ? <InlineButton onClick={() => setSearchQuery('')}>Clear Search</InlineButton> : null}
        </StateCard>
      ) : (
        <>
          <GalleryGrid>
            {currentPagePets.map((pet) => (
              <PetCard key={pet.id} pet={pet} selected={isSelected(pet.id)} onToggle={toggleSelection} />
            ))}
          </GalleryGrid>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (page < 1 || page > totalPages) {
                return;
              }

              setCurrentPage(page);
            }}
          />
        </>
      )}
    </PageStack>
  );
};
