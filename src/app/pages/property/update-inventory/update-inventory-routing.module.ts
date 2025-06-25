import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateInventoryPage } from './update-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateInventoryPageRoutingModule {}
