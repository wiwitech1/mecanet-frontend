import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelAdministrationComponent } from './personnel-administration.component';

describe('PersonnelAdministrationComponent', () => {
  let component: PersonnelAdministrationComponent;
  let fixture: ComponentFixture<PersonnelAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnelAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonnelAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
