import { AgmCoreModule } from "@agm/core";
import {
    HttpClient,
    HttpClientModule,
    HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { Camera } from "@ionic-native/camera/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
    PerfectScrollbarConfigInterface,
    PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HTTPStatus, Interceptor } from "./app.interceptor";
import { CheckRoomtypeComponent } from "./component/booking-list/check-roomtype/check-roomtype.component";
import { ComponentListOptionMenuComponent } from "./component/booking-list/component-list-option-menu/component-list-option-menu.component";
import { MenucardComponent } from "./component/dashboard/menucard/menucard.component";
import { PaymentListOptionMenuComponent } from "./component/payment-list/payment-list-option-menu/payment-list-option-menu.component";
import { EditItemComponent } from "./component/ratesAandAvailability/edit-item/edit-item.component";
import { ImagePageModule } from "./pages/modal/image/image.module";
import { LocationPageModule } from "./pages/modal/location/location.module";
import { TranslateProvider } from "./providers";
import { AuthGuard } from "./service/auth-guard.service";
import { AuthService } from "./service/auth.service";
import { FileService } from "./service/file.service";
import { ErrorHandlerService } from "./shared/services/error-handler.service";
import { TokenStorage } from "./token.storage";
import { Device } from "@ionic-native/device/ngx";
import { CheckedInDialogComponent } from "./component/booking-list/checked-in-dialog/checked-in-dialog.component";
import { CheckoutDialogComponent } from "./component/booking-list/checkout-dialog/checkout-dialog.component";
import { ActionBookingMenuComponent } from "./component/booking-list/action-booking-menu/action-booking-menu.component";
import { OrderCreationOptionMenuComponent } from "./component/Order/order-creation-option-menu/order-creation-option-menu.component";
import { ActionOrderMenuComponent } from "./component/Order/action-order-menu/action-order-menu.component";
import { TriggerService } from "./service/trigger/trigger.service";
import { CheckSubscription } from "./checkSubscription";
import { DatePipe } from "@angular/common";
import { DialogContentComponent } from "./component/booking-list/DialogContent/DialogContent.component";
import { OtaAvailabilityComponent } from "./component/ratesAandAvailability/ota-availability/ota-availability.component";
import { OtaRatesComponent } from "./component/ratesAandAvailability/ota-rates/ota-rates.component";
import { EditRatesComponent } from "./component/ratesAandAvailability/edit-rates/edit-rates.component";
import { AuditReportComponent } from "./component/audit-report/audit-report.component";
import { AuditOrderReportComponent } from "./component/audit-order-report/audit-order-report.component";
import { CollectPaymentModalComponent } from "./model/collect-payment-modal/collect-payment-modal.component";
import { OpenProductComponent } from "./model/open-product/open-product.component";
import { ItemReleaseComponent } from "./model/item-release/item-release.component";
import { CancelOrderModalComponent } from "./component/cancel-order-modal/cancel-order-modal.component";


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
};

@NgModule({
    declarations: [
        AppComponent,
        ActionOrderMenuComponent,
        OrderCreationOptionMenuComponent,
        ComponentListOptionMenuComponent,
        OtaRatesComponent,
        AuditReportComponent,
        AuditOrderReportComponent,

        OrderCreationOptionMenuComponent,
        PaymentListOptionMenuComponent,
        MenucardComponent,
        EditItemComponent,
        EditRatesComponent,
        OtaAvailabilityComponent,
        CheckRoomtypeComponent,
        CheckedInDialogComponent,
        CheckoutDialogComponent,
        ActionBookingMenuComponent,
        DialogContentComponent,
        CollectPaymentModalComponent,
        ItemReleaseComponent,
        OpenProductComponent,
        CancelOrderModalComponent
        
    ],
    entryComponents: [
        ComponentListOptionMenuComponent,
        OrderCreationOptionMenuComponent,
        ActionOrderMenuComponent,
        OrderCreationOptionMenuComponent,
        PaymentListOptionMenuComponent,
        EditItemComponent,
        CheckRoomtypeComponent,
        CollectPaymentModalComponent,
        ItemReleaseComponent,
        OpenProductComponent
       
    ],
    imports: [
        BrowserModule,
        // BrowserAnimationsModule,
        IonicModule.forRoot(environment.config),
        AppRoutingModule,
        HttpClientModule,
        ImagePageModule,
        LocationPageModule,
        FormsModule,
        ReactiveFormsModule,
        IonicStorageModule.forRoot({
            name: "__mydb",
            driverOrder: ["indexeddb", "sqlite", "websql"],
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y",
        }),
        ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: environment.production,
        }),
    ],
    providers: [
        DatePipe,
        { provide: ErrorHandler, useClass: ErrorHandlerService },

        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: Interceptor,
            multi: true,
        },
        AuthGuard,
        DatePipe,
        CheckSubscription,
        TriggerService,
        TokenStorage,
        AuthService,
        FileService,
        Camera,
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        TranslateProvider,
        HTTPStatus,
        Device,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
