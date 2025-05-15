import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserEntity } from '../../../core/model/user.model';
import { UserAssembler } from './user.assembler';
import { UserResponse } from './user.response';
import { UserService } from '../../../core/services/user.service';
import { UserSession } from '../../../core/model/session.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://681efc83c1c291fa6635a630.mockapi.io/api/v1'; // URL de la API

  constructor(private http: HttpClient, private userService: UserService) {}

  login(email: string, password: string): Observable<UserEntity> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const userEntity = UserAssembler.fromResponse(user);
          const userSession: UserSession = {
            userId: userEntity.id,
            token: 'fake-jwt-token', // Puedes generar un token real si es necesario
            roles: userEntity.roles,
            name: userEntity.name,
            expiration: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 día
          };
          this.userService.setSession(userSession); // Actualiza el UserService
          this.userService.setUser(userEntity); // Guarda el usuario
          return userEntity;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(error => throwError(() => new Error(error.message)))
    );
  }

  register(user: UserResponse): Observable<UserEntity> {
    const userEntity = UserAssembler.fromResponse(user);
    return this.http.post<UserResponse>(`${this.apiUrl}/users`, userEntity).pipe(
      map(response => {
        const registeredUser = UserAssembler.fromResponse(response);
        const userSession: UserSession = {
          userId: registeredUser.id,
          token: 'fake-jwt-token',
          roles: registeredUser.roles,
          name: registeredUser.name,
          expiration: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 día
        };
        this.userService.setSession(userSession);
        this.userService.setUser(registeredUser);
        return registeredUser;
      }),
      catchError(error => throwError(() => new Error(error.message)))
    );
  }

  logout(): void {
    this.userService.clearSession();
    // Redirigir al login
    window.location.href = '/iniciar-sesion'; // Usando window.location para refrescar la página
  }
}
