import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { BookingPage } from './booking.page';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';

const routes: Routes = [
  {
    path: '',
    component: BookingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CompModuleModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [BookingPage]
})
export class BookingPageModule {}
