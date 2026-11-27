import type { UnknownAction } from '@reduxjs/toolkit';
import type { Medicamento } from '../actions';

export interface MedicamentoPagination {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export interface MedicamentoState {
  medicamentos: Medicamento[];
  pagination: MedicamentoPagination;
  isLoading: boolean;
  error: string | null;
}

interface PaginationResponse {
  content: Medicamento[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
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
      const response = action.payload as PaginationResponse | null;
      const content = response?.content;

      if (!response || !Array.isArray(content)) {
        return {
          ...state,
          isLoading: false,
          error: 'Formato da resposta da API inválido.',
        };
      }

      return {
        ...state,
        medicamentos: content,
        pagination: {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          lastPage: response.lastPage,
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
