/**
 * Re-export dos mocks do Mapa Demográfico.
 * Fonte principal: src/data/mockData.ts
 */
export {
  type FilterPessoas,
  type StatusFilter,
  type CardConfig,
  type DemographicRow,
  type DemographicGroup,
  type Employee,
  LOCAL_TRABALHO_OPTIONS,
  EMPRESAS_OPTIONS,
  DEMOGRAPHIC_ITEMS,
  DEMOGRAPHIC_DATA,
  MOCK_EMPLOYEES,
  filterEmployeesByDemographic,
  filterEmployees,
  buildDemographicDataFromEmployees,
} from "@/data/mockData";
