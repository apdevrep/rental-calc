import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RoutingModule } from './modules/routing.module';
import { AppComponent } from './app.component';
import { SFHCalculatorComponent } from './components/sfhcalculator/sfhcalculator.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BuyRentCalculatorComponent } from './components/buyrentcalculator/buyrentcalculator.component';
import { CommercialCalculatorComponent } from './components/commercialcalculator/commercialcalculator.component';

import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { FinancialsVisualizerComponent } from './components/financials-visualizer/financials-visualizer.component';
import { D3LineChartComponent } from './components/d3-line-chart/d3-line-chart.component';
import { CalcInputComponent } from './components/calc-input/calc-input.component';

@NgModule({
  declarations: [
    AppComponent,
    SFHCalculatorComponent,
    WelcomeComponent,
    BuyRentCalculatorComponent,
    CommercialCalculatorComponent,
    FinancialsVisualizerComponent,
    D3LineChartComponent,
    CalcInputComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    NgxCleaveDirectiveModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
