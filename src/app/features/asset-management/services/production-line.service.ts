import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ProductionLineEntity } from '../models/production-line.entity';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionLineService {
  private apiUrl = environment.serverBaseUrl + '/production-lines';

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
   * Obtiene todas las líneas de producción de una planta
   * @param plantId ID de la planta
   * @returns Observable con la lista de líneas de producción
   */
  getAllProductionLines(plantId: number): Observable<ProductionLineEntity[]> {
    const url = `${this.apiUrl}/plant/${plantId}`;
    return this.http.get<ProductionLineEntity[]>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene una línea de producción por su ID
   * @param id ID de la línea de producción
   * @returns Observable con la línea de producción
   */
  getProductionLineById(id: number): Observable<ProductionLineEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ProductionLineEntity>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crea una nueva línea de producción
   * @param productionLine Datos de la línea de producción a crear
   * @returns Observable con la línea de producción creada
   */
  createProductionLine(productionLine: Partial<ProductionLineEntity>): Observable<ProductionLineEntity> {
    console.log('productionLine', productionLine);
    return this.http.post<ProductionLineEntity>(this.apiUrl, productionLine, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza una línea de producción existente
   * @param id ID de la línea de producción
   * @param productionLine Datos a actualizar
   * @returns Observable con la línea de producción actualizada
   */
  updateProductionLine(id: number, productionLine: Partial<ProductionLineEntity>): Observable<ProductionLineEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<ProductionLineEntity>(url, productionLine, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cambia el estado de una línea de producción
   * @param id ID de la línea de producción
   * @param status Nuevo estado
   * @returns Observable con la línea de producción actualizada
   */
  changeProductionLineStatus(id: number, status: string): Observable<ProductionLineEntity> {
    const url = `${this.apiUrl}/${id}/status`;
    return this.http.patch<ProductionLineEntity>(url, { status }, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Maneja los errores de las llamadas HTTP
   * @param error Error HTTP
   * @returns Observable con error
   */
  private handleError(error: any) {
    console.error('Error en ProductionLineService:', error);
    return throwError(() => new Error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'));
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
