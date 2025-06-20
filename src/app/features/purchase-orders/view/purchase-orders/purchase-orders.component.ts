
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    PurchaseOrderFormModalComponent,
    TranslateModule
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
    { key: 'id', label: 'purchaseOrders.table.id', type: 'texto' },
    { key: 'inventory_part_id', label: 'purchaseOrders.table.part', type: 'texto' },
    { key: 'price', label: 'purchaseOrders.table.price', type: 'numero' },
    { key: 'order_date', label: 'purchaseOrders.table.orderDate', type: 'texto' },
    { key: 'status', label: 'purchaseOrders.table.status', type: 'texto' },
    { key: 'actions', label: '', type: 'cta', ctaLabel: 'purchaseOrders.table.details', ctaVariant: 'primary' }
  ];

  constructor(
    private purchaseOrdersService: PurchaseOrdersApiService,
    private translate: TranslateService
  ) {}

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
      { subtitle: this.translate.instant('purchaseOrders.infoPanel.sections.generalInfo.id'), info: order.id },
      { subtitle: this.translate.instant('purchaseOrders.infoPanel.sections.generalInfo.part'),
        info: order.inventoryPart?.name || this.translate.instant('purchaseOrders.infoPanel.sections.generalInfo.notAvailable') },
      { subtitle: this.translate.instant('purchaseOrders.infoPanel.sections.generalInfo.orderDate'), info: order.orderDate }
    ];

    this.orderData = [
      { subtitle: this.translate.instant('purchaseOrders.infoPanel.sections.orderDetails.price'), info: `$${order.price}` },
      { subtitle: this.translate.instant('purchaseOrders.infoPanel.sections.orderDetails.status'), info: order.status },
      { subtitle: this.translate.instant('purchaseOrders.infoPanel.sections.orderDetails.notes'),
        info: order.notes || this.translate.instant('purchaseOrders.infoPanel.sections.orderDetails.noNotes') }
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

  async handleDelete(id: string | number) {
    try {
      await this.purchaseOrdersService.deleteOrder(Number(id));
      this.showEditModal = false;
      this.selectedOrder = null;
      await this.loadPurchaseOrders();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  }
}
