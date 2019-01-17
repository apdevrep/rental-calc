import { Component, OnInit, ViewChild} from '@angular/core';
import { SingleFamilyHouseRental } from '../../shared/classes/single-family-house-rental';
import { FinancialsVisualizerComponent } from '../financials-visualizer/financials-visualizer.component';
import {PropertyCacheService} from '../../shared/services/property-cache.service';
import { Property } from '../../shared/interfaces/property';
import {NgForm} from '@angular/forms';
import {PropertyFinancialsService} from '../../shared/services/propertyfinancials.service';

//TODO convert to Reactive Form and
//TODO use calc-input component
//TODO use pipes to format view, only use numbers everywhere else
@Component({
  selector: 'app-sfhcalculator',
  templateUrl: './sfhcalculator.component.html',
  styleUrls: ['./sfhcalculator.component.css']
})
export class SFHCalculatorComponent implements OnInit {
  @ViewChild('form') form;
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
  vacancyRate: number;
  managementFees: number;
  afterRepairedValue: string;
  inflation: number;
  appreciation: number;
  rentInflation: number;
  sellingFees: number;

  rentalProperty: SingleFamilyHouseRental;
  propertyCacheService: PropertyCacheService;
  propertyFinancialsService: PropertyFinancialsService;

  optionsChecked: boolean;
  inputsCollapsed: boolean;
  invalidSubmit: boolean;
  errorMessage: string;

  placeHolderARV: string;
  placeHolderClosingCosts: string;

  financialVisualizerOptions: any;

  constructor(propertyCacheService: PropertyCacheService,propertyFinancialsService: PropertyFinancialsService) {
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
    this.vacancyRate = 10;
    this.managementFees = 10;
    this.inflation = 3;
    this.appreciation = 3;
    this.rentInflation = 3;
    this.sellingFees = 7;
    this.invalidSubmit = false;
    this.afterRepairedValue = undefined;
    this.closingCosts = undefined;
  }

  initFormFromProperty(property: Property, customObject: any){
    if(property != undefined){
      this.purchasePrice = property.purchasePrice.toString();
      this.downPayment =  Math.round(property.downPayment*1000)/10;
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
      this.vacancyRate = Math.round(property.vacancyRate*1000)/10;
      this.managementFees = Math.round(property.managementFees*1000)/10;
      this.inflation = Math.round(property.inflation*1000)/10;
      this.appreciation = Math.round(property.appreciation*1000)/10;
      this.rentInflation = Math.round(property.rentInflation*1000)/10;
      this.sellingFees = Math.round(property.sellingFees*1000)/10;

      this.inputsCollapsed = false;
      this.optionsChecked = false;
      this.invalidSubmit = false;
    }
  }

  getPreviousSubmittedProperty(){
    let prevSavedProperty = this.propertyCacheService.getCurrentProperty('residential');
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
    this.financialVisualizerOptions = {
      outputMetrics: ['cashflow', 'cashOnCashReturn','capRate','ARR5','Equity5'],
      customMetrics: {},
      charts: [{chartXY: {xTitle: 'Months', xDataColumnHeader: 'month', yTitle:'Equity, $', yDataColumnHeader: 'equity'},
        chartData: this.propertyFinancialsService.getEquitySchedule(this.rentalProperty),
        chartSize: {width: 600, height: 300, xMin: 0, xMax: undefined, yMin: 0, yMax: undefined},
        chartTitle: 'Equity Growth Over Time'}]
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
          this.vacancyRate/100,
          this.managementFees/100,
          Number(actualARV.replace(/,/g,'')),
          Number(this.otherMonthlyIncome.replace(/,/g,'')),
          this.inflation/100,
          this.appreciation/100,
          this.rentInflation/100,
          this.sellingFees/100
        );
        this.initVizOptions();
        this.propertyCacheService.addCurrentProperty(this.rentalProperty,'residential', undefined);
      }
      this.inputsCollapsed = !this.inputsCollapsed;
      this.invalidSubmit = false;
    } else {
      this.invalidSubmit = true;
    }
  }
}