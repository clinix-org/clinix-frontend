import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/reducers/store';
import { fetchMedicamentos } from '../../store/actions';

interface MedicamentoFilter {
  pageNumber: number;
  pageSize: number;
  search: string;
  refreshKey?: number;
}

export const useMedicamentoFilter = ({
  pageNumber,
  pageSize,
  search,
  refreshKey = 0,
}: MedicamentoFilter): void => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      search: search.trim(),
      pageSize: String(pageSize),
      pageNumber: String(pageNumber - 1),
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });
    void dispatch(fetchMedicamentos(params.toString(), controller.signal));
    return () => controller.abort();
  }, [dispatch, search, pageNumber, pageSize, refreshKey]);
};

export default useMedicamentoFilter;
