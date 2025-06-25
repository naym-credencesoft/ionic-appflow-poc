import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailabilityUpdatePageRoutingModule } from './availability-update-routing.module';

import { AvailabilityUpdatePage } from './availability-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AvailabilityUpdatePageRoutingModule
  ],
  declarations: [AvailabilityUpdatePage]
})
export class AvailabilityUpdatePageModule {}
