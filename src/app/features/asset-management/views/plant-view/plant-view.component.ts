import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { RecordTableComponent, RecordTableColumn } from '../../../../shared/components/record-table/record-table.component';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { InfoSectionComponent } from '../../../../shared/components/information-panel/info-section/info-section.component';
import { InfoContainerComponent } from '../../../../shared/components/information-panel/info-container/info-container.component';
import { InfoListItemsComponent } from '../../../../shared/components/information-panel/info-list-items/info-list-items.component';
import { InteractPlantComponent } from '../../components/interact-plant/interact-plant.component';

import { PlantService } from '../../services/plant.service';
import { PlantEntity, PlantStatus } from '../../models/plant.entity';
import { ProductionLineService } from '../../services/production-line.service';
import { ProductionLineEntity } from '../../models/production-line.entity';

@Component({
  selector: 'app-plant-view',
  standalone: true,
  imports: [
    CommonModule,
    TitleViewComponent,
    SearchComponent,
    RecordTableComponent,
    InformationPanelComponent,
    InfoSectionComponent,
    InfoContainerComponent,
    InfoListItemsComponent,
    InteractPlantComponent
  ],
  templateUrl: './plant-view.component.html',
  styleUrls: ['./plant-view.component.scss'],
  animations: [
    trigger('panelAnimation', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in')
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
export class PlantViewComponent implements OnInit, OnDestroy {
  // Estado de la vista
  plants: PlantEntity[] = [];
  filteredPlants: PlantEntity[] = [];
  selectedPlant: PlantEntity | null = null;
  selectedPlantId: number | null = null;
  loading = true;
  error: string | null = null;
  searchTerm = '';

  // Estado de la interfaz
  showDetailPanel = false;
  showCreateModal = false;
  showEditModal = false;

  // Configuración tabla
  tableColumns: RecordTableColumn[] = [
    { key: 'id', label: 'ID', type: 'texto' },
    { key: 'name', label: 'Nombre', type: 'texto' },
    { key: 'location', label: 'Ubicación', type: 'texto' },
    { key: 'capacity', label: 'Capacidad', type: 'texto' },
    { key: 'status', label: 'Estado', type: 'texto' },
    { key: 'actions', label: 'Acciones', type: 'cta', ctaLabel: 'Ver', ctaVariant: 'primary' }
  ];

  tableActions = [
    { name: 'Ver detalles', icon: 'visibility' },
    { name: 'Editar', icon: 'edit' }
  ];

  // Datos del panel de información
  infoData: any[] = [];
  productionLinesItems: any[] = [];

  private destroy$ = new Subject<void>();

  showPlantModal = false;
  isEditMode = false;

  allProductionLines: ProductionLineEntity[] = [];

  constructor(
    private plantService: PlantService,
    private router: Router,
    private productionLineService: ProductionLineService
  ) {}

  ngOnInit(): void {
    this.loadPlants();
    this.loadProductionLines();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Carga de datos
  loadPlants(): void {
    this.loading = true;
    this.error = null;

    this.plantService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plants) => {
          this.plants = plants;
          this.filteredPlants = [...plants];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar plantas:', err);
          this.loading = false;
          this.error = 'Error al cargar plantas';
        }
      });
  }

  loadProductionLines() {
    this.productionLineService.getAllProductionLines().subscribe({
      next: (lines) => {
        this.allProductionLines = lines;
      },
      error: (err) => {
        console.error('Error al cargar líneas de producción:', err);
      }
    });
  }

  // Acciones del usuario
  onSearch(event: string): void {
    this.searchTerm = event;
    this.filteredPlants = this.plants.filter(plant =>
      plant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      plant.id.toString().includes(this.searchTerm)
    );
  }

  onTableAction(event: { row: any, column: RecordTableColumn }): void {
    const { row, column } = event;

    if (column.key === 'actions') {
      this.showPlantDetails(row.id);
    }
  }

  showPlantDetails(plantId: number): void {
    this.selectedPlantId = plantId;
    this.loading = true;

    this.plantService.getById(plantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plant) => {
          this.selectedPlant = plant;
          this.prepareInfoPanelData();
          this.showDetailPanel = true;
          this.loading = false;
        },
        error: (err) => {
          console.error(`Error al cargar la planta ${plantId}:`, err);
          this.loading = false;
          this.error = 'Error al cargar la planta';
        }
      });
  }

  prepareInfoPanelData(): void {
    if (!this.selectedPlant) return;

    this.infoData = [
      { label: 'ID', value: this.selectedPlant.id },
      { label: 'Nombre', value: this.selectedPlant.name },
      { label: 'Ubicación', value: this.selectedPlant.location },
      { label: 'Capacidad', value: `${this.selectedPlant.capacity} unidades` },
      { label: 'Estado', value: this.getStatusLabel(this.selectedPlant.status) },
      { label: 'Creado', value: this.selectedPlant.createdAt.toLocaleDateString() },
      { label: 'Última actualización', value: this.selectedPlant.updatedAt.toLocaleDateString() }
    ];

    // Preparamos los datos de las líneas de producción para el panel
    this.productionLinesItems = this.selectedPlant.productionLines.map(line => ({
      id: line.id,
      title: line.name,
      subtitle: `Capacidad: ${line.capacity} unidades`,
      status: this.getProductionLineStatusLabel(line.status),
      date: new Date(line.updatedAt).toLocaleDateString()
    }));
  }

  // Gestión de modales
  showCreatePlantModal = () => {
    this.showCreateModal = true;
  }

  showEditPlantModal(plantId: number): void {
    this.plantService.getById(plantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plant) => {
          this.selectedPlant = plant;
          this.showEditModal = true;
        },
        error: (err) => {
          console.error(`Error al cargar la planta ${plantId} para editar:`, err);
        }
      });
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  closeDetailPanel(): void {
    this.showDetailPanel = false;
    this.selectedPlant = null;
    this.selectedPlantId = null;
  }

  // Método para manejar el guardado de la planta
  onSavePlant(plantData: Partial<PlantEntity>): void {
    if (this.isEditMode && this.selectedPlant) {
      this.updatePlant(plantData);
    } else {
      this.savePlant(plantData);
    }
    this.closeModal();
  }

  // Método para crear una nueva planta
  savePlant(plantData: Partial<PlantEntity>): void {
    this.loading = true;
    this.error = null;

    this.plantService.create(plantData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newPlant) => {
          this.plants = [...this.plants, newPlant];
          this.filteredPlants = [...this.plants];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al crear la planta:', err);
          this.loading = false;
          this.error = 'Error al crear la planta';
        }
      });
  }

  // Método para actualizar una planta existente
  updatePlant(plantData: Partial<PlantEntity>): void {
    if (!plantData.id) return;

    this.loading = true;
    this.error = null;

    this.plantService.update(plantData.id, plantData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedPlant) => {
          this.plants = this.plants.map(p =>
            p.id === updatedPlant.id ? updatedPlant : p
          );
          this.filteredPlants = [...this.plants];

          if (this.selectedPlantId === updatedPlant.id) {
            this.selectedPlant = updatedPlant;
            this.prepareInfoPanelData();
          }

          this.loading = false;
        },
        error: (err) => {
          console.error(`Error al actualizar la planta ${plantData.id}:`, err);
          this.loading = false;
          this.error = 'Error al actualizar la planta';
        }
      });
  }

  togglePlantStatus(): void {
    if (!this.selectedPlant || this.selectedPlantId === null) return;

    const newStatus = this.selectedPlant.status === PlantStatus.ACTIVE
      ? PlantStatus.INACTIVE
      : PlantStatus.ACTIVE;

    const plantToUpdate: Partial<PlantEntity> = {
      id: this.selectedPlantId,
      status: newStatus
    };

    this.updatePlant(plantToUpdate);
  }

  // Utilidades
  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'Activa';
      case 0: return 'Inactiva';
      case 2: return 'En mantenimiento';
      default: return 'Desconocido';
    }
  }

  getProductionLineStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'Activa';
      case 0: return 'Inactiva';
      case 2: return 'En mantenimiento';
      default: return 'Desconocido';
    }
  }

  // Para el botón Nueva Planta
  newPlantAction = () => {
    this.isEditMode = false;
    this.showPlantModal = true;
  };

  // Para editar planta existente
  editPlant() {
    this.isEditMode = true;
    this.showPlantModal = true;
  }

  // Cerrar el modal
  closeModal() {
    this.showPlantModal = false;
  }
}