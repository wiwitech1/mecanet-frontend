import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject, map, takeUntil, forkJoin, of } from 'rxjs';

import { WorkOrderEntity } from '../../models/work-order.entity';
import { WorkOrderStatus } from '../../models/work-order-status.entity';
import { WorkOrderSchedule } from '../../models/work-order-schedule.entity';
import { UserRole } from '../../models/user-role.entity';
import { WorkOrderService } from '../../services/work-order.service';
import { UserService } from '../../../../core/services/user.service';

interface AdminDashboardStats {
  newOrders: number;
  published: number;
  inReview: number;
  pending: number;
  inExecution: number;
  completed: number;
  total: number;
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
  
  // Datos
  newOrders: WorkOrderEntity[] = [];
  reviewOrders: WorkOrderEntity[] = [];
  allOrders: WorkOrderEntity[] = [];
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
  selectedOrder: WorkOrderEntity | null = null;
  showScheduleModal = false;
  showRemoveTechnicianModal = false;
  selectedTechnicianId: number | null = null;

  // Formularios
  scheduleForm: FormGroup;

  // Usuario actual
  currentUserId: number = 0;
  isAdmin = false;

  // Enums para template
  WorkOrderStatus = WorkOrderStatus;

  // Propiedades para el template
  minDate = new Date().toISOString().split('T')[0];

  constructor(
    private workOrderService: WorkOrderService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.scheduleForm = this.createScheduleForm();
  }

  ngOnInit(): void {
    this.initializeUser();
    this.loadAdminData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeUser(): void {
    const session = this.userService.getSession();
    if (session) {
      this.currentUserId = parseInt(session.userId);
      this.isAdmin = session.roles.includes(UserRole.ROLE_ADMIN);
      
      if (!this.isAdmin) {
        this.router.navigate(['/work-orders']);
      }
    }
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

    const newOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.NEW);
    const reviewOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.REVIEW);
    const publishedOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.PUBLISHED);
    const pendingOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.PENDING_EXECUTION);
    const inExecutionOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.IN_EXECUTION);
    const completedOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.COMPLETED);

    forkJoin({
      newOrders: newOrders$,
      reviewOrders: reviewOrders$,
      publishedOrders: publishedOrders$,
      pendingOrders: pendingOrders$,
      inExecutionOrders: inExecutionOrders$,
      completedOrders: completedOrders$
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.newOrders = data.newOrders;
        this.reviewOrders = data.reviewOrders;
        
        this.allOrders = [
          ...data.newOrders,
          ...data.reviewOrders,
          ...data.publishedOrders,
          ...data.pendingOrders,
          ...data.inExecutionOrders,
          ...data.completedOrders
        ];
        console.log(this.allOrders);

        this.updateStats(data);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las órdenes de trabajo';
        this.loading = false;
        console.error('Error loading admin data:', error);
      }
    });
  }

  private updateStats(data: any): void {
    this.stats = {
      newOrders: data.newOrders.length,
      published: data.publishedOrders.length,
      inReview: data.reviewOrders.length,
      pending: data.pendingOrders.length,
      inExecution: data.inExecutionOrders.length,
      completed: data.completedOrders.length,
      total: data.newOrders.length + data.publishedOrders.length + data.reviewOrders.length + 
             data.pendingOrders.length + data.inExecutionOrders.length + data.completedOrders.length
    };
  }

  // =================== NAVEGACIÓN ===================
  
  setActiveTab(tab: 'new' | 'review' | 'dashboard'): void {
    this.activeTab = tab;
    this.selectedOrder = null;
  }

  goToOrderDetail(orderId: number): void {
    this.router.navigate(['/ordenes-trabajo', orderId]);
  }

  // =================== ÓRDENES NUEVAS ===================

  openScheduleModal(order: WorkOrderEntity): void {
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
    this.scheduleForm.reset();
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
      
      this.workOrderService.scheduleWorkOrder(
        this.selectedOrder.id,
        schedule,
        formValue.maxTechnicians
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (updatedOrder) => {
          // Actualizar la orden en la lista
          const index = this.newOrders.findIndex(o => o.id === updatedOrder.id);
          if (index !== -1) {
            this.newOrders[index] = updatedOrder;
          }
          
          // Auto-publicar después de programar
          this.publishOrder(updatedOrder);
        },
        error: (error) => {
          this.error = 'Error al programar la orden de trabajo';
          this.loading = false;
          console.error('Error scheduling order:', error);
        }
      });
    }
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  private publishOrder(order: WorkOrderEntity): void {
    this.workOrderService.publishWorkOrder(order.id, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (publishedOrder) => {
          // Remover de nuevas órdenes
          this.newOrders = this.newOrders.filter(o => o.id !== order.id);
          this.closeScheduleModal();
          this.loadAdminData(); // Recargar stats
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al publicar la orden de trabajo';
          this.loading = false;
          console.error('Error publishing order:', error);
        }
      });
  }

  // =================== ÓRDENES EN REVISIÓN ===================

  approveOrder(order: WorkOrderEntity): void {
    this.loading = true;
    
    this.workOrderService.approveToPending(order.id, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (approvedOrder) => {
          // Remover de revisión
          this.reviewOrders = this.reviewOrders.filter(o => o.id !== order.id);
          this.loadAdminData(); // Recargar stats
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al aprobar la orden de trabajo';
          this.loading = false;
          console.error('Error approving order:', error);
        }
      });
  }

  openRemoveTechnicianModal(order: WorkOrderEntity, technicianId: number): void {
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
      
      this.workOrderService.leaveWorkOrder(
        this.selectedOrder.id,
        this.selectedTechnicianId,
        'Removido por administrador'
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (updatedOrder) => {
          // Actualizar la orden en la lista
          const index = this.reviewOrders.findIndex(o => o.id === updatedOrder.id);
          if (index !== -1) {
            this.reviewOrders[index] = updatedOrder;
          }
          
          this.closeRemoveTechnicianModal();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al remover el técnico';
          this.loading = false;
          console.error('Error removing technician:', error);
        }
      });
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
    // En una implementación real, tendrías un servicio de usuarios
    return `Técnico ${technicianId}`;
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

  trackByOrderId(index: number, order: WorkOrderEntity): number {
    return order.id;
  }

  trackByTechnicianId(index: number, technician: any): number {
    return technician.technicianId;
  }
} 