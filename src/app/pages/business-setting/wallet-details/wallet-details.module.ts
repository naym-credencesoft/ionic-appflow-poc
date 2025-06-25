import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletDetailsPageRoutingModule } from './wallet-details-routing.module';

import { WalletDetailsPage } from './wallet-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WalletDetailsPageRoutingModule
  ],
  declarations: [WalletDetailsPage]
})
export class WalletDetailsPageModule {}
