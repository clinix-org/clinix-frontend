import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/reducers/store';
import { fetchMedicamentos } from "../../store/actions";

interface MedicamentoFilter {
  pageNumber: number;
  pageSize: number;
  nomeComercial: string;
}

export const useMedicamentoFilter = ({
  pageNumber,
  pageSize,
  nomeComercial,
}: MedicamentoFilter): void => {
  const dispatch = useDispatch<AppDispatch>();

  console.log("pageNumber: " + pageNumber + ", pageSize: " + pageSize +", nomeComercial: " + nomeComercial)

  useEffect(() => {
    const params = new URLSearchParams({
      nomeComercial: nomeComercial.trim(),
      pageSize: String(pageSize),
      pageNumber: String(pageNumber - 1),
      sortBy: 'nomeComercial',
      sortOrder: 'asc',
    });

    void dispatch(fetchMedicamentos(params.toString()));
  }, [dispatch, nomeComercial, pageNumber, pageSize]);
};

export default useMedicamentoFilter;
