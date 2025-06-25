import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { HTTPStatus } from 'src/app/app.interceptor';
import { AuthService } from 'src/app/service/auth.service';
import { ExpenseService } from 'src/app/service/ExpenseService/expense-service.service';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { OrderService } from 'src/app/service/Order/order.service';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { ReservationService } from 'src/app/service/ReservationService/reservation-service.service';
import { TokenStorage } from 'src/app/token.storage';
import { ApplicationUser } from '../user';
import { Booking } from '../manage-booking/Booking/Booking';
import { Payment } from '../manage-booking/Payment/Payment';
import { PropertyPayment } from '../PropertyPayment/propertyPayment';
import { BankAccount } from 'src/app/pages/business-setting/bank-details/BankAccount';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from '../manage-booking/Service/Service';
import { Order } from '../Order/order';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-collect-payment-modal',
  templateUrl: './collect-payment-modal.component.html',
  styleUrls: ['./collect-payment-modal.component.scss'],
})
export class CollectPaymentModalComponent implements OnInit {
  loader: boolean = false;
  order: Order;
  payment: Payment;
  paymentNotPaid: Payment;
  service: Service;
  orderId: number;
  outStandingAmount: number = 0;

  localCurrency: string;
  paymentAmount: number;
  
  PaymentAmountController: FormControl = new FormControl();

  paymentMode: FormControl = new FormControl();

  Description: FormControl = new FormControl();
  TransactionReferenceNumber: FormControl = new FormControl();
  paymentForm2: FormGroup;



  isBankTransferAvailable: boolean = false;
  bankAccount: BankAccount;
  propertyPaymentList: PropertyPayment[] = [];
  businessType: string;
  payments: Payment[] = [];
  booking: Booking;
  PaymentMode: string;
  lastFourDigitCardNumber: number;
  paymentDescription: string;
  user: ApplicationUser;
  PosUserName: string;
  isMarkAsPaid: boolean = false;
  data: any;
  bookoneOrderId: any;
  isButtonClicked = false;
  isBankAvailable: boolean;
  status: FormControl = new FormControl();
  constructor(private navParams: NavParams,
    private modalController: ModalController,
    private paymentService: PaymentService,
    private httpStatus: HTTPStatus,
    private token: TokenStorage,
    private orderService: OrderService,
    private bookingService: BookingService,
    private authService: AuthService,
    private expenseService: ExpenseService,
    private propertyService: PropertyService,
    private changeDetectorRefs: ChangeDetectorRef,
    public datepipe: DatePipe,
    private reservationService: ReservationService,
    private toastController: ToastController,
    private formBuilder: FormBuilder

  ) {   this.order = new Order();
    this.service = new Service();
    this.payment = new Payment();
    this.bankAccount = new BankAccount();
    this.booking = new Booking();
    this.user = new ApplicationUser();
    if(this.bankAccount != undefined && this.bankAccount != null)
      {
          this.isBankAvailable = true;
      }
      else
      {
          this.isBankAvailable = false;
      }
  }

    

  ngOnInit() {this.data = this.navParams.get('data');
    console.log('Order ID:', this.data);
    console.log("payment amount", this.paymentAmount)
    this.authService
    .getUserByUserId(this.token.getUserId())
    .subscribe((resp) => {
      this.user = resp.body;
      this.PosUserName = this.user.firstName + " " + this.user.lastName;

    });

    this.PaymentMode = "Cash";

    this.businessType = this.token.getProperty().businessType;
    this.getAllPropertyPayment(this.token.getProperty().id);
    this.bankAccount = this.token.getProperty().bankAccount;

    if (this.bankAccount != undefined && this.bankAccount != null) {
      this.isBankTransferAvailable = true;
    } else {
      this.isBankTransferAvailable = false;
    }

    this.localCurrency = this.token.getProperty().localCurrency.toUpperCase();
    this.orderId = this.data.id;

    if (this.data.markAsPaid != null && this.data.markAsPaid != undefined && this.data.markAsPaid === true)
    {
      this.isMarkAsPaid = true;
    }

    if (this.orderId != null && this.orderId != undefined)
    {
      this.getOrderByOrderId(this.orderId);
      this.balanceCalculate(this.orderId);
      this.servicebyOrderId(this.orderId);
    }

    this.paymentForm2 = this.formBuilder.group({
      PaymentAmountController: ['', [Validators.required, Validators.min(0)]],
      paymentMode: ["", Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.nullValidator])],
      TransactionReferenceNumber: [ "",Validators.compose([Validators.nullValidator]),
    ],
  });
  }

    dismiss() {
      this.modalController.dismiss();
      this.paymentForm2.reset();
      this.changeDetectorRefs.detectChanges();

    }
    
    ionViewWillEnter () {
      this.paymentForm2.reset();
      
    }
    getOrderDetailsById(id: number) {
      this.orderService
          .findById(id)
          .toPromise()
          .then((resp) => {
              this.order = resp.body;

              if (
                  this.order.bookOneOrderId != null &&
                  this.order.bookOneOrderId != undefined
              ) {
                  this.getPaymentByRevId(this.order.bookOneOrderId);
              }

              this.loader = false;
              this.changeDetectorRefs.detectChanges();
          })
          .catch((e) => {
              this.loader = false;
          });
  }

    
  getPaymentByRevId(revId: string) {
    this.loader = true;
    this.paymentService.findPaymentByReferenceNumber(revId).subscribe(
      (data) => {
        if (data.length > 0) {

          this.payments = data.filter((item) => {
            const searchResult =
              item.status != null &&
              item.status === "NotPaid";

            return searchResult;
          });
          this.loader = false;

        }
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  getAllPropertyPayment(propertyId: number) {
    this.loader = true;
    this.propertyService.getAllPaymentBypropertyId(propertyId).subscribe(
      (data) => {
        this.propertyPaymentList = data;
        console.log (this.propertyPaymentList)
        this.loader = false;
        this.changeDetectorRefs.detectChanges();
        // Logger.log(JSON.stringify( this.businessServices));
      },
      (error) => {
        this.loader = false;
      }
    );
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

  getOrderByOrderId(orderId: number) {
    this.loader = true;
    this.orderService.getOrderByOrderId(orderId).subscribe(
      (data) => {
        this.order = data.body;
        if (this.order.bookingId != null) {
          this.getBookingById();
        }
        if (this.order.deliveryMethod != "Room Order")
        {
          if (
            this.order.bookOneOrderId != null &&
            this.order.bookOneOrderId != undefined
          ) {
            this.getPaymentByRevId(this.order.bookOneOrderId);
          }
        }


        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  getBookingById() {
    this.bookingService.findBooking(this.order.bookingId).subscribe(
      (response1) => {
        this.booking = response1.body;
        this.getPaymentDetailsByBooking();
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  getPaymentDetailsByBooking()
  {
    this.paymentService
        .findPaymentByReferenceNumber(this.booking.propertyReservationNumber)
        .subscribe((res) => {

          this.payments = res.filter((item) => {
            const searchResult =
              item.orderId != null &&
              item.orderId === this.order.id &&
              item.status != null &&
              item.status === "NotPaid";

            return searchResult;
          });

    });
  }

  balanceCalculate(orderId: number) {
    this.loader = true;
    console.log("payment amount", this.paymentAmount)
    this.orderService.calculateOutstandingAmount(orderId).subscribe(
      (data) => {
        this.outStandingAmount = data.body;
        
        if (this.outStandingAmount < 0 || this.outStandingAmount === 0)
        {
          this.paymentDescription = "Tips";
        }

        if (this.isMarkAsPaid === true && this.outStandingAmount > 0)
        {
          this.paymentAmount = this.outStandingAmount;
        }
        console.log("payment amount", this.paymentAmount)
        console.log("outstanding", this.outStandingAmount)

        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  servicebyOrderId(orderId: number) {
    this.loader = true;
    this.orderService.findServicesByOrderId(orderId).subscribe(
      (data) => {
        if (data.body != null && data.body != undefined && data.body.length > 0)
        {
          this.service = data.body[0];
        }

        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  confirmPayment()
  {
    this.isButtonClicked = true;
    if (this.payments != null && this.payments != undefined && this.payments.length > 0)
    {
      this.payment = this.payments[0];
      for (let i = 1; i < this.payments.length; i++)
      {
        this.deletepayment(this.payments[i].id);
      }
    }

    if (this.payment.id === null || this.payment.id === undefined)
    {
      this.payment.createdBy = this.order.createdBy;
      this.payment.createdDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
      this.payment.lastModifiedBy = this.PosUserName;
      this.payment.lastModifiedDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    else
    {
      this.payment.lastModifiedBy = this.PosUserName;
      this.payment.lastModifiedDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }

    this.payment.counterNumber = String(this.token.getProperty().id);
    this.payment.operatorName = this.PosUserName;

    this.payment.transactionAmount = this.paymentAmount;
    this.payment.orderId = this.order.id;
    this.payment.amount = this.paymentAmount;
    this.payment.businessEmail = this.token.getProperty().email;
    this.payment.email = this.token.getProperty().email;
    this.payment.propertyId = parseInt(this.token.getPropertyId());
    this.payment.businessServiceName = "Restaurants";
    this.payment.currency = this.localCurrency;
    this.payment.date = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
    this.payment.createdDate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
    this.payment.chargeAbleToBooking = false;
    this.payment.status = "Paid";
    this.payment.paymentMode = this.PaymentMode;
    this.payment.lastFourDigitCardNumber = this.lastFourDigitCardNumber;
    if(this.paymentDescription != null){
      this.payment.description = this.paymentDescription;
    } else{
      this.payment.description = this.order.bookOneOrderId;
    }

    if (this.order.deliveryMethod === "Room Order")
    {
      this.payment.referenceNumber = this.booking.propertyReservationNumber;
      this.payment.externalReference = this.booking.propertyReservationNumber;
      if (this.payment.status === "NotPaid") {
        this.payment.paymentMode = "BillToRoom"
      }
      if (this.order.customerName != null) {
        this.payment.customerName = this.order.customerName;
      }
      
      if (this.order.roomNo != null && this.order.roomNo != undefined) {
        this.payment.roomNumber = this.order.roomNo;
      }

      if (this.order.serviceId != null && this.order.serviceId != undefined) {
        this.payment.serviceId = this.order.serviceId;
      }
     
    }
    else
    {
      this.payment.referenceNumber = this.order.bookOneOrderId;
      this.payment.externalReference = this.order.bookOneOrderId;
      if (this.payment.status === "NotPaid") {
        this.payment.paymentMode = "Cash"
      }
    }

    this.processPayment(this.payment);
  }

  processPayment(payment: Payment) {

    this.paymentService.processPayment(payment).subscribe((data) => {
      this.payment = data.body;

      this.paymentService.savePayment(this.payment).subscribe((res) => {
        if (res.status === 200) {
          this.calculateOrderAmount();
        } else {
          this.presentToast(`Error in updating payment details`);
        }
      });
    });
  }


  calculateOrderAmount() {
    console.log("payment amount", this.paymentAmount)
    this.orderService.calculateOutstandingAmount(this.order.id).subscribe(
      (data) => {

        if (data.body != null && data.body > 0)
        {
          this.confirmNotPaidPayment(data.body);
        }
        else
        {
          if (this.order.deliveryMethod === "Room Order")
          {
            if (this.service != null && this.service != undefined)
            {
              this.updateServiceToBooing(data.body,this.service);
            }
            else
            {
              this.dismiss();
            }
          }
          else
          {
            this.dismiss();
          }
        }

        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  updateServiceToBooing(amount : number, service : Service) {
    this.loader = true;
    service.balanceAmount = amount;
    if (amount < 0)
    {
      service.paidAmount = service.afterTaxAmount;
    }
    else
    {
      service.paidAmount = service.afterTaxAmount - amount;
    }
    this.bookingService.updateService(this.order.bookingId, service).subscribe(
      (response) => {
        if (response.status === 200) {
          this.loader = false;
          this.dismiss();
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.presentToast("Error!");

        }
      }
    );
  }
  deletepayment(Id) {
    this.paymentService.deletePaymentById(Id).subscribe(
      (data) => {
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.presentToast("Error!");
        }
      }
    );
  }

  confirmNotPaidPayment(amount)
  {
    let notPaidPayment = false;
    this.paymentNotPaid = new Payment();
    this.paymentNotPaid.transactionAmount = amount;
    this.paymentNotPaid.orderId = this.order.id;
    this.paymentNotPaid.amount = amount;
    this.paymentNotPaid.businessEmail = this.token.getProperty().email;
    this.paymentNotPaid.email = this.token.getProperty().email;
    this.paymentNotPaid.propertyId = parseInt(this.token.getPropertyId());
    this.paymentNotPaid.businessServiceName = "Restaurants";
    this.paymentNotPaid.currency = this.localCurrency;
    this.paymentNotPaid.date = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
    this.paymentNotPaid.createdDate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
    this.paymentNotPaid.chargeAbleToBooking = false;
    this.paymentNotPaid.status = "NotPaid";

    if (this.paymentNotPaid.id === null || this.paymentNotPaid.id === undefined)
    {
      this.paymentNotPaid.createdBy = this.order.createdBy;
      this.paymentNotPaid.createdDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
      this.paymentNotPaid.lastModifiedBy = this.PosUserName;
      this.paymentNotPaid.lastModifiedDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    else
    {
      this.paymentNotPaid.lastModifiedBy = this.PosUserName;
      this.paymentNotPaid.lastModifiedDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }

    this.paymentNotPaid.counterNumber = String(this.token.getProperty().id);
    this.paymentNotPaid.operatorName = this.PosUserName;
    this.paymentNotPaid.description = this.order.bookOneOrderId;

    if (this.order.deliveryMethod === "Room Order")
    {
      this.paymentNotPaid.paymentMode = "BillToRoom";
      this.paymentNotPaid.referenceNumber = this.booking.propertyReservationNumber;
      this.paymentNotPaid.externalReference = this.booking.propertyReservationNumber;
      if (this.order.customerName != null) {
        this.paymentNotPaid.customerName = this.order.customerName;
      }
      
      if (this.order.roomNo != null && this.order.roomNo != undefined) {
        this.paymentNotPaid.roomNumber = this.order.roomNo;
      }
      if (this.order.serviceId != null && this.order.serviceId != undefined) {
        this.paymentNotPaid.serviceId = this.order.serviceId;
      }
    }
    else
    {
      this.paymentNotPaid.paymentMode = this.PaymentMode;
      this.paymentNotPaid.lastFourDigitCardNumber = this.lastFourDigitCardNumber;
      this.paymentNotPaid.referenceNumber = this.order.bookOneOrderId;
      this.paymentNotPaid.externalReference = this.order.bookOneOrderId;
      if (this.paymentNotPaid.status === "NotPaid") {
        this.paymentNotPaid.paymentMode = "Cash"
      }
      this.paymentNotPaid.roomNumber = null;
    }

    this.paymentService.processPayment(this.paymentNotPaid).subscribe((data) => {
      this.paymentNotPaid = data.body;

      this.paymentService.savePayment(this.paymentNotPaid).subscribe((res) => {
        if (res.status === 200) {

          if (this.order.deliveryMethod === "Room Order")
          {
            this.updateServiceToBooing(this.paymentNotPaid.transactionAmount,this.service);
          }
          else
          {
            this.dismiss();
          }

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
}

