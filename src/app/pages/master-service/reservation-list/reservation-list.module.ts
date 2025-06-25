import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReservationListPage } from './reservation-list.page';
import { CompModuleModule } from '../../../component/comp-module/comp-module.module';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: ReservationListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    CompModuleModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReservationListPage]
})
export class ReservationListPageModule {}
