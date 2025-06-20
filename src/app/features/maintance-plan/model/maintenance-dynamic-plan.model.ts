import { MaintenanceTask } from './maintenance-plan.model';

export interface MaintenanceDynamicPlan {
  dynamicPlanId: number;
  id?: number;
  userCreator: number;
  parameter: string;
  startDate: Date;
  machineIds: number[];
  tasks: MaintenanceTask[];
} 