import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderFormModalComponent } from './purchase-order-form-modal.component';

describe('PurchaseOrderFormModalComponent', () => {
  let component: PurchaseOrderFormModalComponent;
  let fixture: ComponentFixture<PurchaseOrderFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
