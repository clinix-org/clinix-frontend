import type { UnknownAction } from '@reduxjs/toolkit';
import type { Medicamento } from '../actions';

export interface MedicamentoPagination {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
  timeStamp?: string;
}

export interface MedicamentoState {
  medicamentos: Medicamento[];
  pagination: MedicamentoPagination;
  isLoading: boolean;
  error: string | null;
}

interface PaginationResponse {
  content?: Medicamento[];
  medicamentos?: Medicamento[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
  timeStamp?: string;
  timestamp?: string;
}

const initialState: MedicamentoState = {
  medicamentos: [],
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    lastPage: true,
  },
  isLoading: false,
  error: null,
};

export const medicamentoReducer = (
  state: MedicamentoState = initialState,
  action: UnknownAction,
): MedicamentoState => {
  switch (action.type) {
    case 'MEDICAMENTOS_FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_MEDICAMENTOS': {
      const payload = action.payload;
      const response = payload as PaginationResponse | Medicamento[] | null;
      const content = Array.isArray(response)
        ? response
        : response && Array.isArray(response.medicamentos)
          ? response.medicamentos
          : response && Array.isArray(response.content)
            ? response.content
          : null;

      if (!content) {
        return {
          ...state,
          isLoading: false,
          error: 'Format da resposta da API inválido.',
        };
      }

      const pagination = Array.isArray(response) ? null : response;

      return {
        ...state,
        medicamentos: content,
        pagination: {
          pageNumber: pagination?.pageNumber ?? 1,
          pageSize: pagination?.pageSize ?? content.length,
          totalElements: pagination?.totalElements ?? content.length,
          totalPages: pagination?.totalPages ?? (content.length > 0 ? 1 : 0),
          lastPage: pagination?.lastPage ?? true,
          timeStamp: pagination?.timeStamp ?? pagination?.timestamp,
        },
        isLoading: false,
        error: null,
      };
    }
    case 'MEDICAMENTOS_FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error:
          typeof action.payload === 'string'
            ? action.payload
            : 'Não foi possível carregar os medicamentos.',
      };
    default:
      return state;
  }
};
