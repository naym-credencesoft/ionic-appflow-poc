import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NightAuditReportPage } from './night-audit-report.page';

const routes: Routes = [
  {
    path: '',
    component: NightAuditReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NightAuditReportPageRoutingModule {}
