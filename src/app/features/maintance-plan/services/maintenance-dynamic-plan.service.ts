import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { MaintenanceDynamicPlan } from '../model/maintenance-dynamic-plan.model';
import { MaintenanceDynamicPlanAssembler } from '../model/maintenance-dynamic-plan.assembler';
import { MaintenanceDynamicPlanResponse } from './maintenance-dynamic-plan.response';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceDynamicPlanService {
  private apiUrl = 'http://localhost:3000/maintenance-dynamic-plans';

  constructor(private http: HttpClient) {}

  getAllPlans(): Observable<MaintenanceDynamicPlan[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener planes dinámicos', error);
        return of([]);
      }),
      map(response => {
        if (!response) return [];
        return Array.isArray(response) 
          ? response.map(plan => MaintenanceDynamicPlanAssembler.toModel(plan))
          : [];
      })
    );
  }

  getPlanById(planId: number): Observable<MaintenanceDynamicPlan | null> {
    return this.http.get<any>(`${this.apiUrl}/${planId}`).pipe(
      catchError(error => {
        console.error('Error al obtener plan dinámico por ID', error);
        return of(null);
      }),
      map(plan => plan ? MaintenanceDynamicPlanAssembler.toModel(plan) : null)
    );
  }

  createPlan(planData: MaintenanceDynamicPlan): Observable<MaintenanceDynamicPlan | null> {
    return this.getAllPlans().pipe(
      map(plans => {
        // Encontrar el máximo ID actual
        const maxPlanId = plans.length > 0 
          ? Math.max(...plans.map(p => p.dynamicPlanId)) 
          : 0;
        
        // Asignar el siguiente ID al nuevo plan
        const newPlan = { 
          ...planData, 
          dynamicPlanId: maxPlanId + 1
        };
        
        // Asignar IDs a las tareas
        let taskIdCounter = 1;
        newPlan.tasks = newPlan.tasks.map(task => ({
          ...task,
          taskId: taskIdCounter++
        }));
        
        return newPlan;
      }),
      tap(plan => console.log('Plan dinámico preparado para crear:', plan)),
      switchMap(planWithIds => {
        const planForServer = MaintenanceDynamicPlanAssembler.toApiFormat(planWithIds);
        
        // Usar POST para añadir al array
        return this.http.post<any>(this.apiUrl, planForServer).pipe(
          catchError(error => {
            console.error('Error al crear plan dinámico', error);
            return throwError(() => new Error('Error al crear plan dinámico'));
          }),
          map(response => {
            console.log('Plan dinámico creado exitosamente');
            return MaintenanceDynamicPlanAssembler.toModel(response);
          })
        );
      })
    );
  }

  updatePlan(planData: MaintenanceDynamicPlan): Observable<MaintenanceDynamicPlan | null> {
    const planForServer = MaintenanceDynamicPlanAssembler.toApiFormat(planData);
    return this.http.put<any>(`${this.apiUrl}/${planData.id || planData.dynamicPlanId}`, planForServer).pipe(
      catchError(error => {
        console.error('Error al actualizar plan dinámico', error);
        return of(null);
      }),
      map(response => response ? MaintenanceDynamicPlanAssembler.toModel(response) : null)
    );
  }

  deletePlan(planId: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${planId}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error al eliminar plan dinámico', error);
        return of(false);
      })
    );
  }
} 