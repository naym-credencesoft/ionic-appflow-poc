import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageRoomPlanPage } from './manage-room-plan.page';

const routes: Routes = [
  {
    path: '',
    component: ManageRoomPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoomPlanPageRoutingModule {}
