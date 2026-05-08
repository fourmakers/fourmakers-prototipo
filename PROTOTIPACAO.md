# Prototipação — Hub de protótipos Fourmakers

Repositório de **protótipos de interface** com Vite, React, TypeScript e design system alinhado ao fourmakers-v2. A aplicação é um **hub**: página inicial com cards e rotas sob **`/prototipo/*`**, com menu lateral **Protótipos** gerado a partir do registro central.

## Escopo

- **Início (`/`)** — lista em cards dos protótipos registrados (atalhos para `/prototipo/...`).
- **Módulo `/prototipo/*`** — cada feature em prototipação vive em uma rota filha; novos itens entram no menu automaticamente quando adicionados ao registro.

Todas as telas usam **Header**, **Sidebar** e **área de conteúdo** do `MainLayout`.

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
2. **Registrar** em `src/prototipo/registry.ts`: importe o componente e adicione um objeto com `id`, `path` (`/prototipo/slug-kebab`), `menuLabel`, `cardTitle`, `cardDescription`, `routeSlug`, `Component`, e opcionalmente **`documentationMarkdownFile`** (ex.: `MINHA_FEATURE_DOCUMENTACAO_TECNICA.md`) para o botão de download na home. Os `.md` em `docs/` são copiados para `public/docs/` ao correr `npm run sync:prototipo-docs` (incluído em `dev` e `build`).
3. A rota em `App.tsx` é criada **automaticamente** a partir do registro; o item aparece no grupo **Protótipos** no menu e no grid da home.

Não é necessário editar o `Sidebar` manualmente para novos itens.

---

## Checklist rápido

- [ ] Página com `PageHeader` (ou título + subtítulo).
- [ ] Tokens apenas (sem cores soltas do Tailwind sem token).
- [ ] Entrada em `PROTOTIPO_REGISTRY` com `path` único sob `/prototipo/`.
- [ ] Se existir doc técnica em `docs/`, `documentationMarkdownFile` + ficheiro `*_DOCUMENTACAO_TECNICA.md` (sincronizado para `public/docs/` via build ou `npm run sync:prototipo-docs`).

---

## Build local (homologação / preview)

- **Build HML:** `npm run build:hml`
- **Preview em http://127.0.0.1:8080:** `npm run preview:8080`
- **Build + preview:** `npm run preview:hml` ou `npm run validate:hml` / `npm run validate:local` (preview em **http://localhost:8080/**).
- **Cursor:** **`/PROTOTIPO_validacao_local`** — ver `.cursor/commands/PROTOTIPO_validacao_local.md`.
- **Deploy GitHub + URL de preview:** **`/PROTOTIPO_deploy`** — lê credenciais em `~/Desktop/PROTOTIPO_FOURMAKERS_DEPLOY_CREDENTIALS.md` (template no Desktop); push só em **`main`** com commit seguro; actualiza metadata de deploy nesse ficheiro.
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
