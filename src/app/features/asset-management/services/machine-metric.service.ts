import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { MachineryEntity, MachineryStatus } from '../models/machinery.entity';
import { MachineryAssembler } from './machinery.assembler';
import {
  MachineryResource,
  CreateMachineryResource,
  UpdateMachineryResource
} from './machinery.resource';
import { environment } from '../../../../environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class MachineryService {
  private baseUrl = `${environment.serverBaseUrl}/machines`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las maquinarias del servidor
   */
  getAllMachineries(): Observable<MachineryEntity[]> {
    return this.http.get<MachineryResource[]>(this.baseUrl).pipe(
      map(resources => MachineryAssembler.resourcesToEntities(resources)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una maquinaria por su ID
   */
  getMachineryById(id: number): Observable<MachineryEntity> {
    return this.http.get<MachineryResource>(`${this.baseUrl}/${id}`).pipe(
      map(resource => MachineryAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva maquinaria
   */
  createMachinery(machinery: MachineryEntity): Observable<MachineryEntity> {
    const resource: CreateMachineryResource = MachineryAssembler.entityToCreateResource(machinery);
    return this.http.post<MachineryResource>(this.baseUrl, resource).pipe(
      map(newResource => MachineryAssembler.resourceToEntity(newResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una maquinaria existente
   */
  updateMachinery(machinery: MachineryEntity): Observable<MachineryEntity> {
    const resource: UpdateMachineryResource = MachineryAssembler.entityToUpdateResource(machinery);
    return this.http.patch<MachineryResource>(
      `${this.baseUrl}/${machinery.id}`,
      resource
    ).pipe(
      map(updatedResource => MachineryAssembler.resourceToEntity(updatedResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Cambia el estado de una maquinaria
   */
  changeMachineryStatus(id: number, status: MachineryStatus): Observable<MachineryEntity> {
    return this.http.patch<MachineryResource>(
      `${this.baseUrl}/${id}/status`,
      { status }
    ).pipe(
      map(resource => MachineryAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores genérico
   */
  private handleError(error: any) {
    console.error('Error en MachineryService:', error);
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud.'));
  }
}
