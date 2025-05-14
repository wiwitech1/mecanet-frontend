import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMecanetComponent } from './sidebar-mecanet.component';

describe('SidebarMecanetComponent', () => {
  let component: SidebarMecanetComponent;
  let fixture: ComponentFixture<SidebarMecanetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarMecanetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarMecanetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
