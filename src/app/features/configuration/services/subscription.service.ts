import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly baseUrl = `${environment.serverBaseUrl}/subscriptions`;

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
   * Obtiene la suscripción actual del usuario/tenant
   * @returns Observable con la información de la suscripción actual
   */
  getCurrentSubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.baseUrl}/current`, { headers: this.getHeaders() });
  }

  /**
   * Cambia el plan de la suscripción actual
   * @param newPlanId ID del nuevo plan al que se quiere cambiar
   * @returns Observable con la respuesta del cambio de plan
   */
  changePlan(newPlanId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/change-plan`, { newPlanId }, { headers: this.getHeaders() });
  }
}

export interface Subscription {
  id: number;
  tenantId: number;
  planId: number;
  status: SubscriptionStatus;
  subscribedAt: string;
  expiresAt: string | null;
  autoRenew: boolean;
}

export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'CANCELLED';
