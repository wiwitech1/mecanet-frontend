import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { WorkOrderDetailViewComponent } from './work-order-detail-view.component';
import { WorkOrderService } from '../../services/work-order.service';
import { UserService } from '../../../../core/services/user.service';
import { WorkOrderStatus } from '../../models/work-order-status.entity';
import { UserRole } from '../../models/user-role.entity';

describe('WorkOrderDetailViewComponent', () => {
  let component: WorkOrderDetailViewComponent;
  let fixture: ComponentFixture<WorkOrderDetailViewComponent>;
  let mockWorkOrderService: jasmine.SpyObj<WorkOrderService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockWorkOrder = {
    id: 1,
    tenantId: 1,
    planId: 1,
    taskId: 1,
    machineId: 1,
    title: 'Test Work Order',
    description: 'Test Description',
    status: WorkOrderStatus.PUBLISHED,
    maxTechnicians: 3,
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2023-12-20T10:00:00Z',
    schedule: {
      date: '2023-12-25',
      startTime: '08:00',
      endTime: '16:00',
      durationHours: 8,
      priority: 'normal',
      notes: 'Test notes'
    },
    technicians: [
      { technicianId: 1, joinedAt: '2023-12-20T10:00:00Z' }
    ],
    materials: [
      {
        id: 1,
        itemId: 1,
        itemSku: 'TEST-001',
        itemName: 'Test Material',
        requestedQty: 5,
        finalQty: null
      }
    ],
    comments: [
      {
        id: 1,
        text: 'Test comment',
        authorUserId: 1,
        createdAt: '2023-12-20T10:00:00Z',
        type: 'comment'
      }
    ],
    photos: [
      {
        id: 1,
        url: 'test-photo.jpg',
        description: 'Test photo',
        authorUserId: 1,
        createdAt: '2023-12-20T10:00:00Z'
      }
    ],
    conclusions: '',
    executionWindow: null,
    requiredSkillIds: [1, 2]
  } as any;

  const mockUserSession = {
    userId: '1',
    token: 'mock-token',
    expiration: new Date(),
    roles: [UserRole.ROLE_TECHNICAL],
    name: 'Test User',
    username: 'test.user'
  };

  beforeEach(async () => {
    // Create spies for services
    mockWorkOrderService = jasmine.createSpyObj('WorkOrderService', [
      'getWorkOrderById',
      'scheduleWorkOrder',
      'publishWorkOrder',
      'reviewWorkOrder',
      'approveWorkOrderForExecution',
      'joinWorkOrder',
      'leaveWorkOrder',
      'startExecution',
      'updateMaterials',
      'addComment',
      'uploadPhoto',
      'completeWorkOrder'
    ]);
    
    mockUserService = jasmine.createSpyObj('UserService', ['getSession']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    mockActivatedRoute = {
      params: of({ id: '1' })
    };

    // Setup default return values
    mockWorkOrderService.getWorkOrderById.and.returnValue(of(mockWorkOrder));
    mockUserService.getSession.and.returnValue(mockUserSession);

    await TestBed.configureTestingModule({
      imports: [
        WorkOrderDetailViewComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: WorkOrderService, useValue: mockWorkOrderService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderDetailViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load work order on init', () => {
    component.ngOnInit();
    
    expect(mockWorkOrderService.getWorkOrderById).toHaveBeenCalledWith(1);
    expect(component.workOrder).toEqual(mockWorkOrder);
  });

  it('should initialize context correctly for technician', () => {
    component.ngOnInit();
    
    expect(component.context.currentUserId).toBe(1);
    expect(component.context.isTechnician).toBe(true);
    expect(component.context.isAdmin).toBe(false);
    expect(component.context.isUserJoined).toBe(true);
  });

  it('should calculate permissions correctly for joined technician', () => {
    component.ngOnInit();
    
    expect(component.context.permissions.canJoin).toBe(false); // Already joined
    expect(component.context.permissions.canLeave).toBe(true);
    expect(component.context.permissions.canEditMaterials).toBe(true);
    expect(component.context.permissions.canComment).toBe(true);
  });

  it('should set active section correctly', () => {
    component.setActiveSection('materials');
    
    expect(component.activeSection).toBe('materials');
  });

  it('should join work order successfully', () => {
    const updatedOrder = { ...mockWorkOrder, technicians: [...mockWorkOrder.technicians, { technicianId: 2, joinedAt: new Date().toISOString() }] };
    mockWorkOrderService.joinWorkOrder.and.returnValue(of(updatedOrder));
    
    component.workOrder = { ...mockWorkOrder, technicians: [] }; // Not joined initially
    component.context.isUserJoined = false;
    component.context.permissions.canJoin = true;
    
    component.joinWorkOrder();
    
    expect(mockWorkOrderService.joinWorkOrder).toHaveBeenCalledWith(1, 1);
  });

  it('should add comment successfully', () => {
    const updatedOrder = { ...mockWorkOrder };
    mockWorkOrderService.addComment.and.returnValue(of(updatedOrder));
    
    component.workOrder = mockWorkOrder;
    component.context.permissions.canComment = true;
    component.newComment = 'Test new comment';
    
    component.addComment();
    
    expect(mockWorkOrderService.addComment).toHaveBeenCalledWith(1, 1, 'Test new comment');
    expect(component.newComment).toBe('');
  });

  it('should update materials successfully', () => {
    const updatedOrder = { ...mockWorkOrder };
    mockWorkOrderService.updateMaterials.and.returnValue(of(updatedOrder));
    
    component.workOrder = mockWorkOrder;
    component.materialsForm.patchValue({
      materials: [
        {
          id: 1,
          itemId: 1,
          itemSku: 'TEST-001',
          itemName: 'Updated Material',
          requestedQty: 10,
          finalQty: 0
        }
      ]
    });
    
    component.saveMaterials();
    
    expect(mockWorkOrderService.updateMaterials).toHaveBeenCalled();
  });

  it('should complete work order successfully', () => {
    const updatedOrder = { ...mockWorkOrder, status: WorkOrderStatus.COMPLETED };
    mockWorkOrderService.completeWorkOrder.and.returnValue(of(updatedOrder));
    
    component.workOrder = mockWorkOrder;
    component.context.permissions.canComplete = true;
    component.conclusions = 'Work completed successfully';
    
    // Test the modal opening
    component.openCompletionModal();
    expect(component.showCompletionModal).toBe(true);
    
    component.closeCompletionModal();
    expect(component.showCompletionModal).toBe(false);
  });

  it('should calculate progress percentage correctly', () => {
    component.workOrder = { ...mockWorkOrder, status: WorkOrderStatus.IN_EXECUTION };
    
    const progress = component.getProgressPercentage();
    
    expect(progress).toBe(90);
  });

  it('should get status color correctly', () => {
    const color = component.getStatusColor(WorkOrderStatus.PUBLISHED);
    
    expect(color).toBe('#4ECDC4');
  });

  it('should get status icon correctly', () => {
    const icon = component.getStatusIcon(WorkOrderStatus.PUBLISHED);
    
    expect(icon).toBe('icon-megaphone');
  });

  it('should format date correctly', () => {
    const testDate = '2023-12-25';
    const formattedDate = component.formatDate(testDate);
    
    expect(formattedDate).toContain('25');
    expect(formattedDate).toContain('12');
    expect(formattedDate).toContain('2023');
  });

  it('should handle undefined date gracefully', () => {
    const formattedDate = component.formatDate(undefined);
    
    expect(formattedDate).toBe('Sin fecha');
  });

  it('should get user name correctly', () => {
    component.context.currentUserId = 1;
    
    expect(component.getUserName(1)).toBe('Tú');
    expect(component.getUserName(2)).toBe('Usuario 2');
  });

  it('should open and close modals correctly', () => {
    // Test schedule modal
    component.context.permissions.canSchedule = true;
    component.openScheduleModal();
    expect(component.showScheduleModal).toBe(true);
    
    component.closeScheduleModal();
    expect(component.showScheduleModal).toBe(false);
    
    // Test materials modal
    component.context.permissions.canEditMaterials = true;
    component.openMaterialsModal();
    expect(component.showMaterialsModal).toBe(true);
    
    component.closeMaterialsModal();
    expect(component.showMaterialsModal).toBe(false);
  });

  it('should enable auto-refresh for in-execution orders', () => {
    component.workOrder = { ...mockWorkOrder, status: WorkOrderStatus.IN_EXECUTION };
    component.context.isUserJoined = true;
    
    component['enableAutoRefreshIfNeeded']();
    
    expect(component.autoRefreshEnabled).toBe(true);
  });

  it('should navigate back correctly based on user role', () => {
    // Test admin navigation
    component.context.isAdmin = true;
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ordenes-trabajo/admin']);
    
    // Test technician navigation
    component.context.isAdmin = false;
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ordenes-trabajo/tecnico']);
  });

  it('should handle file selection for photo upload', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: { files: [mockFile] }
    };
    
    component.onFileSelected(mockEvent);
    
    expect(component.selectedPhotoFile).toBe(mockFile);
  });

  it('should add and remove materials correctly', () => {
    component.addMaterial();
    
    expect(component.materialsArray.length).toBe(1);
    
    component.removeMaterial(0);
    
    expect(component.materialsArray.length).toBe(0);
  });
}); 