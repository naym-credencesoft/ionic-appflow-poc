import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VariationCreatePageRoutingModule } from './variation-create-routing.module';

import { VariationCreatePage } from './variation-create.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    VariationCreatePageRoutingModule
  ],
  declarations: [VariationCreatePage]
})
export class VariationCreatePageModule {}
