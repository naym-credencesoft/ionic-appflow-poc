import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../footer/footer.component';
import { OrderFooterPage } from '../order-footer/order-footer.page';

@NgModule({
  declarations: [FooterComponent,OrderFooterPage],
  exports: [FooterComponent,OrderFooterPage],

  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CommonModule
  ]
})
export class CompModuleModule { }
