import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPaymentDetailsPageRoutingModule } from './order-payment-details-routing.module';

import { OrderPaymentDetailsPage } from './order-payment-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPaymentDetailsPageRoutingModule
  ],
  declarations: [OrderPaymentDetailsPage]
})
export class OrderPaymentDetailsPageModule {}
