import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReportDashboardPageRoutingModule } from "./report-dashboard-routing.module";

import { ReportDashboardPage } from "./report-dashboard.page";
import { CompModuleModule } from "src/app/component/comp-module/comp-module.module";

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CompModuleModule,
        FormsModule,
        CommonModule,
        IonicModule,
        ReportDashboardPageRoutingModule,
    ],
    declarations: [ReportDashboardPage],
})
export class ReportDashboardPageModule {}
