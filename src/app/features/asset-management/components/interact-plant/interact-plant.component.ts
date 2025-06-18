import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlantEntity, PlantStatus } from '../../models/plant.entity';
import { ProductionLineEntity } from '../../models/production-line.entity';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interact-plant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './interact-plant.component.html',
  styleUrl: './interact-plant.component.scss'
})
export class InteractPlantComponent implements OnInit {
  @Input() showModal = false;
  @Input() plantToEdit: PlantEntity | null = null;
  @Input() title: string = '';
  @Input() availableProductionLines: ProductionLineEntity[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  plantForm: FormGroup;
  isEditMode = false;
  selectedProductionLines: number[] = [];

  plantStatuses = [
    { value: PlantStatus.ACTIVE, label: 'assetManagement.status.active' },
    { value: PlantStatus.INACTIVE, label: 'assetManagement.status.inactive' },
    { value: PlantStatus.MAINTENANCE, label: 'assetManagement.status.maintenance' }
  ];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.plantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      status: [PlantStatus.ACTIVE, Validators.required]
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.plantToEdit;
    this.title = this.translate.instant(this.isEditMode ?
      'assetManagement.forms.plant.title.edit' :
      'assetManagement.forms.plant.title.new');

    if (this.isEditMode && this.plantToEdit) {
      this.plantForm.patchValue({
        name: this.plantToEdit.name,
        location: this.plantToEdit.location,
        capacity: this.plantToEdit.capacity,
        description: this.plantToEdit.description,
        status: this.plantToEdit.status
      });
      this.selectedProductionLines = this.plantToEdit.productionLines?.map(l => l.id) || [];
    }
  }

  toggleProductionLineSelection(lineId: number) {
    const idx = this.selectedProductionLines.indexOf(lineId);
    if (idx > -1) {
      this.selectedProductionLines.splice(idx, 1);
    } else {
      this.selectedProductionLines.push(lineId);
    }
  }

  isProductionLineSelected(lineId: number): boolean {
    return this.selectedProductionLines.includes(lineId);
  }

  onSubmit(): void {
    if (this.plantForm.valid) {
      const formData = {
        ...this.plantForm.value,
        productionLines: this.selectedProductionLines
      };

      if (this.isEditMode && this.plantToEdit) {
        formData.id = this.plantToEdit.id;
      }

      this.save.emit(formData);
    } else {
      this.plantForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.plantForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.plantForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return this.translate.instant(`assetManagement.forms.plant.fields.${fieldName}.required`);
    }
    if (control.hasError('min')) {
      return this.translate.instant(`assetManagement.forms.plant.fields.${fieldName}.min`);
    }
    if (control.hasError('minlength')) {
      return this.translate.instant(`assetManagement.forms.plant.fields.${fieldName}.minLength`);
    }
    return '';
  }
}
