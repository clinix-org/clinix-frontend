# Layout Components

Esta pasta contém os componentes estruturais do painel da aplicação, projetados com React e Tailwind CSS.

## 📦 Componentes Incluídos

- **`Header`**: Cabeçalho principal (Top bar) que exibe a logo "Clinix", notificações e perfil do usuário (Administrador) fixo no topo.
- **`Sidebar`**: Barra lateral de navegação com opções como "Gestão de usuários", "Gestão de medicamentos", etc. Possui um botão de minimizar que altera a visualização para manter flexibilidade e focar somente nos ícones.
- **`MainLayout`**: Componente wrapper que orquestra e unifica o `Header` e o `Sidebar`. Gerencia o estado de colabso (minimizar/expandir) para redimensionar automaticamente a área do conteúdo da aplicação (`main` usando o `<Outlet />` do react-router).

## 🚀 Uso

Esses componentes são integrados diretamente através do roteamento da aplicação (`src/routes/ProtectedRouter.tsx`), garantindo que a estrutura visual esteja presente globalmente em cada tela restrita a usuários logados.
