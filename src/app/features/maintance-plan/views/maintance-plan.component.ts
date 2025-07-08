import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InformationPanelComponent } from '../../../shared/components/information-panel/information-panel.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { RecordTableComponent, RecordTableColumn } from '../../../shared/components/record-table/record-table.component';
import { TitleViewComponent } from '../../../shared/components/title-view/title-view.component';
import { InfoSectionComponent } from '../../../shared/components/information-panel/info-section/info-section.component';
import { InfoContainerComponent } from '../../../shared/components/information-panel/info-container/info-container.component';
import { InfoListItemsComponent } from '../../../shared/components/information-panel/info-list-items/info-list-items.component';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { trigger, transition, style, animate } from '@angular/animations';
import { MaintenancePlanDetailComponent } from '../components/maintenance-plan-detail/maintenance-plan-detail.component';
import { MaintenanceDynamicPlan } from '../model/maintenance-dynamic-plan.model';
import { MaintenancePlanService } from '../services/maintenance-plan.service';

@Component({
  selector: 'app-maintance-plan',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    InformationPanelComponent,
    SearchComponent,
    RecordTableComponent,
    TitleViewComponent,
    InfoSectionComponent,
    InfoContainerComponent,
    InfoListItemsComponent,
    MaintenancePlanDetailComponent
  ],
  templateUrl: './maintance-plan.component.html',
  styleUrls: ['./maintance-plan.component.scss'],
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
export class MaintancePlanComponent implements OnInit {
  // Columnas para la tabla de planes
  tableColumns: RecordTableColumn[] = [
    { key: 'id', label: 'ID', type: 'texto' },
    { key: 'name', label: 'Nombre', type: 'texto' },
    { key: 'startDate', label: 'Fecha Inicio', type: 'texto' },
    { key: 'endDate', label: 'Fecha Fin', type: 'texto' },
    { key: 'metricDefinitionId', label: 'Métrica', type: 'texto' },
    { key: 'threshold', label: 'Umbral', type: 'texto' },
    { key: 'actions', label: 'Acciones', type: 'cta', ctaLabel: 'Ver', ctaVariant: 'primary' }
  ];

  // Datos para la tabla
  plansData: any[] = [];
  filteredPlansData: any[] = [];
  
  // Flag para mostrar/ocultar el panel de información
  showDetailPanel = false;
  
  // Configuración de filtros para el componente app-search
  searchFilters = [
    {
      label: 'ID',
      value: 'id',
      options: [
        { label: 'Todos', value: '' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' }
      ]
    },
    {
      label: 'Línea de Producción',
      value: 'productionLineId',
      options: [
        { label: 'Todas', value: '' },
        { label: 'Línea 1', value: '1' },
        { label: 'Línea 2', value: '2' }
      ]
    },
    {
      label: 'Duración (días)',
      value: 'durationDays',
      options: [
        { label: 'Todas', value: '' },
        { label: '1 día', value: '1' },
        { label: '2 días', value: '2' },
        { label: '3 días', value: '3' }
      ]
    }
  ];
  
  // Plan seleccionado para mostrar en el panel de información
  selectedPlan: any = null;
  
  // Datos para el panel de información
  planInfoData: any[] = [];
  planTasksItems: any[] = [];

  // Nueva propiedad para controlar la visibilidad del modal
  showCreateModal = false;

  constructor(private maintenancePlanService: MaintenancePlanService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.maintenancePlanService.getAllDynamicPlans().subscribe({
      next: (plans: MaintenanceDynamicPlan[]) => {
        this.plansData = plans.map(plan => ({
          id: plan.id,
          name: plan.name,
          startDate: new Date(plan.startDate).toLocaleDateString(),
          endDate: new Date(plan.endDate).toLocaleDateString(),
          metricDefinitionId: plan.metricDefinitionId,
          threshold: plan.threshold,
          _originalData: plan
        }));
        this.filteredPlansData = [...this.plansData];
      },
      error: (err) => console.error('Error al cargar planes dinámicos', err)
    });
  }

  onRowClick(event: {row: any, column: RecordTableColumn}): void {
    const selectedPlan: MaintenanceDynamicPlan = event.row._originalData;
    this.selectedPlan = selectedPlan;

    this.planInfoData = [
      { subtitle: 'ID', info: selectedPlan.id },
      { subtitle: 'Nombre', info: selectedPlan.name },
      { subtitle: 'Fecha de Inicio', info: new Date(selectedPlan.startDate).toLocaleDateString() },
      { subtitle: 'Fecha Fin', info: new Date(selectedPlan.endDate).toLocaleDateString() },
      { subtitle: 'Métrica', info: selectedPlan.metricDefinitionId },
      { subtitle: 'Umbral', info: selectedPlan.threshold }
    ];

    this.planTasksItems = selectedPlan.tasks?.map((task: any) => ({ model: task.name || task.taskName })) || [];

    this.showDetailPanel = true;
  }

  closeDetailPanel(): void {
    this.showDetailPanel = false;
    this.selectedPlan = null;
  }

  onNewPlanClick(): void {
    console.log('Abriendo modal de nuevo plan');
    this.showCreateModal = true;
  }

  onSavePlan(plan: MaintenanceDynamicPlan): void {
    this.showCreateModal = false;
    this.loadPlans(); // Recargar la lista de planes
  }

  onCancelPlan(): void {
    console.log('Cancelando creación de plan');
    this.showCreateModal = false;
  }

  // Método para filtrar por búsqueda global
  onSearch(searchTerm: string): void {
    this.applyFilters(searchTerm, {});
  }
  
  // Método para manejar cambios en filtros
  onFilterChange(filters: { [key: string]: string }): void {
    this.applyFilters('', filters);
  }
  
  // Método unificado para aplicar filtros y búsqueda
  private applyFilters(searchTerm: string, filterValues: { [key: string]: string }): void {
    this.filteredPlansData = this.plansData.filter(plan => {
      // Aplicar filtro de búsqueda global si existe
      if (searchTerm) {
        const matchesSearch = Object.keys(plan).some(key => {
          if (key === '_originalData' || key === 'actions') return false;
          return String(plan[key]).toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        if (!matchesSearch) return false;
      }
      
      // Aplicar filtros específicos por columna
      if (Object.keys(filterValues).length > 0) {
        return Object.keys(filterValues).every(key => {
          const filterValue = filterValues[key];
          if (!filterValue) return true; // Si no hay valor de filtro, no filtrar por este campo
          
          const planValue = String(plan[key]).toLowerCase();
          return planValue === filterValue.toLowerCase();
        });
      }
      
      return true;
    });
  }
} 