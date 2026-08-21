# Perfil de Atuação Humano + Agentes – Documentação Técnica (Regras de Negócio e Backend)

Esta documentação descreve, em nível de produto e contrato, a feature **Perfil de Atuação Humano + Agentes**: um wizard que permite a um usuário descrever uma função/trabalho, revisar a interpretação da IA, definir a composição entre humano, agentes e híbrido, selecionar agentes disponíveis e publicar um perfil reutilizável. O documento serve de base para implementação do **backend .NET 8** e para a **integração com o front** que vai replicar essa experiência em outra plataforma.

A versão de referência atual é um **protótipo funcional** (React + Tailwind), com persistência local (browser) e duas integrações reais (clientes e gestores). O backend de IA, persistência e gestão de agentes ainda não existe — este documento define o que precisa ser construído.

- **Criado em:** 12/05/2026 (origem: protótipo Lovable “Perfil de Atuação”)
- **Última atualização:** 12/05/2026 (primeira versão consolidada para handoff externo)

---

## 1. Visão geral e objetivo

### Objetivos principais (visão de produto)

- **Acelerar a definição de perfis de atuação** que combinam pessoas e agentes de IA, para uso em alocação, recrutamento e dimensionamento de squads.
- **Tornar explícita a divisão de trabalho** entre o que é exclusivamente humano, o que é executado por agentes e o que é híbrido (colaboração).
- **Guiar o usuário com IA** desde a descrição livre do trabalho até uma composição final revisada e publicável.
- **Centralizar o catálogo de agentes** disponíveis por cliente, com status de disponibilidade, entradas, saídas e limitações.
- **Permitir reuso** dos perfis publicados (listar, buscar, editar, excluir) em um dashboard.
- **Garantir transparência:** todo conteúdo gerado por IA é explicitamente rotulado como sugestão, sujeita a revisão humana antes de publicação.

### Tabela resumida

| Item | Descrição |
|------|-----------|
| **Rota(s)** | `/` (wizard de criação/edição de perfil) e `/dashboard` (lista de perfis e agentes). |
| **Título** | “Criar Perfil de Atuação” (wizard) / “Dashboard de Perfis” (listagem). |
| **Descrição (UI)** | “Descreva o trabalho. A IA irá sugerir habilidades, composição (Humano + Agentes) e mostrar agentes disponíveis.” |
| **Objetivo de negócio** | Padronizar a forma de descrever funções considerando o uso de agentes de IA, reduzindo o tempo entre descrição e publicação de um perfil utilizável. |
| **Escopo atual** | Wizard de 3 passos; listagem e CRUD de perfis e agentes; integração de seleção de cliente/gestor. **Fora do escopo atual:** versionamento de perfis, compartilhamento entre orgs, exportação. |

### Personas

- **Líder/RH/Recrutador (usuário principal):** descreve um trabalho, revisa a sugestão da IA, ajusta composição, escolhe agentes e publica o perfil.
- **Administrador de catálogo de agentes:** mantém o catálogo de agentes disponíveis (criar, editar, excluir, definir status) no dashboard.

Há um único fluxo de uso final, mas a feature suporta dois modos de entrada no wizard: **criação** (perfil novo) e **edição** (perfil existente, vindo do dashboard).

---

## 2. Parâmetros de entrada e contexto

- **Autenticação:** Bearer token no header `Authorization: Bearer {token}`. O backend obtém o usuário/colaborador a partir do token e usa esse contexto como autor do perfil e para escopo por organização.
- **Parâmetros de rota:** Nenhum nas duas rotas atuais. Edição reutiliza a rota raiz e identifica o perfil em estado de aplicação (no backend, usar `id` no path: `/perfis-atuacao/{id}` para editar).
- **Query strings:** Nenhum parâmetro obrigatório.
- **Dependências de outras APIs (já existentes no sistema):**
  - Listagem de **clientes** (organizações às quais o perfil será associado).
  - Listagem de **gestores** vinculados ao cliente selecionado.
  - Ambas autenticadas via Bearer token, retornam listas paginadas com cursor + limite e suportam busca textual.

---

## 3. Padrões de contratos do projeto (consistência)

Toda API desta feature deve seguir os padrões abaixo. Os exemplos JSON nas seções 10 e 11 já estão alinhados a estas regras.

### 3.1 Nomenclatura

- **Sempre camelCase** em propriedades JSON (request e response). Ex.: `codigoInternoColaborador`, `dataCriacao`, `nomeCliente`, `composicao`, `agentesSelecionados`.
- **Datas:**
  - Data de criação: **`dataCriacao`** (string ISO 8601 ou `YYYY-MM-DD`).
  - Data de última alteração: **`dataAlteracao`**.
  - Não usar `criadoEm`, `createdAt` ou snake_case.
- **Identificador de colaborador:** usar **`codigoInternoColaborador`** nos contratos. Se alguma API legada retornar `codigoColaboradorInterno`, tratar como **mesmo valor** e expor/mapear no backend como `codigoInternoColaborador`.
- **Identificadores de domínio:** usar `id` (string/GUID) consistentemente para perfil e agente.

### 3.2 Envelope padrão de resposta

Toda resposta segue:

```json
{
  "retorno": null,
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

- `retorno`: objeto, array ou null conforme o endpoint.
- `sucesso`: boolean. `false` em validação ou regra de negócio.
- `mensagem`: string ou null. Mensagem geral.
- `erros`: `string[] | null` com mensagens de validação.

Em erros (4xx/5xx), manter o mesmo envelope com `sucesso: false`, `mensagem` preenchida e, quando aplicável, `erros` listando as falhas.

### 3.3 Autenticação

- Header obrigatório `Authorization: Bearer {token}`.
- Em ausência ou expiração: HTTP 401 + envelope com `sucesso: false`, `mensagem: "Não autenticado"`.

### 3.4 Resumo da tabela de padrões

| Aspecto | Padrão | Uso |
|---------|--------|-----|
| Nomenclatura JSON | camelCase | `codigoInternoColaborador`, `dataCriacao`, `nomeCliente` |
| Envelope de resposta | `retorno`, `sucesso`, `mensagem`, `erros?` | Todas as APIs |
| Data de criação | `dataCriacao` | Entidades e DTOs |
| Data de alteração | `dataAlteracao` | Entidades com auditoria |
| Identificador colaborador | `codigoInternoColaborador` | Autor do perfil |
| Erros de validação | `erros?: string[] \| null` | Respostas 4xx |

---

## 4. Regras de negócio

### 4.1 Conceitos importantes

- **Perfil de atuação:** entidade com nome, composição (humano/agentes/híbrido somando 100), tarefas humanas, tarefas de agentes, lista de agentes selecionados, cliente e gestor associados.
- **Composição:** três percentuais inteiros (`humano`, `agentes`, `hibrido`) que **sempre** somam 100. Significados:
  - **Funções humanas:** atividades exclusivas de pessoas naquele perfil.
  - **Funções por agentes:** atividades que os agentes vão realizar.
  - **Funções híbridas:** atividades realizadas em colaboração entre humano e agente.
- **Tarefa (TaskItem):** texto livre + `tag` ∈ `required | recommended | optional`, em uma das duas listas (humanas ou de agentes). A ordenação visual sempre prioriza `required > recommended > optional`.
- **Agente:** item do catálogo com `nome`, `categoria`, `descricao`, `entradas[]`, `saidas[]`, `limitacoes`, `status` ∈ `available | pilot | unavailable`.
- **Status do agente:**
  - `available` – pronto para uso.
  - `pilot` – em piloto, pode ser selecionado mas exibido com aviso.
  - `unavailable` – não pode ser selecionado (toggle desabilitado).
- **Confiança da IA:** `high | medium | low`, retornado pela análise do passo 2 e exibido como badge.

### 4.2 Obrigatoriedade

- Texto descritivo do trabalho (passo 1): mínimo 50 caracteres para habilitar “Analisar com IA”.
- Nome do perfil: obrigatório no momento de publicar.
- Cliente: opcional para análise, mas **obrigatório no salvamento/publicação** do perfil.
- Gestor: opcional. Só pode ser escolhido após o cliente.

### 4.3 Regras críticas em destaque

- **Bloqueio de avanço (passo 1 → passo 2):** botão “Analisar com IA” fica desabilitado se `texto.length < 50`.
- **Bloqueio de publicação:** “Publicar/Atualizar” só fica habilitado com `nomePerfil` não vazio. Composição deve somar 100 (validado e re-normalizado pelo front; o backend deve **revalidar**).
- **Soma 100 da composição:** ao mover um slider, os outros dois ajustam-se proporcionalmente para manter a soma 100. O backend rejeita payloads que não somem 100.
- **Tarefas de alto risco / decisões finais:** por convenção do produto, permanecem humanas por padrão. Exibir aviso “Tarefas de alto risco e decisões finais permanecem humanas por padrão.”.
- **Catálogo vazio:** se o cliente não tiver nenhum agente com status diferente de `unavailable`, exibir aviso “Nenhum agente disponível para este cliente. Você ainda pode publicar o perfil como 100% humano.” e permitir publicação com composição `humano: 100`.
- **Edição:** ao editar um perfil existente, o wizard abre direto no passo 3 e o botão final passa a ser “Atualizar Perfil”. O modal de publicação **não pede o nome novamente** — vem pré-preenchido para confirmação.
- **Auditoria:** todo perfil registra `dataCriacao`, `dataAlteracao` e `codigoInternoColaborador` do autor (extraído do token). Toda edição atualiza `dataAlteracao`.

---

## 5. Fluxos por persona

### 5.1 Líder / RH / Recrutador (criação)

1. Acessa a rota raiz, vê o passo 1 do wizard.
2. (Opcional) Seleciona **cliente** e **gestor**.
3. Cola/escreve a descrição do trabalho. Ao atingir 50 caracteres, “Analisar com IA” habilita.
4. Clica em “Analisar com IA”. UI entra em estado de carregamento (skeleton). Quando a análise volta, segue para o passo 2.
5. Revisa a interpretação da IA: texto categorizado por chips (decisão, rotina, entregável, comunicação), três caixas de itens detectados (Decisões, Rotinas, Entregáveis), cada uma editável (adicionar, editar inline, remover).
6. Marca “Isso representa bem o perfil” ou “Faltou algo importante”. No segundo caso, escreve feedback e clica “Reprocessar”, voltando a um estado de carregamento.
7. Avança para o passo 3.
8. Ajusta a composição via sliders (humano, agentes, híbrido — somam 100); revê listas “Decisões e responsabilidades humanas” e “Tarefas que agentes podem executar/acelerar”; pode mover tarefas entre as duas listas (botão de troca por linha).
9. Aba “Agentes Disponíveis”: filtra por categoria/busca, ativa toggles dos agentes desejados.
10. Clica “Publicar Perfil”. Modal pede o nome. Ao confirmar, o perfil é persistido e o usuário é redirecionado para `/dashboard`.

### 5.2 Líder / RH / Recrutador (edição)

1. No dashboard, clica em “Editar” no perfil desejado.
2. Wizard abre no passo 3 com toda a composição/tarefas/agentes preservados.
3. Ajusta o que precisar.
4. Clica “Atualizar Perfil”. Modal abre com o nome **já preenchido**.
5. Confirma. Perfil é atualizado, retorna ao dashboard.

### 5.3 Administrador de catálogo (gestão de agentes)

1. No dashboard, vê “Agentes Disponíveis” em grade.
2. Clica em “Novo Agente” ou “Editar” em um existente.
3. Preenche: nome, categoria, descrição, entradas (lista por vírgula), saídas (lista por vírgula), limitações, status.
4. Salva. Agente aparece imediatamente disponível para seleção em novos perfis.
5. Pode excluir um agente (sem confirmação dupla no protótipo — recomenda-se confirmar no backend integrado).

---

## 6. Funcionalidades, experiência do usuário e eventos

### 6.1 Wizard – Stepper

- Três passos numerados, sempre visíveis no topo, sticky abaixo do header.
- Pode-se voltar a um passo anterior; não se pode pular para frente sem completar o anterior.

### 6.2 Passo 1 – Descrever o trabalho

- **Dropdowns de Cliente e Gestor** com busca debounced (300 ms), carregamento inicial automático ao montar.
- **Textarea** principal com contador de caracteres e mensagem de mínimo.
- **Botões:** “Salvar rascunho” (ainda não implementado no protótipo, deve persistir um `draft`); “Analisar com IA” dispara a análise.
- **Microcopy obrigatória:** “A IA pode errar. Você revisa antes de publicar.”
- **Estado de carregamento:** skeleton substitui o card; bloqueia a interação.

### 6.3 Passo 2 – Revisar interpretação da IA

- **Texto analisado:** parágrafo com segmentos coloridos via chips de categoria (`decision`, `routine`, `deliverable`, `communication`).
- **Badge de confiança da IA** (Alta/Média/Baixa) com tooltip.
- **Resumo do detectado:** três cards (Decisões, Rotinas, Entregáveis). Cada card tem botão de edição que abre modo lista (input por item, botão de remover, input para adicionar novo item, Enter ou + para confirmar).
- **Painel direito (sticky):** checkboxes “Isso representa bem o perfil” e “Faltou algo importante”. Quando o segundo é marcado, exibe textarea de feedback + botão “Reprocessar”.
- **Ações:** “Voltar e editar texto” (volta ao passo 1) e “Continuar para Composição” (vai ao passo 3).

### 6.4 Passo 3 – Composição e agentes

- **Aba “Composição (Humano + Agentes)”:**
  - **Donut chart** com três segmentos (humano, agentes, híbrido) e legenda lateral com percentual + texto auxiliar:
    - Funções humanas — “Atividades exclusivas de pessoas”.
    - Funções por agentes — “Executadas por agentes de IA”.
    - Funções híbridas — “Colaboração entre humanos e agentes”.
  - **Barra de distribuição** horizontal com as três cores e três sliders sincronizados; ao mover um, os outros se reajustam proporcionalmente, mantendo a soma 100.
  - **Duas listas de tarefas** (humanas vs agentes) com chip de tag (Obrigatório/Recomendado/Opcional) e botão de troca para mover a tarefa para a outra lista.
  - **Aviso:** “Tarefas de alto risco e decisões finais permanecem humanas por padrão.”
  - **Tabela de habilidades:** “Habilidades exigidas do profissional” × “Capacidades cobertas por agentes” (derivada das `saidas[]` dos agentes selecionados). Exibe estado vazio quando nenhum agente está selecionado.
- **Aba “Agentes Disponíveis”:**
  - Busca textual + filtros por categoria.
  - Cards de agente com nome, status, descrição, entradas, saídas, limitações e toggle “Usar neste perfil”. Status `unavailable` desabilita o toggle.
- **Banner contextual:** quando o perfil é classificado como “operacional”, exibe sugestão de aumentar a fatia de agentes (ação “Sugestão automática”).
- **Banner de catálogo vazio:** ver regra crítica em 4.3.
- **Ações finais:** “Voltar” e “Publicar Perfil” (ou “Atualizar Perfil” em edição).

### 6.5 Dashboard

- **Big numbers:**
  - Composição geral (média de `humano%` e `agentes%` entre todos os perfis).
  - Total de perfis cadastrados.
  - Total de agentes disponíveis (com botão rápido “Adicionar”).
- **Lista de perfis** com busca por nome; cada item exibe `humano%`, `agentes%`, contagem de agentes ativos e ações Editar/Excluir (visíveis em hover).
- **Grade de agentes** com status e ações Editar/Excluir.
- **Modal de Agente:** cria ou edita agente com os campos descritos em 5.3.

### 6.6 Eventos e ações desencadeadas

| Evento | Gatilho | Efeitos |
|--------|---------|---------|
| Análise IA | Botão “Analisar com IA” | POST de análise → atualiza estado e avança para passo 2 |
| Reprocessar | Botão no painel direito do passo 2 | POST de análise com feedback → atualiza interpretação |
| Mover tarefa | Botão de troca em uma linha | Move item entre listas humano/agente, mantendo a tag e re-ordenando por prioridade |
| Toggle agente | Switch no card | Adiciona/remove `id` do agente em `agentesSelecionados` |
| Publicar | Botão final do passo 3 + confirmação | POST/PUT do perfil → toast de sucesso → navega para `/dashboard` |
| Editar perfil | Botão “Editar” no dashboard | Carrega perfil em edição, abre wizard no passo 3 |
| Excluir perfil | Botão “Excluir” no dashboard | DELETE → remove da lista |
| Salvar agente | Botão no modal | POST/PUT agente → atualiza catálogo |

### 6.7 Estados da interface

- **Carregando:** skeletons no passo 1 (durante análise) e em chamadas de listas (clientes/gestores).
- **Vazio:** dashboard sem perfis (“Nenhum perfil cadastrado ainda”), busca sem resultados, tabela de habilidades sem agentes selecionados.
- **Bloqueado:** botão “Analisar com IA” (texto curto), toggles de agentes `unavailable`, botão “Publicar/Atualizar” (nome vazio).
- **Aviso/atenção:** banner laranja para tarefas de alto risco; banner amarelo para nenhum agente disponível.
- **Erro:** dropdowns com mensagem inline (`clientsError`, `managersError`) e estados de erro genéricos via toast.

---

## 7. Regras de sucesso, erro e bloqueios (UX)

- **Sucesso de análise:** toast “Análise concluída! Revise o que a IA identificou no seu texto.”
- **Sucesso de reprocessamento:** toast “Reprocessando com feedback…”.
- **Sucesso de publicação (criação):** toast “Perfil publicado! Agentes ativados: N”, redireciona para `/dashboard`.
- **Sucesso de edição:** toast “Perfil atualizado!”, redireciona para `/dashboard`.
- **Sucesso CRUD agente:** toasts “Agente adicionado!” / “Agente atualizado!”.
- **Erro de chamada (cliente/gestor):** toast/inline “Erro ao carregar clientes/gestores”. Front mantém última lista válida.
- **Erro de validação no backend:** exibir `mensagem` global e cada item de `erros` próximo ao campo correspondente quando possível; senão, em toast destrutivo.
- **Bloqueios e como desbloquear:**
  - “Analisar com IA” desabilitado → digitar pelo menos 50 caracteres.
  - “Publicar/Atualizar” desabilitado → preencher nome do perfil.
  - Toggle de agente desabilitado → status `unavailable`; substituir por outro agente.

---

## 8. Linguagem e tom (visão de produto)

- **Tom positivo, direto e simples**, sem jargão técnico. A IA é apresentada como auxílio, não autoridade.
- **Sempre rotular** sugestões da IA e reforçar a revisão humana.
- **Usar:** “A IA sugere…”, “Confira o que a IA entendeu”, “Você revisa antes de publicar”, “Ajuste conforme sua realidade”.
- **Evitar:** “A IA decidiu”, “automaticamente correto”, “100% IA”.
- **Mensagens de erro** orientam à ação, não culpam o usuário (“Não foi possível carregar os clientes. Tente novamente.”).
- **Vocabulário do domínio:** “perfil”, “composição”, “agentes”, “funções humanas/por agentes/híbridas”, “tarefas”, “catálogo”.

---

## 9. APIs necessárias (backend .NET 8)

Prefixo sugerido: `/api/perfis-atuacao`. Todos endpoints exigem `Authorization: Bearer {token}`.

### 9.1 POST `/api/perfis-atuacao/analisar`

Submete o texto livre para análise pela IA e retorna a interpretação categorizada.

**Body:**
```json
{
  "codigoCliente": "12345",
  "codigoGestorExterno": "9876",
  "texto": "Desenvolver e manter APIs Java escaláveis, definir arquitetura backend...",
  "feedbackReprocessamento": null
}
```

**Resposta 200:**
```json
{
  "retorno": {
    "confianca": "high",
    "segmentos": [
      { "texto": "Desenvolver e manter APIs Java escaláveis", "categoria": "deliverable" },
      { "texto": ", definir arquitetura backend", "categoria": "decision" }
    ],
    "decisoes": [
      { "id": "d1", "texto": "Arquitetura", "categoria": "decision" }
    ],
    "rotinas": [
      { "id": "r1", "texto": "Revisão de código", "categoria": "routine" }
    ],
    "entregaveis": [
      { "id": "e1", "texto": "APIs", "categoria": "deliverable" }
    ],
    "composicaoSugerida": { "humano": 60, "agentes": 25, "hibrido": 15 },
    "tarefasHumanas": [
      { "id": "h1", "texto": "Decisões de arquitetura Java", "tag": "required" }
    ],
    "tarefasAgentes": [
      { "id": "a1", "texto": "Análise de métricas", "tag": "recommended" }
    ],
    "habilidadesHumanas": ["Arquitetura de sistemas distribuídos", "Liderança técnica"],
    "perfilOperacional": false
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

`categoria` ∈ `decision | routine | deliverable | communication`. `tag` ∈ `required | recommended | optional`.

**Contrato C# sugerido:**
```csharp
public sealed record AnalisarPerfilRequest(
    string? CodigoCliente,
    string? CodigoGestorExterno,
    string Texto,
    string? FeedbackReprocessamento);

public sealed record SegmentoTextoDto(string Texto, string Categoria);
public sealed record ItemDetectadoDto(string Id, string Texto, string Categoria);
public sealed record TarefaDto(string Id, string Texto, string Tag);
public sealed record ComposicaoDto(int Humano, int Agentes, int Hibrido);

public sealed record AnaliseIaDto(
    string Confianca,
    IReadOnlyList<SegmentoTextoDto> Segmentos,
    IReadOnlyList<ItemDetectadoDto> Decisoes,
    IReadOnlyList<ItemDetectadoDto> Rotinas,
    IReadOnlyList<ItemDetectadoDto> Entregaveis,
    ComposicaoDto ComposicaoSugerida,
    IReadOnlyList<TarefaDto> TarefasHumanas,
    IReadOnlyList<TarefaDto> TarefasAgentes,
    IReadOnlyList<string> HabilidadesHumanas,
    bool PerfilOperacional);
```

### 9.2 POST `/api/perfis-atuacao`

Cria um perfil. Autor extraído do token.

**Body:**
```json
{
  "nome": "Desenvolvedor Java Sênior",
  "codigoCliente": "12345",
  "codigoGestorExterno": "9876",
  "textoOriginal": "Desenvolver e manter APIs Java...",
  "composicao": { "humano": 60, "agentes": 25, "hibrido": 15 },
  "tarefasHumanas": [
    { "id": "h1", "texto": "Decisões de arquitetura Java", "tag": "required" }
  ],
  "tarefasAgentes": [
    { "id": "a1", "texto": "Análise de métricas", "tag": "recommended" }
  ],
  "agentesSelecionados": ["agente-1", "agente-4"]
}
```

**Resposta 201:** envelope com `retorno` = perfil completo (mesma forma do GET).

**Validações obrigatórias (erros[]):**
- `nome` obrigatório, máx. 120 caracteres.
- `composicao.humano + composicao.agentes + composicao.hibrido == 100`.
- `codigoCliente` obrigatório.
- Cada `agentesSelecionados[i]` deve existir e pertencer ao cliente, com status ≠ `unavailable`.
- `tag` ∈ enum permitido; `categoria` em `segmentos`/itens ∈ enum permitido.

### 9.3 PUT `/api/perfis-atuacao/{id}`

Atualiza um perfil existente. Mesmo body do POST. Retorna 200 com o perfil atualizado. Atualiza `dataAlteracao` e registra autor da alteração.

### 9.4 GET `/api/perfis-atuacao`

Listagem para o dashboard.

**Query:** `cursor` (default 0), `limite` (default 50, máx 200), `busca` (substring no nome).

**Resposta 200:**
```json
{
  "retorno": [
    {
      "id": "perfil-1",
      "nome": "Desenvolvedor Java Sênior",
      "codigoCliente": "12345",
      "nomeCliente": "ACME S.A.",
      "composicao": { "humano": 60, "agentes": 25, "hibrido": 15 },
      "agentesSelecionados": ["agente-1"],
      "totalAgentesAtivos": 1,
      "codigoInternoColaborador": "abc-123",
      "dataCriacao": "2026-05-12T14:00:00Z",
      "dataAlteracao": "2026-05-12T14:30:00Z"
    }
  ],
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

### 9.5 GET `/api/perfis-atuacao/{id}`

Retorna o perfil completo (inclui `tarefasHumanas`, `tarefasAgentes`, `textoOriginal`).

### 9.6 DELETE `/api/perfis-atuacao/{id}`

Soft delete recomendado. Retorna envelope com `retorno: null`, `sucesso: true`.

### 9.7 GET `/api/agentes`

Catálogo de agentes para o cliente em contexto.

**Query:** `codigoCliente` (obrigatório), `cursor`, `limite`, `busca`, `categoria`.

**Resposta 200:**
```json
{
  "retorno": [
    {
      "id": "agente-1",
      "nome": "Agente de Documentação Técnica",
      "categoria": "Documentação",
      "descricao": "Cria e atualiza documentação técnica...",
      "entradas": ["Código-fonte", "Requisitos"],
      "saidas": ["Documento (Markdown)", "Especificação OpenAPI"],
      "limitacoes": "Pode necessitar revisão...",
      "status": "available",
      "dataCriacao": "2026-04-01",
      "dataAlteracao": "2026-05-10"
    }
  ],
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

### 9.8 POST/PUT/DELETE `/api/agentes` e `/api/agentes/{id}`

CRUD do catálogo, restrito a perfis administrativos. `status` ∈ `available | pilot | unavailable`.

### 9.9 Dependências externas (já existentes)

- **GET `/GestaoDeAlocados/ListarClienteOrgDaGestaoDeAlocados`** – lista clientes (cursor, limite, busca). Mapear `codigoCliente` → `id`, `nomeCliente` → `label`.
- **GET `/GestaoDeAlocados/GestorExterno/ListarGestoresExterno`** – lista gestores por `codigoCliente`. Mapear `codGestorExterno` → `id`, `nome` → `label`, `codigoInternoColaborador`, `email`.

Ambos retornam o envelope padrão e usam Bearer token.

### 9.10 Serviços/operações em abstração

| Nome | Entrada | Saída | Lógica (1 frase) |
|------|---------|-------|------------------|
| `IAnaliseIaService.AnalisarAsync` | texto + contexto + feedback opcional | `AnaliseIaDto` | Chama LLM com prompt estruturado, aplica heurística de categorização e devolve sugestão de composição/tarefas/habilidades. |
| `IPerfilAtuacaoService.PublicarAsync` | request + autor (token) | `PerfilDto` | Valida composição = 100, valida agentes vs catálogo, persiste e registra auditoria. |
| `ICatalogoAgentesService` | filtros | lista de agentes | Lê agentes por cliente/org, aplica busca/categoria. |

---

## 10. Modelos de dados (contratos)

### 10.1 Perfil de Atuação (response/DTO)

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `id` | string (GUID) | sim | Identificador do perfil |
| `nome` | string | sim | Nome livre, único por org |
| `codigoCliente` | string | sim | Cliente associado |
| `nomeCliente` | string | não | Nome do cliente (denormalizado para listagem) |
| `codigoGestorExterno` | string | não | Gestor associado |
| `textoOriginal` | string | sim | Texto submetido pelo usuário |
| `composicao` | object | sim | `{ humano, agentes, hibrido }` somando 100 |
| `tarefasHumanas` | array | sim | Lista de `Tarefa` |
| `tarefasAgentes` | array | sim | Lista de `Tarefa` |
| `agentesSelecionados` | string[] | sim | IDs de agentes ativos no perfil |
| `codigoInternoColaborador` | string | sim | Autor (do token) |
| `dataCriacao` | string ISO | sim | Auditoria |
| `dataAlteracao` | string ISO | não | Última atualização |

### 10.2 Tarefa

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `id` | string | sim | Identificador local |
| `texto` | string | sim | Descrição curta |
| `tag` | enum | sim | `required \| recommended \| optional` |

### 10.3 Composição

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `humano` | int (0–100) | sim | % de funções humanas |
| `agentes` | int (0–100) | sim | % de funções por agentes |
| `hibrido` | int (0–100) | sim | % de funções híbridas |

Regra: `humano + agentes + hibrido == 100`.

### 10.4 Agente

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `id` | string | sim | Identificador |
| `nome` | string | sim | Nome do agente |
| `categoria` | string | sim | Ex.: Documentação, Análise |
| `descricao` | string | sim | O que faz |
| `entradas` | string[] | sim | Insumos esperados |
| `saidas` | string[] | sim | Produtos gerados |
| `limitacoes` | string | sim | Limites e cuidados |
| `status` | enum | sim | `available \| pilot \| unavailable` |
| `dataCriacao` | string ISO | sim | Auditoria |
| `dataAlteracao` | string ISO | não | Última atualização |

### 10.5 Análise IA (response)

Ver 9.1.

---

## 11. Dependências de APIs e dados existentes

- **Clientes e gestores** vêm de APIs já existentes no sistema; o backend desta feature **não** as reimplementa, apenas referencia `codigoCliente` e `codigoGestorExterno` como chaves estrangeiras lógicas.
- O **`codigoInternoColaborador`** do autor é obtido do token (alguns sistemas legados retornam `codigoColaboradorInterno` — tratar como mesmo valor).
- O **catálogo de agentes** é, hoje, um conjunto inicial mockado no front. O backend deve assumir esse conjunto inicial como seed e expor o CRUD descrito em 9.7–9.8.
- Não há outras APIs externas envolvidas no fluxo do wizard.

---

## 12. Fluxo resumido (backend)

### Análise (passo 1 → passo 2)
1. Autenticar via Bearer token; extrair `codigoInternoColaborador`.
2. Validar texto (mín. 50 caracteres).
3. Chamar `IAnaliseIaService.AnalisarAsync` com texto + cliente/gestor + feedback (opcional).
4. Persistir log da análise (opcional, recomendado para auditoria).
5. Retornar envelope com `AnaliseIaDto`.

### Publicação (passo 3)
1. Autenticar; extrair autor.
2. Validar payload: nome, soma da composição = 100, agentes existem e são selecionáveis para o cliente, tags/categorias dentro do enum.
3. Persistir em transação: cabeçalho do perfil + tarefas humanas + tarefas de agentes + relação `perfil_agente`.
4. Registrar `dataCriacao` (ou `dataAlteracao` no PUT) e autor.
5. Retornar perfil completo.

### Listagem/Edição/Exclusão
1. Autenticar; aplicar escopo por org/cliente.
2. Aplicar filtros (`busca`, paginação cursor/limite).
3. Em delete, fazer soft delete (`dataExclusao`, opcional) e remover da listagem.

---

## 13. Propostas de melhorias (evolução da feature)

- **Salvar rascunho** real (passo 1) com retomada posterior.
- **Versionamento** do perfil: cada publicação cria uma versão imutável; edição gera nova versão.
- **Filtros e paginação no servidor** para perfis e agentes (hoje o front filtra em memória).
- **Histórico de análises** por perfil (ver evolução das sugestões da IA).
- **Sugestão automática de agentes** com base nas tarefas detectadas.
- **Exportação** do perfil em PDF/Markdown para uso externo (job description, briefing).
- **Notificações** ao gestor associado quando um perfil é publicado.
- **Métricas de uso** de cada agente por perfil (telemetria).
- **Permissões** baseadas em papéis (autor vs admin de catálogo).

---

## 14. Cenários de erro e pontos de atenção

- **Composição inválida** (soma ≠ 100) → 422 com `erros: ["A soma da composição deve ser 100."]`.
- **Agente inválido** (id inexistente, indisponível ou de outro cliente) → 422 com `erros: ["Agente {id} não pode ser usado neste perfil."]`.
- **Cliente inválido / sem permissão** → 403 com `mensagem` apropriada.
- **Token expirado/ausente** → 401 padrão.
- **Conflito de nome** (se for unique por org) → 409 com `mensagem: "Já existe um perfil com este nome."`.
- **Falha do provedor de IA** → 502 com `mensagem` amigável; UI deve permitir tentar novamente.
- **Race condition em edição** (dois usuários editando o mesmo perfil) → usar `dataAlteracao` como ETag/If-Match opcional; em conflito, 409.
- **Integridade referencial:** ao excluir um agente do catálogo, decidir entre bloquear (se em uso por algum perfil) ou marcá-lo como `unavailable` retroativo. Recomenda-se **bloquear exclusão** se houver perfis ativos referenciando-o.
- **Segurança:** garantir escopo por org/cliente em **todas** as queries; nunca confiar em `codigoCliente` apenas vindo do body — cruzar com permissões do token.

---

## 15. Design System e auditoria

A feature consome um conjunto fixo de **tokens de design** que devem ser replicados na nova plataforma (HSL/HEX equivalentes):

- **Brand:** primary `#000000`, accent `#9A1BFF`, accent-soft `#F4EBFF`.
- **Superfícies:** primary-background `#F5F3FF`, surface-elevated `#FFFFFF`.
- **Status:** success `#16A34A`, warning `#F59E0B`, error `#DC2626`, info `#2563EB`.
- **Cores do gráfico:** `--chart-human #16A34A`, `--chart-agents #9A1BFF`, `--chart-hybrid #F59E0B`.
- **Raio:** xs 6px, sm 8px, md 12px (default), lg 20px, pill 999px.
- **Tipografia:** Inter (corpo) + Plus Jakarta Sans (títulos, peso 700/800).
- **Elevação principal:** `0 10px 25px rgba(15,23,42,0.06)`.
- **Modo escuro:** ver paleta dedicada (accent `#C084FF`, fundo `#020617`, surface `#0B1120`).

Componentes a reproduzir: card elevado, AI badge (pill com ícone Sparkles), category chip por categoria de IA, status badge (available/pilot/unavailable), stepper horizontal com números, donut SVG simples, slider proporcional, dropdown com busca debounced.

Após merge no repositório, alinhar com a auditoria de Design System do projeto, se aplicável.

---

## 16. Resumo para o time

- **Feature em uma frase:** wizard de 3 passos para criar e publicar um perfil de atuação que combina humano, agentes e híbrido, com revisão da interpretação da IA, ajuste de composição e seleção de agentes do catálogo do cliente.
- **APIs a implementar:** `POST /perfis-atuacao/analisar`, `POST /perfis-atuacao`, `PUT /perfis-atuacao/{id}`, `GET /perfis-atuacao`, `GET /perfis-atuacao/{id}`, `DELETE /perfis-atuacao/{id}`, CRUD `/agentes`.
- **APIs já usadas:** listagem de clientes e gestores (Gestão de Alocados).
- **Contratos em uma linha:** envelope `{retorno, sucesso, mensagem, erros}`, camelCase, `dataCriacao`/`dataAlteracao`, `codigoInternoColaborador` no autor, composição inteira somando 100, tags `required|recommended|optional`, status de agente `available|pilot|unavailable`.
- **Pontos de atenção:** soma da composição, escopo por cliente/org, integridade referencial agente↔perfil, transparência da IA na UI, edição abre direto no passo 3 com nome pré-preenchido na confirmação.

---

*Documento gerado para integração com backend .NET 8 e front. Última atualização: 12/05/2026.*
