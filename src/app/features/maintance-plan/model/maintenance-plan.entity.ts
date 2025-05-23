// src/app/models/maintenance-plan.model.ts

export interface MaintenanceTask {
  taskId: number | null;
  taskName: string;
  taskDescription: string;
  machineIds: number[];
}

export interface MaintenancePlanItem {
  dayNumber: number;
  itemName: string;
  tasks: MaintenanceTask[];
}

export interface MaintenancePlanData {
  id?: number;
  planId: number;
  repeatCycle: number;
  planName: string;
  productionLineId: number;
  startDate: string | null;
  durationDays: number;
  userCreator: number;
  items: MaintenancePlanItem[];
}
