import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineViewComponent } from './production-line-view.component';

describe('ProductionLineViewComponent', () => {
  let component: ProductionLineViewComponent;
  let fixture: ComponentFixture<ProductionLineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLineViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
