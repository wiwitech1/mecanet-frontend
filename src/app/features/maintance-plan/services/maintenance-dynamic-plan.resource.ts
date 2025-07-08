export interface MaintenanceDynamicPlanResource {
  name: string;
  startDate: string;  // formato "yyyy-mm-dd"
  endDate: string;    // formato "yyyy-mm-dd"
  metricDefinitionId: number;
  threshold: number;
  tasks: {
    machineId: number;
    taskName: string;
    description: string;
    skillIds: number[];
  }[];
}
