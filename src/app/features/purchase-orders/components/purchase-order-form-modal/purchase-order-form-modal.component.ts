import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PurchaseOrderEntity } from '../../../shared/models/purchase-orders.entity';

@Component({
  selector: 'app-purchase-order-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './purchase-order-form-modal.component.html',
  styleUrls: ['./purchase-order-form-modal.component.scss']
})
export class PurchaseOrderFormModalComponent implements OnInit {
  @Input() isEdit = false;
  @Input() set orderData(data: Partial<PurchaseOrderEntity> | null) {
    if (data) {
      this.formData = {
        orderNumber: data.orderNumber || '',
        supplier: data.supplier || '',
        status: data.status || 'PENDING',
        orderDate: data.orderDate || new Date().toISOString().split('T')[0],
        expectedDate: data.expectedDate || '',
        totalAmount: data.totalAmount || 0,
        notes: data.notes || ''
      };
    }
  }

  @Output() submit = new EventEmitter<Partial<PurchaseOrderEntity>>();
  @Output() delete = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  formData: Partial<PurchaseOrderEntity> = {
    orderNumber: '',
    supplier: '',
    status: 'PENDING',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    totalAmount: 0,
    notes: ''
  };

  statusOptions = [
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'COMPLETED', label: 'Completada' },
    { value: 'CANCELLED', label: 'Cancelada' }
  ];

  ngOnInit() {
    if (this.isEdit && this.orderData) {
      this.formData = { ...this.formData };
    }
  }

  handleSubmit() {
    this.submit.emit({
      ...this.formData,
      id: (this.orderData as any)?.id
    });
  }

  handleCancel() {
    this.cancel.emit();
  }

  handleDelete() {
    if (confirm('¿Está seguro de eliminar esta orden de compra?')) {
      this.delete.emit((this.orderData as any)?.id);
    }
  }
}
