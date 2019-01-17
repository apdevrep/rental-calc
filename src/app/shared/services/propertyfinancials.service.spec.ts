import { TestBed } from '@angular/core/testing';

import { PropertyFinancialsService } from './propertyfinancials.service';
import { SingleFamilyHouseRental } from '../classes/single-family-house-rental';
import { Property } from '../interfaces/property';

describe('PropertyFinancialsService', () => {
  const testTypicalSFH: Property = new SingleFamilyHouseRental(100000,0.20,5000,10000,1000,0.05,100,1000,1000,.01,.10,.10,120000,0,.03,.03,.03,.06,30,0,0,0,0,0,0,2);
  const testSFH0Interest: Property = new SingleFamilyHouseRental(100000,0.20,5000,10000,1000,0,100,1000,1000,.01,.10,.10,120000,0,.03,.03,.03,.06,30,0,0,0,0,0,0,2);
  const test71ARMCommercial: Property = new SingleFamilyHouseRental(100000,0.20,5000,10000,1000,0.05,100,1000,1000,.01,.10,.10,120000,0,.03,.03,.03,.06,25,7,1,.02,.005,.04,0,2);
  const testEmptySFH: Property = new SingleFamilyHouseRental(0,0,0,0,0,0,0,0,0);
  const test0PriceSFH: Property = new SingleFamilyHouseRental(0,.2,0,0,1000,.01,0,0,0);
  const test10DownSFH: Property = new SingleFamilyHouseRental(100000,.1,0,0,1000,.05,0,0,0);
  const test10Down0IntSFH: Property = new SingleFamilyHouseRental(100000,.1,0,0,1000,0,0,0,0);
  const test100DownSFH: Property = new SingleFamilyHouseRental(0,1,0,0,1000,.01,0,0,0);
  const testFixerUpperSFH: Property = new SingleFamilyHouseRental(100000,.2,5000,10000,1000,.05,100,1000,1000,.01,.1,.1,150000);
  const testZeroRentSFH: Property = new SingleFamilyHouseRental(100000,.2,5000,10000,0,.05,100,1000,1000,.01,.1,.1,100000);
  let service: PropertyFinancialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [PropertyFinancialsService]});
    service = TestBed.get(PropertyFinancialsService);
  });

  it('#getMinimumPersonalIncomeRequired should return an income for an ARM loan', () => {
    let minIncome = service.getMinimumPersonalIncomeRequired(test71ARMCommercial, 0);
    expect(minIncome).toEqual(24878 );
  })
  it('#getMinimumPersonalIncomeRequired should return 0 for a SFH with 100% down', () => {
    let minIncome = service.getMinimumPersonalIncomeRequired(test100DownSFH, 0);
    expect(minIncome).toEqual(0);
  })
  it('#getMinimumPersonalIncomeRequired should return a single income for a typical SFH', () => {
    let minIncome = service.getMinimumPersonalIncomeRequired(testTypicalSFH, 0);
    expect(minIncome).toEqual(23398 );
  })
  it('#getReturnAfterYears should return Infinity if years is 0', () => {
    let returnARR = service.getReturnAfterYears(testTypicalSFH, 0);
    expect(returnARR.returnARR).toEqual(Infinity);
  })
  it('#getReturnAfterYears should return an annualized Rate', () => {
    let returnARR = service.getReturnAfterYears(testTypicalSFH, 5);
    expect(returnARR.returnARR).toBeCloseTo(0.138,2);
  })
  it('#getReturnAfterYears should return an Equity Gain, even if years is 0', () => {
    let returnARR = service.getReturnAfterYears(testTypicalSFH, 0);
    expect(returnARR.equityGain).toEqual(32800);
  })
  it('#getReturnAfterYears should return a non empty object', () => {
    let returnARR = service.getReturnAfterYears(testTypicalSFH, 5);
    expect(returnARR).toBeNonEmptyObject();
  })
  it('#getBuyRentCrossOverMonth should return 361 if buying is never better than renting', () => {
    let crossOverMonth = service.getBuyRentCrossOverMonth(service.getCostSchedules(testZeroRentSFH,0.04));
    expect(crossOverMonth).toEqual(361);
  })
  it('#getBuyRentCrossOverMonth should return 0 if buying starts off better than renting', () => {
    let crossOverMonth = service.getBuyRentCrossOverMonth(service.getCostSchedules(testFixerUpperSFH,0.04));
    expect(crossOverMonth).toEqual(0);
  })
  it('#getBuyRentCrossOverMonth should return 361 if price and rent are zero', () => {
    let crossOverMonth = service.getBuyRentCrossOverMonth(service.getCostSchedules(testEmptySFH,0.04));
    expect(crossOverMonth).toEqual(361);
  })
  it('#getBuyRentCrossOverMonth should return a month between 0 and 360 for a typical SFH', () => {
    let crossOverMonth = service.getBuyRentCrossOverMonth(service.getCostSchedules(testTypicalSFH,0.04));
    expect(crossOverMonth).toEqual(5);
  })
  it('#getCostSchedules should be equal to 1 month rent at month 0 for totalRentCost', () => {
    let costSchedule = service.getCostSchedules(testTypicalSFH,0.04);
    expect(costSchedule[0].totalRentCost).toEqual(1000);
  })
  it('#getCostSchedules should calculate totalBuyCost for ARM Loans', () => {
    let costSchedule = service.getCostSchedules(test71ARMCommercial,0);
    expect(costSchedule[180].totalBuyCost).toBeCloseTo(62714,0);
  })
  it('#getCostSchedules should calculate totalBuyCost for typical SFH', () => {
    let costSchedule = service.getCostSchedules(testTypicalSFH,0.04);
    expect(costSchedule[36].totalBuyCost).toBeCloseTo(17969,-1);
  })
  it('#getCostSchedules should be be populated with 0s in totalRentCost if rent = 0', () => {
    let costSchedule = service.getCostSchedules(testEmptySFH,0);
    expect(costSchedule[97].totalRentCost).toEqual(0);
  })
  it('#getCostSchedules should be be populated with 0s in totalBuyCost if price = 0', () => {
    let costSchedule = service.getCostSchedules(test0PriceSFH,0);
    expect(costSchedule[97].totalBuyCost).toEqual(0);
  })
  it('#getPITI should calculate PITI', () => {
    let piti = service.getPITI(testTypicalSFH);
    expect(piti).toBeCloseTo(600,-1);
  })
  it('#getPITI should return 0 PITI for an empty Property', ()=> {
    let piti = service.getPITI(testEmptySFH);
    expect(piti).toEqual(0);
  })
  it('#getLoanPayment should calculate Loan Payments for a 7/1 ARM with 25 Year Amortization', () => {
    let loan = service.getLoanPayment(test71ARMCommercial);
    expect(loan).toBeCloseTo(467,-1);
  })
  it('#getLoanPayment should calculate Loan Payments for a 30 year fixed loan', () => {
    let loan = service.getLoanPayment(testTypicalSFH);
    expect(loan).toBeCloseTo(429, -1);
  })
  it('#getLoanPayment should calculate Loan Payments = 0 if price = 0', () => {
    let loan = service.getLoanPayment(testEmptySFH);
    expect(loan).toEqual(0);
  })
  it('#getLoanPayment should return only principal payments for loan, if interest rate is 0', () => {
    let loan = service.getLoanPayment(testSFH0Interest);
    expect(loan).toBeCloseTo(222.22,2);
  })
  it('#getFirstYearNetOperatingIncome should calculate first year NOI', ()=> {
    let noi = service.getFirstYearNetOperatingIncome(testTypicalSFH);
    expect(noi).toBeCloseTo(6620, -1);
  })
  it('#getFirstYearNetOperatingIncome should calculate first year NOI even if price = 0', ()=> {
    let noi = service.getFirstYearNetOperatingIncome(test0PriceSFH);
    expect(noi).toBeCloseTo(9720, -1);
  })
  it('#getFirstYearNetOperatingIncome should calculate first year NOI = 0 if rent & otherMonthlyIncome = 0', ()=> {
    let noi = service.getFirstYearNetOperatingIncome(testEmptySFH);
    expect(noi).toEqual(0);
  })
  it('#getFirstYearCapRate should calculate Cap Rate', () => {
    let capRate = service.getFirstYearCapRate(testTypicalSFH);
    expect(capRate).toBeCloseTo(.058,3);
  })
  it('#getFirstYearCapRate should calculate Infinite Cap Rate if price = 0 and rent > 0', () => {
    let capRate = service.getFirstYearCapRate(test0PriceSFH);
    expect(capRate).toEqual(Infinity);
  })
  it('#getFirstYearCapRate should calculate 0 Cap Rate if price = 0 and rent = 0', () => {
    let capRate = service.getFirstYearCapRate(testEmptySFH);
    expect(capRate).toEqual(0);
  })
  it('#getFirstYearCashflow should calculate Cash Flow', () => {
    let cashFlow = service.getFirstYearCashflow(testTypicalSFH);
    expect(cashFlow).toBeCloseTo(1466,0);
  })
  it('#getFirstYearCashflow should calculate Cash Flow if price and rent = 0', () => {
    let cashFlow = service.getFirstYearCashflow(testEmptySFH);
    expect(cashFlow).toEqual(0);
  })
  it('#getFirstYearCashOnCashReturn should calculate Cash on Cash Return', () => {
    let cocReturn = service.getFirstYearCashOnCashReturn(testTypicalSFH);
    expect(cocReturn).toBeCloseTo(.042,3);
  })
  it('#getFirstYearCashOnCashReturn should calculate 0 Cash on Cash Return if price and rent = 0', () => {
    let cocReturn = service.getFirstYearCashOnCashReturn(testEmptySFH);
    expect(cocReturn).toEqual(0);
  })
  it('#getFirstYearCashOnCashReturn should calculate Infinite Cash on Cash Return if price = 0 and rent > 0', () => {
    let cocReturn = service.getFirstYearCashOnCashReturn(test0PriceSFH);
    expect(cocReturn).toEqual(Infinity);
  })
  it('#numberWithCommas should add commas to number and return string of number', () => {
    let number = service.numberWithCommas(1000.2);
    expect(number).toEqual('1,000.2');
  })
  it('#numberWithCommas should work even if given a string instead of number', () => {
    let number = service.numberWithCommas('1000.2');
    expect(number).toEqual('1,000.2');
  })
  it('#numberWithCommas should work even if given a string that already has commas', () => {
    let number = service.numberWithCommas('1,000.2');
    expect(number).toEqual('1,000.2');
  })
  it('#numberWithCommas should return string if given a non-numerical string', () => {
    let number = service.numberWithCommas('hello test');
    expect(number).toEqual('hello test');
  })
  it('#getEquitySchedule should return an array of objects', () => {
    let equitySchedule = service.getEquitySchedule(test71ARMCommercial);
    expect(equitySchedule).toBeArrayOfObjects();
  })
  it('#getEquitySchedule should return an array with length = property amortization period (in months) + 1', () => {
    let equitySchedule = service.getEquitySchedule(test71ARMCommercial);
    expect(equitySchedule).toBeArrayOfSize(test71ARMCommercial.amortPeriod*12+1);
  })
  it('#getEquitySchedule should calculate ARM mortgages', () => {
    let equitySchedule = service.getEquitySchedule(test71ARMCommercial);
    expect(equitySchedule[97].equity).toBeCloseTo(88000,-3);
  })
  it('#getEquitySchedule should calculate 30 yr fixed mortgages', () => {
    let equitySchedule = service.getEquitySchedule(testTypicalSFH);
    expect(equitySchedule[97]['inflation-adjusted']).toBeCloseTo(66000,-3);
  })
  it('#getEquitySchedule should have index equal to month', () => {
    let equitySchedule = service.getEquitySchedule(testTypicalSFH);
    expect(equitySchedule[97].month).toEqual(97);
  })
  it('#getEquitySchedule should be be populated with 0s if purchase price and rent = 0', () => {
    let equitySchedule = service.getEquitySchedule(testEmptySFH);
    expect(equitySchedule[97].equity).toEqual(0);
  })
});
