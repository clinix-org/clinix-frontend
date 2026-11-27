# Clinix Web (Frontend)

Interface web em **React 19 + TypeScript 5.9**, construída com **Vite 7** para o
sistema **Clinix**.

![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Build-Vite%207-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

---

## Sobre o projeto

O **Clinix Web** é a interface administrativa da plataforma **Clinix**, com
login, controle de acesso, dashboard, usuários, medicamentos, relatórios e
configurações. A navegação utiliza React Router e a comunicação com a API
utiliza Axios.

Algumas telas ainda utilizam dados demonstrativos ou operações em memória. Esses
fluxos não representam persistência no backend.

Após um login válido e a validação da sessão, todos os perfis são direcionados à
tela inicial (`/dashboard`), disponível para qualquer usuário autenticado. As
demais páginas mantêm os requisitos de perfil e permissões do catálogo,
inclusive no acesso direto por URL.

Acesse a plataforma [Clinix](https://clinix-saude.vercel.app/).

---

## Pré-requisitos

Para executar diretamente na máquina:

| Requisito                                                   | Como verificar                                                                      |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Node.js 26 e npm 11                                         | `node --version` e `npm --version`                                                  |
| Git                                                         | `git --version`                                                                     |
| Backend configurado e em execução para os fluxos integrados | Consulte o [README do backend](https://github.com/clinix-org/clinix-backend#readme) |

Para executar o frontend em container, utilize Docker com Docker Compose. Nesse
caso, não é necessário instalar Node.js ou npm na máquina.

---

## Início rápido

**1. Clonar e entrar no projeto**

```bash
git clone https://github.com/clinix-org/clinix-frontend.git
cd clinix-frontend
```

**2. Instalar as dependências**

```bash
npm ci
```

Use npm e o `package-lock.json` para manter as versões das dependências
consistentes.

**3. Criar o `.env.local`**

Copie o arquivo de exemplo somente se o `.env.local` ainda não existir.

Linux / macOS:

```bash
cp -n .env.example .env.local
```

Windows (PowerShell):

```powershell
if (-not (Test-Path .env.local)) {
  Copy-Item .env.example .env.local
}
```

O exemplo utiliza a API local na porta 8090:

```env
VITE_APP_ENV=local
VITE_API_URL=http://localhost:8090
```

O `.env.local` não é versionado. Ajuste `VITE_API_URL` se o backend estiver em
outro endereço e inicie a API seguindo o
[guia do backend](https://github.com/clinix-org/clinix-backend#readme). O Vite
carrega as variáveis automaticamente; não é necessário exportá-las manualmente.

**4. Rodar o frontend**

```bash
npm run dev
```

**Pronto.** Acesse o endereço informado pelo Vite, normalmente
[http://localhost:5173](http://localhost:5173). Se a porta estiver ocupada, o
servidor local pode escolher outra porta.

---

## Frontend via Docker

O container `clinix-saude-frontend` serve a versão compilada com Nginx, a mesma
usada no servidor.

Inicie primeiro o Compose do repositório `clinix-backend`, que cria a rede
compartilhada. Depois, na raiz deste repositório:

```bash
docker compose up -d --build
docker compose logs -f frontend
```

Acesse [http://localhost:8091](http://localhost:8091). Use Ctrl+C para sair dos logs;
o container continua rodando em segundo plano.

A porta 8091 só aceita conexões da própria máquina; altere com `FRONTEND_PROD_PORT`.
O Nginx encaminha `/api` ao container `clinix-saude-backend`. O `.env.local` não é
usado no Docker.

Para consultar o estado e os logs recentes:

```bash
docker compose ps
docker compose logs --tail=100 frontend
```

Depois de alterar o código, execute novamente `docker compose up -d --build`.

---

### Desenvolvimento no Docker com hot reload

Com o Compose do backend em execução, rode na raiz do frontend:

```bash
docker compose up -d --build frontend-dev
```

Acesse [http://localhost:5173](http://localhost:5173). O Vite acompanha as
alterações do código e encaminha `/api` ao backend pela rede compartilhada.
Se o lockfile mudar, use
`docker compose up -d --build --renew-anon-volumes frontend-dev`
para atualizar as dependências do container. Para parar esse serviço, use
`docker compose stop frontend-dev`.

## Ambientes e variáveis

| Ambiente                      | Arquivo                       | Comando                                                  |
| ----------------------------- | ----------------------------- | -------------------------------------------------------- |
| Local                         | `.env.local` (não versionado) | `npm run dev` ou `npm run dev:local`                     |
| Desenvolvimento compartilhado | `.env.development`            | `npm run dev:development` ou `npm run build:development` |
| Produção                      | `.env.production`             | `npm run build` ou `npm run build:production`            |

O comando local usa o modo Vite `localdev`, pois `local` é um nome reservado
pelo Vite. O `.env.local` também é carregado nos demais modos; os arquivos
específicos do modo têm precedência sobre ele. Variáveis já definidas no
processo têm precedência sobre os arquivos de ambiente.

| Variável       | Finalidade                                                                |
| -------------- | ------------------------------------------------------------------------- |
| `VITE_APP_ENV` | Ambiente da aplicação: `local`, `development` ou `production`             |
| `VITE_API_URL` | Base da API, sem barra final; URL HTTP(S) ou caminho relativo como `/api` |

Os arquivos de desenvolvimento e produção usam `/api` por padrão. Configure um
proxy para encaminhar esse caminho ao backend ou defina a URL da API antes do
build. O Nginx inclui esse proxy e o Vite o ativa no serviço `frontend-dev`.

### Segurança das variáveis

Toda variável `VITE_*` é incorporada ao bundle e pode ser lida no navegador. Use
apenas configuração pública: senhas, chaves privadas, segredos JWT, credenciais
de banco e tokens de serviço devem permanecer no backend ou no gerenciador de
segredos da plataforma.

A configuração é validada em `src/config/env.ts` ao carregar a aplicação.
Valores obrigatórios ausentes ou inválidos e URLs absolutas HTTP em produção são
rejeitados nessa inicialização. O build, sozinho, não garante essa validação;
confira também a aplicação no navegador.

---

## Validação e build

Execute os checks antes de entregar alterações em código:

```bash
npm run lint
npm run build:development
npm run build:production
```

Os builds verificam os tipos TypeScript e geram o bundle em `dist/`. Não há
script geral `test`; a dosagem de medicamentos possui a suíte
`npm run test:medications`. Valide também os fluxos afetados no navegador,
incluindo login, permissões e comunicação com a API. O hook de pre-commit
executa `npm run lint`.

Para inspecionar localmente o último bundle gerado:

```bash
npm run preview
```

### Publicação

O artefato publicável é `dist/`. O Dockerfile também gera esse bundle e o serve
com Nginx na porta 8080 do container, com fallback para `index.html` nas rotas da SPA.
O comando `npm run preview` serve apenas para inspeção local.

Defina `VITE_APP_ENV=production` e a base pública da API durante o build. Use
HTTPS para uma API externa ou `/api` quando houver proxy configurado. Com o
proxy `/api` preparado na infraestrutura, um exemplo de build é:

```bash
docker build --build-arg VITE_APP_ENV=production --build-arg VITE_API_URL=/api -t clinix-saude-frontend .
```

Os arquivos de ambiente de desenvolvimento e produção são excluídos do contexto
Docker; forneça os valores como build args. Alterar o `env_file` de um container
Nginx já construído não reconfigura o JavaScript: é necessário gerar outro
build.

O build do Compose fixa `VITE_APP_ENV=production` e usa `/api` como base da API,
encaminhada pelo Nginx ao backend. O container não usa `.env.local` nem monta o
código-fonte. Para mudar a base, defina `PRODUCTION_API_URL` no ambiente do
terminal ou com `docker compose --env-file` e gere outro build.

---

## Backend e documentação da API

O backend é mantido em um repositório separado:

```bash
git clone https://github.com/clinix-org/clinix-backend.git
```

Consulte o
[README do Clinix API](https://github.com/clinix-org/clinix-backend#readme) para
configurar e executar a API com H2, PostgreSQL ou Docker. Com a API local em
execução, a documentação está disponível em:

- [Swagger UI](http://localhost:8090/swagger-ui.html)
- [OpenAPI Specs](http://localhost:8090/v3/api-docs)

---

## Encerrar o ambiente

Se iniciou o Vite pelo terminal, use Ctrl+C.

Para parar o frontend em Docker:

```bash
docker compose stop frontend
```

Para encerrar e remover os containers deste Compose:

```bash
docker compose down
```

Esses comandos devem ser executados na raiz do frontend. O backend é encerrado
separadamente no seu próprio repositório.

---

## Referência rápida de diagnóstico

| Sintoma | Verificação e ação |
| --- | --- |
| Node.js incompatível | Confira `node --version` e os pré-requisitos acima |
| Docker não responde | Execute `docker ps` e confirme que o Docker Desktop está em execução |
| Container parado ou falha ao iniciar | Consulte `docker compose ps` e `docker compose logs --tail=100 frontend` |
| Porta 8091 ocupada no Docker | Pare o processo que ocupa a porta ou defina `FRONTEND_PROD_PORT` |
| Rede `clinix-saude-network` não encontrada | Inicie primeiro o Compose do `clinix-backend` |
| Interface abre, mas a API não responde | Confira `VITE_API_URL`, a disponibilidade do backend e a aba Network do navegador |
| Erro de CORS | Configure no backend a origem utilizada pelo frontend |
| Requisições para `/api` retornam HTML ou 404 | Configure o proxy ou use a URL correta da API e gere outro build |
| Erro de configuração ao abrir a aplicação | Confira os valores obrigatórios e o uso de HTTPS em produção |
| Alteração no ambiente não aparece | Reinicie o Vite; no Docker, execute `docker compose up -d --build` |

---

## Suporte e Ajuda

Encontrou um problema, identificou um bug ou tem alguma dúvida relacionada ao
**Clinix Web**? Utilize as **Issues do GitHub** para registrar sua solicitação.

- **🐛 Bug:**
  [Relatar um problema](https://github.com/clinix-org/clinix-frontend/issues/new)
- **💡 Dúvida ou sugestão:**
  [Abrir uma Issue](https://github.com/clinix-org/clinix-frontend/issues)
- **📋 Issues existentes:**
  [Consultar Issues](https://github.com/clinix-org/clinix-frontend/issues)
- **🌐 Plataforma Clinix:**
  [Acessar a plataforma](https://clinix-saude.vercel.app/)

> Ao abrir uma Issue, descreva os passos para reproduzir o problema, o resultado
> esperado e o ambiente utilizado. Não inclua senhas, tokens ou dados
> pessoais/clínicos.

## Testes da dosagem de medicamentos

Execute `npm run test:medications` com Node.js 26. A suíte usa `node:test` e
verifica dosagens positivas, limites, valores inválidos e perda de precisão. O
formulário bloqueia o envio quando o número JSON seria diferente do decimal
digitado, mantendo o contrato da API. Use escrita decimal comum, como `0.25`.

Após cadastrar um medicamento, a busca é limpa e o frontend consulta a
quantidade atual de páginas para abrir a última página da ordenação existente
por criação crescente. A consulta evita usar uma contagem antiga ou limitada
pela busca. Se essa consulta falhar, o cadastro continua confirmado e a tela
informa que a listagem precisa ser atualizada. A busca, os filtros e a ordenação
não são alterados.

## Seletores para automação de QA

O módulo de medicamentos expõe atributos `data-testid` com prefixo
`medications-`. Consulte o [catálogo de Test IDs](docs/medications-test-ids.md)
para os seletores, identificação das linhas dinâmicas e exemplos em Cypress,
Playwright, Selenium e Robot Framework. Os atributos ficam disponíveis também no
build de produção.
