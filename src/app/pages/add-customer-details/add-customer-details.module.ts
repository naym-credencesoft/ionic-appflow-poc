import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { BookinglistModuleModule } from '../../component/bookinglist-module/bookinglist-module.module';
import { IonicModule } from '@ionic/angular';
import { AddCustomerDetailsPage } from './add-customer-details.page';

const routes: Routes = [
    {
      path: '',
      component: AddCustomerDetailsPage,
     }
  ];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [AddCustomerDetailsPage]
})
export class AddCustomerDetailsPageModule {}
