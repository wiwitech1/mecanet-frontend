import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable, map, throwError, catchError, of, switchMap, tap, combineLatest } from 'rxjs';
import { ApiResponse } from '../model/api-response.model';
import { environment } from '../../../../environments/environment';
import { MaintenanceDynamicPlan, MaintenanceDynamicPlanTask } from '../model/maintenance-dynamic-plan.model';


@Injectable({
  providedIn: 'root'
})
export class MaintenancePlanService {

  private baseUrl = `${environment.serverBaseUrl}/maintenance-plans/dynamic`;
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

  /**
   * Crea un plan dinámico (sin tareas).
   */
  createDynamicPlan(plan: Omit<MaintenanceDynamicPlan, 'id' | 'tasks'>): Observable<MaintenanceDynamicPlan> {
    return this.http.post<MaintenanceDynamicPlan>(this.baseUrl, plan, {
      headers: this.getHeaders()
    });
  }

  /**
   * Añade una tarea al plan dinámico.
   */
  addTaskToPlan(planId: number, task: MaintenanceDynamicPlanTask): Observable<MaintenanceDynamicPlanTask> {
    const url = `${this.baseUrl}/${planId}/tasks`;
    return this.http.post<MaintenanceDynamicPlanTask>(url, task, {
      headers: this.getHeaders()
    });
  }

  /**
   * Crea un plan dinámico junto con todas sus tareas.
   * 1. Crea el plan (sin tareas) → obtenemos el id.
   * 2. Añadimos cada tarea al plan.
   * 3. Devolvemos el plan completo con sus tareas.
   */
  createPlanWithTasks(plan: MaintenanceDynamicPlan): Observable<MaintenanceDynamicPlan> {
    const { tasks, ...planData } = plan;
    return this.createDynamicPlan(planData).pipe(
      switchMap(createdPlan => {
        if (!tasks || tasks.length === 0) {
          return of(createdPlan);
        }
        if (!createdPlan.id) {
          return throwError(() => new Error('El plan creado no tiene ID'));
        }
        const addTasks$ = tasks.map(task => this.addTaskToPlan(createdPlan.id!, task));
        // Ejecutamos en paralelo y devolvemos el plan con las tareas
        return combineLatest(addTasks$).pipe(
          map(createdTasks => ({
            ...createdPlan,
            tasks: createdTasks
          }))
        );
      })
    );
  }

  /**
   * Obtiene todos los planes dinámicos.
   */
  getAllDynamicPlans(): Observable<MaintenanceDynamicPlan[]> {
    return this.http.get<MaintenanceDynamicPlan[]>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }
} 