import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RateUpdateComponent } from '../rate-update/rate-update.component';





@NgModule({
  declarations: [RateUpdateComponent],
  exports: [RateUpdateComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CommonModule
  ]
})
export class RateModuleModule { }
