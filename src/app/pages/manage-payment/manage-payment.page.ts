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
import { NavController, LoadingController } from "@ionic/angular";
import { PaymentService } from "../../service/payment/payment.service";
import { DateService } from "../../service/DateService/date-service.service";
import { ActivatedRoute } from "@angular/router";
import { Property } from "src/app/model/property/Property";
import { PhoneNumberEXP } from "src/app/app.component";
import { BankAccount } from "../business-setting/bank-details/BankAccount";
import { MobileWallet } from "src/app/model/wallet/mobileWallet";
import { Location } from "@angular/common";
import { CheckUserType } from "src/app/model/checkUserType";
import { PropertyPayment } from "src/app/model/PropertyPayment/propertyPayment";
import { OrderService } from "src/app/service/Order/order.service";

@Component({
    selector: "app-manage-payment",
    templateUrl: "./manage-payment.page.html",
    styleUrls: ["./manage-payment.page.scss"],
})
export class ManagePaymentPage implements OnInit {
    isView: boolean = false;
    permission: string;
    property: Property;
    isResetButtonDisable: boolean = false;

    isCreateNewPayment: boolean = false;
    isCard: boolean = false;
    data: Payment;
    headerIcon: string = "add";
    headerTitle: string = "Create New Payment";
    paymentListData: Payment[] = [];
    booking: Booking;

    onPaymentUserForm: FormGroup;
    onCardUserForm: FormGroup;

    isReadOnlyField: boolean = false;
    isUpdateTime: boolean = false;

    PaymentDate: FormControl = new FormControl();
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

    submitButtonText: string = "Submit";
    onbankForm: FormGroup;

    minDate: string;

    accountName: FormControl = new FormControl();
    accountNumber: FormControl = new FormControl();
    bankName: FormControl = new FormControl();
    branchName: FormControl = new FormControl();
    transactionAmount: FormControl = new FormControl();
    swiftCode: FormControl = new FormControl();
    bankAccount: BankAccount;
    isBankAvailable: boolean;
    mobileWallet: MobileWallet;
    isWalletAvailable: boolean;
    onWalletForm: FormGroup;

    WalletClientFN: FormControl = new FormControl();
    WalletClientLN: FormControl = new FormControl();
    WalletClientPhone: FormControl = new FormControl();
    WalletClientWP: FormControl = new FormControl();
    WalletURL: FormControl = new FormControl();
    localCurrency: string;

    p: number = 1;

    isPropAdmin: boolean = false;
    checkUserType: CheckUserType;
    role: any[];

    propertyPaymentList: PropertyPayment[] = [];
    businessType: string;
    onTRForm: FormGroup;
    orderStatus: any;
    orderpaymentstatus: any;
    
    constructor(
        private paymentService: PaymentService,
        private bookingService: BookingService,
        private translate: TranslateProvider,
        private alertCtrl: AlertController,
        private changeDetectorRefs: ChangeDetectorRef,
        private authService: AuthService,
        public token: TokenStorage,
        private dateService: DateService,
        private locationBack: Location,
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private zone: NgZone,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private formBuilder: FormBuilder,
           private orderService: OrderService,
    ) {
        this.booking = new Booking();
        this.data = new Payment();
        this.property = new Property();
        this.bankAccount = new BankAccount();
        this.mobileWallet = new MobileWallet();
        this.checkUserType = new CheckUserType();

        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });

        if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
            this.isPropAdmin = true;
        } else {
            this.isPropAdmin = false;
        }

        this.data.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date().getTime()
        );
        
        
        this.onTRForm = this.formBuilder.group({
            TransactionReferenceNumber: [
                "",
                Validators.compose([Validators.required]),
            ],
        });


        this.onPaymentUserForm = this.formBuilder.group({
            referenceNumber: ["", Validators.compose([Validators.required])],
            email: [
                "",
                Validators.compose([
                    Validators.pattern(
                        "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
                    ),
                    Validators.nullValidator,
                    Validators.email,
                ]),
            ],
            PaymentDate: ["", Validators.compose([Validators.nullValidator])],
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

        this.onCardUserForm = this.formBuilder.group({
            cardNumber: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],
            name: ["", Validators.compose([Validators.required])],
            cvv: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],
            expYear: ["", Validators.compose([Validators.required])],
            expMonth: ["", Validators.compose([Validators.required])],
        });

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
    }

    ngOnInit() {
        this.property = this.token.getProperty();
        this.businessType = this.token.getProperty().businessType;
        this.getAllPropertyPayment(this.token.getProperty().id);

        this.bankAccount = this.token.getProperty().bankAccount;

        if (this.bankAccount != undefined && this.bankAccount != null) {
            this.isBankAvailable = true;
        } else {
            this.isBankAvailable = false;
        }

        this.mobileWallet = this.token.getProperty().mobileWallet;
        if (this.mobileWallet != undefined && this.mobileWallet != null) {
            this.isWalletAvailable = true;
        } else {
            this.isWalletAvailable = false;
        }

        if (
            this.token.getProperty().localCurrency != null &&
            this.token.getProperty().localCurrency != undefined
        ) {
            this.localCurrency = this.token
                .getProperty()
                .localCurrency.toUpperCase();
            if (this.data.currency != null && this.data.currency != undefined) {
                this.data.currency = "inr"
            }
        }

        this.route.queryParams.subscribe((params) => {
            if (params["permission"] != undefined) {
                this.permission = params["permission"];
                Logger.log("this.permission" + this.permission);
                if (this.permission === "1") {
                    this.isView = true;
                    this.isResetButtonDisable = true;
                    this.submitButtonText = "Update";
                } else if (this.permission === "2") {
                    this.isView = false;
                    this.isReadOnlyField = false;
                    this.isUpdateTime = true;
                    this.submitButtonText = "Update";
                } else if (this.permission === "3") {
                    this.isView = false;
                    this.isReadOnlyField = false;
                    this.isUpdateTime = true;
                    this.submitButtonText = "Update";
                }
            }

            if (params["paymentOb"] != undefined) {
                this.data = JSON.parse(params["paymentOb"]);
                this.data.currency = 'inr'
                this.data.amount = this.data.transactionAmount;
                this.data.date =
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        this.data.date
                    );
            }
            if (params["oderStatus"] != undefined) {
                this.orderStatus = params["oderStatus"];
                console.log("order status " + this.orderStatus);
              
            }
            if (params["status"] != undefined) {
                this.orderpaymentstatus = params["status"];
               
              
            }
        });

        this.userInfo();
    }

    navigateToPage() {
        this.locationBack.back()
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

    userInfo() {
        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.data.businessEmail = resp.body.username;
            });

        this.data.propertyId = parseInt(this.token.getPropertyId());
    }

    reset() {
        if (this.isCard == true) {
            this.onCardUserForm.reset();
        }

        this.isCard = false;
        this.onPaymentUserForm.reset();
        this.booking = new Booking();
        this.data = new Payment();

        this.isCard = false;
        this.onPaymentUserForm.reset();
        this.isReadOnlyField = false;
        //this.userInfo();

        if (
            this.token.getProperty().localCurrency != null &&
            this.token.getProperty().localCurrency != undefined
        ) {
            this.localCurrency = this.token
                .getProperty()
                .localCurrency.toUpperCase();
            if (this.data.currency != null && this.data.currency != undefined) {
                this.data.currency = this.localCurrency.toLowerCase();
            }
        }
    }

    onSubmit() {
        this.data.propertyId = Number(this.token.getPropertyId());
        this.data.netReceivableAmount = this.data.amount;
        this.data.transactionAmount = this.data.amount;
        this.data.transactionChargeAmount = this.data.amount;
      this.data.cardNumber = this.data.cardNumber
        Logger.log("ss " + JSON.stringify(this.data));

        // if (this.data.paymentMode != null && this.data.paymentMode === "Card") {
        //     Logger.log("onsubmit-credit card");
        //     this.chargeCreditCard();
        // }
      
            Logger.log("onsubmit-process payment");
            this.savePayment(this.data);
        
    }

    onEdit() {
        if (
            this.data.status.toLocaleLowerCase() == "paid" &&
            this.isPropAdmin === false
        ) {
            this.presentToast(
                "You can not update this payment. Already paid this payment"
            );
        } else {
            this.isView = false;
            this.isReadOnlyField = false;
            this.isUpdateTime = true;
            this.isResetButtonDisable = true;
            this.changeDetectorRefs.detectChanges();
        }
    }

    paymentModeChange() {
        // Logger.log("paymentMOde :" + this.data.paymentMode);

        // if (this.data.paymentMode == "Card") {
        //     this.data.status = "Paid";
        //     this.isCard = true;
        // } else {
        //     this.isCard = false;
        // }

        // if (
        //     this.data.paymentMode == "BankTransfer" ||
        //     this.data.paymentMode == "Wallet" ||
        //     this.data.paymentMode == "Card"
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

    paymentList() {
        setTimeout(() => {
            this.navCtrl.navigateForward("payment-list");
        }, 3000);
    }

    cancel() {
        this.reset();
        //this.navCtrl.navigateForward('payment-list');
        this.locationBack.back();
    }

    async chargeCreditCard() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();

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
            this.data.date
        );
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        Logger.log("before Data: " + JSON.stringify(payment));
        this.paymentService.processPayment(payment).subscribe((data) => {
            this.data = payment;
            this.data.currency = 'inr'
            loader.dismiss();

            this.savePayment(this.data);
        });
    }

    async savePayment(payment: Payment) {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();

        Logger.log("payment- : " + JSON.stringify(payment));
        payment.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            this.data.date
        );
        this.paymentService.savePayment(payment).subscribe((res) => {
            if (res.status === 200) {
                Logger.log(
                    "payment detail Save-in card and paid" +
                        JSON.stringify(res.body)
                );
             
                    this.calculateOrderAmount();

                if (payment.id != undefined && payment.id != null) {
                    this.presentToast("Payment details  updated");
                } else {
                    this.presentToast("Payment details  created");
                }

                this.reset();
                loader.dismiss();

                // if(this.permission != undefined && this.permission != null && this.permission === '3')
                // {
                //     this.locationBack.back();
                // }
                // else
                // {
                //     this.paymentList();
                // }
                this.locationBack.back();
            } else {
                Logger.log("payment detail error -card");
                this.presentToast(`Error in updating payment details`);
            }
        });
    }

    calculateOrderAmount() {
        this.orderService.calculateOutstandingAmount(this.data.orderId).subscribe(
          (data) => {

            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            // this.loader = false;
          }
        );
      }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
}
