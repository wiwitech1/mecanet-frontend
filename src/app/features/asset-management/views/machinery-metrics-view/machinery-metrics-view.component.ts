import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MachineryService } from '../../services/machinery.service';
import { MachineryEntity } from '../../models/machinery.entity';
import { MachineryMeasurementEntity } from '../../models/measurement.entity';
import { MachineMetricService } from '../../services/machine-metric.service';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { NotificationsContainerComponent } from '../../../../shared/components/notifications-container/notifications-container.component';

interface MeasurementUpdateData {
  machineryId: number;
  measurementId: number;
  newValue: number;
  measurementName: string;
  machineryName: string;
}

@Component({
  selector: 'app-machinery-metrics-view',
  templateUrl: './machinery-metrics-view.component.html',
  styleUrls: ['./machinery-metrics-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TitleViewComponent,
    SearchComponent,
    ButtonComponent,
    NotificationsContainerComponent
  ]
})
export class MachineryMetricsViewComponent implements OnInit {
  machineries: MachineryEntity[] = [];
  filteredMachineries: MachineryEntity[] = [];
  searchTerm = '';
  loading = false;
  error: string | null = null;

  // Valores temporales para los inputs de measurements
  measurementValues: { [machineryId: number]: { [measurementId: number]: number } } = {};

  // Función para el componente de búsqueda
  loadMachineriesFunction = () => {
    this.loadMachineries();
  };

  constructor(
    private machineryService: MachineryService,
    private machineMetricService: MachineMetricService
  ) {}

  ngOnInit() {
    this.loadMachineries();
    this.loadMachineMetrics();
  }

  loadMachineMetrics() {
    console.log('Cargando métricas de maquinaria...');
    
    this.machineMetricService.getMetricsForMachine().subscribe({
      next: (metrics) => {
        console.log('Métricas obtenidas:', metrics);
      },
      error: (error) => {
        console.error('Error al obtener métricas:', error);
      }
    });
  }

  async loadMachineries() {
    this.loading = true;
    this.error = null;
    
    try {
      this.machineryService.getAllMachineriesWithMeasurements().subscribe({
        next: (machineries) => {
          this.machineries = machineries;
          this.filteredMachineries = machineries;
          this.initializeMeasurementValues();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar las maquinarias';
          console.error('Error loading machineries:', error);
          this.loading = false;
        }
      });
    } catch (error) {
      this.error = 'Error al cargar las maquinarias';
      console.error('Error loading machineries:', error);
      this.loading = false;
    }
  }

  initializeMeasurementValues() {
    this.machineries.forEach(machinery => {
      this.measurementValues[machinery.id] = {};
      machinery.measurements?.forEach(measurement => {
        this.measurementValues[machinery.id][measurement.id] = 0;
      });
    });
  }

  handleSearch(term: string) {
    this.searchTerm = term;
    this.filterMachineries();
  }

  handleFilterChange(filters: Record<string, string>) {
    // Por ahora no se implementan filtros adicionales
    this.filterMachineries();
  }

  private filterMachineries() {
    if (!this.searchTerm.trim()) {
      this.filteredMachineries = [...this.machineries];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredMachineries = this.machineries.filter(machinery =>
        machinery.name.toLowerCase().includes(searchLower) ||
        machinery.model.toLowerCase().includes(searchLower) ||
        machinery.brand.toLowerCase().includes(searchLower)
      );
    }
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  isButtonDisabled(machineryId: number, measurementId: number): boolean {
    const value = this.measurementValues[machineryId]?.[measurementId];
    return !value || value <= 0;
  }

  onMeasurementValueChange(machineryId: number, measurementId: number, value: string) {
    const numericValue = parseFloat(value) || 0;
    if (!this.measurementValues[machineryId]) {
      this.measurementValues[machineryId] = {};
    }
    this.measurementValues[machineryId][measurementId] = numericValue;
  }

  onUpdateMeasurement(machineryId: number, measurementId: number) {
    const machinery = this.machineries.find(m => m.id === machineryId);
    const measurement = machinery?.measurements?.find(m => m.id === measurementId);
    
    if (!machinery || !measurement) {
      console.error('Maquinaria o measurement no encontrado');
      return;
    }

    const newValue = this.measurementValues[machineryId]?.[measurementId];
    
    if (newValue === undefined || newValue === null || newValue <= 0) {
      console.error('Valor no válido');
      return;
    }

    // Por ahora solo mostramos en consola, la funcionalidad real se implementará después
    console.log('Actualizando measurement:', {
      machineryId,
      machineryName: machinery.name,
      measurementId,
      measurementName: measurement.name,
      currentValue: measurement.value,
      newValue: newValue
    });

    // Aquí se llamaría al servicio para actualizar el measurement
    // this.machineryService.updateMachineryMeasurement(machineryId, measurementId, newValue)
    //   .subscribe({...});
    
    // Resetear el valor del input
    this.measurementValues[machineryId][measurementId] = 0;
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Inactiva';
      case 1: return 'Activa';
      case 2: return 'Mantenimiento';
      case 3: return 'Reparación';
      default: return 'Desconocido';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-inactive';
      case 1: return 'status-active';
      case 2: return 'status-maintenance';
      case 3: return 'status-repair';
      default: return 'status-unknown';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }
} 