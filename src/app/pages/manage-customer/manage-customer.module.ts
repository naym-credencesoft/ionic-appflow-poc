import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { CompModuleModule } from "../../../app/component/comp-module/comp-module.module";
import { ManageCustomerPage } from "./manage-customer.page";
import { NgxPaginationModule } from "ngx-pagination";

const routes: Routes = [
    {
        path: "",
        component: ManageCustomerPage,
    },
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        CompModuleModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
    ],
    declarations: [ManageCustomerPage],
})
export class ManageCustomerPageModule {}
