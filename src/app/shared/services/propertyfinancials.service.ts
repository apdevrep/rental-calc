import { Injectable } from '@angular/core';
import { Property } from '../interfaces/property';
import { LoanCalculatorService } from './loan-calculator.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyFinancialsService {
  loanCalculatorService: LoanCalculatorService

  constructor(loanCalculatorService: LoanCalculatorService) {
  this.loanCalculatorService = loanCalculatorService;
  }

  /**
   * Description.
   *
   * @param {type} name Description.
   *
   * @return {type} Description
   */
  getPITI(property: Property){
    return Math.round((this.loanCalculatorService.getLoanPaymentWithPMI(property) + property.annualTaxes/12 + property.annualInsurance/12 + property.hoaFees/12)*100)/100;
  }

  getLoanPayment(property: Property){
    return this.loanCalculatorService.getLoanPaymentWithPMI(property);
  }

  getFirstYearNetOperatingIncome(property: Property){
    return property.getAnnualPropertyIncome() - property.getAnnualPropertyExpenses();
  }

  getFirstYearCapRate(property: Property){
    let propertyCost = property.purchasePrice + property.rehabBudget + property.closingCosts;
    let propertyNOI = this.getFirstYearNetOperatingIncome(property);
    if(propertyNOI == 0){return 0;}
    return propertyNOI / propertyCost;
  }

  getFirstYearCashflow(property: Property){
    return this.getFirstYearNetOperatingIncome(property) - 12*this.loanCalculatorService.getLoanPayment(property);
  }

  getFirstYearCashOnCashReturn(property: Property){
    let cashFlow = this.getFirstYearCashflow(property);
    if(cashFlow == 0){ return 0;}
    return  cashFlow / property.getTotalCashInvested();
  }

  numberWithCommas(x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  getEquitySchedule(property: Property){
    let homeValue = property.afterRepairedValue;
    let monthlyAppreciation = Math.pow(1+property.appreciation,1/12);
    let monthlyInflation = Math.pow(1-property.inflation,1/12);
    let amortizationSchedule = this.loanCalculatorService.getAmortizationSchedule(property);
    let equity, equityCurrDollars, equitySchedule = [];

    for(let i = 0; i < amortizationSchedule.length; i++){
      homeValue = homeValue * monthlyAppreciation;
      equity = homeValue-amortizationSchedule[i].balance;
      equityCurrDollars = equity*Math.pow(monthlyInflation, i);
      equitySchedule.push({'month': amortizationSchedule[i].month, 'equity': equity, 'inflation-adjusted': equityCurrDollars});
    }
    return equitySchedule;
  }

  getCostSchedules(property: Property, opportunityAnnualCost: number){
    let amortizationSchedule = this.loanCalculatorService.getAmortizationSchedule(property);
    let upfrontCost = property.getTotalCashInvested();
    let propertyValue = property.afterRepairedValue;
    let monthlyAppreciation = Math.pow(1+property.appreciation,1/12)-1;
    let monthlySellingCosts = propertyValue*property.sellingFees;
    let monthlyEquityIncrease = propertyValue-amortizationSchedule[0].balance - upfrontCost;
    let monthlyTaxBurdenIncrease = monthlyEquityIncrease > 0 ? monthlyEquityIncrease*.2: 0;
    let taxableEquity = monthlyEquityIncrease > 0 ? monthlyEquityIncrease: 0;
    let monthlyInflation = Math.pow(1+property.inflation,1/12)-1;
    let opportunityCostMonthlyRate = Math.pow(1+opportunityAnnualCost,1/12)-1;
    let monthlyRentCost = property.monthlyGrossRent;
    let monthlyMaintCost = property.purchasePrice*property.maintenanceRate/12;
    let monthlyOppCost = upfrontCost*opportunityCostMonthlyRate;
    let totalOppCostSoFar = monthlyOppCost;
    let monthlyTaxInsHoa = property.annualTaxes/12 + property.annualInsurance/12 + property.hoaFees/12;

    let initialTaxBurden = (monthlyEquityIncrease-amortizationSchedule[0].principalPayment)*.2;

    let monthRentCost=[monthlyRentCost],
        maintCost=[monthlyMaintCost],
        equity=[(monthlyEquityIncrease + amortizationSchedule[0].principalPayment)],
        oppCost=[monthlyOppCost],
        taxInsHoaIntCost=[(amortizationSchedule[0].totalPayment + monthlyTaxInsHoa)],
        taxBurden=[initialTaxBurden > 0 ? initialTaxBurden : 0],
        sellingCosts=[monthlySellingCosts],
        totalTaxBurden = initialTaxBurden;

    for(let i = 1; i < amortizationSchedule.length ; i++){
      if(i % 12 == 0){
        //only up monthly rent cost once per end of year
        monthlyRentCost = monthlyRentCost*(1+property.rentInflation);
      }
      monthRentCost.push(monthlyRentCost);

      //Maintenace Cost
      monthlyMaintCost *= (1+monthlyInflation);
      maintCost.push(monthlyMaintCost);
      //Opportunity Cost
      monthlyOppCost = (upfrontCost+totalOppCostSoFar)*opportunityCostMonthlyRate;
      totalOppCostSoFar += monthlyOppCost;
      oppCost.push(monthlyOppCost);
      //tax, ins, hoa, interest costs
      monthlyTaxInsHoa *= (1+monthlyInflation);
      taxInsHoaIntCost.push(amortizationSchedule[i].totalPayment + monthlyTaxInsHoa);
      //equity gain
      monthlyEquityIncrease = propertyValue*monthlyAppreciation;
      propertyValue += monthlyEquityIncrease;
      equity.push((monthlyEquityIncrease + amortizationSchedule[i].principalPayment));
      //sellingCosts
      monthlySellingCosts = monthlyEquityIncrease*property.sellingFees;
      sellingCosts.push(monthlySellingCosts);
      //taxBurden
      monthlyTaxBurdenIncrease = (monthlyEquityIncrease-amortizationSchedule[i].principalPayment)*.2;
      taxableEquity = propertyValue-amortizationSchedule[i].balance-upfrontCost;
      monthlyTaxBurdenIncrease = taxableEquity > 0 ? monthlyTaxBurdenIncrease : 0;
      if(i == 24){
        if(taxableEquity < 250000){
          monthlyTaxBurdenIncrease = -totalTaxBurden;
          monthlyTaxBurdenIncrease = monthlyTaxBurdenIncrease < 0 ? monthlyTaxBurdenIncrease : 0;
        } else {
          monthlyTaxBurdenIncrease -= 50000;
        }
      } else if(i>24 && taxableEquity < 250000){
        monthlyTaxBurdenIncrease = 0;
      }
      taxBurden.push(monthlyTaxBurdenIncrease);
      totalTaxBurden += monthlyTaxBurdenIncrease;
    }

    let costSchedule = [{month: 0,
      totalRentCost: monthRentCost[0],
      totalBuyCost: maintCost[0]-equity[0]+oppCost[0]+taxInsHoaIntCost[0]+taxBurden[0]+sellingCosts[0]
    }];
    for(let i = 1; i < amortizationSchedule.length ; i++){
      costSchedule.push({month: i,
        totalRentCost: costSchedule[i-1].totalRentCost + monthRentCost[i],
        totalBuyCost: costSchedule[i-1].totalBuyCost + maintCost[i]-equity[i]+oppCost[i]+taxInsHoaIntCost[i]+taxBurden[i]+sellingCosts[i]});
    }
    return costSchedule;
  }

  getBuyRentCrossOverMonth(costSchedules: Array<any>){
    let crossOverMonth: number;
    for(let i = 0; i<costSchedules.length; i++){
      if(costSchedules[i].totalBuyCost < costSchedules[i].totalRentCost){
        return i;
      }
    }
    return costSchedules.length;
  }

  getReturnAfterYears(property: Property, years: number){
    let totalRentalIncome: number  = 0;
    let homeValue = property.afterRepairedValue;
    let loanPayment: number = this.loanCalculatorService.getLoanPayment(property);
    let annualIncome: number = property.getAnnualPropertyIncome();
    let annualExpenses: number = property.getAnnualPropertyExpenses();
    for(let i = 0; i < years; i++){
      homeValue = homeValue*(1+property.appreciation);
      totalRentalIncome += annualIncome-annualExpenses-loanPayment*12;
      annualIncome = annualIncome*(1+property.rentInflation);
      annualExpenses = annualExpenses*(1+property.inflation);
    }
    let equityGain = homeValue*(1-property.sellingFees) -
      property.purchasePrice*(1-property.downPayment) +
      this.loanCalculatorService.getCumulativePrincipal(property,0,years*12);
    let returnARR = 0;
    let investedCash = property.getTotalCashInvested();
    if(investedCash == 0 || years == 0){
      returnARR = Infinity;
    } else if(equityGain+totalRentalIncome > 0 ){
      returnARR = Math.pow((equityGain+totalRentalIncome) / property.getTotalCashInvested(),1/years)-1;
    } else {
      returnARR = -1;
    }
    return {'equityGain': equityGain,
       'returnARR': returnARR};
  }

  getMinimumPersonalIncomeRequired(property: Property, otherMonthlyDebtPayments: number){
    let monthlyPITI = this.getPITI(property);
    return Math.round(Math.max(monthlyPITI/.31, (monthlyPITI+otherMonthlyDebtPayments)/.43)*12);
  }
}
