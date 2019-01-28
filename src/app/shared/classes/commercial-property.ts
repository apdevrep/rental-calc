import {Property} from '../interfaces/property';
import {BaseProperty} from './base-property';

export class CommercialProperty extends BaseProperty implements Property{
  getAnnualPropertyExpenses(){
    return this.reLeasingCost/this.reLeasingFreq + this.hoaFees + this.annualTaxes + this.annualInsurance + this.purchasePrice*this.maintenanceRate;
  }
}
