import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLinesAssetViewComponent } from './production-lines-asset-view.component';

describe('ProductionLinesAssetViewComponent', () => {
  let component: ProductionLinesAssetViewComponent;
  let fixture: ComponentFixture<ProductionLinesAssetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLinesAssetViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLinesAssetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
