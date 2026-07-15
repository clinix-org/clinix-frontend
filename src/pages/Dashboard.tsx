import { PageSurface } from '../components/PageSurface';

export const Dashboard = () => (
  <PageSurface>
    <div className='grid gap-4 border-b border-[#eaebed] p-6 md:grid-cols-3'>
      {[
        ['Solicitacoes abertas', '24'],
        ['Medicamentos cadastrados', '179'],
        ['Usuarios ativos', '42'],
      ].map(([label, value]) => (
        <div key={label} className='rounded-lg border border-[#eaebed] p-5'>
          <p className='text-[12px] font-medium text-[#82878c]'>{label}</p>
          <strong className='mt-3 block text-3xl font-semibold text-[#3f454a]'>
            {value}
          </strong>
        </div>
      ))}
    </div>

    <div className='min-h-0 flex-1 overflow-auto p-6'>
      <div className='rounded-lg border border-[#eaebed] p-5'>
        <h2 className='text-base font-semibold text-[#3f454a]'>
          Atividades recentes
        </h2>
        <div className='mt-5 space-y-3'>
          {[
            'Estoque de Losartana atualizado',
            'Novo usuario administrador criado',
            'Relatorio de movimentacao exportado',
            'Configuracoes da clinica revisadas',
          ].map(item => (
            <div
              key={item}
              className='rounded-lg border border-[#eaebed] px-4 py-3 text-[13px] text-[#646b72]'
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  </PageSurface>
);
