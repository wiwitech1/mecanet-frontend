/**
 * Estados posibles de una orden de trabajo
 */
export enum WorkOrderStatus {
  NEW = 'NEW',
  PUBLISHED = 'PUBLISHED', 
  REVIEW = 'REVIEW',
  PENDING_EXECUTION = 'PENDING_EXECUTION',
  IN_EXECUTION = 'IN_EXECUTION',
  COMPLETED = 'COMPLETED'
} 