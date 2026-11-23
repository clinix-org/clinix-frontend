import api from '../api';

export interface ActiveIngredient {
  name: string;
  dosage: number;
  unitMeasurement: string;
}

export interface MedicationRequest {
  medicationName: string;
  activeIngredient: ActiveIngredient[];
  category: string;
  presentationFormat: string;
  manufacturer: string;
}

export interface Medication extends MedicationRequest {
  id: number;
  quantity: number;
  status: string;
  createdAt: string;
  createdBy: string;
}

export interface MedicationOption {
  value: string;
  label: string;
}

export interface MedicationOptions {
  units: MedicationOption[];
  categories: MedicationOption[];
  presentationFormats: MedicationOption[];
}

export const medicationService = {
  // The existing list orders creation dates ascending. Fetch the current total
  // after saving, instead of calculating from a possibly filtered/stale list.
  async getLastPageNumber(pageSize: number): Promise<number> {
    const { data } = await api.get<{ totalPages: number }>('/medications', {
      params: { pageNumber: 0, pageSize },
    });
    return Math.max(1, data.totalPages);
  },
  async getOptions(signal?: AbortSignal): Promise<MedicationOptions> {
    const { data } = await api.get<MedicationOptions>('/medications/options', {
      signal,
    });
    return data;
  },
  async create(request: MedicationRequest): Promise<Medication> {
    const { data } = await api.post<Medication>('/medications', request);
    return data;
  },
};
