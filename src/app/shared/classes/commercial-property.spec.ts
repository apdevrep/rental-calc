import { CommercialProperty } from './commercial-property';

describe('CommercialProperty', () => {
  const test71ARMCommercial: CommercialProperty = new CommercialProperty(100000,0.20,5000,10000,1000,0.05,100,1000,1000,.01,.10,.10,120000,0,.03,.03,.03,.06,25,7,1,.02,.005,.04,1000,2);
  const test10DownCommercial: CommercialProperty = new CommercialProperty(100000,.1,0,0,1000,.05,0,0,0);
  const test0DownCommercial: CommercialProperty = new CommercialProperty(100000,0,0,0,1000,.05,0,0,0);
  const test0IncomeCommercial: CommercialProperty = new CommercialProperty(100000,.2,0,0,0,.05,0,0,0);
  const testUndefinedHoaCommercial: CommercialProperty = new CommercialProperty(100000,.2,0,0,0,.05,undefined,0,0);

  it('#getAnnualPropertyExpenses still return a number if hoa is not defined', () => {
    expect(testUndefinedHoaCommercial.getAnnualPropertyExpenses()).toEqual(1000);
  })
  it('#getAnnualPropertyExpenses should return sum of re-leasing costs, hoa fees, taxes, insurance, maintenance', () => {
    expect(test71ARMCommercial.getAnnualPropertyExpenses()).toEqual(3600);
  })

  it('#getAnnualPropertyIncome should return 0 if income is 0', () => {
    expect(test0IncomeCommercial.getTotalCashInvested()).toEqual(20000);
  })
  it('#getAnnualPropertyIncome should return annual gross total income, minus vacancy and management fees', () => {
    expect(test71ARMCommercial.getTotalCashInvested()).toEqual(35000);
  })

  it('#getTotalCashInvested should return 0 if downpayment, closing costs, and rehab budget are 0', () => {
    expect(test0DownCommercial.getTotalCashInvested()).toEqual(0);
  })
  it('#getTotalCashInvested should return sum of downpayment, closing costs, and rehab budget', () => {
    expect(test71ARMCommercial.getTotalCashInvested()).toEqual(20000+10000+5000);
  })
});
