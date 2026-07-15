import { type FormEvent, useState } from 'react';
import { ChevronDown, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  USER_ACCESS_OPTIONS,
  getDefaultUserFormValues,
  type UserDialogMode,
  type UserDialogSubmitValues,
  type UserFormValues,
  type UserStatus,
} from './userDialogConfig';

type UserDialogProps = {
  mode: UserDialogMode;
  initialValues?: UserFormValues;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (values: UserDialogSubmitValues) => void | Promise<void>;
};

export const UserDialog = ({
  mode,
  initialValues,
  isSaving = false,
  onClose,
  onSubmit,
}: UserDialogProps) => {
  const sixDigitPasswordPattern = /^\d{6}$/;
  const [values, setValues] = useState<UserFormValues>(
    initialValues ?? getDefaultUserFormValues(),
  );
  const [error, setError] = useState('');

  const handleChange = (
    field: keyof UserFormValues,
    value: string | UserStatus,
  ) => {
    setValues(currentValues => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handlePasswordChange = (
    field: 'password' | 'confirmPassword',
    value: string,
  ) => {
    handleChange(field, value.replace(/\D/g, '').slice(0, 6));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = values.name.trim();
    const trimmedEmail = values.email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError('Preencha nome completo e e-mail.');
      return;
    }

    if (mode === 'create' && !sixDigitPasswordPattern.test(values.password)) {
      setError('A senha deve conter exatamente 6 numeros.');
      return;
    }

    if (mode === 'create' && values.password !== values.confirmPassword) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    setError('');
    onSubmit({
      nome: trimmedName,
      usuario: trimmedEmail,
      senha: mode === 'create' ? values.password : undefined,
      role: values.role,
      ativo: values.ativo,
    });
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4'
      role='presentation'
      onMouseDown={onClose}
    >
      <form
        className='max-h-[calc(100vh-32px)] w-full max-w-[430px] overflow-y-auto rounded-lg bg-white px-6 py-6 shadow-xl'
        role='dialog'
        aria-modal='true'
        aria-labelledby='user-dialog-title'
        onMouseDown={event => event.stopPropagation()}
        onSubmit={handleSubmit}
        autoComplete='off'
      >
        <div className='mb-7 flex items-center justify-between'>
          <h2
            id='user-dialog-title'
            className='text-[17px] font-semibold text-[#0cad69]'
          >
            {mode === 'create' ? 'Criar usuário' : 'Editar usuário'}
          </h2>
          <button
            type='button'
            onClick={onClose}
            disabled={isSaving}
            className='rounded p-1 text-[#82878c] transition-colors hover:bg-[#f6f7f8] hover:text-[#5f666d] disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Fechar'
            title='Fechar'
          >
            <X className='size-4' />
          </button>
        </div>

        <div className='space-y-4'>
          <label className='block'>
            <span className='mb-2 block text-[12px] font-semibold text-[#202428]'>
              Nome completo <span className='text-[#c43b4c]'>*</span>
            </span>
            <input
              type='text'
              value={values.name}
              onChange={event => handleChange('name', event.target.value)}
              required
              placeholder='nome.sobrenome'
              autoComplete='off'
              className='h-10 w-full rounded-lg border border-[#cfd3d6] px-3 text-[13px] text-[#5f666d] outline-none transition-colors placeholder:text-[#82878c] focus:border-[#0cad69]'
            />
          </label>

          <label className='block'>
            <span className='mb-2 block text-[12px] font-semibold text-[#202428]'>
              E-mail <span className='text-[#c43b4c]'>*</span>
            </span>
            <input
              type='text'
              inputMode='email'
              value={values.email}
              onChange={event => handleChange('email', event.target.value)}
              required
              placeholder='nome.sobrenome@clinix.com'
              className='h-10 w-full rounded-lg border border-[#cfd3d6] px-3 text-[13px] text-[#5f666d] outline-none transition-colors placeholder:text-[#82878c] focus:border-[#0cad69]'
              autoComplete='new-password'
            />
          </label>

          {mode === 'create' && (
            <>
              <label className='block'>
                <span className='mb-2 block text-[12px] font-semibold text-[#202428]'>
                  Senha <span className='text-[#c43b4c]'>*</span>
                </span>
                <input
                  type='password'
                  inputMode='numeric'
                  maxLength={6}
                  pattern='\d{6}'
                  value={values.password}
                  onChange={event =>
                    handlePasswordChange('password', event.target.value)
                  }
                  required
                  placeholder='******'
                  className='h-10 w-full rounded-lg border border-[#cfd3d6] px-3 text-[13px] text-[#5f666d] outline-none transition-colors placeholder:text-[#82878c] focus:border-[#0cad69]'
                  autoComplete='new-password'
                />
              </label>

              <label className='block'>
                <span className='mb-2 block text-[12px] font-semibold text-[#202428]'>
                  Confirmar senha <span className='text-[#c43b4c]'>*</span>
                </span>
                <input
                  type='password'
                  inputMode='numeric'
                  maxLength={6}
                  pattern='\d{6}'
                  value={values.confirmPassword}
                  onChange={event =>
                    handlePasswordChange('confirmPassword', event.target.value)
                  }
                  required
                  placeholder='******'
                  autoComplete='new-password'
                  className='h-10 w-full rounded-lg border border-[#cfd3d6] px-3 text-[13px] text-[#5f666d] outline-none transition-colors placeholder:text-[#82878c] focus:border-[#0cad69]'
                />
              </label>
            </>
          )}

          <div
            className={
              mode === 'edit' ? 'grid gap-4 sm:grid-cols-2' : 'max-w-full'
            }
          >
            <label
              className={mode === 'edit' ? 'block' : 'flex items-center gap-2'}
            >
              <span
                className={
                  (mode === 'edit' ? 'mb-2 ' : '') +
                  'block text-[12px] font-semibold text-[#202428]'
                }
              >
                Perfil de acesso
              </span>
              <span className='relative block'>
                <select
                  value={values.role}
                  onChange={event => handleChange('role', event.target.value)}
                  className='h-10 w-full appearance-none rounded-lg border border-transparent bg-[#f7f7f8] px-3 pr-9 text-[13px] font-medium text-[#5f666d] outline-none transition-colors hover:border-[#eaebed] focus:border-[#0cad69]'
                >
                  {USER_ACCESS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className='pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#82878c]' />
              </span>
            </label>

            {mode === 'edit' && (
              <label className='block'>
                <span className='mb-2 block text-[12px] font-semibold text-[#202428]'>
                  Status
                </span>
                <span className='relative block'>
                  <select
                    value={String(values.ativo)}
                    onChange={event =>
                      handleChange('ativo', event.target.value === 'true')
                    }
                    className='h-10 w-full appearance-none rounded-lg border border-transparent bg-[#f7f7f8] px-3 pr-9 text-[13px] font-medium text-[#5f666d] outline-none transition-colors hover:border-[#eaebed] focus:border-[#0cad69]'
                  >
                    <option value='true'>Ativo</option>
                    <option value='false'>Inativo</option>
                  </select>
                  <ChevronDown className='pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#82878c]' />
                </span>
              </label>
            )}
          </div>
        </div>

        {error && (
          <p className='mt-4 rounded-lg bg-[#fff2f4] px-3 py-2 text-[12px] font-medium text-[#c43b4c]'>
            {error}
          </p>
        )}

        <div className='mt-7 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4'>
          <button
            type='button'
            onClick={onClose}
            disabled={isSaving}
            className='cursor-pointer flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#c43b4c] px-4 text-[13px] font-semibold text-[#c43b4c] transition-colors hover:bg-[#fff2f4] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[150px]'
          >
            <Trash2 className='size-3.5' />
            Cancelar
          </button>
          <button
            type='submit'
            disabled={isSaving}
            className='cursor-pointer flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0cad69] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0a8c55] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[170px]'
          >
            {mode === 'create' ? (
              <Plus className='size-4' />
            ) : (
              <Pencil className='size-4' />
            )}
            {isSaving
              ? 'Salvando...'
              : mode === 'create'
                ? 'Criar novo usuário'
                : 'Salvar usuário'}
          </button>
        </div>
      </form>
    </div>
  );
};
