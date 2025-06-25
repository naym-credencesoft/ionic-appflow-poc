import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from  '../../component/booking-list/list/list.component';

import { BookinglistModuleModule } from '../../component/bookinglist-module/bookinglist-module.module';
import { IonicModule } from '@ionic/angular';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
import { BookingListPage } from './booking-list.page';

const routes: Routes = [
  {
    path: '',
    component: BookingListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompModuleModule,
    BookinglistModuleModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingListPage]
})
export class BookingListPageModule {}
