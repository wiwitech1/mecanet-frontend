import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InventoryPartEntity } from '../../../shared/models/inventory-part.entity';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { calculateStockStatus } from '../../../shared/services/inventory-part.assembler';

@Component({
  selector: 'app-inventory-part-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TranslateModule],
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
    unit_price: 0,
    stock_status: 'OUT_OF_STOCK'
  };

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    if (this.partData) {
      this.originalData = { ...this.partData };
      this.formData = {
        ...this.formData,
        ...this.partData
      };
      // Calcular stock_status inicial si no está presente
      this.onStockChange();
    }
  }

    onStockChange() {
    // Recalcular stock_status cuando cambien los valores de stock
    if (this.formData.current_stock !== undefined && this.formData.min_stock !== undefined) {
      this.formData.stock_status = calculateStockStatus(
        this.formData.current_stock || 0,
        this.formData.min_stock || 0
      );
    }
  }

  handleSubmit() {
    // Calcular el stock_status basado en los valores actuales
    const stockStatus = calculateStockStatus(
      this.formData.current_stock || 0,
      this.formData.min_stock || 0
    );

    const formDataForBackend = {
      ...this.formData,
      stock_status: stockStatus,
      id: this.originalData?.id
    };
    this.submit.emit(formDataForBackend);
  }

  handleCancel() {
    this.cancel.emit();
  }

  handleDelete() {
    if (confirm(this.translate.instant('inventoryParts.form.confirmDelete'))) {
      if (this.originalData?.id) {
        this.delete.emit(this.originalData.id);
      }
    }
  }
}
