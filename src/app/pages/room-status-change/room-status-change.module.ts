import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomStatusChangePageRoutingModule } from './room-status-change-routing.module';

import { RoomStatusChangePage } from './room-status-change.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RoomStatusChangePageRoutingModule
  ],
  declarations: [RoomStatusChangePage]
})
export class RoomStatusChangePageModule {}
