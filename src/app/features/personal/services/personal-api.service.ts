import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersonalEntity } from '../model/personal.model';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { UserSession } from '../../../core/model/session.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalApiService {
  private baseUrl = `${environment.serverBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const userSessionStr = localStorage.getItem('userSession');
    if (!userSessionStr) {
      throw new Error('No hay sesión de usuario');
    }

    const userSession: UserSession = JSON.parse(userSessionStr);
    if (!userSession.token) {
      throw new Error('No hay token de autenticación');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userSession.token}`
    });
  }

  async getPersonals(): Promise<PersonalEntity[]> {
    return firstValueFrom(
      this.http.get<PersonalEntity[]>(this.baseUrl, { headers: this.getHeaders() })
    );
  }

  async getPersonalById(id: number): Promise<PersonalEntity> {
    return firstValueFrom(
      this.http.get<PersonalEntity>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
    );
  }

  async createPersonal(data: Partial<PersonalEntity>): Promise<PersonalEntity> {
    const payload = {
      username: data.username,
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles || ['ROLE_TECHNICAL']
    };
    console.log('Payload para crear usuario:', payload);
    return firstValueFrom(
      this.http.post<PersonalEntity>(this.baseUrl, payload, { headers: this.getHeaders() })
    );
  }

  async updatePersonal(id: number, data: Partial<PersonalEntity>): Promise<PersonalEntity> {
    const payload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles
    };
    return firstValueFrom(
      this.http.put<PersonalEntity>(`${this.baseUrl}/${id}`, payload, { headers: this.getHeaders() })
    );
  }

  async deletePersonal(id: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
    );
  }
}
