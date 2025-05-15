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
  @Input() partData: Partial<InventoryPartEntity> | null = null;
  private originalData: Partial<InventoryPartEntity> | null = null;

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
    if (this.partData) {
      this.originalData = this.partData;
      this.formData = {
        ...this.formData,
        ...this.partData
      };
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
      if (this.originalData?.id) {
        this.delete.emit(this.originalData.id);
      }
    }
  }
}
