import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CompModuleModule } from '../../../../app/component/comp-module/comp-module.module';
import { OrderDetailsPage } from './order-details.page';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompModuleModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderDetailsPage]
})
export class OrderDetailsPageModule { }
