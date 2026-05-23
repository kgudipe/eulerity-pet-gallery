import styled from 'styled-components';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const PageButton = styled.button`
  border: 1px solid rgba(31, 45, 36, 0.2);
  background: var(--surface-strong);
  color: var(--text-main);
  border-radius: 999px;
  padding: 7px 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Current = styled.span`
  font-weight: 600;
  padding: 0 8px;
`;

export const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
  return (
    <Wrapper>
      <PageButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        First
      </PageButton>
      <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </PageButton>
      <Current>
        Page {currentPage} of {totalPages}
      </Current>
      <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </PageButton>
      <PageButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        Last
      </PageButton>
    </Wrapper>
  );
};
