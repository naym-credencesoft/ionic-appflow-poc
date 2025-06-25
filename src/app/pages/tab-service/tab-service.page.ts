import { Payment } from "./../../model/manage-booking/Payment/Payment";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    ToastController,
} from "@ionic/angular";
import { Property } from "src/app/model/property/Property";
import { PropertyServiceDTO } from "src/app/model/property/PropertyServices";
import { DateService } from "src/app/service/DateService/date-service.service";
import { PaymentService } from "src/app/service/payment/payment.service";
import { BookingService } from "../../../app/service/manage-booking/booking-service.service";
import { Service } from "../../model/manage-booking/Service/Service";
import { Logger } from "../../service/logger.service";
import { Booking } from "./../../model/manage-booking/Booking/Booking";
import { TokenStorage } from "./../../token.storage";
import { HttpErrorResponse } from "@angular/common/http";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { Location } from "@angular/common";
@Component({
    selector: "app-tab-service",
    templateUrl: "./tab-service.page.html",
    styleUrls: ["./tab-service.page.scss"],
})
export class TabServicePage implements OnInit {
    headerTitle: string = "Add Service";
    isCreateExpence: boolean = false;
    services: Service[] = [];
    service: Service;
    booking: Booking;
    headerIcon: string = "add";

    onServiceForm: FormGroup;

    propertyServices: PropertyServiceDTO[] = [];
    propertyServicesSelected: PropertyServiceDTO;
    property: Property;

    date: FormControl = new FormControl();
    beforeTax: FormControl = new FormControl();
    serviceType: FormControl = new FormControl();
    description: FormControl = new FormControl();
    servicePrice: FormControl = new FormControl();
    Count: FormControl = new FormControl();
    TaxPercentage: FormControl = new FormControl();
    slotTax: FormControl = new FormControl();

    currency: string;
    isView: boolean = false;
    AddOnService: boolean = false;
    payment: Payment;
    payments: Payment[];
    multiplePayment: boolean = false;
    Currency: string;
    userData: ApplicationUser;

    constructor(
        private bookingService: BookingService,
        private formBuilder: FormBuilder,
        private actionSheetController: ActionSheetController,
        private dateService: DateService,
        private authService: AuthService,
        private acRoute: ActivatedRoute,
        private _location: Location,
        private alertCtrl: AlertController,
        private paymentService: PaymentService,
        private toastController: ToastController,
        private changeDetectorRefs: ChangeDetectorRef,
        public loadingCtrl: LoadingController,
        public token: TokenStorage
    ) {
        this.propertyServicesSelected = new PropertyServiceDTO();
        this.service = new Service();
        this.payment = new Payment();
        this.property = new Property();
        this.userData = new ApplicationUser();

        this.property = this.token.getProperty();
        if (
            this.token.getProperty().localCurrency != undefined &&
            this.token.getProperty().localCurrency != null
        ) {
            this.Currency = this.token
                .getProperty()
                .localCurrency.toUpperCase();
        }

        this.propertyServices = [];
        if (
            this.property.propertyServicesList != null &&
            this.property.propertyServicesList != undefined &&
            this.property.propertyServicesList.length > 0
        ) {
            this.propertyServices = this.property.propertyServicesList;
        }

        if (
            this.token.getProperty().localCurrency != undefined &&
            this.token.getProperty().localCurrency != null
        ) {
            this.currency = this.token
                .getProperty()
                .localCurrency.toUpperCase();
        }

        this.onServiceForm = this.formBuilder.group({
            date: ["", Validators.compose([Validators.required])],
            beforeTax: ["", Validators.compose([Validators.required])],
            Count: ["", Validators.compose([Validators.required])],
            TaxPercentage: [""],
            slotTax: ["", Validators.compose([Validators.required])],
            serviceType: ["", Validators.compose([Validators.required])],
            description: ["", Validators.compose([Validators.nullValidator])],
            servicePrice: ["", Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.userData = resp.body;
            });
        this.getAllServices();
        this.getBookingInfoByID();

        this.acRoute.queryParams.subscribe((params) => {
            if (params["status"] !== undefined) {
                this.AddOnService = true;
            }
        });
    }

    back() {
        this._location.back();
    }


    // getPaymentByServiceId(serviceId: number) {
    //     this.paymentService
    //         .findPaymentByServiceId(serviceId)
    //         .subscribe((data) => {
    //             this.payments = data.body;

    //             if (
    //                 this.payments != null &&
    //                 this.payments != undefined &&
    //                 this.payments.length > 0
    //             ) {
    //                 this.payment = this.payments[0];

    //                 if (this.payments.length === 1) {
    //                     this.multiplePayment = false;
    //                 } else {
    //                     this.multiplePayment = true;
    //                 }
    //             }

    //             this.changeDetectorRefs.detectChanges();
    //         });
    // }

    getPaymentByServiceId(serviceId: number) {
        this.paymentService
            .findPaymentByServiceId(serviceId)
            .subscribe((data) => {
                this.payments = data.body;

                if (
                    this.payments != null &&
                    this.payments != undefined &&
                    this.payments.length > 0
                ) {
                    this.payment = this.payments[0];

                    if (this.payments.length === 1) {
                        this.multiplePayment = false;
                    } else {
                        this.multiplePayment = true;
                    }
                }

                this.changeDetectorRefs.detectChanges();
            });
    }

    getBookingInfoByID() {
        this.bookingService
            .findBooking((this.token.getBookingId()))
            .subscribe((response1) => {
                this.booking = response1.body;

                this.payment.email = this.booking.email;
                this.payment.referenceNumber =
                    this.booking.propertyReservationNumber;
                this.payment.externalReference = this.booking.externalBookingId;
            });
    }

    async onServiceOption(service) {
        const actionSheet = await this.actionSheetController.create({
            header: "Service option",
            buttons: [
                {
                    text: "View",
                    icon: "eye",
                    handler: () => {
                        this.toggleLayout();
                        this.service = service;
                        this.service.date =
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                this.service.date
                            );
                        this.isView = true;

                        if (service.id != null && service.id != undefined) {
                            this.getPaymentByServiceId(service.id);
                        }
                        this.changeDetectorRefs.detectChanges();
                    },
                },
                {
                    text: "Edit",
                    icon: "create",
                    handler: () => {
                        this.toggleLayout();
                        this.service = service;
                        this.service.date =
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                this.service.date
                            );
                        // this.submitButtonText = "UPDATE";
                        this.isView = false;
                        if (service.id != null && service.id != undefined) {
                            this.getPaymentByServiceId(service.id);
                        }
                        this.changeDetectorRefs.detectChanges();
                    },
                },
                // {
                //     text: 'Pay Bill',
                //     icon: 'cash-outline',
                //     handler: () => {

                //         this.PayBill(service);
                //     },

                //   },
                {
                    text: "Delete",
                    icon: "trash",
                    handler: () => {
                        if (
                            service.orderId != null &&
                            service.orderId != undefined
                        ) {
                            this.presentToast(
                                "Room order have no delete access"
                            );
                        } else {
                            this.deleteConfirmation(service);
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
                message: "Do you want to delete this service ",
                buttons: [
                    {
                        text: "Close",
                        role: "cancel",
                    },
                    {
                        text: "OK",
                        handler: () => {
                            this.checkAllPayment(row);
                        },
                    },
                ],
            })
            .then((o) => {
                o.present();
            });
    }

    checkAllPayment(row) {
        this.paymentService.findPaymentByServiceId(row.id).subscribe((data) => {
            this.payments = data.body;

            if (
                this.payments != null &&
                this.payments != undefined &&
                this.payments.length > 0
            ) {
                let PaidData = [];
                PaidData = this.payments.filter((item) => {
                    const searchResult =
                        item.status != null && item.status === "Paid";

                    return searchResult;
                });

                if (
                    PaidData != null &&
                    PaidData != undefined &&
                    PaidData.length > 0
                ) {
                    this.presentToast(
                        "Can not delete this service because there is a paid payment"
                    );
                } else {
                    this.deleteBookingService(row, true);
                }
            } else {
                this.deleteBookingService(row, false);
            }

            this.changeDetectorRefs.detectChanges();
        });
    }

    async deleteBookingService(row, isPaymentDeleteAble: boolean) {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        this.bookingService.deleteService(row.id).subscribe(
            (response) => {
                if (response.status === 200) {
                    loader.dismiss();
                    this.presentToast("Service Deleted Successfully.");
                    //this.getAllServices() ;

                    if (isPaymentDeleteAble === true) {
                        for (let i = 0; i < this.payments.length; i++) {
                            this.deletePayment(this.payments[i].id);
                        }
                    }

                    this.getAllServices();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    this.presentToast(error.message);
                    loader.dismiss();
                }
            }
        );
    }
    deletePayment(paymentId) {
        this.paymentService.deletePaymentById(paymentId).subscribe(
            (data) => {
                this.presentToast("Payment deleted successfully");
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    this.presentToast(error.message);
                }
            }
        );
    }
    async PayBill(service) {
        this.payment.businessServiceName = "Accommodation";
        this.payment.referenceNumber = this.booking.propertyReservationNumber;
        this.payment.name = this.token.getProperty().name;
        this.payment.businessEmail = this.token.getProperty().email;
        this.payment.email = this.booking.email;
        if (
            this.token.getProperty().localCurrency != null &&
            this.token.getProperty().localCurrency != undefined
        ) {
            this.payment.currency = this.token
                .getProperty()
                .localCurrency.toLocaleLowerCase();
        }
        this.payment.description =
            this.service.name +
            " (" +
            this.service.serviceType +
            ") service payment";
        this.payment.status = "NotPaid";
        this.payment.paymentMode = "Cash";
        this.payment.date = this.service.date;
        this.payment.propertyId = this.token.getProperty().id;
        this.payment.roomNumber = this.service.roomNumber;

        this.payment.netReceivableAmount = this.service.beforeTaxAmount;
        this.payment.transactionAmount = this.service.afterTaxAmount;
        this.payment.taxAmount = this.service.taxAmount;
        this.payment.amount = this.service.afterTaxAmount;
        this.payment.transactionChargeAmount = this.service.afterTaxAmount;
        if (this.service.id != null && this.service.id != undefined) {
            this.updatePaymentToService();
        } else {
            this.processPayment(this.payment);
        }
    }

    updatePaymentToService() {
        this.paymentService.savePayment(this.payment).subscribe((res) => {
            if (res.status === 200) {
                this.reset();

                this.toggleLayout();
            } else {
                this.presentToast(`Error in updating payment details`);
            }
        });
    }

    async processPayment(payment: Payment) {
        payment.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            payment.date
        );

        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        this.paymentService.processPayment(payment).subscribe((data) => {
            this.payment = data.body;
            loader.dismiss();
            this.payment.date =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    payment.date
                );

            this.paymentService.savePayment(this.payment).subscribe((res) => {
                if (res.status === 200) {
                    this.presentToast(`Service payment created.For total booking payment, please use the balance calculator in the payment details page before proceeding.`);
                    this.reset();

                    this.toggleLayout();
                } else {
                    this.presentToast(`Error in updating payment details`);
                }
            });
        });
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    beforeTaxChange(value) {
        // if (this.service.count === undefined || this.service.count === null) {
        //     this.service.count = 1;
        // }

        if (
            this.service.taxPercentage === undefined ||
            this.service.taxPercentage === null
        ) {
            this.service.taxPercentage = 0;
        }

        this.service.afterTaxAmount =
            (this.service.beforeTaxAmount +
                this.service.beforeTaxAmount *
                (this.service.taxPercentage / 100)) *
            this.service.count;
        this.service.taxAmount =
            Number(
                (this.service.beforeTaxAmount * this.service.taxPercentage) /
                100
            ) * this.service.count;
        this.service.servicePrice = this.service.afterTaxAmount;
        this.changeDetectorRefs.detectChanges();
    }

    setService(service: any) {
        this.propertyServicesSelected = this.propertyServices.find(
            (room) => room.name === service
        );

        this.service.count = 1;
        this.service.servicePrice =
            this.propertyServicesSelected.beforeTaxAmount;
        this.service.imageUrl = this.propertyServicesSelected.imageUrl;
        this.service.logoUrl = this.propertyServicesSelected.logoUrl;
        this.service.name = this.propertyServicesSelected.name;
        this.service.servicePrice =
            this.propertyServicesSelected.afterTaxAmount;
        this.service.beforeTaxAmount = this.service.servicePrice;
        this.service.taxPercentage =
            this.propertyServicesSelected.taxPercentage;
        this.service.taxAmount = this.propertyServicesSelected.taxAmount;
        this.service.afterTaxAmount =
            this.propertyServicesSelected.afterTaxAmount;
        this.service.beforeTaxAmount =
            this.propertyServicesSelected.beforeTaxAmount;

        this.service.serviceType = this.propertyServicesSelected.serviceType;
        this.service.businessType = this.propertyServicesSelected.businessType;
        this.service.organisationId =
            this.propertyServicesSelected.organisationId;
    }

    toggleLayout() {
        if (this.isCreateExpence == false) {
            this.headerIcon = "list";
            this.headerTitle = "Service List";
            this.isCreateExpence = true;
            this.changeDetectorRefs.detectChanges();
        } else {
            this.headerIcon = "add";
            this.headerTitle = "Create New Service";

            this.isCreateExpence = false;
        }
        this.isView = false;
        this.changeDetectorRefs.detectChanges();
        this.reset();

        this.getAllServices();
    }

    reset() {
        this.onServiceForm.reset();
        this.service = new Service();
        this.payment = new Payment();
        this.payment.email = this.booking.email;
        this.payment.referenceNumber = this.booking.propertyReservationNumber;
        this.payment.externalReference = this.booking.externalBookingId;
    }

    getAllServices() {
        this.bookingService
            .getAllServicesByBooking((this.token.getBookingId()))
            .subscribe(
                (response1) => {
                    if (response1.status === 200) {
                        this.services = response1.body;

                        if (
                            this.services != null &&
                            this.services != undefined &&
                            this.services.length > 0
                        ) {
                            this.services.reverse();
                        }

                        //this.noOfServices = this.serveiceTypes.length ;
                        this.changeDetectorRefs.detectChanges();
                    }
                },
                (error) => { }
            );
    }

    async onSubmit() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        if (this.service.date != null && this.service.date != undefined) {
            this.service.date = this.getUTCDateToDate(this.service.date);
        }

        this.service.bookingId = (this.token.getBookingId());
        loader.present();

        // this.PayBill(this.service);
        if (this.service.id === undefined || this.service.id === 0) {
            this.addServiceToBooking();
        } else {
            this.updateServiceToBooing();
        }

        loader.dismiss();
    }

    updateServiceToBooing() {
        this.bookingService
            .updateService((this.token.getBookingId()), this.service)
            .subscribe(
                (response) => {
                    this.payment.serviceId = response.body.id;
                    if (response.status === 200) {
                        this.payment.serviceId = response.body.id;

                        if (this.multiplePayment == false) {
                            this.paymentService
                                .savePayment(this.payment)
                                .subscribe((res) => {
                                    if (res.status === 200) {
                                        //loader.dismiss();
                                        this.reset();
                                        // this.getAllServices();
                                        this.toggleLayout();
                                    } else {
                                        this.presentToast(
                                            `Error in updating payment details`
                                        );
                                    }
                                });
                        } else {
                            this.reset();
                            // this.getAllServices();
                            this.toggleLayout();
                        }
                    }
                },
                (error) => {
                    // loader.dismiss();
                }
            );
    }

    addServiceToBooking() {
        this.bookingService
            .addServiceTOBooking(
                (this.token.getBookingId()),
                this.service
            )
            .subscribe(
                (response) => {
                    this.payment.serviceId = response.body.id;
                    if (response.status === 200) {
                        this.payment.serviceId = response.body.id;
                        this.PayBill(this.service);
                    }
                },
                (error) => {
                    // loader.dismiss();
                }
            );
    }

    getUTCDateToDate(dateString: string) {
        var yearAndMonth = dateString.split("-", 3);
        Logger.log(yearAndMonth + " --" + yearAndMonth[2].split("T", 1));

        return (
            yearAndMonth[0] +
            "-" +
            yearAndMonth[1] +
            "-" +
            yearAndMonth[2].split("T", 1)
        );
    }
}
