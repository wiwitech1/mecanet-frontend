import { MachineryMeasurementEntity } from './measurement.entity';

/**
 * Representa una máquina en el sistema
 */
export interface MachineryEntity {
    id: number;
    serialNumber: string;
    name: string;
    manufacturer: string;
    model: string;
    type: string;
    powerConsumption: number;
    status: number;
    productionLineId: number;
    lastMaintenanceDate: Date;
    nextMaintenanceDate: Date;
    measurements?: MachineryMeasurementEntity[];
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