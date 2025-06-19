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
  tasks: ExecutionTask[];
  observations: string;
  products: ExecutionProduct[];
}
