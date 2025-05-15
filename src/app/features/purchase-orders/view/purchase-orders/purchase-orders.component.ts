import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderEntity } from '../../../shared/models/purchase-orders.entity';
import { PurchaseOrdersApiService } from '../../services/purchase-orders-api.service';
import { RecordTableComponent } from '../../../../shared/components/record-table/record-table.component';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { InfoSectionComponent } from '../../../../shared/components/information-panel/info-section/info-section.component';
import { InfoContainerComponent } from '../../../../shared/components/information-panel/info-container/info-container.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { PurchaseOrderFormModalComponent } from '../../components/purchase-order-form-modal/purchase-order-form-modal.component';
import { InventoryPartEntity } from '../../../shared/models/inventory-part.entity';

interface TableColumn {
  key: string;
  label: string;
  type: 'texto' | 'numero' | 'cta';
  ctaLabel?: string;
  ctaVariant?: 'primary' | 'secondary' | 'warning';
}

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RecordTableComponent,
    InformationPanelComponent,
    TitleViewComponent,
    InfoSectionComponent,
    InfoContainerComponent,
    ButtonComponent,
    SearchComponent,
    PurchaseOrderFormModalComponent
  ]
})
export class PurchaseOrdersComponent implements OnInit {
  purchaseOrders: PurchaseOrderEntity[] = [];
  selectedOrder: any = null;
  showInfoPanel = false;
  showCreateModal = false;
  showEditModal = false;
  searchTerm = '';
  infoData: { subtitle: string; info: any }[] = [];
  orderData: { subtitle: string; info: any }[] = [];

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'texto' },
    { key: 'inventory_part_id', label: 'Repuesto', type: 'texto' },
    { key: 'price', label: 'Precio', type: 'numero' },
    { key: 'order_date', label: 'Fecha Solicitada', type: 'texto' },
    { key: 'status', label: 'Estado', type: 'texto' },
    { key: 'actions', label: '', type: 'cta', ctaLabel: 'Detalles', ctaVariant: 'primary' }
  ];



  constructor(private purchaseOrdersService: PurchaseOrdersApiService) {}

  ngOnInit() {
    this.loadPurchaseOrders();
  }

  async loadPurchaseOrders() {
    try {
      const data = await this.purchaseOrdersService.getOrders();
      this.purchaseOrders = data;
    } catch (error) {
      console.error('Error loading purchase orders:', error);
    }
  }

  handleInfoClick(event: { row: any; column: any }) {
    const order = event.row as PurchaseOrderEntity;
    console.log('Original order data:', order);
    this.selectedOrder = order;
    this.updateInfoPanel(order);
    this.showInfoPanel = true;
  }

  newPurchaseOrderAction = () => {
    this.showCreateModal = true;
    this.selectedOrder = null;
  };

  updateInfoPanel(order: PurchaseOrderEntity & { inventoryPart?: InventoryPartEntity }) {
    this.infoData = [
      { subtitle: 'ID', info: order.id },
      { subtitle: 'Repuesto', info: order.inventoryPart?.name || 'No disponible' },
      { subtitle: 'Fecha Solicitada', info: order.orderDate }
    ];

    this.orderData = [
      { subtitle: 'Precio', info: `$${order.price}` },
      { subtitle: 'Estado', info: order.status },
      { subtitle: 'Notas', info: order.notes || 'Sin notas' }
    ];
  }

  closePanel() {
    this.showInfoPanel = false;
    setTimeout(() => {
      this.selectedOrder = null;
    }, 300);
  }

  async handleCreate(formData: Partial<PurchaseOrderEntity>) {
    try {
      await this.purchaseOrdersService.createOrder(formData);
      this.showCreateModal = false;
      await this.loadPurchaseOrders();
    } catch (error) {
      console.error('Error al crear:', error);
    }
  }

  async handleEdit(formData: Partial<PurchaseOrderEntity>) {
    try {
      if (formData.id) {
        await this.purchaseOrdersService.updateOrder(formData.id, formData);
        this.showEditModal = false;
        this.selectedOrder = null;
        await this.loadPurchaseOrders();
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }

  handleDelete(id: string | number): void {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    console.log('Eliminando orden de compra con ID:', numericId);
  }
}
