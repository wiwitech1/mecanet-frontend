/**
 * Representa la estructura de datos tal como llega de la API
 */
export interface WorkOrderResource {
  id: number;
  planId: number;
  taskId: number;
  machineId: number;
  title: string;
  description: string;
  status: string;
  maxTechnicians: number;
  requiredSkillIds: number[];
  schedule: string;
  executionWindow: any;
  conclusions: string | null;
  comments: CommentResource[];
  photos: PhotoResource[];
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  technicians: TechnicianResource[];
  materials: MaterialResource[];
  executionSummary: any;
}

/**
 * Representa un técnico en la respuesta de la API
 */
export interface TechnicianResource {
  technicianId: number;
  fullName: string;
  role: string;
  status: string;
  joinedAt: string;
  withdrawalReason: string | null;
}

/**
 * Representa un material en la respuesta de la API
 */
export interface MaterialResource {
  itemId: number;
  itemSku: string;
  itemName: string;
  requestedQty: number;
  finalQty: number | null;
}

/**
 * Representa un comentario en la respuesta de la API
 */
export interface CommentResource {
  id?: number;
  authorUserId: number;
  text: string;
  createdAt?: string;
}

/**
 * Representa una foto en la respuesta de la API
 */
export interface PhotoResource {
  id?: number;
  authorUserId: number;
  url: string;
  uploadedAt?: string;
} 