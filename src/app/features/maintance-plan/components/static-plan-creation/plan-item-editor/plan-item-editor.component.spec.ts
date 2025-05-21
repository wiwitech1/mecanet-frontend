import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanItemEditorComponent } from './plan-item-editor.component';

describe('PlanItemEditorComponent', () => {
  let component: PlanItemEditorComponent;
  let fixture: ComponentFixture<PlanItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanItemEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
