import { type ChangeEvent, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { DataPageToolbar } from '../components/DataPageToolbar';
import { PageSurface } from '../components/PageSurface';
import { PaginationBar } from '../components/PaginationBar';
import { OutlinePill, StatusPill } from '../components/StatusPill';

type Medication = {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: 'Disponivel' | 'Estoque baixo';
};

const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const medications: Medication[] = [
  {
    id: 1,
    name: 'Dipirona 500mg',
    category: 'Analgesico',
    stock: 128,
    unit: 'Comprimidos',
    status: 'Disponivel',
  },
  {
    id: 2,
    name: 'Amoxicilina 875mg',
    category: 'Antibiotico',
    stock: 42,
    unit: 'Capsulas',
    status: 'Disponivel',
  },
  {
    id: 3,
    name: 'Losartana 50mg',
    category: 'Anti-hipertensivo',
    stock: 9,
    unit: 'Comprimidos',
    status: 'Estoque baixo',
  },
  {
    id: 4,
    name: 'Omeprazol 20mg',
    category: 'Gastrointestinal',
    stock: 67,
    unit: 'Capsulas',
    status: 'Disponivel',
  },
  {
    id: 5,
    name: 'Soro fisiologico 500ml',
    category: 'Solucao',
    stock: 14,
    unit: 'Frascos',
    status: 'Disponivel',
  },
  {
    id: 6,
    name: 'Ibuprofeno 600mg',
    category: 'Anti-inflamatorio',
    stock: 7,
    unit: 'Comprimidos',
    status: 'Estoque baixo',
  },
];

export const Medicamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const filteredMedications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return medications;

    return medications.filter(medication =>
      [medication.name, medication.category, medication.unit, medication.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMedications.length / itemsPerPage),
  );
  const paginatedMedications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredMedications.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredMedications, itemsPerPage]);

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
        searchPlaceholder='Pesquisar medicamentos'
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
            {paginatedMedications.map(medication => (
              <tr
                key={medication.id}
                className='h-[58px] text-[#646b72] transition-colors hover:bg-[#fafafa]'
              >
                <td className='px-6 py-3 font-medium text-[#646b72]'>
                  {medication.name}
                </td>
                <td className='px-5 py-3'>
                  <OutlinePill>{medication.category}</OutlinePill>
                </td>
                <td className='px-5 py-3'>{medication.unit}</td>
                <td className='px-5 py-3'>{medication.stock}</td>
                <td className='px-5 py-3'>
                  <StatusPill
                    tone={
                      medication.status === 'Disponivel' ? 'success' : 'warning'
                    }
                    minWidthClassName='min-w-[108px]'
                  >
                    {medication.status}
                  </StatusPill>
                </td>
              </tr>
            ))}

            {paginatedMedications.length === 0 && (
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
        totalItems={filteredMedications.length}
        totalPages={totalPages}
        onItemsPerPageChange={handleItemsPerPageChange}
        onNextPage={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
        onPageClick={setCurrentPage}
        onPreviousPage={() => setCurrentPage(page => Math.max(1, page - 1))}
      />
    </PageSurface>
  );
};
