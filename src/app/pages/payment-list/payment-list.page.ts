import { DateService } from "./../../service/DateService/date-service.service";
import { Logger } from "../../service/logger.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Payment } from "../../model/manage-booking/Payment/Payment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateProvider } from "../../providers";
import { TokenStorage } from "./../../token.storage";
import { AuthService } from "./../../service/auth.service";
import { BookingService } from "../../service/manage-booking/booking-service.service";
import { AlertController, ToastController } from "@ionic/angular";
import { NavController, LoadingController } from "@ionic/angular";
import { PaymentService } from "../../service/payment/payment.service";
import { ActionSheetController } from "@ionic/angular";
import { PaymentListOptionMenuComponent } from "../../../app/component/payment-list/payment-list-option-menu/payment-list-option-menu.component";
import { PopoverController } from "@ionic/angular";
import { NavigationExtras } from "@angular/router";
import { CheckUserType } from "src/app/model/checkUserType";
import { HttpErrorResponse } from "@angular/common/http";
import { Property } from "src/app/model/property/Property";

@Component({
    selector: "app-payment-list",
    templateUrl: "./payment-list.page.html",
    styleUrls: ["./payment-list.page.scss"],
})
export class PaymentListPage implements OnInit {
    property: Property;
    paymentListData: Payment[] = [];
    paymentListSearchData: Payment[] = [];

    isProgressing: boolean;
    localCurrency: string;

    p: number = 1;
    paymentSearchSelection: string = "findPayment";
    onFindPaymentForm: FormGroup;
    fromDateString: string;
    toDateString: string;

    toMinDate: string;
    toMaxDate: string;
    currentDay: string;
    currentMonth: string;

    isPropAdmin: boolean = false;
    checkUserType: CheckUserType;
    role: any[];
    openedCardIndex: number | null = null;

    constructor(
        private navCtrl: NavController,
        public popoverController: PopoverController,
        private paymentService: PaymentService,
        private bookingService: BookingService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateProvider,
        private dateService: DateService,
        private actionSheetController: ActionSheetController,
        private alertCtrl: AlertController,
        private authService: AuthService,
        public token: TokenStorage,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private formBuilder: FormBuilder
    ) {
        this.checkUserType = new CheckUserType();
        this.property = new Property();
    }

    ngOnInit() {
        this.role = [];
        this.currentPayment();
        this.property = this.token.getProperty();
        console.log("property details", this.property)
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });
        

        if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
            this.isPropAdmin = true;
        } else {
            this.isPropAdmin = false;
        }

        if (
            this.token.getProperty().localCurrency != null &&
            this.token.getProperty().localCurrency != undefined
        ) {
            this.localCurrency = this.token
                .getProperty()
                .localCurrency.toUpperCase();
        }

        this.onFindPaymentForm = this.formBuilder.group({
            bookingFromDate: ["", Validators.compose([Validators.required])],
            bookingToDate: ["", Validators.compose([Validators.required])],
        });

        this.paymentChanged();
    }

    ionViewWillEnter() {
        this.paymentChanged();
    }
    toggleCardBody(index: number): void {
        // Toggle the card body visibility
        this.openedCardIndex = this.openedCardIndex === index ? null : index;
      }

    navigateToPage() {
        this.navCtrl.navigateForward('/home');
      }

    paymentChanged() {
        if (this.paymentSearchSelection === "findPayment") {
            this.paymentListData = [];
            this.paymentListSearchData = [];
            this.currentPayment();
        } else if (this.paymentSearchSelection === "allPayment") {
            this.findPayment();
        }
    }
    
    currentPayment() {
        let date: Date = new Date();
        let todate: Date = new Date();
        todate.setDate(todate.getDate() + 1);

        this.fromDateString = this.getDate(date);
        this.toDateString = this.getDate(todate);
            this.isProgressing = true;
            this.paymentService
                .getAllPaymentsByPropertyIdAndDateRange(
                    this.token.getPropertyId(),
                    this.fromDateString,
                    this.toDateString
                )
                .subscribe(
                    (res) => {
                        this.paymentListData = res;
                        this.paymentListSearchData = res;
                        this.isProgressing = false;
                        this.paymentListData.reverse();
                        this.changeDetectorRefs.detectChanges();
                    },
                    (error) => {
                        this.isProgressing = false;
                        this.changeDetectorRefs.detectChanges();
                    }
                );
        }

    findPayment() {
        if (
            this.fromDateString != null &&
            this.fromDateString != undefined &&
            this.toDateString != null &&
            this.toDateString != undefined
        ) {
            this.fromDateString =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.fromDateString
                );
            this.toDateString =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.toDateString
                );

            this.isProgressing = true;
            this.paymentService
                .getAllPaymentsByPropertyIdAndDateRange(
                    this.token.getPropertyId(),
                    this.fromDateString,
                    this.toDateString
                )
                .subscribe(
                    (res) => {
                        this.paymentListData = res;
                        this.paymentListSearchData = res;
                        this.isProgressing = false;
                        this.paymentListData.reverse();
                        this.changeDetectorRefs.detectChanges();
                    },
                    (error) => {
                        this.isProgressing = false;
                        this.changeDetectorRefs.detectChanges();
                    }
                );
        }
    }

    fromDateChange() {
        let toDate = new Date(this.fromDateString);

        toDate.setDate(toDate.getDate() + 1);
        this.toMinDate = this.getDate(toDate);

        toDate.setDate(toDate.getDate() + 30);
        this.toMaxDate = this.getDate(toDate);
    }

    getDate(date: Date) {
        if (date.getDate().toString().length == 1) {
            this.currentDay = "0" + date.getDate();
        } else {
            this.currentDay = "" + date.getDate();
        }

        if ((date.getMonth() + 1).toString().length == 1) {
            this.currentMonth = "0" + (date.getMonth() + 1);
        } else {
            this.currentMonth = "" + (date.getMonth() + 1);
        }

        return (
            date.getFullYear() + "-" + this.currentMonth + "-" + this.currentDay
        );
    }
    ResetAllField() {
        this.onFindPaymentForm.reset();
        this.paymentListData = [];
        this.paymentListSearchData = [];
    }

    paymentList() {
        this.isProgressing = true;
        this.paymentService
            .findPaymentByPropertyId(this.token.getPropertyId())
            .subscribe((res) => {
                this.paymentListData = res;
                this.paymentListSearchData = res;
                this.isProgressing = false;
                this.paymentListData.reverse();
                Logger.log("Payment : " + JSON.stringify(res));
            });
    }

    onPaymentDetail(payment) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                paymentOb: JSON.stringify(payment),
                permission: 1,
            },
        };

        this.navCtrl.navigateForward(["manage-payment"], navigationExtras);
    }

    async onPaymentOption(payment) {
        console.log (payment.status)
        const isDeleteVisible = payment.status.toLowerCase() !== "paid";
        const actionSheet = await this.actionSheetController.create({
            header: "Payment option",
            buttons: [
                {
                    text: "View",
                    icon: "eye",
                    handler: () => {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                paymentOb: JSON.stringify(payment),
                                permission: 1,
                            },
                        };

                        this.navCtrl.navigateForward(
                            ["manage-payment"],
                            navigationExtras
                        );
                    },
                },
                //   {
                //     text: 'Edit',
                //     icon: 'create',
                //     handler: () => {

                //       if (payment.status.toLocaleLowerCase() == "paid") {
                //         this.presentToast("You can not update this payment. Already paid this payment");
                //       }
                //       else {
                //         let navigationExtras: NavigationExtras = {
                //           queryParams: {
                //             paymentOb: JSON.stringify(payment),
                //             permission: 2,
                //           }
                //         };

                //         this.navCtrl.navigateForward(['manage-payment'], navigationExtras);
                //       }
                //       Logger.log('Cancel clicked');
                //     }
                //   },
                {
                    text: "Delete",
                    icon: "trash",
                    cssClass: isDeleteVisible ? "" : "ion-hide",
                    handler: () => {
                        if (isDeleteVisible) {
                            this.deleteConfirmation(payment);
                            this.presentToast (
                                "Payment Deleted Sucessfully"
                            );
                        }
                    },
                },
                {
                    text: "Close",
                    icon: "close",
                    role: "cancel",
                    handler: () => {
                        Logger.log("Cancel clicked");
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    deleteConfirmation(row) {
        this.alertCtrl
            .create({
                header: "Caution",
                message:
                    "Do you want to delete this payment " + row.referenceNumber,
                buttons: [
                    {
                        text: "Close",
                        role: "cancel",
                    },
                    {
                        text: "OK",
                        handler: () => {
                            this.deletePayment(row);
                        },
                    },
                ],
            })
            .then((o) => {
                o.present();
            });
    }

    async deletePayment(row) {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        this.paymentService.deletePaymentById(row.id).subscribe(
            (data) => {
                this.paymentChanged();
                loader.dismiss();
                this.presentToast("Payment deleted successfully");
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    this.presentToast(error.message);
                    loader.dismiss();
                }
            }
        );
    }

    createPayment() {
        this.navCtrl.navigateForward("manage-payment");
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    getItems(ev: any) {
        const val = ev.target.value;

        Logger.log("search -- " + val);

        // if(val ==='')
        // {
        //     this.paymentList ();
        // }
        // else
        // {
        this.paymentListData = this.paymentListSearchData;

        this.paymentListData = this.paymentListData.filter((item) => {
            const searchResult =
                (item.referenceNumber != null &&
                    item.referenceNumber
                        .toLowerCase()
                        .trim()
                        .indexOf(val.trim().toLowerCase().trim()) > -1) ||
                String(item.id).indexOf(val.trim()) > -1 ||
                (item.paymentMode != null &&
                    item.paymentMode
                        .toLowerCase()
                        .trim()
                        .indexOf(val.trim().toLowerCase().trim()) > -1) ||
                (item.status != null &&
                    item.status
                        .toLowerCase()
                        .indexOf(val.toLowerCase().trim()) > -1);

            return searchResult;
        });
        //}
    }

    async menuClick(ev: any) {
        Logger.log("menu click");
        const popover = await this.popoverController.create({
            component: PaymentListOptionMenuComponent,
            event: ev,
            translucent: true,
        });
        return await popover.present();
    }
    clear(event) {}
}
