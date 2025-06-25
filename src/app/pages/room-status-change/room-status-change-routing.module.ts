import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomStatusChangePage } from './room-status-change.page';

const routes: Routes = [
  {
    path: '',
    component: RoomStatusChangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomStatusChangePageRoutingModule {}
