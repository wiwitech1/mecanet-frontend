import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersonalEntity } from '../model/personal.model';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { UserSession } from '../../../core/model/session.model';

interface EmailRequest {
  to: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalApiService {
  private baseUrl = `${environment.serverBaseUrl}/users`;
  private emailUrl = `${environment.serverBaseUrl}/email/send`;

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

  private async sendWelcomeEmail(email: string, username: string, password: string): Promise<void> {
    const emailData: EmailRequest = {
      to: email,
      title: "Bienvenido a Mecanet",
      description: `Tu cuenta ha sido creada exitosamente. Accede al sistema para comenzar a gestionar tus activos industriales.\n\nTus credenciales de acceso son:\nUsuario: ${username}\nContraseña: ${password}`,
      buttonText: "Acceder al sistema",
      buttonUrl: "https://agreeable-moss-0b81a851e.6.azurestaticapps.net/iniciar-sesion"
    };

    try {
      await firstValueFrom(
        this.http.post(this.emailUrl, emailData, { headers: this.getHeaders() })
      );
      console.log('Correo de bienvenida enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo de bienvenida:', error);
      throw new Error('No se pudo enviar el correo de bienvenida');
    }
  }

  async createPersonal(data: Partial<PersonalEntity>): Promise<PersonalEntity> {
    if (!data.username || !data.password || !data.email) {
      const error = 'Se requieren username, password y email para crear un usuario';
      console.error('Error de validación:', error);
      throw new Error(error);
    }

    const payload = {
      username: data.username,
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles || ['ROLE_TECHNICAL']
    };
    console.log('Payload para crear usuario:', payload);

    try {
      // Primero creamos el usuario
      const createdUser = await firstValueFrom(
        this.http.post<PersonalEntity>(this.baseUrl, payload, { headers: this.getHeaders() })
      );
      console.log('Usuario creado exitosamente:', createdUser);

      // Si se creó exitosamente, enviamos el correo de bienvenida
      await this.sendWelcomeEmail(data.email, data.username, data.password);

      return createdUser;
    } catch (error: any) {
      console.error('Error detallado en la creación de usuario:');
      console.error('- Mensaje:', error.message);
      console.error('- Status:', error.status);
      console.error('- Status Text:', error.statusText);
      if (error.error) {
        console.error('- Error del servidor:', error.error);
      }
      if (error.stack) {
        console.error('- Stack trace:', error.stack);
      }
      throw error;
    }
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
