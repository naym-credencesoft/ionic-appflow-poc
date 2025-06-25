import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultibookinglistPageRoutingModule } from './multibookinglist-routing.module';

import { MultibookinglistPage } from './multibookinglist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultibookinglistPageRoutingModule
  ],
  providers: [
    DatePipe,
  ],
  declarations: [MultibookinglistPage]
})
export class MultibookinglistPageModule {}
