import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError,switchMap  } from 'rxjs/operators';
import { UserEntity } from '../../../core/model/user.model';
import { UserAssembler } from './user.assembler';
import { UserResponse } from './user.response';
import { UserService } from '../../../core/services/user.service';
import { UserSession } from '../../../core/model/session.model';
import { environment } from '../../../../environments/environment';
import { SignUpResponse , SignUpRequest} from './sign-up.response';
import { SignUpAssembler } from './sign-up.assembler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://681efc83c1c291fa6635a630.mockapi.io/api/v1'; // URL de la API
  private baseUrl = environment.serverBaseUrl; // Usar la URL del environment correcto

  constructor(private http: HttpClient, private userService: UserService) {
    console.log('AuthService inicializado con baseUrl:', this.baseUrl);
  }

    login(username: string, password: string): Observable<UserEntity> {
      return this.http.post<{ id: number; username: string; token: string }>(
        `${this.baseUrl}/authentication/sign-in`,
        { username, password }
      ).pipe(
        switchMap(authResponse => {
          const token = authResponse.token;
          const userId = authResponse.id;
          const username = authResponse.username; // Obtener username de la primera respuesta

          console.log('Respuesta de autenticación:', authResponse);

          return this.http.get<UserResponse>(`${this.baseUrl}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).pipe(
            map(userDetails => {
              console.log('Detalles del usuario:', userDetails);

              const userEntity: UserEntity = {
                id: userDetails.id.toString(),
                name: userDetails.name,
                email: userDetails.email ?? '', // por si no viene
                username: username, // Usar el username de la primera respuesta
                password: '', // ⚠️ No deberías almacenar la contraseña, así que lo dejamos vacío
                roles: userDetails.roles ?? [],
                createdAt: new Date(userDetails.created_at ?? Date.now()),
                updatedAt: new Date(userDetails.updated_at ?? Date.now()),
                route: '/perfil' // Ruta del perfil del usuario
              };

              const userSession: UserSession = {
                userId: userEntity.id,
                token,
                name: userEntity.name,
                username: userEntity.username, // Username del usuario
                roles: userEntity.roles,
                expiration: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 día
              };

              this.userService.setSession(userSession);
              this.userService.setUser(userEntity);

              // Verificar que los datos se guardaron correctamente
              console.log('Datos guardados en sesión:', {
                username: userSession.username,
                name: userSession.name,
                roles: userSession.roles,
                userId: userSession.userId,
                token: userSession.token ? 'Token presente' : 'Sin token'
              });

              return userEntity;
            })
          );
        }),
        catchError(error => throwError(() => new Error(error.message)))
      );
    }

  // Función para registro usando el endpoint correcto
  register(signUpData: SignUpRequest): Observable<SignUpResponse> {
    console.log('Enviando datos de registro:', signUpData);
    console.log('URL del endpoint:', `${this.baseUrl}/authentication/sign-up`);

    // Temporalmente usar MockAPI para probar
    const testUrl = 'https://681efc83c1c291fa6635a630.mockapi.io/api/v1/users';
    console.log('Usando URL de prueba:', testUrl);

    // Enviar datos directamente sin assembler para debuggear
    return this.http.post<SignUpResponse>(`${this.baseUrl}/authentication/sign-up`, signUpData).pipe(
      map(response => {
        console.log('Respuesta del registro:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error detallado en el registro:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: error.url
        });
        return throwError(() => new Error(error.message || 'Error al registrar usuario'));
      })
    );
  }

  // Función legacy para mantener compatibilidad (opcional)
  registerLegacy(user: UserResponse): Observable<UserEntity> {
    const userEntity = UserAssembler.fromResponse(user);
    return this.http.post<UserResponse>(`${this.apiUrl}/users`, userEntity).pipe(
      map(response => {
        const registeredUser = UserAssembler.fromResponse(response);
        const userSession: UserSession = {
          userId: registeredUser.id,
          token: 'fake-jwt-token',
          roles: registeredUser.roles,
          name: registeredUser.name,
          username: registeredUser.username, // Username del usuario
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
