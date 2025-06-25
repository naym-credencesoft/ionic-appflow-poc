import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDashboardPage } from './product-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: ProductDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDashboardPageRoutingModule {}
