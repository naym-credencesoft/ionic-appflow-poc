import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceOrderReportPage } from './service-order-report.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceOrderReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceOrderReportPageRoutingModule {}
