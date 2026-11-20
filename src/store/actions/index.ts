import type { UnknownAction, ThunkAction } from '@reduxjs/toolkit';
import { isAxiosError, isCancel } from 'axios';
import api from '../../api';
import type { RootState } from '../reducers/store';
import type { Medication } from '../../services/medicationService';

export type Medicamento = Medication;

interface PaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

type AppThunk<Return = void> = ThunkAction<
  Return, RootState, unknown, UnknownAction
>;

export const fetchMedicamentos = (
  queryString: string,
  signal?: AbortSignal,
): AppThunk => async dispatch => {
  dispatch({ type: 'MEDICAMENTOS_FETCH_START' });
  try {
    const { data } = await api.get<PaginationResponse<Medication>>(
      `/medications?${queryString}`, { signal },
    );
    if (!signal?.aborted) {
      dispatch({ type: 'FETCH_MEDICAMENTOS', payload: data });
    }
  } catch (error: unknown) {
    if (isCancel(error) || signal?.aborted) return;
    const message = isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message : undefined;
    dispatch({
      type: 'MEDICAMENTOS_FETCH_ERROR',
      payload: message ?? 'Não foi possível carregar os medicamentos.',
    });
  }
};
