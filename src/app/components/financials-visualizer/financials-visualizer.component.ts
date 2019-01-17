import { Component, OnInit, Input } from '@angular/core';
import {Property} from '../../shared/interfaces/property';
import {PropertyFinancialsService} from '../../shared/services/propertyfinancials.service';
import {D3LineChartComponent} from '../d3-line-chart/d3-line-chart.component';

@Component({
  selector: 'app-financials-visualizer',
  templateUrl: './financials-visualizer.component.html',
  styleUrls: ['./financials-visualizer.component.css']
})
export class FinancialsVisualizerComponent implements OnInit {
  @Input() property: Property;
  @Input() vizOptions: any;
  netOperatingIncome: number;
  capRate: number;
  cashFlow: number;
  monthlyCashFlow: number;
  cashOnCashReturn: number;
  investedCapital: number;
  year5AnnualizedReturn: number;
  year5Equity: number;

  chartsArray: Array<any>;
  metricsArray: Array<any>;

  propertyFinancialsService: PropertyFinancialsService;

  constructor(propertyFinancialsService: PropertyFinancialsService) {
    this.propertyFinancialsService = propertyFinancialsService
  }

  ngOnInit() {
    this.initChartArray();
    this.initMetrics();
    this.initChartMetricsArray();
  }

  initChartArray(){
    this.chartsArray = [];
    let chartOptions: any, chartData: any;
    for(let i = 0; i < this.vizOptions.charts.length; i++){
      chartOptions = {
        margin: {top: 20, right: 80, bottom: 30, left: 50},
        yTitle: this.vizOptions.charts[i].chartXY.yTitle,
        xTitle: this.vizOptions.charts[i].chartXY.xTitle,
        primaryXColumn: this.vizOptions.charts[i].chartXY.xDataColumnHeader,
        primaryYColumn: this.vizOptions.charts[i].chartXY.yDataColumnHeader,
        size: {width: this.vizOptions.charts[i].chartSize.width, height: this.vizOptions.charts[i].chartSize.height},
        xExtent: {min: this.vizOptions.charts[i].chartSize.xMin, max: this.vizOptions.charts[i].chartSize.xMax},
        yExtent: {min: this.vizOptions.charts[i].chartSize.yMin, max: this.vizOptions.charts[i].chartSize.yMax}};
      chartData = this.vizOptions.charts[i].chartData;
      this.chartsArray.push(
        {chartTitle: this.vizOptions.charts[i].chartTitle,
          chartOptions: chartOptions,
          chartData: chartData,
          chartId: 'chart'+i});
    }
  }

  initMetrics(){
    this.investedCapital = Math.round(this.property.getTotalCashInvested());
    this.netOperatingIncome = Math.round(this.propertyFinancialsService.getFirstYearNetOperatingIncome(this.property));
    this.capRate = Math.round(this.propertyFinancialsService.getFirstYearCapRate(this.property)*1000)/10;
    this.cashFlow = Math.round(this.propertyFinancialsService.getFirstYearCashflow(this.property));
    this.monthlyCashFlow = Math.round(this.cashFlow/12);
    this.cashOnCashReturn = Math.round(this.propertyFinancialsService.getFirstYearCashOnCashReturn(this.property)*1000)/10;
    let year5Returns = this.propertyFinancialsService.getReturnAfterYears(this.property, 5);
    this.year5AnnualizedReturn = Math.round((year5Returns.returnARR-this.property.inflation)*1000)/10;
    this.year5Equity = Math.round(year5Returns.equityGain);
  }

  initChartMetricsArray(){
    let metrics = {
        cashflow: {label: 'Cashflow',
          value: '$'+
            this.propertyFinancialsService.numberWithCommas(this.cashFlow)+
            '/year ($'+
            this.propertyFinancialsService.numberWithCommas(this.monthlyCashFlow)+
            '/month)'},
        cashOnCashReturn: {label: 'Cash on Cash Return',
          value: this.cashOnCashReturn+
            '% on $'+
            this.propertyFinancialsService.numberWithCommas(this.investedCapital)+
            ' invested'},
        capRate: {label: 'Capitalization (CAP) Rate',
          value: this.capRate+
            '% from $'+
            this.propertyFinancialsService.numberWithCommas(this.netOperatingIncome)+
            '/year NOI'},
        ARR5: {label: 'Annualized 5 Year Return',
          value: this.year5AnnualizedReturn+
            '% (after inflation)'},
        Equity5: {label: 'Property Equity after 5 years',
          value: '$'+
            this.propertyFinancialsService.numberWithCommas(this.year5Equity)+
            ' (after selling costs)'},
        monthlyMortgage: {label: 'Monthly Mortgage',
          value: '$'+
            this.propertyFinancialsService.numberWithCommas(this.propertyFinancialsService.getPITI(this.property))},
        upfrontCost: {
          label: 'Upfront Cost', value: '$'+
            this.propertyFinancialsService.numberWithCommas(this.property.getTotalCashInvested())}
          };

    this.metricsArray = [];
    let metricsKey;
    for(let i = 0; i < this.vizOptions.outputMetrics.length; i++){
      metricsKey = this.vizOptions.outputMetrics[i];
      if(metrics.hasOwnProperty(metricsKey)){
        this.metricsArray.push(metrics[metricsKey]);
      } else if (this.vizOptions.customMetrics.hasOwnProperty(metricsKey)){
        this.metricsArray.push(this.vizOptions.customMetrics[metricsKey]);
      }
    }
  }
}
