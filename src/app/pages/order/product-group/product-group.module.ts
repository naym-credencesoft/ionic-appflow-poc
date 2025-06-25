import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductGroupPage } from './product-group.page';
import { CompModuleModule } from '../../../component/comp-module/comp-module.module';

const routes: Routes = [
  {
    path: '',
    component: ProductGroupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CompModuleModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductGroupPage]
})
export class ProductGroupPageModule {}
