import { Save } from 'lucide-react';
import { DataPageToolbar } from '../components/DataPageToolbar';
import { PageSurface } from '../components/PageSurface';

const settingsSections = [
  'Perfil da clinica',
  'Seguranca',
  'Notificacoes',
  'Integracoes',
];

export const Configuracoes = () => (
  <PageSurface>
    <DataPageToolbar
      searchPlaceholder='Pesquisar configuracoes'
      action={
        <button
          type='button'
          className='flex h-10 items-center gap-2 rounded-lg bg-[#0cad69] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#0a8c55]'
        >
          <Save className='size-4' />
          Salvar alteracoes
        </button>
      }
    />

    <div className='grid min-h-0 flex-1 gap-6 overflow-auto border-t border-[#eaebed] p-6 lg:grid-cols-[280px_1fr]'>
      <aside className='rounded-lg border border-[#eaebed] bg-white p-4'>
        <nav className='flex flex-col gap-2'>
          {settingsSections.map((item, index) => (
            <button
              key={item}
              type='button'
              className={`rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                index === 0
                  ? 'bg-[#e8f9f2] text-[#0cad69]'
                  : 'text-[#646b72] hover:bg-[#fafafa] hover:text-[#3f454a]'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <form className='min-h-full rounded-lg border border-[#eaebed] bg-white p-5'>
        <div className='border-b border-[#eaebed] pb-5'>
          <h2 className='text-base font-semibold text-[#3f454a]'>
            Perfil da clinica
          </h2>
          <p className='mt-1 text-[13px] text-[#82878c]'>
            Mantenha os dados institucionais atualizados.
          </p>
        </div>

        <div className='mt-5 grid gap-4 md:grid-cols-2'>
          {[
            ['Nome da clinica', 'Clinix', 'text'],
            ['E-mail', 'contato@clinix.com', 'email'],
            ['Telefone', '(11) 4002-8922', 'tel'],
            ['CNPJ', '00.000.000/0001-00', 'text'],
          ].map(([label, value, type]) => (
            <label
              key={label}
              className='flex flex-col gap-2 text-[13px] font-semibold text-[#3f454a]'
            >
              {label}
              <input
                type={type}
                defaultValue={value}
                className='h-10 rounded-lg border border-[#eaebed] bg-[#fafafa] px-3 text-[13px] font-normal text-[#646b72] outline-none transition-colors focus:border-[#0cad69]'
              />
            </label>
          ))}
        </div>
      </form>
    </div>
  </PageSurface>
);
