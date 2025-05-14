import { MaintenanceDynamicPlan } from '../model/maintenance-dynamic-plan.model';

// Esta interface representa la respuesta que devuelve json-server
// En json-server, la respuesta es directamente un array o un objeto
export type MaintenanceDynamicPlanResponse = MaintenanceDynamicPlan[];

// Si se implementa una API personalizada en el futuro, se puede usar esta estructura
export interface CustomMaintenanceDynamicPlanResponse {
  info: {
    totalRecords: number;
    status: string;
    message?: string;
  };
  data: MaintenanceDynamicPlan[];
}