import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Filter, Search } from 'lucide-react';

type DataPageToolbarProps = {
  searchValue?: string;
  searchPlaceholder: string;
  onSearchChange?: (value: string) => void;
  action?: ReactNode;
  info?: ReactNode;
  filterContent?: ReactNode;
  isFilterActive?: boolean;
  filterLabel?: string;
};

export const DataPageToolbar = ({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  action,
  info,
  filterContent,
  isFilterActive = false,
  filterLabel = 'Filtrar',
}: DataPageToolbarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isFilterOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const container = filterContainerRef.current;

      if (!container || container.contains(event.target as Node)) return;

      setIsFilterOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isFilterOpen]);

  return (
    <div className='flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between'>
      <div className='flex w-full items-center gap-3 md:max-w-[600px]'>
        <label className='flex h-10 flex-1 items-center gap-3 rounded-lg border border-[#eaebed] bg-[#fafafa] px-4 text-[#82878c] transition-colors focus-within:border-[#0cad69]'>
          <Search className='size-4' />
          <input
            type='search'
            value={searchValue}
            onChange={event => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            className='w-full bg-transparent text-[13px] text-[#5f666d] outline-none placeholder:text-[#646b72]'
          />
        </label>

        <div ref={filterContainerRef} className='relative shrink-0'>
          <button
            type='button'
            onClick={() => filterContent && setIsFilterOpen(isOpen => !isOpen)}
            className={`flex size-10 items-center justify-center rounded-lg border transition-colors hover:border-[#0cad69] hover:text-[#0cad69] ${
              isFilterActive || isFilterOpen
                ? 'border-[#0cad69] bg-[#e8f9f2] text-[#0cad69]'
                : 'border-[#eaebed] text-[#82878c]'
            }`}
            aria-expanded={filterContent ? isFilterOpen : undefined}
            aria-label={filterLabel}
            title={filterLabel}
          >
            <Filter className='size-4' />
          </button>

          {filterContent && isFilterOpen && (
            <div className='absolute right-0 top-12 z-20 w-[280px] rounded-lg border border-[#eaebed] bg-white shadow-[0_12px_30px_rgba(31,41,55,0.12)]'>
              {filterContent}
            </div>
          )}
        </div>
      </div>

      {(action || info) && (
        <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
          {info}
          {action}
        </div>
      )}
    </div>
  );
};
