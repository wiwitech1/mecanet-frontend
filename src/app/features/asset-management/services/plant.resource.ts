import { ProductionLineResource } from './production-line.resource';

/**
 * Representa la estructura de datos tal como llega de la API
 */
export interface PlantResource {
    id: number;
    name: string;
    location: string;
    capacity: number;
    status: number;
    description: string;
    created_at: string; // Fecha en formato string desde la API
    updated_at: string; // Fecha en formato string desde la API
    production_lines: ProductionLineResource[];
}

/**
 * Estructura para crear una nueva planta
 */
export interface CreatePlantResource {
    name: string;
    location: string;
    capacity: number;
    status: number;
    description: string;
    production_lines?: number[]; // IDs de líneas de producción si se quieren asociar inicialmente
}

/**
 * Estructura para actualizar una planta existente
 */
export interface UpdatePlantResource {
    name?: string;
    location?: string;
    capacity?: number;
    status?: number;
    description?: string;
    production_lines?: number[]; // IDs de líneas de producción
} 