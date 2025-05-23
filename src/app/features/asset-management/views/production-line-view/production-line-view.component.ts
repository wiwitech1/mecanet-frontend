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

@Component({
  selector: 'app-production-line-view',
  standalone: true,
  imports: [
    CommonModule,
    InformationPanelComponent,
    SearchComponent,
    RecordTableComponent,
    TitleViewComponent,
    InfoSectionComponent,
    InfoListItemsComponent,
    InfoContainerComponent,
    InteractProductionLineComponent
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
    { key: 'id', label: 'ID', type: 'texto' as 'texto' },
    { key: 'name', label: 'Nombre', type: 'texto' as 'texto' },
    { key: 'plantName', label: 'Planta', type: 'texto' as 'texto' },
    { key: 'capacity', label: 'Capacidad', type: 'texto' as 'texto' },
    { key: 'status', label: 'Estado', type: 'texto' as 'texto' },
    { key: 'machineryCount', label: 'Nº Maquinarias', type: 'texto' as 'texto' },
    { key: 'details', label: 'Detalles', type: 'cta' as 'cta', ctaLabel: 'Ver' }
  ];
  
  // Datos adaptados para la tabla
  lines: any[] = [];
  
  // Datos para el panel de información
  infoData: {subtitle: string, info: string}[] = [];
  
  // Especificaciones técnicas
  techData: {subtitle: string, info: string}[] = [];
  
  // Maquinarias asignadas a la línea
  assignedMachines: {name: string, model: string, brand: string}[] = [];
  
  constructor(private productionLineService: ProductionLineService) {}
  
  ngOnInit() {
    this.loadProductionLines();
  }
  
  loadProductionLines() {
    this.loading = true;
    this.error = null;
    
    this.productionLineService.getAllProductionLines()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.productionLines = data;
          this.prepareTableData();
        },
        error: (err) => {
          this.error = 'Error al cargar las líneas de producción. Por favor, intente de nuevo.';
          console.error('Error loading production lines:', err);
        }
      });
  }
  
  prepareTableData() {
    this.lines = this.productionLines.map(line => ({
      id: line.id,
      name: line.name,
      plantName: this.getPlantName(line.plantId),
      capacity: `${line.capacity} unidades/hora`,
      status: this.getStatusText(line.status),
      machineryCount: line.machineries?.length || 0,
      details: line.id, // Pasamos el ID como valor para el botón CTA
      // Guardamos el objeto original para tenerlo accesible
      original: line
    }));
  }
  
  getPlantName(plantId: number): string {
    // Aquí podrías tener un servicio para obtener el nombre real
    return plantId === 1 ? 'Planta Principal' : 'Planta Secundaria';
  }
  
  getStatusText(status: number): string {
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
      { subtitle: 'Capacidad', info: `${line.capacity} unidades/hora` },
      { subtitle: 'Fecha creación', info: this.formatDate(line.createdAt) },
      { subtitle: 'Última actualización', info: this.formatDate(line.updatedAt) }
    ];
    
    // Especificaciones técnicas
    this.techData = [
      { subtitle: 'Descripción', info: line.description }
    ];
    
    // Maquinarias asignadas
    this.assignedMachines = line.machineries.map(machine => ({
      name: machine.name,
      model: machine.model,
      brand: machine.brand
    }));
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
      // Obtener maquinarias asignadas por IDs
      const updatedLine: ProductionLineEntity = {
        ...this.selectedLine,
        name: lineData.name,
        plantId: lineData.plant_id,
        capacity: lineData.capacity,
        description: lineData.description,
        status: lineData.status,
        // No actualizamos machineries directamente aquí, se maneja a través de IDs
      };
      
      this.productionLineService.updateProductionLine(updatedLine)
        .pipe(finalize(() => {
          this.loading = false;
          this.showLineModal = false;
        }))
        .subscribe({
          next: (updated) => {
            // Actualiza la lista y el panel de detalles
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
      // Lógica para crear una nueva línea de producción
      const newLine: ProductionLineEntity = {
        id: 0,
        name: lineData.name,
        plantId: lineData.plant_id,
        capacity: lineData.capacity,
        description: lineData.description,
        status: 1, // Activa por defecto
        createdAt: new Date(),
        updatedAt: new Date(),
        machineries: [] // Se asignarán después
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
}