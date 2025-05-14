export interface MeasurementEntity {
  id: number;
  name: string;
  unit: string;
}

export interface MachineryMeasurementEntity extends MeasurementEntity {
  value: number;
  lastUpdated: Date;
}
