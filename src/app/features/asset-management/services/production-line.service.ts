import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ProductionLineEntity, ProductionLineStatus } from '../models/production-line.entity';
import { ProductionLineAssembler } from './production-line.assembler';
import { ProductionLineResource, CreateProductionLineResource, UpdateProductionLineResource } from './production-line.resource';
import { environment } from '../../../../environments/environment';
import { PlantAssembler } from './plant.assembler';
import { UserService } from '../../../core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionLineService {
  private apiUrl = environment.serverBaseUrl + '/production-lines';

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
   * Obtiene todas las líneas de producción del servidor
   */
  getAllProductionLines(plantId: number): Observable<ProductionLineEntity[]> {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No autorizado'));
    }

    return this.http.get<ProductionLineResource[]>(`${environment.serverBaseUrl}/production-lines/plant/${plantId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(resources => ProductionLineAssembler.resourcesToEntities(resources)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una línea de producción por su ID
   */
  getProductionLineById(id: number): Observable<ProductionLineEntity> {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;

    if (!token) {
      return throwError(() => new Error('No autorizado'));
    }

    return this.http.get<ProductionLineResource>(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(resource => ProductionLineAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva línea de producción
   */
  createProductionLine(productionLine: ProductionLineEntity): Observable<ProductionLineEntity> {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No autorizado'));
    }

    const resource = ProductionLineAssembler.entityToCreateResource(productionLine);
    return this.http.post<ProductionLineResource>(this.apiUrl, resource, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(newResource => ProductionLineAssembler.resourceToEntity(newResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una línea de producción existente
   */
  updateProductionLine(productionLine: ProductionLineEntity): Observable<ProductionLineEntity> {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No autorizado'));
    }

    const resource = ProductionLineAssembler.entityToUpdateResource(productionLine);
    return this.http.patch<ProductionLineResource>(
      `${this.apiUrl}/${productionLine.id}`,
      resource,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(updatedResource => ProductionLineAssembler.resourceToEntity(updatedResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Cambia el estado de una línea de producción
   */
  changeProductionLineStatus(id: number, status: string): Observable<ProductionLineEntity> {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;

    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No autorizado'));
    }

    return this.http.patch<ProductionLineResource>(
      `${this.apiUrl}/${id}`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
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

   /**
   * Obtiene las maquinarias asociadas a una línea de producción específica
   * @param productionLineId ID de la línea de producción
   * @returns Observable con array de objetos que contienen id y nombre de las maquinarias
   */
/*
  getProductionLineIdAndName(): Observable<{ id: number; name: string }[]> { return this.getAllProductionLines(0).pipe( map((lines: ProductionLineEntity[]) => lines.map(line => ({ id: line.id, name: line.name })) ), catchError(this.handleError) ); }


  getMachineriesByProductionLine(productionLineId: number): Observable<{ id: number, name: string }[]> {
    return this.getAllProductionLines(0).pipe(
      map((lines) => {
        const selected = lines.find(line => line.id === productionLineId);
        return selected?.machineries?.map(m => ({
          id: m.id,
          name: m.name
        })) || [];
      }),
      catchError(this.handleError)
    );
  }*/

}