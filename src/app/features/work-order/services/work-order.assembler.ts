import { WorkOrderEntity, WorkOrderTechnician } from '../models/work-order.entity';
import {
  WorkOrderResource,
  CreateWorkOrderResource,
  UpdateWorkOrderResource,
  WorkOrderTechnicianResource,
  CreateWorkOrderTechnicianResource
} from './work-order.resource';

/**
 * Clase responsable de transformar entre entidades de órdenes de trabajo y recursos de la API
 */
export class WorkOrderAssembler {
  /**
   * Convierte un recurso de la API a una entidad
   * @param resource El recurso recibido de la API
   * @returns La entidad de orden de trabajo
   */
  static resourceToEntity(resource: WorkOrderResource): WorkOrderEntity {
    return {
      id: resource.id,
      code: resource.code,
      date: resource.date,
      productionLine: resource.production_line,
      type: resource.type,
      status: resource.status,
      description: resource.description,
      priority: resource.priority,
      technicians: resource.assigned_technicians
        ? resource.assigned_technicians.map(this.technicianResourceToEntity)
        : [],
      createdAt: new Date(resource.created_at),
      updatedAt: new Date(resource.updated_at),
      createdBy: resource.created_by,
      updatedBy: resource.updated_by
    };
  }

  /**
   * Convierte múltiples recursos a entidades
   * @param resources Los recursos recibidos de la API
   * @returns Lista de entidades de orden de trabajo
   */
  static resourcesToEntities(resources: WorkOrderResource[]): WorkOrderEntity[] {
    return resources.map(resource => this.resourceToEntity(resource));
  }

  /**
   * Convierte una entidad a un recurso para enviar a la API (para crear)
   * @param entity La entidad de orden de trabajo
   * @returns El recurso para crear en la API
   */
  static entityToCreateResource(entity: WorkOrderEntity): CreateWorkOrderResource {
    return {
      code: entity.code,
      date: entity.date,
      production_line: entity.productionLine,
      type: entity.type,
      status: entity.status || 'pending',
      description: entity.description,
      priority: entity.priority || 'medium',
      assigned_technicians: entity.technicians
        ? entity.technicians.map(this.technicianEntityToCreateResource)
        : [],
      created_by: entity.createdBy || 1 // Default user ID
    };
  }

  /**
   * Convierte una entidad a un recurso para enviar a la API (para actualizar)
   * @param entity La entidad de orden de trabajo
   * @returns El recurso para actualizar en la API
   */
  static entityToUpdateResource(entity: WorkOrderEntity): UpdateWorkOrderResource {
    return {
      code: entity.code,
      date: entity.date,
      production_line: entity.productionLine,
      type: entity.type,
      status: entity.status,
      description: entity.description,
      priority: entity.priority,
      assigned_technicians: entity.technicians
        ? entity.technicians.map(this.technicianEntityToCreateResource)
        : [],
      updated_by: entity.updatedBy || 1 // Default user ID
    };
  }

  /**
   * Convierte un recurso de técnico a una entidad
   * @param resource El recurso de técnico recibido de la API
   * @returns La entidad de técnico
   */
  static technicianResourceToEntity(resource: WorkOrderTechnicianResource): WorkOrderTechnician {
    return {
      id: resource.id,
      name: resource.name,
      email: resource.email,
      machines: resource.assigned_machines,
      assignedAt: new Date(resource.assigned_at)
    };
  }

  /**
   * Convierte una entidad de técnico a un recurso para crear/actualizar
   * @param entity La entidad de técnico
   * @returns El recurso de técnico para la API
   */
  static technicianEntityToCreateResource(entity: WorkOrderTechnician): CreateWorkOrderTechnicianResource {
    return {
      name: entity.name,
      email: entity.email || '',
      assigned_machines: entity.machines
    };
  }
}
