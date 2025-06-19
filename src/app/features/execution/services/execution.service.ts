import { Injectable } from '@angular/core';
import { ExecutionCardData } from '../models/execution.model';

@Injectable({ providedIn: 'root' })
export class ExecutionService {
  // Aquí iría la lógica para obtener y guardar datos reales de ejecución
  getExecutionCards(): ExecutionCardData[] {
    return [];
  }
}
