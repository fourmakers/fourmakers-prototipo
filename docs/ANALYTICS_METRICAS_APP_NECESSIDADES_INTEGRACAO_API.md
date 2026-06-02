# Métricas APP — O que falta para integração com APIs reais

Documento de **handoff** para a equipa que vai implementar a **Analytics API FourMakers** e disponibilizar a documentação que o front do protótipo precisa para ligar dados reais (Firebase/GA4/BigQuery e Contentsquare).

- **Público:** dev backend, data/analytics, DevOps, PO técnico  
- **Consumidor:** dev front do hub (`prototipo-fourmakers`)  
- **Protótipo:** `/metricas-app`  
- **Doc técnica do UI:** `ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md`  
- **Criado em:** 08/05/2026  

---

## 1. Resumo executivo

| Camada | Estado | Responsável |
|--------|--------|-------------|
| UI + filtros + tabs Firebase/Contentsquare | Pronto | Front (protótipo) |
| Cliente HTTP + React Query + normalizers | Pronto | Front (protótipo) |
| Mocks para demo / GitHub Pages | Pronto | Front (protótipo) |
| **Analytics API** (agrega BigQuery + Contentsquare) | **Falta** | Backend / data |
| Credenciais GCP, CS, Hotjar (só no servidor) | **Falta** | DevOps + backend |
| Auth JWT/SSO no hub → API | **Falta** (contrato definido, não ligado ao login real) |
| CORS + URL HML/PROD da API | **Falta** | DevOps |
| Comparativo Web (GA4 web, Hotjar) | Futuro | Produto + backend |

Enquanto a API não existir ou não estiver acessível, o hub mostra **dados simulados** (badge “Dados simulados”). Com API configurada, o badge passa a **“Analytics API”**.

---

## 2. O que o protótipo já faz (não precisa refazer)

- Chama `GET /analytics/app` com query params alinhados ao hub FourMakers.  
- Aceita envelope `{ retorno, sucesso, mensagem, erros }`.  
- Fallback de rota legada: `GET /api/analytics/app/firebase/dashboard` e `.../contentsquare/dashboard`.  
- Converte resposta para os tipos em `src/analytics/types.ts`.  
- Suporta payload **já no formato do dashboard** ou DTO **unificado** (normalizer em `analyticsNormalizers.ts`).  
- Variáveis: ver `.env.example` na raiz do repo.

**O front não vai** chamar Firebase Admin, BigQuery, Hotjar nem Contentsquare directamente.

---

## 3. O que falta (checklist da equipa API)

### 3.1 Infraestrutura e acesso

```txt
[ ] Analytics API publicada (HML e PROD) com URL HTTPS estável
[ ] CORS: permitir origem do hub (localhost:8080, GitHub Pages, domínio interno)
[ ] Healthcheck GET /health ou equivalente
[ ] Secrets no Secret Manager (nunca no repositório do protótipo):
      - Service account BigQuery (JSON só no servidor)
      - GA4_PROPERTY_ID_APP (e WEB quando existir)
      - CONTENTSQUARE_* (client id/secret ou token acordado)
      - JWT signing / validação SSO se aplicável
[ ] Cache 5–15 min por combinação de filtros (ver hub instruções §15)
```

### 3.2 Endpoints mínimos para a tela actual (MVP Métricas APP)

| Prioridade | Método | Path | Uso na UI |
|------------|--------|------|-----------|
| P0 | `GET` | `/analytics/app` | Tab Firebase **ou** Contentsquare (`source=firebase` \| `contentsquare`) |
| P1 | `GET` | `/analytics/overview` | Futuro hub Overview |
| P2 | `GET` | `/analytics/friction`, `/analytics/replays` | Fricção e replays (Contentsquare/Hotjar) |

Query params **obrigatórios** que o front já envia:

| Param | Valores | Notas |
|-------|---------|--------|
| `from` | `YYYY-MM-DD` | Data início |
| `to` | `YYYY-MM-DD` | Data fim |
| `platform` | `app` | Fixo para esta tela |
| `environment` | `hml` \| `prod` | Alinhado ao filtro UI |
| `source` | `firebase` \| `contentsquare` | Tab activa |

Query params **opcionais** (UI preparada; backend pode ignorar no MVP):

| Param | Valores |
|-------|---------|
| `device_platform` | `android` \| `ios` (omitir = ambos) |
| `organization_id` | string |
| `user_role` | string |
| `feature` | string |
| `app_version` | string |
| `client_id` | string |

### 3.3 Autenticação

| Item | O que o dev API deve informar |
|------|-------------------------------|
| Tipo | Bearer JWT, cookie de sessão, ou API key em header (especificar nome do header) |
| Como obter token em HML | URL de login SSO, client id, ou token de teste **só para HML** (nunca commitar no repo) |
| Expiração / refresh | Comportamento esperado no front |
| Perfis (RBAC) | Quais roles veem Firebase vs Contentsquare vs replays (ver hub prompts §8) |

O protótipo lê `VITE_ANALYTICS_API_TOKEN` em build local/CI. Em produção com SSO, documentar fluxo (ex.: token injectado após login no portal).

### 3.4 Dados de origem (backend)

| Fonte | O que precisa estar operacional antes da API devolver números reais |
|-------|---------------------------------------------------------------------|
| Firebase / GA4 | App instrumentado; **BigQuery Export** activo; dataset `analytics_<PROPERTY_ID>.events_*` |
| Contentsquare | SDK no app; project ID; API Metrics/Export com permissões; política de masking validada |
| (Futuro) Hotjar | Site web instrumentado; Events API / webhooks |
| (Futuro) FourMakers API / Supabase | Cruzamento negócio (cliente, org) — só IDs pseudonimizados |

---

## 4. O que o dev precisa **informar** (formulário de handoff)

Preencher e partilhar com o dev front (ficheiro, Confluence, ou PR no repo). **Não incluir secrets no Git** — usar canal seguro para tokens de HML.

### 4.1 Ambientes

| Campo | Exemplo | Obrigatório |
|-------|---------|:------------:|
| URL base API **HML** | `https://analytics-api-hml.fourmakers.run.app` | Sim |
| URL base API **PROD** | `https://analytics-api.fourmakers.run.app` | Sim |
| Data a partir da qual há dados fiáveis em HML | `2026-05-01` | Sim |
| Data a partir da qual há dados fiáveis em PROD | — | Quando existir |

### 4.2 Identificadores técnicos (sem secrets)

| Campo | Exemplo |
|-------|---------|
| GCP `PROJECT_ID` (BigQuery) | `fourmakers-prod` |
| GA4 `PROPERTY_ID` app | `123456789` |
| Firebase project id | `fourmakers-app` |
| Contentsquare site/app id | `…` |
| Lista de `event_name` efectivamente disponíveis no BQ (top 20) | export CSV ou query de amostra |
| Mapeamento `environment` no BQ | ex.: user property `environment` = `hml` |

### 4.3 Contrato HTTP

| Campo | Valor |
|-------|--------|
| Versão da API | ex. `v1` |
| Prefixo opcional | ex. `/api` ou vazio |
| Content-Type resposta | `application/json` |
| Envelope | `retorno`, `sucesso`, `mensagem`, `erros` (padrão Fourmakers) |
| Códigos de erro documentados | 400, 401, 403, 503 + exemplos JSON |

### 4.4 Contacto e SLA

| Campo | Valor |
|-------|--------|
| Responsável backend | nome + Slack/email |
| Onde reportar bug de contrato | issue tracker / canal |
| Janela de manutenção API | se houver |

---

## 5. Formato da documentação que o dev deve disponibilizar

O front precisa de **um pacote de documentação consumível** — não apenas prompts internos. Entregar da seguinte forma:

### 5.1 Onde colocar (recomendado)

| Opção | Caminho / local | Quem lê |
|-------|-----------------|--------|
| **A (preferida)** | Ficheiros `.md` em `docs/` deste repo + PR | Front + QA |
| **B** | OpenAPI 3 em `docs/openapi/analytics-api.yaml` + exemplos JSON | Front + geradores de tipo |
| **C** | Wiki/Confluence com link estável | PO; copiar trechos para `docs/` |

**Mínimo para fechar integração:** opção **A** + pelo menos um **exemplo JSON real** (resposta sanitizada de HML).

### 5.2 Estrutura obrigatória do `.md` de contrato

Criar ficheiro sugerido: **`docs/ANALYTICS_API_CONTRATO_BACKEND.md`** (nome fixo para o front encontrar), com:

1. **URLs** HML/PROD e CORS permitidos  
2. **Autenticação** (header, exemplo de request, sem token real)  
3. **Lista de endpoints** implementados vs planeados  
4. Por endpoint (`GET /analytics/app`):
   - Query params (obrigatório/opcional, tipos, enums)  
   - Response 200 — JSON exemplo **completo** para `source=firebase` e `source=contentsquare`  
   - Responses 400/401/503 — JSON exemplo  
5. **Mapeamento de campos** → colunas BigQuery ou APIs CS (tabela)  
6. **Regras de privacidade** — campos proibidos no `retorno`  
7. **Limites** — rate limit, tamanho máximo de período (`from`–`to`), timeout  
8. **Changelog** — data + versão quando alterar contrato  

### 5.3 OpenAPI (opcional mas muito útil)

Se entregarem `analytics-api.yaml`:

- Incluir `servers.url` para HML e PROD  
- Schemas para `AnalyticsAppRetorno`, `FirebaseAppDashboardData`, `ContentsquareAppDashboardData`  
- O front pode validar o normalizer contra exemplos gerados  

### 5.4 Exemplos JSON (obrigatório para cada `source`)

Guardar em:

```txt
docs/examples/analytics/
  app-firebase-200.json
  app-contentsquare-200.json
  app-400-periodo-invalido.json
  envelope-erro-503.json
```

Regras dos exemplos:

- Dados **reais sanitizados** (contagens plausíveis) ou sintéticos com **mesma forma** que produção  
- Mesmo envelope `sucesso` / `retorno`  
- `periodoLabel` coerente com `from` / `to` dos query params do exemplo  
- Sem PII (sem e-mail, nome, CPF, telefone)  

### 5.5 Alinhamento com tipos do protótipo

O contrato deve ser compatível com:

- `src/analytics/types.ts` — shape preferido dos dashboards  
- `src/analytics/api/analyticsApiTypes.ts` — envelope e DTO unificado  

**Formato preferido do `retorno` em `GET /analytics/app`:**

```json
{
  "retorno": {
    "firebase": { "...": "mesmo shape que FirebaseAppDashboardData" },
    "contentsquare": { "...": "mesmo shape que ContentsquareAppDashboardData" }
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

Para cada `source` na query, pode devolver só o canal pedido:

```json
{
  "retorno": {
    "firebase": { "periodoLabel": "...", "kpis": [], "eventosPorDia": [], "topEventos": [], "screenViews": [], "funis": [], "userProperties": [], "erros": [], "integracao": { "bigQueryExportAtivo": true, "debugViewAtivo": false, "ultimaSyncBigQuery": "2026-05-25T06:00:00Z" } }
  },
  "sucesso": true,
  "mensagem": null,
  "erros": null
}
```

Lista de campos esperados: ver tipos em `types.ts` no repositório (secção KPIs, séries, tabelas, funis, integracao).

---

## 6. Como o dev front activa dados reais (após API pronta)

1. Receber URL HML + doc `ANALYTICS_API_CONTRATO_BACKEND.md` + exemplos JSON.  
2. Criar `.env.local` (não versionar):

```bash
VITE_ANALYTICS_API_BASE_URL=https://<url-api-hml>
VITE_ANALYTICS_USE_MOCK=false
VITE_ANALYTICS_API_TOKEN=<jwt-hml-se-aplicavel>
# Opcional em dev sem API estável:
# VITE_ANALYTICS_FALLBACK_MOCK=true
```

3. `npm run dev` ou `npm run preview:8080` — validar badge **Analytics API** e números vs Console BQ/CS.  
4. Ajustar normalizer **só se** o backend entregar DTO unificado diferente (avisar no changelog).  
5. Deploy GitHub Pages: configurar secrets/vars no CI se a API for chamada em preview público (CORS + token); caso contrário manter mocks em Pages e API só em ambiente interno.

---

## 7. Critérios de aceite (integração considerada fechada)

```txt
[ ] GET /analytics/app?source=firebase responde 200 em HML com envelope válido
[ ] GET /analytics/app?source=contentsquare responde 200 em HML com envelope válido
[ ] Filtros from/to/environment/device_platform alteram os números de forma verificável
[ ] DAU/MAU ou sessões do dia batem com amostra manual no Firebase Console / CS (tolerância acordada, ex. ±5%)
[ ] Nenhum campo de PII no JSON de resposta
[ ] 401/403 tratados no hub (mensagem clara, sem fallback mock em PROD se política for erro explícito)
[ ] Documentação ANALYTICS_API_CONTRATO_BACKEND.md + exemplos JSON commitados ou link permanente
[ ] CORS funciona a partir de http://localhost:8080 e do URL de preview acordado
```

---

## 8. Erros comuns e quem resolve

| Sintoma no hub | Causa provável | Quem resolve |
|----------------|----------------|--------------|
| Badge “Dados simulados” com API configurada | `VITE_ANALYTICS_USE_MOCK` não é `false` ou falta `VITE_ANALYTICS_API_BASE_URL` | Front / DevOps CI |
| “Analytics API indisponível” | API down, URL errada, CORS | Backend / DevOps |
| 401 sempre | Token inválido ou auth não documentada | Backend + doc auth |
| Números vazios / zeros | BQ sem export ou filtro `environment` errado | Data / backend |
| Formato não reconhecido | JSON fora do shape `FirebaseAppDashboardData` | Backend ajusta ou front normalizer (combinar em PR) |

---

## 9. Referências cruzadas

| Documento | Conteúdo |
|-----------|----------|
| `ANALYTICS_METRICAS_APP_DOCUMENTACAO_TECNICA.md` | Arquitectura, queries BQ, endpoints sugeridos, QA |
| `fourmakers_analytics_hub_instrucoes 1.md` | Visão hub completo (app + web + Hotjar) |
| `fourmakers_analytics_hub_prompts.md` | Prompts para implementar API e providers |
| `fourmakers_firebase_analytics.md` | Instrumentação app Firebase |
| `fourmakers_contentsquare.md` | Instrumentação app Contentsquare |
| `.env.example` | Variáveis do protótipo |

---

## 10. Template rápido (copiar para o dev API)

```markdown
## Handoff Analytics API → Protótipo Métricas APP

- API HML: 
- API PROD: 
- Auth: Bearer | outro: 
- CORS origins: 
- BigQuery project + property id app: 
- Contentsquare project id: 
- Endpoint pronto: GET /analytics/app [ ] Sim [ ] Não
- Exemplos JSON em docs/examples/analytics/: [ ] Sim [ ] Não
- Contrato em docs/ANALYTICS_API_CONTRATO_BACKEND.md: [ ] Sim [ ] Não
- Contacto: 
- Data válida para testes: 
```

---

*Quando `ANALYTICS_API_CONTRATO_BACKEND.md` e os exemplos JSON existirem, o dev front liga `VITE_ANALYTICS_USE_MOCK=false` e valida em http://localhost:8080/metricas-app.*
