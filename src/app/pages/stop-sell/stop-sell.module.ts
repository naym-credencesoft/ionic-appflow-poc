import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StopSellPageRoutingModule } from './stop-sell-routing.module';

import { StopSellPage } from './stop-sell.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StopSellPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [StopSellPage]
})
export class StopSellPageModule {}
