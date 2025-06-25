import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
import { IonicModule } from '@ionic/angular';
import { ListComponent } from  '../../component/booking-list/list/list.component';
import { RecentbookingPage } from './recentbooking.page';
import { BookinglistModuleModule } from '../../component/bookinglist-module/bookinglist-module.module';

const routes: Routes = [
  {
    path: '',
    component: RecentbookingPage
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
  declarations: [RecentbookingPage]
})
export class RecentbookingPageModule {}
