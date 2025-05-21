import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanItemBoardComponent } from './plan-item-board.component';

describe('PlanItemBoardComponent', () => {
  let component: PlanItemBoardComponent;
  let fixture: ComponentFixture<PlanItemBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanItemBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanItemBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
