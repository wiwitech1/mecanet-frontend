// src/app/services/maintenance-plan.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {MaintenancePlanData} from '../model/maintenance-plan.entity';
import { MaintenancePlanListResponse } from '../model/maintenance-plan.response';
import { MaintenancePlanAssembler } from '../model/maintenance-plan-assembler';

@Injectable({
  providedIn: 'root',
})
export class MaintenancePlanService {
  private apiUrl = 'http://localhost:3000/maintenance-plan-data';

  constructor(private http: HttpClient) {}

  getAllPlans(): Observable<MaintenancePlanData[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => MaintenancePlanAssembler.fromResourceList(response.data || [])),
      catchError(this.handleError)
    );
  }

  getPlanById(planId: number): Observable<MaintenancePlanData | null> {
    return this.getAllPlans().pipe(
      map(plans => plans.find(p => p.planId === planId) || null),
      catchError(() => of(null))
    );
  }

  createPlan(planData: MaintenancePlanData): Observable<MaintenancePlanData> {
    return this.http.get<MaintenancePlanListResponse>(this.apiUrl).pipe(
      switchMap(currentData => {
        const currentPlans = currentData.data || [];
        const maxPlanId = currentPlans.length
          ? Math.max(...currentPlans.map(p => p.planId))
          : 0;
        const newPlanId = maxPlanId + 1;

        // Obtener max taskId para secuenciar
        let maxTaskId = 0;
        currentPlans.forEach(plan => 
          plan.items?.forEach(item => 
            item.tasks?.forEach(task => {
              if ((task.taskId ?? 0) > maxTaskId) maxTaskId = task.taskId!;
            })
          )
        );

        let taskIdCounter = maxTaskId + 1;

        const newPlan: MaintenancePlanData = {
          ...planData,
          id: undefined,
          planId: newPlanId,
          items: planData.items.map(item => ({
            dayNumber: item.dayNumber,
            itemName: item.itemName,
            tasks: item.tasks.map(task => ({
              ...task,
              taskId: task.taskId ?? taskIdCounter++,
            })),
          })),
        };

        const newPlanResource = MaintenancePlanAssembler.toResource(newPlan);

        const updatedData = {
          ...currentData,
          data: [...currentPlans, newPlanResource],
          info: currentData.info && Array.isArray(currentData.info)
            ? [{ ...currentData.info[0], registers: currentPlans.length + 1 }]
            : currentData.info,
        };

        return this.http.put(this.apiUrl, updatedData).pipe(
          map(() => newPlan),
          catchError(() => of(newPlan))
        );
      }),
      catchError(this.handleError)
    );
  }

  updatePlan(planData: MaintenancePlanData): Observable<MaintenancePlanData> {
    return this.http.get<MaintenancePlanListResponse>(this.apiUrl).pipe(
      switchMap(currentData => {
        const currentPlans = currentData.data || [];
        const index = currentPlans.findIndex(p => p.planId === planData.planId);
        if (index === -1) {
          return throwError(() => new Error('Plan no encontrado'));
        }

        const updatedPlanResource = MaintenancePlanAssembler.toResource(planData);
        currentPlans[index] = updatedPlanResource;

        const updatedData = {
          ...currentData,
          data: currentPlans,
          info: currentData.info && Array.isArray(currentData.info)
            ? [{ ...currentData.info[0], registers: currentPlans.length }]
            : currentData.info,
        };

        return this.http.put(this.apiUrl, updatedData).pipe(
          map(() => planData),
          catchError(() => of(planData))
        );
      }),
      catchError(this.handleError)
    );
  }

  deletePlan(planId: number): Observable<boolean> {
    return this.http.get<MaintenancePlanListResponse>(this.apiUrl).pipe(
      switchMap(currentData => {
        const filteredPlans = currentData.data.filter(p => p.planId !== planId);
        const updatedData = {
          ...currentData,
          data: filteredPlans,
          info: currentData.info && Array.isArray(currentData.info)
            ? [{ ...currentData.info[0], registers: filteredPlans.length }]
            : currentData.info,
        };
        return this.http.put(this.apiUrl, updatedData).pipe(
          map(() => true),
          catchError(() => of(false))
        );
      }),
      catchError(() => of(false))
    );
  }

  private handleError(error: any) {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
