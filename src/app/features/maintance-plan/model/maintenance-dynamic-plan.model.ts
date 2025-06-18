import { MaintenanceTask } from "./maintenance-plan.entity";

export interface MaintenanceDynamicPlan {
  dynamicPlanId: number;
  id?: number;
  userCreator: number;
  parameter: string;
  startDate: Date;
  machineIds: number[];
  tasks: MaintenanceTask[];
} 