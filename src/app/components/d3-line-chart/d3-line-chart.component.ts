import { Component, OnInit, Input, AfterViewInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {PropertyFinancialsService} from '../../shared/services/propertyfinancials.service';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-d3-line-chart',
  templateUrl: './d3-line-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./d3-line-chart.component.css']
})
export class D3LineChartComponent implements OnInit {
  @Input() options: {
    margin:{ top: number, right: number, bottom: number, left: number},
    yTitle: string,
    xTitle: string,
    primaryXColumn: string,
    primaryYColumn: string,
    size: {width: number, height: number},
    xExtent: {min: number, max: number},
    yExtent: {min: number, max: number}};
  @Input() inputData: any;
  @Input() chartId: string;

  propertyFinancialsService: PropertyFinancialsService;
  data: any;
  transformedData: any;
  svg: any;
  g: any;
  width: number;
  height: number;
  svgWidth: number;
  svgHeight: number;
  x;
  y;
  z;
  line;

  constructor(propertyFinancialsService: PropertyFinancialsService) {
    this.propertyFinancialsService = propertyFinancialsService;
  }

  ngOnInit() {
    this.svgWidth = this.options.size.width;
    this.svgHeight = this.options.size.height;
    let xColumnName = this.options.primaryXColumn;
    let yColumnName = this.options.primaryYColumn;
    this.data = this.inputData.map((v) => v['xColumnName']);

    let columnHeaders = Object.keys(this.inputData[0]);
    this.transformedData = [];
    for(let j = 0; j < columnHeaders.length; j++){
      if(columnHeaders[j] != xColumnName){
        this.transformedData.push({id: columnHeaders[j], values: []});
      }
    }

    for(let i = 0; i < this.inputData.length; i++){
      for(let j = 0; j < this.transformedData.length; j++){
        let value = {};
        value[xColumnName] = this.inputData[i][xColumnName];
        value['amount'] = this.inputData[i][this.transformedData[j].id];
        this.transformedData[j].values.push(value);
      }
    }

  }

  ngAfterViewInit(){
    this.initChart();
    this.drawAxis();
    this.drawPath();
  }

  private initChart(): void {
    this.svg = d3.select('svg#'+this.chartId);
    this.width = this.options.size.width - this.options.margin.left - this.options.margin.right-50;
    this.height = this.options.size.height - this.options.margin.top - this.options.margin.bottom;
    this.g = this.svg.append('g').attr('transform', 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')');
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);
    let xColumnName = this.options.primaryXColumn;
    let yColumnName = this.options.primaryYColumn;

    this.line = d3Shape.line()
        .curve(d3Shape.curveBasis)
        .x( (d: any) => this.x(d[xColumnName]) )
        .y( (d: any) => this.y(d['amount']) );

    let xExtentMin = this.options.xExtent.min == undefined ? d3Array.min(this.inputData, function(c) { return c[xColumnName]}) : this.options.xExtent.min;
    let xExtentMax = this.options.xExtent.max == undefined ? d3Array.max(this.inputData, function(c) { return c[xColumnName]}) : this.options.xExtent.max;
    let yExtentMin = this.options.yExtent.min == undefined ? d3Array.min(this.inputData, function(c) { return c[yColumnName]}) : this.options.yExtent.min;
    let yExtentMax = this.options.yExtent.max == undefined ? d3Array.max(this.inputData, function(c) { return c[yColumnName]}) : this.options.yExtent.max;
    this.x.domain([xExtentMin, xExtentMax]);
    this.y.domain([yExtentMin, yExtentMax]);
    this.z.domain(this.transformedData.map(function(c) { return c.id; }));
  }

  private drawAxis(): void {
    this.g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x))
        .append('text')
        .attr('x', this.width)
        .attr('y', 17)
        .attr('dy', '0.71em')
        .attr('font-size','15px')
        .attr('fill', '#000')
        .text(this.options.xTitle);

    this.g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('font-size','15px')
        .attr('dy', '0.71em')
        .attr('fill', '#000')
        .text(this.options.yTitle);
  }

  private drawPath(): void {
    let pFService = this.propertyFinancialsService;
    let dataDimension = this.g.selectAll('.dataLine')
        .data(this.transformedData, (c) => c.id)
        .enter().append('g')
        .attr('class', 'dataLine');

    dataDimension.append('path')
        .attr('class', 'line')
        .attr('d', (d) => this.line(d.values) )
        .style('stroke', (d) => this.z(d.id) );

    dataDimension.append('text')
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr('transform', (d) => 'translate(' + this.x(d.value.month) + ',' + this.y(d.value.amount) + ')' )
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font', '10px sans-serif')
        .text(function(d) { return d.id + ": " + pFService.numberWithCommas(Math.round(d.value.amount));});
  }

}
