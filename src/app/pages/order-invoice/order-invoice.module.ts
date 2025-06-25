import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderInvoicePageRoutingModule } from './order-invoice-routing.module';

import { OrderInvoicePage } from './order-invoice.page';
import { DateService } from 'src/app/service/DateService/date-service.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  
    OrderInvoicePageRoutingModule
  ],
  providers: [
    DateService,
    
  ],
  declarations: [OrderInvoicePage]
})
export class OrderInvoicePageModule {}
