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
import { MachineryService } from '../../services/machinery.service';
import { MachineryEntity, MachineryStatus } from '../../models/machinery.entity';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-machinery-asset-view',
  standalone: true,
  imports: [
    CommonModule,
    InformationPanelComponent,
    SearchComponent,
    RecordTableComponent,
    TitleViewComponent,
    InfoSectionComponent,
    InfoListItemsComponent,
    InfoContainerComponent
  ],
  templateUrl: './machinery-asset-view.component.html',
  styleUrl: './machinery-asset-view.component.scss',
  animations: [
    trigger('panelAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class MachineryAssetViewComponent implements OnInit {
  selectedMachineId: number | null = null;
  selectedMachine: MachineryEntity | null = null;
  showDetailPanel = false; // Nueva variable para controlar la visibilidad del panel
  
  // Datos reales que vendrán del servicio
  machineries: MachineryEntity[] = [];
  loading = false;
  error: string | null = null;
  
  // Columnas para la tabla
  columns = [
    { key: 'id', label: 'ID', type: 'texto' as 'texto' },
    { key: 'name', label: 'Nombre', type: 'texto' as 'texto' },
    { key: 'model', label: 'Modelo', type: 'texto' as 'texto' },
    { key: 'brand', label: 'Marca', type: 'texto' as 'texto' },
    { key: 'status', label: 'Estado', type: 'texto' as 'texto' },
    { key: 'lastMaintenance', label: 'Último mantenimiento', type: 'texto' as 'texto' },
    { key: 'details', label: 'Detalles', type: 'cta' as 'cta', ctaLabel: 'Ver' } // Cambiado a tipo cta
  ];
  
  // Datos adaptados para la tabla
  machines: any[] = [];
  
  // Datos técnicos para mostrar en el panel de información
  infoData: {subtitle: string, info: string}[] = [];
  
  // Especificaciones técnicas
  techData: {subtitle: string, info: string}[] = [];
  
  // Historial de mantenimiento
  maintenanceItems: {date: string, type: string, responsible: string}[] = [];
  
  // Medidas
  measurementData: {subtitle: string, info: string}[] = [];
  
  constructor(private machineryService: MachineryService) {}
  
  ngOnInit() {
    this.loadMachineries();
  }
  
  loadMachineries() {
    this.loading = true;
    this.error = null;
    
    this.machineryService.getAllMachineries()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.machineries = data;
          this.prepareTableData();
          console.log(this.machineries);
          // No seleccionamos ninguna maquinaria por defecto ahora
        },
        error: (err) => {
          this.error = 'Error al cargar las maquinarias. Por favor, intente de nuevo.';
          console.error('Error loading machineries:', err);
        }
      });
  }
  
  prepareTableData() {
    this.machines = this.machineries.map(machinery => ({
      id: machinery.id,
      name: machinery.name,
      model: machinery.model,
      brand: machinery.brand,
      status: this.getStatusText(machinery.status),
      lastMaintenance: this.formatDate(machinery.updatedAt),
      details: machinery.id, // Pasamos el ID como valor para el botón CTA
      // Guardamos el objeto original para tenerlo accesible
      original: machinery
    }));
  }
  
  getStatusText(status: number): string {
    switch(status) {
      case MachineryStatus.ACTIVE: return 'Activo';
      case MachineryStatus.INACTIVE: return 'Inactivo';
      case MachineryStatus.MAINTENANCE: return 'En mantenimiento';
      case MachineryStatus.REPAIR: return 'En reparación';
      default: return 'Desconocido';
    }
  }
  
  formatDate(date: Date): string {
    return date ? new Date(date).toLocaleDateString('es-ES') : '';
  }
  
  selectMachinery(id: number) {
    this.loading = true;
    this.machineryService.getMachineryById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (machinery) => {
          this.selectedMachine = machinery;
          this.selectedMachineId = machinery.id;
          this.updateInfoPanel(machinery);
          this.showDetailPanel = true; // Mostramos el panel al seleccionar una maquinaria
        },
        error: (err) => {
          this.error = `Error al cargar la maquinaria con ID ${id}.`;
          console.error('Error loading machinery details:', err);
          this.showDetailPanel = false; // Ocultamos el panel si hay error
        }
      });
  }
  
  updateInfoPanel(machinery: MachineryEntity) {
    // Información básica
    this.infoData = [
      { subtitle: 'Nombre', info: machinery.name },
      { subtitle: 'Modelo', info: machinery.model },
      { subtitle: 'Estado actual', info: this.getStatusText(machinery.status) },
      { subtitle: 'Marca', info: machinery.brand },
      { subtitle: 'Número de serie', info: machinery.serialNumber },
      { subtitle: 'Fecha actualización', info: this.formatDate(machinery.updatedAt) }
    ];
    
    // Especificaciones técnicas
    this.techData = [
      { subtitle: 'Capacidad de producción', info: `${machinery.productionCapacity} unidades/hora` },
      { subtitle: 'Recomendaciones', info: machinery.recommendations }
    ];
    
    // Historial de mantenimiento
    this.maintenanceItems = [
      { 
        date: this.formatDate(new Date(machinery.createdAt)), 
        type: 'Preventivo', 
        responsible: 'Técnico Asignado' 
      },
      { 
        date: this.formatDate(machinery.updatedAt), 
        type: 'Correctivo', 
        responsible: 'Supervisor' 
      }
    ];

    // Medidas
    this.measurementData = machinery.measurements.map(measurement => ({
      subtitle: measurement.name,
      info: `${measurement.value} ${measurement.unit}`
    }));
  }
  
  onCtaClick(event: {row: any, column: any}) {
    if (event.column.key === 'details' && event.row && event.row.id) {
      this.selectMachinery(event.row.id);
    }
  }
  
  closeDetailPanel() {
    this.showDetailPanel = false;
    this.selectedMachine = null;
    this.selectedMachineId = null;
  }
  
  // Para el botón Nueva Máquina
  newMachineAction = () => {
    // Aquí iría la lógica para abrir un formulario/modal
    console.log('Acción: Crear nueva máquina');
  };
  
  // Activar/Desactivar máquina
  toggleMachineryStatus() {
    if (!this.selectedMachine) return;
    
    const newStatus = this.selectedMachine.status === MachineryStatus.ACTIVE 
      ? MachineryStatus.INACTIVE 
      : MachineryStatus.ACTIVE;
    
    this.loading = true;
    this.machineryService.changeMachineryStatus(
      this.selectedMachine.id, 
      newStatus,
      1 // Hardcoded userUpdaterId por ahora
    )
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (updatedMachinery) => {
        // Actualizar la máquina en la lista
        const index = this.machineries.findIndex(m => m.id === updatedMachinery.id);
        if (index >= 0) {
          this.machineries[index] = updatedMachinery;
          this.prepareTableData();
        }
        
        // Actualizar la máquina seleccionada
        this.selectedMachine = updatedMachinery;
        this.updateInfoPanel(updatedMachinery);
      },
      error: (err) => {
        this.error = 'Error al cambiar el estado de la maquinaria.';
        console.error('Error toggling machinery status:', err);
      }
    });
  }
}
