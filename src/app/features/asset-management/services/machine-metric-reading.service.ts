import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MachineMetricReadingService {
  private baseUrl = `${environment.serverBaseUrl}/machines`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const userSession = localStorage.getItem('userSession');
    const token = userSession ? JSON.parse(userSession).token : null;

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Registra una nueva lectura para una métrica de una maquinaria concreta
   * @param machineId Id de la maquinaria
   * @param metricId Id de la métrica
   * @param value Valor a registrar
   */
  registerMetricReading(machineId: number, metricId: number, value: number): Observable<any> {
    const headers = this.getHeaders();
    const body = { metricId, value };
    return this.http.post<any>(`${this.baseUrl}/${machineId}/metrics`, body, { headers });
  }
} 