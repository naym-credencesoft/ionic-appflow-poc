import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDashboardPageRoutingModule } from './order-dashboard-routing.module';

import { OrderDashboardPage } from './order-dashboard.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    IonicModule,
    CompModuleModule,
    OrderDashboardPageRoutingModule
  ],
  declarations: [OrderDashboardPage]
})
export class OrderDashboardPageModule {}
