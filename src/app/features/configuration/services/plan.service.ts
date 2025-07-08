import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private readonly baseUrl = `${environment.serverBaseUrl}/plans`;

  constructor(private http: HttpClient) {}

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

  /**
   * Obtiene todos los planes disponibles
   * @returns Observable con el listado de planes
   */
  getAllPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  /**
   * Obtiene los atributos/beneficios de un plan específico
   * @param planId ID del plan
   * @returns Observable con el listado de atributos del plan
   */
  getPlanAttributes(planId: number): Observable<PlanAttribute[]> {
    return this.http.get<PlanAttribute[]>(`${this.baseUrl}/${planId}/attributes`, { headers: this.getHeaders() });
  }
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  cost: number;
  isActive: boolean;
}

export interface PlanAttribute {
  id: number;
  attributeName: string;
  attributeValue: number;
  isUnlimited: boolean;
}
