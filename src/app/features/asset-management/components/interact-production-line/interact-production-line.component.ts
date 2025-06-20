import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductionLineEntity } from '../../models/production-line.entity';
import { MachineryEntity } from '../../models/machinery.entity';
import { MachineryService } from '../../services/machinery.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interact-production-line',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './interact-production-line.component.html',
  styleUrl: './interact-production-line.component.scss'
})
export class InteractProductionLineComponent implements OnInit {
  @Input() productionLine: ProductionLineEntity | null = null;
  @Input() title: string = 'Nueva Línea de Producción';
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productionLineForm: FormGroup;
  isEditMode = false;
  availableMachineries: MachineryEntity[] = [];
  selectedMachineries: number[] = [];

  constructor(
    private fb: FormBuilder,
    private machineryService: MachineryService
  ) {
    this.productionLineForm = this.fb.group({
      name: ['', Validators.required],
      plant_id: [1, Validators.required], // Valor por defecto
      capacity: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      status: [1] // Por defecto activo
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.productionLine;
    this.loadAvailableMachineries();

    if (this.isEditMode && this.productionLine) {
      // Si estamos en modo edición, rellenamos el formulario
      this.productionLineForm.patchValue({
        name: this.productionLine.name,
        plant_id: this.productionLine.plantId,
        maxUnitsPerHour: this.productionLine.maxUnitsPerHour,
        unit: this.productionLine.unit,
        status: this.productionLine.status
      });

      // Seleccionamos las maquinarias actuales
      this.selectedMachineries = this.productionLine.machineries?.map(m => m.id) || [];
    }
  }

  loadAvailableMachineries() {
    this.machineryService.getAllMachineries().subscribe({
      next: (machineries) => {
        this.availableMachineries = machineries;
      },
      error: (err) => {
        console.error('Error al cargar maquinarias disponibles:', err);
      }
    });
  }

  toggleMachinerySelection(machineryId: number) {
    const index = this.selectedMachineries.indexOf(machineryId);
    if (index > -1) {
      // Si ya está seleccionada, la quitamos
      this.selectedMachineries.splice(index, 1);
    } else {
      // Si no está seleccionada, la añadimos
      this.selectedMachineries.push(machineryId);
    }
  }

  isMachinerySelected(machineryId: number): boolean {
    return this.selectedMachineries.includes(machineryId);
  }

  onSubmit(): void {
    if (this.productionLineForm.valid) {
      // Añadimos las maquinarias seleccionadas al objeto que emitimos
      const formData = {
        ...this.productionLineForm.value,
        machineries: this.selectedMachineries
      };
      this.save.emit(formData);
    } else {
      this.productionLineForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
