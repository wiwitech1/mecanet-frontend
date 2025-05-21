export interface MaintenanceTaskResource {
    taskId: number | null;
    taskName: string;
    taskDescription: string;
    machineIds: number[];
  }
  
  export interface MaintenancePlanItemResource {
    dayNumber: number;
    tasks: MaintenanceTaskResource[];
  }
  
  export interface MaintenancePlanResource {
    id?: number;
    planId: number;
    repeatCycle: number;
    planName: string;
    productionLineId: number;
    startDate: string;
    durationDays: number;
    userCreator: number;
    items: MaintenancePlanItemResource[];
  }