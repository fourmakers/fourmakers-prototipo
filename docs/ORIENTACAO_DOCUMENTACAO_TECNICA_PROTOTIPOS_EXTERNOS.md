# Guia para documentação técnica de protótipos externos (autocontido)

Este documento é **autocontido** para uso em ambientes **sem acesso ao repositório** (Firebase Studio, Lovable, Gemini Studio, FlutterFlow, Figma + código, etc.). Ele incorpora as **mesmas regras** que `ORIENTACAO_DOCUMENTACAO_TECNICA_FEATURES.md` (guia interno do projeto), para que o Markdown gerado possa ser colado em `docs/` e validado pelo time com **mínimo de retrabalho**.

**Uso:** Envie este guia + a descrição da tela/fluxo do protótipo para a ferramenta de geração. O resultado deve ser um único arquivo Markdown pronto para ser salvo como documentação da feature e usado pelo backend .NET 8 e pelo front para integração.

- **Criado em:** 16/04/2026  
- **Última atualização:** 16/04/2026 (alinhamento com `ORIENTACAO_DOCUMENTACAO_TECNICA_FEATURES.md`: metadados do documento, estrutura mínima, rodapé, auditoria de Design System)

---

## Relação com o guia interno do projeto

| Onde | O quê |
|------|--------|
| **Este arquivo** | Prompt autocontido para **geradores externos** (não depende de clonar o repo). |
| **`ORIENTACAO_DOCUMENTACAO_TECNICA_FEATURES.md`** | Guia completo para quem está **no repositório**; referencia arquivos em `docs/` e `ARCHITECTURE.md`. |
| **Resultado esperado** | O Markdown gerado com **este** guia deve ser **equivalente**, em estrutura e obrigatoriedades, ao que o guia interno pede (seções mínimas, padrões de contrato, metadados de criação/atualização). |

Quando o documento gerado for **importado para o projeto**, o time deve conferir contra o modelo `docs/FEEDBACK360_DOCUMENTACAO_TECNICA.md` e contra `ORIENTACAO_DOCUMENTACAO_TECNICA_FEATURES.md` (ajuste fino de nomes e rotas).

---

## Parte A – Regras fixas de contratos (obrigatório em toda documentação gerada)

Toda documentação técnica gerada **deve** seguir estas regras. Inclua-as no próprio documento gerado (em uma seção **“Padrões de contratos do projeto (consistência)”**) para o time validar. Estão alinhadas à tabela de padrões do guia interno.

### A.1 Nomenclatura em JSON e APIs

- **Sempre camelCase** em propriedades JSON (request e response).  
  Exemplos: `codigoInternoColaborador`, `dataCriacao`, `nomeColaborador`, `dataInteracao`, `orgId`.

- **Datas:**  
  - Data de criação do registro: propriedade **`dataCriacao`** (string em formato ISO 8601 ou YYYY-MM-DD).  
  - Data de última alteração (quando houver auditoria): **`dataAlteracao`**.  
  - Evitar nomes como `criadoEm`, `createdAt`; preferir **`dataCriacao`**.

- **Identificador de colaborador (pessoa/usuário):**  
  Nos contratos da feature (request/response), usar **`codigoInternoColaborador`** para o código único do colaborador.  
  Se o protótipo ou outra API usar outro nome (ex.: `codigoColaboradorInterno`), documentar que é o **mesmo valor** e que na integração o backend/front deve expor/mapear como **`codigoInternoColaborador`** (no projeto, algumas APIs retornam `codigoColaboradorInterno` — tratar como equivalente após alinhamento).

- **Identificadores numéricos:**  
  Podem ser `id` (number ou string/GUID). Preferir tipo consistente em toda a feature (ex.: string para GUID).

### A.2 Envelope padrão de resposta HTTP (todas as APIs)

Toda resposta de API (listagem, criação, atualização, exclusão) deve seguir este formato:

```json
{
  "retorno": <objeto ou array conforme o endpoint>,
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

- **retorno:** objeto (ex.: item criado) ou array (ex.: lista). Em erro, pode ser null ou omitido.
- **sucesso:** boolean. `false` em falha de validação ou regra de negócio.
- **mensagem:** string ou null. Mensagem geral (ex.: “Colaborador não encontrado”).
- **erros:** `string[] | null` — lista de mensagens de validação (ex.: `["Campo X é obrigatório", "Data inválida"]`).

Em erro (4xx/5xx), retornar o mesmo envelope com `sucesso: false`, `mensagem` preenchida e, se aplicável, `erros` com a lista de falhas.

### A.3 Autenticação

- Assumir que as chamadas são autenticadas com **Bearer token** no header:  
  `Authorization: Bearer {token}`.  
- O backend obtém o usuário/colaborador a partir do token para associar “autor”, “responsável”, etc.

### A.4 Resumo da tabela de padrões (incluir no doc gerado)

| Aspecto | Padrão | Uso |
|---------|--------|-----|
| **Nomenclatura JSON** | camelCase | Ex.: `codigoInternoColaborador`, `dataCriacao`, `nomeColaborador` |
| **Envelope de resposta** | `retorno`, `sucesso`, `mensagem`, `erros?` | Todas as APIs de listagem/criação/atualização |
| **Data de criação** | `dataCriacao` (string ISO ou YYYY-MM-DD) | Em entidades e DTOs de resposta |
| **Data de alteração** | `dataAlteracao` (quando houver auditoria) | Idem |
| **Identificador de colaborador** | `codigoInternoColaborador` nos contratos de domínio | Request/response; nota sobre equivalência com outros nomes de API |
| **Erros de validação** | `erros?: string[] \| null` no envelope | Respostas de erro ou validação |

---

## Parte A.5 – Metadados do documento gerado (obrigatório)

Alinhado à **seção 4** do guia interno (`ORIENTACAO_DOCUMENTACAO_TECNICA_FEATURES.md`):

**Obrigatório:** O arquivo de documentação técnica gerado deve informar **quando foi criado** e **quando foi atualizado pela última vez**.

- **Onde colocar:** No início do documento (após o título ou na primeira seção) ou ao final, em bloco único e visível.
- **Formato sugerido:**
  - **Criado em:** DD/MM/AAAA (opcional: responsável ou origem — ex.: “Protótipo Lovable”).
  - **Última atualização:** DD/MM/AAAA (opcional: breve motivo — ex.: “Ajuste de contratos após code review”).
- **Ao atualizar:** Sempre alterar a data (e, se fizer sentido, o motivo) de “Última atualização”.

Isso vale **também** quando a documentação for gerada fora do repositório e depois importada para `docs/`.

---

## Parte B – Estrutura mínima do documento a ser gerado

Gere um único arquivo Markdown com as seções abaixo (equivalente à **estrutura mínima** do guia interno, seção 5). Preencha com base na descrição do protótipo/tela. **Não invoque** nomes de arquivos ou pastas do projeto **no corpo narrativo** (exceto na linha final sugerida, se quiser alinhar ao repo após importação). Descreva em termos de “a tela”, “a API”, “o backend”, “o front”.

### 1. Título, introdução e metadados

- Título: **`[Nome da Feature] – Documentação Técnica (Regras de Negócio e Backend)`**.
- Parágrafo curto: para que serve a documentação (suporte ao backend .NET 8 e à integração com o front), e se a feature já está integrada ou ainda é apenas protótipo/esperada.
- **Criado em** e **Última atualização** (Parte A.5).

### 2. Visão geral e objetivo

- **Objetivos principais (visão de produto):** Lista em tópicos do que a feature busca alcançar (centralizar, automatizar, guiar, fornecer visibilidade, garantir conformidade). Use bullet points com verbos no infinitivo.
- **Tabela resumida:**

| Item | Descrição |
|------|-----------|
| **Rota(s)** | Ex.: `/minha-feature` ou múltiplas rotas se houver portal/painel separados. |
| **Título** | Título exibido na tela. |
| **Descrição (UI)** | Frase curta que aparece na interface ou descreve a tela. |
| **Objetivo de negócio** | O que o usuário ou o negócio alcança com essa tela. |
| **Escopo atual** | O que está na primeira versão; o que ficou de fora (opcional). |

- **Personas (se aplicável):** Se houver mais de um tipo de usuário, nomear cada um e a experiência (ex.: RH vs candidato).

### 3. Parâmetros de entrada e contexto

- **Autenticação:** Bearer token (`Authorization`).
- **Parâmetros de rota ou query:** Listar o que a URL recebe; se nada, informar “Nenhum”.
- **Dependências de outras APIs:** Descrever dados necessários (ex.: “lista de colaboradores”) sem fixar arquivo de código; pode citar “endpoints já existentes no sistema” de forma genérica.

### 4. Padrões de contratos do projeto (consistência)

Reproduzir a **Parte A** (tabela + envelope + notas). Indicar que os exemplos JSON abaixo seguem essas regras.

### 5. Regras de negócio

- Conceitos importantes (níveis, status, permissões).
- Obrigatoriedade condicional.
- **Regras críticas em destaque:**
  - **Bloqueios de avanço** (condição, mensagem/estado visual).
  - **Obrigatoriedade de motivo** (quando aplicável).
  - **Auditoria** (quem, o quê, data/hora).

### 6. Fluxos por persona (quando houver mais de um perfil)

Um fluxo por persona com subtítulos. Se houver apenas um perfil, usar uma única seção “Funcionalidades e experiência do usuário” (ou fundir com a seção 7).

### 7. Funcionalidades, experiência do usuário e eventos

- Passo a passo por fluxo (“Ao abrir”, “Ao submeter”, etc.).
- **Eventos e ações desencadeadas:** gatilho, confirmação (modal), efeitos em sequência.
- **Estados da interface:** bloqueado, carregando, vazio, erro; badges/indicadores.
- **Itens e módulos:** listas, abas, checklists; labels e mensagens visíveis.

### 8. Regras de sucesso, erro e bloqueios (UX)

- Sucesso (toast, redirecionamento, atualização de lista).
- Erro por cenário (o que o usuário vê e pode fazer); mensagens para `mensagem`/`erros`.
- Bloqueios (condição, UI, o que desbloqueia).

### 9. Linguagem e tom (visão de produto)

Tom positivo e simples; evitar jargões; exemplos de frases a usar ou evitar.

### 10. APIs necessárias (backend .NET 8)

Para **cada** endpoint:

- Método e rota; headers; query ou corpo; exemplo **200** com **envelope** completo.
- **Contrato sugerido (C#):** DTOs com propriedades em PascalCase alinhadas ao JSON.

**Serviços/operações em abstração (quando aplicável):** Nome — *Entrada* / *Saída* / *Lógica* em uma frase (OCR, IA, processamento assíncrono, etc.).

### 11. Modelos de dados (contratos)

- Tabelas de propriedades (camelCase no JSON, tipo, obrigatório, descrição).
- Payload de criação/edição.
- Envelope de respostas.

### 12. Dependências de APIs e dados existentes

Dados que a feature assume; alinhamento de identificadores; uso do usuário do token.

### 13. Fluxo resumido (backend)

Passos por operação principal (token → validação → regras → persistência → resposta).

### 14. Propostas de melhorias (evolução da feature)

Filtros no servidor, paginação, CRUD faltante, auditoria, exportação, notificações, etc.

### 15. Cenários de erro e pontos de atenção

Erros que o backend deve tratar; impacto (tabelas, FKs, segurança).

### 16. Resumo para o time

- Feature em uma frase.
- APIs a implementar e APIs já usadas.
- Contratos em uma linha.
- Pontos de atenção.

### 17. Rodapé e nome do arquivo (quando o doc entrar no repositório)

- Frase sugerida (alinhada ao guia interno):  
  *“Documento alinhado à stack React (ver `ARCHITECTURE.md` no repositório) e ao padrão de APIs do projeto. Última atualização: [data].”*  
  Se o Markdown ainda for **só externo**, pode usar a variante genérica:  
  *“Documento gerado para integração com backend .NET 8 e front. Última atualização: [data].”*

**Nome e local sugeridos após importação:**

- **Pasta:** `docs/`
- **Nome:** `[NOME_DA_FEATURE]_DOCUMENTACAO_TECNICA.md`
- **Encoding:** UTF-8

---

## Parte B.1 – Documentação “rica” (produto e UX)

Quando a feature tiver **múltiplos perfis**, **ações com confirmação**, **estados bloqueados** ou **mensagens sensíveis ao tom**, as seções **2 (objetivos e personas), 5 (regras críticas), 6 (fluxos por persona), 7 (eventos e estados), 8 (sucesso/erro/bloqueios) e 9 (linguagem e tom)** devem ser preenchidas com o mesmo nível de detalhe que um documento de referência “completo” do projeto (ex.: módulos com jornada de usuário e admissão digital). Isso corresponde à orientação do guia interno sobre **documentação mais rica**.

---

## Parte B.2 – Design System e auditoria (após integração ao repo)

Quando o documento gerado for **incorporado** ao repositório:

- Se existir **`DESIGN_SYSTEM_AUDIT.md`** e a feature for auditada: feature **sem** doc em `docs/` → criar documentação ao corrigir achados; feature **com** doc → atualizar quando contratos ou UX mudarem.
- Esta parte **não** precisa ser preenchida pelo gerador externo se não houver contexto; pode ser um parágrafo placeholder: *“Após merge no repositório, alinhar com a auditoria de Design System do projeto, se aplicável.”*

---

## Parte C – Instruções para a ferramenta generativa

Ao receber este guia junto com a descrição do protótipo:

1. **Entrada:** Descrição da tela ou fluxo (texto, capturas, link): nome da feature, rota, formulários, listagens, filtros, modais, ações CRUD.
2. **Regras:** Aplicar **sempre** a Parte A (camelCase, envelope com `retorno`/`sucesso`/`mensagem`/`erros`, `dataCriacao`/`dataAlteracao`, `codigoInternoColaborador`). Não usar `createdAt`, `criadoEm` ou snake_case no JSON.
3. **Metadados:** Incluir **Criado em** e **Última atualização** no documento gerado (Parte A.5); usar a data corrente para criação se não for informada.
4. **Estrutura:** Um único Markdown seguindo a Parte B (seções 1 a 17). Adaptar subseções ao contexto. Priorizar seções “ricas” (Parte B.1) quando o protótipo tiver perfis múltiplos ou fluxos sensíveis.
5. **Conteúdo:** Preencher com base na descrição; rotas indefinidas → placeholders explícitos.
6. **Sem referências internas no núcleo:** No texto principal, não listar caminhos de arquivos do repositório. A linha final pode mencionar `ARCHITECTURE.md` **apenas** na variante “após importação” (seção 17).
7. **Pós-geração (humano ou time com repo):** Conferir o resultado contra `docs/FEEDBACK360_DOCUMENTACAO_TECNICA.md` e `ORIENTACAO_DOCUMENTACAO_TECNICA_FEATURES.md` e ajustar nomes/rotas.
8. **Sem backend ainda:** Documentar “APIs necessárias” e “Modelos” com base no que o protótipo espera; o backend implementa depois com esforço mínimo.
9. **Output:** Markdown completo, nome sugerido `[NOME_DA_FEATURE]_DOCUMENTACAO_TECNICA.md`, UTF-8.

---

*Este guia é voltado a **protótipos externos** sem acesso ao código. Para trabalho **dentro** do repositório, use também **`ORIENTACAO_DOCUMENTACAO_TECNICA_FEATURES.md`**. Referência de exemplo completo no projeto: **`docs/FEEDBACK360_DOCUMENTACAO_TECNICA.md`**. Arquitetura: **`ARCHITECTURE.md`**.*
