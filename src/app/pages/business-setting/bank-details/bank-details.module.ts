import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankDetailsPageRoutingModule } from './bank-details-routing.module';

import { BankDetailsPage } from './bank-details.page';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      component: BankDetailsPage
    }
  ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BankDetailsPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BankDetailsPage]
})
export class BankDetailsPageModule {}
