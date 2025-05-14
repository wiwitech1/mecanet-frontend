import { MachineryEntity } from '../models/machinery.entity';
import { 
  MachineryResource, 
  CreateMachineryResource, 
  UpdateMachineryResource,
  MachineryMeasurementResource
} from './machinery.resource';
import { MachineryMeasurementEntity } from '../models/measurement.entity';

/**
 * Clase responsable de transformar entre entidades de máquinas y recursos de la API
 */
export class MachineryAssembler {
  /**
   * Convierte un recurso de la API a una entidad
   * @param resource El recurso recibido de la API
   * @returns La entidad de máquina
   */
  static resourceToEntity(resource: MachineryResource): MachineryEntity {
    return {
      id: resource.id,
      name: resource.name,
      model: resource.model,
      brand: resource.brand,
      serialNumber: resource.serial_number,
      productionCapacity: resource.production_capacity,
      recommendations: resource.recommendations,
      status: resource.status,
      userCreator: resource.user_creator,
      userUpdater: resource.user_updater,
      createdAt: new Date(resource.created_at),
      updatedAt: new Date(resource.updated_at),
      measurements: resource.measurements.map(this.measurementResourceToEntity)
    };
  }

  /**
   * Convierte múltiples recursos a entidades
   * @param resources Los recursos recibidos de la API
   * @returns Lista de entidades de máquina
   */
  static resourcesToEntities(resources: MachineryResource[]): MachineryEntity[] {
    return resources.map(resource => this.resourceToEntity(resource));
  }

  /**
   * Convierte una entidad a un recurso para enviar a la API (para crear)
   * @param entity La entidad de máquina
   * @returns El recurso para crear en la API
   */
  static entityToCreateResource(entity: MachineryEntity): CreateMachineryResource {
    return {
      name: entity.name,
      model: entity.model,
      brand: entity.brand,
      serial_number: entity.serialNumber,
      production_capacity: entity.productionCapacity,
      recommendations: entity.recommendations,
      status: entity.status,
      user_creator: entity.userCreator
    };
  }

  /**
   * Convierte una entidad a un recurso para enviar a la API (para actualizar)
   * @param entity La entidad de máquina
   * @returns El recurso para actualizar en la API
   */
  static entityToUpdateResource(entity: MachineryEntity): UpdateMachineryResource {
    return {
      name: entity.name,
      model: entity.model,
      brand: entity.brand,
      serial_number: entity.serialNumber,
      production_capacity: entity.productionCapacity,
      recommendations: entity.recommendations,
      status: entity.status,
      user_updater: entity.userUpdater
    };
  }

  // Método para convertir un recurso de medición a una entidad
  static measurementResourceToEntity(resource: MachineryMeasurementResource): MachineryMeasurementEntity {
    return {
      id: resource.id,
      name: resource.name,
      unit: resource.unit,
      value: resource.value,
      lastUpdated: new Date(resource.last_updated)
    };
  }
}