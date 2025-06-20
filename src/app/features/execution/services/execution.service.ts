import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkOrderExecution } from '../models/execution.model';
import { WorkOrderExecutionResource } from './execution.resource';
import { WorkOrderExecutionAssembler } from './execution.assembler';
import { ExecutionCardData } from '../models/execution.model';
import { MachineryExecutionResource } from './execution.resource';
import { MachineryAssembler } from './execution.assembler';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  private baseUrl = 'https://6854cc676a6ef0ed6630159d.mockapi.io/api/v1/';

  constructor(private http: HttpClient) {}

  // Obtener todas las órdenes de trabajo
  getWorkOrders(): Observable<WorkOrderExecution[]> {
    return this.http.get<WorkOrderExecutionResource[]>(`${this.baseUrl}/workOrders`)
      .pipe(
        map(resources => resources.map(WorkOrderExecutionAssembler.fromResource))
      );
  }

  // Obtener todas las maquinarias
  getMachineries(): Observable<ExecutionCardData[]> {
    return this.http.get<MachineryExecutionResource[]>(`${this.baseUrl}/titleMachinery`)
      .pipe(
        map(resources => resources.map(MachineryAssembler.fromResource))  // Convertir las maquinarias usando el assembler
      );
  }

  // Obtener maquinarias por workOrderId
  getMachineriesByWorkOrder(workOrderId: string): Observable<ExecutionCardData[]> {
    return this.getMachineries().pipe(
      map(machineries => machineries.filter(m => m.workOrderId === workOrderId))
    );
  }

  
}
