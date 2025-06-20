import { MachineryResource } from './machinery.resource';

/**
 * Representa la estructura de datos tal como llega de la API
 */
export interface ProductionLineResource {
  id: number;
  name: string;
  code: string;
  max_units_per_hour: number;
  unit: string;
  status: string;
  plant_id: number;
  machineries?: MachineryResource[];
}

/**
 * Estructura para crear una nueva línea de producción
 */
export interface CreateProductionLineResource {
  name: string;
  code: string;
  max_units_per_hour: number;
  unit: string;
  status: string;
  plant_id: number;
  machineries?: number[];
}

/**
 * Estructura para actualizar una línea de producción existente
 */
export interface UpdateProductionLineResource {
  name?: string;
  code?: string;
  max_units_per_hour?: number;
  unit?: string;
  status?: string;
  plant_id?: number;
  machineries?: number[];
}
