import {Property} from '../interfaces/property';

export class BaseProperty implements Property{
  constructor(
    public purchasePrice:number=0, //dollar amount
    public downPayment:number=0, //percent, ie 0.20
    public closingCosts:number=0, //dollar amount
    public rehabBudget:number=0, //dollar amount
    public monthlyGrossRent:number=0, //dollar amount
    public interestRate:number=0, //percent, ie 0.05
    public hoaFees:number=0, //dollar amount
    public annualTaxes:number=0, //dollar amount
    public annualInsurance:number=0, //dollar amount
    public maintenanceRate:number = 0.01, //percent, ie 0.01
    public vacancyRate:number = 0.1, //percent, ie 0.10
    public managementFees:number = 0.1, //percent, ie 0.10
    public afterRepairedValue:number = 0, //percent, ie 0.10
    public otherMonthlyIncome:number = 0, //dollar amount
    public inflation: number = 0.03, //percent, ie 0.01
    public appreciation: number = 0.03, //percent, ie 0.01
    public rentInflation: number = 0.03, //percent, ie 0.01
    public sellingFees: number = 0.06, //percent, ie 0.01
    public amortPeriod: number = 30, // years
    public initFixedPeriod: number = 0, // initial ARM fixed amount of years
    public readjPeriod: number = 0, //readjustment period for ARM in years
    public initIntJump: number = 0, //initial interest rate jump for ARM, percent ie 0.01
    public otherIntJumps: number = 0, //other interest rate jumps after initial for ARM, percent ie 0.005
    public maxIntRate: number = 0, //maximum interest rate jump from starting interest rate for ARM, percent ie 0.04
    public reLeasingCost: number = 0, //cost of releasing a property, dollar amount
    public reLeasingFreq: number = 2 //how many years between typical releasing costs, years
  ){}

  getAnnualPropertyExpenses(){
    return this.hoaFees + this.annualTaxes + this.annualInsurance + this.purchasePrice*this.maintenanceRate;
  }

  getAnnualPropertyIncome(){
    return (this.monthlyGrossRent*(1-this.vacancyRate)+this.otherMonthlyIncome)*12*(1-this.managementFees);
  }

  getTotalCashInvested(){
    return Math.round(this.purchasePrice*this.downPayment)+this.closingCosts+this.rehabBudget;
  }
}
