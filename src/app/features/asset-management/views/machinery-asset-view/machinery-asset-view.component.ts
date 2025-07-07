import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { InteractMachineryComponent } from '../../components/interact-machinery/interact-machinery.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlantService } from '../../services/plant.service';
import { ProductionLineService } from '../../services/production-line.service';
import { PlantEntity } from '../../models/plant.entity';
import { ProductionLineEntity } from '../../models/production-line.entity';

@Component({
  selector: 'app-machinery-asset-view',
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
    InteractMachineryComponent
  ],
  templateUrl: './machinery-asset-view.component.html',
  styleUrl: './machinery-asset-view.component.scss',
  animations: [
    trigger('panelAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.7)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'scale(0.7)', opacity: 0 }))
      ])
    ])
  ]
})
export class MachineryAssetViewComponent implements OnInit {
  machines: MachineryEntity[] = [];
  displayMachines: any[] = [];
  selectedMachine: MachineryEntity | null = null;
  selectedMachineId: number | null = null;
  loading = false;
  error: string | null = null;
  showDetailPanel = false;
  showMachineryModal = false;
  isEditMode = false;

  infoData: any[] = [];
  techData: any[] = [];
  measurementData = [
    { subtitle: 'Temperatura', info: '75°C' },
    { subtitle: 'Presión', info: '2.5 bar' },
    { subtitle: 'Velocidad', info: '1200 rpm' },
    { subtitle: 'Consumo Energético', info: '450 kW/h' }
  ];

  maintenanceItems = [
    {
      title: 'Mantenimiento Preventivo',
      date: '2024-01-15',
      description: 'Cambio de aceite y filtros',
      status: 'Completado'
    },
    {
      title: 'Reparación de Emergencia',
      date: '2023-12-10',
      description: 'Reemplazo de sensor de presión',
      status: 'Completado'
    },
    {
      title: 'Inspección Rutinaria',
      date: '2023-11-20',
      description: 'Verificación de componentes',
      status: 'Completado'
    }
  ];

  columns = [
    { key: 'name', label: 'Nombre', type: 'texto' as const },
    { key: 'serialNumber', label: 'Número de Serie', type: 'texto' as const },
    { key: 'manufacturer', label: 'Fabricante', type: 'texto' as const },
    { key: 'model', label: 'Modelo', type: 'texto' as const },
    { key: 'status', label: 'Estado', type: 'texto' as const },
    {
      key: 'actions',
      label: 'Acciones',
      type: 'cta' as const,
      ctaLabel: 'Ver Detalles',
      ctaVariant: 'primary' as const
    }
  ];

  plants: PlantEntity[] = [];
  productionLines: ProductionLineEntity[] = [];
  selectedPlantId: number | null = null;
  selectedLineId: number | null = null;

  constructor(
    private machineryService: MachineryService,
    private plantService: PlantService,
    private productionLineService: ProductionLineService,
    private translate: TranslateService
  ) {
    this.newMachineAction = this.newMachineAction.bind(this);
  }

  ngOnInit() {
    this.loadPlants();
  }

  loadPlants() {
    this.loading = true;
    this.error = null;
    this.plantService.getAll().subscribe({
      next: (plants) => {
        this.plants = plants;
        if (plants.length > 0) {
          this.selectedPlantId = plants[0].id;
          this.loadProductionLines();
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las plantas';
        this.loading = false;
        console.error('Error loading plants:', error);
      }
    });
  }

  loadProductionLines() {
    if (!this.selectedPlantId) return;

    this.loading = true;
    this.error = null;
    this.productionLineService.getAllProductionLines(this.selectedPlantId).subscribe({
      next: (lines) => {
        this.productionLines = lines;
        if (lines.length > 0) {
          this.selectedLineId = lines[0].id;
          this.loadMachineries();
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las líneas de producción';
        this.loading = false;
        console.error('Error loading production lines:', error);
      }
    });
  }

  onPlantChange() {
    this.selectedLineId = null;
    this.productionLines = [];
    this.machines = [];
    this.displayMachines = [];
    this.loadProductionLines();
  }

  onLineChange() {
    this.machines = [];
    this.displayMachines = [];
    this.loadMachineries();
  }

  getStatusText(status: string): string {
    switch (status) {
      case MachineryStatus.INACTIVE: return 'Inactiva';
      case MachineryStatus.OPERATIONAL: return 'Operativa';
      case MachineryStatus.MAINTENANCE: return 'Mantenimiento';
      case MachineryStatus.REPAIR: return 'Reparación';
      default: return 'Desconocido';
    }
  }

  loadMachineries() {
    if (!this.selectedLineId) return;

    this.loading = true;
    this.error = null;
    this.machineryService.getAllMachineries(this.selectedLineId).subscribe({
      next: (machines) => {
        this.machines = machines;
        this.displayMachines = machines.map(m => ({
          ...m,
          status: m.status
        }));
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las maquinarias';
        this.loading = false;
        console.error('Error loading machineries:', error);
      }
    });
  }

  updateSelectedMachineData() {
    if (!this.selectedMachine) return;

    this.infoData = [
      { subtitle: 'Estado', info: this.getStatusText(this.selectedMachine.status) },
      { subtitle: 'Línea de Producción', info: `Línea ${this.selectedMachine.productionLineId || 'No asignada'}` },
      { subtitle: 'Última Mantención', info: this.selectedMachine.lastMaintenanceDate ?
          new Date(this.selectedMachine.lastMaintenanceDate).toLocaleDateString('es-ES') : 'No disponible' },
      { subtitle: 'Próxima Mantención', info: this.selectedMachine.nextMaintenanceDate ?
          new Date(this.selectedMachine.nextMaintenanceDate).toLocaleDateString('es-ES') : 'No disponible' }
    ];

    this.techData = [
      { subtitle: 'Número de Serie', info: this.selectedMachine.serialNumber },
      { subtitle: 'Fabricante', info: this.selectedMachine.manufacturer },
      { subtitle: 'Modelo', info: this.selectedMachine.model },
      { subtitle: 'Tipo', info: this.selectedMachine.type },
      { subtitle: 'Consumo de Energía', info: `${this.selectedMachine.powerConsumption} kW` }
    ];
  }

  onCtaClick(event: { row: any; column: any }) {
    const machine = this.machines.find(m => m.id === event.row.id);
    if (machine) {
      this.selectedMachine = machine;
      this.selectedMachineId = machine.id;
      this.updateSelectedMachineData();
      console.log(this.infoData);
      this.showDetailPanel = true;
    }
  }

  closeDetailPanel() {
    this.showDetailPanel = false;
    this.selectedMachine = null;
    this.selectedMachineId = null;
    this.infoData = [];
    this.techData = [];
  }

  newMachineAction() {
    this.isEditMode = false;
    this.showMachineryModal = true;
  }

  editMachine() {
    if (this.selectedMachine) {
      this.isEditMode = true;
      this.showMachineryModal = true;
    }
  }

  closeModal() {
    this.showMachineryModal = false;
  }

  saveMachinery(machinery: Partial<MachineryEntity>) {
    this.loading = true;

    // Crear la maquinaria
    this.machineryService.createMachinery(machinery).pipe(
      finalize(() => {
        this.loading = false;
        this.showMachineryModal = false;
      })
    ).subscribe({
      next: (created) => {
        // Si hay una línea de producción seleccionada, asignar la maquinaria
        if (this.selectedLineId) {
          this.machineryService.assignToProductionLine(created.id, this.selectedLineId)
            .subscribe({
              next: (assigned) => {
                this.machines.push(assigned);
                this.displayMachines.push({
                  ...assigned,
                  status: assigned.status
                });
              },
              error: (error) => {
                console.error('Error assigning machinery:', error);
                // Aún así mostramos la maquinaria creada
                this.machines.push(created);
                this.displayMachines.push({
                  ...created,
                  status: created.status
                });
              }
            });
        } else {
          this.machines.push(created);
          this.displayMachines.push({
            ...created,
            status: created.status
          });
        }
      },
      error: (error) => {
        console.error('Error creating machinery:', error);
        this.error = 'Error al crear la maquinaria';
      }
    });
  }

  toggleMachineryStatus() {
    // Eliminado ya que no está disponible en el API
    console.warn('Función toggleMachineryStatus no implementada en el API');
  }
}
