/**
 * Representa una definición de métrica tal como llega de la API
 */
export interface MetricDefinitionResource {
  id: number;
  name: string;
  unit: string;
  description?: string;
} 