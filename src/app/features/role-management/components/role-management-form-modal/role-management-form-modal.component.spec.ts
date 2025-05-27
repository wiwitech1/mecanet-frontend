import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementFormModalComponent } from './role-management-form-modal.component';

describe('RoleManagementFormModalComponent', () => {
  let component: RoleManagementFormModalComponent;
  let fixture: ComponentFixture<RoleManagementFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleManagementFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleManagementFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
