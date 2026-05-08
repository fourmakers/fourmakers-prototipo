# Cursor — protótipo Fourmakers

## Comandos (`commands/`)

| Comando | Descrição |
|---------|-----------|
| **`PROTOTIPO_documentacao`** | Gera documentação técnica completa de um protótipo finalizado em `docs/[FEATURE]_DOCUMENTACAO_TECNICA.md`, alinhada a `docs/ORIENTACAO_DOCUMENTACAO_TECNICA_PROTOTIPOS_EXTERNOS.md` e ao formato rico `docs/_MODELO_MEUS_TALENTOS_DOCUMENTACAO_TECNICA.md`. |
| **`PROTOTIPO_validacao_local`** | Corre `npm run build:hml`, corrige erros de build/front até passar, e sobe `npm run preview:8080` em **http://localhost:8080/**. |
| **`PROTOTIPO_deploy`** | Lê credenciais no Desktop (`PROTOTIPO_FOURMAKERS_DEPLOY_CREDENTIALS.md`), faz commit/push na **`main`** com regras de commit seguro (sem `git add .`), e actualiza a secção **Última deploy** com SHA/data/URL de preview. |

Acionar no chat: **`/PROTOTIPO_documentacao`**, **`/PROTOTIPO_validacao_local`** ou **`/PROTOTIPO_deploy`** (ou seleccionar na paleta de comandos).

**Deploy:** preencher primeiro o template em `/Users/doug/Desktop/PROTOTIPO_FOURMAKERS_DEPLOY_CREDENTIALS.md` (não versionar).

## Rules (`rules/`)

Ver `prototipacao.mdc` e outras regras versionadas nesta pasta.

## BMAD no repositório

- **`_bmad/`** — configuração dos módulos BMAD (core, BMM, BMB).
- **`_bmad-output/`** — saídas geradas (ignorado pelo Git).
- **`bmad-builder`** — dependência de desenvolvimento em `package.json` (módulo npm oficial).
- **`.agents/skills/`** — skills BMAD (workflow builder, quick-dev, PRD, etc.) para uso com agentes no Cursor.
