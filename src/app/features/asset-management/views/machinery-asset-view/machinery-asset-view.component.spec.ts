import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryAssetViewComponent } from './machinery-asset-view.component';

describe('MachineryAssetViewComponent', () => {
  let component: MachineryAssetViewComponent;
  let fixture: ComponentFixture<MachineryAssetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineryAssetViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineryAssetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
