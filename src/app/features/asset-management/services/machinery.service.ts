import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError, of } from 'rxjs';
import { MachineryEntity, MachineryStatus } from '../models/machinery.entity';
import { MachineryAssembler } from './machinery.assembler';
import { MachineryResource } from './machinery.resource';
import { environment } from '../../../../environments/environment';

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
      status: MachineryStatus.ACTIVE,
      productionLineId: 1,
      lastMaintenanceDate: new Date('2024-03-01'),
      nextMaintenanceDate: new Date('2024-04-01'),
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
    },
    {
      id: 2,
      serialNumber: 'MACH002',
      name: 'Máquina 2',
      manufacturer: 'Fabricante B',
      model: 'Modelo Y',
      type: 'Tipo 2',
      powerConsumption: 1500,
      status: MachineryStatus.MAINTENANCE,
      productionLineId: 1,
      lastMaintenanceDate: new Date('2024-02-15'),
      nextMaintenanceDate: new Date('2024-03-15'),
      measurements: [
        {
          id: 3,
          name: 'Velocidad',
          unit: 'RPM',
          value: 1200,
          lastUpdated: new Date('2024-03-15T10:00:00')
        },
        {
          id: 4,
          name: 'Vibración',
          unit: 'Hz',
          value: 60,
          lastUpdated: new Date('2024-03-15T10:00:00')
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /**
   * Obtiene todas las maquinarias del servidor
   */
  getAllMachineries(): Observable<MachineryEntity[]> {
    return this.http.get<MachineryResource[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(resources => MachineryAssembler.resourcesToEntities(resources)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene todas las maquinarias con sus measurements para las métricas
   */
  getAllMachineriesWithMeasurements(): Observable<MachineryEntity[]> {
    // Retornamos los datos mockeados
    return of(this.mockMachineries);
  }

  /**
   * Obtiene una maquinaria por su ID
   */
  getMachineryById(id: number): Observable<MachineryEntity> {
    return this.http.get<MachineryResource>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(resource => MachineryAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva maquinaria
   */
  createMachinery(machinery: MachineryEntity): Observable<MachineryEntity> {
    const request = {
      serialNumber: machinery.serialNumber,
      name: machinery.name,
      manufacturer: machinery.manufacturer,
      model: machinery.model,
      type: machinery.type,
      powerConsumption: machinery.powerConsumption
    };
    
    return this.http.post<MachineryResource>(this.apiUrl, request, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(newResource => MachineryAssembler.resourceToEntity(newResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una maquinaria existente
   */
  updateMachinery(machinery: MachineryEntity): Observable<MachineryEntity> {
    const request = {
      serialNumber: machinery.serialNumber,
      name: machinery.name,
      manufacturer: machinery.manufacturer,
      model: machinery.model,
      type: machinery.type,
      powerConsumption: machinery.powerConsumption
    };
    
    return this.http.patch<MachineryResource>(`${this.apiUrl}/${machinery.id}`, request, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(updatedResource => MachineryAssembler.resourceToEntity(updatedResource)),
      catchError(this.handleError)
    );
  }

  /**
   * Cambia el estado de una maquinaria (activar/desactivar)
   */
  changeMachineryStatus(id: number, status: MachineryStatus, userUpdaterId: number): Observable<MachineryEntity> {
    return this.http.patch<MachineryResource>(`${this.apiUrl}/${id}`, { status, user_updater: userUpdaterId }, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(resource => MachineryAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza el valor de una medición específica de una maquinaria
   */
  updateMachineryMeasurement(machineryId: number, measurementId: number, newValue: number): Observable<MachineryEntity> {
    // Encontramos la maquinaria y actualizamos el valor de la medición
    const machinery = this.mockMachineries.find(m => m.id === machineryId);
    if (!machinery) {
      return throwError(() => new Error('Maquinaria no encontrada'));
    }

    const measurement = machinery.measurements?.find(m => m.id === measurementId);
    if (!measurement) {
      return throwError(() => new Error('Medición no encontrada'));
    }

    // Actualizamos el valor y la fecha
    measurement.value = newValue;
    measurement.lastUpdated = new Date();

    // Retornamos una copia de la maquinaria actualizada
    return of({...machinery});
  }

  /**
   * Método para manejar errores de las llamadas HTTP
   */
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

}
