import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VariationListPage } from './variation-list.page';

const routes: Routes = [
  {
    path: '',
    component: VariationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VariationListPageRoutingModule {}
