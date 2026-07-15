import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  appPages,
  findAppPageByPath,
  type AppPage,
  type AppPageId,
} from '../../config/appPages';
import { useAuth } from '../../context/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type OpenTab = {
  id: AppPageId;
  path: string;
  label: string;
};

export const MainLayout = () => {
  const { canAccess } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const routePage = findAppPageByPath(location.pathname);
  const activePageId = routePage.id;

  const [openTabs, setOpenTabs] = useState<OpenTab[]>(() => [
    {
      id: routePage.id,
      path: routePage.path,
      label: routePage.label,
    },
  ]);

  const displayedTabs = useMemo(() => {
    if (openTabs.some(tab => tab.id === routePage.id)) return openTabs;

    return [
      ...openTabs,
      {
        id: routePage.id,
        path: routePage.path,
        label: routePage.label,
      },
    ];
  }, [openTabs, routePage]);

  const activePage = useMemo(
    () => appPages.find(page => page.id === activePageId),
    [activePageId],
  );

  if (!activePage) return <Navigate to='/dashboard' replace />;
  if (!canAccess({ roles: activePage.roles, permissions: activePage.permissions })) {
    return <Navigate to='/403' replace />;
  }

  const handleOpenPage = (page: AppPage) => {
    setOpenTabs(currentTabs => {
      if (currentTabs.some(tab => tab.id === page.id)) return currentTabs;

      return [
        ...currentTabs,
        {
          id: page.id,
          path: page.path,
          label: page.label,
        },
      ];
    });
    navigate(page.path);
  };

  const handleActivateTab = (tab: OpenTab) => {
    navigate(tab.path);
  };

  const handleCloseTab = (tabId: AppPageId) => {
    if (tabId === activePageId) return;

    setOpenTabs(currentTabs => currentTabs.filter(tab => tab.id !== tabId));
  };

  const ActivePageComponent = activePage.Component;

  return (
    <div className='flex min-h-screen bg-[#f4f4f5] font-sans text-gray-900'>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        activePageId={activePageId}
        onOpenPage={handleOpenPage}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-[72px]' : 'pl-[220px]'
        }`}
      >
        <Header />

        <main className='flex min-h-0 flex-1 flex-col overflow-auto bg-[#f4f4f4] px-5 py-6'>
          <div className='mx-auto flex min-h-[calc(100vh-108px)] w-full flex-1 flex-col'>
            <div className='flex h-9 items-end overflow-x-auto'>
              {displayedTabs.map(tab => {
                const isActive = tab.id === activePageId;

                return (
                  <div
                    key={tab.id}
                    className={`flex h-9 shrink-0 items-center gap-3 rounded-t-lg px-4 text-[12px] font-semibold transition-colors ${
                      isActive
                        ? 'bg-white text-[#0cad69]'
                        : 'bg-[#eeeeee] text-[#82878c] hover:bg-white hover:text-[#0cad69]'
                    }`}
                  >
                    <button
                      type='button'
                      onClick={() => handleActivateTab(tab)}
                      className='h-full whitespace-nowrap'
                    >
                      {tab.label}
                    </button>
                    {!isActive && (
                      <button
                        type='button'
                        onClick={event => {
                          event.stopPropagation();
                          handleCloseTab(tab.id);
                        }}
                        className='rounded p-0.5 text-current transition-colors hover:bg-[#e8f9f2] hover:text-[#0cad69]'
                        aria-label={`Fechar aba ${tab.label}`}
                      >
                        <X className='size-3.5' />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <ActivePageComponent />
          </div>
        </main>
      </div>
    </div>
  );
};
