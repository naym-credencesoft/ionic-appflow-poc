import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManagePaymentPage } from './manage-payment.page';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: ManagePaymentPage
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
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [ManagePaymentPage]
})
export class ManagePaymentPageModule {}
