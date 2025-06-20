import { WorkOrderExecution } from "../models/execution.model";
import { WorkOrderExecutionResource } from "./execution.resource";
import { ExecutionCardData, ExecutionProduct, ExecutionTask } from "../models/execution.model";
import { MachineryExecutionResource } from "./execution.resource";

export class WorkOrderExecutionAssembler {
    static fromResource(resource: WorkOrderExecutionResource): WorkOrderExecution {
        return {
            id: resource.id,
            name: resource.name
        };
        }
    }


export class MachineryAssembler {
  static fromResource(resource: MachineryExecutionResource): ExecutionCardData {
          return {
            machineryName: resource.machineryName,
            workOrderId: resource.workOrderId,
            tasks: MachineryAssembler.getHardcodedTasks(),
            observations: 'Observación generada automáticamente para la maquinaria.',
            products: MachineryAssembler.getHardcodedProducts()
          };
  }
      
        // Métodos para obtener los datos hardcodeados
        static getHardcodedTasks(): ExecutionTask[] {
          return [
            { label: 'Drenar aceite viejo al depósito aprobado', completed: false },
            { label: 'Reemplazar filtro hidráulico', completed: false },
            { label: 'Rellenar con aceite nuevo', completed: false },
            { label: 'Arranque de prueba y verificación de presión', completed: false },
            { label: 'Inspección de fugas en un recorrido de 5 min', completed: false }
          ];
        }
      
        static getHardcodedProducts(): ExecutionProduct[] {
          return [
            { name: 'Aceite hidráulico', quantity: 2 },
            { name: 'Filtro hidráulico', quantity: 1 }
          ];
        }
      }