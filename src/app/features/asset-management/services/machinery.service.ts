import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { MachineryEntity, MachineryStatus } from '../models/machinery.entity';
import { MachineryAssembler } from './machinery.assembler';
import { MachineryResource, CreateMachineryResource, UpdateMachineryResource } from './machinery.resource';

@Injectable({
  providedIn: 'root'
})
export class MachineryService {
  private apiUrl = 'http://localhost:3000/machineries';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las maquinarias del servidor
   */
  getAllMachineries(): Observable<MachineryEntity[]> {
    return this.http.get<MachineryResource[]>(this.apiUrl).pipe(
      map(resources => MachineryAssembler.resourcesToEntities(resources)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una maquinaria por su ID
   */
  getMachineryById(id: number): Observable<MachineryEntity> {
    return this.http.get<MachineryResource>(`${this.apiUrl}/${id}`).pipe(
      map(resource => MachineryAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva maquinaria
   */
  createMachinery(machinery: MachineryEntity): Observable<MachineryEntity> {
    const resource = MachineryAssembler.entityToCreateResource(machinery);
    return this.http.post<MachineryResource>(this.apiUrl, resource).pipe(
      map(newResource => MachineryAssembler.resourceToEntity(newResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una maquinaria existente
   */
  updateMachinery(machinery: MachineryEntity): Observable<MachineryEntity> {
    const resource = MachineryAssembler.entityToUpdateResource(machinery);
    return this.http.patch<MachineryResource>(
      `${this.apiUrl}/${machinery.id}`,
      resource
    ).pipe(
      map(updatedResource => MachineryAssembler.resourceToEntity(updatedResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Cambia el estado de una maquinaria (activar/desactivar)
   */
  changeMachineryStatus(id: number, status: MachineryStatus, userUpdaterId: number): Observable<MachineryEntity> {
    return this.http.patch<MachineryResource>(
      `${this.apiUrl}/${id}`,
      { status, user_updater: userUpdaterId }
    ).pipe(
      map(resource => MachineryAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Método para manejar errores de las llamadas HTTP
   */
  private handleError(error: any) {
    console.error('Error en MachineryService:', error);
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud. Por favor intente nuevamente.'));
  }

}
