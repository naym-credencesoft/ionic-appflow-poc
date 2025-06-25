import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterRatesAndAvailabilityPageRoutingModule } from './master-rates-and-availability-routing.module';

import { MasterRatesAndAvailabilityPage } from './master-rates-and-availability.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterRatesAndAvailabilityPageRoutingModule
  ],
  declarations: [MasterRatesAndAvailabilityPage]
})
export class MasterRatesAndAvailabilityPageModule {}
