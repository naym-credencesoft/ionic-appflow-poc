import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceOrderReportPageRoutingModule } from './service-order-report-routing.module';

import { ServiceOrderReportPage } from './service-order-report.page';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 30,
      outerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      animationDuration: 300,
      animation: false,
      responsive: false,
      renderOnClick: false,
      showTitle: true,
  }),
    ServiceOrderReportPageRoutingModule
  ],
  declarations: [ServiceOrderReportPage]
})
export class ServiceOrderReportPageModule {}
