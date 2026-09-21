# AGENTS.md — Clinix Frontend

## Escopo e forma de trabalho

- Estas instruções se aplicam ao repositório inteiro. Respeite instruções mais
  específicas de arquivos `AGENTS.md` em subdiretórios, quando existirem.
- Comunique decisões, validações e limitações em português. Preserve os nomes
  técnicos e contratos existentes.
- Antes de editar, leia `README.md`, os arquivos envolvidos e `git status --short`.
  Preserve alterações locais e staged de outras tarefas; não reverta nem inclua
  arquivos alheios ao escopo da entrega.
- Faça mudanças pequenas e completas. Evite refatorações, novas dependências e
  reformatação em massa sem necessidade para a tarefa.
- Atualize este guia quando scripts, arquitetura ou implantação mudarem. Em caso
  de divergência, confira a implementação e explicite a inconsistência.

## Visão geral do projeto

SPA administrativa do Clinix com login, controle de acesso, dashboard, usuários,
medicamentos, relatórios e configurações. A stack atual é React 19, TypeScript
5.9, Vite 7, React Router 7, Tailwind CSS 4 e Axios. O backend é externo a este
repositório; há telas com dados demonstrativos ou fluxos mockados.

| Local | Responsabilidade |
| --- | --- |
| `src/main.tsx` e `src/App.tsx` | Inicialização, providers e rotas |
| `src/pages/` | Telas e fluxos de negócio |
| `src/components/` | Componentes reutilizáveis, tabelas, paginação e diálogos |
| `src/components/layout/` | Header, Sidebar e MainLayout com navegação por abas |
| `src/config/appPages.tsx` | Catálogo de páginas, menus, roles e permissões |
| `src/config/env.ts` | Leitura e validação da configuração pública |
| `src/api.ts` e `src/services/` | Cliente HTTP, interceptors e autenticação |
| `src/context/` e `src/routes/` | Estado de sessão, autorização e rotas protegidas |
| `src/styles/global.css` e `src/assets/` | Tema Tailwind e recursos visuais |
| `Dockerfile`, `docker-compose*.yml`, `nginx.conf` | Desenvolvimento em container e entrega estática |

## Preparação e comandos de construção

Execute os comandos na raiz do projeto. Use Node compatível com o Vite instalado
(atualmente `^20.19.0 || >=22.12.0`) e npm. O Dockerfile utiliza `node:20-alpine`.
Use npm e `package-lock.json` como referência para instalação, como no Dockerfile;
também existe `yarn.lock`, mas não alterne gerenciadores nem regenere ambos sem
uma tarefa explícita de padronização.

1. Instale as dependências com `npm ci`.
2. Em uma máquina nova, copie `.env.example` para `.env.local`, somente se o
   arquivo local ainda não existir. No PowerShell: `Copy-Item .env.example .env.local`.
3. Ajuste a configuração pública local e disponibilize o backend correspondente.
4. Execute `npm run dev` e use a URL informada pelo Vite.

| Comando | Finalidade |
| --- | --- |
| `npm ci` | Instalar versões do lockfile; executa `prepare` para o Husky |
| `npm run dev` ou `npm run dev:local` | Vite no modo `localdev` |
| `npm run dev:development` | Servidor com modo `development` |
| `npm run lint` | ESLint no projeto |
| `npm run build:development` | `tsc -b` e bundle de desenvolvimento em `dist/` |
| `npm run build` ou `npm run build:production` | `tsc -b` e bundle de produção em `dist/` |
| `npm run preview` | Inspeção local do último bundle gerado |
| `docker compose up --build -d` | Desenvolvimento em container, acessível em `http://localhost:5173` |
| `docker compose up --build -d frontend-production` | Build com Nginx na porta 80; exige API/proxy de produção configurado |

O hook `.husky/pre-commit` executa `npm run lint`. Não o desative para contornar
falhas. Não há script `test`, suíte automatizada ou workflow de CI versionado
atualmente. Existe configuração Prettier, mas não há script de formatação nem
Prettier declarado no `package.json`.

## Ambientes e integração com API

- `.env.local` é configuração da máquina e não deve ser versionado. O modo local
  se chama `localdev`; preserve esse nome nos scripts.
- `.env.development` e `.env.production` contêm padrões públicos dos respectivos
  modos. Variáveis do processo têm precedência sobre arquivos de ambiente.
- `VITE_APP_ENV` aceita `local`, `development` ou `production`. `VITE_API_URL`
  informa a base da API, sem barra final; use HTTPS em produção ou `/api` quando
  houver proxy configurado. Consulte `src/config/env.ts` ao alterar o contrato.
- Centralize o consumo dessa configuração no módulo `env` e reutilize o cliente
  de `src/api.ts`; preserve interceptors, Bearer token e `withCredentials`.
- As variáveis `VITE_*` são incorporadas ao bundle no build. Alterar `env_file`
  de um container Nginx já construído não reconfigura o JavaScript servido.
- A validação em `src/config/env.ts` ocorre ao carregar o módulo na aplicação.
  Apesar do texto atual do README mencionar falha no build, `tsc` e Vite não
  garantem a execução dessa validação; confirme também a inicialização no navegador.

## Diretrizes de estilo e arquitetura

- Use componentes funcionais e hooks, `.tsx` para JSX e `.ts` para lógica/tipos.
  Nomeie componentes e tipos em PascalCase, funções e variáveis em camelCase e
  hooks com prefixo `use`. Preserve a nomenclatura das páginas em português.
- Mantenha TypeScript estrito, `import type` para imports usados só como tipos e
  contratos explícitos para props e respostas HTTP. Evite `any`, supressões de
  erros e relaxamento de regras de TypeScript ou ESLint para fazer checks passarem.
- Siga `.prettierrc.json` em código novo: dois espaços, ponto e vírgula, aspas
  simples inclusive em JSX, trailing commas e largura preferida de 80 colunas.
  Em arquivos legados, limite ajustes de estilo ao trecho necessário.
- Respeite as regras de hooks e React Refresh do `eslint.config.js`. Separe
  contextos, hooks e componentes conforme a organização existente.
- Reutilize `PageSurface`, `DataPageToolbar`, `PaginationBar`, `StatusPill` e
  componentes de layout antes de criar novas estruturas. Use Tailwind 4 e os
  tokens de `src/styles/global.css`; preserve a identidade visual existente.
- Use HTML semântico, labels de formulários, nomes acessíveis para botões com
  ícones, foco visível e navegação por teclado. Trate loading, vazio e erro.
- Ao adicionar uma página, mantenha `src/App.tsx` e `src/config/appPages.tsx`
  coerentes: caminho, componente, menu e requisitos de acesso. Atualmente
  `MainLayout` renderiza o componente do catálogo e verifica `canAccess`.
- Não confunda navegação oculta com autorização: mantenha a proteção das rotas
  e alinhe roles/permissões ao contrato do backend.
- Diferencie explicitamente mocks de integração real; não apresente operações
  em memória como persistência no backend.

## Instruções de teste e validação

Para mudanças em código ou configuração de build, execute:

```sh
npm run lint
npm run build:development
npm run build:production
```

Os builds verificam tipos e empacotamento; não substituem testes de comportamento.
Para alterações exclusivamente documentais, revise comandos, caminhos, coerência
com a implementação e o diff; não é necessário reconstruir a aplicação.

Valide manualmente os cenários afetados com dados fictícios e backend de teste:

- Login válido/inválido, restauração de sessão ao recarregar e logout.
- Sessão expirada (`401`), acesso negado (`403`), usuário bloqueado (`423` no
  fluxo de sessão) e indisponibilidade de rede/API.
- Acesso direto e recarga em rota protegida, redirecionamento após login e
  permissões de cada perfil envolvido.
- Sidebar, abertura/fechamento de abas e comportamento em diferentes larguras.
- Nas telas alteradas: busca, filtros, paginação, estado vazio, erros e diálogos;
  confirme se o cenário usa mock ou API real.

Se a tarefa introduzir testes automatizados, documente o runner e comandos reais
no `package.json` e neste guia. Priorize regressões e comportamento observável.
Na entrega, informe checks executados, resultados e o que não foi validado;
diferencie falhas preexistentes de regressões da mudança.

## Considerações de segurança

- Nunca adicione senhas, tokens reais, chaves privadas ou dados pessoais/clínicos
  a código, fixtures, logs ou documentação. Toda variável `VITE_*` é pública.
- O token de sessão atualmente fica em `localStorage` sob a chave `token`.
  Preserve a limpeza no logout/expiração; não registre tokens ou senhas e evite
  HTML não confiável e `dangerouslySetInnerHTML` sem sanitização adequada.
- Preserve a validação de redirecionamentos internos do fluxo de autenticação.
  Não permita URLs externas ou caminhos `//` vindos de entradas não confiáveis.
- A autorização definitiva deve ocorrer no backend. Não remova verificações de
  roles/permissões nem trate controles do frontend como garantia de segurança.
- Ao alterar autenticação entre origens, confira HTTPS, CORS, cookies e proteção
  contra CSRF com o backend; preserve o contrato existente de credenciais.
- Não exponha o servidor de desenvolvimento publicamente por padrão. O Compose
  local publica a porta apenas em `127.0.0.1`.

## Etapas de implantação

O artefato publicável é `dist/`. O Dockerfile gera esse diretório no estágio
`builder` e o serve com Nginx na porta 80. `npm run preview` serve para inspeção
local, não é o procedimento de hospedagem de produção.

1. Execute os checks de código e defina `VITE_APP_ENV=production` e a base
   pública da API no ambiente de build. No Docker, forneça ambos como build args;
   os arquivos de ambiente de desenvolvimento/produção são excluídos do contexto
   pela configuração atual do `.dockerignore`.
2. Prepare proxy e HTTPS na infraestrutura. `nginx.conf` já faz fallback para
   `index.html` nas rotas da SPA, mas não possui proxy para `/api`. Se escolher
   `/api`, configure seu encaminhamento ao backend antes de publicar.
3. Gere a imagem, por exemplo, quando o proxy `/api` estiver preparado:

   ```sh
   docker build --build-arg VITE_APP_ENV=production --build-arg VITE_API_URL=/api -t clinix-frontend:<versao> .
   ```

   Substitua `<versao>` por uma tag identificável da entrega. Alternativamente,
   use a origem HTTPS real da API no build arg e configure o backend para essa
   integração. Não invente endereços de infraestrutura.
4. Publique o artefato ou imagem no ambiente escolhido e confira login, acesso
   direto a rotas, arquivos estáticos, API e permissões no navegador.
5. Preserve a versão anterior para rollback; volte ao artefato/imagem anterior
   se a validação da entrega falhar.

O `docker-compose.yml` centraliza desenvolvimento e produção. `frontend` mantém
o comportamento padrão com Vite em `127.0.0.1:5173`. `frontend-production` usa
o profile `production`, Nginx na porta 80 e build com `VITE_APP_ENV=production`.
Selecione esse serviço explicitamente com
`docker compose up --build -d frontend-production`; ativar apenas o profile sem
selecionar serviço também inclui desenvolvimento. O arquivo
`docker-compose.production.yml` foi removido.

Defina `PRODUCTION_API_URL` no ambiente do Compose ou via `--env-file` com a URL
HTTPS real da API. O padrão `/api` requer proxy na infraestrutura. Produção não
usa `env_file` nem volumes de desenvolvimento; recompile para alterar a API.
Use `docker compose --profile production down` para remover ambos os serviços.

Não há pipeline ou provedor de publicação definido no repositório. Registre a
configuração concreta quando ela for adotada; este guia não configura CI/CD.

## Critérios de entrega e revisão

- Revise o diff e mantenha apenas mudanças necessárias à tarefa.
- Confira contratos da API, acesso às páginas e distinção entre mocks e dados reais.
- Atualize documentação quando comportamento, comandos ou ambientes mudarem.
- Descreva o problema, a solução, a validação e limitações na entrega/PR. Para
  commits, prefira mensagens descritivas com prefixos como `feat:`, `fix:` ou
  `docs:`, presentes no histórico, sem presumir validação automática de mensagens.
- Não faça commit, push ou implantação apenas porque concluiu uma edição;
  execute essas etapas quando fizerem parte do pedido do usuário.
