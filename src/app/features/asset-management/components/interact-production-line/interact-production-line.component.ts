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
  @Input() title: string = '';
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productionLineForm: FormGroup;
  isEditMode = false;
  availableMachineries: MachineryEntity[] = [];
  selectedMachineries: number[] = [];

  constructor(
    private fb: FormBuilder,
    private machineryService: MachineryService,
    private translate: TranslateService
  ) {
    this.productionLineForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      plant_id: [1, Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      status: [1]
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.productionLine;
    this.title = this.translate.instant(
      this.isEditMode ?
      'assetManagement.forms.productionLine.title.edit' :
      'assetManagement.forms.productionLine.title.new'
    );
    this.loadAvailableMachineries();

    if (this.isEditMode && this.productionLine) {
      this.productionLineForm.patchValue({
        name: this.productionLine.name,
        plant_id: this.productionLine.plantId,
        capacity: this.productionLine.capacity,
        description: this.productionLine.description,
        status: this.productionLine.status
      });

      this.selectedMachineries = this.productionLine.machineries.map(m => m.id);
    }
  }

  loadAvailableMachineries() {
    this.machineryService.getAllMachineries().subscribe({
      next: (machineries) => {
        this.availableMachineries = machineries;
      },
      error: (err) => {
        console.error(this.translate.instant('assetManagement.forms.productionLine.errors.loadMachineries'), err);
      }
    });
  }

  toggleMachinerySelection(machineryId: number) {
    const index = this.selectedMachineries.indexOf(machineryId);
    if (index > -1) {
      this.selectedMachineries.splice(index, 1);
    } else {
      this.selectedMachineries.push(machineryId);
    }
  }

  isMachinerySelected(machineryId: number): boolean {
    return this.selectedMachineries.includes(machineryId);
  }

  onSubmit(): void {
    if (this.productionLineForm.valid && this.selectedMachineries.length > 0) {
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

  getErrorMessage(fieldName: string): string {
    const control = this.productionLineForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return this.translate.instant(`assetManagement.forms.productionLine.fields.${fieldName}.required`);
    }
    if (control.hasError('min')) {
      return this.translate.instant(`assetManagement.forms.productionLine.fields.${fieldName}.min`);
    }
    if (control.hasError('minlength')) {
      return this.translate.instant(`assetManagement.forms.productionLine.fields.${fieldName}.minLength`);
    }
    return '';
  }
}
