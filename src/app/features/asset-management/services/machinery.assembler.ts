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
   * Convierte un measurement resource a una entidad
   */
  private static measurementResourceToEntity(resource: MachineryMeasurementResource): MachineryMeasurementEntity {
    return {
      id: resource.id,
      name: resource.name,
      unit: resource.unit,
      value: resource.value,
      lastUpdated: new Date(resource.last_updated)
    };
  }

  /**
   * Convierte un recurso de la API a una entidad
   */
  static resourceToEntity(resource: MachineryResource): MachineryEntity {
    return {
      id: resource.id,
      serialNumber: resource.serialNumber,
      name: resource.name,
      manufacturer: resource.manufacturer,
      model: resource.model,
      type: resource.type,
      powerConsumption: resource.powerConsumption,
      status: resource.status,
      productionLineId: resource.productionLineId,
      lastMaintenanceDate: new Date(resource.lastMaintenanceDate),
      nextMaintenanceDate: new Date(resource.nextMaintenanceDate),
      measurements: resource.measurements?.map(m => this.measurementResourceToEntity(m))
    };
  }

  /**
   * Convierte múltiples recursos a entidades
   */
  static resourcesToEntities(resources: MachineryResource[]): MachineryEntity[] {
    return resources.map(this.resourceToEntity);
  }

  /**
   * Convierte una entidad a un recurso para crear en la API
   */
  static entityToCreateResource(entity: MachineryEntity): CreateMachineryResource {
    return {
      serialNumber: entity.serialNumber,
      name: entity.name,
      manufacturer: entity.manufacturer,
      model: entity.model,
      type: entity.type,
      powerConsumption: entity.powerConsumption,
      measurements: entity.measurements?.map(m => ({
        name: m.name,
        unit: m.unit
      }))
    };
  }

  /**
   * Convierte una entidad a un recurso para actualizar en la API
   */
  static entityToUpdateResource(entity: MachineryEntity): UpdateMachineryResource {
    return {
      serialNumber: entity.serialNumber,
      name: entity.name,
      manufacturer: entity.manufacturer,
      model: entity.model,
      type: entity.type,
      powerConsumption: entity.powerConsumption,
      status: entity.status,
      productionLineId: entity.productionLineId
    };
  }
}
