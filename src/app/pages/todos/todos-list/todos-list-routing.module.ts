import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodosListPage } from './todos-list.page';

const routes: Routes = [
  {
    path: '',
    component: TodosListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodosListPageRoutingModule {}
