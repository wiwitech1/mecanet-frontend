import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductionLineEntity } from '../../models/production-line.entity';
import { TranslateModule } from '@ngx-translate/core';
import { PlantEntity } from '../../models/plant.entity';
import { PlantService } from '../../services/plant.service';

@Component({
  selector: 'app-interact-production-line',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './interact-production-line.component.html',
  styleUrl: './interact-production-line.component.scss'
})
export class InteractProductionLineComponent implements OnInit {
  @Input() title: string = '';
  @Input() productionLine?: ProductionLineEntity;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productionLineForm: FormGroup;
  plants: PlantEntity[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private plantService: PlantService
  ) {
    this.productionLineForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      maxUnitsPerHour: ['', [Validators.required, Validators.min(1)]],
      unit: ['', [Validators.required]],
      plantId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.productionLine;
    this.loadPlants();

    if (this.isEditMode && this.productionLine) {
      this.productionLineForm.patchValue({
        name: this.productionLine.name,
        code: this.productionLine.code,
        maxUnitsPerHour: this.productionLine.maxUnitsPerHour,
        unit: this.productionLine.unit,
        plantId: this.productionLine.plantId
      });
    }
  }

  onSubmit(): void {
    if (this.productionLineForm.valid) {
      const formValue = this.productionLineForm.value;
      // Asegurarse de que maxUnitsPerHour sea un número
      formValue.maxUnitsPerHour = Number(formValue.maxUnitsPerHour);
      // Asegurarse de que plantId sea un número
      formValue.plantId = Number(formValue.plantId);
      this.save.emit(formValue);
    } else {
      this.productionLineForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  loadPlants() {
    this.plantService.getAll().subscribe({
      next: (plants) => {
        this.plants = plants;
        if (plants.length > 0 && !this.productionLine) {
          this.productionLineForm.patchValue({ plantId: plants[0].id });
        }
      },
      error: (err) => console.error('Error loading plants:', err)
    });
  }
}
