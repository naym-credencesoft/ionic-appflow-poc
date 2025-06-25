import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderReportsPage } from './order-reports.page';

const routes: Routes = [
  {
    path: '',
    component: OrderReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderReportsPageRoutingModule {}
