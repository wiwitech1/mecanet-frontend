import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnetAdministrationFormModalComponent } from './personnet-administration-form-modal.component';

describe('PersonnetAdministrationFormModalComponent', () => {
  let component: PersonnetAdministrationFormModalComponent;
  let fixture: ComponentFixture<PersonnetAdministrationFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnetAdministrationFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonnetAdministrationFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
