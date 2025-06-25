import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccomodationDashboardPageRoutingModule } from './accomodation-dashboard-routing.module';

import { AccomodationDashboardPage } from './accomodation-dashboard.page';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompModuleModule,
    ReactiveFormsModule,
    AccomodationDashboardPageRoutingModule
  ],
  declarations: [AccomodationDashboardPage]
})
export class AccomodationDashboardPageModule {}
