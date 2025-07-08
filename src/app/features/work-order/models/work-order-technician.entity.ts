import { TechnicianRole, TechnicianStatus } from './technician-role.entity';

/**
 * Representa un técnico asignado a una orden de trabajo
 */
export interface WorkOrderTechnician {
    id?: number;
    technicianId: number;
    fullName?: string;
    role: TechnicianRole;
    status: TechnicianStatus;
    joinedAt: Date;
    withdrawnAt?: Date | null;
    withdrawalReason?: string | null;
} 