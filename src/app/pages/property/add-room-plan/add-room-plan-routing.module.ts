import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRoomPlanPage } from './add-room-plan.page';

const routes: Routes = [
  {
    path: '',
    component: AddRoomPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoomPlanPageRoutingModule {}
