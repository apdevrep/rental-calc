import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommercialProperty } from '../../shared/classes/commercial-property';
import { FinancialsVisualizerComponent } from '../financials-visualizer/financials-visualizer.component';
import { PropertyCacheService } from '../../shared/services/property-cache.service';
import { Property } from '../../shared/interfaces/property';
import { Calculator } from '../../shared/interfaces/calculator';
import { PropertyFinancialsService } from '../../shared/services/propertyfinancials.service';
import { FormFactoryService } from '../../shared/services/form-factory.service';
import { CalcInputComponent } from '../calc-input/calc-input.component';
import { BaseCalculator } from '../../shared/classes/base-calculator';

//This component displays the inputs, calculator results, and charts for the commercial Evaluator
@Component({
  selector: 'app-commercialcalculator',
  templateUrl: './commercialcalculator.component.html',
  styleUrls: ['./commercialcalculator.component.css']
})
export class CommercialCalculatorComponent extends BaseCalculator implements Calculator {
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
    this.property = new CommercialProperty();
    this.setupForm(this.formFactoryService.getFormControls('commercial'));
    this.resetFormOptions();
    this.resetFormControlValues();
    super.addPercentFormControlName(new Set(['vacancyRate','managementFees','initIntJump','otherIntJumps','maxIntRate','targetCapRate']));
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
    this.parentForm.controls['amortPeriod'].setValue("25");
    this.parentForm.controls['initFixedPeriod'].setValue("7");
    this.parentForm.controls['readjPeriod'].setValue("1");
    this.parentForm.controls['initIntJump'].setValue("2");
    this.parentForm.controls['otherIntJumps'].setValue("0.5");
    this.parentForm.controls['maxIntRate'].setValue("4");
    this.parentForm.controls['reLeasingCost'].setValue("0");
    this.parentForm.controls['reLeasingFreq'].setValue("2");
    this.parentForm.controls['targetCapRate'].setValue("8");
    this.parentForm.controls['targetCapRate'].setValue("8");
    this.cdr.detectChanges();
  }

  //load in any other inputs from previous save (excluding the property)
  loadOtherInputs(otherInputs: any){
    this.parentForm.controls['targetCapRate'].setValue(otherInputs.targetCapRate);
  }

  //load in previously saved property
  getPreviousSubmittedProperty(){
    let prevSavedProperty = this.propertyCacheService.getCurrentProperty('commercial');
    if(prevSavedProperty != undefined){
      this.property  = prevSavedProperty.property;
      this.initFormFromProperty(this.property, prevSavedProperty.customObject);
      this.optionsChecked = true;
    }
  }

  //initialize visualizer options
  initVizOptions(){
    //get investment metrics
    let netOpIncome = this.propertyFinancialsService.getFirstYearNetOperatingIncome(this.property);
    let annualDebtService = 12*this.propertyFinancialsService.getLoanPayment(this.property);
    let targetCapRate = Number(this.parentForm.controls['targetCapRate'].value.replace(/,/g,''))

    this.financialVisualizerOptions = {
      outputMetrics: ['cashflow', 'cashOnCashReturn','capRate','dcr','capRateWorth','ARR5','Equity5'], //setup built in metrics
      customMetrics: { // include debt coverage ratio and cap rate worth metrics
        dcr: {label: 'Debt Coverage Ratio (DCR)',
          value: Math.round(100*netOpIncome/annualDebtService)/100},
        capRateWorth: {label: 'Property Worth at '+targetCapRate+'% CAP Rate',
          value: '$'+this.propertyFinancialsService.numberWithCommas(Math.round(100*netOpIncome/targetCapRate))}
      }, //include equity chart
      charts: [{chartXY: {xTitle: 'Months', xDataColumnHeader: 'month', yTitle:'Equity, $', yDataColumnHeader: 'equity'},
        chartData: this.propertyFinancialsService.getEquitySchedule(this.property),
        chartSize: {width: 600, height: 300, xMin: 0, xMax: undefined, yMin: 0, yMax: undefined},
        chartTitle: 'Equity Growth Over Time'}]
    };
  }

  //save this file submission
  saveSubmission(){
    let customObjectToSave = {
      targetCapRate: Number(this.parentForm.controls['targetCapRate'].value.replace(/,/g,''))
    };
    this.propertyCacheService.addCurrentProperty(this.property,'commercial',customObjectToSave);
  }

}
