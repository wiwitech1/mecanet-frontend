import { MachineryResource } from './machinery.resource';
 
/**
 * Representa la estructura de datos tal como llega de la API
 */
export interface ProductionLineResource {
  id: number;
  plant_id: number;
  name: string;
  capacity: number;
  status: number;
  description: string;
  created_at: string;
  updated_at: string;
  machineries: MachineryResource[];
}

/**
 * Estructura para crear una nueva línea de producción
 */
export interface CreateProductionLineResource {
  name: string;
  plant_id: number;
  capacity: number;
  status: number;
  description: string;
  machineries?: number[]; // IDs de maquinarias
}

/**
 * Estructura para actualizar una línea de producción existente
 */
export interface UpdateProductionLineResource {
  name?: string;
  plant_id?: number;
  capacity?: number;
  status?: number;
  description?: string;
  machineries?: number[]; // IDs de maquinarias
}