import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleViewComponent } from './title-view.component';

describe('TitleViewComponent', () => {
  let component: TitleViewComponent;
  let fixture: ComponentFixture<TitleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
