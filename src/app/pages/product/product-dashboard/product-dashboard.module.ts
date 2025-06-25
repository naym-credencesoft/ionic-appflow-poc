import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDashboardPageRoutingModule } from './product-dashboard-routing.module';

import { ProductDashboardPage } from './product-dashboard.page';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    CompModuleModule,
    FormsModule,
    IonicModule,
    ProductDashboardPageRoutingModule
  ],
  declarations: [ProductDashboardPage]
})
export class ProductDashboardPageModule {}
