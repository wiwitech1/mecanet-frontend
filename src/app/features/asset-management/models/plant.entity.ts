import { ProductionLineEntity } from './production-line.entity';

/**
 * Representa una planta en el sistema
 */
export interface PlantEntity {
    id: number;
    name: string;
    location: string;
    capacity: number;
    status: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    productionLines: ProductionLineEntity[];
}

/**
 * Enumeración para los posibles estados de una planta
 */
export enum PlantStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    MAINTENANCE = 2
} 