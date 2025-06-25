import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultibookinglistPage } from './multibookinglist.page';

const routes: Routes = [
  {
    path: '',
    component: MultibookinglistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultibookinglistPageRoutingModule {}
