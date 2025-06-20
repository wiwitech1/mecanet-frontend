import { ProductionLineEntity } from './production-line.entity';

/**
 * Representa una planta en el sistema
 */
export interface PlantEntity {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    contactPhone: string;
    contactEmail: string;
    active: boolean;
}

/**
 * Enumeración para los posibles estados de una planta
 */
export enum PlantStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    MAINTENANCE = 2
}