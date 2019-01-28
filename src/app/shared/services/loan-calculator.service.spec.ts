import { TestBed } from '@angular/core/testing';

import { LoanCalculatorService } from './loan-calculator.service';
import { BaseProperty } from '../classes/base-property';
import { Property } from '../interfaces/property';

describe('LoanCalculatorService', () => {
  const testTypicalSFH: Property = new BaseProperty(100000,0.20,5000,10000,1000,0.05,100,1000,1000,.01,.10,.10,120000,0,.03,.03,.03,.06,30,0,0,0,0,0,0,2);
  const testSFH0Interest: Property = new BaseProperty(100000,0.20,5000,10000,1000,0,100,1000,1000,.01,.10,.10,120000,0,.03,.03,.03,.06,30,0,0,0,0,0,0,2);
  const test71ARMCommercial: Property = new BaseProperty(100000,0.20,5000,10000,1000,0.05,100,1000,1000,.01,.10,.10,120000,0,.03,.03,.03,.06,25,7,1,.02,.005,.04,0,2);
  const testEmptySFH: Property = new BaseProperty(0,0,0,0,0,0,0,0,0);
  const test0PriceSFH: Property = new BaseProperty(0,.2,0,0,1000,.01,0,0,0);
  const test10DownSFH: Property = new BaseProperty(100000,.1,0,0,1000,.05,0,0,0);
  const test10Down0IntSFH: Property = new BaseProperty(100000,.1,0,0,1000,0,0,0,0);
  const test100DownSFH: Property = new BaseProperty(0,1,0,0,1000,.01,0,0,0);
  let service: LoanCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [LoanCalculatorService]});
    service = TestBed.get(LoanCalculatorService);
  });

  it('#getLoanPayment to return 0 if downpayment = 100%', () => {
    let loanPmt = service.getLoanPayment(test100DownSFH);
    expect(loanPmt).toEqual(0);
  })
  it('#getLoanPayment to calculate 30 yr amortization period', () => {
    let loanPmt = service.getLoanPayment(testTypicalSFH);
    expect(loanPmt).toBeCloseTo(429,0);
  })
  it('#getLoanPayment to return loan amount / amortization period if interest rate is 0', () => {
    let loanPmt = service.getLoanPayment(testSFH0Interest);
    expect(loanPmt).toBeCloseTo(222.22,-2);
  })
  it('#getLoanPayment to return 0 if amortization Period is 0', () => {
    let loanPmt = service.getLoanPayment(testEmptySFH);
    expect(loanPmt).toEqual(0);
  })
  it('#getLoanPayment to return 0 if price is 0', () => {
    let loanPmt = service.getLoanPayment(test0PriceSFH);
    expect(loanPmt).toEqual(0);
  })
  it('#getLoanPaymentWithPMI to return loan amount / amortization period + PMI if interest rate is 0 and down payment < 0.2', () => {
    let loanPmt = service.getLoanPaymentWithPMI(test10Down0IntSFH);
    expect(loanPmt).toBeCloseTo(295,0);
  })
  it('#getLoanPaymentWithPMI to return 0 if property has zero price', () => {
    let loanPmt = service.getLoanPaymentWithPMI(test0PriceSFH);
    expect(loanPmt).toEqual(0);
  })
  it('#getLoanPaymentWithPMI to add PMI if downpayment < .2', () => {
    let loanPmt = service.getLoanPaymentWithPMI(test10DownSFH);
    expect(loanPmt).toBeCloseTo(528,0);
  })
  it('#getLoanPaymentWithPMI to return 0 if downpayment = 100%', () => {
    let loanPmt = service.getLoanPaymentWithPMI(test100DownSFH);
    expect(loanPmt).toEqual(0);
  })
  it('#getARMLoanPayment to calculate 30 yr amortization period', () => {
    let loanPmt = service.getARMLoanPayment(90000,0.05,30);
    expect(loanPmt).toBeCloseTo(5855,0);
  })
  it('#getARMLoanPayment to return loan amount / amortization period if interest rate is 0', () => {
    let loanPmt = service.getARMLoanPayment(90000,0,25);
    expect(loanPmt).toEqual(3600);
  })
  it('#getARMLoanPayment to return 0 if amortization Period is 0', () => {
    let loanPmt = service.getARMLoanPayment(100000,0.05,0);
    expect(loanPmt).toEqual(0);
  })
  it('#getCumulativePrincipal to return 0 if downpayment = 100%', () => {
    let cumPrincipal = service.getCumulativePrincipal(test100DownSFH,0,60);
    expect(cumPrincipal).toEqual(0);
  })
  it('#getCumulativePrincipal to return (initialLoanBalance/amortPeriod in months)*endMonth if interest is zero and cumulative period is 0 to "endMonth"', () => {
    let cumPrincipal = service.getCumulativePrincipal(testSFH0Interest,0,60);
    expect(cumPrincipal).toBeCloseTo(testSFH0Interest.purchasePrice*(1-testSFH0Interest.downPayment)/(testSFH0Interest.amortPeriod*12)*60,-2);
  })
  it('#getCumulativePrincipal to return 0 if property price is 0', () => {
    let cumPrincipal = service.getCumulativePrincipal(test0PriceSFH,0,60);
    expect(cumPrincipal).toEqual(0);
  })
  it('#getCumulativePrincipal to return 0 if periods are 0 to 0', () => {
    let cumPrincipal = service.getCumulativePrincipal(testTypicalSFH,0,0);
    expect(cumPrincipal).toEqual(0);
  })
  it('#getCumulativePrincipal to return full loan balance if periods are 0 to property amortization period (in months)', () => {
    let cumPrincipal = service.getCumulativePrincipal(testTypicalSFH,0,testTypicalSFH.amortPeriod*12);
    expect(cumPrincipal).toEqual(80000);
  })
  it('#getAmortizationSchedule to return 0 balance for all months if downpayment = 100%', () => {
    let amortSchedule = service.getAmortizationSchedule(test100DownSFH);
    expect(amortSchedule[97].balance).toEqual(0);
  })
  it('#getAmortizationSchedule to return an Array of amortization period (in months) + 1 length', () => {
    let amortSchedule = service.getAmortizationSchedule(testTypicalSFH);
    expect(amortSchedule).toBeArrayOfSize(testTypicalSFH.amortPeriod*12+1);
  })
  it('#getAmortizationSchedule last entry to have 0 balance', () => {
    let amortSchedule = service.getAmortizationSchedule(testTypicalSFH);
    expect(amortSchedule[amortSchedule.length-1].balance).toEqual(0);
  })
  it('#getAmortizationSchedule initial Entry to have only the full balance, with 0 payment', () => {
    let amortSchedule = service.getAmortizationSchedule(testTypicalSFH);
    expect(amortSchedule[0].totalPayment).toEqual(0);
  })
  it('#getAmortizationSchedule calculate schedule for ARM loans', () => {
    let amortSchedule = service.getAmortizationSchedule(test71ARMCommercial);
    expect(amortSchedule[97].balance).toBeCloseTo(64451,0);
  })
  it('#getAmortizationSchedule calculate schedule for 30yr fixed loans', () => {
    let amortSchedule = service.getAmortizationSchedule(testTypicalSFH);
    expect(amortSchedule[97].balance).toBeCloseTo(68539,0);
  })
  it('#getAmortizationSchedule should return valid, empty, schedule if provided empty Property', () => {
    let amortSchedule = service.getAmortizationSchedule(testEmptySFH);
    expect(amortSchedule[97].balance).toEqual(0);
  })
  it('#getAmortizationSchedule should return filled array with 0 for loan amounts if price = 0', () => {
    let amortSchedule = service.getAmortizationSchedule(test0PriceSFH);
    expect(amortSchedule[97].balance).toEqual(0);
  })
  it('#getAmortizationSchedule should return payments = principal payments if interest = 0', () => {
    let amortSchedule = service.getAmortizationSchedule(testSFH0Interest);
    expect(amortSchedule[97].totalPayment).toEqual(amortSchedule[97].principalPayment);
  })
});
