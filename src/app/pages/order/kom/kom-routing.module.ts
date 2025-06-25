import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KomPage } from './kom.page';

const routes: Routes = [
  {
    path: '',
    component: KomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KomPageRoutingModule {}
