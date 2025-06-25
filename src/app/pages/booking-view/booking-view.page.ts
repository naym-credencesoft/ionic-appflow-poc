import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ApplicationUser } from 'src/app/model/user';
import { TranslateProvider } from 'src/app/providers';
import { CustomerService } from 'src/app/service/Customer/customer.service';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { NotificationService } from 'src/app/service/NotificationService/notification.service';
import { OrderService } from 'src/app/service/Order/order.service';
import { ReservationService } from 'src/app/service/ReservationService/reservation-service.service';
import { AuthService } from 'src/app/service/auth.service';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { TokenStorage } from 'src/app/token.storage';
import { Location } from "@angular/common";
import { Booking } from 'src/app/model/manage-booking/Booking/Booking';
import { Customer } from 'src/app/model/Customer/customer';
import { Expense } from 'src/app/model/Expense/Expense';
import { Service } from 'src/app/model/manage-booking/Service/Service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExpenseService } from 'src/app/service/ExpenseService/expense-service.service';
import { Payment } from 'src/app/model/manage-booking/Payment/Payment';

@Component({
  selector: 'app-booking-view',
  templateUrl: './booking-view.page.html',
  styleUrls: ['./booking-view.page.scss'],
})
export class BookingViewPage implements OnInit {

    userData: ApplicationUser;
    booking: Booking;
    customer: Customer;

    expenses: Expense[] = [];
    services: Service[] = [];
    servicesMeal: Service[] = [];
    servicesOther: Service[] = [];
    roomServices: Service[] = [];
    payments: Payment[] = [];
    paymentsFilter: Payment[] = [];

    constructor( private paymentService: PaymentService,
        private customerService: CustomerService,
        private bookingService: BookingService,
        private orderService: OrderService,
        private translate: TranslateProvider,
        private reservationService: ReservationService,
        private authService: AuthService,
        private navCtrl: NavController,
        private _location: Location,
        public datepipe: DatePipe,
        private route: Router,
        private propertyService: PropertyService,
        private changeDetectorRefs: ChangeDetectorRef,
        private dateService: DateService,
        private acRoute: ActivatedRoute,
        private notificationService: NotificationService,
        private expenseService : ExpenseService,
        public token: TokenStorage,
        public loadingCtrl: LoadingController,
        private toastController: ToastController) { 
        this.userData = new ApplicationUser();
        this.booking = new Booking();
        this.customer = new Customer();
  }

    ngOnInit() {
      
        this.authService
        .getUserByUserId(this.token.getUserId())
        .subscribe((resp) => {
            this.userData = resp.body;
        });

        this.acRoute.queryParams.subscribe((params) => {
            if (params["booking"] != undefined) {
                this.booking = JSON.parse(params["booking"]);
                this.getCustomerDetails(this.booking.customerId);
                this.getAllServices(this.booking.id);
                this.refreshExpenses(this.booking.id);
                if(this.booking.propertyReservationNumber != null && this.booking.propertyReservationNumber != undefined) {
                    this.paymentListRefresh(this.booking.propertyReservationNumber);
                }
              
            }
          
        });

    }

    ionViewWillEnter(){
        this.authService
        .getUserByUserId(this.token.getUserId())
        .subscribe((resp) => {
            this.userData = resp.body;
        });

        this.acRoute.queryParams.subscribe((params) => {
            if (params["booking"] != undefined) {
                this.booking = JSON.parse(params["booking"]);
                this.getCustomerDetails(this.booking.customerId);
                this.getAllServices(this.booking.id);
                this.refreshExpenses(this.booking.id);
                if(this.booking.propertyReservationNumber != null && this.booking.propertyReservationNumber != undefined) {
                    this.paymentListRefresh(this.booking.propertyReservationNumber);
                }
                
            }
          
        });
    }

    paymentListRefresh(bookingReferenceNumber: string) {

        this.paymentService
          .findPaymentByReferenceNumber(bookingReferenceNumber)
          .subscribe((res) => {
            this.payments = res;
            this.paymentsFilter = res;

          });
      }

    refreshExpenses(bookingId: number) {
        this.expenseService.findAllExpensesByBookingId(bookingId).subscribe(
          (res) => {
            this.expenses = res;
       
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {

            }
          }
        );
      }

    getAllServices(bookingId: number) {
        this.bookingService.getAllServicesByBooking(bookingId).subscribe(
          (response1) => {
            if (response1.status === 200) {
              this.services = response1.body;
    
    
              this.servicesMeal = this.services.filter((item) =>
                item.serviceType != null &&
                item.serviceType != undefined &&
                item.serviceType.toLowerCase() === "food" ||
                item.serviceType != null &&
                item.serviceType != undefined &&
                item.serviceType.toLowerCase() === "meal"
              );
    
              this.servicesOther = this.services.filter((item) =>
              item.serviceType != null &&
              item.serviceType != undefined &&
              item.serviceType.toLowerCase() != "food" &&
              item.serviceType.toLowerCase() != "meal"
          );

    
              this.roomServices = this.services.filter(data=>data.orderId != null);
            }
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {

            }
          }
        );
      }

    getCustomerDetails(customerID: number) {

        this.customerService.getCustomerById(String(customerID)).subscribe(
            (response) => {

                if (response.body != null) {
                    this.customer = response.body;

                    this.changeDetectorRefs.detectChanges();
                }
            },
            (error) => {}
        );
    }

    getPayableAmountIncludeService() {
        return (
          this.booking.payableAmount +
          this.booking.totalServiceAmount +
          this.booking.totalExpenseAmount -
          this.getPaidRefundAmount()
        );
    }
    getReceivedAmountIncudeService() {
        return (
          this.booking.roomTariffPaid +
          this.booking.serviceAmountPaid -
          this.getTotalCreditSettle() -
          this.getPaidRefundAmount()
        );
    }
    getTotalCreditSettle() {
        return this.getTotalPaymentAmountByMOPAndStatus("Credit", "Paid");
    }

    getReceivedAmountExcludeService() {
        return (
          this.booking.roomTariffPaid -
          this.getTotalCreditSettleForExcluseService()
        );
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
    
      getTotalCreditBill() {
        return this.getTotalPaymentAmountByMOP("Credit");
      }
    
      getPaymentDataByModeOfPayment(paymentMode: string) {
        let orderData = [];
        if (
          this.paymentsFilter != null &&
          this.paymentsFilter != undefined &&
          this.paymentsFilter.length > 0
        ) {
          orderData = this.paymentsFilter.filter((item) => {
            const searchResult =
              item.paymentMode != null && item.paymentMode === paymentMode;
    
            return searchResult;
          });
        }
    
        return orderData;
      }

    getTotalCreditSettleForExcluseService() {
        if (this.booking.roomTariffPaid > this.getTotalCreditSettle()) {
          return this.getTotalCreditSettle();
        } else {
          return this.booking.roomTariffPaid;
        }
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
          this.paymentsFilter != null &&
          this.paymentsFilter != undefined &&
          this.paymentsFilter.length > 0
        ) {
          orderData = this.paymentsFilter.filter((item) => {
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
    
    getPaidRefundAmount() {
        return this.getTotalExpenseRefundPaidPaymentByBookingPayment(
          this.paymentsFilter
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
              item.paymentMode != "BillToRoom" &&  item.paymentMode != "CreditIndividual";
    
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
    

    getNoOfNight(booking) {

        if (booking.expectedNights != null &&
          booking.expectedNights != undefined &&
          booking.expectedNights > 0) {
          return booking.expectedNights;
        }
        else
        {
          return booking.noOfNights;
        }
    }
    
    getDueAmountIncludeSevice() {
        return (
          this.getPayableAmountIncludeService() -
          this.getReceivedAmountIncudeService() +
          this.getPaidRefundAmount()
        );
    }
    
    getCommitionAmount()
    {
      return this.getAmount(this.booking.bookingCommissionAmount) + this.getAmount(this.booking.tcsFee) + this.getAmount(this.booking.tdsFee);
    }

    getAmount(row)
    {
      if (row != null && row != undefined)
      {
        return row;
      }
      else
      {
        return 0;
      }
    }

    
    back() {
        this._location.back();
    }


}
