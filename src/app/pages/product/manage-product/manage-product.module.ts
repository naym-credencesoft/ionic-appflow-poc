import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageProductPageRoutingModule } from './manage-product-routing.module';

import { ManageProductPage } from './manage-product.page';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CompModuleModule,
    IonicModule,
    ManageProductPageRoutingModule
  ],
  declarations: [ManageProductPage]
})
export class ManageProductPageModule {}
