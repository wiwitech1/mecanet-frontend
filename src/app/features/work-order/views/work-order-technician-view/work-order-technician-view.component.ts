import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject, map, takeUntil, forkJoin, of } from 'rxjs';

import { WorkOrderEntity } from '../../models/work-order.entity';
import { WorkOrderStatus } from '../../models/work-order-status.entity';
import { WorkOrderMaterial } from '../../models/work-order-material.entity';
import { UserRole } from '../../models/user-role.entity';
import { WorkOrderService } from '../../services/work-order.service';
import { UserService } from '../../../../core/services/user.service';

interface TechnicianDashboardStats {
  availableOrders: number;
  myPendingOrders: number;
  inExecution: number;
  completedThisMonth: number;
  totalParticipated: number;
}

interface WorkOrderSkill {
  id: number;
  name: string;
}

@Component({
  selector: 'app-work-order-technician-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './work-order-technician-view.component.html',
  styleUrls: ['./work-order-technician-view.component.scss']
})
export class WorkOrderTechnicianViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Estados principales
  loading = false;
  error: string | null = null;
  
  // Datos por categoría
  publishedOrders: WorkOrderEntity[] = [];
  myPendingOrders: WorkOrderEntity[] = [];
  inExecutionOrders: WorkOrderEntity[] = [];
  completedOrders: WorkOrderEntity[] = [];
  allOrders: WorkOrderEntity[] = [];
  
  // Estadísticas del técnico
  stats: TechnicianDashboardStats = {
    availableOrders: 0,
    myPendingOrders: 0,
    inExecution: 0,
    completedThisMonth: 0,
    totalParticipated: 0
  };

  // UI Estados
  activeTab: 'dashboard' | 'available' | 'pending' | 'execution' | 'completed' = 'dashboard';
  selectedOrder: WorkOrderEntity | null = null;
  showMaterialsModal = false;
  showLeaveModal = false;
  showStartExecutionModal = false;
  leaveReason = '';

  // Formularios
  materialsForm: FormGroup;

  // Usuario actual
  currentUserId: number = 0;
  isTechnician = false;

  // Enums para template
  WorkOrderStatus = WorkOrderStatus;

  // Skills disponibles (en una app real vendrían de un servicio)
  availableSkills: WorkOrderSkill[] = [
    { id: 1, name: 'Electricidad' },
    { id: 2, name: 'Mecánica' },
    { id: 3, name: 'Hidráulica' },
    { id: 4, name: 'Neumática' },
    { id: 5, name: 'Soldadura' },
    { id: 6, name: 'Programación PLC' }
  ];

  constructor(
    private workOrderService: WorkOrderService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.materialsForm = this.createMaterialsForm();
  }

  ngOnInit(): void {
    this.initializeUser();
    this.loadTechnicianData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeUser(): void {
    const session = this.userService.getSession();
    if (session) {
      this.currentUserId = parseInt(session.userId);
      this.isTechnician = session.roles.includes(UserRole.ROLE_TECHNICAL);
      
      if (!this.isTechnician) {
        this.router.navigate(['/ordenes-trabajo/admin']);
      }
    }
  }

  private createMaterialsForm(): FormGroup {
    return this.fb.group({
      materials: this.fb.array([])
    });
  }

  get materialsArray(): FormArray {
    return this.materialsForm.get('materials') as FormArray;
  }

  // =================== CARGA DE DATOS ===================

  loadTechnicianData(): void {
    this.loading = true;
    this.error = null;

    const publishedOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.PUBLISHED);
    const pendingOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.PENDING_EXECUTION);
    const inExecutionOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.IN_EXECUTION);
    const completedOrders$ = this.workOrderService.getWorkOrdersByStatus(WorkOrderStatus.COMPLETED);

    forkJoin({
      publishedOrders: publishedOrders$,
      pendingOrders: pendingOrders$,
      inExecutionOrders: inExecutionOrders$,
      completedOrders: completedOrders$
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.publishedOrders = data.publishedOrders;
        
        // Filtrar solo las órdenes donde participo
        this.myPendingOrders = data.pendingOrders.filter(order => 
          this.isUserJoined(order)
        );
        
        this.inExecutionOrders = data.inExecutionOrders.filter(order => 
          this.isUserJoined(order)
        );
        
        this.completedOrders = data.completedOrders.filter(order => 
          this.isUserJoined(order)
        );
        
        this.allOrders = [
          ...data.publishedOrders,
          ...data.pendingOrders,
          ...data.inExecutionOrders,
          ...data.completedOrders
        ];

        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las órdenes de trabajo';
        this.loading = false;
        console.error('Error loading technician data:', error);
      }
    });
  }

  private updateStats(): void {
    const completedThisMonth = this.completedOrders.filter(order => {
      if (!order.executionWindow?.endAt) return false;
      const completedDate = new Date(order.executionWindow.endAt);
      const now = new Date();
      return completedDate.getMonth() === now.getMonth() && 
             completedDate.getFullYear() === now.getFullYear();
    }).length;

    this.stats = {
      availableOrders: this.publishedOrders.length,
      myPendingOrders: this.myPendingOrders.length,
      inExecution: this.inExecutionOrders.length,
      completedThisMonth: completedThisMonth,
      totalParticipated: this.myPendingOrders.length + this.inExecutionOrders.length + this.completedOrders.length
    };
  }

  // =================== NAVEGACIÓN ===================
  
  setActiveTab(tab: 'dashboard' | 'available' | 'pending' | 'execution' | 'completed'): void {
    this.activeTab = tab;
    this.selectedOrder = null;
  }

  goToOrderDetail(orderId: number): void {
    this.router.navigate(['/ordenes-trabajo', orderId]);
  }

  goToExecutionDetail(orderId: number): void {
    this.router.navigate(['/ejecucion', orderId]);
  }

  // =================== ÓRDENES DISPONIBLES ===================

  isUserJoined(order: WorkOrderEntity): boolean {
    return order.technicians.some(tech => tech.technicianId === this.currentUserId);
  }

  canJoinOrder(order: WorkOrderEntity): boolean {
    return !this.isUserJoined(order) && 
           order.technicians.length < order.maxTechnicians &&
           this.hasRequiredSkills(order.requiredSkillIds);
  }

  hasRequiredSkills(requiredSkillIds: number[]): boolean {
    // En una implementación real, verificarías las skills del usuario actual
    return true; // Por ahora asumimos que el técnico tiene todas las skills
  }

  joinOrder(orderId: number): void {
    this.loading = true;
    
    this.workOrderService.joinWorkOrder(orderId, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedOrder) => {
          // Actualizar la orden en la lista
          const index = this.publishedOrders.findIndex(o => o.id === orderId);
          if (index !== -1) {
            this.publishedOrders[index] = updatedOrder;
          }
          
          this.loadTechnicianData(); // Recargar para actualizar stats
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al unirse a la orden de trabajo';
          this.loading = false;
          console.error('Error joining order:', error);
        }
      });
  }

  openLeaveModal(order: WorkOrderEntity): void {
    this.selectedOrder = order;
    this.showLeaveModal = true;
    this.leaveReason = '';
  }

  closeLeaveModal(): void {
    this.showLeaveModal = false;
    this.selectedOrder = null;
    this.leaveReason = '';
  }

  leaveOrder(): void {
    if (this.selectedOrder && this.leaveReason.trim()) {
      this.loading = true;
      
      this.workOrderService.leaveWorkOrder(
        this.selectedOrder.id,
        this.currentUserId,
        this.leaveReason
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (updatedOrder) => {
          // Actualizar la orden en la lista
          const index = this.publishedOrders.findIndex(o => o.id === this.selectedOrder!.id);
          if (index !== -1) {
            this.publishedOrders[index] = updatedOrder;
          }
          
          this.closeLeaveModal();
          this.loadTechnicianData();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al abandonar la orden de trabajo';
          this.loading = false;
          console.error('Error leaving order:', error);
        }
      });
    }
  }

  // =================== ÓRDENES PENDIENTES ===================

  openStartExecutionModal(order: WorkOrderEntity): void {
    this.selectedOrder = order;
    this.showStartExecutionModal = true;
  }

  closeStartExecutionModal(): void {
    this.showStartExecutionModal = false;
    this.selectedOrder = null;
  }

  startExecution(): void {
    if (this.selectedOrder) {
      this.loading = true;
      
      this.workOrderService.startExecution(
        this.selectedOrder.id,
        this.currentUserId,
        new Date()
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (updatedOrder) => {
          this.closeStartExecutionModal();
          this.loadTechnicianData();
          this.loading = false;
          
          // Redirigir a vista de ejecución
          this.goToExecutionDetail(updatedOrder.id);
        },
        error: (error) => {
          this.error = 'Error al iniciar la ejecución';
          this.loading = false;
          console.error('Error starting execution:', error);
        }
      });
    }
  }

  // =================== GESTIÓN DE MATERIALES ===================

  openMaterialsModal(order: WorkOrderEntity): void {
    this.selectedOrder = order;
    this.setupMaterialsForm(order);
    this.showMaterialsModal = true;
  }

  closeMaterialsModal(): void {
    this.showMaterialsModal = false;
    this.selectedOrder = null;
    this.materialsForm.reset();
  }

  private setupMaterialsForm(order: WorkOrderEntity): void {
    const materialsArray = this.materialsArray;
    materialsArray.clear();

    order.materials.forEach(material => {
      materialsArray.push(this.fb.group({
        id: [material.id],
        itemId: [material.itemId, Validators.required],
        itemSku: [material.itemSku, Validators.required],
        itemName: [material.itemName, Validators.required],
        requestedQty: [material.requestedQty, [Validators.required, Validators.min(1)]],
        finalQty: [material.finalQty || 0]
      }));
    });
  }

  addMaterial(): void {
    this.materialsArray.push(this.fb.group({
      id: [undefined],
      itemId: [0, Validators.required],
      itemSku: ['', Validators.required],
      itemName: ['', Validators.required],
      requestedQty: [1, [Validators.required, Validators.min(1)]],
      finalQty: [0]
    }));
  }

  removeMaterial(index: number): void {
    this.materialsArray.removeAt(index);
  }

  saveMaterials(): void {
    if (this.materialsForm.valid && this.selectedOrder) {
      const materials: WorkOrderMaterial[] = this.materialsArray.value;
      
      this.loading = true;
      
      this.workOrderService.updateMaterials(this.selectedOrder.id, materials)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder) => {
            // Actualizar la orden en las listas correspondientes
            this.updateOrderInLists(updatedOrder);
            this.closeMaterialsModal();
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Error al actualizar los materiales';
            this.loading = false;
            console.error('Error updating materials:', error);
          }
        });
    }
  }

  private updateOrderInLists(updatedOrder: WorkOrderEntity): void {
    // Actualizar en todas las listas donde pueda estar la orden
    const lists = [
      this.publishedOrders,
      this.myPendingOrders,
      this.inExecutionOrders,
      this.completedOrders
    ];

    lists.forEach(list => {
      const index = list.findIndex(o => o.id === updatedOrder.id);
      if (index !== -1) {
        list[index] = updatedOrder;
      }
    });
  }

  // =================== UTILIDADES ===================

  getSkillNames(skillIds: number[]): string {
    const skills = skillIds.map(id => 
      this.availableSkills.find(skill => skill.id === id)?.name || `Skill ${id}`
    );
    return skills.join(', ');
  }

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
      if (time.match(/^\d{2}:\d{2}$/)) {
        return time;
      }
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

  trackByMaterialIndex(index: number): number {
    return index;
  }
} 