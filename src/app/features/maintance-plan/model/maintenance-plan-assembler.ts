import { MaintenancePlanData } from './maintenance-plan.model';

// Nota: Este ensamblador ya no se usa en el servicio principal, pero lo mantenemos
// para posible uso futuro con APIs más complejas
export class MaintenancePlanAssembler {

  // Convierte los datos de la API a un modelo de MaintenancePlanData
  static toModel(apiData: any): MaintenancePlanData | null {
    if (!apiData) return null;

    return {
      planId: apiData.planId,
      productionLineId: apiData.productionLineId,
      startDate: new Date(apiData.startDate),
      durationDays: apiData.durationDays,
      userCreator: apiData.userCreator,
      items: apiData.items.map((item: any) => ({
        dayNumber: item.dayNumber,
        tasks: item.tasks.map((task: any) => ({
          taskId: task.taskId,
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          machineIds: task.machineIds
        }))
      }))
    };
  }

  // Convierte una lista de datos de la API a una lista de modelos
  static toModelList(apiDataList: any[]): MaintenancePlanData[] {
    if (!apiDataList) return [];
    return apiDataList.map(data => this.toModel(data)).filter((item): item is MaintenancePlanData => item !== null);
  }

  // Convierte un modelo a formato adecuado para la API
  static toApiFormat(model: MaintenancePlanData): any {
    if (!model) return null;
    
    return {
      planId: model.planId,
      productionLineId: model.productionLineId,
      startDate: model.startDate instanceof Date ? model.startDate.toISOString() : model.startDate,
      durationDays: model.durationDays,
      userCreator: model.userCreator,
      items: model.items.map(item => ({
        dayNumber: item.dayNumber,
        tasks: item.tasks.map(task => ({
          taskId: task.taskId,
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          machineIds: task.machineIds
        }))
      }))
    };
  }
} 