import { MaintenancePlanResource } from './maintenance-plan.resource';

export interface ApiInfo {
  registers: number;
  status: string;
  message: string;
}

export interface MaintenancePlanListResponse {
  info: ApiInfo | ApiInfo[];
  data: MaintenancePlanResource[];
}
