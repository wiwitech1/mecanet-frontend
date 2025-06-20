import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSwitcherComponent } from './time-switcher.component';

describe('TimeSwitcherComponent', () => {
  let component: TimeSwitcherComponent;
  let fixture: ComponentFixture<TimeSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSwitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
