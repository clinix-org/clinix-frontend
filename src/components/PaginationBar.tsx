import type { ChangeEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationBarProps = {
  currentPage: number;
  itemsPerPage: number;
  itemsPerPageOptions: number[];
  totalItems: number;
  totalPages: number;
  onItemsPerPageChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onNextPage: () => void;
  onPageClick: (page: number) => void;
  onPreviousPage: () => void;
};

const getVisiblePageNumbers = (currentPage: number, totalPages: number) =>
  Array.from({ length: totalPages }, (_, index) => index + 1).filter(page => {
    const isEdgePage = page === 1 || page === totalPages;
    const isNearCurrentPage = Math.abs(page - currentPage) <= 1;

    return isEdgePage || isNearCurrentPage;
  });

export const PaginationBar = ({
  currentPage,
  itemsPerPage,
  itemsPerPageOptions,
  totalItems,
  totalPages,
  onItemsPerPageChange,
  onNextPage,
  onPageClick,
  onPreviousPage,
}: PaginationBarProps) => {
  const visiblePageNumbers = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <div className='flex flex-col gap-4 px-6 py-5 text-[12px] text-[#646b72] lg:flex-row lg:items-center lg:justify-between'>
      <label className='flex flex-wrap items-center gap-2 italic'>
        <span>Mostrando</span>
        <select
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          className='h-8 rounded-lg border border-[#cfd3d6] bg-white px-3 text-[12px] font-medium not-italic text-[#646b72] outline-none transition-colors focus:border-[#0cad69]'
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>de {totalItems} resultados.</span>
      </label>

      <div className='flex flex-wrap items-center gap-3'>
        <button
          type='button'
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className='flex items-center gap-2 rounded-lg px-2 py-2 font-medium italic text-[#82878c] transition-colors hover:text-[#0cad69] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[#82878c]'
        >
          <ChevronLeft className='size-3.5' />
        </button>

        {visiblePageNumbers.map((page, index) => (
          <div key={page} className='flex items-center gap-3'>
            {index > 0 && page - visiblePageNumbers[index - 1] > 1 && (
              <span className='text-[#82878c]'>...</span>
            )}

            <button
              type='button'
              onClick={() => onPageClick(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`size-9 rounded-lg text-[12px] font-semibold transition-colors ${
                currentPage === page
                  ? 'bg-[#dff8ed] text-[#0cad69]'
                  : 'text-[#82878c] hover:bg-[#f4f4f4] hover:text-[#0cad69]'
              }`}
            >
              {page}
            </button>
          </div>
        ))}

        <button
          type='button'
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className='flex items-center gap-2 rounded-lg px-2 py-2 font-medium italic text-[#82878c] transition-colors hover:text-[#0cad69] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[#82878c]'
        >
          <ChevronRight className='size-3.5' />
        </button>
      </div>
    </div>
  );
};
