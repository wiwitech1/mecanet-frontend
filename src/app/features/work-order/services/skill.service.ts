import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { SkillEntity } from '../models/skill.entity';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';
import { SkillAssembler } from './skill.assembler';
import { SkillResource } from './skill.resource';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = environment.serverBaseUrl + '/skills';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  private getHeaders(): HttpHeaders {
    const session = this.userService.getSession();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.token}`
    });
  }

  /**
   * Obtiene todas las habilidades
   */
  getAll(): Observable<SkillEntity[]> {
    return this.http.get<SkillResource[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(resources => SkillAssembler.resourcesToEntities(resources)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una habilidad por ID
   */
  getById(id: number): Observable<SkillEntity> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SkillResource>(url, { headers: this.getHeaders() }).pipe(
      map(resource => SkillAssembler.resourceToEntity(resource)),
      catchError(this.handleError)
    );
  }

  /**
   * Maneja los errores de las llamadas HTTP
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en SkillService:', error);
    return throwError(() => new Error('Ha ocurrido un error al cargar las habilidades.'));
  }
} 