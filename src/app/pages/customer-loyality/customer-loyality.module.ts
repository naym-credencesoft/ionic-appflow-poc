import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomerLoyalityPage } from './customer-loyality.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerLoyalityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CustomerLoyalityPage]
})
export class CustomerLoyalityPageModule {}
