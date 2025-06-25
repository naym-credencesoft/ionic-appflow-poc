import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodosCreatePage } from './todos-create.page';

const routes: Routes = [
  {
    path: '',
    component: TodosCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodosCreatePageRoutingModule {}
