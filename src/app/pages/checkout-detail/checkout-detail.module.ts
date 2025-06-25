import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BookinglistModuleModule } from '../../component/bookinglist-module/bookinglist-module.module';
import { IonicModule } from '@ionic/angular';


import { CheckoutDetailPage } from './checkout-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
     BookinglistModuleModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckoutDetailPage]
})
export class CheckoutDetailPageModule {}
