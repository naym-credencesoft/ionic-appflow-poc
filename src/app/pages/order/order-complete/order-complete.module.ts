import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderCompletePageRoutingModule } from './order-complete-routing.module';

import { OrderCompletePage } from './order-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderCompletePageRoutingModule
  ],
  declarations: [OrderCompletePage]
})
export class OrderCompletePageModule {}
