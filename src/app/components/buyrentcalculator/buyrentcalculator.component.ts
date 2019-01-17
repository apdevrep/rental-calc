import { Component, OnInit, ViewChild} from '@angular/core';
import { SingleFamilyHouseRental } from '../../shared/classes/single-family-house-rental';
import { FinancialsVisualizerComponent } from '../financials-visualizer/financials-visualizer.component';
import { PropertyCacheService } from '../../shared/services/property-cache.service';
import { Property } from '../../shared/interfaces/property';
import { NgForm } from '@angular/forms';
import {PropertyFinancialsService} from '../../shared/services/propertyfinancials.service';
import { CalcInputComponent } from '../calc-input/calc-input.component';

//TODO convert to Reactive Form and
//TODO use calc-input component
//TODO use pipes to format view, only use numbers everywhere else
@Component({
  selector: 'app-buyrentcalculator',
  templateUrl: './buyrentcalculator.component.html',
  styleUrls: ['./buyrentcalculator.component.css']
})
export class BuyRentCalculatorComponent implements OnInit {
  @ViewChild('form') form;
  inputTest: string;
  purchasePrice: string;
  downPayment: number;
  closingCosts: string;
  rehabBudget: string;
  monthlyGrossRent: string;
  otherMonthlyIncome: string;
  interestRate: number;
  hoaFees: string;
  annualTaxes: string;
  annualInsurance: string;
  maintenanceRate: number;
  afterRepairedValue: string;
  inflation: number;
  appreciation: number;
  rentInflation: number;
  sellingFees: number;
  otherDebt: string;
  opportunityCost: number;

  rentalProperty: SingleFamilyHouseRental;
  propertyCacheService: PropertyCacheService;
  propertyFinancialsService: PropertyFinancialsService

  optionsChecked: boolean;
  inputsCollapsed: boolean;
  invalidSubmit: boolean;
  errorMessage: string;

  placeHolderARV: string;
  placeHolderClosingCosts: string;

  financialVisualizerOptions: any;

  constructor(propertyCacheService: PropertyCacheService, propertyFinancialsService: PropertyFinancialsService) {
    this.propertyCacheService = propertyCacheService;
    this.propertyFinancialsService = propertyFinancialsService;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.inputsCollapsed = false;
    this.optionsChecked = false;
    this.rehabBudget = "0";
    this.otherMonthlyIncome = "0";
    this.maintenanceRate = 1;
    this.inflation = 3;
    this.appreciation = 3;
    this.rentInflation = 3;
    this.sellingFees = 7;
    this.opportunityCost = 4;
    this.invalidSubmit = false;
    this.afterRepairedValue = undefined;
    this.closingCosts = undefined;
  }

  initFormFromProperty(property: Property, otherInputs: any){
    if(property != undefined){
      this.purchasePrice = property.purchasePrice.toString();
      this.downPayment = Math.round(property.downPayment*1000)/10;
      this.monthlyGrossRent = property.monthlyGrossRent.toString();
      this.interestRate = Math.round(property.interestRate*1000)/10;
      this.hoaFees = property.hoaFees.toString();
      this.annualTaxes = property.annualTaxes.toString();
      this.annualInsurance = property.annualInsurance.toString();
      this.afterRepairedValue = property.afterRepairedValue.toString();
      this.closingCosts = property.closingCosts.toString();
      this.rehabBudget = property.rehabBudget.toString();
      this.otherMonthlyIncome = property.otherMonthlyIncome.toString();
      this.maintenanceRate = Math.round(property.maintenanceRate*1000)/10;
      this.inflation = Math.round(property.inflation*1000)/10;
      this.appreciation = Math.round(property.appreciation*1000)/10;
      this.rentInflation = Math.round(property.rentInflation*1000)/10;
      this.sellingFees = Math.round(property.sellingFees*1000)/10;

      if(otherInputs != undefined){
        this.otherDebt = otherInputs.otherDebt.toString();
        this.opportunityCost =  Math.round(otherInputs.opportunityCost*1000)/10;
      }

      this.inputsCollapsed = false;
      this.optionsChecked = false;
      this.invalidSubmit = false;
    }
  }

  getPreviousSubmittedProperty(){
    let prevSavedProperty = this.propertyCacheService.getCurrentProperty('buyVsRent');
    if(prevSavedProperty != undefined){
      this.rentalProperty  = prevSavedProperty.property;
      this.initFormFromProperty(this.rentalProperty, prevSavedProperty.customObject);
      this.optionsChecked = true;
    }
  }

  clearForm(){
    this.purchasePrice = undefined;
    this.downPayment = undefined;
    this.monthlyGrossRent = undefined;
    this.interestRate = undefined;
    this.hoaFees = undefined;
    this.annualTaxes = undefined;
    this.annualInsurance = undefined;
    this.initForm();
  }

  getClosingCosts(){
    if(this.purchasePrice != undefined){
      let tempClosingCosts = Number(this.purchasePrice.replace(/,/g,''))*0.03;
      if( tempClosingCosts > 5000){
        this.placeHolderClosingCosts = tempClosingCosts.toString();
        return tempClosingCosts.toString();
      } else{
        this.placeHolderClosingCosts = "5000";
        return "5,000";
      }
    } else{
      return ;
    }
  }

  getAfterRepairedValue(){
    this.placeHolderARV = this.purchasePrice;
    return this.purchasePrice;
  }

  initVizOptions(){
    let costSchedules: Array<any> = this.propertyFinancialsService.getCostSchedules(this.rentalProperty,this.opportunityCost/100);
    let crossOverMonth: number = this.propertyFinancialsService.getBuyRentCrossOverMonth(costSchedules);
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

    this.financialVisualizerOptions = {
      outputMetrics: ['buyVsRent','monthlyMortgage','affordability','upfrontCost','Equity5'],
      customMetrics: {
        affordability: {label: 'Minimum Income Required', value: '$'+
          this.propertyFinancialsService.numberWithCommas(
            this.propertyFinancialsService.getMinimumPersonalIncomeRequired(
              this.rentalProperty, Number(this.otherDebt.replace(/,/g,''))))},
        buyVsRent: {label: 'Buying is better if property held', value: crossOverText}
            },
      charts: [
        {chartXY: {
          xTitle: 'Months', xDataColumnHeader: 'month', yTitle:'Total Cost, $', yDataColumnHeader: largerEndColumnName},
          chartData: costSchedules.slice(0,maxMonthToShow),
          chartSize: {width: 600, height: 300, xMin: 0, xMax: undefined, yMin: 0, yMax: undefined},
          chartTitle: "Buy Vs Rent Cost"},
        {chartXY: {
          xTitle: 'Months', xDataColumnHeader: 'month', yTitle:'Equity, $', yDataColumnHeader: 'equity'},
          chartData: this.propertyFinancialsService.getEquitySchedule(this.rentalProperty),
          chartSize: {width: 600, height: 300, xMin: 0, xMax: undefined, yMin: 0, yMax: undefined},
          chartTitle: "Equity Growth Over Time"}]
    };
  }

  customValidation(){
    let validationPassed = true;
    if(!this.downPaymentValid()){
      validationPassed = false;
      this.errorMessage = "Downpayment must be between 0 and 100%";
    }
    return validationPassed;
  }

  downPaymentValid(){
    if(this.downPayment > 100 || this.downPayment < 0 || this.downPayment == undefined){
      return false;
    } else {
      return true;
    }
  }

  onSubmit(){
    if(this.customValidation() && this.form.valid){
      if(!this.inputsCollapsed){
        if(this.downPayment == 100){
          this.interestRate = 0;
        }
        let actualARV = this.afterRepairedValue;
        if(actualARV == undefined || actualARV == ""){
          actualARV = this.placeHolderARV;
        }
        let actualClosingCosts = this.closingCosts
        if(actualClosingCosts == undefined || actualClosingCosts == ""){
          actualClosingCosts = this.placeHolderClosingCosts.toString();
        }
        this.rentalProperty = new SingleFamilyHouseRental(
          Number(this.purchasePrice.replace(/,/g,'')),
          this.downPayment/100,
          Number(actualClosingCosts.replace(/,/g,'')),
          Number(this.rehabBudget.replace(/,/g,'')),
          Number(this.monthlyGrossRent.replace(/,/g,'')),
          this.interestRate/100,
          Number(this.hoaFees.replace(/,/g,'')),
          Number(this.annualTaxes.replace(/,/g,'')),
          Number(this.annualInsurance.replace(/,/g,'')),
          this.maintenanceRate/100,
          undefined, //vacancyRate
          undefined, //managementFees
          Number(actualARV.replace(/,/g,'')),
          Number(this.otherMonthlyIncome.replace(/,/g,'')),
          this.inflation/100,
          this.appreciation/100,
          this.rentInflation/100,
          this.sellingFees/100
        );
        this.initVizOptions();
        let customObjectToSave = {
          otherDebt: Number(this.otherDebt.replace(/,/g,'')),
          opportunityCost: this.opportunityCost/100
        };
        this.propertyCacheService.addCurrentProperty(this.rentalProperty,'buyVsRent',customObjectToSave);
      }
      this.inputsCollapsed = !this.inputsCollapsed;
      this.invalidSubmit = false;
    } else {
      this.invalidSubmit = true;
    }
  }
}
