export interface WorkOrderTechnician {
  name: string;
  machines: string[];
}

export interface WorkOrderEntity {
  id?: number;
  code: string;
  date: string;
  productionLine: string;
  type: string;
  technicians: WorkOrderTechnician[];
}
