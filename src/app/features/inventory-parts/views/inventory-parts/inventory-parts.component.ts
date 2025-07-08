import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryPartEntitysApiService } from '../../services/inventory-parts-api.service';
import { InventoryPartEntity } from '../../../shared/models/inventory-part.entity';
import { InventoryPartFormModalComponent } from '../../components/inventory-part-form-modal/inventory-part-form-modal.component';
import { AddStockModalComponent } from '../../components/add-stock-modal/add-stock-modal.component';
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
  selector: 'app-inventory-parts',
  templateUrl: './inventory-parts.component.html',
  styleUrls: ['./inventory-parts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RecordTableComponent,
    InformationPanelComponent,
    TitleViewComponent,
    InfoSectionComponent,
    InfoContainerComponent,
    ButtonComponent,
    InventoryPartFormModalComponent,
    SearchComponent,
    TranslateModule,
    AddStockModalComponent
  ]
})
export class InventoryPartsComponent implements OnInit {
  inventoryParts: InventoryPartEntity[] = [];
  selectedPart: any = null;
  showInfoPanel = false;
  showCreateModal = false;
  showEditModal = false;
  searchTerm = '';
  activeFilters: Record<string, string> = {};
  infoData: { subtitle: string; info: any }[] = [];
  stockData: { subtitle: string; info: any }[] = [];
  showAddStockModal = false;
  // Filtros para el componente de búsqueda
  filters = [
    {
      value: 'stock_status',
      label: 'inventoryParts.search.filters.status.label',
      options: [
        { value: 'OK', label: 'inventoryParts.search.filters.status.options.ok' },
        { value: 'LOW', label: 'inventoryParts.search.filters.status.options.low' }
      ]
    }
  ];
  columns: TableColumn[] = [
    { key: 'code', label: 'inventoryParts.table.code', type: 'texto' },
    { key: 'name', label: 'inventoryParts.table.name', type: 'texto' },
    { key: 'category', label: 'inventoryParts.table.category', type: 'texto' },
    { key: 'current_stock', label: 'inventoryParts.table.currentStock', type: 'numero' },
    { key: 'stock_status', label: 'inventoryParts.table.stockStatus', type: 'texto', filterable: true },
    { key: 'actions', label: '', type: 'cta', ctaLabel: 'inventoryParts.table.details', ctaVariant: 'primary' }
  ];
  constructor(
    private inventoryPartsService: InventoryPartEntitysApiService,
    private translate: TranslateService
  ) {
    console.log('InventoryPartsComponent initialized');
  }
  ngOnInit() {
    console.log('ngOnInit called');
    this.loadInventoryParts();
  }
  get filteredInventoryParts() {
    let filtered = [...this.inventoryParts];
    // Aplicar búsqueda por texto
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(part =>
        part.code.toLowerCase().includes(searchLower) ||
        part.name.toLowerCase().includes(searchLower)
      );
    }
    // Aplicar filtros activos
    if (Object.keys(this.activeFilters).length) {
      filtered = filtered.filter(part => {
        return Object.entries(this.activeFilters).every(([key, value]) => {
          if (!value) return true; // Si no hay valor seleccionado, no filtrar
          return part[key as keyof InventoryPartEntity] === value;
        });
      });
    }
    return filtered;
  }
  async loadInventoryParts() {
    try {
      console.log('Iniciando carga de inventory parts');
      const data = await this.inventoryPartsService.getParts();
      console.log('Datos recibidos del servicio:', data);
      this.inventoryParts = data;
      console.log('Datos transformados:', this.inventoryParts);
    } catch (error) {
      console.error('Error loading inventory parts:', error);
    }
  }
  handleSearch(term: string) {
    this.searchTerm = term;
  }
  handleFilterChange(filters: Record<string, string>) {
    this.activeFilters = filters;
  }
  handleInfoClick(event: { row: any; column: any }) {
    const item = event.row as InventoryPartEntity;
    this.selectedPart = item;
    this.updateInfoPanel(item);
    this.showInfoPanel = true;
  }
  updateInfoPanel(inventoryPart: InventoryPartEntity) {
    this.infoData = [
      { subtitle: this.translate.instant('inventoryParts.infoPanel.sections.generalInfo.code'), info: inventoryPart.code },
      { subtitle: this.translate.instant('inventoryParts.infoPanel.sections.generalInfo.name'), info: inventoryPart.name },
      { subtitle: this.translate.instant('inventoryParts.infoPanel.sections.generalInfo.description'),
        info: inventoryPart.description || this.translate.instant('inventoryParts.infoPanel.sections.generalInfo.notAvailable') }
    ];

    this.stockData = [
      { subtitle: this.translate.instant('inventoryParts.infoPanel.sections.stockInfo.currentStock'), info: inventoryPart.current_stock },
      { subtitle: this.translate.instant('inventoryParts.infoPanel.sections.stockInfo.minStock'), info: inventoryPart.min_stock },
      { subtitle: this.translate.instant('inventoryParts.infoPanel.sections.stockInfo.unitPrice'), info: `$${inventoryPart.unit_price}` },
      { subtitle: this.translate.instant('inventoryParts.infoPanel.sections.stockInfo.status'), info: inventoryPart.stock_status },
      { subtitle: this.translate.instant('inventoryParts.infoPanel.sections.stockInfo.lastRestock'),
        info: inventoryPart.last_restock || this.translate.instant('inventoryParts.infoPanel.sections.stockInfo.notAvailable') }
    ];
  }
  async handleCreate(formData: Partial<InventoryPartEntity>) {
    try {
      await this.inventoryPartsService.createPart(formData);
      this.showCreateModal = false;
      await this.loadInventoryParts();
    } catch (error) {
      console.error('Error al crear:', error);
    }
  }
  async handleEdit(formData: Partial<InventoryPartEntity>) {
    try {
      if (formData.id) {
        await this.inventoryPartsService.updatePart(formData.id, formData);
        this.showEditModal = false;
        this.selectedPart = null;
        await this.loadInventoryParts();
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
    this.closePanel();
  }
  async handleDelete(id: number) {
    try {
      await this.inventoryPartsService.deletePart(id);
      this.showEditModal = false;
      this.selectedPart = null;
      await this.loadInventoryParts();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }

    this.closePanel();
  }
  closePanel() {
    this.showInfoPanel = false;
    setTimeout(() => {
      this.selectedPart = null;
    }, 300);
  }
  async handleCtaClick(item: any) {
    this.showInfoPanel = true;
    console.log('CTA click:', item);
    try {
      const partDetails = await this.inventoryPartsService.getPartById(item.id);
      console.log('Part details:', partDetails);

      this.selectedPart = {
        ...partDetails,
        generalInfo: [
          { subtitle: 'Código', info: partDetails.code },
          { subtitle: 'Nombre', info: partDetails.name },
          { subtitle: 'Descripción', info: partDetails.description || 'No disponible' }
        ],
        stockInfo: [
          { subtitle: 'Stock Actual', info: partDetails.current_stock },
          { subtitle: 'Stock Mínimo', info: partDetails.min_stock },
          { subtitle: 'Precio Unitario', info: `S/${partDetails.unit_price}` },
          { subtitle: 'Estado', info: partDetails.stock_status },
          { subtitle: 'Última Reposición', info: partDetails.last_restock || 'No disponible' }
        ]
      };

      this.showInfoPanel = true;
    } catch (error) {
      console.error('Error fetching part details:', error);
    }
  }
  handleNewClick=()=> {
    console.log('New click');
    this.selectedPart = null;
    this.showCreateModal = true;

  }

  async handleAddStock(dto: {quantity:number; reason:string; unitCost:number; reference:string}) {
    if (!this.selectedPart) return;
    try {
      await this.inventoryPartsService.addStock(this.selectedPart.id, dto);
      this.showAddStockModal = false;
      await this.loadInventoryParts();
    } catch (err) {
      console.error('Error al agregar stock', err);
    }
  }
}
