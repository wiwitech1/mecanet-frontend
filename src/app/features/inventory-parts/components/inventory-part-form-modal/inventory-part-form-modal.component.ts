import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InventoryPartEntity } from '../../../shared/models/inventory-part.entity';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { calculateStockStatus } from '../../../shared/services/inventory-part.assembler';
import { MachineryService } from '../../../asset-management/services/machinery.service';
import { MachineryEntity } from '../../../asset-management/models/machinery.entity';
import { PlantService } from '../../../asset-management/services/plant.service';
import { PlantEntity } from '../../../asset-management/models/plant.entity';

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

  formData: any = {
    sku: '',
    name: '',
    description: '',
    category: 'REPUESTO',
    unit: '',
    unitPrice: 0,
    minimumStock: 0,
    location: '',
    compatibleMachineIds: [],
    plantId: 1,
    currentStock: 0,
    stock_status: 'OUT_OF_STOCK'
  };

  categories = ['REPUESTO', 'HERRAMIENTA', 'CONSUMIBLE', 'EQUIPO', 'SEGURIDAD', 'MATERIAL'];
  machineries: MachineryEntity[] = [];
  plants: PlantEntity[] = [];

  constructor(
      private translate: TranslateService,
      private machineryService: MachineryService,
      private plantService: PlantService) {}

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

    // Cargar maquinarias disponibles
    this.machineryService.getAllMachines().subscribe({
      next: (data) => (this.machineries = data),
      error: (err) => console.error('Error cargando maquinarias', err)
    });

    // cargar plantas
    this.plantService.getAll().subscribe({
      next: (data) => (this.plants = data),
      error: (err) => console.error('Error cargando plantas', err)
    });
  }

    onStockChange() {
    // Recalcular stock_status cuando cambien los valores de stock
    if (this.formData.currentStock !== undefined && this.formData.minimumStock !== undefined) {
      this.formData.stock_status = calculateStockStatus(
        this.formData.currentStock || 0,
        this.formData.minimumStock || 0
      );
    }
  }

  handleSubmit() {
    // Calcular el stock_status basado en los valores actuales
    const stockStatus = calculateStockStatus(
      this.formData.currentStock || 0,
      this.formData.minimumStock || 0
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

  toggleMachine(id: number, checked: boolean) {
    const list: number[] = this.formData.compatibleMachineIds;
    if (checked) {
      if (!list.includes(id)) {
        list.push(id);
      }
    } else {
      this.formData.compatibleMachineIds = list.filter(mId => mId !== id);
    }
  }
}
