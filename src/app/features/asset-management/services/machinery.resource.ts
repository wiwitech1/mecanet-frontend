/**
 * Representa la estructura de datos tal como llega de la API
 */
export interface MachineryResource {
    id: number;
    name: string;
    model: string;
    brand: string;
    serial_number: string; // snake_case como viene de la API
    production_capacity: number; // snake_case como viene de la API
    recommendations: string;
    status: number;
    user_creator: number; // snake_case como viene de la API
    user_updater: number; // snake_case como viene de la API
    created_at: string; // Fecha en formato string desde la API
    updated_at: string; // Fecha en formato string desde la API
    measurements: MachineryMeasurementResource[]; // Añadido para reflejar la nueva estructura
  }
  
  /**
   * Estructura para crear una nueva máquina
   */
  export interface CreateMachineryResource {
    name: string;
    model: string;
    brand: string;
    serial_number: string;
    production_capacity?: number;
    recommendations?: string;
    status: number;
    user_creator: number;
    measurements: CreateMachineryMeasurementResource[];
  }
  
  /**
   * Estructura para actualizar una máquina existente
   */
  export interface UpdateMachineryResource {
    name?: string;
    model?: string;
    brand?: string;
    serial_number?: string;
    production_capacity?: number;
    recommendations?: string;
    status?: number;
    user_updater: number;
    measurements?: CreateMachineryMeasurementResource[];
  }

export interface MeasurementResource {
  id: number;
  name: string;
  unit: string;
}

export interface MachineryMeasurementResource extends MeasurementResource {
  value: number;
  last_updated: string;
}

export interface CreateMachineryMeasurementResource {
  name: string;
  unit: string;
  value?: number;
  last_updated?: string;
}