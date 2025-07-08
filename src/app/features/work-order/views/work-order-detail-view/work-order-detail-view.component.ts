import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject, map, takeUntil, forkJoin, of, switchMap, timer } from 'rxjs';

import { WorkOrderEntity } from '../../models/work-order.entity';
import { WorkOrderStatus } from '../../models/work-order-status.entity';
import { WorkOrderMaterial } from '../../models/work-order-material.entity';
import { WorkOrderSchedule } from '../../models/work-order-schedule.entity';
import { WorkOrderComment } from '../../models/work-order-comment.entity';
import { WorkOrderPhoto } from '../../models/work-order-photo.entity';
import { UserRole } from '../../models/user-role.entity';
import { WorkOrderService } from '../../services/work-order.service';
import { UserService } from '../../../../core/services/user.service';

interface ContextualPermissions {
  canEdit: boolean;
  canSchedule: boolean;
  canPublish: boolean;
  canJoin: boolean;
  canLeave: boolean;
  canReview: boolean;
  canApprove: boolean;
  canStart: boolean;
  canComplete: boolean;
  canComment: boolean;
  canUploadPhotos: boolean;
  canEditMaterials: boolean;
  canEditFinalQuantities: boolean;
  canViewSensitiveData: boolean;
}

interface ViewContext {
  workOrderId: number;
  currentUserId: number;
  userRoles: string[];
  isAdmin: boolean;
  isTechnician: boolean;
  isUserJoined: boolean;
  permissions: ContextualPermissions;
}

@Component({
  selector: 'app-work-order-detail-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './work-order-detail-view.component.html',
  styleUrls: ['./work-order-detail-view.component.scss']
})
export class WorkOrderDetailViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Datos principales
  workOrder: WorkOrderEntity | null = null;
  loading = false;
  error: string | null = null;
  
  // Contexto de la vista
  context: ViewContext = {
    workOrderId: 0,
    currentUserId: 0,
    userRoles: [],
    isAdmin: false,
    isTechnician: false,
    isUserJoined: false,
    permissions: {
      canEdit: false,
      canSchedule: false,
      canPublish: false,
      canJoin: false,
      canLeave: false,
      canReview: false,
      canApprove: false,
      canStart: false,
      canComplete: false,
      canComment: false,
      canUploadPhotos: false,
      canEditMaterials: false,
      canEditFinalQuantities: false,
      canViewSensitiveData: false
    }
  };

  // Estados activos
  activeSection: 'overview' | 'materials' | 'team' | 'schedule' | 'activity' | 'photos' | 'completion' = 'overview';
  
  // Formularios dinámicos
  scheduleForm!: FormGroup;
  materialsForm!: FormGroup;
  completionForm!: FormGroup;

  // Estados de UI
  showScheduleModal = false;
  showMaterialsModal = false;
  showPhotoUploadModal = false;
  showCompletionModal = false;
  showConfirmationModal = false;
  confirmationAction: (() => void) | null = null;
  confirmationMessage = '';

  // Datos temporales para edición
  newComment = '';
  selectedPhotoFile: File | null = null;
  photoDescription = '';
  conclusions = '';

  // Auto-refresh para colaboración en tiempo real
  autoRefreshEnabled = false;
  lastUpdateTime = new Date();

  // Enums para template
  WorkOrderStatus = WorkOrderStatus;
  UserRole = UserRole;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workOrderService: WorkOrderService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const id = parseInt(params['id']);
      if (id) {
        this.context.workOrderId = id;
        this.initializeUser();
        this.loadWorkOrderDetail();
      } else {
        this.router.navigate(['/ordenes-trabajo']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      durationHours: [0, [Validators.required, Validators.min(1)]],
      priority: ['normal'],
      notes: ['']
    });

    this.materialsForm = this.fb.group({
      materials: this.fb.array([])
    });

    this.completionForm = this.fb.group({
      conclusions: ['', [Validators.required, Validators.minLength(20)]],
      finalMaterials: this.fb.array([]),
      workCompleted: [false, Validators.requiredTrue],
      recommendationsForNext: ['']
    });
  }

  private initializeUser(): void {
    const session = this.userService.getSession();
    if (session) {
      this.context.currentUserId = parseInt(session.userId);
      this.context.userRoles = session.roles;
      this.context.isAdmin = session.roles.includes(UserRole.ROLE_ADMIN);
      this.context.isTechnician = session.roles.includes(UserRole.ROLE_TECHNICAL);
    }
  }

  // =================== CARGA DE DATOS ===================

  loadWorkOrderDetail(): void {
    this.loading = true;
    this.error = null;

    this.workOrderService.getWorkOrderById(this.context.workOrderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          this.workOrder = order;
          this.updateContext();
          this.setupFormsWithData();
          this.enableAutoRefreshIfNeeded();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar la orden de trabajo';
          this.loading = false;
          console.error('Error loading work order:', error);
        }
      });
  }

  private updateContext(): void {
    if (!this.workOrder) return;

    // Verificar si el usuario está unido
    this.context.isUserJoined = this.workOrder.technicians.some(
      tech => tech.technicianId === this.context.currentUserId
    );

    // Calcular permisos contextuales
    this.context.permissions = this.calculateContextualPermissions();
  }

  private calculateContextualPermissions(): ContextualPermissions {
    if (!this.workOrder) {
      return this.context.permissions;
    }

    const status = this.workOrder.status;
    const isAdmin = this.context.isAdmin;
    const isTechnician = this.context.isTechnician;
    const isJoined = this.context.isUserJoined;

    return {
      // Permisos de administración
      canEdit: isAdmin && [WorkOrderStatus.NEW, WorkOrderStatus.PUBLISHED].includes(status),
      canSchedule: isAdmin && status === WorkOrderStatus.NEW,
      canPublish: isAdmin && status === WorkOrderStatus.NEW,
      canReview: isAdmin && status === WorkOrderStatus.PUBLISHED,
      canApprove: isAdmin && status === WorkOrderStatus.REVIEW,

      // Permisos de técnicos  
      canJoin: isTechnician && status === WorkOrderStatus.PUBLISHED && !isJoined &&
               this.workOrder.technicians.length < this.workOrder.maxTechnicians,
      canLeave: isTechnician && status === WorkOrderStatus.PUBLISHED && isJoined,
      canStart: isTechnician && status === WorkOrderStatus.PENDING_EXECUTION && isJoined,
      canComplete: isTechnician && status === WorkOrderStatus.IN_EXECUTION && isJoined,

      // Permisos de colaboración
      canComment: (isTechnician && isJoined) || isAdmin,
      canUploadPhotos: (isTechnician && [WorkOrderStatus.IN_EXECUTION].includes(status) && isJoined) || isAdmin,
      canEditMaterials: (isTechnician && [WorkOrderStatus.PUBLISHED].includes(status) && isJoined) || 
                       (isAdmin && [WorkOrderStatus.NEW, WorkOrderStatus.PUBLISHED].includes(status)),
      canEditFinalQuantities: isTechnician && status === WorkOrderStatus.IN_EXECUTION && isJoined,

      // Permisos de visualización
      canViewSensitiveData: isAdmin || (isTechnician && isJoined)
    };
  }

  private setupFormsWithData(): void {
    if (!this.workOrder) return;

    // Setup schedule form
    if (this.workOrder.schedule) {
      this.scheduleForm.patchValue({
        date: this.workOrder.schedule.date,
        startTime: this.workOrder.schedule.startTime,
        endTime: this.workOrder.schedule.endTime,
        durationHours: this.workOrder.schedule.durationHours,
        priority: 'normal', // Default value since priority doesn't exist in WorkOrderSchedule
        notes: '' // Default value since notes doesn't exist in WorkOrderSchedule
      });
    }

    // Setup materials form
    this.setupMaterialsForm();

    // Setup completion form
    this.conclusions = this.workOrder.conclusions || '';
  }

  private setupMaterialsForm(): void {
    const materialsArray = this.materialsForm.get('materials') as FormArray;
    materialsArray.clear();

    if (this.workOrder?.materials) {
      this.workOrder.materials.forEach(material => {
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
  }

  private enableAutoRefreshIfNeeded(): void {
    if (this.workOrder?.status === WorkOrderStatus.IN_EXECUTION && this.context.isUserJoined) {
      this.autoRefreshEnabled = true;
      this.startAutoRefresh();
    }
  }

  private startAutoRefresh(): void {
    if (!this.autoRefreshEnabled) return;

    timer(30000, 30000) // Cada 30 segundos
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.autoRefreshEnabled && !this.loading) {
          this.refreshWorkOrderData();
        }
      });
  }

  private refreshWorkOrderData(): void {
    this.workOrderService.getWorkOrderById(this.context.workOrderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          // Solo actualizar si hay cambios para evitar parpadeos
          if (JSON.stringify(order) !== JSON.stringify(this.workOrder)) {
            this.workOrder = order;
            this.updateContext();
            this.lastUpdateTime = new Date();
          }
        },
        error: (error) => {
          console.warn('Error refreshing work order data:', error);
        }
      });
  }

  // =================== NAVEGACIÓN ===================

  setActiveSection(section: 'overview' | 'materials' | 'team' | 'schedule' | 'activity' | 'photos' | 'completion'): void {
    this.activeSection = section;
  }

  goBack(): void {
    if (this.context.isAdmin) {
      this.router.navigate(['/ordenes-trabajo/admin']);
    } else {
      this.router.navigate(['/ordenes-trabajo/tecnico']);
    }
  }

  // =================== ACCIONES DE ADMINISTRADOR ===================

  openScheduleModal(): void {
    if (this.context.permissions.canSchedule) {
      this.showScheduleModal = true;
    }
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
  }

  scheduleWorkOrder(): void {
    if (this.scheduleForm.valid && this.workOrder) {
      this.loading = true;
      
      const scheduleData: WorkOrderSchedule = this.scheduleForm.value;
      
      this.workOrderService.scheduleWorkOrder(this.workOrder.id, scheduleData, this.workOrder.maxTechnicians)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder: WorkOrderEntity) => {
            this.workOrder = updatedOrder;
            this.updateContext();
            this.closeScheduleModal();
            this.loading = false;
          },
          error: (error: any) => {
            this.error = 'Error al programar la orden de trabajo';
            this.loading = false;
            console.error('Error scheduling work order:', error);
          }
        });
    }
  }

  publishWorkOrder(): void {
    this.confirmAction(
      '¿Estás seguro de publicar esta orden de trabajo? Los técnicos podrán unirse.',
      () => {
        if (this.workOrder) {
          this.loading = true;
          
          this.workOrderService.publishWorkOrder(this.workOrder.id, this.context.currentUserId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedOrder: WorkOrderEntity) => {
                this.workOrder = updatedOrder;
                this.updateContext();
                this.loading = false;
              },
              error: (error: any) => {
                this.error = 'Error al publicar la orden de trabajo';
                this.loading = false;
                console.error('Error publishing work order:', error);
              }
            });
        }
      }
    );
  }

  reviewWorkOrder(): void {
    this.confirmAction(
      '¿Estás seguro de enviar esta orden a revisión?',
      () => {
        if (this.workOrder) {
          this.loading = true;
          
          this.workOrderService.moveToReview(this.workOrder.id, this.context.currentUserId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedOrder: WorkOrderEntity) => {
                this.workOrder = updatedOrder;
                this.updateContext();
                this.loading = false;
              },
              error: (error: any) => {
                this.error = 'Error al enviar orden a revisión';
                this.loading = false;
                console.error('Error reviewing work order:', error);
              }
            });
        }
      }
    );
  }

  approveWorkOrder(): void {
    this.confirmAction(
      '¿Estás seguro de aprobar esta orden de trabajo para ejecución?',
      () => {
        if (this.workOrder) {
          this.loading = true;
          
          this.workOrderService.approveToPending(this.workOrder.id, this.context.currentUserId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedOrder: WorkOrderEntity) => {
                this.workOrder = updatedOrder;
                this.updateContext();
                this.loading = false;
              },
              error: (error: any) => {
                this.error = 'Error al aprobar orden para ejecución';
                this.loading = false;
                console.error('Error approving work order:', error);
              }
            });
        }
      }
    );
  }

  // =================== ACCIONES DE TÉCNICO ===================

  joinWorkOrder(): void {
    if (this.context.permissions.canJoin && this.workOrder) {
      this.loading = true;
      
      this.workOrderService.joinWorkOrder(this.workOrder.id, this.context.currentUserId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder) => {
            this.workOrder = updatedOrder;
            this.updateContext();
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Error al unirse a la orden de trabajo';
            this.loading = false;
            console.error('Error joining work order:', error);
          }
        });
    }
  }

  leaveWorkOrder(): void {
    const reason = prompt('¿Por qué abandonas esta orden de trabajo?');
    if (reason && this.workOrder) {
      this.loading = true;
      
      this.workOrderService.leaveWorkOrder(this.workOrder.id, this.context.currentUserId, reason)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder) => {
            this.workOrder = updatedOrder;
            this.updateContext();
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Error al abandonar la orden de trabajo';
            this.loading = false;
            console.error('Error leaving work order:', error);
          }
        });
    }
  }

  startExecution(): void {
    this.confirmAction(
      '¿Estás seguro de iniciar la ejecución de esta orden de trabajo?',
      () => {
        if (this.workOrder) {
          this.loading = true;
          
          this.workOrderService.startExecution(this.workOrder.id, this.context.currentUserId, new Date())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedOrder) => {
                this.workOrder = updatedOrder;
                this.updateContext();
                this.enableAutoRefreshIfNeeded();
                this.loading = false;
              },
              error: (error) => {
                this.error = 'Error al iniciar la ejecución';
                this.loading = false;
                console.error('Error starting execution:', error);
              }
            });
        }
      }
    );
  }

  // =================== GESTIÓN DE MATERIALES ===================

  get materialsArray(): FormArray {
    return this.materialsForm.get('materials') as FormArray;
  }

  openMaterialsModal(): void {
    if (this.context.permissions.canEditMaterials) {
      this.setupMaterialsForm();
      this.showMaterialsModal = true;
    }
  }

  closeMaterialsModal(): void {
    this.showMaterialsModal = false;
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
    if (this.materialsForm.valid && this.workOrder) {
      this.loading = true;
      
      const materials: WorkOrderMaterial[] = this.materialsArray.value;
      
      this.workOrderService.updateMaterials(this.workOrder.id, materials)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder) => {
            this.workOrder = updatedOrder;
            this.updateContext();
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

  updateFinalQuantities(): void {
    if (this.context.permissions.canEditFinalQuantities && this.workOrder) {
      // Auto-guardar cantidades finales cuando cambian
      const materials = this.workOrder.materials.map(material => ({
        ...material,
        finalQty: material.finalQty
      }));

      this.workOrderService.updateMaterials(this.workOrder.id, materials)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder) => {
            this.workOrder = updatedOrder;
          },
          error: (error) => {
            console.error('Error updating final quantities:', error);
          }
        });
    }
  }

  // =================== COLABORACIÓN EN TIEMPO REAL ===================

  addComment(): void {
    if (this.newComment.trim() && this.context.permissions.canComment && this.workOrder) {
      this.loading = true;
      
      this.workOrderService.addComment(this.workOrder.id, this.context.currentUserId, this.newComment)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder) => {
            this.workOrder = updatedOrder;
            this.newComment = '';
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Error al agregar comentario';
            this.loading = false;
            console.error('Error adding comment:', error);
          }
        });
    }
  }

  openPhotoUploadModal(): void {
    if (this.context.permissions.canUploadPhotos) {
      this.showPhotoUploadModal = true;
      this.selectedPhotoFile = null;
      this.photoDescription = '';
    }
  }

  closePhotoUploadModal(): void {
    this.showPhotoUploadModal = false;
    this.selectedPhotoFile = null;
    this.photoDescription = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedPhotoFile = file;
    }
  }

  uploadPhoto(): void {
    if (this.selectedPhotoFile && this.workOrder) {
      this.loading = true;
      
      // Simular URL de la foto - en una app real se subiría a un servidor
      const photoUrl = `${this.workOrder.id}_${Date.now()}_${this.selectedPhotoFile.name}`;
      
      this.workOrderService.addPhoto(
        this.workOrder.id,
        this.context.currentUserId,
        photoUrl
      ).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder: WorkOrderEntity) => {
            this.workOrder = updatedOrder;
            this.closePhotoUploadModal();
            this.loading = false;
          },
          error: (error: any) => {
            this.error = 'Error al subir la foto';
            this.loading = false;
            console.error('Error uploading photo:', error);
          }
        });
    }
  }

  // =================== COMPLETAR ORDEN ===================

  openCompletionModal(): void {
    if (this.context.permissions.canComplete) {
      this.showCompletionModal = true;
      this.conclusions = this.workOrder?.conclusions || '';
    }
  }

  closeCompletionModal(): void {
    this.showCompletionModal = false;
  }

  completeWorkOrder(): void {
    if (this.conclusions.trim() && this.workOrder) {
      this.confirmAction(
        '¿Estás seguro de completar esta orden de trabajo? Esta acción no se puede deshacer.',
        () => {
          if (this.workOrder) {
            this.loading = true;
            
            this.workOrderService.completeWorkOrder(
              this.workOrder.id,
              this.context.currentUserId,
              new Date(),
              this.conclusions
            ).pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (updatedOrder) => {
                  this.workOrder = updatedOrder;
                  this.updateContext();
                  this.autoRefreshEnabled = false;
                  this.closeCompletionModal();
                  this.loading = false;
                },
                error: (error) => {
                  this.error = 'Error al completar la orden de trabajo';
                  this.loading = false;
                  console.error('Error completing work order:', error);
                }
              });
          }
        }
      );
    }
  }

  // =================== UTILIDADES ===================

  private confirmAction(message: string, action: () => void): void {
    this.confirmationMessage = message;
    this.confirmationAction = action;
    this.showConfirmationModal = true;
  }

  executeConfirmationAction(): void {
    if (this.confirmationAction) {
      this.confirmationAction();
    }
    this.closeConfirmationModal();
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.confirmationAction = null;
    this.confirmationMessage = '';
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

  formatDateTime(datetime: string | Date | undefined): string {
    if (!datetime) return 'Sin fecha';
    
    try {
      if (typeof datetime === 'string') {
        return new Date(datetime).toLocaleString('es-ES');
      }
      return datetime.toLocaleString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  }

  getUserName(userId: number): string {
    // En una implementación real, tendrías un servicio para obtener nombres de usuario
    if (userId === this.context.currentUserId) {
      return 'Tú';
    }
    return `Usuario ${userId}`;
  }

  getProgressPercentage(): number {
    if (!this.workOrder) return 0;

    const statusProgress = {
      [WorkOrderStatus.NEW]: 10,
      [WorkOrderStatus.PUBLISHED]: 30,
      [WorkOrderStatus.REVIEW]: 50,
      [WorkOrderStatus.PENDING_EXECUTION]: 70,
      [WorkOrderStatus.IN_EXECUTION]: 90,
      [WorkOrderStatus.COMPLETED]: 100
    };

    return statusProgress[this.workOrder.status] || 0;
  }

  trackByCommentId(index: number, comment: WorkOrderComment): number {
    return comment.id || index;
  }

  trackByPhotoId(index: number, photo: WorkOrderPhoto): number {
    return photo.id || index;
  }

  trackByMaterialIndex(index: number): number {
    return index;
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }
} 