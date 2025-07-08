import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlantEntity, PlantStatus } from '../../models/plant.entity';
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
  @Output() save = new EventEmitter<Partial<PlantEntity>>();
  @Output() cancel = new EventEmitter<void>();

  plantForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.plantForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      contactPhone: ['', [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]]
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
        address: this.plantToEdit.address,
        city: this.plantToEdit.city,
        country: this.plantToEdit.country,
        contactPhone: this.plantToEdit.contactPhone,
        contactEmail: this.plantToEdit.contactEmail
      });
    }
  }

  onSubmit(): void {
    if (this.plantForm.valid) {
      const formData = {
        ...this.plantForm.value
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

  isFieldInvalid(field: string): boolean {
    const control = this.plantForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.plantForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return `assetManagement.forms.plant.fields.${field}.required`;
    }
    if (field === 'contactEmail' && control.hasError('email')) {
      return 'assetManagement.forms.plant.fields.contactEmail.invalid';
    }
    return '';
  }
}
