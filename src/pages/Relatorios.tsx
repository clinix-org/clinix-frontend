import { type ChangeEvent, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { DataPageToolbar } from '../components/DataPageToolbar';
import { PageSurface } from '../components/PageSurface';
import { PaginationBar } from '../components/PaginationBar';
import { StatusPill } from '../components/StatusPill';

type Report = {
  id: number;
  title: string;
  period: string;
  owner: string;
  status: 'Atualizado' | 'Em analise';
};

const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const reports: Report[] = [
  {
    id: 1,
    title: 'Movimentacao de estoque',
    period: 'Ultimos 30 dias',
    owner: 'Farmacia',
    status: 'Atualizado',
  },
  {
    id: 2,
    title: 'Usuarios ativos',
    period: 'Mes atual',
    owner: 'Administracao',
    status: 'Atualizado',
  },
  {
    id: 3,
    title: 'Solicitacoes pendentes',
    period: 'Semana atual',
    owner: 'Operacoes',
    status: 'Em analise',
  },
  {
    id: 4,
    title: 'Ruptura de medicamentos',
    period: 'Ultimos 7 dias',
    owner: 'Estoque',
    status: 'Atualizado',
  },
];

export const Relatorios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const filteredReports = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return reports;

    return reports.filter(report =>
      [report.title, report.period, report.owner, report.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredReports.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredReports, itemsPerPage]);

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
        searchPlaceholder='Pesquisar relatorios'
        action={
          <button
            type='button'
            className='flex h-10 items-center gap-2 rounded-lg border border-[#0cad69] px-4 text-[13px] font-semibold text-[#0cad69] transition-colors hover:bg-[#e8f9f2]'
          >
            <Download className='size-4' />
            Exportar
          </button>
        }
      />

      <div className='grid gap-4 border-y border-[#eaebed] px-6 py-5 md:grid-cols-4'>
        {[
          ['Solicitacoes', '248'],
          ['Atendidas', '221'],
          ['Pendentes', '27'],
          ['Tempo medio', '18 min'],
        ].map(([label, value]) => (
          <div key={label} className='rounded-lg border border-[#eaebed] p-4'>
            <p className='text-[12px] font-medium text-[#82878c]'>{label}</p>
            <strong className='mt-2 block text-2xl font-semibold text-[#3f454a]'>
              {value}
            </strong>
          </div>
        ))}
      </div>

      <div className='min-h-0 flex-1 overflow-x-auto'>
        <table className='w-full min-w-[900px] text-left text-[13px]'>
          <thead className='border-b border-[#eaebed] bg-white text-[12px] font-semibold text-[#5f666d]'>
            <tr>
              <th className='px-6 py-4'>Relatorio</th>
              <th className='px-5 py-4'>Periodo</th>
              <th className='px-5 py-4'>Area</th>
              <th className='px-5 py-4'>Status</th>
              <th className='w-[110px] px-5 py-4'>Acoes</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#eaebed]'>
            {paginatedReports.map(report => (
              <tr
                key={report.id}
                className='h-[58px] text-[#646b72] transition-colors hover:bg-[#fafafa]'
              >
                <td className='px-6 py-3 font-medium text-[#646b72]'>
                  {report.title}
                </td>
                <td className='px-5 py-3'>{report.period}</td>
                <td className='px-5 py-3'>{report.owner}</td>
                <td className='px-5 py-3'>
                  <StatusPill
                    tone={report.status === 'Atualizado' ? 'success' : 'warning'}
                    minWidthClassName='min-w-[96px]'
                  >
                    {report.status}
                  </StatusPill>
                </td>
                <td className='px-5 py-3'>
                  <button
                    type='button'
                    className='font-semibold text-[#0cad69] transition-colors hover:text-[#0a8c55]'
                  >
                    Abrir
                  </button>
                </td>
              </tr>
            ))}

            {paginatedReports.length === 0 && (
              <tr>
                <td className='px-5 py-10 text-center text-[#82878c]' colSpan={5}>
                  Nenhum relatorio encontrado.
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
        totalItems={filteredReports.length}
        totalPages={totalPages}
        onItemsPerPageChange={handleItemsPerPageChange}
        onNextPage={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
        onPageClick={setCurrentPage}
        onPreviousPage={() => setCurrentPage(page => Math.max(1, page - 1))}
      />
    </PageSurface>
  );
};
