import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrUpdatePlanPage } from './add-or-update-plan.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrUpdatePlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrUpdatePlanPageRoutingModule {}
