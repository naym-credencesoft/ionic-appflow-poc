import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingListDetailsPage } from './booking-list-details.page';
//import{} from '../../pages/tab-booking/tab-booking.module#TabBookingPageModule'

const routes: Routes = [
  {
    path: '',
    component: BookingListDetailsPage,
    children: [
        {
        path: '',
        pathMatch:'full',
        redirectTo: 'bookingTab'
        },
        // {
        // path: 'bookingTab',
        // pathMatch:'full',
        // loadChildren: '../../pages/tab-booking/tab-booking.module#TabBookingPageModule'
        // },
        {
        path: 'paymentsTab',
        loadChildren: '../../pages/tab-payments/tab-payments.module#TabPaymentsPageModule'
        },
        {
        path: 'servicesTab',
        loadChildren: '../../pages/tab-service/tab-service.module#TabServicePageModule'
        },
        {
        path: 'expenseTab',
        loadChildren: '../../pages/tab-expence/tab-expence.module#TabExpencePageModule'
        },
        // {
        // path: 'customerTab',
        // loadChildren: '../../pages/customer-details/customer-details.module#CustomerDetailsPageModule'
        // }
        ],

   }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingListDetailsPage]
})
export class BookingListDetailsPageModule {}
