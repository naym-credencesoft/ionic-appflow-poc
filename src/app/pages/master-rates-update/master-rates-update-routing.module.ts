import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterRatesUpdatePage } from './master-rates-update.page';

const routes: Routes = [
  {
    path: '',
    component: MasterRatesUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRatesUpdatePageRoutingModule {}
