import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageRoomPlanPageRoutingModule } from './manage-room-plan-routing.module';

import { ManageRoomPlanPage } from './manage-room-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageRoomPlanPageRoutingModule
  ],
  declarations: [ManageRoomPlanPage]
})
export class ManageRoomPlanPageModule {}
