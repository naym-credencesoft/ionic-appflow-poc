import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KotGeneratePageRoutingModule } from './kot-generate-routing.module';

import { KotGeneratePage } from './kot-generate.page';

@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    KotGeneratePageRoutingModule
  ],
  declarations: [KotGeneratePage]
})
export class KotGeneratePageModule {}
