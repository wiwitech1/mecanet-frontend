import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderService } from '../../services/work-order.service';
import { WorkOrderEntity } from '../../models/work-order.entity';
import { WorkOrderFormModalComponent } from '../../components/work-order-form-modal/work-order-form-modal.component';
import { RecordTableComponent } from '../../../../shared/components/record-table/record-table.component';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { InfoSectionComponent } from '../../../../shared/components/information-panel/info-section/info-section.component';
import { InfoContainerComponent } from '../../../../shared/components/information-panel/info-container/info-container.component';
import { ButtonComponent, ButtonVariant } from '../../../../shared/components/button/button.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface TableColumn {
  key: string;
  label: string;
  type: 'texto' | 'numero' | 'informacion' | 'cta';
  filterable?: boolean;
  ctaLabel?: string;
  ctaVariant?: ButtonVariant;
  width?: string;
}

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RecordTableComponent,
    InformationPanelComponent,
    TitleViewComponent,
    InfoSectionComponent,
    InfoContainerComponent,
    ButtonComponent,
    WorkOrderFormModalComponent,
    SearchComponent,
    TranslateModule
  ]
})
export class WorkOrderComponent implements OnInit {
  workOrders: WorkOrderEntity[] = [];
  selectedOrder: any = null;
  showInfoPanel = false;
  showCreateModal = false;
  showEditModal = false;
  searchTerm = '';
  activeFilters: Record<string, string> = {};
  infoData: { subtitle: string; info: any }[] = [];
  technicianData: { subtitle: string; info: any }[] = [];
  filters = [
    {
      value: 'type',
      label: 'workOrder.search.filters.type.label',
      options: [
        { value: 'Preventivo', label: 'workOrder.search.filters.type.options.preventive' },
        { value: 'Correctivo', label: 'workOrder.search.filters.type.options.corrective' }
      ]
    }
  ];
  columns: TableColumn[] = [
    { key: 'code', label: 'workOrder.table.code', type: 'texto' },
    { key: 'date', label: 'workOrder.table.date', type: 'texto' },
    { key: 'type', label: 'workOrder.table.type', type: 'texto', filterable: true },
    { key: 'assign', label: '', type: 'cta', ctaLabel: 'workOrder.table.assign', ctaVariant: 'primary' },
    { key: 'details', label: '', type: 'cta', ctaLabel: 'workOrder.table.details', ctaVariant: 'outline' }
  ];

  constructor(
    private workOrderService: WorkOrderService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadWorkOrders();
  }

  get filteredWorkOrders() {
    let filtered = [...this.workOrders];
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.code.toLowerCase().includes(searchLower)
      );
    }
    if (Object.keys(this.activeFilters).length) {
      filtered = filtered.filter(order => {
        return Object.entries(this.activeFilters).every(([key, value]) => {
          if (!value) return true;
          return order[key as keyof WorkOrderEntity] === value;
        });
      });
    }
    return filtered;
  }

  async loadWorkOrders() {
    try {
      const data = await this.workOrderService.getOrders();
      this.workOrders = data;
    } catch (error) {
      console.error('Error loading work orders:', error);
    }
  }

  handleSearch(term: string) {
    this.searchTerm = term;
  }

  handleFilterChange(filters: Record<string, string>) {
    this.activeFilters = filters;
  }

  updateInfoPanel(order: WorkOrderEntity) {
    this.infoData = [
      { subtitle: this.translate.instant('workOrder.infoPanel.sections.generalInfo.code'), info: order.code },
      { subtitle: this.translate.instant('workOrder.infoPanel.sections.generalInfo.date'), info: order.date },
      { subtitle: this.translate.instant('workOrder.infoPanel.sections.generalInfo.type'), info: order.type },
      { subtitle: this.translate.instant('workOrder.infoPanel.sections.generalInfo.productionLine'), info: order.productionLine }
    ];

    if (order.technicians.length > 0) {
      this.technicianData = order.technicians.map(tech => ({
        subtitle: tech.name,
        info: tech.machines.join(', ')
      }));
    } else {
      this.technicianData = [{
        subtitle: this.translate.instant('workOrder.infoPanel.sections.technicians.noTechnicians'),
        info: ''
      }];
    }
  }

  async handleCreate(formData: Partial<WorkOrderEntity>) {
    try {
      await this.workOrderService.createOrder(formData);
      this.showCreateModal = false;
      await this.loadWorkOrders();
    } catch (error) {
      console.error('Error al crear:', error);
    }
  }

  async handleEdit(formData: Partial<WorkOrderEntity>) {
    try {
      if (formData.id) {
        await this.workOrderService.updateOrder(formData.id, formData);
        this.showEditModal = false;
        this.selectedOrder = null;
        await this.loadWorkOrders();
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
    this.closePanel();
  }

  async handleDelete(id: number) {
    try {
      if (confirm(this.translate.instant('workOrder.form.confirmDelete'))) {
        await this.workOrderService.deleteOrder(id);
        this.showEditModal = false;
        this.selectedOrder = null;
        await this.loadWorkOrders();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
    this.closePanel();
  }

  closePanel() {
    this.showInfoPanel = false;
    setTimeout(() => {
      this.selectedOrder = null;
    }, 300);
  }

  async handleCtaClick(event: { row: any; column: any }) {
    const item = event.row as WorkOrderEntity;
    const columnKey = event.column.key;

    if (columnKey === 'assign') {
      // Abrir modal de edición para asignar técnicos
      this.selectedOrder = item;
      this.showEditModal = true;
    } else if (columnKey === 'details') {
      // Mostrar panel de información
      this.selectedOrder = item;
      this.updateInfoPanel(item);
      this.showInfoPanel = true;
    }
  }

  handleNewClick = () => {
    this.showCreateModal = true;
  }
}
