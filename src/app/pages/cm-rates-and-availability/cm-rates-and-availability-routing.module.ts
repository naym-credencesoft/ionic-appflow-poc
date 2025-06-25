import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmRatesAndAvailabilityPage } from './cm-rates-and-availability.page';

const routes: Routes = [
  {
    path: '',
    component: CmRatesAndAvailabilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmRatesAndAvailabilityPageRoutingModule {}
