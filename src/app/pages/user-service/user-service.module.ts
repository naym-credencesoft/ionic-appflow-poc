import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserServicePage } from './user-service.page';

const routes: Routes = [
  {
    path: '',
    component: UserServicePage,
    children: [
        {
        path: '',
        pathMatch:'full',
        redirectTo: 'servicesTab'
        },
      {
  path: 'servicesTab',
  loadChildren: () => import('../../pages/tab-service/tab-service.module').then(m => m.TabServicePageModule)
}

    ],

   }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserServicePage]
})
export class UserServicePageModule {}
