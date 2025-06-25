import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderDashboardPage } from './order-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: OrderDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderDashboardPageRoutingModule {}
