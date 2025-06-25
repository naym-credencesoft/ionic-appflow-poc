import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderCompletePage } from './order-complete.page';

const routes: Routes = [
  {
    path: '',
    component: OrderCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderCompletePageRoutingModule {}
