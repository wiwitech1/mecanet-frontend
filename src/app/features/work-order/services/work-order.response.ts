import { WorkOrderResource, WorkOrderListResponse, WorkOrderResponse } from './work-order.resource';

/**
 * Clase que define los tipos de respuesta de la API para órdenes de trabajo
 */
export class WorkOrderApiResponse {
  /**
   * Respuesta para obtener una lista de órdenes de trabajo
   */
  static getListResponse(): WorkOrderListResponse {
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10
    };
  }

  /**
   * Respuesta para obtener una orden de trabajo específica
   */
  static getSingleResponse(): WorkOrderResponse {
    return {
      data: {} as WorkOrderResource,
      message: 'Success'
    };
  }

  /**
   * Respuesta de error genérica
   */
  static getErrorResponse(message: string = 'Error occurred'): { error: string; message: string } {
    return {
      error: 'API_ERROR',
      message
    };
  }

  /**
   * Respuesta de éxito para operaciones CRUD
   */
  static getSuccessResponse(message: string = 'Operation successful'): { success: boolean; message: string } {
    return {
      success: true,
      message
    };
  }
}
