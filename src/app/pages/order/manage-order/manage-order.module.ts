import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ManageOrderPage } from "./manage-order.page";
import { CompModuleModule } from "../../../component/comp-module/comp-module.module";

const routes: Routes = [
    {
        path: "",
        component: ManageOrderPage,
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
    declarations: [ManageOrderPage],
})
export class ManageOrderPageModule {}
