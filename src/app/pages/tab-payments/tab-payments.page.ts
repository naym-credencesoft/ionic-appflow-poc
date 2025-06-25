import { ReservationService } from "src/app/service/ReservationService/reservation-service.service";
import { BankAccount } from "./../business-setting/bank-details/BankAccount";
import { Logger } from "../../service/logger.service";
import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { Payment } from "../../model/manage-booking/Payment/Payment";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { Booking } from "./../../model/manage-booking/Booking/Booking";
import { TranslateProvider } from "../../providers";
import { TokenStorage } from "./../../token.storage";
import { AuthService } from "./../../service/auth.service";
import { BookingService } from "../../service/manage-booking/booking-service.service";
import { AlertController, ToastController } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import { PaymentService } from "../../service/payment/payment.service";
import { ActionSheetController } from "@ionic/angular";
import { MobileWallet } from "src/app/model/wallet/mobileWallet";
import { DateService } from "src/app/service/DateService/date-service.service";
import { ActivatedRoute } from "@angular/router";
import { BusinessService } from "src/app/model/Reservation/businessServic";
import { CheckUserType } from "src/app/model/checkUserType";
import { HttpErrorResponse } from "@angular/common/http";
import { TriggerService } from "src/app/service/trigger/trigger.service";
import { PropertyServiceDTO } from "src/app/model/property/PropertyServices";
import { Service } from "src/app/model/manage-booking/Service/Service";
import { PropertyPayment } from "src/app/model/PropertyPayment/propertyPayment";
import { Property } from "src/app/model/property/Property";
import { ExpenseItem } from "../tab-expence/tab-expence.page";
import { PropertyExpenseList } from "src/app/model/property/propertyExpense";
import { ExpenseService } from "src/app/service/ExpenseService/expense-service.service";

@Component({
    selector: "app-tab-payments",
    templateUrl: "./tab-payments.page.html",
    styleUrls: ["./tab-payments.page.scss"],
})
export class TabPaymentsPage implements OnInit {

    expensesList: ExpenseItem[] = [
        { value: "Booking Refund", viewValue: "Booking Refund" },
    ];
    
    isView: boolean = false;
    submitButtonText: string = "ADD";

    isCreateNewPayment: boolean = false;
    isCard: boolean = false;
    data: Payment;
    headerIcon: string = "add";
    headerTitle: string = "Add Payment";
    paymentListData: Payment[] = [];
    payments: Payment[] = [];
    booking: Booking;

    public onPaymentForm: FormGroup;
    public onCardForm: FormGroup;

    PaymentDate: FormControl = new FormControl();
    serviceType: FormControl = new FormControl();
    referenceNumber: FormControl = new FormControl();
    email: FormControl = new FormControl();
    externalReference: FormControl = new FormControl();
    description: FormControl = new FormControl();
    status: FormControl = new FormControl();
    currency: FormControl = new FormControl();
    paymentMode: FormControl = new FormControl();
    cardNumber: FormControl = new FormControl();
    name: FormControl = new FormControl();
    cvv: FormControl = new FormControl();
    amount: FormControl = new FormControl();
    expYear: FormControl = new FormControl();
    expMonth: FormControl = new FormControl();
    businessPlan: string;

    accountName: FormControl = new FormControl();
    accountNumber: FormControl = new FormControl();
    bankName: FormControl = new FormControl();
    branchName: FormControl = new FormControl();
    // transactionAmount: FormControl = new FormControl();
    swiftCode: FormControl = new FormControl();

    WalletClientFN: FormControl = new FormControl();
    WalletClientLN: FormControl = new FormControl();
    WalletClientPhone: FormControl = new FormControl();
    WalletClientWP: FormControl = new FormControl();
    WalletURL: FormControl = new FormControl();

    TransactionReferenceNumber: FormControl = new FormControl();

    onbankForm: FormGroup;
    onWalletForm: FormGroup;
    onTRForm: FormGroup;
    bankAccount: BankAccount;
    isBankAvailable: boolean;
    mobileWallet: MobileWallet;
    isWalletAvailable: boolean = false;
    checkoutPaymentpage: boolean = false;
    balanceLoader: boolean = false;

    businessServices: BusinessService[] = [];
    localCurrency: string;

    isPropAdmin: boolean = false;
    checkUserType: CheckUserType;
    role: any[];

    bookingData: Booking;
    maxPaymentAmount: number = 0;
    bookingTotalPayment: number = 0;
    totalBookingAmount: number = 0;
    transactionAmount: number = 0;

    propertyReservationNumber: string;
    services: Service[] = [];
    service: Service;

    servicePaymentLimit: boolean = false;
    servicePaymentComplete: boolean = false;
    servicePaymentAmount: number = 0;

    propertyPaymentList: PropertyPayment[] = [];
    businessType: string;

    
  propertyServices: PropertyServiceDTO[] = [];
    propertyServicesSelected: PropertyServiceDTO;
    property: Property;
    propertyExpenseList: PropertyExpenseList[] = [];
bookingId:number;
    constructor(
        private paymentService: PaymentService,
        private bookingService: BookingService,
        private dateService: DateService,
        private acRoute: ActivatedRoute,
        private expenseService: ExpenseService,
        private alertCtrl: AlertController,
        private reservationService: ReservationService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateProvider,
        private triggerEventService: TriggerService,
        private authService: AuthService,
        public token: TokenStorage,
        private zone: NgZone,
        private actionSheetController: ActionSheetController,
        private loadingCtrl: LoadingController,
        private toastController: ToastController,
        private formBuilder: FormBuilder
    ) {
        this.bookingData = new Booking();
        this.property = new Property();
        this.booking = new Booking();
        this.data = new Payment();
        this.bankAccount = new BankAccount();
        this.mobileWallet = new MobileWallet();
        this.service = new Service();
        this.propertyServicesSelected = new PropertyServiceDTO();
        this.checkUserType = new CheckUserType();
        this.bankAccount = this.token.getProperty().bankAccount;
        this.mobileWallet = this.token.getProperty().mobileWallet;

        this.getAllBusinessService();

        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });

        if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
            this.isPropAdmin = true;
        } else {
            this.isPropAdmin = false;
        }

        if (this.mobileWallet != undefined && this.mobileWallet != null) {
            this.isWalletAvailable = true;
        } else {
            this.isWalletAvailable = false;
        }

        if (this.bankAccount != undefined && this.bankAccount != null) {
            this.isBankAvailable = true;
        } else {
            this.isBankAvailable = false;
        }

        this.property = this.token.getProperty();
        this.businessPlan = this.token.getProperty().plan;
        this.onPaymentForm = this.formBuilder.group({
            serviceType: ["", Validators.compose([Validators.nullValidator])],
            referenceNumber: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            BusinessServiceName: [
                "",
                Validators.compose([Validators.required]),
            ],
            PaymentDate: ["", Validators.compose([Validators.required])],
            email: ["", Validators.compose([Validators.nullValidator])],
            externalReference: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            description: ["", Validators.compose([Validators.nullValidator])],
            status: ["", Validators.compose([Validators.required])],
            paymentMode: ["", Validators.compose([Validators.required])],
            amount: ["", Validators.compose([Validators.required])],
            currency: ["", Validators.compose([Validators.required])],
        });

        this.onCardForm = this.formBuilder.group({
            cardNumber: ["", Validators.compose([Validators.required])],
            name: ["", Validators.compose([Validators.required])],
            cvv: ["", Validators.compose([Validators.required])],
            expYear: ["", Validators.compose([Validators.required])],
            expMonth: ["", Validators.compose([Validators.required])],
        });

        //..

        this.onbankForm = this.formBuilder.group({
            accountName: ["", Validators.compose([Validators.nullValidator])],
            accountNumber: ["", Validators.compose([Validators.nullValidator])],
            bankName: ["", Validators.compose([Validators.nullValidator])],
            branchName: ["", Validators.compose([Validators.nullValidator])],
            swiftCode: ["", Validators.compose([Validators.nullValidator])],
            TransactionReferenceNumber: [
                "",
                Validators.compose([Validators.required]),
            ],
        });

        this.onWalletForm = this.formBuilder.group({
            WalletClientFN: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            WalletClientLN: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            WalletClientPhone: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            WalletClientWP: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            WalletURL: ["", Validators.compose([Validators.nullValidator])],
            TransactionReferenceNumber: [
                "",
                Validators.compose([Validators.required]),
            ],
        });

        this.onTRForm = this.formBuilder.group({
            TransactionReferenceNumber: [
                "",
                Validators.compose([Validators.required]),
            ],
        });

        this.acRoute.queryParams.subscribe((params) => {
            if (params["status"] !== undefined) {
                this.checkoutPaymentpage = true;
            }
            if(params["bookingId"] !== undefined){
                this.bookingId = params["bookingId"];
            }
            
        });
        if (this.token.getBookingId() != undefined && this.token.getBookingId() != null) {
            this.bookingId = this.token.getBookingId();
        }
        if (
            token.getProperty().localCurrency != null &&
            token.getProperty().localCurrency != undefined
        ) {
            this.localCurrency = token
                .getProperty()
                .localCurrency.toUpperCase();
            if (this.data.currency != null && this.data.currency != undefined) {
                this.data.currency = this.localCurrency.toLowerCase();
            }
        }
    }

    ngOnInit() {
        this.businessType = this.token.getProperty().businessType;
        this.getAllPropertyPayment(this.token.getProperty().id);
        this.getBookingInfoByID();
        this.userInfo();

        this.getPropertyExpense(this.property.id);
        this.propertyServices = [];
        if (
          this.property.propertyServicesList != null &&
          this.property.propertyServicesList != undefined &&
          this.property.propertyServicesList.length > 0
        ) {
          this.propertyServices = this.property.propertyServicesList;
        }

        this.triggerEventService.events$.forEach((event) =>
            console.log(this.publishPage(event))
        );
    }

    ionViewWillEnter() {
        this.getBookingInfoByID();
        this.onBalanceCalculate();
    }

    getPropertyExpense(propertyId: number) {
        this.expenseService.findPropertyExpenseByPropertyId(propertyId).subscribe(
          (data) => {
            this.propertyExpenseList = data.body;
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
          }
        );
      }

    getAllPropertyPayment(propertyId: number) {
        this.paymentService.getAllPaymentBypropertyId(propertyId).subscribe(
            (data) => {
                this.propertyPaymentList = data;
                this.changeDetectorRefs.detectChanges();
                // Logger.log(JSON.stringify( this.businessServices));
            },
            (error) => {}
        );
    }

    IsActive(mode)
    {
      if (mode === 'Wallet' &&
        this.token.getProperty().mobileWallet != undefined &&
        this.token.getProperty().mobileWallet != null)
      {
        return true;
      }
      else if ((mode === 'Cheque' || mode === 'DemandDraft' || mode === 'Credit') &&
      this.businessType === 'Accommodation')
      {
        return true;
      }
      else if (mode != 'Wallet' &&  mode != 'Cheque' && mode != 'DemandDraft')
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  

    setService(serviceId) {
        this.servicePaymentLimit = false;
        this.servicePaymentComplete = false;

        this.service = this.services.find((data) => data.id == serviceId);

        if (
            this.payments != undefined &&
            this.payments != null &&
            this.payments.length > 0
        ) {
            let servicePaymentData = [];
            servicePaymentData = this.payments.filter((item) => {
                const searchResult =
                    item.serviceId != null &&
                    item.serviceId != undefined &&
                    item.serviceId == serviceId;

                return searchResult;
            });

            if (
                servicePaymentData != null &&
                servicePaymentData != undefined &&
                servicePaymentData.length > 0
            ) {
                this.servicePaymentAmount = 0;
                for (let i = 0; i < servicePaymentData.length; i++) {
                    this.servicePaymentAmount =
                        this.servicePaymentAmount +
                        servicePaymentData[i].transactionAmount;
                }
                if (this.data.id === null || this.data.id === undefined) {
                    if (
                        this.servicePaymentAmount > this.service.afterTaxAmount
                    ) {
                        this.servicePaymentLimit = true;
                    } else if (
                        this.servicePaymentAmount < this.service.afterTaxAmount
                    ) {
                        this.data.transactionAmount =
                            this.service.afterTaxAmount -
                            this.servicePaymentAmount;
                    } else {
                        this.data.transactionAmount = 0;
                        this.servicePaymentComplete = true;
                    }
                }
            }
        }
    }

    publishPage(event: any) {
        if (event != null && event != undefined && event === "payment") {
            this.getBookingInfoByID();
        }
    }

    getAllBusinessService() {
        this.businessServices = [];
        this.reservationService
            .getAllBusinessServiceByPropertyId(
                String(this.token.getProperty().id)
            )
            .subscribe(
                (data) => {
                    this.businessServices = data.body;
                    this.changeDetectorRefs.detectChanges();
                    // Logger.log(JSON.stringify( this.businessServices));
                },
                (error) => {}
            );
    }

    reset() {
        this.onCardForm.reset();
        this.isCard = false;

        this.onPaymentForm.reset();
        this.booking = new Booking();
        this.data = new Payment();

        if (this.data.currency != null && this.data.currency != undefined) {
            this.data.currency = this.localCurrency.toLowerCase();
        }

        this.getBookingInfoByID();
        this.userInfo();
    }

    async onPaymentOption(payment: Payment) {
        const actionSheet = await this.actionSheetController.create({
            header: "Payment option",
            buttons: [
                {
                    text: "View",
                    icon: "eye",
                    handler: () => {
                        this.toggleLayout();
                        this.data = payment;
                        this.data.date =
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                this.data.date
                            );
                        if (
                            payment.currency != null &&
                            payment.currency != undefined
                        ) {
                            this.data.currency = payment.currency.toLowerCase();
                        }

                        this.isView = true;
                        this.submitButtonText = "ADD";
                        this.changeDetectorRefs.detectChanges();
                        Logger.log("Cancel clicked");
                    },
                },
                {
                    text: "Edit",
                    icon: "create",
                    handler: () => {
                        this.toggleLayout();
                        this.data = payment;

                        if (
                            payment.currency != null &&
                            payment.currency != undefined
                        ) {
                            this.data.currency = payment.currency.toLowerCase();
                        }

                        this.data.date =
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                this.data.date
                            );
                        this.submitButtonText = "UPDATE";
                        this.isView = false;

                        if (
                            this.data.status === "Paid" &&
                            this.isPropAdmin === false
                        ) {
                            this.isView = true;
                            this.presentToast(`Paid payment not editable`);
                        }
                        this.changeDetectorRefs.detectChanges();
                    },
                },
                {
                    text: "Delete",
                    icon: "trash",
                    handler: () => {
                        // if (
                        //     payment.status != "Paid" ||
                        //     (payment.status != "Paid" && this.isPropAdmin)
                        // ) {
                        //     this.deleteConfirmation(payment);
                        // } else {
                        //     this.presentToast(
                        //         "This Payment have no delete access"
                        //     );
                        // }

                        if (
                            payment.expenseId != null &&
                            payment.expenseId != undefined
                        ) {
                            this.presentToast(
                                "Expense payment never delete. you have to update from expense management"
                            );
                        } else if (
                            this.data.status === "Paid"
                        ) {
                            this.isView = true;
                            this.presentToast(`You cannot delete this payment as it is marked as Paid.`);
                        } else if (
                            this.isPropAdmin === false
                        ) {
                            this.isView = true;
                            this.presentToast(`You are not authorized to delete.`);
                        } else {
                            this.deleteConfirmation(payment);
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
                this.getPaymentInfoByReferanceNO();
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

    paymentModeChange() {
        // if (this.data.paymentMode == "Card") {
        //     this.isCard = true;
        // } else {
        //     this.isCard = false;
        // }

        // if (
        //     this.data.paymentMode == "Card" ||
        //     this.data.paymentMode == "BankTransfer" ||
        //     this.data.paymentMode == "Wallet"
        // ) {
        //     this.data.status = "Paid";
        // } else {
        //     this.data.status = "NotPaid";
        // }

        this.data.receiptNumber = undefined;
        if (
          this.data.paymentMode == "BankTransfer" ||
          this.data.paymentMode == "Wallet" ||
          this.data.paymentMode == "Card" ||
          this.isPaidPayment(this.data.paymentMode)
        ) {
          this.data.status = "Paid";
          this.status.disable();
        }
        else {
          this.status.enable();
          this.status.reset();
        }
    }

    isPaidPayment(mode)
    {
      if (this.propertyPaymentList.some(data => data.paymentMode === mode))
      {
        let propertyPayment = this.propertyPaymentList.find(data => data.paymentMode === mode);
        if (propertyPayment != undefined)
        {
          return propertyPayment.isPaid;
        }
        else
        {
          return false;
        }
  
      }
      else
      {
        return false;
      }
    }

    getPaymentInfoByReferanceNO() {
        this.paymentService
            .findPaymentByReferenceNumber(
                this.booking.propertyReservationNumber
            )
            .subscribe((response1) => {
                this.paymentListData = response1;
                this.changeDetectorRefs.detectChanges();
            });
    }

    checkPaymentAmount() {
        if (this.data.serviceId != null && this.data.serviceId != undefined) {
            if (this.service != null && this.service != undefined) {
                this.maxPaymentAmount =
                    this.service.afterTaxAmount +
                    this.transactionAmount -
                    this.servicePaymentAmount;
            }
        } else {
            this.maxPaymentAmount =
                this.totalBookingAmount -
                this.bookingTotalPayment +
                this.transactionAmount;
        }
        // this.maxPaymentAmount =
        //     this.totalBookingAmount -
        //     this.bookingTotalPayment +
        //     this.transactionAmount;

        this.changeDetectorRefs.detectChanges();
    }

    getTotalPaymentAmount(paymentDtoList) {
        let sum = 0;
        for (let i = 0; i < paymentDtoList.length; i++) {
            sum = sum + paymentDtoList[i].transactionAmount;
        }

        return sum;
    }

    getBookingInfoByID() {
        this.bookingService
            .findBooking(this.bookingId)
            .subscribe((response1) => {
                this.booking = response1.body;

                this.getPaymentInfoByReferanceNO();
                if ((this.data.businessServiceName == null && this.data.businessServiceName == undefined) && this.data.businessServiceName !== 'Restaurants' ) {
                    this.data.businessServiceName = "Accommodation";
                   }
                    this.data.currency = "inr";
                this.data.email = this.booking.email;
                this.data.referenceNumber =
                    this.booking.propertyReservationNumber;
                this.propertyReservationNumber = this.data.referenceNumber;
                // this.data.transactionAmount = this.booking.totalAmount;
                this.data.externalReference = this.booking.externalBookingId;
                // this.data.description = this.booking.notes;

                this.bookingService
                    .getAllServicesByBooking(this.booking.id)
                    .subscribe(
                        (response1) => {
                            if (response1.status === 200) {
                                this.services = response1.body;

                                if (
                                    this.data.serviceId != null &&
                                    this.data.serviceId != undefined &&
                                    this.services != null &&
                                    this.services != undefined &&
                                    this.services.length > 0
                                ) {
                                    this.setService(this.data.serviceId);
                                }

                                this.changeDetectorRefs.detectChanges();
                                //Logger.log('group service: '+ JSON.stringify(this.services));
                            }
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                this.presentToast(error.message);
                            }
                        }
                    );
            });
    }

    findBookings() {
        this.bookingData.propertyReservationNumber =
            this.propertyReservationNumber;
        this.bookingData.propertyId = this.token.getProperty().id;
        this.bookingService.findBookings(this.bookingData).subscribe((data) => {
            if (data.body != null && data.body != undefined) {
                this.bookingData = data.body[0];
                this.maxPaymentAmount = 0;
                this.bookingTotalPayment = 0;
                this.totalBookingAmount = 0;

                this.totalBookingAmount =
                    this.bookingData.payableAmount +
                    this.bookingData.totalServiceAmount +
                    this.bookingData.totalExpenseAmount;

                this.paymentService
                    .findPaymentByReferenceNumber(
                        this.bookingData.propertyReservationNumber
                    )
                    .subscribe((res) => {
                        this.payments = res;

                        if (
                            this.payments != undefined &&
                            this.payments != null &&
                            this.payments.length > 0
                        ) {
                            this.bookingTotalPayment =
                                this.getTotalPaymentAmount(this.payments);
                        }
                    });

                if (
                    this.data.transactionAmount != undefined &&
                    this.data.transactionAmount != null
                ) {
                    this.transactionAmount = this.data.transactionAmount;
                }
            }
            this.changeDetectorRefs.detectChanges();
        });
    }

    isServiceOrExpense() {
        let isReadOnly = false;

        if (this.data.expenseId != null && this.data.expenseId != undefined) {
            isReadOnly = true;
        }

        return isReadOnly;
    }

    isRoomOrder() {
        let isReadOnly = false;

        if (
            this.data.orderId != null &&
            this.data.orderId != undefined &&
            this.data.roomNumber != null &&
            this.data.roomNumber != undefined
        ) {
            isReadOnly = true;
        }

        return isReadOnly;
    }

    async onBalanceCalculate() {
        this.balanceLoader = true;
        this.bookingService
            .checkOutStandingAmountByBookingId(this.bookingId)
            .subscribe((response1) => {
                if (response1.status === 200) {
                    this.balanceLoader = false;
                    this.getBookingInfoById();
                }
            });
    }

    getBookingInfoById() {
        this.bookingService
            .findBooking(this.bookingId)
            .subscribe((response1) => {
                this.booking = response1.body;
                this.balanceLoader = false;
            });
    }

    userInfo() {
        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.data.businessEmail = resp.body.username;
            });

        this.data.propertyId = parseInt(this.token.getPropertyId());
    }

    toggleLayout() {
        //
        this.submitButtonText = "ADD";
        this.isView = false;
        this.reset();

        if (this.isCreateNewPayment == false) {
            this.headerIcon = "list";
            this.headerTitle = "Payment List";
            this.isCreateNewPayment = true;
            this.changeDetectorRefs.detectChanges();
            //  this.getPaymentInfoByReferanceNO();
            this.findBookings();
        } else {
            this.headerIcon = "add";
            this.headerTitle = "New Payment";
            this.isCreateNewPayment = false;
            this.data.transactionAmount = undefined;
            this.data = new Payment();
            this.bookingData = new Booking();
            this.data.date =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    new Date().getTime()
                );
            this.changeDetectorRefs.detectChanges();
            this.getBookingInfoByID();
            this.userInfo();
        }
    }

    onSubmit() {
        Logger.log("ss " + JSON.stringify(this.data));

        if (this.data.paymentMode != null && this.data.paymentMode === "Card") {
            Logger.log("onsubmit-credit card");
            this.chargeCreditCard();
        } else {
            Logger.log("onsubmit-process payment");
            this.processPayment(this.data);
        }
    }

    chargeCreditCard() {
        Logger.log("charde credit card " + JSON.stringify(this.data));
        (<any>window).Stripe.card.createToken(
            {
                number: this.data.cardNumber,
                exp_month: this.data.expMonth,
                exp_year: this.data.expYear,
                cvc: this.data.cvv,
            },
            (status: number, response: any) => {
                if (status === 200) {
                    const token = response.id;
                    this.data.token = token;
                    Logger.log(
                        "credit card status 200" + JSON.stringify(this.data)
                    );
                    this.processPayment(this.data);
                } else {
                    this.presentToast(
                        "Error message :" + response.error.message
                    );
                }
            }
        );
    }

    async processPayment(payment: Payment) {
        payment.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            payment.date
        );
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        Logger.log("before Data: " + JSON.stringify(payment));
        this.paymentService.processPayment(payment).subscribe((data) => {
            this.data = data.body;
            loader.dismiss();
            this.data.date =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    payment.date
                );
            Logger.log("Responce Data: " + JSON.stringify(this.data));

            if (
                this.data.paymentMode === "Card" &&
                this.data.status === "Paid"
            ) {
                this.presentToast("Payment processed successfully");
                this.paymentService.savePayment(this.data).subscribe((res) => {
                    if (res.status === 200) {
                        Logger.log("payment detail Save-in card and paid");

                        this.presentToast(`Payment Details Saved`);

                        this.getPaymentInfoByReferanceNO();
                        this.reset();
                        this.toggleLayout();
                    } else {
                        Logger.log("payment detail error -card");
                        this.presentToast(`Error in updating payment details`);
                    }
                });
            } else if (this.data.paymentMode != null) {
                Logger.log("payment method not null");
                this.paymentService.savePayment(this.data).subscribe((res) => {
                    if (res.status === 200) {
                        this.presentToast(`Payment Details Saved`);

                        this.reset();
                        this.getPaymentInfoByReferanceNO();
                        this.toggleLayout();
                    } else {
                        this.presentToast(`Error in updating payment details`);
                    }
                });
                //  this.reset();
            } else {
                loader.dismiss();
                this.presentToast("Error");
            }
        });
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    getExpenceAmountPaid() {
        return this.getTotalExpensePaidPaymentByBookingPayment(
            this.paymentListData
        );
    }

    balanceExpenceAmount() {
        return Math.abs(this.getExpenceAmountNotPaid());
    }

    getExpenceAmountNotPaid() {
        return (
            this.booking.totalExpenseAmount -
            this.getTotalExpensePaidPaymentByBookingPayment(
                this.paymentListData
            )
        );
    }

    getTotalExpensePaidPaymentByBookingPayment(paymentList) {
        let sum = 0;
        let paidPaymentList = [];
        if (paymentList != null && paymentList.length > 0) {
            paidPaymentList = paymentList.filter((item) => {
                const searchResult =
                    item.expenseId != null &&
                    item.expenseId != undefined &&
                    item.status != null &&
                    item.status === "Paid" &&
                    item.paymentMode != null &&
                    item.paymentMode != "Credit" &&
                    item.paymentMode != "BillToRoom" && item.paymentMode !="CreditIndividual";

                return searchResult;
            });
        }

        if (
            paidPaymentList != null &&
            paidPaymentList != undefined &&
            paidPaymentList.length > 0
        ) {
            for (let i = 0; i < paidPaymentList.length; i++) {
                sum = sum + paidPaymentList[i].transactionAmount;
            }
        }
        return sum;
    }

    getServiceAmountPaid() {
        return this.getTotalServicePaidPaymentByBookingPayment(
            this.paymentListData
        );
    }

    balanceServiceAmount() {
        return Math.abs(this.getServiceAmountNotPaid());
    }

    getServiceAmountNotPaid() {
        return (
            this.booking.totalServiceAmount -
            this.getTotalServicePaidPaymentByBookingPayment(
                this.paymentListData
            )
        );
    }

    getTotalServicePaidPaymentByBookingPayment(paymentList) {
        let sum = 0;
        let paidPaymentList = [];
        if (paymentList != null && paymentList.length > 0) {
            paidPaymentList = paymentList.filter((item) => {
                const searchResult =
                    item.serviceId != null &&
                    item.serviceId != undefined &&
                    item.status != null &&
                    item.status === "Paid" &&
                    item.paymentMode != null &&
                    item.paymentMode != "Credit" &&
                    item.paymentMode != "BillToRoom" && item.paymentMode !="CreditIndividual";

                return searchResult;
            });
        }

        if (
            paidPaymentList != null &&
            paidPaymentList != undefined &&
            paidPaymentList.length > 0
        ) {
            for (let i = 0; i < paidPaymentList.length; i++) {
                sum = sum + paidPaymentList[i].transactionAmount;
            }
        }
        return sum;
    }

    getRoomAmountPaid() {
        return this.getTotalRoomPaidPaymentByBookingPayment(
            this.paymentListData
        );
    }

    balanceRoomAmount() {
        return Math.abs(this.getRoomAmountNotPaid());
    }

    getRoomAmountNotPaid() {
        return (
            this.booking.payableAmount -
            this.getTotalRoomPaidPaymentByBookingPayment(this.paymentListData)
        );
    }

    getTotalRoomPaidPaymentByBookingPayment(paymentList) {
        let sum = 0;
        let paidPaymentList = [];
        if (paymentList != null && paymentList.length > 0) {
            paidPaymentList = paymentList.filter((item) => {
                const searchResult =
                    item.expenseId === null &&
                    item.serviceId == null &&
                    item.status != null &&
                    item.status === "Paid" &&
                    item.paymentMode != null &&
                    item.paymentMode != "Credit" &&
                    item.paymentMode != "BillToRoom" && item.paymentMode !="CreditIndividual";

                return searchResult;
            });
        }

        if (
            paidPaymentList != null &&
            paidPaymentList != undefined &&
            paidPaymentList.length > 0
        ) {
            for (let i = 0; i < paidPaymentList.length; i++) {
                sum = sum + paidPaymentList[i].transactionAmount;
            }
        }
        return sum;
    }

    dataCheck(data) {
        if (data != null && data != undefined) {
            return data;
        } else {
            return 0;
        }
    }

    getTotalBookingPaymentAmount() {
        return (
            this.dataCheck(this.booking.totalServiceAmount) +
            this.dataCheck(this.booking.payableAmount) +
            this.dataCheck(this.booking.totalExpenseAmount) -
            this.getChargeAppliedInBooking() -
            this.getBookingRefundAmount()
        );
    }

    getChargeAppliedInBooking() {
        return this.getTotalExpenseBookingChargeAmountByBookingPayment(
          this.payments
        );
      }
    

    getBookingRefundAmount() {
        return this.getTotalExpenseBookingRefundPaymentByBookingPayment(
            this.paymentListData
        );
    }

    getTotalExpenseBookingChargeAmountByBookingPayment(paymentList) {
        let sum = 0;
        let chargePaymentList = [];
        if (paymentList != null && paymentList.length > 0) {
          chargePaymentList = paymentList.filter((item) => {
            const searchResult =
              item.expenseId != null &&
              item.expenseId != undefined &&
              item.chargeAbleToBooking != null &&
              item.chargeAbleToBooking == true;
    
            return searchResult;
          });
        }
    
        if (
          chargePaymentList != null &&
          chargePaymentList != undefined &&
          chargePaymentList.length > 0
        ) {
          for (let i = 0; i < chargePaymentList.length; i++) {
            sum = sum + chargePaymentList[i].transactionAmount;
          }
        }
        return sum;
      }

    getTotalPaidPayment() {
        return (
            this.getRoomAmountPaid() +
            this.getExpenceAmountPaid() +
            this.getServiceAmountPaid() -
            this.getPaidRefundPayment() * 2
        );
    }

    getPaidRefundPayment() {
        return this.getTotalExpenseRefundPaidPaymentByBookingPayment(
            this.paymentListData
        );
    }

    totalBalanceAmount() {
        return Math.abs(this.getTotalNotPaidPayment());
    }

    getTotalNotPaidPayment() {
        return this.getTotalBookingPaymentAmount() - this.getTotalPaidPayment() -
        this.getCommitionAmount();
    }

    getTotalExpenseBookingRefundPaymentByBookingPayment(paymentList) {
        let sum = 0;
        let paidPaymentList = [];
        if (paymentList != null && paymentList.length > 0) {
            paidPaymentList = paymentList.filter((item) => {
                const searchResult =
                    item.expenseId != null &&
                    item.expenseId != undefined &&
                    item.businessServiceName != null &&
                    item.businessServiceName == "Booking Refund";

                return searchResult;
            });
        }

        if (
            paidPaymentList != null &&
            paidPaymentList != undefined &&
            paidPaymentList.length > 0
        ) {
            for (let i = 0; i < paidPaymentList.length; i++) {
                sum = sum + paidPaymentList[i].transactionAmount;
            }
        }
        return sum;
    }

    getPaidRefundAmount() {
        return this.getTotalExpenseRefundPaidPaymentByBookingPayment(
            this.paymentListData
        );
    }

    getTotalExpenseRefundPaidPaymentByBookingPayment(paymentList) {
        let sum = 0;
        let paidPaymentList = [];
        if (paymentList != null && paymentList.length > 0) {
            paidPaymentList = paymentList.filter((item) => {
                const searchResult =
                    item.expenseId != null &&
                    item.expenseId != undefined &&
                    item.businessServiceName != null &&
                    item.businessServiceName == "Booking Refund" &&
                    item.status != null &&
                    item.status === "Paid" &&
                    item.paymentMode != null &&
                    item.paymentMode != "Credit" &&
                    item.paymentMode != "BillToRoom" && item.paymentMode !="CreditIndividual";

                return searchResult;
            });
        }

        if (
            paidPaymentList != null &&
            paidPaymentList != undefined &&
            paidPaymentList.length > 0
        ) {
            for (let i = 0; i < paidPaymentList.length; i++) {
                sum = sum + paidPaymentList[i].transactionAmount;
            }
        }
        return sum;
    }
    getAmount(row) {
        if (row != null && row != undefined) {
          return row;
        } else {
          return 0;
        }
    }
    
    getCommitionAmount() {
        return (
          this.getAmount(this.booking.bookingCommissionAmount) +
          this.getAmount(this.booking.tcsFee) +
          this.getAmount(this.booking.tdsFee)
        );
      }
    
    
}
