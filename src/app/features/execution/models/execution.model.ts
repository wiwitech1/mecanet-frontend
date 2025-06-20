export interface ExecutionTask {
  label: string;
  completed: boolean;
}

export interface ExecutionProduct {
  name: string;
  quantity: number;
}

export interface ExecutionCardData {
  machineryName: string;
  workOrderId: string;
  tasks: ExecutionTask[];
  observations: string;
  products: ExecutionProduct[];
}

export interface WorkOrderExecution {
  id: string;
  name: string;
}

