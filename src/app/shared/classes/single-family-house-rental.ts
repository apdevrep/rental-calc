import {Property} from '../interfaces/property';

export class SingleFamilyHouseRental implements Property{
  constructor(
    public purchasePrice:number, //dollar amount
    public downPayment:number, //percent, ie 0.20
    public closingCosts:number, //dollar amount
    public rehabBudget:number, //dollar amount
    public monthlyGrossRent:number, //dollar amount
    public interestRate:number, //percent, ie 0.05
    public hoaFees:number, //dollar amount
    public annualTaxes:number, //dollar amount
    public annualInsurance:number, //dollar amount
    public maintenanceRate:number = 0.01, //percent, ie 0.01
    public vacancyRate:number = 0.1, //percent, ie 0.10
    public managementFees:number = 0.1, //percent, ie 0.10
    public afterRepairedValue:number = 0, //percent, ie 0.10
    public otherMonthlyIncome:number = 0, //dollar amount
    public inflation: number = 0.03, //percent, ie 0.01
    public appreciation: number = 0.03, //percent, ie 0.01
    public rentInflation: number = 0.03, //percent, ie 0.01
    public sellingFees: number = 0.06, //percent, ie 0.01
    public amortPeriod: number = 30,
    public initFixedPeriod: number = 0,
    public readjPeriod: number = 0,
    public initIntJump: number = 0,
    public otherIntJumps: number = 0,
    public maxIntRate: number = 0,
    public reLeasingCost: number = 0,
    public reLeasingFreq: number = 2
  ){}

  getAnnualPropertyExpenses(){
    if(this.hoaFees == undefined){
      this.hoaFees = 0;
    }
    return this.hoaFees + this.annualTaxes + this.annualInsurance + this.purchasePrice*this.maintenanceRate;
  }

  getAnnualPropertyIncome(){
    return (this.monthlyGrossRent*(1-this.vacancyRate)+this.otherMonthlyIncome)*12*(1-this.managementFees);
  }

  getTotalCashInvested(){
    return Math.round(this.purchasePrice*this.downPayment)+this.closingCosts+this.rehabBudget;
  }
}
