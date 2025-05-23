import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanItemCreatorComponent } from './plan-item-creator.component';

describe('PlanItemCreatorComponent', () => {
  let component: PlanItemCreatorComponent;
  let fixture: ComponentFixture<PlanItemCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanItemCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanItemCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
