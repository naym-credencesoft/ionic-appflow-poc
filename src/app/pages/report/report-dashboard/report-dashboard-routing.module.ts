import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportDashboardPage } from './report-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: ReportDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportDashboardPageRoutingModule {}
