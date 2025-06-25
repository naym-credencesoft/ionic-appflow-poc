import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
import { RateAndAvailabilityPage } from './rate-and-availability.page';
import { from } from 'rxjs';
import { RateModuleModule } from 'src/app/component/ratesAandAvailability/rate-module/rate-module.module';
const routes: Routes = [
  {
    path: '',
    component: RateAndAvailabilityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    RateModuleModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CompModuleModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RateAndAvailabilityPage]
})
export class RateAndAvailabilityPageModule {}
