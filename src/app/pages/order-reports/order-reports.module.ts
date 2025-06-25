import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderReportsPageRoutingModule } from './order-reports-routing.module';

import { OrderReportsPage } from './order-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderReportsPageRoutingModule
  ],
  declarations: [OrderReportsPage]
})
export class OrderReportsPageModule {}
