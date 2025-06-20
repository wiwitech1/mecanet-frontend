export interface WorkOrderExecutionResource {
    id: string;
    name: string;
  }


  export interface MachineryExecutionResource {
    id: string;                // El ID de la maquinaria
    machineryName: string;     // El nombre de la maquinaria
    workOrderId: string;       // El ID de la orden de trabajo (por ejemplo, "OT01")
    tasks: { label: string, completed: boolean }[];  // Tareas relacionadas a la maquinaria
    observations: string;      // Observaciones (será hardcodeado)
    products: { name: string, quantity: number }[];  // Productos relacionados (serán hardcodeados)
  }
  