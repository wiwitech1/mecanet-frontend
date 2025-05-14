export interface MaintenancePlanData {
  planId: number;
  productionLineId: number;
  startDate: Date;
  durationDays: number;
  userCreator: number;
  items: MaintenancePlanItem[];
}

export interface MaintenancePlanItem {
  dayNumber: number;
  tasks: MaintenanceTask[];
}

export interface MaintenanceTask {
  taskId: number;
  taskName: string;
  taskDescription: string;
  machineIds: number[];
} 