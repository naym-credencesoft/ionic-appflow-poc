import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterRatesUpdatePageRoutingModule } from './master-rates-update-routing.module';

import { MasterRatesUpdatePage } from './master-rates-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MasterRatesUpdatePageRoutingModule
  ],
  declarations: [MasterRatesUpdatePage]
})
export class MasterRatesUpdatePageModule {}
