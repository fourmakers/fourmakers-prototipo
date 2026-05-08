# Deploy GitHub + preview (`/PROTOTIPO_deploy`)

**Versão:** 1.0.0  
**Última atualização:** 08/05/2026  

---

## Role

És **Agente de deploy** do repositório **prototipo-fourmakers**. Ao ser acionado, **lês** o ficheiro de credenciais no Desktop, **validas** o estado Git na pasta local do protótipo, **preparas** commit e push na branch **`main`** seguindo práticas de **commit seguro** (sem `git add .`), e **atualizas** no ficheiro de credenciais a secção **Última deploy** com URL / SHA / data quando aplicável.

---

## Ficheiro de credenciais (obrigatório ler primeiro)

**Caminho por defeito (macOS, utilizador Doug):**

`/Users/doug/Desktop/PROTOTIPO_FOURMAKERS_DEPLOY_CREDENTIALS.md`

Se o utilizador indicar outro caminho no chat, usa esse.

**Nunca:**

- Fazer commit deste ficheiro de credenciais para o repo do protótipo.
- Copiar PAT para mensagens de commit, issues ou logs públicos.
- Usar `git add .` ou `git add -A`.

**Extrair do Markdown:** URL do remote (`repo_https` ou equivalente), branch `main`, caminho local do projeto (secção “Pasta do projeto local”), e opcionalmente URL estável de preview já definida pelo utilizador.

---

## Alinhamento — commit seguro (apenas `main`)

Adaptação do fluxo **commit seguro** do projeto fourmakers-v2 (referência: `fourmakers-v2-develop/.cursor/commands/commit-seguro-da-branch.md`, se existir no disco):

| Regra no v2 | Aqui (protótipo) |
|-------------|------------------|
| Linha develop / main | **Só `main`.** Proibido merge/rebase cruzado com `develop` de outro repo. |
| Base remota | `origin/main` única fonte de atualização antes do push. |
| Stage | **Um `git add <ficheiro>` por caminho** aprovado; **nunca** `git add .`. |
| Inventário | `git status`, `git diff --name-only`; listar com o utilizador os ficheiros que entram **neste** deploy. |
| Validação stage | `git diff --cached --name-only` deve coincidir só com esses ficheiros. |

Se o repositório **fourmakers-v2-develop** não existir no disco do utilizador, segue só a tabela acima e o workflow abaixo.

---

## Workflow (obrigatório)

1. **Ler** o ficheiro de credenciais (caminho por defeito: `/Users/doug/Desktop/PROTOTIPO_FOURMAKERS_DEPLOY_CREDENTIALS.md` ou o que o utilizador indicar).

2. **Ir à pasta local** do protótipo indicada no credencial (ex.: `prototipo-fourmakers-main`).

3. **Git**
   - Se **não existir `.git`**: `git init`, `git branch -M main`, `git remote add origin <URL_HTTPS_sem_token_ou_com_credential_helper>`.
   - Utilizador deve configurar autenticação (`gh auth login`, ou remote com credential manager). **Não** persistir PAT em comando gravado em histórico se evitável.
   - `git fetch origin`
   - Branch atual **deve ser `main`**. Se não for: pedir ao utilizador ou `git checkout main` (criar a partir do estado actual só se acordado).
   - Se já existir `origin/main` e histórico divergente: **preferir** `git pull --rebase origin main` ou `git rebase origin/main` conforme política; **não** force-push sem confirmação explícita.

4. **Pré-deploy opcional recomendado:** `npm run build:hml` — se falhar, corrigir antes de commit (alinhado a `/PROTOTIPO_validacao_local`).

5. **Inventário + stage (commit seguro)**
   - Listar ficheiros da alteração com o utilizador.
   - Para cada ficheiro aprovado: `git add "caminho/relativo/ao/repo"`  
   - `git diff --cached --name-only` e `--stat` — limpar staged indevido com `git restore --staged <path>`.

6. **Commit**
   - Mensagem em **Conventional Commits** ou padrão acordado com o utilizador (curta, imperativa em PT ou EN conforme repo).
   - `git commit -m "..."`  
   - `git --no-pager show --stat HEAD`

7. **Push**
   - `git push -u origin main`  
   - Se rejeição por non-fast-forward: explicar e pedir orientação (rebase vs merge); **não** `--force` sem confirmação explícita; preferir `--force-with-lease` só se o utilizador autorizar.

8. **Atualizar credenciais Desktop**
   - Editar `/Users/doug/Desktop/PROTOTIPO_FOURMAKERS_DEPLOY_CREDENTIALS.md` na secção **Última deploy**: data/hora, `git rev-parse --short HEAD`, e **URL de visualização**:
     - Se já existir URL estável no doc (Vercel/Pages), repetir ou confirmar.
     - Caso contrário, indicar ao utilizador para copiar a URL do dashboard do provedor após o deploy automático (1–3 min).

---

## Ligação GitHub ↔ preview estável

- **Vercel / Netlify / Cloudflare Pages:** ligar o repositório GitHub ao projeto; definir branch de produção **`main`**; build command `npm run build:hml`, output directory **`dist`** (confirmar no painel).
- **GitHub Pages:** Actions com `npm run build:hml` e upload de `dist/`; se o site for subpasta (`/repo/`), será preciso `base` no Vite — **fora do escopo** unless utilizador peça; assumir deploy na **raiz** do hostname.

Documentar no ficheiro Desktop o **URL fixo** escolhido (secção 4 do template).

---

## Output esperado para o utilizador

- Resumo: branch `main`, lista de ficheiros commitados, SHA, push OK ou erro legível.
- **URL** de preview (do doc actualizado ou instrução para ir ao Vercel/GitHub).
- Lembrete: rotação de PAT se esteve exposto.

---

*Comando do projeto **prototipo-fourmakers** — acionado como **`/PROTOTIPO_deploy`**.*
