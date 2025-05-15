import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PurchaseOrderEntity } from '../../../shared/models/purchase-orders.entity';
import { InventoryPartEntitysApiService } from '../../../inventory-parts/services/inventory-parts-api.service';
import { InventoryPartEntity } from '../../../shared/models/inventory-part.entity';

@Component({
  selector: 'app-purchase-order-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './purchase-order-form-modal.component.html',
  styleUrls: ['./purchase-order-form-modal.component.scss']
})
export class PurchaseOrderFormModalComponent implements OnInit {
  @Input() isEdit = false;
  @Input() orderData: Partial<PurchaseOrderEntity> | null = null;
  private originalData: Partial<PurchaseOrderEntity> | null = null;

  @Output() submit = new EventEmitter<Partial<PurchaseOrderEntity>>();
  @Output() delete = new EventEmitter<number | string>();
  @Output() cancel = new EventEmitter<void>();

  inventoryParts: InventoryPartEntity[] = [];

  formData: Partial<PurchaseOrderEntity> = {
    orderNumber: '',
    supplier: '',
    status: 'PENDING',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    totalAmount: 0,
    inventoryPartId: undefined,
    quantity: 1,
    price: 0,
    notes: ''
  };

  statusOptions = [
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'APPROVED', label: 'Aprobada' },
    { value: 'RECEIVED', label: 'Recibida' },
    { value: 'CANCELLED', label: 'Cancelada' }
  ];

  constructor(private inventoryPartsService: InventoryPartEntitysApiService) {}

  async ngOnInit() {
    // Cargar todos los repuestos disponibles
    try {
      this.inventoryParts = await this.inventoryPartsService.getParts();
    } catch (error) {
      console.error('Error al cargar repuestos:', error);
    }

    if (this.orderData) {
      this.originalData = this.orderData;
      this.formData = {
        ...this.formData,
        ...this.orderData
      };
    }
  }

  // Calcular automáticamente el monto total
  updateTotalAmount() {
    if (this.formData.quantity && this.formData.price) {
      this.formData.totalAmount = this.formData.quantity * this.formData.price;
    }
  }

  handleSubmit() {
    const formDataForBackend = {
      ...this.formData,
      id: this.originalData?.id,
      inventory_part_id: this.formData.inventoryPartId,
      order_date: this.formData.orderDate,
      expected_date: this.formData.expectedDate
    } as any; // Usar 'as any' para evitar errores de tipo

    this.submit.emit(formDataForBackend);
  }

  handleCancel() {
    this.cancel.emit();
  }

  handleDelete() {
    if (confirm('¿Está seguro de eliminar esta orden de compra?')) {
      if (this.originalData?.id) {
        this.delete.emit(this.originalData.id);
      }
    }
  }
}
