export interface MachineMetricResource {
  metricId: number;
  metricName: string;
  unit: string;
  value: number;
  measuredAt: Date;
} 