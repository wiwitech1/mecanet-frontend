/**
 * Representa la estructura de datos tal como llega de la API
 */
export interface MachineryResource {
  id: number;
  serialNumber: string;
  name: string;
  manufacturer: string;
  model: string;
  type: string;
  powerConsumption: number;
  status: number;
  productionLineId: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  measurements?: MachineryMeasurementResource[];
}

export interface CreateMachineryResource {
  serialNumber: string;
  name: string;
  manufacturer: string;
  model: string;
  type: string;
  powerConsumption: number;
  measurements?: CreateMachineryMeasurementResource[];
}

export interface UpdateMachineryResource extends Partial<CreateMachineryResource> {
  status?: number;
  productionLineId?: number;
}

export interface MeasurementResource {
  id: number;
  name: string;
  unit: string;
}

export interface MachineryMeasurementResource extends MeasurementResource {
  value: number;
  last_updated: string;
}

export interface CreateMachineryMeasurementResource {
  name: string;
  unit: string;
  value?: number;
  last_updated?: string;
}
