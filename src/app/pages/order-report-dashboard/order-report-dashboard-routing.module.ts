import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderReportDashboardPage } from './order-report-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: OrderReportDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderReportDashboardPageRoutingModule {}
