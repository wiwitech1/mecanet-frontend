import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Metric } from '../models/metric.entity';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetricService {
  private apiUrl = `${environment.serverBaseUrl}/metric-definitions`;
  constructor(private http: HttpClient) {}

  // Función para obtener los encabezados con el token de autorización
  private getHeaders(): HttpHeaders {
    const userSession = localStorage.getItem('userSession');
    const token = userSession ? JSON.parse(userSession).token : null;

    if (!token) {
      throw new Error('No hay token disponible');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Método para obtener todas las métricas
  getAllMetrics(): Observable<Metric[]> {
    const headers = this.getHeaders(); // Obtener los encabezados con el token
    return this.http.get<Metric[]>(this.apiUrl, { headers });
  }
}
