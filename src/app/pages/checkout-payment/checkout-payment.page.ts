import { Logger } from '../../service/logger.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Payment } from '../../model/manage-booking/Payment/Payment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Booking } from './../../model/manage-booking/Booking/Booking';
import { TranslateProvider } from '../../providers';
import { TokenStorage } from './../../token.storage';
import { AuthService } from './../../service/auth.service';
import { BookingService } from '../../service/manage-booking/booking-service.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { PaymentService } from '../../service/payment/payment.service';
import { ActionSheetController } from '@ionic/angular';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { MobileWallet } from 'src/app/model/wallet/mobileWallet';
import { BankAccount } from '../business-setting/bank-details/BankAccount';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.page.html',
  styleUrls: ['./checkout-payment.page.scss'],
})

export class CheckoutPaymentPage implements OnInit {

    isView: boolean = false;
    submitButtonText: string = "ADD";
  
    isCreateNewPayment: boolean = false;
    isCard: boolean = false;
    data: Payment;
    headerIcon: string = "add";
    headerTitle: string = "Create New Payment";
    paymentListData: Payment[] = [];
    booking: Booking;
  
    public onPaymentForm: FormGroup;
    public onCardForm: FormGroup;
  
    
    PaymentDate : FormControl = new FormControl();
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
      transactionAmount: FormControl = new FormControl();
      swiftCode: FormControl = new FormControl();
  
      WalletClientFN : FormControl = new FormControl();
      WalletClientLN : FormControl = new FormControl();
      WalletClientPhone : FormControl = new FormControl();
      WalletClientWP : FormControl = new FormControl();
      WalletURL : FormControl = new FormControl();
  
      TransactionReferenceNumber: FormControl = new FormControl();
  
      onbankForm: FormGroup;
      onWalletForm : FormGroup;
      bankAccount : BankAccount
      isBankAvailable: boolean;
      mobileWallet: MobileWallet;
      isWalletAvailable: boolean = false;
  
    constructor(
      private paymentService: PaymentService,
      private bookingService: BookingService,
      private dateService: DateService,
      private translate: TranslateProvider,
      private authService: AuthService,
      public token: TokenStorage,
      private zone: NgZone,
      private actionSheetController: ActionSheetController,
      private loadingCtrl: LoadingController,
      private toastController: ToastController,
      private formBuilder: FormBuilder
    ) {
      this.booking = new Booking();
      this.data = new Payment();
      this.bankAccount = new BankAccount();
      this.mobileWallet = new MobileWallet();
  
      this.bankAccount = this.token.getProperty().bankAccount;
      this.mobileWallet = this.token.getProperty().mobileWallet;
  
    
  
      if(this.mobileWallet != undefined && this.mobileWallet != null)
      {
          this.isWalletAvailable = true;
      }
      else
      {
          this.isWalletAvailable = false;
      }
  
      if(this.bankAccount != undefined && this.bankAccount != null)
      {
          this.isBankAvailable = true;
      }
      else
      {
          this.isBankAvailable = false;
      }
  
      this.businessPlan = this.token.getProperty().plan;
      this.onPaymentForm = this.formBuilder.group({
        'referenceNumber': ['', Validators.compose([
          Validators.nullValidator
        ])],
        'PaymentDate': ['', Validators.compose([
          Validators.nullValidator
        ])],
        'email': ['', Validators.compose([
          Validators.nullValidator
        ])],
        'externalReference': ['', Validators.compose([
          Validators.nullValidator
        ])],
        'description': ['', Validators.compose([
          Validators.nullValidator
        ])],
        'status': ['', Validators.compose([
          Validators.required
        ])],
        'paymentMode': ['', Validators.compose([
          Validators.required
        ])],
        'amount': ['', Validators.compose([
          Validators.required
        ])],
        'currency': ['', Validators.compose([
          Validators.required,
        ])]
      });
  
      this.onCardForm = this.formBuilder.group({
        'cardNumber': ['', Validators.compose([
          Validators.required
        ])],
        'name': ['', Validators.compose([
          Validators.required
        ])],
        'cvv': ['', Validators.compose([
          Validators.required
        ])],
        'expYear': ['', Validators.compose([
          Validators.required
        ])],
        'expMonth': ['', Validators.compose([
          Validators.required
        ])]
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
          WalletClientFN: ["", Validators.compose([Validators.nullValidator])],
          WalletClientLN: ["", Validators.compose([Validators.nullValidator])],
          WalletClientPhone: ["", Validators.compose([Validators.nullValidator])],
          WalletClientWP: ["", Validators.compose([Validators.nullValidator])],
          WalletURL : ["", Validators.compose([Validators.nullValidator])],
          TransactionReferenceNumber: [
              "",
              Validators.compose([Validators.required]),
          ],
      });
  
    }
  
    reset() {
      this.onCardForm.reset();
      this.isCard = false;
  
      this.onPaymentForm.reset();
      this.booking = new Booking();
      this.data = new Payment();
  
      this.getBookingInfoByID();
      this.userInfo();
  
    }
  
    async onPaymentOption(payment: Payment) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Payment option',
        buttons: [{
          text: 'View',
          icon: 'eye',
          handler: () => {
            Logger.log('paymentoption' + JSON.stringify(payment));
            this.toggleLayout();
            this.data = payment;
            this.data.date = this.dateService.convertMillisecondsToYYYMMDDFormat(this.data.date);
            this.data.currency = payment.currency.toLowerCase();
            this.isView = true;
            this.submitButtonText = "ADD";
            Logger.log('Cancel clicked');
          }
        }, {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            Logger.log('paymentoption' + JSON.stringify(payment));
            this.toggleLayout();
            this.data = payment;
            this.data.currency = payment.currency.toLowerCase();
            this.data.date = this.dateService.convertMillisecondsToYYYMMDDFormat(this.data.date);
            this.submitButtonText = "UPDATE";
            this.isView = false;
  
            if(this.data.status ==='Paid')
            {
              this.isView = true;
            }
            Logger.log('Cancel clicked');
          }
        }, {
          text: 'Close',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            Logger.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
  
    }
  
    paymentModeChange() {
      Logger.log('paymentMOde :' + this.data.paymentMode);
  
      if (this.data.paymentMode == "Card") {
  
        this.isCard = true;
      }
      else {
        this.isCard = false;
      }
  
      if (this.data.paymentMode == "Card" || this.data.paymentMode == "BankTransfer" || this.data.paymentMode == "Wallet") {
  
           this.data.status ="Paid";
         }
        else {
          this.data.status ="NotPaid";
        }
    }
  
    getPaymentInfoByReferanceNO() {
      this.paymentService.findPaymentByReferenceNumber(this.booking.propertyReservationNumber).subscribe(response1 => {
        this.paymentListData = response1;
      });
    }
  
    getBookingInfoByID() {
      Logger.log('ID ' + this.token.getBookingId());
      this.bookingService.findBooking((this.token.getBookingId())).subscribe(response1 => {
  
        this.getPaymentInfoByReferanceNO();
        this.booking = response1.body;
        this.data.email = this.booking.email;
        this.data.referenceNumber = String(this.booking.id);
       // this.data.transactionAmount = this.booking.totalAmount;
        this.data.externalReference = this.booking.externalBookingId;
        this.data.description = this.booking.notes;
  
        Logger.log(this.booking);
      });
    }
  
    ngOnInit() {
      this.getBookingInfoByID();
      this.userInfo();
    }
  
    userInfo() {
      this.authService.getUserByUserId(this.token.getUserId()).subscribe(resp => {
        this.data.businessEmail = resp.body.username;
      });
  
      this.data.propertyId = parseInt(this.token.getPropertyId());
    }
  
    toggleLayout() {
     // 
      this.submitButtonText = "ADD";
      this.isView = false;
  
      if (this.isCreateNewPayment == false) {
        this.headerIcon = "list";
        this.headerTitle = "Payment List"
        this.isCreateNewPayment = true;
        this.getPaymentInfoByReferanceNO();
      }
      else {
        this.headerIcon = "add";
        this.headerTitle = "Create New Payment"
        this.isCreateNewPayment = false;
        this.data.transactionAmount = undefined;
        this.data = new Payment();
        this.data.date = this.dateService.convertMillisecondsToYYYMMDDFormat(new Date().getTime());
        this.getBookingInfoByID();
        this.userInfo();
      }
    }
  
    onSubmit() {
      Logger.log('ss ' + JSON.stringify(this.data));
  
      if (this.data.paymentMode != null && this.data.paymentMode === 'Card') {
  
        Logger.log('onsubmit-credit card');
        this.chargeCreditCard();
  
      } else {
        Logger.log('onsubmit-process payment');
        this.processPayment(this.data);
  
      }
  
    }
  
    chargeCreditCard() {
      Logger.log('charde credit card ' + JSON.stringify(this.data));
      (<any>window).Stripe.card.createToken({
        number: this.data.cardNumber,
        exp_month: this.data.expMonth,
        exp_year: this.data.expYear,
        cvc: this.data.cvv,
  
      }, (status: number, response: any) => {
        if (status === 200) {
          const token = response.id;
          this.data.token = token;
          Logger.log('credit card status 200' + JSON.stringify(this.data));
          this.processPayment(this.data);
        } else {
          this.presentToast('Error message :' + response.error.message);
        }
      });
    }
  
    async processPayment(payment: Payment) {
  
      payment.date = this.dateService.convertMillisecondsToYYYMMDDFormat(payment.date);
      const loader = await this.loadingCtrl.create({
        duration: 5000
      });
  
      loader.present();
      Logger.log('before Data: ' + JSON.stringify(payment));
      this.paymentService.processPayment(payment)
        .subscribe(data => {
          this.data = data.body;
          loader.dismiss();
          this.data.date = this.dateService.convertMillisecondsToYYYMMDDFormat(payment.date);
          Logger.log('Responce Data: ' + JSON.stringify(this.data));
  
          if (this.data.paymentMode === 'Card' && this.data.status === 'Paid') {
            this.presentToast('Payment processed successfully');
            this.paymentService.savePayment(this.data).subscribe(res => {
              if (res.status === 200) {
                Logger.log('payment detail Save-in card and paid');
  
                this.presentToast(`Payment Details Saved`);
  
                this.getPaymentInfoByReferanceNO();
                this.reset();
                this.toggleLayout();
  
              } else {
                Logger.log('payment detail error -card');
                this.presentToast(`Error in updating payment details`);
              }
            });
  
          } else if (this.data.paymentMode != null) {
            Logger.log('payment method not null');
            this.paymentService.savePayment(this.data).subscribe(res => {
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
        duration: 2000
      });
      toast.present();
    }
  
}
  
