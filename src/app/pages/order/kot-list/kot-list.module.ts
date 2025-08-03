import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { KotListPageRoutingModule } from './kot-list-routing.module';
// import { DragDropModule } from '@angular/cdk/drag-drop';
import { KotListPage } from './kot-list.page';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { DragDropModule } from '@angular/cdk/drag-drop';

// import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    KotListPageRoutingModule
  ],
  declarations: [KotListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ Add this
})
export class KotListPageModule {}
