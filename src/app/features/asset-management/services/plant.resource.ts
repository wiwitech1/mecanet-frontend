import { ProductionLineResource } from './production-line.resource';

/**
 * Representa la estructura de datos tal como llega de la API
 */
export interface PlantResource {
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
 * Estructura para crear una nueva planta
 */
export interface CreatePlantResource {
    name: string;
    address: string;
    city: string;
    country: string;
    contactPhone: string;
    contactEmail: string;
}

/**
 * Estructura para actualizar una planta existente
 */
export interface UpdatePlantResource {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    contactPhone?: string;
    contactEmail?: string;
}
