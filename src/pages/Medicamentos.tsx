import { type ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/reducers/store';
import { Plus } from 'lucide-react';
import { DataPageToolbar } from '../components/DataPageToolbar';
import { PageSurface } from '../components/PageSurface';
import { PaginationBar } from '../components/PaginationBar';
import { useMedicamentoFilter } from '../components/hooks/useMedicamentoFilter';
import { OutlinePill, StatusPill } from '../components/StatusPill';

const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export const Medicamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const { medicamentos, pagination, isLoading, error } = useSelector(
    (state: RootState) => state.medicamento,
  );

  console.log(medicamentos)

  useMedicamentoFilter({
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    nomeComercial: searchTerm,
  });

  const totalPages = Math.max(pagination.totalPages, 1);
  const handleItemsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <PageSurface>
      <DataPageToolbar
        searchValue={searchTerm}
        onSearchChange={value => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        searchPlaceholder='Pesquisar por nome comercial'
        action={
          <button
            type='button'
            className='flex h-10 items-center gap-2 rounded-lg bg-[#0cad69] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0a8c55]'
          >
            <Plus className='size-4' />
            Novo medicamento
          </button>
        }
      />

      <div className='min-h-0 flex-1 overflow-x-auto'>
        <table className='w-full min-w-[900px] text-left text-[13px]'>
          <thead className='border-y border-[#eaebed] bg-white text-[12px] font-semibold text-[#5f666d]'>
            <tr>
              <th className='px-6 py-4'>Medicamento</th>
              <th className='px-5 py-4'>Categoria</th>
              <th className='px-5 py-4'>Unidade</th>
              <th className='px-5 py-4'>Quantidade</th>
              <th className='px-5 py-4'>Status</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#eaebed]'>
            {medicamentos.map(medicamento => (
              <tr
                key={medicamento.id}
                className='h-[58px] text-[#646b72] transition-colors hover:bg-[#fafafa]'
              >
                <td className='px-6 py-3 font-medium text-[#646b72]'>
                  <span>{medicamento.nomeComercial}</span>
                  <span className='mt-1 block text-xs font-normal text-[#82878c]'>
                    {medicamento.nomeGenerico}
                  </span>
                </td>
                <td className='px-5 py-3'>
                  <OutlinePill>{medicamento.categoria}</OutlinePill>
                </td>
                <td className='px-5 py-3'>{medicamento.unidadeMedida}</td>
                <td className='px-5 py-3'>{medicamento.quantidade}</td>
                <td className='px-5 py-3'>
                  <StatusPill
                    tone={
                      medicamento.status.toLowerCase() === 'disponivel'
                        ? 'success'
                        : 'warning'
                    }
                    minWidthClassName='min-w-[108px]'
                  >
                    {medicamento.status}
                  </StatusPill>
                </td>
              </tr>
            ))}

            {isLoading && (
              <tr>
                <td className='px-5 py-10 text-center text-[#82878c]' colSpan={5}>
                  Carregando medicamentos...
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td className='px-5 py-10 text-center text-red-600' colSpan={5}>
                  {error}
                </td>
              </tr>
            )}
            {!isLoading && !error && medicamentos.length === 0 && (
              <tr>
                <td className='px-5 py-10 text-center text-[#82878c]' colSpan={5}>
                  Nenhum medicamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        totalItems={pagination.totalElements}
        totalPages={totalPages}
        onItemsPerPageChange={handleItemsPerPageChange}
        onNextPage={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
        onPageClick={setCurrentPage}
        onPreviousPage={() => setCurrentPage(page => Math.max(1, page - 1))}
      />
    </PageSurface>
  );
};