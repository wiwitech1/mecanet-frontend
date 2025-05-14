import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ProductionLineEntity, ProductionLineStatus } from '../models/production-line.entity';
import { ProductionLineAssembler } from './production-line.assembler';
import { ProductionLineResource, CreateProductionLineResource, UpdateProductionLineResource } from './production-line.resource';

@Injectable({
  providedIn: 'root'
})
export class ProductionLineService {
  private apiUrl = 'http://localhost:3000/production_lines';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las líneas de producción del servidor
   */
  getAllProductionLines(): Observable<ProductionLineEntity[]> {
    return this.http.get<ProductionLineResource[]>(this.apiUrl).pipe(
      map(resources => ProductionLineAssembler.resourcesToEntities(resources)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una línea de producción por su ID
   */
  getProductionLineById(id: number): Observable<ProductionLineEntity> {
    return this.http.get<ProductionLineResource>(`${this.apiUrl}/${id}`).pipe(
      map(resource => ProductionLineAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva línea de producción
   */
  createProductionLine(productionLine: ProductionLineEntity): Observable<ProductionLineEntity> {
    const resource = ProductionLineAssembler.entityToCreateResource(productionLine);
    return this.http.post<ProductionLineResource>(this.apiUrl, resource).pipe(
      map(newResource => ProductionLineAssembler.resourceToEntity(newResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una línea de producción existente
   */
  updateProductionLine(productionLine: ProductionLineEntity): Observable<ProductionLineEntity> {
    const resource = ProductionLineAssembler.entityToUpdateResource(productionLine);
    return this.http.patch<ProductionLineResource>(
      `${this.apiUrl}/${productionLine.id}`, 
      resource
    ).pipe(
      map(updatedResource => ProductionLineAssembler.resourceToEntity(updatedResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Cambia el estado de una línea de producción (activar/desactivar)
   */
  changeProductionLineStatus(id: number, status: ProductionLineStatus): Observable<ProductionLineEntity> {
    return this.http.patch<ProductionLineResource>(
      `${this.apiUrl}/${id}`, 
      { status }
    ).pipe(
      map(resource => ProductionLineAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Método para manejar errores de las llamadas HTTP
   */
  private handleError(error: any) {
    console.error('Error en ProductionLineService:', error);
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud. Por favor intente nuevamente.'));
  }
}