import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailabilityUpdatePage } from './availability-update.page';

const routes: Routes = [
  {
    path: '',
    component: AvailabilityUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailabilityUpdatePageRoutingModule {}
