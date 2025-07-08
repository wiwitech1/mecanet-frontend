/**
 * Representa una definición de métrica global en el sistema
 */
export interface MetricDefinitionEntity {
    id: number;
    name: string;
    unit: string;
    description?: string;
} 