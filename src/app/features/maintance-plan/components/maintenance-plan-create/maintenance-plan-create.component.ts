import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MaintenancePlanService } from '../../services/maintenance-plan.service';
import { MaintenancePlanData, MaintenancePlanItem, MaintenanceTask } from '../../model/maintenance-plan.model';

@Component({
  selector: 'app-maintenance-plan-create',
  templateUrl: './maintenance-plan-create.component.html',
  styleUrls: ['./maintenance-plan-create.component.scss'],
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
    MatStepperModule,
    MatTooltipModule
  ]
})
export class MaintenancePlanCreateComponent implements OnInit {
  mainForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  isEditMode = false;
  planId: number | null = null;
  
  // Data simulada para seleccionar líneas de producción
  productionLines = [
    { id: 1, name: 'Línea de Producción A' },
    { id: 2, name: 'Línea de Producción B' },
    { id: 3, name: 'Línea de Producción C' }
  ];
  
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
    private route: ActivatedRoute,
    private maintenancePlanService: MaintenancePlanService
  ) {
    this.mainForm = this.createForm();
  }

  ngOnInit(): void {
    // Comprobar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.planId = Number(id);
      this.loadPlanData(this.planId);
    } else {
      // Iniciar con un día por defecto en modo creación
      this.addItem();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      productionLineId: [null, Validators.required],
      startDate: [new Date(), Validators.required],
      durationDays: [1, [Validators.required, Validators.min(1), Validators.max(30)]],
      items: this.fb.array([])
    });
  }

  loadPlanData(planId: number): void {
    this.maintenancePlanService.getPlanById(planId).subscribe({
      next: (plan) => {
        if (plan) {
          // Reset form y llenar con datos existentes
          this.mainForm.patchValue({
            productionLineId: plan.productionLineId,
            startDate: new Date(plan.startDate),
            durationDays: plan.durationDays
          });

          // Limpiar los items existentes
          while (this.itemsArray.length) {
            this.itemsArray.removeAt(0);
          }

          // Añadir los items existentes
          plan.items.forEach(item => {
            const itemGroup = this.fb.group({
              dayNumber: [item.dayNumber, Validators.required],
              tasks: this.fb.array([])
            });

            const tasksArray = itemGroup.get('tasks') as FormArray;
            
            item.tasks.forEach(task => {
              tasksArray.push(this.fb.group({
                taskId: [task.taskId],
                taskName: [task.taskName, Validators.required],
                taskDescription: [task.taskDescription],
                machineIds: [task.machineIds, Validators.required]
              }));
            });

            this.itemsArray.push(itemGroup);
          });
        } else {
          this.router.navigate(['/plan-mantenimiento']);
        }
      },
      error: (error) => {
        console.error('Error al cargar el plan para editar', error);
        this.submitError = 'Error al cargar el plan. Por favor, inténtelo de nuevo más tarde.';
        this.router.navigate(['/plan-mantenimiento']);
      }
    });
  }

  // Getters para acceder a los arrays de formularios
  get itemsArray(): FormArray {
    return this.mainForm.get('items') as FormArray;
  }

  getTasksArray(itemIndex: number): FormArray {
    return this.itemsArray.at(itemIndex).get('tasks') as FormArray;
  }

  // Métodos para agregar elementos dinámicos al formulario
  addItem(): void {
    // Agregamos un nuevo día
    const newDayNumber = this.itemsArray.length + 1;
    this.itemsArray.push(this.fb.group({
      dayNumber: [newDayNumber, Validators.required],
      tasks: this.fb.array([])
    }));
    
    // Actualizamos la duración en días según la cantidad de ítems
    this.mainForm.patchValue({
      durationDays: newDayNumber
    });
  }

  addTask(itemIndex: number): void {
    const tasksArray = this.getTasksArray(itemIndex);
    tasksArray.push(this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: [''],
      machineIds: [[], Validators.required]
    }));
  }

  // Métodos para remover elementos
  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
    
    // Reordenar los números de día
    this.itemsArray.controls.forEach((item, idx) => {
      item.get('dayNumber')?.setValue(idx + 1);
    });
    
    // Actualizamos la duración en días según la cantidad de ítems
    this.mainForm.patchValue({
      durationDays: this.itemsArray.length || 1
    });
  }

  removeTask(itemIndex: number, taskIndex: number): void {
    this.getTasksArray(itemIndex).removeAt(taskIndex);
  }

  // Enviar el formulario
  onSubmit(): void {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    // Crear el objeto del plan de mantenimiento
    const formData = this.mainForm.value;
    
    // Calcular la duración en días basado en la cantidad de días agregados
    const calculatedDurationDays = Math.max(this.itemsArray.length, 1);
    
    const planData: MaintenancePlanData = {
      planId: this.isEditMode ? this.planId! : 0, // Se asignará en el servicio si es nueva creación
      productionLineId: formData.productionLineId,
      startDate: formData.startDate,
      durationDays: calculatedDurationDays, // Usar la cantidad de días agregados
      userCreator: 1, // ID del usuario actual (simulado)
      items: formData.items
    };

    if (this.isEditMode) {
      this.updatePlan(planData);
    } else {
      this.createNewPlan(planData);
    }
  }

  createNewPlan(planData: MaintenancePlanData): void {
    this.maintenancePlanService.createPlan(planData).subscribe({
      next: (createdPlan) => {
        this.isSubmitting = false;
        this.router.navigate(['/plan-mantenimiento']);
      },
      error: (error) => {
        console.error('Error al crear el plan de mantenimiento', error);
        this.submitError = 'Error al crear el plan. Por favor, inténtelo de nuevo más tarde.';
        this.isSubmitting = false;
      }
    });
  }

  updatePlan(planData: MaintenancePlanData): void {
    this.maintenancePlanService.updatePlan(planData).subscribe({
      next: (updatedPlan) => {
        this.isSubmitting = false;
        this.router.navigate(['/plan-mantenimiento']);
      },
      error: (error) => {
        console.error('Error al actualizar el plan de mantenimiento', error);
        this.submitError = 'Error al actualizar el plan. Por favor, inténtelo de nuevo más tarde.';
        this.isSubmitting = false;
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/plan-mantenimiento']);
  }
} 