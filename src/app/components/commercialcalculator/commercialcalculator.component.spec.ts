import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialCalculatorComponent } from './commercialcalculator.component';

describe('CommercialCalculatorComponent', () => {
  let component: CommercialCalculatorComponent;
  let fixture: ComponentFixture<CommercialCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercialCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
