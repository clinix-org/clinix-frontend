import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';

export const Forbidden = () => {
  const navigate = useNavigate();
  const returnLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    returnLinkRef.current?.focus();
  }, []);

  return (
    <div className='min-h-screen bg-[#f4f4f4]'>
      <div inert aria-hidden='true' className='overflow-hidden'>
        <Sidebar
          isCollapsed={false}
          activePageId='dashboard'
          onOpenPage={page => navigate(page.path)}
          setIsCollapsed={() => {}}
        />
        <div className='min-w-[800px] pl-[220px]'>
          <Header />
        </div>
      </div>

      <main className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6'>
        <section
          role='dialog'
          aria-modal='true'
          aria-labelledby='forbidden-title'
          aria-describedby='forbidden-description'
          className='my-auto w-full max-w-[420px] overflow-hidden rounded-md bg-white text-center'
          onKeyDown={event => {
            if (event.key === 'Tab') {
              event.preventDefault();
              returnLinkRef.current?.focus();
            }
          }}
        >
          <h1
            id='forbidden-title'
            className='border-b border-ui-border px-5 py-2.5 text-lg font-bold leading-6 text-[#d3132c]'
          >
            Acesso negado (403)
          </h1>
          <div className='px-5 pt-5 pb-5'>
            <p
              id='forbidden-description'
              className='text-[13px] leading-6 text-[#4f5b58]'
            >
              Seu usuário não tem permissão para acessar esta área.
            </p>
            <Link
              ref={returnLinkRef}
              to='/dashboard'
              className='mt-5 flex min-h-10 w-full items-center justify-center rounded-md border-2 border-[#4f5b58] bg-white px-3 py-2 text-[13px] font-medium text-[#4f5b58] transition-colors hover:bg-[#f6f7f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f5b58]'
            >
              Voltar para a tela inicial
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
