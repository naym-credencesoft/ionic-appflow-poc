import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodosListPageRoutingModule } from './todos-list-routing.module';

import { TodosListPage } from './todos-list.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { CompModuleModule } from 'src/app/component/comp-module/comp-module.module';

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    CompModuleModule,
    IonicModule,
    TodosListPageRoutingModule
  ],
  declarations: [TodosListPage]
})
export class TodosListPageModule {}
