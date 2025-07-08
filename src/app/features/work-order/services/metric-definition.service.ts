import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { MetricDefinitionEntity } from '../models/metric-definition.entity';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';
import { MetricDefinitionAssembler } from './metric-definition.assembler';
import { MetricDefinitionResource } from './metric-definition.resource';

@Injectable({
  providedIn: 'root'
})
export class MetricDefinitionService {
  private apiUrl = environment.serverBaseUrl + '/metric-definitions';

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
   * Obtiene todas las definiciones de métricas
   */
  getAll(): Observable<MetricDefinitionEntity[]> {
    return this.http.get<MetricDefinitionResource[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(resources => MetricDefinitionAssembler.resourcesToEntities(resources)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una definición de métrica por ID
   */
  getById(id: number): Observable<MetricDefinitionEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<MetricDefinitionResource>(url, { headers: this.getHeaders() }).pipe(
      map(resource => MetricDefinitionAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Maneja los errores de las llamadas HTTP
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en MetricDefinitionService:', error);
    return throwError(() => new Error('Ha ocurrido un error al cargar las métricas.'));
  }
} 