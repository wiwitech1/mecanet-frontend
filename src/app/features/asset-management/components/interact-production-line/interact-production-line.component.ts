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
  @Input() plants: PlantEntity[] = [];
  @Input() productionLine?: ProductionLineEntity;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  selectedPlantId: number | null = null;
  productionLineForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private plantService: PlantService
  ) {
    this.productionLineForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      maxUnitsPerHour: ['', [Validators.required, Validators.min(1)]],
      unit: ['', Validators.required],
      plantId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.productionLine;
    this.loadPlants();

    if (this.isEditMode && this.productionLine) {
      this.selectedPlantId = this.productionLine.plantId;
      this.productionLineForm.patchValue({
        name: this.productionLine.name,
        code: this.productionLine.code,
        maxUnitsPerHour: this.productionLine.maxUnitsPerHour,
        unit: this.productionLine.unit,
        plantId: this.productionLine.plantId
      });
    }
  }

  onPlantChange(event: any) {
    console.log('Plant ID seleccionado:', this.productionLineForm.get('plantId')?.value);
  }

  onSubmit(): void {
    if (this.productionLineForm.valid) {
      this.save.emit(this.productionLineForm.value);
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
          this.selectedPlantId = plants[0].id;
          this.productionLineForm.patchValue({ plantId: plants[0].id });
        }
      },
      error: (err) => console.error('Error loading plants:', err)
    });
  }
}
