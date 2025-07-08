import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { WorkOrderTechnicianViewComponent } from './work-order-technician-view.component';
import { WorkOrderService } from '../../services/work-order.service';
import { UserService } from '../../../../core/services/user.service';
import { WorkOrderStatus } from '../../models/work-order-status.entity';

describe('WorkOrderTechnicianViewComponent', () => {
  let component: WorkOrderTechnicianViewComponent;
  let fixture: ComponentFixture<WorkOrderTechnicianViewComponent>;
  let mockWorkOrderService: jasmine.SpyObj<WorkOrderService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for services
    mockWorkOrderService = jasmine.createSpyObj('WorkOrderService', [
      'getWorkOrdersByStatus',
      'joinWorkOrder',
      'leaveWorkOrder',
      'startExecution',
      'updateMaterials'
    ]);
    
    mockUserService = jasmine.createSpyObj('UserService', ['getSession']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Setup default return values
    mockWorkOrderService.getWorkOrdersByStatus.and.returnValue(of([]));
    mockUserService.getSession.and.returnValue({
      userId: '1',
      token: 'mock-token',
      expiration: new Date(),
      roles: ['ROLE_TECHNICAL'],
      name: 'Test Technician',
      username: 'test.technician'
    });

    await TestBed.configureTestingModule({
      imports: [
        WorkOrderTechnicianViewComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: WorkOrderService, useValue: mockWorkOrderService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderTechnicianViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user on ngOnInit', () => {
    component.ngOnInit();
    
    expect(component.currentUserId).toBe(1);
    expect(component.isTechnician).toBe(true);
  });

  it('should load technician data on initialization', () => {
    component.ngOnInit();
    
    expect(mockWorkOrderService.getWorkOrdersByStatus).toHaveBeenCalledWith(WorkOrderStatus.PUBLISHED);
    expect(mockWorkOrderService.getWorkOrdersByStatus).toHaveBeenCalledWith(WorkOrderStatus.PENDING_EXECUTION);
    expect(mockWorkOrderService.getWorkOrdersByStatus).toHaveBeenCalledWith(WorkOrderStatus.IN_EXECUTION);
    expect(mockWorkOrderService.getWorkOrdersByStatus).toHaveBeenCalledWith(WorkOrderStatus.COMPLETED);
  });

  it('should redirect non-technicians to admin view', () => {
    mockUserService.getSession.and.returnValue({
      userId: '1',
      token: 'mock-token',
      expiration: new Date(),
      roles: ['ROLE_ADMIN'],
      name: 'Test Admin',
      username: 'test.admin'
    });
    
    component.ngOnInit();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/ordenes-trabajo/admin']);
  });

  it('should set active tab correctly', () => {
    component.setActiveTab('available');
    
    expect(component.activeTab).toBe('available');
    expect(component.selectedOrder).toBeNull();
  });

  it('should check if user is joined to order', () => {
    const mockOrder = {
      id: 1,
      technicians: [
        { technicianId: 1 },
        { technicianId: 2 }
      ]
    } as any;
    
    component.currentUserId = 1;
    
    const isJoined = component.isUserJoined(mockOrder);
    
    expect(isJoined).toBe(true);
  });

  it('should check if user can join order', () => {
    const mockOrder = {
      id: 1,
      technicians: [],
      maxTechnicians: 3,
      requiredSkillIds: [1, 2]
    } as any;
    
    component.currentUserId = 1;
    
    const canJoin = component.canJoinOrder(mockOrder);
    
    expect(canJoin).toBe(true);
  });

  it('should join order successfully', () => {
    const mockOrder = { id: 1 } as any;
    const updatedOrder = { id: 1, technicians: [{ technicianId: 1 }] } as any;
    
    mockWorkOrderService.joinWorkOrder.and.returnValue(of(updatedOrder));
    component.publishedOrders = [mockOrder];
    
    component.joinOrder(1);
    
    expect(mockWorkOrderService.joinWorkOrder).toHaveBeenCalledWith(1, 0);
  });

  it('should open leave modal', () => {
    const mockOrder = { id: 1, title: 'Test Order' } as any;
    
    component.openLeaveModal(mockOrder);
    
    expect(component.selectedOrder).toBe(mockOrder);
    expect(component.showLeaveModal).toBe(true);
    expect(component.leaveReason).toBe('');
  });

  it('should close leave modal', () => {
    component.selectedOrder = { id: 1 } as any;
    component.showLeaveModal = true;
    component.leaveReason = 'test reason';
    
    component.closeLeaveModal();
    
    expect(component.selectedOrder).toBeNull();
    expect(component.showLeaveModal).toBe(false);
    expect(component.leaveReason).toBe('');
  });

  it('should format date correctly', () => {
    const testDate = '2023-12-25';
    const formattedDate = component.formatDate(testDate);
    
    expect(formattedDate).toContain('25');
    expect(formattedDate).toContain('12');
    expect(formattedDate).toContain('2023');
  });

  it('should format time correctly', () => {
    const testTime = '14:30';
    const formattedTime = component.formatTime(testTime);
    
    expect(formattedTime).toBe('14:30');
  });

  it('should handle undefined date gracefully', () => {
    const formattedDate = component.formatDate(undefined);
    
    expect(formattedDate).toBe('Sin fecha');
  });

  it('should handle undefined time gracefully', () => {
    const formattedTime = component.formatTime(undefined);
    
    expect(formattedTime).toBe('Sin hora');
  });

  it('should get skill names correctly', () => {
    const skillNames = component.getSkillNames([1, 2]);
    
    expect(skillNames).toBe('Electricidad, Mecánica');
  });

  it('should get status color correctly', () => {
    const color = component.getStatusColor(WorkOrderStatus.PUBLISHED);
    
    expect(color).toBe('#4ECDC4');
  });

  it('should get status icon correctly', () => {
    const icon = component.getStatusIcon(WorkOrderStatus.PUBLISHED);
    
    expect(icon).toBe('icon-megaphone');
  });
}); 