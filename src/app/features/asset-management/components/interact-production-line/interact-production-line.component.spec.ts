import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractProductionLineComponent } from './interact-production-line.component';

describe('InteractProductionLineComponent', () => {
  let component: InteractProductionLineComponent;
  let fixture: ComponentFixture<InteractProductionLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractProductionLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractProductionLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
