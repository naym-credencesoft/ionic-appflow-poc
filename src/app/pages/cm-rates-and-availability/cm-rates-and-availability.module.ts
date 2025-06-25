import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CmRatesAndAvailabilityPageRoutingModule } from './cm-rates-and-availability-routing.module';

import { CmRatesAndAvailabilityPage } from './cm-rates-and-availability.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CmRatesAndAvailabilityPageRoutingModule
  ],
  declarations: [CmRatesAndAvailabilityPage]
})
export class CmRatesAndAvailabilityPageModule {}
