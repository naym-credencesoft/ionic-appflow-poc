import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerKycListPageRoutingModule } from './customer-kyc-list-routing.module';

import { CustomerKycListPage } from './customer-kyc-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerKycListPageRoutingModule
  ],
  declarations: [CustomerKycListPage]
})
export class CustomerKycListPageModule {}
