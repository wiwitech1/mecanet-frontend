/**
 * Representa un material requerido para una orden de trabajo
 */
export interface WorkOrderMaterial {
    id?: number;
    itemId: number;
    itemSku: string;
    itemName: string;
    requestedQty: number;
    finalQty: number | null;
} 