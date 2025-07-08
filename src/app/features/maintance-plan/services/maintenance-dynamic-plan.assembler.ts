import { MaintenanceDynamicPlan } from "../model/maintenance-dynamic-plan.model";
import { MaintenanceDynamicPlanResource } from "./maintenance-dynamic-plan.resource";

export class MaintenanceDynamicPlanAssembler {
    static toEntity(resource: MaintenanceDynamicPlanResource): MaintenanceDynamicPlan {
      return {
        name: resource.name,
        startDate: new Date(resource.startDate),  // Convertir el string a un objeto Date
        endDate: new Date(resource.endDate),      // Convertir el string a un objeto Date
        metricDefinitionId: resource.metricDefinitionId,
        threshold: resource.threshold,
        tasks: resource.tasks.map(task => ({
          machineId: task.machineId,
          taskName: task.taskName,
          description: task.description,
          skillIds: task.skillIds
        }))
      };
    }
  }
  