import { Injectable } from '@angular/core';
import {Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormFactoryService {

  constructor() {
  }

  getFormControls(type: string){
    switch (type){
      case 'buyVsRent':
        return this.getBuyVRentFormControls();
        break;
      case 'residential':
        return this.getResidentialFormControls();
        break;
      case 'commercial':
        return this.getCommercialFormControls();
        break;
    }
  }

  private getBuyVRentFormControls(){
    let buyVRentControls = this.getBaseFormControls();
    buyVRentControls['hoaFees']=[undefined];
    buyVRentControls['otherDebt']=[undefined,Validators.required];
    buyVRentControls['opportunityCost']=[undefined];
    return buyVRentControls;
  }

  private getResidentialFormControls(){
    let residentialControls = this.getBaseFormControls();
    residentialControls['hoaFees']=[undefined];
    residentialControls['managementFees']=[undefined];
    residentialControls['vacancyRate']=[undefined];
    return residentialControls;
  }

  private getCommercialFormControls(){
    let commercialControls = this.getBaseFormControls();
    commercialControls['managementFees']=[undefined];
    commercialControls['vacancyRate']=[undefined];
    commercialControls['targetCapRate']=[undefined];
    commercialControls['reLeasingCost']=[undefined];
    commercialControls['reLeasingFreq']=[undefined];
    commercialControls['initFixedPeriod']=[undefined];
    commercialControls['readjPeriod']=[undefined];
    commercialControls['amortPeriod']=[undefined];
    commercialControls['initIntJump']=[undefined];
    commercialControls['otherIntJumps']=[undefined];
    commercialControls['maxIntRate']=[undefined];
    return commercialControls;
  }

  private getBaseFormControls(){
    let baseControls = {purchasePrice: [undefined,Validators.required],
      downPayment: [undefined,Validators.compose([Validators.required,Validators.min(0),Validators.max(100)])],
      closingCosts: [undefined],
      rehabBudget: [undefined],
      monthlyGrossRent: [undefined,Validators.required],
      otherMonthlyIncome: [undefined],
      interestRate: [undefined,Validators.required],
      annualTaxes: [undefined,Validators.required],
      annualInsurance: [undefined,Validators.required],
      maintenanceRate: [undefined],
      afterRepairedValue: [undefined],
      inflation: [undefined],
      appreciation: [undefined],
      rentInflation: [undefined],
      sellingFees: [undefined]};
    return baseControls;
  }
}
