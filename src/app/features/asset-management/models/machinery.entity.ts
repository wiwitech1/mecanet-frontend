import { MachineryMeasurementEntity } from './measurement.entity';

/**
 * Representa una maquinaria en el sistema
 */
export interface MachineryEntity {
    id: number;
    serialNumber: string;
    name: string;
    manufacturer: string;
    model: string;
    type: string;
    powerConsumption: number;
    status: string;
    productionLineId: number | null;
    lastMaintenanceDate: string | null;
    nextMaintenanceDate: string | null;
    measurements?: MachineryMeasurementEntity[];
}

/**
 * Estados posibles de una maquinaria
 */
export enum MachineryStatus {
    OPERATIONAL = 'OPERATIONAL',
    MAINTENANCE = 'MAINTENANCE',
    REPAIR = 'REPAIR',
    INACTIVE = 'INACTIVE'
}
