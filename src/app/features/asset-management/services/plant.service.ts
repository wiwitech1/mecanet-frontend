import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { PlantEntity } from '../models/plant.entity';
import { PlantAssembler } from './plant.assembler';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private apiUrl = 'http://localhost:3000/plants';

  constructor(
    private http: HttpClient,
    private assembler: PlantAssembler
  ) {}

  /**
   * Obtiene todas las plantas
   * @returns Lista de plantas
   */
  getAll(): Observable<PlantEntity[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
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
    return this.http.get<any>(url).pipe(
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
    return this.http.post<any>(this.apiUrl, resource).pipe(
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
    return this.http.put<any>(url, resource).pipe(
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
    return this.http.delete<void>(url).pipe(
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