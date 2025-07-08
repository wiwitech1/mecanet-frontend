import { WorkOrderEntity } from '../models/work-order.entity';
import { WorkOrderSchedule } from '../models/work-order-schedule.entity';
import { WorkOrderTechnician } from '../models/work-order-technician.entity';
import { WorkOrderMaterial } from '../models/work-order-material.entity';
import { WorkOrderComment } from '../models/work-order-comment.entity';
import { WorkOrderPhoto } from '../models/work-order-photo.entity';
import { WorkOrderStatus } from '../models/work-order-status.entity';
import { TechnicianRole, TechnicianStatus } from '../models/technician-role.entity';
import {
  WorkOrderResource,
  TechnicianResource,
  MaterialResource,
  CommentResource,
  PhotoResource
} from './work-order.resource';
import {
  ScheduleRequest,
  MaterialsRequest
} from './work-order.request';

/**
 * Clase responsable de transformar entre entidades de órdenes de trabajo y recursos de la API
 */
export class WorkOrderAssembler {

  /**
   * Convierte un schedule JSON string a una entidad de programación
   */
  private static parseSchedule(scheduleJson: string): WorkOrderSchedule | null {
    if (!scheduleJson) return null;
    
    try {
      const parsed = JSON.parse(scheduleJson);
      return {
        date: parsed.date,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        durationHours: parsed.durationHours
      };
    } catch (error) {
      console.error('Error parsing schedule JSON:', error);
      return null;
    }
  }

  /**
   * Convierte un recurso de técnico a una entidad
   */
  private static technicianResourceToEntity(resource: TechnicianResource): WorkOrderTechnician {
    return {
      technicianId: resource.technicianId,
      fullName: resource.fullName,
      role: resource.role as TechnicianRole,
      status: resource.status as TechnicianStatus,
      joinedAt: new Date(resource.joinedAt),
      withdrawnAt: null,
      withdrawalReason: resource.withdrawalReason
    };
  }

  /**
   * Convierte un recurso de material a una entidad
   */
  private static materialResourceToEntity(resource: MaterialResource): WorkOrderMaterial {
    return {
      itemId: resource.itemId,
      itemSku: resource.itemSku,
      itemName: resource.itemName,
      requestedQty: resource.requestedQty,
      finalQty: resource.finalQty
    };
  }

  /**
   * Convierte un recurso de comentario a una entidad
   */
  private static commentResourceToEntity(resource: CommentResource): WorkOrderComment {
    return {
      id: resource.id,
      authorUserId: resource.authorUserId,
      text: resource.text,
      createdAt: resource.createdAt ? new Date(resource.createdAt) : undefined
    };
  }

  /**
   * Convierte un recurso de foto a una entidad
   */
  private static photoResourceToEntity(resource: PhotoResource): WorkOrderPhoto {
    return {
      id: resource.id,
      authorUserId: resource.authorUserId,
      url: resource.url,
      uploadedAt: resource.uploadedAt ? new Date(resource.uploadedAt) : undefined
    };
  }

  /**
   * Convierte un recurso de la API a una entidad
   */
  static resourceToEntity(resource: WorkOrderResource): WorkOrderEntity {
    return {
      id: resource.id,
      planId: resource.planId,
      taskId: resource.taskId,
      machineId: resource.machineId,
      title: resource.title,
      description: resource.description,
      status: resource.status as WorkOrderStatus,
      maxTechnicians: resource.maxTechnicians,
      requiredSkillIds: resource.requiredSkillIds,
      schedule: this.parseSchedule(resource.schedule),
      conclusions: resource.conclusions,
      tenantId: resource.tenantId,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
      technicians: resource.technicians?.map(t => this.technicianResourceToEntity(t)) || [],
      materials: resource.materials?.map(m => this.materialResourceToEntity(m)) || [],
      comments: resource.comments?.map(c => this.commentResourceToEntity(c)) || [],
      photos: resource.photos?.map(p => this.photoResourceToEntity(p)) || [],
      executionWindow: resource.executionWindow,
      executionSummary: resource.executionSummary
    };
  }

  /**
   * Convierte múltiples recursos a entidades
   */
  static resourcesToEntities(resources: WorkOrderResource[]): WorkOrderEntity[] {
    return resources.map(resource => this.resourceToEntity(resource));
  }

  /**
   * Convierte una entidad y datos de programación a un request de schedule
   */
  static entityToScheduleRequest(
    schedule: WorkOrderSchedule,
    maxTechnicians: number
  ): ScheduleRequest {
    return {
      schedule: {
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime || '17:00'
      },
      maxTechnicians: maxTechnicians
    };
  }

  /**
   * Convierte materiales a un request de materials
   */
  static materialsToRequest(materials: WorkOrderMaterial[]): MaterialsRequest {
    return {
      materials: materials.map(material => ({
        itemId: material.itemId,
        sku: material.itemSku,
        name: material.itemName,
        quantity: material.requestedQty
      }))
    };
  }
} 