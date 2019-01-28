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

//This component displays the inputs, calculator results, and charts for the Buy Vs Rent Evaluator
@Component({
  selector: 'app-buyrentcalculator',
  templateUrl: './buyrentcalculator.component.html',
  styleUrls: ['./buyrentcalculator.component.css']
})
export class BuyRentCalculatorComponent extends BaseCalculator implements Calculator {
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
    this.setupForm(this.formFactoryService.getFormControls('buyVsRent'));
    this.resetFormOptions();
    this.resetFormControlValues();
    super.addPercentFormControlName(new Set(['opportunityCost']));
  }

  //reset form control values to default
  resetFormControlValues(){
    this.parentForm.controls['rehabBudget'].setValue("0");
    this.parentForm.controls['maintenanceRate'].setValue("1");
    this.parentForm.controls['inflation'].setValue("3");
    this.parentForm.controls['appreciation'].setValue("3");
    this.parentForm.controls['sellingFees'].setValue("6");
    this.parentForm.controls['rentInflation'].setValue("3");
    this.parentForm.controls['opportunityCost'].setValue("4");
    this.cdr.detectChanges();
  }

  //load in any other inputs from previous save (excluding the property)
  loadOtherInputs(otherInputs: any){
    this.parentForm.controls['opportunityCost'].setValue(otherInputs.opportunityCost);
    this.parentForm.controls['otherDebt'].setValue(otherInputs.otherDebt);
  }

  //load in previously saved property
  getPreviousSubmittedProperty(){
    let prevSavedProperty = this.propertyCacheService.getCurrentProperty('buyVsRent');
    if(prevSavedProperty != undefined){
      this.property  = prevSavedProperty.property;
      this.initFormFromProperty(this.property, prevSavedProperty.customObject);
      this.optionsChecked = true;
    }
  }

  //initialize visualizer options
  initVizOptions(){
    let otherDebt = Number(this.parentForm.controls['otherDebt'].value.replace(/,/g,''));
    let opportunityCost = Number(this.parentForm.controls['opportunityCost'].value.replace(/,/g,''))/100;
    //calculate chart data
    let costSchedules: Array<any> = this.propertyFinancialsService.getCostSchedules(this.property,opportunityCost);
    let crossOverMonth: number = this.propertyFinancialsService.getBuyRentCrossOverMonth(costSchedules);
    //set up chart max X and Y axis values
    let maxMonthToShow : number = undefined;
    let largerEndColumnName = 'totalRentCost';
    if(crossOverMonth != undefined){
      maxMonthToShow = crossOverMonth+12>360 ? 360 : crossOverMonth+12;
    } else {
      maxMonthToShow = 360;
      crossOverMonth = 360;
    }
    let crossOverText = crossOverMonth <= 360 ? Math.round(crossOverMonth/12*10)/10 + ' Years' : 'Buying not better within 30 years';
    if(crossOverMonth > 359){
      largerEndColumnName = 'totalBuyCost';
    }
    //create chart options
    this.financialVisualizerOptions = {
      outputMetrics: ['buyVsRent','monthlyMortgage','affordability','upfrontCost','Equity5'], //use built in metrics
      customMetrics: { //add custom metric of affordability
        affordability: {label: 'Minimum Income Required', value: '$'+
          this.propertyFinancialsService.numberWithCommas(
            this.propertyFinancialsService.getMinimumPersonalIncomeRequired(
              this.property, otherDebt))},
        buyVsRent: {label: 'Buying is better if property held', value: crossOverText}
            },
      charts: [
        {chartXY: { //add chart of month vs total cost of buy v rent
          xTitle: 'Months', xDataColumnHeader: 'month', yTitle:'Total Cost, $', yDataColumnHeader: largerEndColumnName},
          chartData: costSchedules.slice(0,maxMonthToShow),
          chartSize: {width: 600, height: 300, xMin: 0, xMax: undefined, yMin: 0, yMax: undefined},
          chartTitle: "Buy Vs Rent Cost"},
        {chartXY: { //ad chart of month vs equity and inflation adjusted equity
          xTitle: 'Months', xDataColumnHeader: 'month', yTitle:'Equity, $', yDataColumnHeader: 'equity'},
          chartData: this.propertyFinancialsService.getEquitySchedule(this.property),
          chartSize: {width: 600, height: 300, xMin: 0, xMax: undefined, yMin: 0, yMax: undefined},
          chartTitle: "Equity Growth Over Time"}]
    };
  }

  //save this file submission
  saveSubmission(){
    let customObjectToSave = {
      otherDebt: Number(this.parentForm.controls['otherDebt'].value.replace(/,/g,'')),
      opportunityCost: Number(this.parentForm.controls['opportunityCost'].value.replace(/,/g,''))
    };
    this.propertyCacheService.addCurrentProperty(this.property,'buyVsRent',customObjectToSave);
  }

}
