import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyRentCalculatorComponent } from './buyrentcalculator.component';

describe('BuyRentCalculatorComponent', () => {
  let component: BuyRentCalculatorComponent;
  let fixture: ComponentFixture<BuyRentCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyRentCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyRentCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
