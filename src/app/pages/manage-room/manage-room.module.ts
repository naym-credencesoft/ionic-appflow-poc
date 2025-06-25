import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ManageRoomPage } from './manage-room.page';
import { CompModuleModule } from '../../../app/component/comp-module/comp-module.module';
const routes: Routes = [
  {
    path: '',
    component: ManageRoomPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompModuleModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [ManageRoomPage]
})
export class ManageRoomPageModule {}
