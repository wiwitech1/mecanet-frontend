import { MetricDefinitionEntity } from '../models/metric-definition.entity';
import { MetricDefinitionResource } from './metric-definition.resource';

/**
 * Clase responsable de transformar entre entidades de definiciones de métricas y recursos de la API
 */
export class MetricDefinitionAssembler {

  /**
   * Convierte un recurso de la API a una entidad
   */
  static resourceToEntity(resource: MetricDefinitionResource): MetricDefinitionEntity {
    return {
      id: resource.id,
      name: resource.name,
      unit: resource.unit,
      description: resource.description
    };
  }

  /**
   * Convierte múltiples recursos a entidades
   */
  static resourcesToEntities(resources: MetricDefinitionResource[]): MetricDefinitionEntity[] {
    return resources.map(resource => this.resourceToEntity(resource));
  }
} 