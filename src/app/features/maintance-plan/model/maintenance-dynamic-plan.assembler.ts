import { MaintenanceDynamicPlan } from './maintenance-dynamic-plan.model';

export class MaintenanceDynamicPlanAssembler {

  static toModel(apiData: any): MaintenanceDynamicPlan {
    if (!apiData) return {
      dynamicPlanId: 0,
      userCreator: 0,
      parameter: '',
      startDate: new Date(),
      machineIds: [],
      tasks: []
    };
    
    return {
      dynamicPlanId: apiData.dynamicPlanId,
      id: apiData.id,
      userCreator: apiData.userCreator,
      parameter: apiData.parameter,
      startDate: new Date(apiData.startDate),
      machineIds: Array.isArray(apiData.machineIds) ? apiData.machineIds : [],
      tasks: Array.isArray(apiData.tasks) ? apiData.tasks.map((task: any) => ({
        taskId: task.taskId || 0,
        taskName: task.taskName || '',
        taskDescription: task.taskDescription || '',
        machineIds: Array.isArray(task.machineIds) ? task.machineIds : []
      })) : []
    };
  }

  static toApiFormat(model: MaintenanceDynamicPlan): any {
    return {
      dynamicPlanId: model.dynamicPlanId,
      userCreator: model.userCreator,
      parameter: model.parameter,
      startDate: model.startDate instanceof Date ? model.startDate.toISOString() : model.startDate,
      machineIds: model.machineIds,
      tasks: model.tasks.map(task => ({
        taskId: task.taskId,
        taskName: task.taskName,
        taskDescription: task.taskDescription,
        machineIds: task.machineIds
      })),
      id: model.dynamicPlanId // Para json-server, usamos el mismo valor que dynamicPlanId
    };
  }
} 