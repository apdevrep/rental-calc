import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialsVisualizerComponent } from './financials-visualizer.component';

describe('FinancialsVisualizerComponent', () => {
  let component: FinancialsVisualizerComponent;
  let fixture: ComponentFixture<FinancialsVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialsVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialsVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
