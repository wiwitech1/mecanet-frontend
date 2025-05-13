import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantsAssetViewComponent } from './plants-asset-view.component';

describe('PlantsAssetViewComponent', () => {
  let component: PlantsAssetViewComponent;
  let fixture: ComponentFixture<PlantsAssetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantsAssetViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantsAssetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
