import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerKycListPage } from './customer-kyc-list.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerKycListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerKycListPageRoutingModule {}
