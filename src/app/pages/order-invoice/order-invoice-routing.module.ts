import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderInvoicePage } from './order-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: OrderInvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderInvoicePageRoutingModule {}
