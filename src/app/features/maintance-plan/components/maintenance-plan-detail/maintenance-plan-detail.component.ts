import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaintenanceDynamicPlan, MaintenanceDynamicPlanTask } from '../../model/maintenance-dynamic-plan.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MetricService } from '../../../metrics/services/metric.service';
import { Metric } from '../../../metrics/models/metric.entity';
import { MachineryService } from '../../../asset-management/services/machinery.service';
import { MachineryEntity } from '../../../asset-management/models/machinery.entity';
import { MaintenancePlanService } from '../../services/maintenance-plan.service';

@Component({
  selector: 'app-maintenance-plan-detail',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TranslateModule,
    ButtonComponent
  ],
  templateUrl: './maintenance-plan-detail.component.html',
  styleUrl: './maintenance-plan-detail.component.scss'
})
export class MaintenancePlanDetailComponent implements OnInit {
  @Input() showModal = false;
  @Input() planToEdit: MaintenanceDynamicPlan | null = null;
  @Output() save = new EventEmitter<MaintenanceDynamicPlan>();
  @Output() cancel = new EventEmitter<void>();

  planForm: FormGroup;
  metrics: Metric[] = [];
  machineries: MachineryEntity[] = [];


  constructor(
    private fb: FormBuilder,
    private metricService: MetricService,
    private maintenancePlanService: MaintenancePlanService,
    private machineryService: MachineryService
  ) {
    this.planForm = this.fb.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      metricDefinitionId: [null, [Validators.required]],
      threshold: [null, [Validators.required, Validators.min(0)]],
      tasks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadMetrics();
    this.loadMachineries();

    if (this.planToEdit) {
      this.planForm.patchValue({
        name: this.planToEdit.name,
        startDate: this.formatDateForInput(this.planToEdit.startDate),
        endDate: this.formatDateForInput(this.planToEdit.endDate),
        metricDefinitionId: this.planToEdit.metricDefinitionId,
        threshold: this.planToEdit.threshold
      });

      this.planToEdit.tasks.forEach(task => {
        this.addTask(task);
      });
    }
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadMetrics(): void {
    this.metricService.getAllMetrics().subscribe(
      (data) => {
        this.metrics = data;
        console.log('Métricas cargadas:', this.metrics);  // Muestra las métricas en la consola
      },
      (error) => {
        console.error('Error al cargar las métricas', error);
      }
    );
  }

  loadMachineries(): void {
    // TODO: permitir seleccionar línea de producción, por ahora usamos ID 1
    this.machineryService.getAlllMachineries().subscribe({
      next: (data) => {
        this.machineries = data;
      },
      error: (err) => {
        console.error('Error al cargar las maquinarias', err);
      }
    });
  }

  get tasks() {
    return this.planForm.get('tasks') as FormArray;
  }

  createTaskForm(task?: MaintenanceDynamicPlanTask): FormGroup {
    return this.fb.group({
      machineId: [task?.machineId || null, [Validators.required]],
      taskName: [task?.taskName || '', [Validators.required]],
      description: [task?.description || '', [Validators.required]],
      skillIds: [task?.skillIds || [1], [Validators.required]] // Valor por defecto para skillIds
    });
  }

  addTask(task?: MaintenanceDynamicPlanTask): void {
    this.tasks.push(this.createTaskForm(task));
  }

  removeTask(index: number): void {
    this.tasks.removeAt(index);
  }

  onSubmit(): void {
    if (this.planForm.valid) {
      const formValue = this.planForm.value;
      const plan: MaintenanceDynamicPlan = {
        ...formValue,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        id: this.planToEdit?.id
      };
      this.maintenancePlanService.createPlanWithTasks(plan).subscribe({
        next: (createdPlan) => {
          this.save.emit(createdPlan);
        },
        error: (err) => {
          console.error('Error al crear el plan dinámico', err);
        }
      });
    } else {
      this.planForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.planForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isTaskFieldInvalid(taskIndex: number, field: string): boolean {
    const taskForm = this.tasks.at(taskIndex) as FormGroup;
    const control = taskForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
} 