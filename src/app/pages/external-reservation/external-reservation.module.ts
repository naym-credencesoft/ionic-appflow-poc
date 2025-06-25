import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
import { IonicModule } from '@ionic/angular';

import { ExternalReservationPage } from './external-reservation.page';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: ExternalReservationPage
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
  declarations: [ExternalReservationPage]
})
export class ExternalReservationPageModule {}
