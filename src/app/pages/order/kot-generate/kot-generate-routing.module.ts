import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KotGeneratePage } from './kot-generate.page';

const routes: Routes = [
  {
    path: '',
    component: KotGeneratePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KotGeneratePageRoutingModule {}
