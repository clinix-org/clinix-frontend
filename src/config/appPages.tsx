import type { ComponentType } from 'react';
import iconDashboard from '../assets/icon_dashboard.svg';
import iconHome from '../assets/icon_home.svg';
import iconPill from '../assets/icon_pill.svg';
import iconProfile from '../assets/icon_profile.svg';
import iconSettings from '../assets/icon_settings.svg';
import { Configuracoes } from '../pages/Configuracoes';
import { Dashboard } from '../pages/Dashboard';
import { Medicamentos } from '../pages/Medicamentos';
import { Relatorios } from '../pages/Relatorios';
import { Usuarios } from '../pages/Usuarios';

export type AppPageId =
  | 'dashboard'
  | 'usuarios'
  | 'medicamentos'
  | 'relatorios'
  | 'configuracoes';

export type AppPage = {
  id: AppPageId;
  path: string;
  icon: string;
  label: string;
  Component: ComponentType;
  menuGroup: 'main' | 'bottom';
  roles?: string[];
  permissions?: string[];
  exactMatch?: boolean;
};

export const appPages: AppPage[] = [
  {
    id: 'dashboard',
    path: '/dashboard',
    icon: iconHome,
    label: 'Tela inicial',
    Component: Dashboard,
    menuGroup: 'main',
    permissions: ['dashboard:read'],
    exactMatch: true,
  },
  {
    id: 'usuarios',
    path: '/usuarios',
    icon: iconProfile,
    label: 'Usuários',
    Component: Usuarios,
    menuGroup: 'main',
    roles: ['ADMIN'],
    permissions: ['users:read'],
  },
  {
    id: 'medicamentos',
    path: '/medicamentos',
    icon: iconPill,
    label: 'Medicamentos',
    Component: Medicamentos,
    menuGroup: 'main',
    permissions: ['medicamentos:read'],
  },
  {
    id: 'relatorios',
    path: '/relatorios',
    icon: iconDashboard,
    label: 'Relatorios',
    Component: Relatorios,
    menuGroup: 'main',
    permissions: ['relatorios:read'],
  },
  {
    id: 'configuracoes',
    path: '/configuracoes',
    icon: iconSettings,
    label: 'Configuracoes',
    Component: Configuracoes,
    menuGroup: 'bottom',
    permissions: ['configuracoes:read'],
  },
];

export const findAppPageByPath = (pathname: string) =>
  appPages.find(page =>
    page.exactMatch
      ? pathname === page.path || pathname === `${page.path}/`
      : pathname.startsWith(page.path),
  ) ?? appPages[0];

export const mainMenuPages = appPages.filter(page => page.menuGroup === 'main');
export const bottomMenuPages = appPages.filter(
  page => page.menuGroup === 'bottom',
);
