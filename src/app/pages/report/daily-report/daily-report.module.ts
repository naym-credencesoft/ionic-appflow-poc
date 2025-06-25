import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyReportPageRoutingModule } from './daily-report-routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress'
import { DailyReportPage } from './daily-report.page';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyReportPageRoutingModule,
    CompModuleModule,
    NgCircleProgressModule.forRoot(
        {
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
  ],
  declarations: [DailyReportPage]
})
export class DailyReportPageModule {}
