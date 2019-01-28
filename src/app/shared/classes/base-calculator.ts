import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseProperty } from './base-property';
import { PropertyCacheService } from '../../shared/services/property-cache.service';
import { Property } from '../../shared/interfaces/property';
import { PropertyFinancialsService } from '../../shared/services/propertyfinancials.service';
import { FormFactoryService } from '../../shared/services/form-factory.service';

//base class, functionality extended in other calculators
export class BaseCalculator implements OnInit{
  //setup options for templates
  parentForm: FormGroup;
  property: BaseProperty;
  optionsChecked: boolean;
  inputsCollapsed: boolean;
  invalidSubmit: boolean;
  financialVisualizerOptions: any;
  errorMessage = "Downpayment must be 0-100%";
  currencyInputOptions = {
    type: 'currency',
    classes: ['form-control'] };
  numberInputOptions = {
    type: 'number',
    classes: ['form-control'] };
  percentInputOptions = {
    type: 'percent',
    classes: ['form-control', 'input-percent'] };
  percentFormControlNames: Set<string> = new Set(['maintenanceRate','inflation',
    'appreciation','sellingFees','rentInflation','interestRate','downPayment']);


  constructor(public fb: FormBuilder,
    public propertyCacheService: PropertyCacheService,
    public propertyFinancialsService: PropertyFinancialsService,
    public formFactoryService: FormFactoryService,
    public cdr: ChangeDetectorRef) {
  }

  //allow subclasses to add percent form control names to set for formatting purposes
  public addPercentFormControlName(newNames: Set<string>){
    newNames.forEach((name)=>{
      this.percentFormControlNames.add(name);
    });
  }

  //initialize form with provided controls
  setupForm(formControls: any){
    this.parentForm = this.fb.group(formControls);
  }

  //clear form and reset with default values
  clearForm(){
    this.parentForm.reset();
    this.resetFormOptions();
    this.resetFormControlValues();
  }

  //reset non form group inputs
  resetFormOptions(){
    this.inputsCollapsed=false;
    this.optionsChecked=false;
    this.invalidSubmit=false;
  }

  //initialize from loaded property
  initFormFromProperty(property: Property, otherInputs: any){
    if(property != undefined){
      for(let formControl in this.parentForm.controls){
        this.parentForm.controls[formControl].setValue(property[formControl]);
        if(this.percentFormControlNames.has(formControl)){
            this.parentForm.controls[formControl].setValue(property[formControl]*100);
        }
      }
      if(otherInputs != undefined){
        this.loadOtherInputs(otherInputs);
      }
      this.resetFormOptions();
    }
  }

  downPaymentValid(){
    return this.parentForm.controls['downPayment'].valid;
  }

  //determine if closing costs has been set, if not, set with default values
  setClosingCosts(){
    let purchasePrice = this.parentForm.controls['purchasePrice'].value;
    let closingCosts = this.parentForm.controls['closingCosts'].value;
    if(!closingCosts && purchasePrice){
      let tempClosingCosts = Number(purchasePrice)*0.03;
      tempClosingCosts = tempClosingCosts > 5000 ? tempClosingCosts : 5000;
      this.parentForm.controls['closingCosts'].setValue(tempClosingCosts);
    }
  }

  //determine if after repaired value has been set, if not, set with default values
  setAfterRepairedValue(){
    let purchasePrice = this.parentForm.controls['purchasePrice'].value;
    let afterRepairedValue = this.parentForm.controls['afterRepairedValue'].value;
    if(!afterRepairedValue && purchasePrice){
      this.parentForm.controls['afterRepairedValue'].setValue(purchasePrice);
    }
  }

  //handle submit button press
  onSubmit(){
    this.setClosingCosts();
    this.setAfterRepairedValue();
    //check if form is valid
    if(this.parentForm.valid){
      //if inputs are showing, do this:
      if(!this.inputsCollapsed){
        //populate property values from form control values, removing ',' and formatting percentages
        let tempValue;
        for(let controlName in this.property){
          if(controlName != 'constructor' && this.parentForm.controls[controlName]){
            tempValue = Number(this.parentForm.controls[controlName].value.replace(/,/g,''));
            this.property[controlName] = this.percentFormControlNames.has(controlName) ? tempValue/100 : tempValue;
          }
        }
        //save and initialize viz
        this.saveSubmission();
        this.initVizOptions();
      }
      //reverse collapse/expand of inputs
      this.inputsCollapsed = !this.inputsCollapsed;
      this.invalidSubmit = false; //valid submission
    } else {
      this.invalidSubmit = true; //invalid submission, don't hide inputs or populate property
    }
  }

  //warn anyone that calls these functions that they're not supposed to be called with instantiating a child
  ngOnInit() {
    throw new Error('ngOnInit must be declared in Child');
  }
  resetFormControlValues(){
    throw new Error('resetFormControlValues must be declared in Child');
  }
  loadOtherInputs(otherInputs: any){
    throw new Error('loadOtherInputs must be declared in Child');
  }
  getPreviousSubmittedProperty(){
    throw new Error('getPreviousSubmittedProperty must be declared in Child');
  }
  initVizOptions(){
    throw new Error('initVizOptions must be declared in Child');
  }
  saveSubmission(){
    throw new Error('saveSubmission must be declared in Child');
  }

}
