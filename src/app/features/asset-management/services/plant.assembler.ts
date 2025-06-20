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
      address: resource.address,
      city: resource.city,
      country: resource.country,
      contactPhone: resource.contactPhone,
      contactEmail: resource.contactEmail,
      active: resource.active
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
      address: entity.address,
      city: entity.city,
      country: entity.country,
      contactPhone: entity.contactPhone,
      contactEmail: entity.contactEmail,
      active: entity.active
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
      address: entity.address!,
      city: entity.city!,
      country: entity.country!,
      contactPhone: entity.contactPhone!,
      contactEmail: entity.contactEmail!
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
    if (entity.address !== undefined) resource.address = entity.address;
    if (entity.city !== undefined) resource.city = entity.city;
    if (entity.country !== undefined) resource.country = entity.country;
    if (entity.contactPhone !== undefined) resource.contactPhone = entity.contactPhone;
    if (entity.contactEmail !== undefined) resource.contactEmail = entity.contactEmail;
    return resource;
  }
}
