import { MachineryMeasurementEntity } from './measurement.entity';

/**
 * Representa una máquina en el sistema
 */
export interface MachineryEntity {
    id: number;
    name: string;
    model: string;
    brand: string;
    serialNumber: string;
    productionCapacity: number;
    recommendations: string;
    status: number;
    userCreator: number;
    userUpdater: number;
    createdAt: Date;
    updatedAt: Date;
    measurements: MachineryMeasurementEntity[];
}

/**
 * Enumeración para los posibles estados de una máquina
 */
export enum MachineryStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    MAINTENANCE = 2,
    REPAIR = 3
}