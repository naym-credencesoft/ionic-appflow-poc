import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRoomPlanPageRoutingModule } from './add-room-plan-routing.module';

import { AddRoomPlanPage } from './add-room-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddRoomPlanPageRoutingModule
  ],
  declarations: [AddRoomPlanPage]
})
export class AddRoomPlanPageModule {}
