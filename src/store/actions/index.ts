import type { UnknownAction } from '@reduxjs/toolkit';
import type { ThunkAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import api from '../../api';
import type { RootState } from '../reducers/store.ts';

export interface Medicamento {
  id: number;
  nomeComercial: string;
  nomeGenerico: string;
  quantidade: number;
  categoria: string;
  unidadeMedida: string;
  status: string;
}

interface PaginationResponse<T> {
  content?: T[];
  medicamentos?: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
  timeStamp?: string;
  timestamp?: string;
}

type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  unknown,
  UnknownAction
>;

export const fetchMedicamentos = (queryString: string): AppThunk => async dispatch => {
  dispatch({ type: 'MEDICAMENTOS_FETCH_START' });

  console.log(queryString);

  try {
    const { data } = await api.get<PaginationResponse<Medicamento>>(
      `/medicamentos/nomecomercial?${queryString}`,
    );

      console.log(data);

    dispatch({ type: 'FETCH_MEDICAMENTOS', payload: data });
  } catch (error: unknown) {
    const message = isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message
      : undefined;
    dispatch({

      type: 'MEDICAMENTOS_FETCH_ERROR',
      payload:
        typeof message === 'string'
          ? message
          : 'Não foi possível carregar os medicamentos.',
    });
  }
};
