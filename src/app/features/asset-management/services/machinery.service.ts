import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { MachineryEntity } from '../models/machinery.entity';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class MachineryService {
  private apiUrl = `${environment.serverBaseUrl}/machines`;

  // Datos mockeados para las métricas
  private mockMachineries: MachineryEntity[] = [
    {
      id: 1,
      serialNumber: 'MACH001',
      name: 'Máquina 1',
      manufacturer: 'Fabricante A',
      model: 'Modelo X',
      type: 'Tipo 1',
      powerConsumption: 1000,
      status: 'OPERATIONAL',
      productionLineId: 1,
      lastMaintenanceDate: '2024-03-01',
      nextMaintenanceDate: '2024-04-01',
      measurements: [
        {
          id: 1,
          name: 'Temperatura',
          unit: '°C',
          value: 25.5,
          lastUpdated: new Date('2024-03-15T10:00:00')
        },
        {
          id: 2,
          name: 'Presión',
          unit: 'bar',
          value: 2.3,
          lastUpdated: new Date('2024-03-15T10:00:00')
        }
      ]
    }
  ];

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
   * Obtiene todas las maquinarias de una línea de producción
   * @param productionLineId ID de la línea de producción
   * @returns Observable con la lista de maquinarias
   */
  getAllMachineries(productionLineId: number): Observable<MachineryEntity[]> {
    return this.http.get<MachineryEntity[]>(
      `${this.apiUrl}/production-line/${productionLineId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una maquinaria por su ID
   * @param id ID de la maquinaria
   * @returns Observable con la maquinaria
   */
  getMachineryById(id: number): Observable<MachineryEntity> {
    return this.http.get<MachineryEntity>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva maquinaria
   * @param machinery Datos de la maquinaria a crear
   * @returns Observable con la maquinaria creada
   */
  createMachinery(machinery: Partial<MachineryEntity>): Observable<MachineryEntity> {
    console.log('machinery', machinery);
    return this.http.post<MachineryEntity>(
      this.apiUrl,
      machinery,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Asigna una maquinaria a una línea de producción
   * @param machineryId ID de la maquinaria
   * @param productionLineId ID de la línea de producción
   * @returns Observable con la maquinaria actualizada
   */
  assignToProductionLine(machineryId: number, productionLineId: number): Observable<MachineryEntity> {
    return this.http.put<MachineryEntity>(
      `${this.apiUrl}/${machineryId}/assign`,
      { productionLineId },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene todas las maquinarias con sus measurements para las métricas
   */
  getAllMachineriesWithMeasurements(): Observable<MachineryEntity[]> {
    return of(this.mockMachineries);
  }

  /**
   * Actualiza el valor de una medición específica de una maquinaria
   */
  updateMachineryMeasurement(machineryId: number, measurementId: number, newValue: number): Observable<MachineryEntity> {
    const machinery = this.mockMachineries.find(m => m.id === machineryId);
    if (!machinery) {
      return throwError(() => new Error('Maquinaria no encontrada'));
    }

    const measurement = machinery.measurements?.find(m => m.id === measurementId);
    if (!measurement) {
      return throwError(() => new Error('Medición no encontrada'));
    }

    measurement.value = newValue;
    measurement.lastUpdated = new Date();

    return of({...machinery});
  }

  /**
   * Maneja los errores de las llamadas HTTP
   * @param error Error HTTP
   * @returns Observable con error
   */
  private handleError(error: any) {
    console.error('Error en MachineryService:', error);
    return throwError(() => new Error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'));
  }
}
