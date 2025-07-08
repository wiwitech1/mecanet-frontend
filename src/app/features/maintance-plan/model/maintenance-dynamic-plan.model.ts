export interface MaintenanceDynamicPlanTask {
  machineId: number;
  taskName: string;
  description: string;
  skillIds: number[];
}

export interface MaintenanceDynamicPlan {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
  metricDefinitionId: number;
  threshold: number;
  tasks: MaintenanceDynamicPlanTask[];
} 