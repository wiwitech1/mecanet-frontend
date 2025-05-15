import { Injectable } from '@angular/core';

import { PlantEntity } from '../models/plant.entity';
import {
  CreatePlantResource,
  PlantResource,
  UpdatePlantResource
} from './plant.resource';
import { ProductionLineAssembler } from './production-line.assembler';

@Injectable({
  providedIn: 'root'
})
export class PlantAssembler {
  constructor() {}

  /**
   * Convierte un recurso de planta de la API a una entidad para el front
   * @param resource El recurso que llega de la API
   * @returns La entidad para usar en el front
   */
  resourceToEntity(resource: PlantResource): PlantEntity {
    return {
      id: resource.id,
      name: resource.name,
      location: resource.location,
      capacity: resource.capacity,
      status: resource.status,
      description: resource.description,
      createdAt: new Date(resource.created_at),
      updatedAt: new Date(resource.updated_at),
      productionLines: resource.production_lines ? 
        resource.production_lines.map(line => ProductionLineAssembler.resourceToEntity(line)) : []
    };
  }

  /**
   * Convierte una entidad de planta a un recurso para la API
   * @param entity La entidad del front
   * @returns El recurso para enviar a la API
   */
  entityToResource(entity: PlantEntity): PlantResource {
    // Nota: En una aplicación real, se tendría que hacer una conversión completa
    // de los objetos anidados, pero para simplificar solo se incluyen los IDs
    return {
      id: entity.id,
      name: entity.name,
      location: entity.location,
      capacity: entity.capacity,
      status: entity.status,
      description: entity.description,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
      production_lines: [] // En la práctica, se haría una llamada adicional para obtener estas entidades completas
    };
  }

  /**
   * Convierte una entidad nueva de planta a un recurso para crear en la API
   * @param entity La entidad nueva
   * @returns El recurso para enviar a la API
   */
  createEntityToResource(entity: Partial<PlantEntity>): CreatePlantResource {
    return {
      name: entity.name!,
      location: entity.location!,
      capacity: entity.capacity!,
      status: entity.status!,
      description: entity.description!,
      production_lines: entity.productionLines ? entity.productionLines.map(line => line.id) : []
    };
  }

  /**
   * Convierte una entidad para actualizar a un recurso para la API
   * @param entity La entidad con los campos actualizados
   * @returns El recurso para enviar a la API
   */
  updateEntityToResource(entity: Partial<PlantEntity>): UpdatePlantResource {
    const resource: UpdatePlantResource = {};
    
    if (entity.name !== undefined) resource.name = entity.name;
    if (entity.location !== undefined) resource.location = entity.location;
    if (entity.capacity !== undefined) resource.capacity = entity.capacity;
    if (entity.status !== undefined) resource.status = entity.status;
    if (entity.description !== undefined) resource.description = entity.description;
    if (entity.productionLines !== undefined) {
      resource.production_lines = entity.productionLines.map(line => line.id);
    }
    
    return resource;
  }
} 