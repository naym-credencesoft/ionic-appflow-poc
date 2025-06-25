import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VariationListPageRoutingModule } from './variation-list-routing.module';

import { VariationListPage } from './variation-list.page';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CompModuleModule,
    IonicModule,
    VariationListPageRoutingModule
  ],
  declarations: [VariationListPage]
})
export class VariationListPageModule {}
