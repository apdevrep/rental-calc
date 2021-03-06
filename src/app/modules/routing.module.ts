import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from '../components/welcome/welcome.component';
import { SFHCalculatorComponent } from '../components/sfhcalculator/sfhcalculator.component';
import { CommercialCalculatorComponent } from '../components/commercialcalculator/commercialcalculator.component';
import { BuyRentCalculatorComponent } from '../components/buyrentcalculator/buyrentcalculator.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'sfh-calc', component: SFHCalculatorComponent},
  {path: 'buy-rent-calc', component: BuyRentCalculatorComponent},
  {path: 'commercial-calc', component: CommercialCalculatorComponent},
  {path: "**", component: WelcomeComponent}
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class RoutingModule { }
