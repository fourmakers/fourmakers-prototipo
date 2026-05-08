# Mocks — Mapa Demográfico

Neste projeto os dados mockados do **Mapa Demográfico** ficam centralizados em:

- **`src/data/mockData.ts`** — colaboradores (`MOCK_EMPLOYEES`), opções de filtro, dados demográficos agregados, helpers (`filterEmployees`, `buildDemographicDataFromEmployees`, etc.) e tipos (`Employee`, `CardConfig`, `DemographicGroup`, etc.).

Para manter um único lugar da verdade, **não duplique mocks** em `src/mocks/`. Use:

```ts
import { MOCK_EMPLOYEES, DEMOGRAPHIC_ITEMS, filterEmployees } from "@/data/mockData";
```

Se no futuro houver mocks de outras features (ex.: campanhas, configurações), podem ser adicionados em `src/data/` (ex.: `campaignMocks.ts`) ou aqui em `src/mocks/` com re-export em `index.ts`.
