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
import { InteractMachineryComponent } from '../../components/interact-machinery/interact-machinery.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-machinery-asset-view',
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(
    private machineryService: MachineryService,
    private translate: TranslateService
  ) {
    this.newMachineAction = this.newMachineAction.bind(this);
  }

  ngOnInit() {
    this.loadMachineries();
  }

  getStatusText(status: number): string {
    switch (status) {
      case MachineryStatus.INACTIVE: return 'Inactiva';
      case MachineryStatus.ACTIVE: return 'Activa';
      case MachineryStatus.MAINTENANCE: return 'Mantenimiento';
      case MachineryStatus.REPAIR: return 'Reparación';
      default: return 'Desconocido';
    }
  }

  loadMachineries() {
    this.loading = true;
    this.error = null;
    this.machineryService.getAllMachineries().subscribe({
      next: (machines) => {
        this.machines = machines;
        this.displayMachines = this.machines.map(m => ({
          ...m,
          status: this.getStatusText(m.status)
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

    // Actualizar infoData - usando subtitle e info como espera el componente
    this.infoData = [
      { subtitle: 'Estado', info: this.getStatusText(this.selectedMachine.status) },
      { subtitle: 'Línea de Producción', info: `Línea ${this.selectedMachine.productionLineId}` },
      { subtitle: 'Última Mantención', info: new Date(this.selectedMachine.lastMaintenanceDate).toLocaleDateString('es-ES') },
      { subtitle: 'Próxima Mantención', info: new Date(this.selectedMachine.nextMaintenanceDate).toLocaleDateString('es-ES') }
    ];

    // Actualizar techData - usando subtitle e info como espera el componente
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

  saveMachinery(machinery: MachineryEntity) {
    if (this.isEditMode && this.selectedMachine) {
      this.machineryService.updateMachinery(machinery).subscribe({
        next: (updated) => {
          const index = this.machines.findIndex(m => m.id === updated.id);
          if (index !== -1) {
            this.machines[index] = updated;
            this.displayMachines[index] = {
              ...updated,
              status: this.getStatusText(updated.status)
            };
          }
          this.closeModal();
          if (this.selectedMachine?.id === updated.id) {
            this.selectedMachine = updated;
            this.updateSelectedMachineData();
          }
        },
        error: (error) => {
          console.error('Error updating machinery:', error);
        }
      });
    } else {
      this.machineryService.createMachinery(machinery).subscribe({
        next: (created) => {
          this.machines.push(created);
          this.displayMachines.push({
            ...created,
            status: this.getStatusText(created.status)
          });
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating machinery:', error);
        }
      });
    }
  }

  toggleMachineryStatus() {
    if (this.selectedMachine && this.selectedMachineId) {
      const newStatus = this.selectedMachine.status === MachineryStatus.ACTIVE ? 
        MachineryStatus.INACTIVE : 
        MachineryStatus.ACTIVE;
      
      this.machineryService.changeMachineryStatus(this.selectedMachineId, newStatus, 1).subscribe({
        next: (updated) => {
          const index = this.machines.findIndex(m => m.id === updated.id);
          if (index !== -1) {
            this.machines[index] = updated;
            this.displayMachines[index] = {
              ...updated,
              status: this.getStatusText(updated.status)
            };
          }
          this.selectedMachine = updated;
          this.updateSelectedMachineData();
        },
        error: (error) => {
          console.error('Error toggling machinery status:', error);
        }
      });
    }
  }
}
