# Prototipação — Hub de protótipos Fourmakers

Repositório de **protótipos de interface** com Vite, React, TypeScript e design system alinhado ao fourmakers-v2. A aplicação é um **hub**: página inicial com cards e rotas na **raiz do app** (ex.: `/recrutamento/analise-aderencia`), com menu lateral **Protótipos** gerado a partir do registro central.

No GitHub Pages o site fica em `https://<org>.github.io/fourmakers-prototipo/` — **sem** segmento `/prototipo/` repetido no path (o nome do repositório já identifica o hub).

## Escopo

- **Início (`/`)** — lista em cards dos protótipos registrados (atalhos para cada `path` do registro).
- **Features** — cada protótipo usa o `path` na raiz em `registry.ts` (ex.: `/analise-aderencia`, `/metricas-app`); URLs antigas (`/prototipo/...`, `/recrutamento/...`, etc.) redirecionam automaticamente.

Por defeito as telas usam **Header**, **Sidebar** e **área de conteúdo** do `MainLayout`. Entradas com `layout: "fullscreen"` no registro ficam **fora** do `MainLayout` e ocupam toda a viewport (ex.: `/showcase`), mantendo o item no menu e o card na home.

---

## Padrão de design (obrigatório)

- **Layout:** `MainLayout` (Header + Sidebar + `Outlet`). Novas rotas de protótipo: filhas de `<Route element={<MainLayout />}>` em `App.tsx` (ou geradas a partir de `PROTOTIPO_REGISTRY`).
- **Título de página:** `PageHeader` (`@/components/layout/PageHeader`) ou `h1.page-title` + `p.page-subtitle`.
- **Cores e espaçamento:** apenas tokens (`tailwind.config.ts`, `src/index.css`). Ex.: `bg-background`, `border-borderSoft`, `text-primaryText`, `shadow-softToken`.
- **Tabelas:** `DataTable` em `Card` + `CardContent className="p-6"` (ver `DATATABLE_PATTERN.md`).
- **Modais:** `DialogHeader`, `DialogBody`, `DialogFooter` (ver `MODAL_FORM_PATTERN.md`).
- **Botões:** `Button` de `@/components/ui/button`.
- **Guia DS:** `public/design-toolkit.md`.

---

## Onde ficam as coisas

| Recurso | Local |
|--------|--------|
| **Registro de protótipos (rotas + menu + cards + doc .md para download)** | `src/prototipo/registry.ts` (`documentationMarkdownFile` opcional) |
| **Páginas do módulo** | `src/prototipo/pages/` |
| Showcase (tela cheia `/showcase`) | `src/prototipo/showcase/` · vídeos e posters em `public/showcase/` |
| Página inicial (hub) | `src/prototipo/pages/PrototipoHomePage.tsx` |
| Página 404 | `src/pages/NotFound.tsx` |
| Componentes de UI (DS) | `src/components/ui/` |
| Layout | `src/components/layout/`, `src/components/Sidebar.tsx` |
| Dados mockados | `src/data/`, `src/mocks/` |
| Hooks | `src/hooks/` |
| Tokens | `src/index.css`, `tailwind.config.ts` |

---

## Como criar um novo protótipo

1. **Criar a página** em `src/prototipo/pages/NomeDaFeaturePage.tsx` (export nomeado).
2. **Registrar** em `src/prototipo/registry.ts`: importe o componente e adicione um objeto com `id`, `path` (ex.: `/slug-kebab` na raiz — **sem** `/prototipo/` nem módulo tipo `/recrutamento/`), `menuGroup`, `menuLabel`, `cardTitle`, `cardDescription`, `routeSlug` (igual ao slug do path), `Component`, e opcionalmente **`documentationMarkdownFile`** e **`layout: "fullscreen"`** (tela cheia, sem Header/Sidebar). URLs legadas: `src/prototipo/legacyRoutes.ts`.
3. A rota em `App.tsx` é criada **automaticamente** a partir do registro; o item aparece no grupo **Protótipos** no menu e no grid da home.

Não é necessário editar o `Sidebar` manualmente para novos itens.

---

## Checklist rápido

- [ ] Página com `PageHeader` (ou título + subtítulo).
- [ ] Tokens apenas (sem cores soltas do Tailwind sem token).
- [ ] Entrada em `PROTOTIPO_REGISTRY` com `path` único na raiz (sem `/prototipo/`).
- [ ] Se existir doc técnica em `docs/`, `documentationMarkdownFile` + ficheiro `*_DOCUMENTACAO_TECNICA.md` (sincronizado para `public/docs/` via build ou `npm run sync:prototipo-docs`).

---

## Build local (homologação / preview)

- **Build HML:** `npm run build:hml`
- **Preview em http://127.0.0.1:8080:** `npm run preview:8080`
- **Build + preview:** `npm run preview:hml` ou `npm run validate:hml` / `npm run validate:local` (preview em **http://localhost:8080/**).
- **Cursor:** **`/PROTOTIPO_validacao_local`** — ver `.cursor/commands/PROTOTIPO_validacao_local.md`.
- **Deploy GitHub + URL de preview:** **`/PROTOTIPO_deploy`** — lê credenciais em `~/Desktop/PROTOTIPO_FOURMAKERS_DEPLOY_CREDENTIALS.md` (template no Desktop); push só em **`main`** com commit seguro; actualiza metadata de deploy nesse ficheiro.
- **GitHub Pages (site do repositório):** não publiques **main** + pasta **/** (o `index.html` da raiz tem `/src/main.tsx` — só para `vite dev`). Usa o workflow **Deploy GitHub Pages**: faz push em `main`, espera o job verde, e em **Settings → Pages → Deploy from a branch** escolhe **gh-pages** e pasta **/ (root)**. O workflow envia só `dist/` (JS/CSS compilados) com `VITE_BASE_PATH` correcto. URL típica: `https://<user>.github.io/<repo>/`.
- **Dev:** `npm run dev` (porta 8080 em `vite.config.ts`)

---

## Stack

- Vite, React 18, TypeScript
- React Router, TanStack Query
- Tailwind CSS (`src/index.css`, `tailwind.config.ts`)
- shadcn/ui (Radix) em `src/components/ui/`
- Ícones: `lucide-react`

---

## Documentação de padrões

- **Layout:** `src/components/layout/README.md`
- **DataTable:** `DATATABLE_PATTERN.md`
- **Modal:** `MODAL_FORM_PATTERN.md`
- **Auditoria DS:** `DESIGN_SYSTEM_AUDIT.md`
- **Toolkit:** `public/design-toolkit.md`
- **Dashboard comercial (Qualidade da base):** `docs/DASHBOARD_COMERCIAL_DOCUMENTACAO_TECNICA.md` — documentação técnica **única** (contratos, regras, UX, QA); UI em `src/prototipo/dashboard-comercial/`.
- **Orientação para doc técnica de protótipos:** `docs/ORIENTACAO_DOCUMENTACAO_TECNICA_PROTOTIPOS_EXTERNOS.md`
- **Modelo de doc “rica” (referência):** `docs/_MODELO_MEUS_TALENTOS_DOCUMENTACAO_TECNICA.md`

---

## BMAD e comando de documentação

- **BMAD:** pasta `_bmad/` (config), pacote npm `bmad-builder` (devDependency), skills em `.agents/skills/` (ex.: `bmad-quick-dev`, `bmad-workflow-builder`). Artefactos gerados vão para `_bmad-output/` (ignorado no Git).
- **Cursor:** ao finalizar um protótipo, usar o comando **`/PROTOTIPO_documentacao`** — ver `.cursor/commands/PROTOTIPO_documentacao.md` e `.cursor/README.md`.
