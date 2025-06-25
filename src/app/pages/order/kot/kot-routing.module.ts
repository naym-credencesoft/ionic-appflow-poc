import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KotPage } from './kot.page';

const routes: Routes = [
  {
    path: '',
    component: KotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KotPageRoutingModule {}
