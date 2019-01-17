import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcInputComponent } from './calc-input.component';

describe('CalcInputComponent', () => {
  let component: CalcInputComponent;
  let fixture: ComponentFixture<CalcInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
