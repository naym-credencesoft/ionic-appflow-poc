import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
import { TodaysRateAndAvailabilityPage } from './todays-rate-and-availability.page';

const routes: Routes = [
  {
    path: '',
    component: TodaysRateAndAvailabilityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompModuleModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TodaysRateAndAvailabilityPage]
})
export class TodaysRateAndAvailabilityPageModule {}
