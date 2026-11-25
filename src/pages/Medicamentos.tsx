import { type ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/reducers/store';
import { Plus } from 'lucide-react';
import { DataPageToolbar } from '../components/DataPageToolbar';
import { PageSurface } from '../components/PageSurface';
import { PaginationBar } from '../components/PaginationBar';
import { useMedicamentoFilter } from '../components/hooks/useMedicamentoFilter';
import { OutlinePill, StatusPill } from '../components/StatusPill';

import { isCancel } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';
import { MedicationDialog } from '../components/MedicationDialog';
import { SuccessToast } from '../components/SuccessToast';
import {
  medicationService,
  type MedicationOptions,
} from '../services/medicationService';

const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export const Medicamentos = () => {
  const { hasRole } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [options, setOptions] = useState<MedicationOptions | null>(null);
  const [optionsError, setOptionsError] = useState('');
  const [optionsRetry, setOptionsRetry] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    medicationService
      .getOptions(controller.signal)
      .then(value => {
        if (!controller.signal.aborted) {
          setOptions(value);
          setOptionsError('');
        }
      })
      .catch((failure: unknown) => {
        if (!isCancel(failure) && !controller.signal.aborted) {
          setOptionsError('Não foi possível carregar as opções de cadastro.');
        }
      });
    return () => controller.abort();
  }, [optionsRetry]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const { medicamentos, pagination, isLoading, error } = useSelector(
    (state: RootState) => state.medicamento,
  );

  useMedicamentoFilter({
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    search: searchTerm,
    refreshKey,
  });

  const totalPages = Math.max(pagination.totalPages, 1);
  const handleItemsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <PageSurface testId='medications-page'>
      <DataPageToolbar
        testIdPrefix='medications'
        searchValue={searchTerm}
        onSearchChange={value => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        searchPlaceholder='Pesquisar por código, categoria ou descrição'
        searchPlaceholderContent={
          <>
            Pesquisar por <b>código</b>, <b>categoria</b> ou <b>descrição</b>
          </>
        }
        action={
          hasRole('ADMIN') ? (
            <button
              type='button'
              data-testid='medications-create-button'
              onClick={() => setIsCreateOpen(true)}
              disabled={!options}
              className='flex h-10 items-center gap-2 rounded-lg bg-[#0cad69] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0a8c55] disabled:opacity-50'
            >
              <Plus className='size-4' />
              Novo Medicamento
            </button>
          ) : undefined
        }
      />

      {optionsError && (
        <div
          role='alert'
          data-testid='medications-options-error'
          className='flex items-center gap-3 px-6 py-3 text-sm text-red-700'
        >
          {optionsError}
          <button
            type='button'
            className='underline'
            data-testid='medications-options-retry-button'
            onClick={() => setOptionsRetry(value => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}
      <div className='min-h-0 flex-1 overflow-x-auto'>
        <table
          data-testid='medications-table'
          data-state={isLoading ? 'loading' : error ? 'error' : medicamentos.length ? 'ready' : 'empty'}
          className='w-full min-w-[900px] text-left text-[13px]'>
          <thead data-testid='medications-table-head' className='border-y border-[#eaebed] bg-white text-[12px] font-semibold text-[#5f666d]'>
            <tr>
              <th data-testid='medications-column-name' className='px-6 py-4'>Medicamento</th>
              <th data-testid='medications-column-category' className='px-5 py-4'>Categoria</th>
              <th data-testid='medications-column-dosage' className='px-5 py-4'>Dosagem / Unidade</th>
              <th data-testid='medications-column-quantity' className='px-5 py-4'>Quantidade</th>
              <th data-testid='medications-column-status' className='px-5 py-4'>Status</th>
            </tr>
          </thead>
          <tbody data-testid='medications-table-body' className='divide-y divide-[#eaebed]'>
            {!isLoading &&
              !error &&
              medicamentos.map(medicamento => (
                <tr
                  key={medicamento.id}
                  data-testid={`medications-row-${medicamento.id}`}
                  data-medication-id={medicamento.id}
                  className='h-[58px] text-[#646b72] transition-colors hover:bg-[#fafafa]'
                >
                  <td className='px-6 py-3 font-medium text-[#646b72]'>
                    <span data-testid='medications-cell-name'>{medicamento.medicationName}</span>
                    <span data-testid='medications-cell-composition' className='mt-1 block text-xs font-normal text-[#82878c]'>
                      {medicamento.activeIngredient
                        .map(item => item.name)
                        .join(' + ')}
                    </span>
                  </td>
                  <td data-testid='medications-cell-category' className='px-5 py-3'>
                    <OutlinePill>
                      {options?.categories.find(
                        item => item.value === medicamento.category,
                      )?.label ?? medicamento.category}
                    </OutlinePill>
                  </td>
                  <td data-testid='medications-cell-dosage' className='px-5 py-3'>
                    {medicamento.activeIngredient
                      .map(
                        item =>
                          `${item.dosage.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} ${item.unitMeasurement}`,
                      )
                      .join(' + ')}
                  </td>
                  <td data-testid='medications-cell-quantity' className='px-5 py-3'>{medicamento.quantity}</td>
                  <td data-testid='medications-cell-status' className='px-5 py-3'>
                    <StatusPill
                      tone={
                        medicamento.status === 'AVAILABLE'
                          ? 'success'
                          : 'warning'
                      }
                      minWidthClassName='min-w-[108px]'
                    >
                      {medicamento.status === 'AVAILABLE'
                        ? 'Disponível'
                        : 'Indisponível'}
                    </StatusPill>
                  </td>
                </tr>
              ))}

            {isLoading && (
              <tr>
                <td
                  className='px-5 py-10 text-center text-[#82878c]'
                  colSpan={5}
                >
                  <span data-testid='medications-loading'>Carregando medicamentos...</span>
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td className='px-5 py-10 text-center text-red-600' colSpan={5}>
                  <span data-testid='medications-list-error'>{error}</span>
                </td>
              </tr>
            )}
            {!isLoading && !error && medicamentos.length === 0 && (
              <tr>
                <td
                  className='px-5 py-10 text-center text-[#82878c]'
                  colSpan={5}
                >
                  <span data-testid='medications-empty-state'>Nenhum medicamento encontrado.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        testIdPrefix='medications'
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        totalItems={pagination.totalElements}
        totalPages={totalPages}
        onItemsPerPageChange={handleItemsPerPageChange}
        onNextPage={() =>
          setCurrentPage(page => Math.min(totalPages, page + 1))
        }
        onPageClick={setCurrentPage}
        onPreviousPage={() => setCurrentPage(page => Math.max(1, page - 1))}
      />
      {isCreateOpen && options && hasRole('ADMIN') && (
        <MedicationDialog
          options={options}
          onClose={() => setIsCreateOpen(false)}
          onCreated={async medication => {
            const presentation = options.presentationFormats.find(
              option => option.value === medication.presentationFormat,
            )?.label ?? medication.presentationFormat;
            const dosage = medication.activeIngredient
              .map(
                ingredient =>
                  `${ingredient.dosage.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} ${ingredient.unitMeasurement}`,
              )
              .join(' + ');
            setIsCreateOpen(false);
            setSearchTerm('');
            toast(SuccessToast, {
              data: {
                message: (
                  <>
                    Medicamento{' '}
                    <strong>
                      {medication.medicationName} ({presentation.toLocaleLowerCase('pt-BR')}, {dosage})
                    </strong>{' '}
                    cadastrado com sucesso.
                  </>
                ),
                testId: 'medications-success-toast',
              },
              position: 'bottom-right',
              autoClose: 5000,
              hideProgressBar: true,
              closeButton: false,
              closeOnClick: false,
              pauseOnHover: true,
              pauseOnFocusLoss: true,
              role: 'status',
              style: {
                padding: 0,
                width: '100%',
                minHeight: 0,
                background: 'transparent',
                boxShadow: 'none',
                borderRadius: 6,
              },
            });
            try {
              const lastPage = await medicationService.getLastPageNumber(itemsPerPage);
              setCurrentPage(lastPage);
            } catch {
              setCurrentPage(1);
              toast.warn(
                <span data-testid='medications-page-location-warning'>
                  Medicamento cadastrado, mas não foi possível localizar a página. Atualize a listagem.
                </span>,
              );
            } finally {
              setRefreshKey(value => value + 1);
            }
          }}
        />
      )}
      <ToastContainer
        position='bottom-right'
        style={{ width: 'min(520px, calc(100vw - 32px))' }}
      />
    </PageSurface>
  );
};
