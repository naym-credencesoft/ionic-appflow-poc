import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccomodationDashboardPage } from './accomodation-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: AccomodationDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccomodationDashboardPageRoutingModule {}
