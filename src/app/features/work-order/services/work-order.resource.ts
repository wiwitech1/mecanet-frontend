/**
 * Representa la estructura de datos tal como llega de la API
 */
export interface WorkOrderResource {
  id: number;
  code: string;
  date: string;
  production_line: string; // snake_case como viene de la API
  type: string;
  status: string;
  description?: string;
  priority: string;
  assigned_technicians: WorkOrderTechnicianResource[]; // snake_case como viene de la API
  created_at: string; // Fecha en formato string desde la API
  updated_at: string; // Fecha en formato string desde la API
  created_by: number; // ID del usuario creador
  updated_by?: number; // ID del usuario actualizador
}

/**
 * Representa la estructura de datos de un técnico asignado
 */
export interface WorkOrderTechnicianResource {
  id: number;
  name: string;
  email: string;
  assigned_machines: string[]; // snake_case como viene de la API
  assigned_at: string; // Fecha de asignación
}

/**
 * Estructura para crear una nueva orden de trabajo
 */
export interface CreateWorkOrderResource {
  code: string;
  date: string;
  production_line: string;
  type: string;
  status: string;
  description?: string;
  priority: string;
  assigned_technicians?: CreateWorkOrderTechnicianResource[];
  created_by: number;
}

/**
 * Estructura para actualizar una orden de trabajo existente
 */
export interface UpdateWorkOrderResource {
  code?: string;
  date?: string;
  production_line?: string;
  type?: string;
  status?: string;
  description?: string;
  priority?: string;
  assigned_technicians?: CreateWorkOrderTechnicianResource[];
  updated_by: number;
}

/**
 * Estructura para crear/actualizar un técnico asignado
 */
export interface CreateWorkOrderTechnicianResource {
  name: string;
  email: string;
  assigned_machines: string[];
}

/**
 * Respuesta de la API para listado de órdenes de trabajo
 */
export interface WorkOrderListResponse {
  data: WorkOrderResource[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Respuesta de la API para una orden de trabajo específica
 */
export interface WorkOrderResponse {
  data: WorkOrderResource;
  message?: string;
}
