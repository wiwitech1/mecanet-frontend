import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { RecordTableComponent } from '../../../../shared/components/record-table/record-table.component';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { InfoSectionComponent } from '../../../../shared/components/information-panel/info-section/info-section.component';
import { InfoListItemsComponent } from '../../../../shared/components/information-panel/info-list-items/info-list-items.component';
import { InfoContainerComponent } from '../../../../shared/components/information-panel/info-container/info-container.component';
import { ProductionLineService } from '../../services/production-line.service';
import { ProductionLineEntity, ProductionLineStatus } from '../../models/production-line.entity';
import { finalize } from 'rxjs';
import { InteractProductionLineComponent } from '../../components/interact-production-line/interact-production-line.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlantService } from '../../services/plant.service';
import { PlantEntity } from '../../models/plant.entity';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Pipe({
    name: 'plantName',
    standalone: true
})
export class PlantNamePipe implements PipeTransform {
    transform(plants: PlantEntity[], plantId: number): PlantEntity | undefined {
        return plants.find(plant => plant.id === +plantId);
    }
}

@Component({
  selector: 'app-production-line-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    InformationPanelComponent,
    SearchComponent,
    RecordTableComponent,
    TitleViewComponent,
    InfoSectionComponent,
    InfoListItemsComponent,
    InfoContainerComponent,
    InteractProductionLineComponent,
    PlantNamePipe
  ],
  templateUrl: './production-line-view.component.html',
  styleUrl: './production-line-view.component.scss',
  animations: [
    trigger('panelAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProductionLineViewComponent implements OnInit {
  selectedLineId: number | null = null;
  selectedLine: ProductionLineEntity | null = null;
  showDetailPanel = false;
  showLineModal = false;
  isEditMode = false;

  // Datos reales que vendrán del servicio
  productionLines: ProductionLineEntity[] = [];
  loading = false;
  error: string | null = null;

  // Columnas para la tabla
  columns = [
    { key: 'id', label: 'assetManagement.columns.id', type: 'texto' as 'texto' },
    { key: 'name', label: 'assetManagement.columns.name', type: 'texto' as 'texto' },
    { key: 'plantName', label: 'assetManagement.columns.plant', type: 'texto' as 'texto' },
    { key: 'capacity', label: 'assetManagement.columns.capacity', type: 'texto' as 'texto' },
    { key: 'status', label: 'assetManagement.columns.status', type: 'texto' as 'texto' },
    { key: 'details', label: 'assetManagement.columns.details', type: 'cta' as 'cta', ctaLabel: 'assetManagement.columns.detailsButton' }
  ];

  // Datos adaptados para la tabla
  lines: any[] = [];

  // Datos para el panel de información
  infoData: {subtitle: string, info: string}[] = [];

  // Especificaciones técnicas
  techData: {subtitle: string, info: string}[] = [];

  // Agregar estas propiedades después de las propiedades existentes
  plants: PlantEntity[] = [];
  selectedPlantId: number | null = null;

  constructor(
    private productionLineService: ProductionLineService,
    private plantService: PlantService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadProductionLines();
    this.loadPlants();
  }

  loadProductionLines() {
    console.log('selectedPlantId', this.selectedPlantId)
    if (!this.selectedPlantId) return;
    this.loading = true;
    this.error = null;

    this.productionLineService.getAllProductionLines(this.selectedPlantId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.productionLines = data;
          this.prepareTableData(this.productionLines);
        },
        error: (err) => {
          this.error = 'Error al cargar las líneas de producción. Por favor, intente de nuevo.';
          console.error('Error loading production lines:', err);
        }
      });
  }

  filterProductionLines() {
    let filteredLines = [...this.productionLines];

    if (this.selectedPlantId) {
      filteredLines = this.productionLines.filter(
        line => this.selectedPlantId ? line.plantId === +this.selectedPlantId : true
      );
    }

    this.prepareTableData(filteredLines);
  }

  prepareTableData(lines = this.productionLines) {
    this.lines = lines.map(line => ({
      id: line.id,
      name: line.name,
      plantName: this.getPlantName(line.plantId),
      capacity: `${line.maxUnitsPerHour} ${line.unit}/hora`,
      status: this.getStatusText(line.status),
      details: line.id,
      original: line
    }));
  }

  getPlantName(plantId: number): string {
    // Aquí podrías tener un servicio para obtener el nombre real
    return plantId === 1 ? 'Planta Principal' : 'Planta Secundaria';
  }

  getStatusText(status: string): string {
    switch(status) {
      case ProductionLineStatus.ACTIVE: return 'Activa';
      case ProductionLineStatus.INACTIVE: return 'Inactiva';
      case ProductionLineStatus.MAINTENANCE: return 'En mantenimiento';
      default: return 'Desconocido';
    }
  }

  formatDate(date: Date): string {
    return date ? new Date(date).toLocaleDateString('es-ES') : '';
  }

  selectProductionLine(id: number) {
    this.loading = true;
    this.productionLineService.getProductionLineById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (line) => {
          this.selectedLine = line;
          this.selectedLineId = line.id;
          this.updateInfoPanel(line);
          this.showDetailPanel = true; // Mostramos el panel al seleccionar una línea
        },
        error: (err) => {
          this.error = `Error al cargar la línea de producción con ID ${id}.`;
          console.error('Error loading production line details:', err);
          this.showDetailPanel = false; // Ocultamos el panel si hay error
        }
      });
  }

  updateInfoPanel(line: ProductionLineEntity) {
    // Información básica
    this.infoData = [
      { subtitle: 'Nombre', info: line.name },
      { subtitle: 'Planta', info: this.getPlantName(line.plantId) },
      { subtitle: 'Estado actual', info: this.getStatusText(line.status) },
      { subtitle: 'Capacidad', info: `${line.maxUnitsPerHour} ${line.unit}/hora` }
    ];

    // Especificaciones técnicas
    this.techData = [
      { subtitle: 'Descripción', info: line.code }
    ];
  }

  onCtaClick(event: {row: any, column: any}) {
    if (event.column.key === 'details' && event.row && event.row.id) {
      this.selectProductionLine(event.row.id);
    }
  }

  closeDetailPanel() {
    this.showDetailPanel = false;
    this.selectedLine = null;
    this.selectedLineId = null;
  }

  // Para el botón Nueva Línea
  newLineAction = () => {
    this.isEditMode = false;
    this.showLineModal = true;
  };

  // Para editar línea existente
  editLine() {
    this.isEditMode = true;
    this.showLineModal = true;
  }

  // Cerrar el modal
  closeModal() {
    this.showLineModal = false;
  }

  // Guardar línea (nueva o editada)
  saveLine(lineData: any) {
    this.loading = true;

    if (this.isEditMode && this.selectedLine) {
      // Actualizar línea existente
      this.productionLineService.updateProductionLine(
        this.selectedLine.id,
        {
          name: lineData.name,
          code: lineData.code,
          maxUnitsPerHour: lineData.maxUnitsPerHour,
          unit: lineData.unit,
          plantId: lineData.plantId
        }
      ).pipe(finalize(() => {
        this.loading = false;
        this.showLineModal = false;
      }))
      .subscribe({
        next: (updated) => {
          const index = this.productionLines.findIndex(l => l.id === updated.id);
          if (index >= 0) {
            this.productionLines[index] = updated;
            this.prepareTableData();
          }
          if (this.selectedLineId === updated.id) {
            this.selectedLine = updated;
            this.updateInfoPanel(updated);
          }
        },
        error: (err) => {
          this.error = 'Error al actualizar la línea de producción.';
          console.error('Error updating production line:', err);
        }
      });
    } else {
      // Crear nueva línea
      const newLine: Partial<ProductionLineEntity> = {
        name: lineData.name,
        code: lineData.code,
        maxUnitsPerHour: lineData.maxUnitsPerHour,
        unit: lineData.unit,
        plantId: lineData.plantId
      };

      this.productionLineService.createProductionLine(newLine)
        .pipe(finalize(() => {
          this.loading = false;
          this.showLineModal = false;
        }))
        .subscribe({
          next: (created) => {
            this.productionLines.push(created);
            this.prepareTableData();
          },
          error: (err) => {
            this.error = 'Error al crear la línea de producción.';
            console.error('Error creating production line:', err);
          }
        });
    }
  }

  // Activar/Desactivar línea
  toggleLineStatus() {
    if (!this.selectedLine) return;

    const newStatus = this.selectedLine.status === ProductionLineStatus.ACTIVE
      ? ProductionLineStatus.INACTIVE
      : ProductionLineStatus.ACTIVE;

    this.loading = true;
    this.productionLineService.changeProductionLineStatus(
      this.selectedLine.id,
      newStatus
    )
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (updatedLine) => {
        // Actualizar la línea en la lista
        const index = this.productionLines.findIndex(l => l.id === updatedLine.id);
        if (index >= 0) {
          this.productionLines[index] = updatedLine;
          this.prepareTableData();
        }

        // Actualizar la línea seleccionada
        this.selectedLine = updatedLine;
        this.updateInfoPanel(updatedLine);
      },
      error: (err) => {
        this.error = 'Error al cambiar el estado de la línea de producción.';
        console.error('Error toggling production line status:', err);
      }
    });
  }

  getStatusLabel(status: number): string {
    return status === 1 ?
      this.translate.instant('assetManagement.status.active') :
      this.translate.instant('assetManagement.status.inactive');
  }

  loadPlants() {
    this.plantService.getAll().subscribe({
      next: (plants) => {
        this.plants = plants;
        if (plants.length > 0) {
          this.selectedPlantId = plants[0].id;
          this.loadProductionLines();
        }
      },
      error: (err) => {
        console.error('Error al cargar las plantas:', err);
        this.error = 'Error al cargar las plantas';
      }
    });
  }

  onPlantChange(event: any) {
    this.loadProductionLines();
  }
}
