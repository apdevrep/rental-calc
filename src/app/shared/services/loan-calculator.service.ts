import { Injectable } from '@angular/core';
import { Property } from '../interfaces/property';

@Injectable({
  providedIn: 'root'
})
export class LoanCalculatorService {

  constructor() { }

  getLoanPayment(property: Property){
    let p: number = property.purchasePrice*(1-property.downPayment);
    let i: number = property.interestRate/12;
    let n: number = property.amortPeriod*12;
    if(n == 0){
      return 0;
    } else if(i == 0){
      return p/n;
    }
    if(i<=0){
      return p/n;
    }
    let mortgageAmount: number = p * i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1);
    return Math.round(mortgageAmount*100)/100;
  }

  getLoanPaymentWithPMI(property: Property){
    let initialPrincipal = property.purchasePrice*(1-property.downPayment);
    let mortgageAmount = this.getLoanPayment(property);
    if(property.downPayment < 0.2) {
      mortgageAmount += initialPrincipal*.006/12;
    }
    return mortgageAmount;
  }

  getARMLoanPayment(loanAmount: number, interestRate: number, amortPeriod: number){
    if(amortPeriod == 0){
      return 0;
    } else if(interestRate == 0){
      return loanAmount/amortPeriod;
    }
    let mortgageAmount = loanAmount * interestRate * Math.pow(1+interestRate, amortPeriod) / (Math.pow(1+interestRate, amortPeriod)-1);
    return Math.round(mortgageAmount*100)/100;
  }

  getCumulativePrincipal(property: Property, firstMonth: number, lastMonth: number){
    let amortizationSchedule = this.getAmortizationSchedule(property);
    let totalPrincipal: number = 0;
    for(let i = firstMonth; i <= lastMonth; i++){
      totalPrincipal += amortizationSchedule[i].principalPayment;
    }
    return totalPrincipal;
  }

  getAmortizationSchedule(property: Property){
    let amortPeriod = property.amortPeriod;
    let initFixedPeriod = property.initFixedPeriod;
    let jumpPeriod = property.readjPeriod;
    let initIntJump = property.initIntJump;
    let otherIntJumps = property.otherIntJumps;
    let lifetimeMaxIntJump = property.maxIntRate;

    let initialPrincipal = Math.round(property.purchasePrice*(1-property.downPayment)*100)/100;
    let paymentAmount = this.getARMLoanPayment(initialPrincipal,property.interestRate/12,amortPeriod*12);
    let month = 0;
    let interestRate = property.interestRate/12;
    let amortizationSchedule = [{month: month,
      totalPayment: 0,
      interestPayment: 0,
      principalPayment: 0,
      balance: initialPrincipal}];
    month++;
    //handle initial fixed perid
    for(let i = 1; i <= initFixedPeriod*12; i++){
      let interest = Math.round(amortizationSchedule[month-1].balance*interestRate*100)/100;
      let paymentAmountPMI = paymentAmount;
      if(property.downPayment < .2 && amortizationSchedule[month-1].balance > property.purchasePrice*.78){
        paymentAmountPMI += amortizationSchedule[0].balance*.01/12;
      }
      amortizationSchedule.push({month: month,
        totalPayment: paymentAmountPMI,
        interestPayment: interest,
        principalPayment: paymentAmount-interest,
        balance: amortizationSchedule[month-1].balance-(paymentAmount-interest)});
      month++;
    }
    //handle remaining interest jumps
    let remainingIntJumps = Math.min(amortPeriod-initFixedPeriod, Math.round((lifetimeMaxIntJump-initIntJump)/otherIntJumps));
    interestRate = (property.interestRate + initIntJump)/12;
    for(let i = 1; i <= remainingIntJumps; i++){
      paymentAmount = this.getARMLoanPayment(amortizationSchedule[month-1].balance,interestRate,amortPeriod*12-month+1);
      for(let j = 0; j < jumpPeriod*12; j++){
        let interest = Math.round(amortizationSchedule[month-1].balance*interestRate*100)/100;
        let paymentAmountPMI = paymentAmount;
        if(property.downPayment < .2 && amortizationSchedule[month-1].balance > property.purchasePrice*.78){
          paymentAmountPMI += amortizationSchedule[0].balance*.01/12;
        }
        amortizationSchedule.push({month: month,
          totalPayment: paymentAmountPMI,
          interestPayment: interest,
          principalPayment: paymentAmount-interest,
          balance: amortizationSchedule[month-1].balance-(paymentAmount-interest)});
        month++;
      }
      interestRate = (property.interestRate + initIntJump+i*otherIntJumps)/12;
    }
    //handle remaining payments except last one
    paymentAmount = this.getARMLoanPayment(amortizationSchedule[month-1].balance,interestRate,amortPeriod*12-month+1);
    for(let i = month; i < amortPeriod*12; i++){
      let interest = Math.round(amortizationSchedule[month-1].balance*interestRate*100)/100;
      let paymentAmountPMI = paymentAmount;
      if(property.downPayment < .2 && amortizationSchedule[month-1].balance > property.purchasePrice*.78){
        paymentAmountPMI += amortizationSchedule[0].balance*.01/12;
      }
      amortizationSchedule.push({month: month,
        totalPayment: paymentAmountPMI,
        interestPayment: interest,
        principalPayment: paymentAmount-interest,
        balance: amortizationSchedule[month-1].balance-(paymentAmount-interest)});
      month++;
    }
    //handle last payment
    let lastInterest = Math.round(amortizationSchedule[month-1].balance*interestRate*100)/100;
    let lastPrincipal = amortizationSchedule[month-1].balance;
    amortizationSchedule.push({month: month,
      totalPayment: lastInterest+lastPrincipal,
      interestPayment: lastInterest,
      principalPayment: lastPrincipal,
      balance: 0});

    return amortizationSchedule;
  }
}
