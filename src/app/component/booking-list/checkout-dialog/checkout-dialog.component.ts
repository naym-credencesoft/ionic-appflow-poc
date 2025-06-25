import { InvoiceService } from "src/app/service/invoice/invoice.service";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { ChangeDetectorRef, Component, OnInit, ViewRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import {
    ModalController,
    LoadingController,
    ToastController,
    NavParams,
    NavController,
} from "@ionic/angular";
import { AvailabilityService } from "src/app/service/AvailabilityService/availability.service";
import { DateService } from "src/app/service/DateService/date-service.service";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { TokenStorage } from "src/app/token.storage";
import { HttpErrorResponse } from "@angular/common/http";
import { InvoiceLine } from "src/app/model/invoice/invoiceLines";
import { Service } from "src/app/model/manage-booking/Service/Service";
import { Invoice } from "src/app/model/invoice/invoice";
import { DatePipe } from "@angular/common";
import { Property } from "src/app/model/property/Property";
import { BusinessService } from "src/app/model/Reservation/businessServic";
import { SplitTaxDTO } from "src/app/pages/booking/booking.page";
import { TaxDetails } from "src/app/model/TaxDetail/TaxDetails";
import { Plan } from "src/app/pages/booking/plan";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { PropertyServiceDTO } from "src/app/model/property/PropertyServices";
import { RatesAndAvailability } from "src/app/model/manage-booking/rateandavailability/rateandavailability";
import { OtaAvailability } from "src/app/model/otaPropertyDTO/otaAvailability";
import { Customer } from "src/app/model/Customer/customer";
import { Kyc } from "src/app/model/Customer/kyc";
import { PaymentService } from "src/app/service/payment/payment.service";
import { AUDIT_BOOKING_CHECKOUT } from "src/app/app.component";
import { Audit } from "src/app/service/audit";
import { PropertyService } from "src/app/service/property/property.service";

@Component({
    selector: "app-checkout-dialog",
    templateUrl: "./checkout-dialog.component.html",
    styleUrls: ["./checkout-dialog.component.css"],
})
export class CheckoutDialogComponent implements OnInit {
    booking: Booking;
    onCheckedOutForm: FormGroup;

    loader: boolean = false;
    roomNumberList: any[];

    invoice: Invoice;
    invoiceLine: InvoiceLine;
    invoiceLines: InvoiceLine[] = [];
    services: Service[] = [];
    isMultiBooking: boolean = false;

    isCheckInDateIntervalMatch: boolean = false;
    property: Property;

    //
    extraDayChargebooking: Booking;

    service: Service;
    BookingService: Service;

    propertyServices: PropertyServiceDTO[] = [];
    propertyServicesSelected: PropertyServiceDTO;
    payment: Payment;
    currency: string;

    bookingIdList: number[] = [];
    bookingsDetail: Booking[] = [];
    bookingPayments: Payment[] = [];
    bookingPaymentsFilter: Payment[] = [];
    ratesAndAvailabilities: RatesAndAvailability[];
    ratesAndAvailability: RatesAndAvailability;
    ratesAndAvailabilitySingleObject: RatesAndAvailability;

    chargeType: string = "LLC";
    totalPlanAmount: number;

    plan: Plan;
    plans: Plan[];
    plans2: Plan[];

    taxDetailsSelected: TaxDetails[] = [];
    totalSplitTax: SplitTaxDTO[] = [];

    onlyTaxAmount: number;
    bookingExtraPersonCharge: number;
    bookingExtraChildCharge: number;
    differenceDay: number;
    PlanRoomPrice: any;
    bookingRoomPrice: number;
    roomOnlyPricePerNight: number;
    afterDiscountAmount: number;
    role: any[];

    isCheckOutDateMatch: boolean = false;
    bookingURLOB: Booking;
    CheckoutBooking: boolean = false;

    businessServices: BusinessService[] = [];
    businessService: BusinessService;

    otaAvailabilityList: OtaAvailability[] = [];
    otaAvailability: OtaAvailability;
    kycList: Kyc[] = [];
    customer: Customer;
    currentTimeCheckout: boolean = false;

    constructor(
        private modalcntrler: ModalController,
        private availabilityService: AvailabilityService,
        private bookingService: BookingService,
        private formBuilder: FormBuilder,
        public datepipe: DatePipe,
        public navCtrl: NavController,
        private invoiceService: InvoiceService,
        private router: Router,
        private propertyService :PropertyService,
        private paymentService : PaymentService,
        private dateService: DateService,
        private changeDetectorRefs: ChangeDetectorRef,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private navParams: NavParams,
        private token: TokenStorage
    ) {
        this.property = new Property();
        this.plan = new Plan();
        this.customer = new Customer();
        this.extraDayChargebooking = new Booking();
        this.BookingService = new Service();
        this.ratesAndAvailability = new RatesAndAvailability();

        this.propertyServicesSelected = new PropertyServiceDTO();

        this.otaAvailability = new OtaAvailability();

        this.booking = new Booking();
        let BookingOb = this.navParams.get("booking");
        this.booking = BookingOb;

        this.onCheckedOutForm = this.formBuilder.group({
            checkedOutTime: ["", Validators.compose([Validators.required])],
            ChargeSelection: ["", Validators.compose([Validators.nullValidator])],
        });
    }

    ngOnInit(): void {
        this.property = this.token.getProperty();
        this.getAllBusinessService();

        if (
            this.property.localCurrency != null &&
            this.property.localCurrency != undefined
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }
        this.booking.operatorNotes = "";

        // this.booking.checkoutTime =
        //     this.dateService.convertMillisecondsToYYMMDDTHHMMFormat(
        //         new Date().getTime()
        //     );

        if (this.booking.dateChangeCheckOutBookingTime != null && this.booking.dateChangeCheckOutBookingTime != undefined)
        {
          this.booking.checkoutTime = this.datepipe.transform(
            this.booking.dateChangeCheckOutBookingTime,
            "yyyy-MM-ddTHH:mm"
          );
          this.CheckoutBooking = true;
        }
        else
        {
          this.booking.checkoutTime = this.datepipe.transform(
            new Date().getTime(),
            "yyyy-MM-ddTHH:mm"
          );
        }

        if (
            this.booking != null &&
            this.booking != undefined &&
            this.booking.propertyReservationNumber != null
          ) {
            this.paymentListRefresh(this.booking.propertyReservationNumber);
          }
      
          this.propertyServices = [];
          if (
            this.property.propertyServicesList != null &&
            this.property.propertyServicesList != undefined &&
            this.property.propertyServicesList.length > 0
          ) {
            this.propertyServices = this.property.propertyServicesList;
      
            this.propertyServicesSelected = this.propertyServices.find(
              (data) => data.name.trim() === "Late Check-Out"
            );
      
            if (
              this.propertyServicesSelected != null &&
              this.propertyServicesSelected != undefined
            ) {
              this.setService();
              this.getServiceListByBookingId();
            }
            else
            {
              this.BookingService = undefined;
            }
          }
          else
          {
            this.BookingService = undefined;
          }

        this.checkoutInvoice();
        this.dateCheck();
        this.getExtraChargeBookingDetails(this.booking.id);
    }

    currentTCheckout() {
        this.currentTimeCheckout = true;
      }

    getServiceListByBookingId() {
        this.loader = true;
        this.bookingService.getAllServicesByBooking(this.booking.id).subscribe(
          (response1) => {
            if (response1.status === 200) {
              let services = response1.body;
              this.loader = false;
              if (services != null && services != undefined) {
                this.BookingService = services.find(
                  (data) => data.name != null &&
                    data.name != undefined &&
                    data.name.trim() === "Late Check-Out"
                );
              }
            }
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              this.loader = false;
            }
          }
        );
      }

    setService() {
        this.service = new Service();
        this.service.imageUrl = this.propertyServicesSelected.imageUrl;
        this.service.logoUrl = this.propertyServicesSelected.logoUrl;
        this.service.name = this.propertyServicesSelected.name;
    
        if (
          this.propertyServicesSelected.beforeTaxAmount != null &&
          this.propertyServicesSelected.beforeTaxAmount != undefined
        ) {
          this.service.beforeTaxAmount =
            this.propertyServicesSelected.beforeTaxAmount;
          this.service.servicePrice = this.propertyServicesSelected.beforeTaxAmount;
        } else {
          this.service.beforeTaxAmount = 0;
          this.service.servicePrice = 0;
        }
    
        if (
          this.propertyServicesSelected.taxPercentage != null &&
          this.propertyServicesSelected.taxPercentage != undefined
        ) {
          this.service.taxPercentage = this.propertyServicesSelected.taxPercentage;
        } else {
          this.service.taxPercentage = 0;
        }
    
        if (
          this.propertyServicesSelected.taxAmount != null &&
          this.propertyServicesSelected.taxAmount != undefined
        ) {
          this.service.taxAmount = this.propertyServicesSelected.taxAmount;
        } else {
          this.service.taxAmount = 0;
        }
    
        if (
          this.propertyServicesSelected.afterTaxAmount != null &&
          this.propertyServicesSelected.afterTaxAmount != undefined
        ) {
          this.service.afterTaxAmount =
            this.propertyServicesSelected.afterTaxAmount;
        } else {
          this.service.afterTaxAmount = 0;
        }
    
        this.service.count = 1;
    
        this.service.serviceType = this.propertyServicesSelected.serviceType;
        this.service.businessType = this.propertyServicesSelected.businessType;
        this.service.organisationId = this.propertyServicesSelected.organisationId;
      }

    paymentListRefresh(bookingReferenceNumber: string) {
        this.paymentService
          .findPaymentByReferenceNumber(bookingReferenceNumber)
          .subscribe((res) => {
            this.bookingPayments = res;
            this.bookingPaymentsFilter = res;
            this.checkoutInvoice();
            this.UIDetectChange();
            //Logger.log('payment : ' + JSON.stringify(this.payments));
          });
      }

    getExtraChargeBookingDetails(bookingId: number) {

        this.bookingService.findBooking(bookingId).subscribe((response1) => {
          this.extraDayChargebooking = response1.body;
    
          if (this.extraDayChargebooking.toTime != undefined && this.extraDayChargebooking.toTime != null) {
            let toTimeDate = new Date(this.extraDayChargebooking.toTime);
            toTimeDate.setDate(toTimeDate.getDate()+1);
            this.extraDayChargebooking.toTime = new Date(toTimeDate).getTime().toString();
          }
    
          this.bookingExtraPersonCharge = this.extraDayChargebooking.extraPersonCharge;
          this.bookingExtraChildCharge = this.extraDayChargebooking.extraChildCharge;
    
          if (
            this.extraDayChargebooking.roomTariffBeforeDiscount != null &&
            this.extraDayChargebooking.roomTariffBeforeDiscount != undefined
          ) {
            this.totalPlanAmount = this.extraDayChargebooking.roomTariffBeforeDiscount;
          }
    
          this.getPlan(String(this.extraDayChargebooking.roomId));
    
          if (
            this.extraDayChargebooking.taxDetails != null &&
            this.extraDayChargebooking.taxDetails != undefined &&
            this.extraDayChargebooking.taxDetails.length > 0
          ) {
            this.taxDetailsSelected = this.extraDayChargebooking.taxDetails;
          }
    
          if (
            this.extraDayChargebooking.taxDetails.length === 0 &&
            this.extraDayChargebooking.taxAmount != null &&
            this.extraDayChargebooking.taxAmount != undefined
          ) {
            this.onlyTaxAmount = this.extraDayChargebooking.taxAmount;
          }
    
          this.changeDetectorRefs.detectChanges();
        });
    }
    
    getPlan(roomId: string) {
        this.loader = true;
        this.bookingService
          .getPlan(String(this.token.getPropertyId()), roomId)
          .subscribe(
            (data) => {
              this.plans = data.body;
              this.plans2 = data.body;
              this.loader = false;
    
              if (
                this.extraDayChargebooking.roomRatePlanName != undefined &&
                this.extraDayChargebooking.roomRatePlanName != null
              ) {
                this.plan = this.plans.find(
                  (plan) => plan.name === this.extraDayChargebooking.roomRatePlanName
                );
                if (
                  (this.plan === undefined && this.plans.length > 0) ||
                  (this.plan == null && this.plans.length > 0)
                ) {
                  this.plan = this.plans[0];
                }
    
              }
              this.changeDetectorRefs.detectChanges();
            },
            (error) => {
    
              this.loader = false;
              this.changeDetectorRefs.detectChanges();
            }
          );
      }

    getAllBusinessService() {
        this.loader = true;
        this.bookingService
            .getAllBusinessServiceByPropertyId(String(this.property.id))
            .subscribe(
                (data) => {
                    this.businessServices = data.body;
                    this.loader = false;

                    this.businessService = this.businessServices.find(
                        (data) => data.name === "Accommodation"
                    );

                    this.UIDetectChange();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    dateCheck() {
        let selecttedDate = this.datepipe.transform(
          this.booking.checkoutTime,
          "yyyy-MM-dd"
        );
        let fromDate = this.datepipe.transform(this.booking.fromDate, "yyyy-MM-dd");
        let toDate = this.datepipe.transform(this.booking.toDate, "yyyy-MM-dd");
        let depDate = this.datepipe.transform(this.booking.toTime, "yyyy-MM-dd");
    
        let selectedDateOb = new Date(selecttedDate);
        let bookingFromDateOb = new Date(fromDate);
        let bookingToDateOb = new Date(toDate);
    
        if (
          bookingFromDateOb.getTime() <= selectedDateOb.getTime() &&
          selectedDateOb.getTime() <= bookingToDateOb.getTime()
        ) {
          this.isCheckInDateIntervalMatch = true;
          if (
            depDate == selecttedDate
          ) {
            this.isCheckOutDateMatch = true;
          } else {
            this.isCheckOutDateMatch = false;
          }
          //Logger.log(' true in ');
        } else {
          this.isCheckInDateIntervalMatch = false;
          // Logger.log(' out  ');
        }
    
        this.changeSelectionType();
      }

    changeSelectionType() {
        if (this.isBothChargeAvailable() === true) {
            this.chargeType = "LLC";
        } else if (
            this.isExtraDayCharge() === true &&
            this.isLateCheckoutCharge() === false
        ) {
            this.chargeType = "EDC";
        } else if (this.isLateCheckoutCharge() === true) {
            this.chargeType = "LLC";
        } else {
            this.chargeType = "";
        }
    }

    isExtraDayCharge() {
        if (
          this.booking.checkoutTime != null &&
          this.booking.checkoutTime != undefined &&
          this.booking.toTime != null &&
          this.booking.toTime != undefined &&
          this.BookingService == undefined ||
          this.booking.checkoutTime != null &&
          this.booking.checkoutTime != undefined &&
          this.booking.toTime != null &&
          this.booking.toTime != undefined &&
          this.BookingService == null ||
          this.booking.checkoutTime != null &&
          this.booking.checkoutTime != undefined &&
          this.booking.toTime != null &&
          this.booking.toTime != undefined &&
          this.BookingService.name == undefined
        ) {
          let toTimeEXP = this.datepipe.transform(
            this.booking.toTime,
            "yyyy-MM-dd h:mm a"
          );
    
          let toDateSelected = this.datepipe.transform(
            this.booking.checkoutTime,
            "yyyy-MM-dd h:mm a"
          );
    
          let selectedDateOb = new Date(toDateSelected);
          let bookingToDateOb = new Date(toTimeEXP);
    
          if (bookingToDateOb.getTime() < selectedDateOb.getTime()) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    

    isBothChargeAvailable() {
        if (
            this.isLateCheckoutCharge() === true &&
            this.isExtraDayCharge() === true
        ) {
            return true;
        } else {
            return false;
        }
    }

    isLateCheckoutCharge() {
        if (
            (this.timeCheck() && this.BookingService === undefined) ||
            (this.timeCheck() && this.BookingService === null)
        ) {
            return true;
        } else {
            return false;
        }
    }
    timeCheck() {
        if (
            this.booking.checkoutTime != null &&
            this.booking.checkoutTime != undefined &&
            this.booking.toTime != null &&
            this.booking.toTime != undefined &&
            this.propertyServicesSelected != null &&
            this.propertyServicesSelected != undefined &&
            this.propertyServicesSelected.afterTaxAmount != null &&
            this.propertyServicesSelected.afterTaxAmount != undefined &&
            this.propertyServicesSelected.afterTaxAmount > 0
        ) {
            let toTimeEXP = this.datepipe.transform(
                this.booking.toTime,
                "yyyy-MM-dd h:mm a"
            );

            let toDateSelected = this.datepipe.transform(
                this.booking.checkoutTime,
                "yyyy-MM-dd h:mm a"
            );

            let selectedDateOb = new Date(toDateSelected);
            let bookingToDateOb = new Date(toTimeEXP);

            if (bookingToDateOb.getTime() < selectedDateOb.getTime()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    isDepartureTimematch() {
        if (
            this.datepipe.transform(
                this.booking.checkoutTime,
                "yyyy-MM-dd h:mm a"
            ) ===
            this.datepipe.transform(this.booking.toTime, "yyyy-MM-dd h:mm a")
        ) {
            return true;
        } else {
            return false;
        }
    }

    setTime(time) {
        this.booking.checkoutTime = this.datepipe.transform(
            time,
            "yyyy-MM-ddTHH:mm"
        );
    }

    checkoutInvoice() {
        this.invoiceLines = [];
        this.invoice = new Invoice();
        this.invoice.propertyId = this.booking.propertyId;
        this.invoice.invoiceTo = "Customer";
        this.invoice.paymentMode = this.booking.modeOfPayment;
        this.invoice.dueDate = this.booking.checkoutTime;
        this.invoice.customerId = this.booking.customerId;
        this.invoice.invoiceDate = this.booking.checkoutTime;
        this.invoice.invoiceStatus = "Paid";
        this.invoice.propertyReservationId =
            this.booking.propertyReservationNumber;
        this.invoice.paymentStatus = "Paid";
        this.invoice.partialPayment = false;
        this.invoice.bookingId = this.booking.id;
        this.invoice.customerName =
            this.booking.firstName + " " + this.booking.lastName;
        this.invoice.notes = this.booking.notes;
        this.invoice.serviceChargeAmount = 0;
        this.invoice.deliveryChargeAmount = 0;
        this.checkoutInvoiceLine();
    }

    checkoutInvoiceLine() {
        this.invoiceLine = new InvoiceLine();

        this.invoiceLine.bookingId = this.booking.id;
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
            this.booking.noOfNights;
        this.invoiceLine.productCode = this.booking.propertyReservationNumber;
        this.invoiceLine.quantity = 1;
        this.invoiceLine.unitPrice = Number(
            this.booking.roomTariffBeforeDiscount
        );
        this.invoiceLine.lineNumber = 4;

        if (
            this.booking.discountAmount != null &&
            this.booking.discountAmount != undefined
        ) {
            this.invoiceLine.discountAmount = this.booking.discountAmount;
        } else {
            this.invoiceLine.discountAmount = 0;
        }

        this.invoiceLine.beforeTaxAmount =
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
            this.invoiceLine.balanceAmount = this.booking.roomTariffPending;
        } else {
            this.invoiceLine.balanceAmount = 0;
        }

        this.invoiceLine.businessServiceName = "Accommodation";
        this.invoiceLines.push(this.invoiceLine);

        if (
            this.booking.totalServiceAmount != null &&
            this.booking.totalServiceAmount > 0
        ) {
            this.getServiceList();
        }

        if (
            this.booking.totalExpenseAmount != null &&
            this.booking.totalExpenseAmount > 0
        ) {
            this.addBookingExpenseInvoice();
        }
    }

    addBookingExpenseInvoice() {
        this.invoiceLine = new InvoiceLine();
        this.invoiceLine.lineNumber = 3;
        this.invoiceLine.bookingId = this.booking.id;
        this.invoiceLine.businessServiceName = "Accommodation Expense";
        this.invoiceLine.description = "Expense";
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
            this.invoiceLine.paidAmount =
                serviceAmountPaid - totalServiceAmount;
        } else {
            this.invoiceLine.paidAmount = 0;
        }

        if (this.booking.totalExpenseAmount != null) {
            this.invoiceLine.balanceAmount =
                this.booking.totalExpenseAmount - this.invoiceLine.paidAmount;
        }

        this.invoiceLine.discountAmount = 0;

        this.invoiceLines.push(this.invoiceLine);
    }

    getServiceList() {
        this.loader = true;
        this.bookingService.getAllServicesByBooking(this.booking.id).subscribe(
            (response1) => {
                if (response1.status === 200) {
                    this.services = response1.body;
                    this.loader = false;
                    this.addBookingServiceInvoice();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    this.presentToast(error.message);
                    this.loader = false;
                }
            }
        );
    }

    addBookingServiceInvoice() {
        let serviceAmount = 0;
        let paymentPaid = this.booking.serviceAmountPaid;
        let serviceName = [];

        if (this.services != null && this.services.length > 0) {
            for (let i = 0; i < this.services.length; i++) {
                this.invoiceLine = new InvoiceLine();
                this.invoiceLine.businessServiceName = this.services[i].name;

                this.invoiceLine.bookingId = this.booking.id;
                this.invoiceLine.lineNumber = 2;
                this.invoiceLine.description =
                    this.services[i].serviceType + "- " + this.services[i].name;
                this.invoiceLine.productCode =
                    this.booking.propertyReservationNumber;
                this.invoiceLine.quantity = this.services[i].count;
                this.invoiceLine.taxPercentage = this.services[i].taxPercentage;
                this.invoiceLine.unitPrice = Number(
                    this.services[i].beforeTaxAmount
                );
                this.invoiceLine.beforeTaxAmount =
                    this.services[i].beforeTaxAmount * this.services[i].count;
                this.invoiceLine.taxAmount = this.services[i].taxAmount;
                this.invoiceLine.afterTaxAmount =
                    this.services[i].afterTaxAmount;

                serviceAmount = serviceAmount + this.services[i].afterTaxAmount;

                if (
                    this.booking.serviceAmountPaid != null &&
                    this.booking.serviceAmountPaid >= serviceAmount
                ) {
                    paymentPaid = paymentPaid - this.services[i].afterTaxAmount;
                    this.invoiceLine.paidAmount =
                        this.services[i].afterTaxAmount;
                } else if (
                    this.booking.serviceAmountPaid != null &&
                    this.booking.serviceAmountPaid < serviceAmount
                ) {
                    this.invoiceLine.paidAmount = paymentPaid;
                } else {
                    this.invoiceLine.paidAmount = 0;
                }

                this.invoiceLine.balanceAmount =
                    this.services[i].afterTaxAmount -
                    this.invoiceLine.paidAmount;

                this.invoiceLine.discountAmount = 0;

                this.invoiceLines.push(this.invoiceLine);
            }

            // this.invoiceLine.businessServiceName = serviceName.toString();
        }
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

    onCheckOut() {
        if (
          this.booking.checkoutTime != undefined &&
          this.booking.checkoutTime != null
        ) {
          this.booking.checkoutTime = new Date(this.booking.checkoutTime)
            .getTime()
            .toString();
        }
    
        if (
          this.booking.roomDetails != undefined &&
          this.booking.roomDetails != null &&
          this.booking.roomDetails.length > 0
        ) {
          this.roomNumberList = [];
          for (let i = 0; i < this.booking.roomDetails.length; i++) {
            this.roomNumberList.push(this.booking.roomDetails[i].roomNumber);
          }
    
          this.booking.roomNumbers = this.roomNumberList.toString();
        }
    
        if (this.booking.taxDetails != null && this.booking.taxDetails != undefined && this.booking.taxDetails.length > 0)
        {
          this.checkout(this.booking);
        }
        else
        {
          this.roomReleaseAndManualCheckOut(this.booking, this.booking.checkoutTime);
        }
    
    }

    roomReleaseAndManualCheckOut(row,checkoutTime){
        this.loader = true;
        this.bookingService.roomRealese(row).subscribe(
          (response) => {
            if (response.status === 200) {
    
              this.bookingService.updateBookingStatusByBookingId(row.id,"CHECKEDOUT",checkoutTime).subscribe(
                (response) => {
                  this.presentToast("Booking checkout successfully");
                  this.loader = false;

                //   this.getRatesAndAvailability(row, true);
                  this.bookingService.findBooking(row.id).subscribe(
                    (response1) => {
                      this.booking = response1.body;
    
                      this.loader = false;
                      this.detailDialog(this.booking);
                      this.modalcntrler.dismiss("success");
                      this.UIDetectChange();
                    },
                    (error) => {
                      this.loader = false;
                      this.UIDetectChange();
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
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 417) {
                this.loader = false;
    
                this.presentToast(
                  "Please check booking status and outstanding amount in booking details section",
                );
                // this.openErrorSnackBar(
                //   'CheckOut Error,Please check booking status and outstanding amount in booking details section'
                // );
              }
            }
          }
        );
      }
    
    checkout(row) {
        let invoiceId, invoiceNo;
        this.loader = true;
        this.bookingService.checkout(row).subscribe(
          (response) => {
            if (response.status === 200) {
              // invoiceId = response.body.propertyInvoiceNumber;
              // invoiceNo = response.body.invoiceId;
                 this.createAuditReport(row);
              this.presentToast("Guest CheckOut Done.");
             
              let todateString = this.datepipe.transform(row.toDate, "yyyy-MM-dd");
              let currentDate: Date = new Date();
              let currentDateString = this.datepipe.transform(
                currentDate,
                "yyyy-MM-dd"
              );
    
              let defference =
                new Date(todateString).getTime() -
                new Date(currentDateString).getTime();
    
              this.roomRealese(row);
    
              this.loader = false;
            }
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 417) {
                this.loader = false;
                // this.openErrorSnackBar('Please proceed with offline room allocation and update the booking.');
                this.presentToast(
                  "Please check booking status and outstanding amount in booking details section."
                );
              }
            }
          }
        );
      }

      createAuditReport(currentBooking : Booking)
      {
        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
          this.role.push(item);
        });
    
        let audit = new Audit();
    
        audit.reservationId = currentBooking.propertyReservationNumber;
        audit.auditType = AUDIT_BOOKING_CHECKOUT;
        audit.bookingId = currentBooking.id;
        audit.propertyId = currentBooking.propertyId;
        audit.role = this.role[0];
        audit.updatedAt = new Date().getTime().toString();
        audit.updatedBy = currentBooking.operatorName;
    
        if (currentBooking != null && currentBooking != undefined)
        {
          audit.newValue = this.datepipe.transform(currentBooking.checkoutTime, 'yyyy-MM-dd');
        }
    
        audit.operatorNotes = currentBooking.operatorNotes;
        audit.roomId = currentBooking.roomId;
        audit.updateType = "CHECKEDOUT BOOKING";
    
        this.loader = true;
        this.propertyService.createAuditReport(audit).subscribe(
          (data) => {
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            this.loader = false;
          }
        );
      }

    // onCheckOut() {
    //     if (
    //         this.booking.checkoutTime != undefined &&
    //         this.booking.checkoutTime != null
    //     ) {
    //         this.booking.checkoutTime = new Date(this.booking.checkoutTime)
    //             .getTime()
    //             .toString();
    //     }

    //     if (
    //         this.booking.roomDetails != undefined &&
    //         this.booking.roomDetails != null &&
    //         this.booking.roomDetails.length > 0
    //     ) {
    //         this.roomNumberList = [];
    //         for (let i = 0; i < this.booking.roomDetails.length; i++) {
    //             this.roomNumberList.push(
    //                 this.booking.roomDetails[i].roomNumber
    //             );
    //         }

    //         this.booking.roomNumbers = this.roomNumberList.toString();
    //     }

    //     if (this.isMultiBooking === false) {
    //         this.checkout(this.booking);
    //     } else {
    //         this.modalcntrler.dismiss(this.booking.checkoutTime);
    //     }
    // }

    // checkout(row) {
    //     this.loader = true;
    //     this.bookingService.checkout(row).subscribe(
    //         (response) => {
    //             if (response.status === 200) {
    //                 this.presentToast("Guest CheckOut Done.");
    //                 let todateString =
    //                     this.dateService.convertMillisecondsToYYYMMDDFormat(
    //                         row.toDate
    //                     );
    //                 let currentDate: Date = new Date();
    //                 let currentDateString =
    //                     this.dateService.convertMillisecondsToYYYMMDDFormat(
    //                         currentDate
    //                     );

    //                 let defference =
    //                     new Date(todateString).getTime() -
    //                     new Date(currentDateString).getTime();

    //                 if (defference > 0) {
    //                     this.roomRealese(row);
    //                 } else {
    //                     this.getBookingById();
    //                 }

    //                 this.loader = false;
    //             }
    //         },
    //         (error) => {
    //             if (error instanceof HttpErrorResponse) {
    //                 if (error.status === 417) {
    //                     this.loader = false;
    //                     this.modalcntrler.dismiss();
    //                     this.navCtrl.navigateForward(["checkout-detail"]);
    //                     this.presentToast(
    //                         "Please check booking status and outstanding amount in booking details section."
    //                     );
    //                 }
    //             }
    //         }
    //     );
    // }

    getGST() {
        if (
          this.businessService != null &&
          this.businessService != undefined &&
          this.businessService.gstNumber != undefined &&
          this.businessService.gstNumber != null &&
          this.businessService.gstNumber != ""
        ) {
          return this.businessService.gstNumber;
        } else if (
          this.property.gstNumber != undefined &&
          this.property.gstNumber != null &&
          this.property.gstNumber != ""
        ) {
          return this.property.gstNumber;
        } else {
          return null;
        }
      }

    getBookingById() {
        this.loader = true;
        this.bookingService.findBooking(this.booking.id).subscribe(
            (response1) => {
                this.booking = response1.body;

                // for invoice no call getBookingBYId
                this.invoice.invoiceNo = this.booking.invoiceId;
                this.invoice.id = this.booking.propertyInvoiceNumber;
                this.invoice.gstNumber = this.getGST();
                this.loader = false;

                // if(this.booking.propertyInvoiceNumber != null && this.booking.propertyInvoiceNumber != undefined)
                // {
                //   this.sendConfirmationMessage(this.booking);
                // }

                this.updateInvoice();
                this.detailDialog(this.booking);
                this.UIDetectChange();
            },
            (error) => {
                this.loader = false;
                this.UIDetectChange();
            }
        );
    }

    detailDialog(booking)
    { 

    }


    updateInvoice() {
        this.loader = true;
        this.invoice.invoiceDate = this.datepipe.transform(
          this.invoice.invoiceDate,
          "yyyy-MM-dd"
        );
        this.invoice.dueDate = this.datepipe.transform(
          this.invoice.dueDate,
          "yyyy-MM-dd"
        );
        this.invoice.invoiceLinesDto = this.invoiceLines;
    
        this.invoice.netAmount = this.calculatePrice();
    
        //  console.log("invoice : " + JSON.stringify(this.invoice));
    
        this.invoiceService.createInvoice(this.invoice).subscribe(
          (response) => {
            this.modalcntrler.dismiss("success");
            this.loader = false;
          },
          (error) => {
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
          }
        );
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

        for (let i = 0; i < this.invoiceLines.length; i++) {
            if (this.invoiceLines[i].beforeTaxAmount != null) {
                this.invoice.netAmount =
                    this.invoice.netAmount +
                    this.invoiceLines[i].beforeTaxAmount;
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
                    this.invoice.balanceAmount -
                    this.invoiceLines[i].balanceAmount;
            }

            if (this.invoiceLines[i].afterTaxAmount != null) {
                this.invoice.totalAmount =
                    this.invoice.totalAmount +
                    this.invoiceLines[i].afterTaxAmount;
            }

            if (this.invoiceLines[i].discountAmount != null) {
                this.invoice.discountAmount =
                    this.invoice.discountAmount +
                    this.invoiceLines[i].discountAmount;
            }
        }

        return this.invoice.netAmount;
    }

    UIDetectChange() {
        setTimeout(() => {
            if (
                this.changeDetectorRefs &&
                !(this.changeDetectorRefs as ViewRef).destroyed
            ) {
                this.changeDetectorRefs.detectChanges();
            }
        });
    }

    roomRealese(row) {
        this.loader = true;
        row.checkoutTime = new Date().getTime();
        this.bookingService.roomRealese(row).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.loader = false;
                    this.getBookingById();
                    this.presentToast("Room Release Done");
                    
                    // this.refresh();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.loader = false;
                        this.navCtrl.navigateForward(["checkout-detail"]);
                        this.presentToast(
                            "CheckOut Error,Please check booking status and outstanding amount in booking details section"
                        );
                    }
                }
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

    cancel() {
        this.modalcntrler.dismiss();
    }

    
  calculateRoomPrice() {
    let noOfRoom = this.extraDayChargebooking.noOfRooms;
    let noOfNights, Difference_In_Time;

    if (
      this.extraDayChargebooking.fromDate != undefined &&
      this.extraDayChargebooking.fromDate != null &&
      this.extraDayChargebooking.toDate != null &&
      this.extraDayChargebooking.toDate != undefined
    ) {
      let fromdate = this.datepipe.transform(
        this.extraDayChargebooking.fromDate,
        "yyyy-MM-dd"
      );
      let todate = this.getToDate(this.extraDayChargebooking);

      Difference_In_Time =
        new Date(todate).getTime() - new Date(fromdate).getTime();

      noOfNights = Difference_In_Time / (1000 * 3600 * 24);

      if (Math.ceil(noOfNights) > 0)
      {
        this.differenceDay = Math.ceil(noOfNights);
      }
      else
      {
        this.differenceDay = 1;
      }


    } else {
      noOfNights = 0;
      this.differenceDay = 0;
    }

    this.extraDayChargebooking.noOfNights = this.differenceDay;
    this.extraDayChargebooking.expectedNights = this.extraDayChargebooking.noOfNights;

    if (
      this.plan.minimumOccupancy * this.extraDayChargebooking.noOfRooms <
      this.extraDayChargebooking.noOfPersons
    ) {
      this.extraDayChargebooking.noOfExtraPerson =
        this.extraDayChargebooking.noOfPersons -
        this.plan.minimumOccupancy * this.extraDayChargebooking.noOfRooms;

      if (
        this.bookingExtraPersonCharge != null &&
        this.bookingExtraPersonCharge != undefined &&
        this.bookingExtraPersonCharge > 0
      ) {
        this.plan.extraChargePerPerson =
          this.bookingExtraPersonCharge /
          (this.extraDayChargebooking.noOfExtraPerson * this.differenceDay);
        this.extraDayChargebooking.extraPersonCharge = this.bookingExtraPersonCharge;
      } else {
        this.extraDayChargebooking.extraPersonCharge =
          this.plan.extraChargePerPerson *
          this.extraDayChargebooking.noOfExtraPerson *
          this.differenceDay;
      }
    } else {
      this.extraDayChargebooking.noOfExtraPerson = 0;
      this.extraDayChargebooking.extraPersonCharge = 0;
    }

    if (
      this.plan.noOfChildren * this.extraDayChargebooking.noOfRooms <
      this.extraDayChargebooking.noOfChildren
    ) {
      this.extraDayChargebooking.noOfExtraChild =
        this.extraDayChargebooking.noOfChildren -
        this.plan.noOfChildren * this.extraDayChargebooking.noOfRooms;

      if (
        this.bookingExtraChildCharge != null &&
        this.bookingExtraChildCharge != undefined &&
        this.bookingExtraChildCharge > 0
      ) {
        this.plan.extraChargePerChild =
          this.bookingExtraChildCharge /
          (this.extraDayChargebooking.noOfExtraChild * this.differenceDay);
        this.extraDayChargebooking.extraChildCharge = this.bookingExtraChildCharge;
        // this.bookingExtraChildCharge = null;
      } else {
        this.extraDayChargebooking.extraChildCharge =
          this.plan.extraChargePerChild *
          this.extraDayChargebooking.noOfExtraChild *
          this.differenceDay;
      }
    } else {
      this.extraDayChargebooking.noOfExtraChild = 0;
      this.extraDayChargebooking.extraChildCharge = 0;
    }

    if (
      this.plan != undefined &&
      this.totalPlanAmount != undefined &&
      this.totalPlanAmount != null
    ) {
      this.bookingRoomPrice =
        this.totalPlanAmount * this.differenceDay * noOfRoom +
        this.extraDayChargebooking.extraPersonCharge +
        this.extraDayChargebooking.extraChildCharge;
      this.PlanRoomPrice = this.totalPlanAmount * this.differenceDay * noOfRoom;
      this.extraDayChargebooking.roomTariffBeforeDiscount = this.totalPlanAmount;
    } else {
      this.bookingRoomPrice = 0;
      this.PlanRoomPrice = 0;
      this.extraDayChargebooking.roomTariffBeforeDiscount = 0;
    }

    this.extraDayChargebooking.totalRoomTariffBeforeDiscount = this.PlanRoomPrice;

    this.calculateBookingAmounts();

    return this.PlanRoomPrice;
  }
    
  payLateCheckOut() {

    if (this.chargeType === 'LCC')
    {
      if (
        this.service.afterTaxAmount != null &&
        this.service.afterTaxAmount != undefined
      ) {
        this.createPayment();
      }
    }
    else if (this.chargeType === 'EDC')
    {
      this.submitExtraCharge();
    }

  }
    
  submitExtraCharge()
  {
    if (this.extraDayChargebooking.fromTime != undefined && this.extraDayChargebooking.fromTime != null) {
      this.extraDayChargebooking.fromTime = new Date(this.extraDayChargebooking.fromTime)
        .getTime()
        .toString();
    }

    // if (this.extraDayChargebooking.toTime != undefined && this.extraDayChargebooking.toTime != null) {
    //   this.extraDayChargebooking.toTime = new Date(this.extraDayChargebooking.toTime)
    //     .getTime()
    //     .toString();
    // }

    this.extraDayChargebooking.outstandingAmount = this.extraDayChargebooking.payableAmount;
    this.saveBooking(this.extraDayChargebooking);
  }
    
  saveBooking(booking: Booking) {

    const createBookingObsr = this.bookingService
      .saveBooking(booking)
      .subscribe((response) => {
        this.booking = response.body;

        this.token.saveBookingDetal(this.booking);
         
        this.navCtrl.navigateForward(["checkout-detail"]);
        this.cancel();
      });
  }

    
  createPayment() {
    this.payment = new Payment();
    this.payment.businessServiceName = this.service.name;
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
      this.service.name + " (" + this.service.serviceType + ") service payment";
    this.payment.status = "NotPaid";
    this.payment.paymentMode = "Cash";
    this.service.date = this.booking.checkoutTime;
    this.payment.date = this.service.date;
    this.payment.propertyId = this.token.getProperty().id;
    this.payment.roomNumber = this.service.roomNumber;

    this.payment.netReceivableAmount = this.service.beforeTaxAmount;
    this.payment.transactionAmount = this.service.afterTaxAmount;
    this.payment.taxAmount = this.service.taxAmount;
    this.payment.amount = this.service.afterTaxAmount;
    this.payment.transactionChargeAmount = this.service.afterTaxAmount;
    this.processPayment(this.payment);
  }
    
  processPayment(payment: Payment) {
    this.paymentService.processPayment(payment).subscribe((data) => {
      this.payment = data.body;
      this.paymentService.savePayment(this.payment).subscribe((res) => {
        if (res.status === 200) {
          this.presentToast(`Payment Details Saved`);
          this.service.paymentId = this.payment.id;
          this.loader = false;
          this.addServiceToBooking();

          this.service = new Service();
          this.payment = new Payment();
        } else {
          this.presentToast(`Error in updating payment details`);
          this.loader = false;
        }
      });
    });
    }
    
    onDateChangeAndCheckout()
    {
      if (
        this.booking.checkoutTime != undefined &&
        this.booking.checkoutTime != null
      ) {
        this.booking.checkoutTime = new Date(this.booking.checkoutTime)
          .getTime()
          .toString();
      }
  
      this.booking.toDate = this.datepipe.transform(this.booking.checkoutTime, 'yyyy-MM-dd');
  
      this.bookingURLOB = new Booking();
      this.bookingURLOB = this.booking;
      this.bookingURLOB.changeType = "date";
  
      if (this.booking.roomId !== undefined && this.booking.roomId != null && this.booking.roomId > 0) {
        this.bookingURLOB.roomBooking = true;
      }
      else
      {
        this.bookingURLOB.roomBooking = false;
      }
        
      let navigationExtras: NavigationExtras = {
        queryParams: {
            booking: JSON.stringify(this.booking),
            status: "Date-Change",
            checkoutTime : this.booking.checkoutTime,
        },
      };

    this.router.navigate(["menu-action-booking"], navigationExtras);
    this.cancel();
  
    }
    
  addServiceToBooking() {
    this.bookingService
      .addServiceTOBooking(this.booking.id, this.service)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this.loader = false;

            this.token.saveBookingDetal(this.booking);
         
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    status :'checkoutPayment',
                }
            };
        
            this.router.navigate(['tab-payments'], navigationExtras);
            this.cancel();
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.loader = false;
          }
        }
      );
  }
    
  dontPay() {
    this.booking.checkoutTime = this.datepipe.transform(
      this.booking.toTime,
      "yyyy-MM-ddTHH:mm"
    );
  }
    
  getToDate(booking) {
    let bookingTodate = this.datepipe.transform(booking.toDate, "yyyy-MM-dd");

    if (booking.toTime != null &&
      booking.toTime != undefined &&
      booking.toTime != "NaN-NaN-NaN")
    {
      let bookingToTime = this.datepipe.transform(booking.toTime, "yyyy-MM-dd");

      if (new Date(bookingTodate).getTime() < new Date(bookingToTime).getTime())
      {
        return bookingToTime;
      }
      else
      {
        return bookingTodate;
      }
    }
    else
    {
      return bookingTodate;
    }
  }
    
  calculateBookingAmounts() {
    let noOfRoom = this.extraDayChargebooking.noOfRooms;

    let discountAmount: number;

    if (
      this.plan != undefined &&
      this.totalPlanAmount != undefined &&
      this.totalPlanAmount != null
    ) {
      if (
        this.extraDayChargebooking.discountPercentage != undefined &&
        this.extraDayChargebooking.discountPercentage !== null &&
        this.extraDayChargebooking.discountPercentage > 0
      ) {
        this.extraDayChargebooking.discountPercentage = Number(
          this.extraDayChargebooking.discountPercentage
        );

        this.roomOnlyPricePerNight =
          this.totalPlanAmount *
          ((100 - this.extraDayChargebooking.discountPercentage) / 100);
        // discountAmount = this.totalPlanAmount * (this.booking.discountPercentage / 100) * noOfNights * noOfRoom;
        discountAmount =
          this.bookingRoomPrice * (this.extraDayChargebooking.discountPercentage / 100);
        this.extraDayChargebooking.discountAmount = Number(discountAmount.toFixed(2));
        // this.afterDiscountAmount = this.bookingRoomPrice - discountAmount;
      } else {
        this.roomOnlyPricePerNight = this.totalPlanAmount;
        discountAmount = 0;
        this.extraDayChargebooking.discountAmount = 0;
        this.extraDayChargebooking.discountPercentage = 0;
      }

      this.calculateTaxSlab();

      this.extraDayChargebooking.payableAmount =
        this.bookingRoomPrice -
        this.extraDayChargebooking.discountAmount +
        this.extraDayChargebooking.taxAmount;
      this.extraDayChargebooking.payableAmount = Math.round(this.extraDayChargebooking.payableAmount);
      this.extraDayChargebooking.totalAmount =
        this.bookingRoomPrice -
        this.extraDayChargebooking.discountAmount +
        this.extraDayChargebooking.taxAmount;
      this.extraDayChargebooking.beforeTaxAmount =
        this.bookingRoomPrice - this.extraDayChargebooking.discountAmount;
      this.extraDayChargebooking.roomPrice = (Math.round(this.roomOnlyPricePerNight));
      this.extraDayChargebooking.discountAmount = Number(discountAmount.toFixed(2));
      // }
      //Logger.log(  this.booking.roomPrice+"Room only price tonight:" + roomOnlyPricePerNight + "\n Before Tax Amount:" + this.booking.beforeTaxAmount + "\nTax Type:" + this.taxType + "\n Tax Amount:" +  this.booking.taxAmount + "\n Booking Payable Amount:" + this.booking.payableAmount +  "\n Booking Total Amount:" + this.booking.totalAmount);
    }
    this.afterDiscountAmount =
      this.bookingRoomPrice - this.extraDayChargebooking.discountAmount;
    // this.afterDiscountAmount = Number(this.afterDiscountAmount.toFixed(2));
    this.afterDiscountAmount = this.afterDiscountAmount;
    this.extraDayChargebooking.totalBookingAmount = this.afterDiscountAmount;
  }
    
  calculateTaxSlab() {
    this.totalSplitTax = [];
    if (this.taxDetailsSelected.length > 0) {
      this.extraDayChargebooking.taxAmount = 0;
      for (let i = 0; i < this.taxDetailsSelected.length; i++) {
        let taxPercentage = this.token.getTaxPercentageByTaxDetail(
          Math.round(this.roomOnlyPricePerNight),
          this.taxDetailsSelected[i]
        );

        if (taxPercentage != null && taxPercentage != undefined) {
          let totalTaxAmount =
            (this.bookingRoomPrice - this.extraDayChargebooking.discountAmount) *
            (taxPercentage / 100);
          this.extraDayChargebooking.taxAmount = this.extraDayChargebooking.taxAmount + totalTaxAmount;

          let tax: SplitTaxDTO = {
            name: this.taxDetailsSelected[i].name,
            percentage: taxPercentage,
            taxAmount: totalTaxAmount,
          };

          this.taxDetailsSelected[i].percentage = taxPercentage;
          this.taxDetailsSelected[i].taxAmount = totalTaxAmount;
          this.taxDetailsSelected[i].taxableAmount =
            this.bookingRoomPrice - this.extraDayChargebooking.discountAmount;

          this.totalSplitTax.push(tax);
        }
      }
    } else {
      this.extraDayChargebooking.taxAmount = this.onlyTaxAmount;
    }

    this.extraDayChargebooking.taxDetails = this.taxDetailsSelected;
  }
}
