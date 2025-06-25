import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KotPageRoutingModule } from './kot-routing.module';

import { KotPage } from './kot.page';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    CompModuleModule,
    FormsModule,
    IonicModule,
    KotPageRoutingModule
  ],
  declarations: [KotPage]
})
export class KotPageModule {}
