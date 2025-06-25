import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from '../../component/booking-list/list/list.component'
import { CheckoutPaymentPage } from '../../../app/pages/checkout-payment/checkout-payment.page'
import {AddCustomerComponentComponent } from '../customer/add-customer-component/add-customer-component.component';
import { CustomerAddressComponentComponent } from '../customer/customer-address-component/customer-address-component.component';
import { from } from 'rxjs';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
    declarations: [ListComponent,CheckoutPaymentPage,AddCustomerComponentComponent,CustomerAddressComponentComponent],
    exports: [ListComponent,CheckoutPaymentPage,AddCustomerComponentComponent,CustomerAddressComponentComponent],

  imports: [
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    IonicModule,
    CommonModule,
    TranslateModule.forChild(),
  ],
  providers: [
    DatePipe,
  ],
})
export class BookinglistModuleModule { }
