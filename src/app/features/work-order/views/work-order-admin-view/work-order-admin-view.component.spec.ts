import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { WorkOrderAdminViewComponent } from './work-order-admin-view.component';

describe('WorkOrderAdminViewComponent', () => {
  let component: WorkOrderAdminViewComponent;
  let fixture: ComponentFixture<WorkOrderAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WorkOrderAdminViewComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkOrderAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 