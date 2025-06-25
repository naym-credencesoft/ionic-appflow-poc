import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
import { IonicModule } from '@ionic/angular';

import { GuestCheckInTodayPage } from './guest-check-in-today.page';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: GuestCheckInTodayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    IonicModule,
    CompModuleModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GuestCheckInTodayPage]
})
export class GuestCheckInTodayPageModule {}
