import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgCircleProgressModule } from "ng-circle-progress";
import { TranslateModule } from "@ngx-translate/core";
import { AgmCoreModule } from "@agm/core";
import { HomePage } from "./home.page";
import { from } from "rxjs";
import { CompModuleModule } from "../../../app/component/comp-module/comp-module.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CompModuleModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 30,
            outerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            animationDuration: 300,
            animation: false,
            responsive: false,
            renderOnClick: false,
            showTitle: true,
        }),
        RouterModule.forChild([
            {
                path: "",
                component: HomePage,
            },
        ]),
        TranslateModule.forChild(),
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y",
        }),
    ],
    declarations: [HomePage],
})
export class HomePageModule {}
