import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { PlantEntity } from '../models/plant.entity';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';
import { NotificationsService } from '../../../shared/components/notifications-container/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private apiUrl = environment.serverBaseUrl + '/plants';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private notificationsService: NotificationsService
  ) {}

  private getHeaders(): HttpHeaders {
    const session = this.userService.getSession();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.token}`
    });
  }

  /**
   * Obtiene todas las plantas
   * @returns Lista de plantas
   */
  getAll(): Observable<PlantEntity[]> {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;

    if (!token) {
      console.error('No hay token disponible');
      this.notificationsService.error('Error', 'No hay token de autorización disponible');
      return throwError(() => new Error('No autorizado'));
    }

    return this.http.get<PlantEntity[]>(
      this.apiUrl,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Obtiene una planta por su ID
   * @param id ID de la planta
   * @returns La planta encontrada
   */
  getById(id: number): Observable<PlantEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<PlantEntity>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Crea una nueva planta
   * @param plant Datos de la planta a crear
   * @returns La planta creada
   */
  create(plant: Partial<PlantEntity>): Observable<PlantEntity> {
    console.log('Datos enviados para crear planta:', plant);
    return this.http.post<PlantEntity>(this.apiUrl, plant, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('Planta creada exitosamente:', response);
        this.notificationsService.success('Éxito', 'Planta creada correctamente');
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al crear la planta:');
        console.error('- Mensaje:', error.message);
        console.error('- Status:', error.status);
        console.error('- Status Text:', error.statusText);
        if (error.error) {
          console.error('- Error del servidor:', error.error);
        }

        let errorMessage = 'Error al crear la planta';
        if (error.status === 400) {
          errorMessage = 'Datos inválidos para crear la planta';
        } else if (error.status === 401) {
          errorMessage = 'No autorizado para crear plantas';
        } else if (error.status === 409) {
          errorMessage = 'Ya existe una planta con estos datos';
        }

        this.notificationsService.error('Error', errorMessage);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza una planta existente
   * @param id ID de la planta a actualizar
   * @param plant Datos a actualizar
   * @returns La planta actualizada
   */
  update(id: number, plant: Partial<PlantEntity>): Observable<PlantEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<PlantEntity>(url, plant, { headers: this.getHeaders() }).pipe(
      map(response => {
        this.notificationsService.success('Éxito', 'Planta actualizada correctamente');
        return response;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Elimina una planta
   * @param id ID de la planta a eliminar
   * @returns Observable vacío
   */
  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        this.notificationsService.success('Éxito', 'Planta eliminada correctamente');
        return response;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Gestiona los errores HTTP
   * @param error Error HTTP
   * @returns Observable con error
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en PlantService:', error);

    let errorMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.';

    if (error.status === 400) {
      errorMessage = 'Datos inválidos';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado';
    } else if (error.status === 404) {
      errorMessage = 'Planta no encontrada';
    } else if (error.status === 409) {
      errorMessage = 'Conflicto con los datos existentes';
    }

    this.notificationsService.error('Error', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
