import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { PlantEntity } from '../models/plant.entity';
import { PlantAssembler } from './plant.assembler';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';
import { MachineMetricResource } from './machine-metric.resource';
import { PlantResource } from './plant.resource';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private apiUrl = environment.serverBaseUrl + '/plants';

  constructor(
    private http: HttpClient,
    private assembler: PlantAssembler,
    private userService: UserService
  ) {}

  private getHeaders(): HttpHeaders {
    const session = this.userService.getSession();
    return new HttpHeaders({
      Authorization: `Bearer ${session?.token}`
    });
  }

  /**
   * Obtiene todas las plantas
   * @returns Lista de plantas
   */
  getAll(): Observable<PlantEntity[]> {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;
    console.log('🔐 Token cargado desde localStorage:', token);

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No autorizado'));
    }

    return this.http.get<PlantResource[]>(
      `${this.apiUrl}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(resources => resources.map(resource => this.assembler.resourceToEntity(resource))),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una planta por su ID
   * @param id ID de la planta
   * @returns La planta encontrada
   */
  getById(id: number): Observable<PlantEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(resource => this.assembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva planta
   * @param plant Datos de la planta a crear
   * @returns La planta creada
   */
  create(plant: Partial<PlantEntity>): Observable<PlantEntity> {
    const resource = this.assembler.createEntityToResource(plant);
    return this.http.post<any>(this.apiUrl, resource, { headers: this.getHeaders() }).pipe(
      map(newResource => this.assembler.resourceToEntity(newResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una planta existente
   * @param id ID de la planta a actualizar
   * @param plant Datos a actualizar
   * @returns La planta actualizada
   */
  update(id: number, plant: Partial<PlantEntity>): Observable<PlantEntity> {
    const url = `${this.apiUrl}/${id}`;
    const resource = this.assembler.updateEntityToResource(plant);
    return this.http.put<any>(url, resource, { headers: this.getHeaders() }).pipe(
      map(updatedResource => this.assembler.resourceToEntity(updatedResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una planta
   * @param id ID de la planta a eliminar
   * @returns Observable vacío
   */
  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gestiona los errores HTTP
   * @param error Error HTTP
   * @returns Observable con error
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en PlantService:', error);
    return throwError(() => new Error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'));
  }
}
