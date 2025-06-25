import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateInventoryPageRoutingModule } from './update-inventory-routing.module';

import { UpdateInventoryPage } from './update-inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UpdateInventoryPageRoutingModule
  ],
  declarations: [UpdateInventoryPage]
})
export class UpdateInventoryPageModule {}
