import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomRateAndAvailabilityPageRoutingModule } from './room-rate-and-availability-routing.module';

import { RoomRateAndAvailabilityPage } from './room-rate-and-availability.page';
import { RateModuleModule } from 'src/app/component/ratesAandAvailability/rate-module/rate-module.module';

@NgModule({
  imports: [
    CommonModule,
    RateModuleModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RoomRateAndAvailabilityPageRoutingModule
  ],
  declarations: [RoomRateAndAvailabilityPage]
})
export class RoomRateAndAvailabilityPageModule {}
