import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderReportDashboardPageRoutingModule } from './order-report-dashboard-routing.module';

import { OrderReportDashboardPage } from './order-report-dashboard.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    IonicModule,
    OrderReportDashboardPageRoutingModule
  ],
  declarations: [OrderReportDashboardPage]
})
export class OrderReportDashboardPageModule {}
