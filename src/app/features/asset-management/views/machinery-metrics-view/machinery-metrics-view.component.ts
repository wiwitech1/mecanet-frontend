import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MachineryService } from '../../services/machinery.service';
import { MachineryEntity, MachineryStatus } from '../../models/machinery.entity';
import { MachineryMeasurementEntity } from '../../models/measurement.entity';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { NotificationsContainerComponent } from '../../../../shared/components/notifications-container/notifications-container.component';
import { MetricService } from '../../../metrics/services/metric.service';
import { Metric } from '../../../metrics/models/metric.entity';
import { MachineMetricReadingService } from '../../services/machine-metric-reading.service';
import { NotificationsService } from '../../../../shared/components/notifications-container/notifications.service';
import { MachineMetricEntity } from '../../models/machine-metric.entity';

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

  // --- NUEVAS PROPIEDADES ---
  selectedMachineryId: number | null = null;
  selectedMachinery: MachineryEntity | null = null;

  metrics: Metric[] = [];
  selectedMetricId: number | null = null;
  metricValue: number | null = null;

  // Control de vista posterior al registro
  machineDetail: MachineryEntity | null = null;
  showMachineDetail = false;
  machineMetrics: MachineMetricEntity[] = []; // Actualizado el tipo
  // --- FIN NUEVAS PROPIEDADES ---

  // Función para el botón de recargar
  loadMachineriesFunction = () => {
    this.loadMachineries();
  };

  constructor(
    private machineryService: MachineryService,
    private metricService: MetricService,
    private machineMetricReadingService: MachineMetricReadingService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.loadMachineries();
    this.loadMetrics();
  }

  loadMachineries() {
    this.loading = true;
    this.error = null;
    this.machineryService.getAlllMachineries().subscribe({
      next: (machineries) => {
        this.machineries = machineries;
        this.filteredMachineries = machineries;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar las maquinarias';
        this.loading = false;
        console.error('Error loading machineries:', error);
      }
    });
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

  getStatusText(status: string): string {
    switch (status) {
      case MachineryStatus.INACTIVE: return 'Inactiva';
      case MachineryStatus.OPERATIONAL: return 'Operativa';
      case MachineryStatus.MAINTENANCE: return 'Mantenimiento';
      case MachineryStatus.REPAIR: return 'Reparación';
      default: return 'Desconocido';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case MachineryStatus.INACTIVE: return 'status-inactive';
      case MachineryStatus.OPERATIONAL: return 'status-active';
      case MachineryStatus.MAINTENANCE: return 'status-maintenance';
      case MachineryStatus.REPAIR: return 'status-repair';
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

  onUpdateMeasurement(machineryId: number, measurementId: number) {
    const newValue = this.measurementValues[machineryId]?.[measurementId];
    if (newValue === undefined) return;

    const machinery = this.machineries.find(m => m.id === machineryId);
    const measurement = machinery?.measurements?.find(m => m.id === measurementId);

    if (!machinery || !measurement) return;

    this.machineryService.updateMachineryMeasurement(machineryId, measurementId, newValue).subscribe({
      next: (updatedMachinery) => {
        // Actualizar la maquinaria en la lista
        const index = this.machineries.findIndex(m => m.id === machineryId);
        if (index !== -1) {
          this.machineries[index] = updatedMachinery;
          this.filteredMachineries = [...this.machineries];
        }
        // Limpiar el valor temporal
        if (this.measurementValues[machineryId]) {
          delete this.measurementValues[machineryId][measurementId];
        }
      },
      error: (error) => {
        console.error('Error updating measurement:', error);
      }
    });
  }

  handleSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.filteredMachineries = this.machineries.filter(machinery =>
      machinery.name.toLowerCase().includes(this.searchTerm) ||
      machinery.model.toLowerCase().includes(this.searchTerm) ||
      machinery.serialNumber.toLowerCase().includes(this.searchTerm)
    );
  }

  handleFilterChange(filters: any) {
    // Por ahora no implementamos filtros adicionales
    console.log('Filters changed:', filters);
  }

  // ---------------- MÉTODOS NUEVOS ----------------
  // Carga todas las métricas disponibles
  loadMetrics() {
    this.metricService.getAllMetrics().subscribe({
      next: (metrics: Metric[]) => (this.metrics = metrics),
      error: (error: any) => console.error('Error al cargar métricas:', error)
    });
  }

  // Maneja la selección de una maquinaria
  onMachinerySelect() {
    this.selectedMachinery = this.machineries.find(m => m.id === this.selectedMachineryId) || null;
    this.filteredMachineries = this.selectedMachinery ? [this.selectedMachinery] : [];
    // Reiniciar selección de métrica y valor
    this.selectedMetricId = null;
    this.metricValue = null;

    // Ocultar detalle al cambiar de maquinaria
    this.showMachineDetail = false;
    this.machineDetail = null;
  }

  // Valida si el botón de submit debe estar deshabilitado
  isSubmitDisabled(): boolean {
    return !this.selectedMachinery || !this.selectedMetricId || this.metricValue === null || this.metricValue <= 0;
  }

  // Envía la lectura de la métrica
  onSubmitReading() {
    if (this.isSubmitDisabled() || !this.selectedMachinery || !this.selectedMetricId) {
      return;
    }

    this.machineMetricReadingService.registerMetricReading(this.selectedMachinery.id, this.selectedMetricId, this.metricValue!)
      .subscribe({
        next: () => {
          this.notificationsService.success('Éxito', 'Lectura registrada correctamente');
          // Reiniciamos el valor ingresado
          this.metricValue = null;

          // Obtener métricas recientes de la maquinaria seleccionada
          this.fetchMachineDetail();
        },
        error: (error: any) => {
          console.error('Error registrando lectura:', error);
          this.notificationsService.error(
            'Error',
            'No se pudo registrar la lectura'
          );
        }
      });
  }

  /**
   * Obtiene el detalle de la maquinaria seleccionada junto a sus métricas recientes
   */
  private fetchMachineDetail() {
    if (!this.selectedMachinery) return;

    // Primero obtenemos los detalles de la maquinaria
    this.machineryService.getMachineryById(this.selectedMachinery.id).subscribe({
      next: (machine) => {
        this.machineDetail = machine;
        this.showMachineDetail = true;

        // Luego obtenemos las métricas específicas de esta maquinaria
        this.machineryService.getAllMachineriesWithMeasurements(this.selectedMachinery!.id).subscribe({
          next: (metrics) => {
            this.machineMetrics = metrics;
          },
          error: (error: any) => {
            console.error('Error obteniendo métricas de la maquinaria:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error obteniendo detalle de maquinaria:', error);
      }
    });
  }
  // --------------- FIN MÉTODOS NUEVOS ---------------
}
