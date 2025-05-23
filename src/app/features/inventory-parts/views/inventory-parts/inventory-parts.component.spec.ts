import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPartsComponent } from './inventory-parts.component';

describe('InventoryPartsComponent', () => {
  let component: InventoryPartsComponent;
  let fixture: ComponentFixture<InventoryPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryPartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
