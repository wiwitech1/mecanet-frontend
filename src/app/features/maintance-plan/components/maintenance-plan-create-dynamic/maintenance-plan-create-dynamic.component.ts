import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MaintenanceDynamicPlanService } from '../../services/maintenance-dynamic-plan.service';
import { MaintenanceDynamicPlan } from '../../model/maintenance-dynamic-plan.model';

@Component({
  selector: 'app-maintenance-plan-create-dynamic',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  template: `
    <div class="main-container">
      <header class="page-header">
        <div class="header-content">
          <button mat-icon-button class="back-button" (click)="navigateBack()" aria-label="Volver">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="page-title">Crear Plan de Mantenimiento Dinámico</h1>
        </div>
      </header>

      <div class="content-wrapper">
        <mat-card class="form-card elevation-z4">
          <mat-card-content>
            <form [formGroup]="dynamicPlanForm" (ngSubmit)="onSubmit()" class="dynamic-plan-form">
              
              <section class="form-section">
                <h2 class="section-title">Información General</h2>
                
                <mat-form-field appearance="outline" class="full-width custom-field">
                  <mat-label>Parámetro*</mat-label>
                  <input matInput formControlName="parameter" required>
                  <mat-error *ngIf="dynamicPlanForm.get('parameter')?.invalid">Este campo es requerido</mat-error>
                </mat-form-field>
                
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width custom-field">
                    <mat-label>Fecha de Inicio*</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="startDate" required>
                    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                    <mat-error *ngIf="dynamicPlanForm.get('startDate')?.invalid">Este campo es requerido</mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="half-width custom-field">
                    <mat-label>Máquinas Asignadas*</mat-label>
                    <mat-select formControlName="machineIds" multiple required>
                      <mat-option *ngFor="let machine of machines" [value]="machine.id">
                        {{ machine.name }}
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="dynamicPlanForm.get('machineIds')?.invalid">Seleccione al menos una máquina</mat-error>
                  </mat-form-field>
                </div>
              </section>
              
              <mat-divider class="section-divider"></mat-divider>
              
              <section class="form-section">
                <div class="section-header">
                  <h2 class="section-title">Tareas</h2>
                  <button type="button" mat-flat-button color="primary" (click)="addTask()" class="action-button">
                    <mat-icon>add</mat-icon> Agregar Tarea
                  </button>
                </div>
                
                <div formArrayName="tasks" class="tasks-container">
                  <div *ngIf="tasksArray.length === 0" class="empty-state">
                    <mat-icon class="empty-icon">assignment</mat-icon>
                    <p>No hay tareas programadas. Haga clic en "Agregar Tarea" para comenzar.</p>
                  </div>
                  
                  <div *ngFor="let task of tasksArray.controls; let i = index" [formGroupName]="i" class="task-card">
                    <div class="task-header">
                      <h3 class="task-title">Tarea {{ i + 1 }}</h3>
                      <button type="button" mat-icon-button color="warn" (click)="removeTask(i)" matTooltip="Eliminar Tarea" class="delete-button">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    
                    <mat-form-field appearance="outline" class="full-width custom-field">
                      <mat-label>Nombre de la Tarea*</mat-label>
                      <input matInput formControlName="taskName" required>
                      <mat-error *ngIf="task.get('taskName')?.invalid">Este campo es requerido</mat-error>
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline" class="full-width custom-field">
                      <mat-label>Descripción</mat-label>
                      <textarea matInput formControlName="taskDescription" rows="2"></textarea>
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline" class="full-width custom-field">
                      <mat-label>Máquinas específicas (opcional)</mat-label>
                      <mat-select formControlName="machineIds" multiple>
                        <mat-option *ngFor="let machine of machines" [value]="machine.id">
                          {{ machine.name }}
                        </mat-option>
                      </mat-select>
                      <mat-hint>Si no selecciona, se usarán las máquinas generales del plan</mat-hint>
                    </mat-form-field>
                  </div>
                </div>
              </section>
              
              <div class="form-actions">
                <button type="button" mat-stroked-button class="cancel-button" (click)="navigateBack()">
                  Cancelar
                </button>
                <button type="submit" mat-flat-button color="primary" class="submit-button" [disabled]="dynamicPlanForm.invalid || isSubmitting">
                  {{ isSubmitting ? 'Guardando...' : 'Guardar Plan Dinámico' }}
                </button>
              </div>
              
              <div *ngIf="submitError" class="error-message">
                <mat-icon>error</mat-icon>
                <span>{{ submitError }}</span>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    /* Variables */
    :host {
      --primary-color: #3f51b5;
      --accent-color: #ff4081;
      --warn-color: #f44336;
      --bg-color: #f5f7fa;
      --card-bg: #ffffff;
      --text-primary: #333333;
      --text-secondary: #666666;
      --border-radius: 8px;
      --spacing-xs: 8px;
      --spacing-sm: 12px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      --transition: all 0.3s ease;
    }

    /* Layout */
    .main-container {
      padding: var(--spacing-lg);
      background-color: var(--bg-color);
      min-height: calc(100vh - 64px);
    }

    .content-wrapper {
      max-width: 1000px;
      margin: 0 auto;
    }

    /* Header Styles */
    .page-header {
      margin-bottom: var(--spacing-xl);
    }

    .header-content {
      display: flex;
      align-items: center;
    }

    .page-title {
      margin: 0;
      margin-left: var(--spacing-md);
      font-size: 24px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .back-button {
      color: var(--primary-color);
    }

    /* Card Styles */
    .form-card {
      background-color: var(--card-bg);
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow);
      margin-bottom: var(--spacing-xl);
    }

    .elevation-z4 {
      box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 
                  0 4px 5px 0 rgba(0,0,0,0.14), 
                  0 1px 10px 0 rgba(0,0,0,0.12);
    }

    /* Section Styles */
    .form-section {
      margin-bottom: var(--spacing-xl);
      padding: var(--spacing-lg) 0;
    }

    .section-title {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: var(--spacing-lg);
      color: var(--primary-color);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .section-divider {
      margin: var(--spacing-lg) 0;
    }

    /* Form Controls */
    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .half-width {
      flex: 1 1 calc(50% - var(--spacing-lg));
      min-width: 250px;
    }

    .custom-field {
      margin-bottom: var(--spacing-md);
    }

    .custom-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      padding: 0 var(--spacing-xs);
    }

    .custom-field ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: rgba(0, 0, 0, 0.02);
    }

    .custom-field ::ng-deep .mat-mdc-form-field-focus-overlay {
      background-color: rgba(63, 81, 181, 0.05);
    }

    /* Tasks Styles */
    .tasks-container {
      margin-top: var(--spacing-lg);
    }

    .task-card {
      background-color: rgba(0, 0, 0, 0.02);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
      border-left: 4px solid var(--primary-color);
      transition: var(--transition);
    }

    .task-card:hover {
      box-shadow: var(--shadow);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .task-title {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
      color: var(--primary-color);
    }

    .delete-button {
      color: var(--warn-color);
    }

    /* Empty State */
    .empty-state {
      background-color: rgba(0, 0, 0, 0.02);
      padding: var(--spacing-xl);
      border-radius: var(--border-radius);
      text-align: center;
      color: var(--text-secondary);
      margin-bottom: var(--spacing-lg);
    }

    .empty-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: var(--spacing-md);
      opacity: 0.5;
    }

    /* Actions */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .action-button, .submit-button {
      text-transform: uppercase;
      font-weight: 500;
      border-radius: var(--border-radius);
    }

    .cancel-button {
      color: var(--text-secondary);
    }

    /* Error Message */
    .error-message {
      margin-top: var(--spacing-lg);
      padding: var(--spacing-md);
      color: var(--warn-color);
      background-color: rgba(244, 67, 54, 0.1);
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    /* Responsive Adjustments */
    @media (max-width: 768px) {
      .main-container {
        padding: var(--spacing-md);
      }

      .form-row {
        flex-direction: column;
      }

      .half-width {
        width: 100%;
      }
    }
  `]
})
export class MaintenancePlanCreateDynamicComponent implements OnInit {
  dynamicPlanForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  
  // Data simulada para seleccionar máquinas
  machines = [
    { id: 101, name: 'Máquina 101' },
    { id: 102, name: 'Máquina 102' },
    { id: 103, name: 'Máquina 103' },
    { id: 201, name: 'Máquina 201' },
    { id: 202, name: 'Máquina 202' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private maintenanceDynamicPlanService: MaintenanceDynamicPlanService
  ) {
    this.dynamicPlanForm = this.createForm();
  }

  ngOnInit(): void {
    // Añadir una primera tarea por defecto
    this.addTask();
  }

  // Método público para navegación
  navigateBack(): void {
    this.router.navigateByUrl('/plan-mantenimiento');
  }

  createForm(): FormGroup {
    return this.fb.group({
      parameter: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      machineIds: [[], Validators.required],
      tasks: this.fb.array([])
    });
  }

  // Getters para acceder a los form arrays
  get tasksArray(): FormArray {
    return this.dynamicPlanForm.get('tasks') as FormArray;
  }

  // Método para agregar una nueva tarea
  addTask(): void {
    this.tasksArray.push(this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: [''],
      machineIds: [[]]
    }));
  }

  // Método para eliminar una tarea
  removeTask(index: number): void {
    this.tasksArray.removeAt(index);
  }

  // Enviar el formulario
  onSubmit(): void {
    if (this.dynamicPlanForm.invalid) {
      this.dynamicPlanForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const formValue = this.dynamicPlanForm.value;
    
    // Crear el objeto del plan
    const dynamicPlan: MaintenanceDynamicPlan = {
      dynamicPlanId: 0, // El servicio asignará un ID
      userCreator: 1, // Usuario simulado
      parameter: formValue.parameter,
      startDate: formValue.startDate,
      machineIds: formValue.machineIds,
      tasks: formValue.tasks.map((task: any) => ({
        taskId: 0, // El servicio asignará IDs
        taskName: task.taskName,
        taskDescription: task.taskDescription || '',
        // Si no hay máquinas específicas para la tarea, usar las del plan
        machineIds: task.machineIds && task.machineIds.length > 0 
          ? task.machineIds 
          : formValue.machineIds
      }))
    };

    this.maintenanceDynamicPlanService.createPlan(dynamicPlan).subscribe({
      next: (createdPlan) => {
        this.isSubmitting = false;
        console.log('Plan dinámico creado:', createdPlan);
        this.router.navigate(['/plan-mantenimiento']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al crear el plan dinámico:', error);
        this.submitError = 'Error al crear el plan. Por favor, inténtelo de nuevo más tarde.';
      }
    });
  }
} 