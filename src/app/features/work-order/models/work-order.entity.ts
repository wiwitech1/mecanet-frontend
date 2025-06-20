export interface WorkOrderTechnician {
  id?: number;
  name: string;
  email?: string;
  machines: string[];
  assignedAt?: Date;
}

export interface WorkOrderEntity {
  id?: number;
  code: string;
  date: string;
  productionLine: string;
  type: string;
  status?: string;
  description?: string;
  priority?: string;
  technicians: WorkOrderTechnician[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}
