import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodosCreatePageRoutingModule } from './todos-create-routing.module';

import { TodosCreatePage } from './todos-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TodosCreatePageRoutingModule
  ],
  declarations: [TodosCreatePage]
})
export class TodosCreatePageModule {}
