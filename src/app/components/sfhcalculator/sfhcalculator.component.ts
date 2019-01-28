import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseProperty } from '../../shared/classes/base-property';
import { FinancialsVisualizerComponent } from '../financials-visualizer/financials-visualizer.component';
import { PropertyCacheService } from '../../shared/services/property-cache.service';
import { Property } from '../../shared/interfaces/property';
import { Calculator } from '../../shared/interfaces/calculator';
import { PropertyFinancialsService } from '../../shared/services/propertyfinancials.service';
import { FormFactoryService } from '../../shared/services/form-factory.service';
import { CalcInputComponent } from '../calc-input/calc-input.component';
import { BaseCalculator } from '../../shared/classes/base-calculator';

//This component displays the inputs, calculator results, and charts for the single family home Evaluator
@Component({
  selector: 'app-sfhcalculator',
  templateUrl: './sfhcalculator.component.html',
  styleUrls: ['./sfhcalculator.component.css']
})
export class SFHCalculatorComponent extends BaseCalculator implements Calculator {
  //pass services to parent constructor
  constructor(public fb: FormBuilder,
    public propertyCacheService: PropertyCacheService,
    public propertyFinancialsService: PropertyFinancialsService,
    public formFactoryService: FormFactoryService,
    public cdr: ChangeDetectorRef) {
      super(fb,propertyCacheService,propertyFinancialsService,formFactoryService,cdr);
  }

  //set type of new property and call functions to set up and initialize forms
  ngOnInit() {
    this.property = new BaseProperty();
    this.setupForm(this.formFactoryService.getFormControls('residential'));
    this.resetFormOptions();
    this.resetFormControlValues();
    this.addPercentFormControlName(new Set(['vacancyRate','managementFees']));
  }

  //reset form control values to default
  resetFormControlValues(){
    this.parentForm.controls['rehabBudget'].setValue("0");
    this.parentForm.controls['maintenanceRate'].setValue("1");
    this.parentForm.controls['inflation'].setValue("3");
    this.parentForm.controls['appreciation'].setValue("3");
    this.parentForm.controls['sellingFees'].setValue("6");
    this.parentForm.controls['rentInflation'].setValue("3");
    this.parentForm.controls['vacancyRate'].setValue("10");
    this.parentForm.controls['managementFees'].setValue("10");
    this.cdr.detectChanges();
  }

  //load in any other inputs from previous save (excluding the property)
  loadOtherInputs(otherInputs: any){
    //do nothing, since residential doesn't expect any other inputs
  }

  //load in previously saved property
  getPreviousSubmittedProperty(){
    let prevSavedProperty = this.propertyCacheService.getCurrentProperty('residential');
    if(prevSavedProperty != undefined){
      this.property  = prevSavedProperty.property;
      this.initFormFromProperty(this.property, prevSavedProperty.customObject);
      this.optionsChecked = true;
    }
  }

  //initialize visualizer options
  initVizOptions(){
    this.financialVisualizerOptions = {
      outputMetrics: ['cashflow', 'cashOnCashReturn','capRate','ARR5','Equity5'],//use built in metrics
      customMetrics: {},
      charts: [{chartXY: //only one chart of month vs equity and inflation adjusted equity
        {xTitle: 'Months', xDataColumnHeader: 'month', yTitle:'Equity, $', yDataColumnHeader: 'equity'},
        chartData: this.propertyFinancialsService.getEquitySchedule(this.property),
        chartSize: {width: 600, height: 300, xMin: 0, xMax: undefined, yMin: 0, yMax: undefined},
        chartTitle: 'Equity Growth Over Time'}]
    };
  }

  //save this file submission
  saveSubmission(){
    this.propertyCacheService.addCurrentProperty(this.property,'residential',undefined);
  }

}
