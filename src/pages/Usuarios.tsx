import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import api from '../api';
import { DataPageToolbar } from '../components/DataPageToolbar';
import { PageSurface } from '../components/PageSurface';
import { PaginationBar } from '../components/PaginationBar';
import { OutlinePill, StatusPill } from '../components/StatusPill';
import { UserDialog } from '../components/UserDialog';
import {
  USER_ACCESS_OPTIONS,
  type UserDialogMode,
  type UserDialogSubmitValues,
  type UserFormValues,
  type UserStatus,
} from '../components/userDialogConfig';

type User = {
  id: number;
  name?: string;
  email?: string;
  role: string;
  ativo: UserStatus;
  nome?: string;
  usuario?: string;
};

const USERS_API_URL = '/users';
const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];
const STATUS_FILTER_OPTIONS: UserStatus[] = [true, false];

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Ana Martins',
    email: 'ana.martins@clinix.com',
    role: 'Administrador',
    ativo: true,
  },
  {
    id: 2,
    name: 'Bruno Costa',
    email: 'bruno.costa@clinix.com',
    role: 'Farmaceutico',
    ativo: true,
  },
  {
    id: 3,
    name: 'Carla Souza',
    email: 'carla.souza@clinix.com',
    role: 'Atendente',
    ativo: false,
  },
  {
    id: 4,
    name: 'Diego Almeida',
    email: 'diego.almeida@clinix.com',
    role: 'Gerente',
    ativo: true,
  },
  {
    id: 5,
    name: 'Elisa Rocha',
    email: 'elisa.rocha@clinix.com',
    role: 'Enfermeiro',
    ativo: false,
  },
  {
    id: 6,
    name: 'Fabio Lima',
    email: 'fabio.lima@clinix.com',
    role: 'Medico',
    ativo: true,
  },
  {
    id: 7,
    name: 'Gabriela Nunes',
    email: 'gabriela.nunes@clinix.com',
    role: 'Atendente',
    ativo: true,
  },
  {
    id: 8,
    name: 'Henrique Barros',
    email: 'henrique.barros@clinix.com',
    role: 'Farmaceutico',
    ativo: false,
  },
  {
    id: 9,
    name: 'Isabela Freitas',
    email: 'isabela.freitas@clinix.com',
    role: 'Administrador',
    ativo: true,
  },
  {
    id: 10,
    name: 'Joao Ribeiro',
    email: 'joao.ribeiro@clinix.com',
    role: 'Financeiro',
    ativo: false,
  },
  {
    id: 11,
    name: 'Karen Lopes',
    email: 'karen.lopes@clinix.com',
    role: 'Recepcao',
    ativo: true,
  },
  {
    id: 12,
    name: 'Lucas Ferreira',
    email: 'lucas.ferreira@clinix.com',
    role: 'Suporte',
    ativo: false,
  },
];

let mockUserStore = [...mockUsers];

const waitMockResponse = () =>
  new Promise(resolve => {
    window.setTimeout(resolve, 250);
  });

const fetchUsers = async (search: string): Promise<User[]> => {
  if (USERS_API_URL) {
    const response = await api.get<User[]>(USERS_API_URL, {
      params: { search },
    });

    return response.data;
  }

  await waitMockResponse();

  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) return mockUserStore;

  return mockUserStore.filter(user =>
    [
      getUserName(user),
      getUserEmail(user),
      user.role,
      getStatusLabel(user.ativo),
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch),
  );
};

const createUser = async (
  user: Omit<User, 'id'> & { password?: string },
): Promise<User | undefined> => {
  if (USERS_API_URL) {
    const response = await api.post<User>(USERS_API_URL, user);
    return response.data;
  }

  await waitMockResponse();

  const mockUser: Omit<User, 'id'> = {
    name: user.name,
    email: user.email,
    role: user.role,
    ativo: user.ativo,
    nome: user.nome,
    usuario: user.usuario,
  };
  const nextUser = {
    ...mockUser,
    id: Math.max(0, ...mockUserStore.map(currentUser => currentUser.id)) + 1,
  };

  mockUserStore = [nextUser, ...mockUserStore];

  return nextUser;
};

const updateUser = async (user: User): Promise<User | undefined> => {
  if (USERS_API_URL) {
    const response = await api.put<User>(`${USERS_API_URL}/${user.id}`, user);
    return response.data;
  }

  await waitMockResponse();
  mockUserStore = mockUserStore.map(currentUser =>
    currentUser.id === user.id ? user : currentUser,
  );

  return user;
};

const deleteUser = async (userId: number) => {
  if (USERS_API_URL) {
    await api.delete(`${USERS_API_URL}/${userId}`);
    return;
  }

  await waitMockResponse();
  mockUserStore = mockUserStore.filter(user => user.id !== userId);
};

const getUserName = (user: User) => user.name || user.nome || '-';

const getUserEmail = (user: User) => user.email || user.usuario || '-';

const getStatusLabel = (ativo: UserStatus) => (ativo ? 'Ativo' : 'Inativo');

const getStatusTone = (ativo: UserStatus) => (ativo ? 'success' : 'danger');

const getRoleValue = (role: string) =>
  USER_ACCESS_OPTIONS.some(option => option.value === role) ? role : 'USER';

const getInitialFormValues = (user?: User | null): UserFormValues => ({
  name: user ? getUserName(user) : '',
  email: user ? getUserEmail(user) : '',
  password: '',
  confirmPassword: '',
  role: user ? getRoleValue(user.role) : 'USER',
  ativo: user?.ativo ?? true,
});

export const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedAccesses, setSelectedAccesses] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<UserStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState<UserDialogMode | null>(
    null,
  );
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userPendingDeletion, setUserPendingDeletion] = useState<User | null>(
    null,
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetchUsers(searchTerm);

        setUsers(response);
        setCurrentPage(1);
        setSelectedUserIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [searchTerm]);

  const accessFilterOptions = useMemo(
    () => Array.from(new Set(users.map(user => user.role))).sort(),
    [users],
  );

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesAccess =
        selectedAccesses.length === 0 || selectedAccesses.includes(user.role);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(user.ativo);

      return matchesAccess && matchesStatus;
    });
  }, [selectedAccesses, selectedStatuses, users]);

  const hasActiveFilters =
    selectedAccesses.length > 0 || selectedStatuses.length > 0;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage),
  );

  useEffect(() => {
    setCurrentPage(page => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredUsers, itemsPerPage]);

  const pageUserIds = paginatedUsers.map(user => user.id);
  const selectedPageUserIds = pageUserIds.filter(userId =>
    selectedUserIds.includes(userId),
  );
  const isPageSelected =
    pageUserIds.length > 0 && selectedPageUserIds.length === pageUserIds.length;

  const handleOpenCreateDialog = () => {
    setEditingUser(null);
    setUserDialogMode('create');
  };

  const handleOpenEditDialog = (user: User) => {
    setEditingUser(user);
    setUserDialogMode('edit');
  };

  const handleCloseUserDialog = () => {
    if (isSaving) return;

    setUserDialogMode(null);
    setEditingUser(null);
  };

  const handleSubmitUserDialog = async (values: UserDialogSubmitValues) => {
    if (!userDialogMode) return;

    try {
      setIsSaving(true);

      if (userDialogMode === 'create') {
        const createdUser = await createUser(values);

        if (createdUser) {
          setUsers(currentUsers => [createdUser, ...currentUsers]);
        }

        toast.success('Usuario criado com sucesso.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          transition: Bounce,
        });
      } else if (editingUser) {
        const updatedUser = {
          ...editingUser,
          nome: values.nome,
          usuario: values.usuario,
          role: values.role,
          ativo: values.ativo,
        };

        const savedUser = await updateUser(updatedUser);
        const userToDisplay = savedUser ?? updatedUser;

        setUsers(currentUsers =>
          currentUsers.map(currentUser =>
            currentUser.id === userToDisplay.id ? userToDisplay : currentUser,
          ),
        );

        toast.success('Usuario salvo com sucesso.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          transition: Bounce,
        });
      }

      setUserDialogMode(null);
      setEditingUser(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserPendingDeletion(user);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;

    setUserPendingDeletion(null);
  };

  const handleConfirmDeleteUser = async () => {
    if (!userPendingDeletion) return;

    try {
      setIsDeleting(true);
      await deleteUser(userPendingDeletion.id);

      const deletedUser = userPendingDeletion;

      setUsers(currentUsers =>
        currentUsers.filter(currentUser => currentUser.id !== deletedUser.id),
      );
      setSelectedUserIds(currentIds =>
        currentIds.filter(currentId => currentId !== deletedUser.id),
      );
      setUserPendingDeletion(null);
      toast.success(
        `Usuario ${getUserName(deletedUser)} excluido com sucesso.`,
        {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          transition: Bounce,
        },
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUserIds(currentIds =>
      currentIds.includes(userId)
        ? currentIds.filter(currentId => currentId !== userId)
        : [...currentIds, userId],
    );
  };

  const handleSelectPage = () => {
    setSelectedUserIds(currentIds => {
      if (isPageSelected) {
        return currentIds.filter(userId => !pageUserIds.includes(userId));
      }

      return Array.from(new Set([...currentIds, ...pageUserIds]));
    });
  };

  const handlePreviousPage = () => {
    setCurrentPage(page => Math.max(1, page - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(page => Math.min(totalPages, page + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setSelectedUserIds([]);
  };

  const handleAccessFilterChange = (access: string) => {
    setSelectedAccesses(currentAccesses =>
      currentAccesses.includes(access)
        ? currentAccesses.filter(currentAccess => currentAccess !== access)
        : [...currentAccesses, access],
    );
    setCurrentPage(1);
    setSelectedUserIds([]);
  };

  const handleStatusFilterChange = (status: UserStatus) => {
    setSelectedStatuses(currentStatuses =>
      currentStatuses.includes(status)
        ? currentStatuses.filter(currentStatus => currentStatus !== status)
        : [...currentStatuses, status],
    );
    setCurrentPage(1);
    setSelectedUserIds([]);
  };

  const handleClearFilters = () => {
    setSelectedAccesses([]);
    setSelectedStatuses([]);
    setCurrentPage(1);
    setSelectedUserIds([]);
  };

  return (
    <PageSurface>
      <DataPageToolbar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder='Pesquisar usuários'
        isFilterActive={hasActiveFilters}
        filterContent={
          <div className='py-3 text-[13px] text-[#5f666d]'>
            <div className='flex items-center justify-between border-b border-[#eaebed] px-4 pb-3'>
              <span className='font-semibold text-[#3f464d]'>Filtros</span>
              <button
                type='button'
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className='text-[12px] font-semibold text-[#0cad69] transition-colors hover:text-[#0a8c55] disabled:cursor-not-allowed disabled:text-[#b8bdc2]'
              >
                Limpar
              </button>
            </div>

            <div className='space-y-2 px-4 py-3'>
              <span className='text-[12px] font-semibold uppercase text-[#82878c]'>
                Acesso
              </span>
              <div className='max-h-[150px] space-y-1 overflow-y-auto pr-1'>
                {accessFilterOptions.map(access => (
                  <label
                    key={access}
                    className='flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-[#fafafa]'
                  >
                    <input
                      type='checkbox'
                      checked={selectedAccesses.includes(access)}
                      onChange={() => handleAccessFilterChange(access)}
                      className='size-4 rounded border-[#82878c] accent-[#0cad69]'
                    />
                    {access}
                  </label>
                ))}
              </div>
            </div>

            <div className='space-y-2 border-t border-[#eaebed] px-4 pt-3'>
              <span className='text-[12px] font-semibold uppercase text-[#82878c]'>
                Status
              </span>
              <div className='space-y-1'>
                {STATUS_FILTER_OPTIONS.map(status => (
                  <label
                    key={String(status)}
                    className='flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-[#fafafa]'
                  >
                    <input
                      type='checkbox'
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusFilterChange(status)}
                      className='size-4 rounded border-[#82878c] accent-[#0cad69]'
                    />
                    {getStatusLabel(status)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        }
        info={
          selectedUserIds.length > 0 ? (
            <span className='text-[12px] font-medium text-[#82878c]'>
              {selectedUserIds.length} selecionado(s)
            </span>
          ) : undefined
        }
        action={
          <button
            type='button'
            onClick={handleOpenCreateDialog}
            className='flex h-10 items-center gap-2 rounded-lg bg-[#0cad69] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0a8c55]'
          >
            <Plus className='size-4' />
            Criar novo usuário
          </button>
        }
      />

      <div className='min-h-0 flex-1 overflow-x-auto'>
        <table className='w-full min-w-[900px] text-left text-[13px]'>
          <thead className='border-y border-[#eaebed] bg-white text-[12px] font-semibold text-[#5f666d]'>
            <tr>
              <th className='w-[64px] px-6 py-4'>
                <input
                  type='checkbox'
                  checked={isPageSelected}
                  onChange={handleSelectPage}
                  aria-label='Selecionar todos os usuarios da pagina'
                  className='size-4 rounded border-[#82878c] accent-[#0cad69]'
                />
              </th>
              <th className='px-5 py-4'>Nome de usuário</th>
              <th className='px-5 py-4'>E-mail</th>
              <th className='px-5 py-4'>Acesso</th>
              <th className='px-5 py-4'>Status</th>
              <th className='w-32.5 px-5 py-4'>Ações</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#eaebed]'>
            {isLoading ? (
              <tr>
                <td
                  className='px-5 py-10 text-center text-[#82878c]'
                  colSpan={6}
                >
                  Carregando usuarios...
                </td>
              </tr>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map(user => (
                <tr
                  key={user.id}
                  className='h-[58px] text-[#646b72] transition-colors hover:bg-[#fafafa]'
                >
                  <td className='px-6 py-3'>
                    <input
                      type='checkbox'
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      aria-label={`Selecionar ${getUserName(user)}`}
                      className='size-4 rounded border-[#82878c] accent-[#0cad69]'
                    />
                  </td>
                  <td className='px-5 py-3 font-medium text-[#646b72]'>
                    {getUserName(user)}
                  </td>
                  <td className='px-5 py-3'>{getUserEmail(user)}</td>
                  <td className='px-5 py-3'>
                    <OutlinePill>{user.role}</OutlinePill>
                  </td>
                  <td className='px-5 py-3'>
                    <StatusPill tone={getStatusTone(user.ativo)}>
                      {getStatusLabel(user.ativo)}
                    </StatusPill>
                  </td>
                  <td className='flex h-[58px] items-center gap-5 px-5 py-3'>
                    <button
                      type='button'
                      onClick={() => handleOpenEditDialog(user)}
                      className='text-[#82878c] transition-colors hover:text-[#5f666d] cursor-pointer'
                      aria-label='Editar usuario'
                      title='Editar'
                    >
                      <Pencil className='size-3.5' />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleOpenDeleteDialog(user)}
                      className='text-[#c43b4c] transition-colors hover:text-[#9f2f3d] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-[#82878c]'
                      aria-label='Excluir usuario'
                      title='Excluir'
                      disabled={user.role === 'ADMIN'}
                    >
                      <Trash2 className='size-3.5' />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className='px-5 py-10 text-center text-[#82878c]'
                  colSpan={6}
                >
                  Nenhum usuario encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        totalItems={filteredUsers.length}
        totalPages={totalPages}
        onItemsPerPageChange={handleItemsPerPageChange}
        onNextPage={handleNextPage}
        onPageClick={handlePageClick}
        onPreviousPage={handlePreviousPage}
      />

      {userDialogMode && (
        <UserDialog
          key={`${userDialogMode}-${editingUser?.id ?? 'new'}`}
          mode={userDialogMode}
          initialValues={getInitialFormValues(editingUser)}
          isSaving={isSaving}
          onClose={handleCloseUserDialog}
          onSubmit={handleSubmitUserDialog}
        />
      )}

      {userPendingDeletion && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4'
          role='presentation'
          onMouseDown={handleCloseDeleteDialog}
        >
          <div
            className='w-full max-w-[420px] rounded-lg bg-white p-6 shadow-xl'
            role='dialog'
            aria-modal='true'
            aria-labelledby='delete-user-dialog-title'
            onMouseDown={event => event.stopPropagation()}
          >
            <h2
              id='delete-user-dialog-title'
              className='text-lg font-semibold text-[#3f464d]'
            >
              Excluir usuario
            </h2>
            <p className='mt-3 text-[14px] leading-6 text-[#646b72]'>
              Tem certeza que deseja excluir o usuario{' '}
              <strong className='font-semibold text-[#3f464d]'>
                {getUserName(userPendingDeletion)}
              </strong>
              ?
            </p>
            <div className='mt-6 flex justify-end gap-3'>
              <button
                type='button'
                onClick={handleCloseDeleteDialog}
                disabled={isDeleting}
                className='h-10 rounded-lg border border-[#d7dade] px-4 text-[13px] font-semibold text-[#5f666d] transition-colors hover:bg-[#f6f7f8] disabled:cursor-not-allowed disabled:opacity-70'
              >
                Nao
              </button>
              <button
                type='button'
                onClick={handleConfirmDeleteUser}
                disabled={isDeleting}
                className='h-10 rounded-lg bg-[#c43b4c] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#9f2f3d] disabled:cursor-not-allowed disabled:opacity-70'
              >
                {isDeleting ? 'Excluindo...' : 'Sim'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position='bottom-right' />
    </PageSurface>
  );
};
