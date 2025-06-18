import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticPlanFormComponent } from './static-plan-form.component';

describe('StaticPlanFormComponent', () => {
  let component: StaticPlanFormComponent;
  let fixture: ComponentFixture<StaticPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticPlanFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
