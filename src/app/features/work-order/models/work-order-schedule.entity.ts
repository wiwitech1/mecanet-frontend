/**
 * Representa la programación de una orden de trabajo
 */
export interface WorkOrderSchedule {
    date: string;
    startTime: string;
    endTime?: string;
    durationHours: number | null;
} 