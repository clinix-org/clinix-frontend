import { useEffect, useRef, useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { parseMedicationDosage } from '../utils/medicationDosage';
import {
  medicationService,
  type MedicationOptions,
  type MedicationOption,
} from '../services/medicationService';

interface Props {
  options: MedicationOptions;
  onClose: () => void;
  onCreated: () => void;
}

interface IngredientRow {
  id: string;
  name: string;
  dosage: string;
  unitMeasurement: string;
}

const emptyIngredient = (): IngredientRow => ({
  id: crypto.randomUUID(),
  name: '',
  dosage: '',
  unitMeasurement: '',
});

const fieldClass =
  'min-h-[46px] w-full rounded-lg border-2 ' +
  'border-[#48524e33] px-3 py-2.5 text-sm font-medium ' +
  'placeholder:text-[#6e7d77] focus:outline-2 focus:outline-ui-button';
const labelClass = 'flex flex-col gap-2 text-sm font-bold text-black';

function OptionSelect({
  id,
  testId,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  testId: string;
  label: string;
  options: MedicationOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={labelClass} htmlFor={id}>
      <span>
        {label} <span className='text-[#b22936]'>*</span>
      </span>
      <span className='relative block'>
        <ChevronDown
          aria-hidden='true'
          className='pointer-events-none absolute left-3 top-[13px] size-5'
        />
        <select
          id={id}
          data-testid={testId}
          required
          value={value}
          onChange={event => onChange(event.target.value)}
          className={`${fieldClass} appearance-none border-transparent bg-[#48524e0d] pl-10 pr-3 text-[#48524e]`}
        >
          <option value='' disabled data-testid={`${testId}-placeholder`}>
            Selecione
          </option>
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              data-testid={`${testId}-option-${option.value}`}
            >
              {option.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

export const MedicationDialog = ({ options, onClose, onCreated }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const savingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [category, setCategory] = useState('');
  const [presentationFormat, setPresentationFormat] = useState('');
  const [ingredients, setIngredients] = useState<IngredientRow[]>(() => [
    emptyIngredient(),
  ]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const updateIngredient = (
    id: string,
    field: 'name' | 'dosage' | 'unitMeasurement',
    value: string,
  ) =>
    setIngredients(rows =>
      rows.map(row => (row.id === id ? { ...row, [field]: value } : row)),
    );

  const addIngredient = () => {
    const row = emptyIngredient();
    setIngredients(rows => [...rows, row]);
    requestAnimationFrame(() =>
      document.getElementById(`name-${row.id}`)?.focus(),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savingRef.current) return;
    const names = ingredients.map(row =>
      row.name.trim().replace(/\s+/g, ' ').toLowerCase(),
    );
    if (
      !medicationName.trim() ||
      !manufacturer.trim() ||
      ingredients.some(row => !row.name.trim())
    ) {
      setError('Preencha os campos obrigatórios sem usar apenas espaços.');
      return;
    }
    if (new Set(names).size !== names.length) {
      setError('Informe cada princípio ativo apenas uma vez.');
      return;
    }
    let dosages: number[];
    try {
      dosages = ingredients.map(row => parseMedicationDosage(row.dosage));
    } catch (failure: unknown) {
      setError(failure instanceof Error ? failure.message : 'Dosagem inválida.');
      return;
    }
    savingRef.current = true;
    setIsSaving(true);
    setError('');
    try {
      await medicationService.create({
        medicationName: medicationName.trim(),
        manufacturer: manufacturer.trim(),
        category,
        presentationFormat,
        activeIngredient: ingredients.map((row, index) => ({
          name: row.name.trim(),
          dosage: dosages[index],
          unitMeasurement: row.unitMeasurement,
        })),
      });
      onCreated();
    } catch (failure: unknown) {
      const response = isAxiosError<{
        message?: string;
        fields?: Record<string, string>;
      }>(failure)
        ? failure.response?.data
        : undefined;
      const details = response?.fields
        ? Object.values(response.fields).join(' ')
        : '';
      setError(
        [
          response?.message ?? 'Não foi possível cadastrar. Tente novamente.',
          details,
        ]
          .filter(Boolean)
          .join(' '),
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      data-testid='medications-create-dialog'
      aria-labelledby='medication-dialog-title'
      className='fixed inset-0 m-auto max-h-[calc(100dvh_-_32px)] w-[calc(100%_-_32px)] max-w-[890px] overflow-y-auto rounded-lg bg-white p-0 text-[#001820] backdrop:bg-black/40'
      onCancel={event => {
        event.preventDefault();
        if (!savingRef.current) onClose();
      }}
    >
      <h2
        id='medication-dialog-title'
        data-testid='medications-dialog-title'
        className='border-b-2 border-ui-border px-6 py-3 text-center text-xl font-bold'
      >
        Novo medicamento
      </h2>
      <form
        onSubmit={handleSubmit}
        data-testid='medications-create-form'
        data-state={isSaving ? 'saving' : 'idle'}
        data-ingredient-count={ingredients.length}
        className='flex flex-col gap-6 p-6'
      >
        <fieldset
          disabled={isSaving}
          data-testid='medications-create-fields'
          className='flex min-w-0 flex-col gap-6 disabled:opacity-70'
        >
          <label htmlFor='medication-name' className={labelClass}>
            <span>
              Nome do medicamento <span className='text-[#b22936]'>*</span>
            </span>
            <input
              id='medication-name'
              data-testid='medications-name-input'
              autoFocus
              required
              maxLength={200}
              value={medicationName}
              onChange={event => setMedicationName(event.target.value)}
              placeholder='Nome comercial do medicamento'
              className={fieldClass}
            />
          </label>
          {ingredients.map((row, index) => (
            <div
              key={row.id}
              data-testid='medications-ingredient-row'
              data-ingredient-key={row.id}
              className='grid items-end gap-3 rounded-lg max-sm:border max-sm:border-ui-border max-sm:p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_46px]'
            >
              <label htmlFor={`name-${row.id}`} className={labelClass}>
                <span>
                  Princípio ativo <span className='text-[#b22936]'>*</span>
                  {index > 0 && (
                    <span className='ml-1 text-xs font-normal'>
                      ({index + 1})
                    </span>
                  )}
                </span>
                <input
                  id={`name-${row.id}`}
                  data-testid='medications-ingredient-name-input'
                  required
                  maxLength={200}
                  value={row.name}
                  onChange={event =>
                    updateIngredient(row.id, 'name', event.target.value)
                  }
                  placeholder='Princípio ativo do medicamento'
                  className={fieldClass}
                />
              </label>
              <label htmlFor={`dosage-${row.id}`} className={labelClass}>
                <span>
                  Dosagem <span className='text-[#b22936]'>*</span>
                </span>
                <input
                  id={`dosage-${row.id}`}
                  data-testid='medications-ingredient-dosage-input'
                  type='number'
                  inputMode='decimal'
                  required
                  min='0.000001'
                  max='999999999999.999999'
                  step='0.000001'
                  value={row.dosage}
                  onChange={event =>
                    updateIngredient(row.id, 'dosage', event.target.value)
                  }
                  placeholder='0000'
                  className={fieldClass}
                />
              </label>
              <OptionSelect
                id={`unit-${row.id}`}
                testId='medications-ingredient-unit-select'
                label='Unidade de medida'
                options={options.units}
                value={row.unitMeasurement}
                onChange={value =>
                  updateIngredient(row.id, 'unitMeasurement', value)
                }
              />
              {index === 0 ? (
                <Button
                  type='button'
                  variant='secondary'
                  disabled={ingredients.length >= 30}
                  onClick={addIngredient}
                  aria-label='Adicionar princípio ativo'
                  data-testid='medications-add-ingredient-button'
                  className='h-[46px] w-[46px] bg-[#48524e0d] p-3'
                >
                  <Plus aria-hidden='true' className='size-5' />
                </Button>
              ) : (
                <Button
                  type='button'
                  variant='destructive'
                  aria-label={`Remover princípio ativo ${index + 1}`}
                  data-testid='medications-remove-ingredient-button'
                  onClick={() =>
                    setIngredients(rows =>
                      rows.filter(item => item.id !== row.id),
                    )
                  }
                  className='h-[46px] w-[46px]'
                >
                  <Trash2 aria-hidden='true' className='size-5' />
                </Button>
              )}
            </div>
          ))}
          <div className='grid gap-6 sm:grid-cols-2'>
            <OptionSelect
              id='medication-category'
              testId='medications-category-select'
              label='Categoria'
              options={options.categories}
              value={category}
              onChange={setCategory}
            />
            <OptionSelect
              id='medication-presentation'
              testId='medications-presentation-select'
              label='Forma de apresentação'
              options={options.presentationFormats}
              value={presentationFormat}
              onChange={setPresentationFormat}
            />
          </div>
          <label htmlFor='medication-manufacturer' className={labelClass}>
            <span>
              Fabricante do medicamento{' '}
              <span className='text-[#b22936]'>*</span>
            </span>
            <input
              id='medication-manufacturer'
              data-testid='medications-manufacturer-input'
              required
              maxLength={200}
              value={manufacturer}
              onChange={event => setManufacturer(event.target.value)}
              placeholder='Razão social do fabricante'
              className={fieldClass}
            />
          </label>
        </fieldset>
        {error && (
          <p
            role='alert'
            data-testid='medications-create-error'
            className='rounded-lg bg-red-50 p-3 text-sm text-[#b22936]'
          >
            {error}
          </p>
        )}
        <div className='grid grid-cols-2 gap-6'>
          <Button
            type='button'
            variant='outline'
            disabled={isSaving}
            onClick={onClose}
            data-testid='medications-cancel-button'
            className='min-h-[46px] border-2 border-[#b22936] text-[#b22936]'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            data-testid='medications-submit-button'
            disabled={isSaving}
            className='min-h-[46px] border-2 border-ui-button bg-ui-button text-white hover:bg-[#0a8c55]'
          >
            {isSaving ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </dialog>
  );
};
