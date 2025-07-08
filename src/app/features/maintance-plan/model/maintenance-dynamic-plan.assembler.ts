import { MaintenanceDynamicPlanResource } from "../services/maintenance-dynamic-plan.resource";
import { MaintenanceDynamicPlan } from "./maintenance-dynamic-plan.model";

// MaintenanceDynamicPlanAssembler.ts
export class MaintenanceDynamicPlanAssembler {
  static toEntity(dto: MaintenanceDynamicPlanResource): MaintenanceDynamicPlan {
    return {
      name: dto.name,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      metricDefinitionId: dto.metricDefinitionId,
      threshold: dto.threshold,
      tasks: dto.tasks.map(task => ({
        machineId: task.machineId,
        taskName: task.taskName,
        description: task.description,
        skillIds: task.skillIds
      }))
    };
  }
}

