import iconLeftPanelClose from '../../assets/icon_left_panel_close.svg';
import iconLeftPanelOpen from '../../assets/icon_left_panel_open.svg';
import logo from '../../assets/logo-clinix.svg';
import {
  bottomMenuPages,
  mainMenuPages,
  type AppPage,
  type AppPageId,
} from '../../config/appPages';
import { useAuth } from '../../context/useAuth';

interface SidebarProps {
  isCollapsed: boolean;
  activePageId: AppPageId;
  onOpenPage: (page: AppPage) => void;
  setIsCollapsed: (value: boolean) => void;
}

const ACTIVE_ICON_FILTER =
  'invert(64%) sepia(67%) saturate(415%) hue-rotate(106deg) brightness(97%) contrast(90%)';

const TooltipLabel = ({ label }: { label: string }) => (
  <div className='invisible absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100'>
    {label}
  </div>
);

interface SidebarLinkProps {
  item: AppPage;
  isActive: boolean;
  isCollapsed: boolean;
  onOpenPage: (page: AppPage) => void;
}

const SidebarLink = ({
  item,
  isActive,
  isCollapsed,
  onOpenPage,
}: SidebarLinkProps) => (
  <div className='group relative'>
    <button
      type='button'
      onClick={() => onOpenPage(item)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-[9px] text-[13.5px] font-medium transition-colors
        ${isCollapsed ? 'justify-center' : 'justify-start'}
        ${
          isActive
            ? 'bg-[#e8f9f2] text-[#3ecf8e]'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}
    >
      <img
        src={item.icon}
        alt={item.label}
        className='h-[18px] w-[18px] shrink-0'
        style={{ filter: isActive ? ACTIVE_ICON_FILTER : 'none' }}
      />
      {!isCollapsed && (
        <span className='whitespace-nowrap leading-none'>{item.label}</span>
      )}
    </button>
    {isCollapsed && <TooltipLabel label={item.label} />}
  </div>
);

export const Sidebar = ({
  isCollapsed,
  activePageId,
  onOpenPage,
  setIsCollapsed,
}: SidebarProps) => {
  const { canAccess, logout } = useAuth();
  const visibleMainMenuPages = mainMenuPages.filter(item =>
    canAccess({ roles: item.roles, permissions: item.permissions }),
  );
  const visibleBottomMenuPages = bottomMenuPages.filter(item =>
    canAccess({ roles: item.roles, permissions: item.permissions }),
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-20 flex h-screen flex-col border-r border-gray-100 bg-white transition-all duration-300
      ${isCollapsed ? 'w-[72px]' : 'w-[220px]'}`}
    >
      <div
        className={`flex h-[60px] shrink-0 items-center px-4 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!isCollapsed && (
          <img src={logo} alt='Clinix' className='w-20 select-none' />
        )}

        <button
          type='button'
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-colors hover:bg-gray-200'
          title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <img
            src={isCollapsed ? iconLeftPanelOpen : iconLeftPanelClose}
            alt={isCollapsed ? 'Expandir' : 'Recolher'}
            className='h-4 w-4'
          />
        </button>
      </div>

      <nav className='mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto px-3'>
        {visibleMainMenuPages.map(item => (
          <SidebarLink
            key={item.path}
            item={item}
            isActive={activePageId === item.id}
            isCollapsed={isCollapsed}
            onOpenPage={onOpenPage}
          />
        ))}
      </nav>

      <div className='flex shrink-0 flex-col gap-0.5 px-3 pb-5'>
        {visibleBottomMenuPages.map(item => (
          <SidebarLink
            key={item.path}
            item={item}
            isActive={activePageId === item.id}
            isCollapsed={isCollapsed}
            onOpenPage={onOpenPage}
          />
        ))}

        <div className='group relative'>
          <button
            type='button'
            onClick={() => logout()}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-[9px] text-[13.5px] font-medium text-red-500 transition-colors hover:bg-red-50
            ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <div className='text-red-500'>
              <svg
                width='18'
                height='18'
                viewBox='0 0 16 16'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M3.33333 14C2.96667 14 2.65278 13.8694 2.39167 13.6083C2.13056 13.3472 2 13.0333 2 12.6667V3.33333C2 2.96667 2.13056 2.65278 2.39167 2.39167C2.65278 2.13056 2.96667 2 3.33333 2H7.33333C7.52222 2 7.68056 2.06389 7.80833 2.19167C7.93611 2.31944 8 2.47778 8 2.66667C8 2.85556 7.93611 3.01389 7.80833 3.14167C7.68056 3.26944 7.52222 3.33333 7.33333 3.33333H3.33333V12.6667H7.33333C7.52222 12.6667 7.68056 12.7306 7.80833 12.8583C7.93611 12.9861 8 13.1444 8 13.3333C8 13.5222 7.93611 13.6806 7.80833 13.8083C7.68056 13.9361 7.52222 14 7.33333 14H3.33333ZM11.45 8.66667H6.66667C6.47778 8.66667 6.31944 8.60278 6.19167 8.475C6.06389 8.34722 6 8.18889 6 8C6 7.81111 6.06389 7.65278 6.19167 7.525C6.31944 7.39722 6.47778 7.33333 6.66667 7.33333H11.45L10.2 6.08333C10.0778 5.96111 10.0167 5.81111 10.0167 5.63333C10.0167 5.45556 10.0778 5.3 10.2 5.16667C10.3222 5.03333 10.4778 4.96389 10.6667 4.95833C10.8556 4.95278 11.0167 5.01667 11.15 5.15L13.5333 7.53333C13.6667 7.66667 13.7333 7.82222 13.7333 8C13.7333 8.17778 13.6667 8.33333 13.5333 8.46667L11.15 10.85C11.0167 10.9833 10.8583 11.0472 10.675 11.0417C10.4917 11.0361 10.3333 10.9667 10.2 10.8333C10.0778 10.7 10.0194 10.5417 10.025 10.3583C10.0306 10.175 10.0944 10.0222 10.2167 9.9L11.45 8.66667Z' />
              </svg>
            </div>
            {!isCollapsed && <span className='whitespace-nowrap'>Sair</span>}
          </button>
          {isCollapsed && <TooltipLabel label='Sair' />}
        </div>
      </div>
    </aside>
  );
};
