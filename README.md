# Clinix Frontend

Frontend React + TypeScript, construido com Vite.

## Ambientes

| Ambiente | Arquivo | Comando |
| --- | --- | --- |
| Local | `.env.local` (nao versionado) | `npm run dev` |
| Desenvolvimento compartilhado | `.env.development` | `npm run dev:development` ou `npm run build:development` |
| Producao | `.env.production` | `npm run build` |

Copie `.env.example` para `.env.local` ao preparar uma nova maquina. O arquivo
local ja esta ignorado pelo Git. O comando local usa internamente o modo Vite
`localdev`, pois `local` e um nome reservado pelo proprio Vite.

Variaveis disponiveis:

- `VITE_APP_ENV`: `local`, `development` ou `production`.
- `VITE_API_URL`: origem da API, sem `/` no final. Pode ser uma URL HTTPS ou um
  caminho relativo como `/api`.

Os builds de desenvolvimento e producao usam `/api` por padrao. Configure o
servidor web para encaminhar esse caminho ao backend ou sobrescreva
`VITE_API_URL` no CI/CD antes do build.

## Seguranca das variaveis

Toda variavel `VITE_*` e incorporada ao bundle e pode ser lida por qualquer
pessoa no navegador. Portanto, esses arquivos devem conter apenas configuracao
publica. Senhas, chaves privadas, segredos JWT, credenciais de banco e tokens de
servico devem ficar no backend ou no gerenciador de segredos da plataforma.

Variaveis de CI/CD tem precedencia sobre os arquivos versionados. Use variaveis
protegidas na plataforma de publicacao para valores especificos da
infraestrutura. O build falha cedo se as variaveis obrigatorias estiverem
ausentes ou invalidas, e rejeita API HTTP em producao.

## Validacao

```bash
npm run lint
npm run build:development
npm run build:production
```
