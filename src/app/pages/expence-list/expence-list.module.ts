import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { CompModuleModule } from "../../../app/component/comp-module/comp-module.module";
import { ExpenceListPage } from "./expence-list.page";
import { NgxPaginationModule } from "ngx-pagination";

const routes: Routes = [
    {
        path: "",
        component: ExpenceListPage,
    },
];

@NgModule({
    imports: [
        CommonModule,
        NgxPaginationModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule,
        CompModuleModule,
        RouterModule.forChild(routes),
    ],
    declarations: [ExpenceListPage],
})
export class ExpenceListPageModule {}
