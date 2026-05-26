# Contrato — Analytics API (`GET /analytics/app`)

## Endpoint

```
GET /analytics/app
GET /api/analytics/app/{firebase|contentsquare}/dashboard  (legado)
```

### Query params

| Param | Obrigatório | Valores |
|-------|-------------|---------|
| `from` | sim | `YYYY-MM-DD` |
| `to` | sim | `YYYY-MM-DD` |
| `platform` | sim | `app` |
| `environment` | sim | `dev`, `hml`, `prod` |
| `source` | sim | `firebase`, `contentsquare` |
| `device_platform` | não | `all`, `android`, `ios` |
| `feature` | não | id feature |

### Auth

Header opcional: `Authorization: Bearer <ANALYTICS_API_TOKEN>` (se configurado no servidor).

### Envelope

```json
{
  "sucesso": true,
  "mensagem": null,
  "erros": null,
  "retorno": {
    "firebase": { },
    "meta": { "dataMode": "live", "cachedAt": "2026-05-25T12:00:00Z" }
  }
}
```

## Firebase (`source=firebase`)

Campos PT (protótipo):

- `periodoLabel`, `kpis[]`, `eventosPorDia[]`, `topEventos[]`, `screenViews[]`
- `funis[]` (BigQuery quando `BQ_ENABLED=true`)
- `userProperties[]`, `erros[]`
- `integracao.bigQueryExportAtivo`, `integracao.ga4DataApi`, `integracao.ultimaSyncBigQuery`

## Contentsquare (`source=contentsquare`)

- `sessoesPorDia`, `conversoes`, `fricoes`, `maskingPorTela`, `jornadaTop`, `integracao.apiLive`

## Implementação

Código: [services/analytics-api/](../services/analytics-api/)

Setup GCP: [ANALYTICS_API_SETUP_GCP.md](./ANALYTICS_API_SETUP_GCP.md)
