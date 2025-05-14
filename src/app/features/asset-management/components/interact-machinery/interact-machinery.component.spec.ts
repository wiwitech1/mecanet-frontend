import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractMachineryComponent } from './interact-machinery.component';

describe('InteractMachineryComponent', () => {
  let component: InteractMachineryComponent;
  let fixture: ComponentFixture<InteractMachineryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractMachineryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractMachineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
