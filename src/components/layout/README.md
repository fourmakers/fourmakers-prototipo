# Layout padrão (fourmakers)

Todas as rotas são envolvidas pelo `MainLayout`, que fornece:

- **Header** fixo no topo (logo sempre visível, tema, usuário)
- **Sidebar** à esquerda (navegação e sair)
- **Área de conteúdo** com padding e background padronizados

## Padding da área de conteúdo (fourmakers-v2)

- Desktop: `0.5rem 3rem 2rem` (py-2 px-12 pb-8)
- Até 1080px: `0.5rem 1.5rem 3rem` (py-2 px-6 pb-12)
- Background: `bg-background` (token do design system)

## Tipografia (classes em `index.css`)

- **.page-title** – título principal da página (1.5rem, bold, primary-text)
- **.page-subtitle** – subtítulo (0.875rem, secondary-text)
- **.page-section-title** – título de seção (0.75rem, uppercase, secondary-text)

## Título em toda página (padrão fourmakers-v2)

Todas as páginas devem ter um título no topo do conteúdo:

- Use o componente **`PageHeader`** quando precisar de título + descrição + ações:  
  `<PageHeader title="Título" description="Descrição opcional" actions={…} />`
- Ou use diretamente `<h1 className="page-title">Título</h1>` e `<p className="page-subtitle">Descrição</p>`.

## Novas páginas de protótipo

1. Criar a página em `src/prototipo/pages/` e adicionar a entrada em **`src/prototipo/registry.ts`** (rota `/prototipo/...`, rótulo do menu e metadados do card na home).
2. O `App.tsx` gera a rota a partir do registro; o menu **Protótipos** atualiza sozinho.
3. Inclua sempre um título (`PageHeader` ou `h1.page-title`) no topo.

Checklist completo: **PROTOTIPACAO.md** na raiz do projeto.
