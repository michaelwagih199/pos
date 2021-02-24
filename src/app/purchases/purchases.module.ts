import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PurchasesBillsDetailsComponent } from './components/purchases-bills-details/purchases-bills-details.component';
import { PurchasesBillsComponent } from './components/purchases-bills/purchases-bills.component';


@NgModule({
  declarations: [PurchasesBillsComponent, PurchasesBillsDetailsComponent],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    SharedModule
  ]
})
export class PurchasesModule { }