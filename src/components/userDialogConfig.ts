export type UserStatus = boolean;

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  ativo: UserStatus;
};

export type UserDialogMode = 'create' | 'edit';

export type UserDialogSubmitValues = {
  nome: string;
  usuario: string;
  senha?: string;
  role: string;
  ativo: UserStatus;
};

export const USER_ACCESS_OPTIONS = [
  { value: 'USER', label: 'Colaborador' },
  { value: 'ADMIN', label: 'Administrador' },
];

export const getDefaultUserFormValues = (): UserFormValues => ({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'USER',
  ativo: true,
});
