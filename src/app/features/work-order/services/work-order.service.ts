import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { WorkOrderEntity } from '../models/work-order.entity';
import { WorkOrderStatus } from '../models/work-order-status.entity';
import { WorkOrderSchedule } from '../models/work-order-schedule.entity';
import { WorkOrderMaterial } from '../models/work-order-material.entity';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';
import { WorkOrderAssembler } from './work-order.assembler';
import { WorkOrderResource } from './work-order.resource';
import {
  ScheduleRequest,
  AdminActionRequest,
  JoinRequest,
  LeaveRequest,
  MaterialsRequest,
  StartExecutionRequest,
  CommentRequest,
  PhotoRequest,
  FinalQuantitiesRequest,
  CompleteRequest
} from './work-order.request';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private apiUrl = environment.serverBaseUrl + '/workorders';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  private getHeaders(): HttpHeaders {
    const session = this.userService.getSession();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.token}`
    });
  }

  /**
   * Obtiene órdenes de trabajo por estado
   */
  getWorkOrdersByStatus(status: WorkOrderStatus): Observable<WorkOrderEntity[]> {
    const url = `${this.apiUrl}?status=${status}`;
    return this.http.get<WorkOrderResource[]>(url, { headers: this.getHeaders() }).pipe(
      map(resources => WorkOrderAssembler.resourcesToEntities(resources)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una orden de trabajo por ID
   */
  getWorkOrderById(id: number): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<WorkOrderResource>(url, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Programa la agenda de una orden de trabajo
   */
  scheduleWorkOrder(
    id: number,
    schedule: WorkOrderSchedule,
    maxTechnicians: number
  ): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/schedule`;
    const request = WorkOrderAssembler.entityToScheduleRequest(schedule, maxTechnicians);
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Publica una orden de trabajo para técnicos
   */
  publishWorkOrder(id: number, adminUserId: number): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/publish`;
    const request: AdminActionRequest = { adminUserId };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Un técnico se une a una orden de trabajo
   */
  joinWorkOrder(id: number, technicianId: number): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/join`;
    const request: JoinRequest = { technicianId: { value: technicianId } };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Un técnico abandona una orden de trabajo
   */
  leaveWorkOrder(id: number, technicianId: number, reason: string): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/leave`;
    const request: LeaveRequest = { 
      technicianId: { value: technicianId },
      reason: reason
    };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza los materiales de una orden de trabajo
   */
  updateMaterials(id: number, materials: WorkOrderMaterial[]): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/materials`;
    const request = WorkOrderAssembler.materialsToRequest(materials);
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Mueve una orden de trabajo a revisión
   */
  moveToReview(id: number, adminUserId: number): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/review`;
    const request: AdminActionRequest = { adminUserId };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Aprueba una orden de trabajo para ejecución
   */
  approveToPending(id: number, adminUserId: number): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/pending-execution`;
    const request: AdminActionRequest = { adminUserId };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Inicia la ejecución de una orden de trabajo
   */
  startExecution(id: number, technicianId: number, startAt: Date): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/start`;
    const request: StartExecutionRequest = {
      technicianId: { value: technicianId },
      startAt: startAt.toISOString()
    };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Agrega un comentario a una orden de trabajo
   */
  addComment(id: number, authorUserId: number, text: string): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/comment`;
    const request: CommentRequest = { authorUserId, text };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Agrega una foto a una orden de trabajo
   */
  addPhoto(id: number, authorUserId: number, url: string): Observable<WorkOrderEntity> {
    const url_endpoint = `${this.apiUrl}/${id}/photo`;
    const request: PhotoRequest = { authorUserId, url };
    
    return this.http.post<WorkOrderResource>(url_endpoint, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza las cantidades finales de materiales usados
   */
  updateFinalQuantities(id: number, finalQuantities: Record<string, number>): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/final-quantities`;
    const request: FinalQuantitiesRequest = { finalQuantities };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Completa una orden de trabajo
   */
  completeWorkOrder(
    id: number,
    technicianId: number,
    endAt: Date,
    conclusions: string
  ): Observable<WorkOrderEntity> {
    const url = `${this.apiUrl}/${id}/complete`;
    const request: CompleteRequest = {
      technicianId: { value: technicianId },
      endAt: endAt.toISOString(),
      conclusions: conclusions
    };
    
    return this.http.post<WorkOrderResource>(url, request, { headers: this.getHeaders() }).pipe(
      map(resource => WorkOrderAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Maneja los errores de las llamadas HTTP
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en WorkOrderService:', error);
    return throwError(() => new Error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'));
  }
} 