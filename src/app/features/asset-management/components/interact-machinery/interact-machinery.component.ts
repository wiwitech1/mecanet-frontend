import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MachineryEntity } from '../../models/machinery.entity';
import { MachineryMeasurementEntity } from '../../models/measurement.entity';

@Component({
  selector: 'app-interact-machinery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './interact-machinery.component.html',
  styleUrl: './interact-machinery.component.scss'
})
export class InteractMachineryComponent implements OnInit {
  @Input() machinery: MachineryEntity | null = null;
  @Input() title: string = 'Nueva Maquinaria';
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  machineryForm: FormGroup;
  isEditMode = false;
  
  constructor(private fb: FormBuilder) {
    // Validador personalizado
    function atLeastOneValidMeasurement(): ValidatorFn {
      return (formArray: AbstractControl): ValidationErrors | null => {
        const arr = formArray as FormArray;
        // Al menos una medida con nombre y unidad válidos
        const hasValid = arr.controls.some(ctrl =>
          ctrl.get('name')?.valid && ctrl.get('unit')?.valid
        );
        return hasValid ? null : { atLeastOne: true };
      };
    }

    this.machineryForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      brand: ['', Validators.required],
      serial_number: ['', Validators.required],
      production_capacity: [''],
      recommendations: [''],
      measurements: this.fb.array([], atLeastOneValidMeasurement())
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.machinery;
    
    if (this.isEditMode && this.machinery) {
      // Si estamos en modo edición, rellenamos el formulario
      this.machineryForm.patchValue({
        name: this.machinery.name,
        model: this.machinery.model,
        brand: this.machinery.brand,
        serial_number: this.machinery.serialNumber,
        production_capacity: this.machinery.productionCapacity,
        recommendations: this.machinery.recommendations,
      });
      
      // Limpiar el array de medidas existente
      this.measurementsArray.clear();
      
      // Agregar las medidas del objeto machinery
      if (this.machinery.measurements && this.machinery.measurements.length > 0) {
        this.machinery.measurements.forEach(measurement => {
          this.measurementsArray.push(this.createMeasurementGroup(measurement));
        });
      }
    } else {
      // En modo creación, inicializamos con una medida vacía
      this.addMeasurement();
    }
  }
  
  get measurementsArray() {
    return this.machineryForm.get('measurements') as FormArray;
  }
  
  createMeasurementGroup(measurement?: MachineryMeasurementEntity) {
    return this.fb.group({
      id: [measurement?.id || null],
      name: [measurement?.name || '', Validators.required],
      unit: [measurement?.unit || '', Validators.required],
      value: [measurement?.value || 0],
      lastUpdated: [measurement?.lastUpdated || new Date()]
    });
  }

  addMeasurement(): void {
    if (!this.isEditMode) {
      this.measurementsArray.push(this.createMeasurementGroup());
    }
  }
  
  removeMeasurement(index: number): void {
    if (!this.isEditMode) {
      this.measurementsArray.removeAt(index);
    }
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onSubmit(): void {
    if (this.machineryForm.valid) {
      this.save.emit(this.machineryForm.value);
    } else {
      this.machineryForm.markAllAsTouched();
      this.measurementsArray.markAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
