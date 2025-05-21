import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { InformationPanelComponent } from '../../../shared/components/information-panel/information-panel.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { RecordTableComponent, RecordTableColumn } from '../../../shared/components/record-table/record-table.component';
import { TitleViewComponent } from '../../../shared/components/title-view/title-view.component';
import { InfoSectionComponent } from '../../../shared/components/information-panel/info-section/info-section.component';
import { InfoContainerComponent } from '../../../shared/components/information-panel/info-container/info-container.component';
import { InfoListItemsComponent } from '../../../shared/components/information-panel/info-list-items/info-list-items.component';

import { MaintenancePlanService } from '../services/maintenance-plan.service';
import { MaintenanceDynamicPlanService } from '../services/maintenance-dynamic-plan.service';
import { ChoosePlanTypeModalComponent } from '../components/choose-plan-type/choose-plan-type-modal.component';
import { StaticPlanFormComponent } from '../components/static-plan-creation/static-plan-form/static-plan-form.component';

@Component({
  selector: 'app-maintance-plan',
  imports: [CommonModule, InformationPanelComponent, SearchComponent, RecordTableComponent, TitleViewComponent, InfoSectionComponent, InfoContainerComponent, InfoListItemsComponent, ChoosePlanTypeModalComponent, StaticPlanFormComponent],
  templateUrl: './maintance-plan.component.html',
  styleUrls: ['./maintance-plan.component.scss'],
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
    ])
  ]
})
export class MaintancePlanComponent implements OnInit {
  showChoosePlanModal = false;
  showStaticForm     = false;


  tableColumns: RecordTableColumn[] = [
    { key: 'planId', label: 'ID', type: 'texto' },
    { key: 'planName', label: 'Nombre', type: 'texto' },
    { key: 'productionLineId', label: 'Línea de Producción', type: 'texto'},
    { key: 'startDate', label: 'Fecha Inicio', type: 'texto' },
    { key: 'durationDays', label: 'Duración (días)', type: 'texto' },
    { key: 'actions', label: 'Acciones', type: 'cta', ctaLabel: 'Ver', ctaVariant: 'primary' }
  ];

  plansData: any[] = [];
  filteredPlansData: any[] = [];

  showDetailPanel = false;

  searchFilters = [
    {
      label: 'ID',
      value: 'planId',
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

  selectedPlan: any = null;

  planInfoData: any[] = [];
  planTasksItems: any[] = [];

  constructor(
    private router: Router,
    private maintenancePlanService: MaintenancePlanService,
    private maintenanceDynamicPlanService: MaintenanceDynamicPlanService
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.maintenancePlanService.getAllPlans().subscribe(plans => {
      this.plansData = plans;
      this.filteredPlansData = [...this.plansData];
      
    });
  }

  onRowClick(event: {row: any, column: RecordTableColumn}): void {
    const selectedPlan = event.row;
    this.selectedPlan = selectedPlan;
    
    // Preparar datos para el panel de información
    this.planInfoData = [
      { subtitle: 'ID del Plan', info: selectedPlan.planId },
      { subtitle: 'Línea de Producción', info: selectedPlan.productionLineId },
      { subtitle: 'Fecha de Inicio', info: new Date(selectedPlan.startDate).toLocaleDateString() },
      { subtitle: 'Duración', info: `${selectedPlan.durationDays} días` },
      { subtitle: 'Creado por', info: `ID Usuario: ${selectedPlan.userCreator}` }
    ];
    
    // Preparar lista de tareas
    this.planTasksItems = [];
    if (selectedPlan.items && selectedPlan.items.length > 0) {
      selectedPlan.items.forEach((day: any) => {
        if (day.tasks?.length) {
          day.tasks.forEach((task: any) => {
            this.planTasksItems.push({ model: task.taskName });
          });
        }
      });
    }
    setTimeout(() => {
      this.showDetailPanel = true;
    });
  }
  closeDetailPanel(): void {
    this.showDetailPanel = false;
    this.selectedPlan = null;
  }

  onNewPlanClick(): void {
    this.showChoosePlanModal = true;
  }

  closeChoosePlanModal(): void {
    this.showChoosePlanModal = false;
  }

  onPlanTypeSelect(type: 'dynamic' | 'static'): void {
    this.showChoosePlanModal = false;

    // Aquí decides qué ruta o formulario abrir
    if (type === 'dynamic') {
      this.router.navigate(['/plan-mantenimiento/crear-dinamico']);
    } else {
      this.showStaticForm = true;
    }
  }

  closeStaticForm(): void {
    this.showStaticForm = false;
  }

  onPlanCreated(plan: any): void {
    this.showStaticForm = false;
    this.loadPlans();
  }

  onSearch(searchTerm: string): void {
    this.applyFilters(searchTerm, {});
  }

  onFilterChange(filters: { [key: string]: string }): void {
    this.applyFilters('', filters);
  }


  private applyFilters(searchTerm: string, filterValues: { [key: string]: string }): void {
    this.filteredPlansData = this.plansData.filter(plan => {
      // Filtro búsqueda global
      if (searchTerm) {
        const matchesSearch = Object.keys(plan).some(key => {
          if (key === '_originalData' || key === 'actions') return false;
          return String(plan[key]).toLowerCase().includes(searchTerm.toLowerCase());
        });
        if (!matchesSearch) return false;
      }

      // Filtros específicos
      if (Object.keys(filterValues).length > 0) {
        return Object.keys(filterValues).every(key => {
          const filterValue = filterValues[key];
          if (!filterValue) return true;

          const planValue = String(plan[key]).toLowerCase();
          return planValue === filterValue.toLowerCase();
        });
      }

      return true;
    });
  }
}
