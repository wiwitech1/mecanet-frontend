import { MachineryEntity } from './machinery.entity';

/**
 * Representa una línea de producción en el sistema
 */
export interface ProductionLineEntity {
  id: number;
  plantId: number;
  name: string;
  capacity: number;
  status: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  machineries: MachineryEntity[];
}

/**
 * Enumeración para los posibles estados de una línea de producción
 */
export enum ProductionLineStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  MAINTENANCE = 2
}