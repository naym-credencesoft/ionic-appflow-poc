import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderPaymentDetailsPage } from './order-payment-details.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPaymentDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPaymentDetailsPageRoutingModule {}
