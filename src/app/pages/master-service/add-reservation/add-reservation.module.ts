import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddReservationPage } from './add-reservation.page';
import { CompModuleModule } from '../../../component/comp-module/comp-module.module';

const routes: Routes = [
  {
    path: '',
    component: AddReservationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddReservationPage]
})
export class AddReservationPageModule {}
