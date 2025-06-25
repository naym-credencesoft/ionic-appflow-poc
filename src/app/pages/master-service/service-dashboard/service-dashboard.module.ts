import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ServiceDashboardPage } from './service-dashboard.page';
import { CompModuleModule } from '../../../component/comp-module/comp-module.module';

const routes: Routes = [
  {
    path: '',
    component: ServiceDashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CompModuleModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ServiceDashboardPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ServiceDashboardPageModule {}
