import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePropertyPageRoutingModule } from './manage-property-routing.module';

import { ManagePropertyPage } from './manage-property.page';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CompModuleModule,
    IonicModule,
    ManagePropertyPageRoutingModule
  ],
  declarations: [ManagePropertyPage]
})
export class ManagePropertyPageModule {}
