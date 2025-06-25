import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterRatesAndAvailabilityPage } from './master-rates-and-availability.page';

const routes: Routes = [
  {
    path: '',
    component: MasterRatesAndAvailabilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRatesAndAvailabilityPageRoutingModule {}
