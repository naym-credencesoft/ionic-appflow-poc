import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePropertyPage } from './manage-property.page';

const routes: Routes = [
  {
    path: '',
    component: ManagePropertyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePropertyPageRoutingModule {}
