import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddOrUpdatePlanPageRoutingModule } from './add-or-update-plan-routing.module';

import { AddOrUpdatePlanPage } from './add-or-update-plan.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    AddOrUpdatePlanPageRoutingModule
  ],
  declarations: [AddOrUpdatePlanPage]
})
export class AddOrUpdatePlanPageModule {}
