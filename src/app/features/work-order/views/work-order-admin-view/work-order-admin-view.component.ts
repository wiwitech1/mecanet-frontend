import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { WorkOrderEntity } from '../../models/work-order.entity';
import { WorkOrderStatus } from '../../models/work-order-status.entity';
import { WorkOrderSchedule } from '../../models/work-order-schedule.entity';
import { UserRole } from '../../models/user-role.entity';

interface AdminDashboardStats {
  newOrders: number;
  published: number;
  inReview: number;
  pending: number;
  inExecution: number;
  completed: number;
  total: number;
}

interface MockTechnician {
  technicianId: number;
  joinedAt: Date;
}

interface MockMaterial {
  itemName: string;
  requestedQty: number;
}

interface MockWorkOrder {
  id: number;
  title: string;
  description: string;
  machineId: number;
  createdAt: Date;
  status: WorkOrderStatus;
  requiredSkillIds: number[];
  estimatedDuration: number;
  priority: string;
  technicians: MockTechnician[];
  materials: MockMaterial[];
  maxTechnicians: number;
  schedule: WorkOrderSchedule | null;
}

@Component({
  selector: 'app-work-order-admin-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './work-order-admin-view.component.html',
  styleUrls: ['./work-order-admin-view.component.scss']
})
export class WorkOrderAdminViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Estados principales
  loading = false;
  error: string | null = null;
  
  // Datos hardcodeados
  private mockOrders: MockWorkOrder[] = [
    // ÓRDENES NUEVAS
    {
      id: 1,
      title: 'Mantenimiento Preventivo Motor Principal',
      description: 'Revisión completa del motor principal incluyendo cambio de aceite, filtros y revisión de correas',
      machineId: 1,
      createdAt: new Date('2024-01-15'),
      status: WorkOrderStatus.NEW,
      requiredSkillIds: [1, 2, 3],
      estimatedDuration: 4,
      priority: 'HIGH',
      technicians: [],
      materials: [],
      maxTechnicians: 0,
      schedule: null
    },
    {
      id: 2,
      title: 'Calibración Sistema de Control',
      description: 'Calibración y ajuste del sistema de control automático de la línea de producción',
      machineId: 2,
      createdAt: new Date('2024-01-16'),
      status: WorkOrderStatus.NEW,
      requiredSkillIds: [4, 5],
      estimatedDuration: 6,
      priority: 'MEDIUM',
      technicians: [],
      materials: [],
      maxTechnicians: 0,
      schedule: null
    },
    {
      id: 3,
      title: 'Reparación Sistema Hidráulico',
      description: 'Reparación de fuga en sistema hidráulico y reemplazo de sellos dañados',
      machineId: 3,
      createdAt: new Date('2024-01-17'),
      status: WorkOrderStatus.NEW,
      requiredSkillIds: [1, 6],
      estimatedDuration: 8,
      priority: 'HIGH',
      technicians: [],
      materials: [],
      maxTechnicians: 0,
      schedule: null
    },

    // ÓRDENES PUBLICADAS
    {
      id: 4,
      title: 'Inspección Eléctrica Rutinaria',
      description: 'Inspección completa del sistema eléctrico y conexiones',
      machineId: 4,
      createdAt: new Date('2024-01-10'),
      status: WorkOrderStatus.PUBLISHED,
      requiredSkillIds: [2, 4],
      estimatedDuration: 3,
      priority: 'MEDIUM',
      technicians: [],
      materials: [],
      maxTechnicians: 2,
      schedule: {
        date: '2024-01-25',
        startTime: '08:00',
        endTime: '11:00',
        durationHours: 3
      }
    },

    // ÓRDENES EN REVISIÓN
    {
      id: 5,
      title: 'Actualización Software PLC',
      description: 'Actualización del software del controlador lógico programable',
      machineId: 5,
      createdAt: new Date('2024-01-12'),
      status: WorkOrderStatus.REVIEW,
      requiredSkillIds: [4, 5],
      estimatedDuration: 5,
      priority: 'HIGH',
      technicians: [
        { technicianId: 101, joinedAt: new Date('2024-01-18T09:30:00') },
        { technicianId: 102, joinedAt: new Date('2024-01-18T10:15:00') }
      ],
      materials: [
        { itemName: 'Cable USB-Serial', requestedQty: 1 },
        { itemName: 'Software de actualización', requestedQty: 1 }
      ],
      maxTechnicians: 3,
      schedule: {
        date: '2024-01-26',
        startTime: '09:00',
        endTime: '14:00',
        durationHours: 5
      }
    },
    {
      id: 6,
      title: 'Reemplazo Rodamientos Principales',
      description: 'Cambio de rodamientos principales del eje rotativo',
      machineId: 6,
      createdAt: new Date('2024-01-13'),
      status: WorkOrderStatus.REVIEW,
      requiredSkillIds: [1, 3],
      estimatedDuration: 6,
      priority: 'HIGH',
      technicians: [
        { technicianId: 103, joinedAt: new Date('2024-01-18T08:45:00') },
        { technicianId: 104, joinedAt: new Date('2024-01-18T09:00:00') },
        { technicianId: 105, joinedAt: new Date('2024-01-18T11:30:00') }
      ],
      materials: [
        { itemName: 'Rodamiento SKF 6308', requestedQty: 2 },
        { itemName: 'Grasa industrial', requestedQty: 1 },
        { itemName: 'Extractor de rodamientos', requestedQty: 1 }
      ],
      maxTechnicians: 3,
      schedule: {
        date: '2024-01-27',
        startTime: '08:00',
        endTime: '14:00',
        durationHours: 6
      }
    },

    // ÓRDENES PENDIENTES
    {
      id: 7,
      title: 'Limpieza Profunda Sistema de Ventilación',
      description: 'Limpieza completa del sistema de ventilación y filtros',
      machineId: 7,
      createdAt: new Date('2024-01-08'),
      status: WorkOrderStatus.PENDING_EXECUTION,
      requiredSkillIds: [1, 2],
      estimatedDuration: 4,
      priority: 'MEDIUM',
      technicians: [
        { technicianId: 106, joinedAt: new Date('2024-01-15T10:00:00') },
        { technicianId: 107, joinedAt: new Date('2024-01-15T10:30:00') }
      ],
      materials: [
        { itemName: 'Filtros HEPA', requestedQty: 4 },
        { itemName: 'Detergente industrial', requestedQty: 2 }
      ],
      maxTechnicians: 2,
      schedule: {
        date: '2024-01-24',
        startTime: '13:00',
        endTime: '17:00',
        durationHours: 4
      }
    },

    // ÓRDENES EN EJECUCIÓN
    {
      id: 8,
      title: 'Instalación Sensor de Temperatura',
      description: 'Instalación de nuevos sensores de temperatura en puntos críticos',
      machineId: 8,
      createdAt: new Date('2024-01-05'),
      status: WorkOrderStatus.IN_EXECUTION,
      requiredSkillIds: [2, 4],
      estimatedDuration: 3,
      priority: 'HIGH',
      technicians: [
        { technicianId: 108, joinedAt: new Date('2024-01-12T08:00:00') }
      ],
      materials: [
        { itemName: 'Sensor PT100', requestedQty: 3 },
        { itemName: 'Cable termopar', requestedQty: 10 }
      ],
      maxTechnicians: 2,
      schedule: {
        date: '2024-01-22',
        startTime: '08:00',
        endTime: '11:00',
        durationHours: 3
      }
    },

    // ÓRDENES COMPLETADAS
    {
      id: 9,
      title: 'Verificación Sistema de Seguridad',
      description: 'Verificación completa de todos los sistemas de seguridad',
      machineId: 9,
      createdAt: new Date('2024-01-01'),
      status: WorkOrderStatus.COMPLETED,
      requiredSkillIds: [2, 4, 5],
      estimatedDuration: 2,
      priority: 'HIGH',
      technicians: [
        { technicianId: 109, joinedAt: new Date('2024-01-08T09:00:00') },
        { technicianId: 110, joinedAt: new Date('2024-01-08T09:15:00') }
      ],
      materials: [
        { itemName: 'Multímetro', requestedQty: 1 },
        { itemName: 'Tester de aislamiento', requestedQty: 1 }
      ],
      maxTechnicians: 2,
      schedule: {
        date: '2024-01-20',
        startTime: '14:00',
        endTime: '16:00',
        durationHours: 2
      }
    },
    {
      id: 10,
      title: 'Lubricación Puntos de Engrase',
      description: 'Lubricación de todos los puntos de engrase según programa',
      machineId: 10,
      createdAt: new Date('2024-01-02'),
      status: WorkOrderStatus.COMPLETED,
      requiredSkillIds: [1, 3],
      estimatedDuration: 2,
      priority: 'MEDIUM',
      technicians: [
        { technicianId: 111, joinedAt: new Date('2024-01-09T07:30:00') }
      ],
      materials: [
        { itemName: 'Grasa multiuso', requestedQty: 2 },
        { itemName: 'Pistola engrasadora', requestedQty: 1 }
      ],
      maxTechnicians: 1,
      schedule: {
        date: '2024-01-21',
        startTime: '07:30',
        endTime: '09:30',
        durationHours: 2
      }
    }
  ];

  // Nombres de técnicos hardcodeados
  private technicianNames: { [key: number]: string } = {
    101: 'Carlos Rodríguez',
    102: 'Ana Martínez',
    103: 'Luis García',
    104: 'María López',
    105: 'Pedro Sánchez',
    106: 'Sofia Fernández',
    107: 'Roberto Torres',
    108: 'Elena Ruiz',
    109: 'Miguel Herrera',
    110: 'Carmen Vega',
    111: 'Javier Morales'
  };

  // Datos filtrados por vista
  newOrders: MockWorkOrder[] = [];
  reviewOrders: MockWorkOrder[] = [];
  allOrders: MockWorkOrder[] = [];
  stats: AdminDashboardStats = {
    newOrders: 0,
    published: 0,
    inReview: 0,
    pending: 0,
    inExecution: 0,
    completed: 0,
    total: 0
  };

  // UI Estados
  activeTab: 'new' | 'review' | 'dashboard' = 'dashboard';
  selectedOrder: MockWorkOrder | null = null;
  showScheduleModal = false;
  showRemoveTechnicianModal = false;
  selectedTechnicianId: number | null = null;

  // Formularios
  scheduleForm: FormGroup;

  // Usuario actual (hardcodeado como admin)
  currentUserId: number = 1;
  isAdmin = true;

  // Enums para template
  WorkOrderStatus = WorkOrderStatus;

  // Propiedades para el template
  minDate = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.scheduleForm = this.createScheduleForm();
  }

  ngOnInit(): void {
    this.loadAdminData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createScheduleForm(): FormGroup {
    return this.fb.group({
      date: ['', Validators.required],
      startTime: ['08:00', Validators.required],
      endTime: ['17:00', Validators.required],
      maxTechnicians: [3, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  // =================== MÉTODOS PÚBLICOS ===================
  
  loadAdminData(): void {
    this.loading = true;
    this.error = null;

    // Simular delay de carga
    setTimeout(() => {
      this.allOrders = [...this.mockOrders];
      this.filterOrdersByStatus();
      this.updateStats();
      this.loading = false;
    }, 500);
  }

  private filterOrdersByStatus(): void {
    this.newOrders = this.mockOrders.filter(order => order.status === WorkOrderStatus.NEW);
    this.reviewOrders = this.mockOrders.filter(order => order.status === WorkOrderStatus.REVIEW);
  }

  private updateStats(): void {
    this.stats = {
      newOrders: this.mockOrders.filter(o => o.status === WorkOrderStatus.NEW).length,
      published: this.mockOrders.filter(o => o.status === WorkOrderStatus.PUBLISHED).length,
      inReview: this.mockOrders.filter(o => o.status === WorkOrderStatus.REVIEW).length,
      pending: this.mockOrders.filter(o => o.status === WorkOrderStatus.PENDING_EXECUTION).length,
      inExecution: this.mockOrders.filter(o => o.status === WorkOrderStatus.IN_EXECUTION).length,
      completed: this.mockOrders.filter(o => o.status === WorkOrderStatus.COMPLETED).length,
      total: this.mockOrders.length
    };
  }

  // =================== NAVEGACIÓN ===================
  
  setActiveTab(tab: 'new' | 'review' | 'dashboard'): void {
    this.activeTab = tab;
    this.selectedOrder = null;
  }

  goToOrderDetail(orderId: number): void {
    console.log(`Navegando a detalle de orden ${orderId}`);
    // En una app real: this.router.navigate(['/ordenes-trabajo', orderId]);
  }

  // =================== ÓRDENES NUEVAS ===================

  openScheduleModal(order: MockWorkOrder): void {
    this.selectedOrder = order;
    this.showScheduleModal = true;
    
    // Pre-llenar form si ya tiene schedule
    if (order.schedule) {
      this.scheduleForm.patchValue({
        date: order.schedule.date,
        startTime: order.schedule.startTime,
        endTime: order.schedule.endTime || '17:00',
        maxTechnicians: order.maxTechnicians
      });
    }
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
    this.selectedOrder = null;
    this.scheduleForm.reset({
      date: '',
      startTime: '08:00',
      endTime: '17:00',
      maxTechnicians: 3
    });
  }

  onScheduleSubmit(): void {
    if (this.scheduleForm.valid && this.selectedOrder) {
      const formValue = this.scheduleForm.value;
      
      const schedule: WorkOrderSchedule = {
        date: formValue.date,
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        durationHours: this.calculateDuration(formValue.startTime, formValue.endTime)
      };

      this.loading = true;
      
      // Simular operación asíncrona
      setTimeout(() => {
        // Actualizar la orden
        const orderIndex = this.mockOrders.findIndex(o => o.id === this.selectedOrder!.id);
        if (orderIndex !== -1) {
          this.mockOrders[orderIndex].schedule = schedule;
          this.mockOrders[orderIndex].maxTechnicians = formValue.maxTechnicians;
          
          // Auto-publicar después de programar
          this.publishOrder(this.mockOrders[orderIndex]);
        }
      }, 1000);
    }
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  private publishOrder(order: MockWorkOrder): void {
    // Cambiar estado a PUBLISHED
    order.status = WorkOrderStatus.PUBLISHED;
    
    // Actualizar listas y estadísticas
    this.filterOrdersByStatus();
    this.updateStats();
    this.closeScheduleModal();
    this.loading = false;
    
    console.log(`Orden ${order.id} programada y publicada exitosamente`);
  }

  // =================== ÓRDENES EN REVISIÓN ===================

  approveOrder(order: MockWorkOrder): void {
    this.loading = true;
    
    // Simular operación asíncrona
    setTimeout(() => {
      // Cambiar estado a PENDING_EXECUTION
      const orderIndex = this.mockOrders.findIndex(o => o.id === order.id);
      if (orderIndex !== -1) {
        this.mockOrders[orderIndex].status = WorkOrderStatus.PENDING_EXECUTION;
        
        // Actualizar listas y estadísticas
        this.filterOrdersByStatus();
        this.updateStats();
        this.loading = false;
        
        console.log(`Orden ${order.id} aprobada para ejecución`);
      }
    }, 800);
  }

  openRemoveTechnicianModal(order: MockWorkOrder, technicianId: number): void {
    this.selectedOrder = order;
    this.selectedTechnicianId = technicianId;
    this.showRemoveTechnicianModal = true;
  }

  closeRemoveTechnicianModal(): void {
    this.showRemoveTechnicianModal = false;
    this.selectedOrder = null;
    this.selectedTechnicianId = null;
  }

  removeTechnician(): void {
    if (this.selectedOrder && this.selectedTechnicianId) {
      this.loading = true;
      
      // Simular operación asíncrona
      setTimeout(() => {
        const orderIndex = this.mockOrders.findIndex(o => o.id === this.selectedOrder!.id);
        if (orderIndex !== -1) {
          // Remover técnico de la lista
          this.mockOrders[orderIndex].technicians = this.mockOrders[orderIndex].technicians.filter(
            tech => tech.technicianId !== this.selectedTechnicianId
          );
          
          // Actualizar la lista de revisión
          this.filterOrdersByStatus();
          this.closeRemoveTechnicianModal();
          this.loading = false;
          
          console.log(`Técnico ${this.selectedTechnicianId} removido de la orden ${this.selectedOrder!.id}`);
        }
      }, 600);
    }
  }

  // =================== UTILIDADES ===================

  getStatusColor(status: WorkOrderStatus): string {
    const colors = {
      [WorkOrderStatus.NEW]: '#FF6B6B',
      [WorkOrderStatus.PUBLISHED]: '#4ECDC4',
      [WorkOrderStatus.REVIEW]: '#FFE66D',
      [WorkOrderStatus.PENDING_EXECUTION]: '#A8E6CF',
      [WorkOrderStatus.IN_EXECUTION]: '#50539D',
      [WorkOrderStatus.COMPLETED]: '#95E1D3'
    };
    return colors[status] || '#50539D';
  }

  getStatusIcon(status: WorkOrderStatus): string {
    const icons = {
      [WorkOrderStatus.NEW]: 'icon-plus-circle',
      [WorkOrderStatus.PUBLISHED]: 'icon-megaphone',
      [WorkOrderStatus.REVIEW]: 'icon-search',
      [WorkOrderStatus.PENDING_EXECUTION]: 'icon-clock',
      [WorkOrderStatus.IN_EXECUTION]: 'icon-gear',
      [WorkOrderStatus.COMPLETED]: 'icon-check-circle'
    };
    return icons[status] || 'icon-file';
  }

  getTechnicianName(technicianId: number): string {
    return this.technicianNames[technicianId] || `Técnico ${technicianId}`;
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'Sin fecha';
    
    try {
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString('es-ES');
      }
      return date.toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  }

  formatTime(time: string | undefined): string {
    if (!time) return 'Sin hora';
    
    try {
      // Si ya está en formato HH:MM, devolverlo tal como está
      if (time.match(/^\d{2}:\d{2}$/)) {
        return time;
      }
      // Si es un timestamp o string de fecha, extraer solo la hora
      return new Date(time).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Hora inválida';
    }
  }

  trackByOrderId(index: number, order: MockWorkOrder): number {
    return order.id;
  }

  trackByTechnicianId(index: number, technician: any): number {
    return technician.technicianId;
  }
} 