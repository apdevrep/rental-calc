import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SFHCalculatorComponent } from './sfhcalculator.component';

describe('SFHCalculatorComponent', () => {
  let component: SFHCalculatorComponent;
  let fixture: ComponentFixture<SFHCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SFHCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SFHCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
