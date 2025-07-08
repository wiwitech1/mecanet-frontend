/**
 * Request para programar agenda de una orden de trabajo
 */
export interface ScheduleRequest {
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
  };
  maxTechnicians: number;
}

/**
 * Request para acciones de administrador
 */
export interface AdminActionRequest {
  adminUserId: number;
}

/**
 * Request para unirse a una orden de trabajo
 */
export interface JoinRequest {
  technicianId: {
    value: number;
  };
}

/**
 * Request para abandonar una orden de trabajo
 */
export interface LeaveRequest {
  technicianId: {
    value: number;
  };
  reason: string;
}

/**
 * Request para actualizar materiales
 */
export interface MaterialsRequest {
  materials: {
    itemId: number;
    sku: string;
    name: string;
    quantity: number;
  }[];
}

/**
 * Request para iniciar ejecución
 */
export interface StartExecutionRequest {
  technicianId: {
    value: number;
  };
  startAt: string;
}

/**
 * Request para agregar comentario
 */
export interface CommentRequest {
  authorUserId: number;
  text: string;
}

/**
 * Request para agregar foto
 */
export interface PhotoRequest {
  authorUserId: number;
  url: string;
}

/**
 * Request para cantidades finales de materiales
 */
export interface FinalQuantitiesRequest {
  finalQuantities: Record<string, number>;
}

/**
 * Request para completar orden de trabajo
 */
export interface CompleteRequest {
  technicianId: {
    value: number;
  };
  endAt: string;
  conclusions: string;
} 