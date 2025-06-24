import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationTable: React.FC<PaginationProps> = React.memo(({ currentPage, totalPages, setCurrentPage }) => {
  const handlePreviousClick = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePreviousClick}
            className={isPrevDisabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          let pageToShow: number;
          if (totalPages <= 5) {
            pageToShow = i + 1;
          } else if (currentPage <= 3) {
            pageToShow = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageToShow = totalPages - 4 + i;
          } else {
            pageToShow = currentPage - 2 + i;
          }
          return (
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageClick(pageToShow)}
                isActive={currentPage === pageToShow}
              >
                {pageToShow}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <PaginationItem className='cursor-pointer'>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageClick(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            className={isNextDisabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
});

export default PaginationTable;
