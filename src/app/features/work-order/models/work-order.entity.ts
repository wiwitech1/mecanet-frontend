import { WorkOrderStatus } from './work-order-status.entity';
import { WorkOrderSchedule } from './work-order-schedule.entity';
import { WorkOrderTechnician } from './work-order-technician.entity';
import { WorkOrderMaterial } from './work-order-material.entity';
import { WorkOrderComment } from './work-order-comment.entity';
import { WorkOrderPhoto } from './work-order-photo.entity';

/**
 * Representa una orden de trabajo en el sistema
 */
export interface WorkOrderEntity {
    id: number;
    planId: number;
    taskId: number;
    machineId: number;
    title: string;
    description: string;
    status: WorkOrderStatus;
    maxTechnicians: number;
    requiredSkillIds: number[];
    schedule: WorkOrderSchedule | null;
    conclusions: string | null;
    tenantId: number;
    createdAt: Date;
    updatedAt: Date;
    technicians: WorkOrderTechnician[];
    materials: WorkOrderMaterial[];
    comments: WorkOrderComment[];
    photos: WorkOrderPhoto[];
    executionWindow?: any;
    executionSummary?: any;
} 