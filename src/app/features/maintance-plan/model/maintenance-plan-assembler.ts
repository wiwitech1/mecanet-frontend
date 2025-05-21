import { MaintenancePlanData,MaintenancePlanItem, MaintenanceTask } from "./maintenance-plan.entity";
import {MaintenancePlanResource, MaintenancePlanItemResource, MaintenanceTaskResource} from "./maintenance-plan.resource";

export class MaintenancePlanAssembler {

  static fromResource(resource: MaintenancePlanResource): MaintenancePlanData {
    return {
      id: resource.id,
      planId: resource.planId,
      repeatCycle: resource.repeatCycle,
      planName: resource.planName,
      productionLineId: resource.productionLineId,
      startDate: new Date(resource.startDate),
      durationDays: resource.durationDays,
      userCreator: resource.userCreator,
      items: resource.items.map((item: MaintenancePlanItemResource) => ({
        dayNumber: item.dayNumber,
        tasks: item.tasks.map((task: MaintenanceTaskResource) => ({
          taskId: task.taskId,
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          machineIds: task.machineIds,
        })),
      })),
    };
  }

  static fromResourceList(resources: MaintenancePlanResource[]): MaintenancePlanData[] {
    return resources.map(r => this.fromResource(r));
  }

  static toResource(data: MaintenancePlanData): MaintenancePlanResource {
    return {
      id: data.id,
      planId: data.planId,
      planName: data.planName,
      repeatCycle: data.repeatCycle,
      productionLineId: data.productionLineId,
      startDate: data.startDate.toISOString(),
      durationDays: data.durationDays,
      userCreator: data.userCreator,
      items: data.items.map((item: MaintenancePlanItem) => ({
        dayNumber: item.dayNumber,
        tasks: item.tasks.map((task: MaintenanceTask) => ({
          taskId: task.taskId,
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          machineIds: task.machineIds,
        })),
      })),
    };
  }
}
