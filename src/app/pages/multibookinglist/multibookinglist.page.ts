import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController, ToastController } from '@ionic/angular';
import { ActionBookingMenuComponent } from 'src/app/component/booking-list/action-booking-menu/action-booking-menu.component';
import { CheckoutDialogComponent } from 'src/app/component/booking-list/checkout-dialog/checkout-dialog.component';
import { Address } from 'src/app/model/address-checker/Address';
import { Invoice } from 'src/app/model/invoice/invoice';
import { InvoiceLine } from 'src/app/model/invoice/invoiceLines';
import { Booking } from 'src/app/model/manage-booking/Booking/Booking';
import { Payment } from 'src/app/model/manage-booking/Payment/Payment';
import { Service } from 'src/app/model/manage-booking/Service/Service';
import { Property } from 'src/app/model/property/Property';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { TokenStorage } from 'src/app/token.storage';
import { BankAccount } from '../business-setting/bank-details/BankAccount';

@Component({
  selector: 'app-multibookinglist',
  templateUrl: './multibookinglist.page.html',
  styleUrls: ['./multibookinglist.page.scss'],
})
export class MultibookinglistPage implements OnInit {

    property: Property;
    bookings: Booking[] = [];
    bookingCheckoutFilterData: Booking[]= [];
    invoiceAddedbookings : Booking[]= [];
    booking: Booking;
    groupBookingId: any;
    currency: string;

    loader : boolean = false;

    bookingPaymentsFilter : Payment[]= [];
    invoiceLine: InvoiceLine;
    invoiceLines: any[] = [];
    invoice: Invoice;
    services : Service[]=[];
    orderAmountWithDiscount: number;
    bankAccount: BankAccount;
    address: Address;

    constructor(private acRoute : ActivatedRoute,
        public token: TokenStorage,
        private routerOutlet: IonRouterOutlet,
        public datepipe: DatePipe,
        private toastController: ToastController,
        public bookingService: BookingService,
        public modalController: ModalController,
        private changeDetectorRefs: ChangeDetectorRef,
        private navCtrl :NavController)  
        { 
            this.property = new Property();
            this.bankAccount = new BankAccount();
            this.invoice = new Invoice();
            this.address = new Address();
            this.invoiceLine = new InvoiceLine();
        }

  ngOnInit() {

    this.property = this.token.getProperty();

    if (
        this.token.getProperty().localCurrency != null ||
        this.token.getProperty().localCurrency != undefined
      ) {
        this.currency = this.token.getProperty().localCurrency.toUpperCase();
      }

      if (
        this.token.getProperty().bankAccount != null ||
        this.token.getProperty().bankAccount != undefined
      ) {
        this.bankAccount = this.token.getProperty().bankAccount;
      }
  
      if (this.token.getProperty().address != null || this.token.getProperty().address != undefined) {
        this.address = this.token.getProperty().address;
      }

      this.invoice.propertyId = this.token.getProperty().id;
    this.invoice.invoiceTo = "Customer";
    this.invoice.invoiceStatus = "Paid";
    this.invoice.paymentStatus = "Paid";

    this.invoice.invoiceLinesDto = [];

    const currentDate: Date = new Date();
    this.invoice.invoiceDate = this.getDateDBFormat(currentDate);
    this.invoice.dueDate = this.getDateDBFormat(currentDate);

    this.invoiceLines = [];


    this.acRoute.queryParams.subscribe(params => {
     
        if(params["groupBookingId"] != undefined)
        {
            this.groupBookingId = JSON.parse(params["groupBookingId"]);
            this.getBookingListByGroupBookingId(this.groupBookingId);
        }
       
    });
  }

  getDateDBFormat(date: Date) {
    let currentDay: string;
    let currentMonth: string;

    if (date.getDate().toString().length == 1) {
      currentDay = "0" + date.getDate();
    } else {
      currentDay = "" + date.getDate();
    }

    if ((date.getMonth() + 1).toString().length == 1) {
      currentMonth = "0" + (date.getMonth() + 1);
    } else {
      currentMonth = "" + (date.getMonth() + 1);
    }
    return date.getFullYear() + "-" + currentMonth + "-" + currentDay;
  }

  getBookingListByGroupBookingId(groupBookingId : number){
    this.loader = true;
    this.bookings = [];
    this.bookingService
      .findBookingByGroupBookingId(groupBookingId)
      .subscribe(
        (data) => {
          this.bookings = data.body;
          this.loader = false;
          this.changeDetectorRefs.detectChanges();
        },
        (error) => {
          this.loader = false;
        }
      );
  }

  listIndex(booking) {
    //this.selectedIndex = index;
    if (booking.isToggle === true) {
        booking.isToggle = false;
        // this.selectedIndex = undefined;
    } else {
        booking.isToggle = true;
    }
}

async viewdetail(booking: any) {
    this.actionMenuModal(booking);
}

async actionMenuModal(booking: Booking) {
    const modal = await this.modalController.create({
        component: ActionBookingMenuComponent,
        cssClass: "my-custom-class",
        swipeToClose: true,
        componentProps: {
            booking: booking,
            isMultiBooking : true,
        },
        presentingElement: this.routerOutlet.nativeEl,
    });

    modal.onDidDismiss().then((data) => {
     
        if (data != undefined && data != null && data.data === "done") {
            this.getBookingListByGroupBookingId(this.groupBookingId);
        } 
        // else if (
        //     data != undefined &&
        //     data != null &&
        //     data.data === "checkout"
        // ) {
        //     this.getRatesAndAvailability(booking);
        //     this.bookingChanged();
        // }
    });
    return await modal.present();
}

getTotalPaidPayment(row) {
    return (
      this.getRoomAmountPaid(row) +
      this.getExpenceAmountPaid(row) +
      this.getServiceAmountPaid(row) -
      this.getPaidRefundPayment(row) * 2
    );
  }

  getPaidRefundPayment(row) {
    if(row.paymentDtoList != null && row.paymentDtoList != undefined){
      return this.getTotalExpenseRefundPaidPaymentByBookingPayment(row.paymentDtoList);
    }
    else
    {
      return 0;
    }
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
          item.paymentMode != "BillToRoom"&& item.paymentMode !="CreditIndividual";

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

  getServiceAmountPaid(row) {
    if(row.paymentDtoList != null && row.paymentDtoList != undefined){
      return this.getTotalServicePaidPaymentByBookingPayment(row.paymentDtoList);
    }
    else
    {
      return 0;
    }
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

  getExpenceAmountPaid(row) {
    if(row.paymentDtoList != null && row.paymentDtoList != undefined){
      return this.getTotalExpensePaidPaymentByBookingPayment(row.paymentDtoList);
    }
    else
    {
      return 0;
    }
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

  getRoomAmountPaid(row) {

    if(row.paymentDtoList != null && row.paymentDtoList != undefined){
      return this.getTotalRoomPaidPaymentByBookingPayment(row.paymentDtoList);
    }
    else
    {
      return 0;
    }
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

  getTotalNotPaidPayment(row) {
    return this.getTotalPaymentAmount(row) - this.getTotalPaidPayment(row);
  }

  getTotalPaymentAmount(row) {
    return (
      this.dataCheck(row.totalServiceAmount) +
      this.dataCheck(row.payableAmount) +
      this.dataCheck(row.totalExpenseAmount) -
      this.getChargeAppliedInBooking(row) -
      this.getBookingRefundAmount(row)
    );
  }

  getBookingRefundAmount(row) {
    if(row.paymentDtoList != null && row.paymentDtoList != undefined){
      return this.getTotalExpenseBookingRefundPaymentByBookingPayment(
        row.paymentDtoList
      );
    }
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


  getChargeAppliedInBooking(row) {
    if(row.paymentDtoList != null && row.paymentDtoList != undefined){
      return this.getTotalExpenseBookingChargeAmountByBookingPayment(
        row.paymentDtoList
      );
    }
    else
    {
      return 0;
    }
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

  dataCheck(data) {
    if (data != null && data != undefined) {
      return data;
    } else {
      return 0;
    }
  }

  checkOutstandingAmount(){

    let isDueAmount =  false;

    if(this.bookings.length >0){
      for(let i = 0; i < this.bookings.length ; i++){
        if(this.getTotalNotPaidPayment( this.bookings[i]) > 0){
          isDueAmount = true;
        }
      }
    }
    else
    {
      isDueAmount = true;
    }

    return isDueAmount;

  }

  checkBookingStatus(){

    let bookingCheckinFilterData = this.bookings.filter((item) => {
      const searchResult =
        (item.bookingStatus != null &&
         item.bookingStatus === 'CHECKEDIN')
      return searchResult;
    });



    if(bookingCheckinFilterData != null && bookingCheckinFilterData != undefined && bookingCheckinFilterData.length  === this.bookings.length )
    {
      return false;
    }
    else
    {
      return true;
    }

  }


  totalBalanceAmount(row) {
    return Math.abs(this.getTotalNotPaidPayment(row));
  }

  checkOutTimeDialog(){
    this.singleCheckoutDialog(); 
}

async singleCheckoutDialog() {
    const modal = await this.modalController.create({
        component: CheckoutDialogComponent,

        componentProps: {
            isMultiBooking : true,
        },
    });
    modal.onDidDismiss().then((data) => {
        console.log("data.data !" + JSON.stringify(data.data));
        if (data.data != null && data.data != undefined) {
            this.checkOutAll(data.data);
        }
    });
    return await modal.present();
}

checkOutAll(checkoutTime : string){
    this.bookingService.roomRealeseByGroupBookingId(this.groupBookingId).subscribe(
      (response) => {

        this.bookingService.updateBookingStatusByGroupBookingId(this.groupBookingId,"CHECKEDOUT",checkoutTime).subscribe(
          (response) => {
            this.presentToast("All bookings checkout successfully");
            this.getBookingListByGroupBookingId(this.groupBookingId);
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 417) {
                this.loader = false;
              }
            }
          }
        );

      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 417) {
            this.loader = false;
          }
        }
      }
    );
  }

  allBookingCheckOut(){

    let bookings = this.bookings.filter((item) => {
     const searchResult =
       (item.bookingStatus != null &&
        item.bookingStatus != 'CHECKEDOUT' )

        // && item.multiBookingInvoice != null &&
       // item.multiBookingInvoice === true

     return searchResult;
   });

    if(bookings != null && bookings != undefined && bookings.length >0){
      return bookings.length;
    }
    else
    {
      return 0;
    }
  }

  checkBookingInvoice(){

    let bookingCheckoutFilterData = this.bookings.filter((item) => {
      const searchResult =
        (item.invoiceId != null &&
         item.invoiceId != undefined)
      return searchResult;
    });

    if(bookingCheckoutFilterData != null && bookingCheckoutFilterData != undefined && bookingCheckoutFilterData.length  > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }


  async presentToast(Message: string) {
    const toast = await this.toastController.create({
        message: Message,
        duration: 2000,
    });
    toast.present();
}

submit(){

    this.bookingCheckoutFilterData = this.bookings.filter((item) => {
      const searchResult =
        (item.bookingStatus != null &&
         item.bookingStatus === 'CHECKEDOUT')
        //  && item.multiBookingInvoice != null &&
         //item.multiBookingInvoice === true

      return searchResult;
    });

    this.loader = true;

    if(this.bookingCheckoutFilterData != null && this.bookingCheckoutFilterData != undefined && this.bookingCheckoutFilterData.length >0){

      this.invoiceAddedbookings = [];

      this.booking =  new Booking();
      this.booking =   this.bookingCheckoutFilterData[0];
      this.onAddBookingAddressLine();
    }
    else
    {
      this.presentToast("No booking found");
      this.loader = false;
    }
  }
  onAddBookingAddressLine() {

    this.bookingPaymentsFilter = [];
    if(this.booking.paymentDtoList != null && this.booking.paymentDtoList != undefined && this.booking.paymentDtoList.length >0)
    {
      this.bookingPaymentsFilter = this.booking.paymentDtoList;
    }

    this.services = [];
    if(this.booking.services != null && this.booking.services != undefined && this.booking.services.length >0)
    {
      this.services = this.booking.services;
    }

    this.invoiceAddedbookings.push(this.booking);

    if (this.booking.outstandingAmount < 0) {

      this.invoiceLine.description =
        "Guest Name : " +
        this.booking.firstName +
        " " +
        this.booking.lastName +
        ", Room Name : " +
        this.booking.roomName +
        " No Of Room: " +
        this.booking.noOfRooms +
        " No Of Night: " +
        this.booking.noOfNights +
        " Source : " +
        this.booking.externalSite;
      this.invoiceLine.productCode = this.booking.propertyReservationNumber;
      this.invoiceLine.quantity = 1;
      // this.invoiceLine.unitPrice = Number(this.booking.roomTariffBeforeDiscount);

      if (
        this.booking.discountAmount != null &&
        this.booking.discountAmount != undefined
      ) {
        this.invoiceLine.discountAmount = this.booking.discountAmount;
      } else {
        this.invoiceLine.discountAmount = 0;
      }
      this.invoiceLine.unitPrice =
        this.booking.beforeTaxAmount + this.invoiceLine.discountAmount;
      this.invoiceLine.beforeTaxAmount =
        this.booking.beforeTaxAmount + this.invoiceLine.discountAmount;
      this.invoiceLine.taxAmount = this.booking.taxAmount;
      this.invoiceLine.afterTaxAmount =
        this.booking.payableAmount + this.invoiceLine.discountAmount;

      this.invoiceLine.taxPercentage = this.getBookingTaxPercentage(
        this.booking
      );

      if (this.booking.roomTariffPaid != null) {
        this.invoiceLine.paidAmount = this.booking.roomTariffPaid;
      }

      if (this.booking.roomTariffPending != null) {
        this.invoiceLine.balanceAmount =
          this.booking.roomTariffPending + this.invoiceLine.discountAmount;
      } else {
        this.invoiceLine.balanceAmount =
          0 + this.invoiceLine.discountAmount;
      }
    }

    else {
      this.invoiceLine.description =
        "Guest Name : " +
        this.booking.firstName +
        " " +
        this.booking.lastName +
        ", Room Name : " +
        this.booking.roomName +
        " No Of Room: " +
        this.booking.noOfRooms +
        " No Of Night: " +
        this.booking.noOfNights +
        " Source : " +
        this.booking.externalSite;
      this.invoiceLine.productCode = this.booking.propertyReservationNumber;
      this.invoiceLine.quantity = 1;
      // this.invoiceLine.unitPrice = Number(
      //   this.booking.roomTariffBeforeDiscount
      // );

      if (
        this.booking.discountAmount != null &&
        this.booking.discountAmount != undefined
      ) {
        this.invoiceLine.discountAmount = this.booking.discountAmount;
      } else {
        this.invoiceLine.discountAmount = 0;
      }

      this.invoiceLine.unitPrice =
        this.booking.beforeTaxAmount + this.invoiceLine.discountAmount;
      this.invoiceLine.beforeTaxAmount = this.invoiceLine.beforeTaxAmount =
        this.booking.beforeTaxAmount + this.invoiceLine.discountAmount;
      this.invoiceLine.taxAmount = this.booking.taxAmount;
      this.invoiceLine.taxPercentage = this.getBookingTaxPercentage(
        this.booking
      );
      this.invoiceLine.afterTaxAmount =
        this.booking.payableAmount + this.invoiceLine.discountAmount;
      if (this.booking.roomTariffPaid != null) {
        this.invoiceLine.paidAmount = this.booking.roomTariffPaid;
      }

      if (this.booking.roomTariffPending != null) {
        this.invoiceLine.balanceAmount =
          this.booking.roomTariffPending + this.invoiceLine.discountAmount;
      } else {
        this.invoiceLine.balanceAmount =
          0 + this.invoiceLine.discountAmount;
      }
    }

    this.invoiceLine.lineNumber = 4;
    this.invoiceLine.businessServiceName = "Accommodation";
    this.invoiceLine.bookingId = this.booking.id;
    this.invoiceLine.roomBillAmount = this.getTotalRoomBill();
    this.invoiceLine.creditBillAmount = this.getTotalCreditBill();
    this.invoiceLine.creditBillSettledAmount = this.getTotalCreditSettle();
    this.invoiceLines.push(this.invoiceLine);

    this.invoiceLine = new InvoiceLine();

    if (
      this.booking.totalServiceAmount != null &&
      this.booking.totalServiceAmount > 0
    ) {
      this.addBookingServiceInvoice();
    }

    if (
      this.booking.totalExpenseAmount != null &&
      this.booking.totalExpenseAmount > 0
    ) {
      this.invoiceLine.bookingId = this.booking.id;
      this.invoiceLine.lineNumber = 4;
      this.invoiceLine.businessServiceName = "Accommodation Expense";
      this.invoiceLine.description =
        "Guest Name : " +
        this.booking.firstName +
        " " +
        this.booking.lastName +
        ", Room Name : " +
        this.booking.roomName +
        " Source : " +
        this.booking.externalSite;
      this.invoiceLine.productCode = this.booking.propertyReservationNumber;
      this.invoiceLine.quantity = 0;
      this.invoiceLine.taxPercentage = 0;
      this.invoiceLine.unitPrice = Number(this.booking.totalExpenseAmount);
      this.invoiceLine.beforeTaxAmount = this.booking.totalExpenseAmount;
      this.invoiceLine.taxAmount = 0;
      this.invoiceLine.afterTaxAmount = this.booking.totalExpenseAmount;

      let serviceAmountPaid, totalServiceAmount;

      if (
        this.booking.serviceAmountPaid != null &&
        this.booking.serviceAmountPaid != undefined &&
        this.booking.serviceAmountPaid > 0
      ) {
        serviceAmountPaid = this.booking.serviceAmountPaid;
      } else {
        serviceAmountPaid = 0;
      }

      if (
        this.booking.totalServiceAmount != null &&
        this.booking.totalServiceAmount != undefined &&
        this.booking.totalServiceAmount > 0
      ) {
        totalServiceAmount = this.booking.totalServiceAmount;
      } else {
        totalServiceAmount = 0;
      }

      if (serviceAmountPaid > totalServiceAmount) {
        this.invoiceLine.paidAmount = serviceAmountPaid - totalServiceAmount;
      } else {
        this.invoiceLine.paidAmount = 0;
      }

      if (this.booking.totalExpenseAmount != null) {
        this.invoiceLine.balanceAmount =
          this.booking.totalExpenseAmount - this.invoiceLine.paidAmount;
      }

      this.invoiceLine.discountAmount = 0;

      this.invoiceLines.push(this.invoiceLine);
      this.invoiceLine = new InvoiceLine();
    }

    this.bookingCheckoutFilterData.splice(0,1);

    if(this.bookingCheckoutFilterData.length === 0)
    {
     // console.log('Submit');
      this.submitInvoice();
    }
    else
    {
      //console.log('add on');
      this.booking =  new Booking();
      this.booking =   this.bookingCheckoutFilterData[0];
      this.onAddBookingAddressLine();
    }

  }

  calculatePrice() {
    this.invoice.netAmount = 0;
    this.invoice.taxableAmount = 0;
    this.invoice.totalAmount = 0;
    this.invoice.paidAmount = 0;
    this.invoice.balanceAmount = 0;
    this.invoice.discountAmount = 0;
    this.invoice.deliveryChargeAmount = 0;
    this.invoice.serviceChargeAmount = 0;
    this.invoice.creditBillAmount = 0;
    this.invoice.creditBillSettledAmount = 0;
    this.invoice.roomBillAmount = 0;
    this.orderAmountWithDiscount = 0;

    for (let i = 0; i < this.invoiceLines.length; i++) {
      if (this.invoiceLines[i].creditBillAmount != null) {
        this.invoice.creditBillAmount =
          this.invoice.creditBillAmount + this.invoiceLines[i].creditBillAmount;
      }

      if (this.invoiceLines[i].creditBillSettledAmount != null) {
        this.invoice.creditBillSettledAmount =
          this.invoice.creditBillSettledAmount +
          this.invoiceLines[i].creditBillSettledAmount;
      }

      if (this.invoiceLines[i].roomBillAmount != null) {
        this.invoice.roomBillAmount =
          this.invoice.roomBillAmount + this.invoiceLines[i].roomBillAmount;
      }

      if (this.invoiceLines[i].beforeTaxAmount != null) {
        this.invoice.netAmount =
          this.invoice.netAmount + this.invoiceLines[i].beforeTaxAmount;
      }

      if (this.invoiceLines[i].paidAmount != null) {
        this.invoice.paidAmount =
          this.invoice.paidAmount + this.invoiceLines[i].paidAmount;
      }


        if (this.invoiceLines[i].taxAmount != null) {
          this.invoice.taxableAmount =
            this.invoice.taxableAmount + this.invoiceLines[i].taxAmount;
        }

        if (this.invoiceLines[i].balanceAmount != null) {
          this.invoice.balanceAmount =
            this.invoice.balanceAmount + this.invoiceLines[i].balanceAmount;
        }
        // console.log("5=" + this.invoice.balanceAmount);

        if (this.invoiceLines[i].afterTaxAmount != null) {
          this.invoice.totalAmount =
            this.invoice.totalAmount + this.invoiceLines[i].afterTaxAmount;
        }

        if (this.invoiceLines[i].discountAmount != null) {
          this.invoice.discountAmount =
            this.invoice.discountAmount + this.invoiceLines[i].discountAmount;
        }
      }


    this.invoice.paidAmount =
      this.invoice.paidAmount - this.invoice.creditBillSettledAmount;


    this.orderAmountWithDiscount =
      this.invoice.totalAmount - this.invoice.discountAmount;

    return this.invoice.netAmount;
  }

  submitInvoice(){
    //console.log('Cal');
    this.calculatePrice();
   // console.log('Cal2');
    if (
      this.invoiceAddedbookings != null &&
      this.invoiceAddedbookings.length === 1
    ) {
      this.invoice.propertyReservationId =
      this.invoiceAddedbookings[0].propertyReservationNumber;
      this.invoice.paymentMode = this.invoiceAddedbookings[0].modeOfPayment;
      this.invoice.bookingId = this.invoiceAddedbookings[0].id;
    } else if (

      this.invoiceAddedbookings != null &&
      this.invoiceAddedbookings.length > 1
    ) {
      this.invoice.paymentMode = "MultiModePymt";
    }

    if (
      this.bankAccount != null &&
      this.bankAccount != undefined &&
      this.bankAccount.bankName != null &&
      this.bankAccount.bankName != undefined &&
      this.bankAccount.bankName != ""
    ) {
      this.invoice.invoiceLinesDto = this.invoiceLines;

      const currentDate: Date = new Date();
      this.invoice.invoiceDate = this.getDateDBFormat(currentDate);

      this.invoice.customerId = this.invoiceAddedbookings[0].customerId;

      if (this.invoice.balanceAmount > 0) {
        this.invoice.invoiceStatus = "NotPaid";
        this.invoice.paymentStatus = "NotPaid";
      } else {
        this.invoice.invoiceStatus = "Paid";
        this.invoice.paymentStatus = "Paid";
      }

      this.invoice.dueDate = this.datepipe.transform(
        this.invoice.dueDate,
        "yyyy-MM-dd"
      );
    //  console.log(' this.invoice '+ JSON.stringify( this.invoice));
      this.createInvoice();
    }else
    {
      this.loader = false;
      this.presentToast("Please setupp property bank information");
    }

  }

   createInvoice() {
    this.loader = true;
    this.bookingService.createInvoice(this.invoice).subscribe(
      (response) => {
        //  Logger.log('response.body : '+JSON.stringify(response));
        this.loader = false;

        this.presentToast("Invoice created successfully");
        // this.invoicesDetailsADialog(response.body);
        this.bookingService.updateInvoiceInBookingsByGroupBookingId(this.groupBookingId,response.body.invoiceNo,response.body.id).subscribe(
          (response) => {

            this.getBookingListByGroupBookingId(this.groupBookingId);
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 417) {
                this.loader = false;
              }
            }
          }
        );
      },
      (error) => {
        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      }
    );
  }


  addBookingServiceInvoice() {
    let serviceAmount = 0;
    let paymentPaid = this.booking.serviceAmountPaid;
    let serviceName = [];
    if (this.services != null && this.services.length > 0) {
      for (let i = 0; i < this.services.length; i++) {
        //serviceName.push(this.services[i].name);
        this.invoiceLine.bookingId = this.booking.id;
        this.invoiceLine.businessServiceName = this.services[i].name;

        this.invoiceLine.lineNumber = 4;
        this.invoiceLine.description =
          "Guest Name : " +
          this.booking.firstName +
          " " +
          this.booking.lastName +
          ", Room Name : " +
          this.booking.roomName +
          " Source : " +
          this.booking.externalSite;
        this.invoiceLine.productCode = this.booking.propertyReservationNumber;
        this.invoiceLine.quantity = this.services[i].count;
        this.invoiceLine.taxPercentage = this.services[i].taxPercentage;
        this.invoiceLine.unitPrice = Number(this.services[i].servicePrice);
        this.invoiceLine.beforeTaxAmount = this.services[i].beforeTaxAmount;
        this.invoiceLine.taxAmount = this.services[i].taxAmount;
        this.invoiceLine.afterTaxAmount = this.services[i].afterTaxAmount;

        serviceAmount = serviceAmount + this.services[i].afterTaxAmount;

        if (
          this.booking.serviceAmountPaid != null &&
          this.booking.serviceAmountPaid >= serviceAmount
        ) {
          paymentPaid = paymentPaid - this.services[i].afterTaxAmount;
          this.invoiceLine.paidAmount = this.services[i].afterTaxAmount;
        } else if (
          this.booking.serviceAmountPaid != null &&
          this.booking.serviceAmountPaid < serviceAmount
        ) {
          this.invoiceLine.paidAmount = paymentPaid;
        } else {
          this.invoiceLine.paidAmount = 0;
        }

        this.invoiceLine.balanceAmount =
          this.services[i].afterTaxAmount - this.invoiceLine.paidAmount;

        // if(this.booking.serviceAmountPending != null)
        // {
        //   this.invoiceLine.balanceAmount = this.booking.serviceAmountPending;
        // }

        // this.invoiceLine.paidAmount = 0;

        //  this.invoiceLine.balanceAmount = this.services[i].servicePrice;

        this.invoiceLine.discountAmount = 0;

        this.invoiceLines.push(this.invoiceLine);
        this.invoiceLine = new InvoiceLine();
      }

      // this.invoiceLine.businessServiceName = serviceName.toString();
    }
  }

  getTotalCreditBill() {
    return this.getTotalPaymentAmountByMOP("Credit");
  }
  
  getTotalRoomBill() {
    return this.getTotalPaymentAmountByMOP("BillToRoom");
  }

  getTotalPaymentAmountByMOP(paymentMode: string) {
    let sum = 0;

    if (
      this.getPaymentDataByModeOfPayment(paymentMode) != null &&
      this.getPaymentDataByModeOfPayment(paymentMode) != undefined &&
      this.getPaymentDataByModeOfPayment(paymentMode).length > 0
    ) {
      for (
        let i = 0;
        i < this.getPaymentDataByModeOfPayment(paymentMode).length;
        i++
      ) {
        sum =
          sum +
          this.getPaymentDataByModeOfPayment(paymentMode)[i].transactionAmount;
      }
    }
    return sum;
  }

  getTotalCreditSettle() {
    return this.getTotalPaymentAmountByMOPAndStatus("Credit", "Paid");
  }

  getTotalPaymentAmountByMOPAndStatus(paymentMode: string, status: string) {
    let sum = 0;

    if (
      this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status) !=
        null &&
      this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status) !=
        undefined &&
      this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status).length >
        0
    ) {
      for (
        let i = 0;
        i <
        this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status).length;
        i++
      ) {
        sum =
          sum +
          this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status)[i]
            .transactionAmount;
      }
    }
    return sum;
  }

  getPaymentDataByModeOfPaymentAndStatus(paymentMode: string, status: string) {
    let orderData = [];
    if (
      this.bookingPaymentsFilter != null &&
      this.bookingPaymentsFilter != undefined &&
      this.bookingPaymentsFilter.length > 0
    ) {
      orderData = this.bookingPaymentsFilter.filter((item) => {
        const searchResult =
          item.paymentMode != null &&
          item.paymentMode === paymentMode &&
          item.status != null &&
          item.status === status;

        return searchResult;
      });
    }

    return orderData;
  }


  getPaymentDataByModeOfPayment(paymentMode: string) {
    let orderData = [];
    if (
      this.bookingPaymentsFilter != null &&
      this.bookingPaymentsFilter != undefined &&
      this.bookingPaymentsFilter.length > 0
    ) {
      orderData = this.bookingPaymentsFilter.filter((item) => {
        const searchResult =
          item.paymentMode != null && item.paymentMode === paymentMode;

        return searchResult;
      });
    }

    return orderData;
  }

  getBookingTaxPercentage(booking: Booking) {
    let sum = 0;
    if (
      booking.taxDetails != null &&
      booking.taxDetails != undefined &&
      booking.taxDetails.length > 0
    ) {
      for (let i = 0; i < booking.taxDetails.length; i++) {
        if (
          booking.taxDetails[i].percentage != null &&
          booking.taxDetails[i].percentage != undefined
        ) {
          sum = sum + booking.taxDetails[i].percentage;
        }
      }
    }
    return sum;
  }



}
