import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
import { PaymentListPage } from './payment-list.page';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: PaymentListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CompModuleModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentListPage]
})
export class PaymentListPageModule {}
