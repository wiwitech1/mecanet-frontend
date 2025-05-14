import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InventoryPartEntity } from '../../../shared/models/inventory-part.entity';

@Component({
  selector: 'app-inventory-part-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './inventory-part-form-modal.component.html',
  styleUrls: ['./inventory-part-form-modal.component.scss']
})
export class InventoryPartFormModalComponent implements OnInit {
  @Input() isEdit = false;
  @Input() set partData(data: Partial<InventoryPartEntity> | null) {
    if (data) {
      this.formData = {
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        current_stock: data.current_stock || 0,
        min_stock: data.min_stock || 0,
        unit_price: data.unit_price || 0
      };
    }
  }

  @Output() submit = new EventEmitter<Partial<InventoryPartEntity>>();
  @Output() delete = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  formData: Partial<InventoryPartEntity> = {
    code: '',
    name: '',
    description: '',
    current_stock: 0,
    min_stock: 0,
    unit_price: 0
  };

  ngOnInit() {
    // Similar a onMounted en Vue
    if (this.isEdit && this.partData) {
      this.formData = { ...this.formData };
    }
  }

  handleSubmit() {
    this.submit.emit({
      ...this.formData,
      id: (this.partData as any)?.id
    });
  }

  handleCancel() {
    this.cancel.emit();
  }

  handleDelete() {
    if (confirm('¿Está seguro de eliminar este repuesto?')) {
      this.delete.emit((this.partData as any)?.id);
    }
  }
}
