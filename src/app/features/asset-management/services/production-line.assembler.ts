import { ProductionLineEntity } from '../models/production-line.entity';
import {
  ProductionLineResource,
  CreateProductionLineResource,
  UpdateProductionLineResource
} from './production-line.resource';
import { MachineryAssembler } from './machinery.assembler';

/**
 * Clase responsable de transformar entre entidades de líneas de producción y recursos de la API
 */
export class ProductionLineAssembler {
  /**
   * Convierte un recurso de la API a una entidad
   * @param resource El recurso recibido de la API
   * @returns La entidad de línea de producción
   */
  public static resourceToEntity(resource: any): ProductionLineEntity {
    if (!resource) return null as any;

    return {
      id: resource.id,
      name: resource.name,
      code: resource.code,
      maxUnitsPerHour: resource.max_units_per_hour,
      unit: resource.unit,
      status: resource.status,
      plantId: resource.plant_id,
      machineries: resource.machineries
        ? resource.machineries.map(MachineryAssembler.resourceToEntity)
        : []
    };
  }

  /**
   * Convierte múltiples recursos a entidades
   * @param resources Los recursos recibidos de la API
   * @returns Lista de entidades de línea de producción
   */
  static resourcesToEntities(resources: ProductionLineResource[]): ProductionLineEntity[] {
    return resources.map(resource => this.resourceToEntity(resource));
  }

  /**
   * Convierte una entidad a un recurso para enviar a la API (para crear)
   * @param entity La entidad de línea de producción
   * @returns El recurso para crear en la API
   */
  static entityToCreateResource(entity: ProductionLineEntity): CreateProductionLineResource {
    return {
      name: entity.name,
      code: entity.code,
      max_units_per_hour: entity.maxUnitsPerHour,
      unit: entity.unit,
      status: entity.status,
      plant_id: entity.plantId,
      machineries: entity.machineries?.map(m => m.id)
    };
  }

  /**
   * Convierte una entidad a un recurso para enviar a la API (para actualizar)
   * @param entity La entidad de línea de producción
   * @returns El recurso para actualizar en la API
   */
  static entityToUpdateResource(entity: ProductionLineEntity): UpdateProductionLineResource {
    return {
      name: entity.name,
      code: entity.code,
      max_units_per_hour: entity.maxUnitsPerHour,
      unit: entity.unit,
      status: entity.status,
      plant_id: entity.plantId,
      machineries: entity.machineries?.map(m => m.id)
    };
  }

  public static entityToResource(entity: ProductionLineEntity): any {
    if (!entity) return null;

    return {
      id: entity.id,
      name: entity.name,
      // ... resto de propiedades
    };
  }
}
