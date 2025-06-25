import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { InvoiceListPage } from "./invoice-list.page";
import { CompModuleModule } from "../../../component/comp-module/comp-module.module";
import { NgxPaginationModule } from "ngx-pagination";

const routes: Routes = [
    {
        path: "",
        component: InvoiceListPage,
    },
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FormsModule,
        CompModuleModule,
        IonicModule,
        RouterModule.forChild(routes),
    ],
    declarations: [InvoiceListPage],
})
export class InvoiceListPageModule {}
