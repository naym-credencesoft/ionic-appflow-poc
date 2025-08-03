import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KotListPage } from './kot-list.page';

const routes: Routes = [
  {
    path: '',
    component: KotListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KotListPageRoutingModule {}
