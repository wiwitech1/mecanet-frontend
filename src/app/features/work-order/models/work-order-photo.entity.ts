/**
 * Representa una foto/evidencia de una orden de trabajo
 */
export interface WorkOrderPhoto {
    id?: number;
    authorUserId: number;
    url: string;
    uploadedAt?: Date;
} 