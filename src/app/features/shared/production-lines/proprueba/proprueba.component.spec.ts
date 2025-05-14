import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropruebaComponent } from './proprueba.component';

describe('PropruebaComponent', () => {
  let component: PropruebaComponent;
  let fixture: ComponentFixture<PropruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropruebaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
