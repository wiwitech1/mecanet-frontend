/**
 * Representa un comentario en una orden de trabajo
 */
export interface WorkOrderComment {
    id?: number;
    authorUserId: number;
    text: string;
    createdAt?: Date;
} 