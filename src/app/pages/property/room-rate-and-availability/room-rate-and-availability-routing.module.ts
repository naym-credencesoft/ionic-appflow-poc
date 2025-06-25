import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomRateAndAvailabilityPage } from './room-rate-and-availability.page';

const routes: Routes = [
  {
    path: '',
    component: RoomRateAndAvailabilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomRateAndAvailabilityPageRoutingModule {}
