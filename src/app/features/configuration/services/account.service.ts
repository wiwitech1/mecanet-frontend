import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: string[];
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.serverBaseUrl}/users`;

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

  getUserInfo(userId: number): Observable<User> {
    console.log('Obteniendo información del usuario:', userId);
    console.log('URL:', `${this.apiUrl}/${userId}`);

    return this.http.get<User>(`${this.apiUrl}/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => {
        console.log('Respuesta del servidor (getUserInfo):', response);
      }),
      catchError(error => {
        console.error('Error del servidor (getUserInfo):', error);
        console.log('Error response:', error.error);
        console.log('Status:', error.status);
        console.log('Status Text:', error.statusText);
        throw error;
      })
    );
  }

  updateUserInfo(userId: number, updateData: UpdateUserRequest): Observable<User> {
    console.log('Actualizando usuario:', userId);
    console.log('Datos a enviar:', updateData);

    return this.http.put<User>(`${this.apiUrl}/${userId}`, updateData, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => {
        console.log('Respuesta del servidor (updateUserInfo):', response);
      }),
      catchError(error => {
        console.error('Error del servidor (updateUserInfo):', error);
        console.log('Error response:', error.error);
        console.log('Status:', error.status);
        console.log('Status Text:', error.statusText);
        throw error;
      })
    );
  }
}
