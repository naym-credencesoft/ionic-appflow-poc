import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { KomPageRoutingModule } from "./kom-routing.module";

import { KomPage } from "./kom.page";
import { CompModuleModule } from "src/app/component/comp-module/comp-module.module";

@NgModule({
    imports: [
        CommonModule,
        CompModuleModule,
        FormsModule,
        IonicModule,
        KomPageRoutingModule,
    ],
    declarations: [KomPage],
})
export class KomPageModule {}
