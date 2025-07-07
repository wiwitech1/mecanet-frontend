import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MachineryEntity } from '../../models/machinery.entity';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-interact-machinery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './interact-machinery.component.html',
  styleUrl: './interact-machinery.component.scss'
})
export class InteractMachineryComponent implements OnInit {
  @Input() machinery: MachineryEntity | null = null;
  @Input() title: string = 'Nueva Maquinaria';
  @Output() save = new EventEmitter<Partial<MachineryEntity>>();
  @Output() cancel = new EventEmitter<void>();

  machineryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.machineryForm = this.fb.group({
      serialNumber: ['', Validators.required],
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      model: ['', Validators.required],
      type: ['', Validators.required],
      powerConsumption: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.machinery) {
      this.machineryForm.patchValue({
        serialNumber: this.machinery.serialNumber,
        name: this.machinery.name,
        manufacturer: this.machinery.manufacturer,
        model: this.machinery.model,
        type: this.machinery.type,
        powerConsumption: this.machinery.powerConsumption
      });
    }
  }

  onSubmit(): void {
    if (this.machineryForm.valid) {
      this.save.emit(this.machineryForm.value);
    } else {
      this.machineryForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
