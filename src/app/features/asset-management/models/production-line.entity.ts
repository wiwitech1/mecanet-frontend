import { MachineryEntity } from './machinery.entity';

/**
 * Representa una línea de producción en el sistema
 */
export interface ProductionLineEntity {
  id: number;
  name: string;
  code: string;
  maxUnitsPerHour: number;
  unit: string;
  status: string;
  plantId: number;
}

/**
 * Enumeración para los posibles estados de una línea de producción
 */
export enum ProductionLineStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}
