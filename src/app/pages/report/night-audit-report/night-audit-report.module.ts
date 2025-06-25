import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NightAuditReportPageRoutingModule } from './night-audit-report-routing.module';

import { NightAuditReportPage } from './night-audit-report.page';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CompModuleModule,
    NgxPaginationModule,
    IonicModule,
    NightAuditReportPageRoutingModule
  ],
  declarations: [NightAuditReportPage]
})
export class NightAuditReportPageModule {}
