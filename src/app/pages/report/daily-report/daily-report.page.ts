import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { IonDatetime } from "@ionic/angular";
import { format, parseISO } from "date-fns";
import { Property } from "src/app/model/property/Property";
import { CountryConfigService } from "src/app/service/CountryConfig/countryConfig.service";
import { DateService } from "src/app/service/DateService/date-service.service";
import { ReportService } from "src/app/service/report/report-service.service";
import { TokenStorage } from "src/app/token.storage";
import { NavController } from "@ionic/angular";

@Component({
    selector: "app-daily-report",
    templateUrl: "./daily-report.page.html",
    styleUrls: ["./daily-report.page.scss"],
})
export class DailyReportPage implements OnInit {
    @ViewChild(IonDatetime, { static: true }) date: IonDatetime;
    public todaydate: any = new Date().toISOString();
    inc_data: any;
    inc_data1: any;
    exp_data: any;
    exp_data1: any;
    isProgressing: boolean = false;

    curr_booking_data: any;
    adv_booking_data: any;
    stay_booking_data: any;

    curr_booking_data1: any;
    adv_booking_data1: any;
    stay_booking_data1: any;

    currBook_totaloverall: number;
    currBook_totalGuests: number;
    currBook_totalRooms: number;

    advBook_totaloverall: number;
    advBook_totalGuests: number;
    advBook_totalRooms: number;

    stayBook_totaloverall: number;
    stayBook_totalGuests: number;
    stayBook_totalRooms: number;

    showCurr_room = false;
    showCurr_any = false;
    showAdv_room = false;
    showAdv_any = false;
    showStay_room = false;
    showStay_any = false;

    currentBooking_detail: any;
    advanceBooking_detail: any;
    stayBooking_detail: any;

    curr_roomTitle: string;
    curr_guestTitle: string;
    adv_roomTitle: string;
    adv_guestTitle: string;
    stay_roomTitle: string;
    stay_guestTitle: string;

    rest_order_data: any;
    rest_order_data1: any;
    order_detail: any;
    rest_orderfiltered: string[];
    rest_totaloverall: number;
    rest_totalorders: number;
    show_rest_order = false;
    check_any_order = false;
    orderTitle: string;

    startDate: Date;
    startingDate: any;
    dateValue = "";
    dateValue2 = "";
    enddateValue = "";
    endddateValue2 = "";
    datetime: any;
    datetime1: any;
    endDate: Date;
    selectedSegment: string;
    incomeDetails: any;
    expenseDetails: any;
    businessService: String;
    credit: any;
    cash: any;
    upi: any;
    incomefiltervalue: String;
    expensefiltervalue: String;
    totaloverall: number;
    inc_percentCard: number;
    inc_percentCash: number;
    inc_percentBank: number;
    inc_percentPrepaid: number;
    inc_percentWallet: number;
    inc_percentCheque: number;
    inc_percentDD: number;
    inc_percentPayment: number;
    inc_percentUPI: number;
    inc_percentBill: number;
    inc_percentMultimode: number;
    inc_percentCredit: number;
    inc_businessservicesfiltered: string[];

    exp_percentCard: number;
    exp_percentCash: number;
    exp_percentBank: number;
    exp_percentPrepaid: number;
    exp_percentWallet: number;
    exp_percentCheque: number;
    exp_percentDD: number;
    exp_percentPayment: number;
    exp_percentUPI: number;
    exp_percentBill: number;
    exp_percentMultimode: number;
    exp_percentCredit: number;
    exp_expenseNamefiltered: string[];

    totalCard = 0;
    totalCash = 0;
    totalBank = 0;
    totalPrePaid = 0;
    totalWallet = 0;
    totalCheque = 0;
    totalDD = 0;
    totalPaymentTerminal = 0;
    totalUPI = 0;
    totalBilltoroom = 0;
    totalMultimode = 0;
    totalCredit = 0;
    cardTitle: string;
    cashTitle: string;
    bankTitle: string;
    prepaidTitle: string;
    walletTitle: string;
    chequeTitle: string;
    ddTitle: string;
    paymentTitle: string;
    upiTitle: string;
    billTitle: string;
    multiModeTitle: string;
    creditTitle: string;
    show_inc_card = false;
    show_inc_cash = false;
    show_inc_bank = false;
    show_inc_prepaid = false;
    show_inc_wallet = false;
    show_inc_cheque = false;
    show_inc_dd = false;
    show_inc_payment_terminal = false;
    show_inc_UPI = false;
    show_inc_billtoroom = false;
    show_inc_multi_payment = false;
    show_inc_credit = false;
    check_any_inc = false;
    check_any_exp = false;
    show_exp_card = false;
    show_exp_cash = false;
    show_exp_bank = false;
    show_exp_prepaid = false;
    show_exp_wallet = false;
    show_exp_cheque = false;
    show_exp_dd = false;
    show_exp_payment_terminal = false;
    show_exp_UPI = false;
    show_exp_billtoroom = false;
    show_exp_multi_payment = false;
    show_exp_credit = false;

    bookingSegment: String;
    curr_book_filtered: string[];
    adv_book_filtered: string[];
    stay_book_filtered: string[];

    orderfiltervalue: string;
    curr_bookFiltervalue: string;
    adv_bookFiltervalue: string;
    stay_bookFiltervalue: string;
    property: Property;
    currency: string;
    isRequested: boolean = false;

    constructor(
        private httpClient: HttpClient,
        private reportService: ReportService,
        private dateService: DateService,
        private countryConfig: CountryConfigService,
        private token: TokenStorage,
        public navCtrl: NavController
    ) {
        this.property = new Property();
        // this.fetch()
    }
    ngOnInit() {
        if (
            this.token.getProperty() != null &&
            this.token.getProperty() != undefined
        ) {
            this.property = this.token.getProperty();

            if (
                this.property.localCurrency != null &&
                this.property.localCurrency != undefined
            ) {
                this.currency = this.property.localCurrency.toUpperCase();
            }
        }
    }

    navigateToPage() {
        this.navCtrl.navigateForward('/report-dashboard');
      }

    startdateChange() {
        this.endDate = this.startDate;
    }
handleEndDateChange(value: string | string[]) {
  if (Array.isArray(value)) {
    value = value[0]; // or however you want to handle arrays
  }
  this.enddateValue = this.formatDate(value);
}
handleStartDateChange(value: string | string[]) {
  if (Array.isArray(value)) {
    value = value[0]; // Or handle multiple dates if needed
  }
  this.dateValue = this.formatDate(value);
  this.startdateChange(); // call the original method
}

    Reset() {
        this.startDate = null;
        this.endDate = null;

        this.inc_data = null;
        this.inc_data1 = null;

        this.exp_data = null;
        this.exp_data1 = null;

        this.adv_booking_data = null;
        this.adv_booking_data1 = null;

        this.curr_booking_data = null;
        this.curr_booking_data1 = null;

        this.stay_booking_data = null;
        this.stay_booking_data1 = null;

        this.rest_order_data = null;
        this.rest_order_data1 = null;

        this.inc_businessservicesfiltered = null;
        this.exp_expenseNamefiltered = null;
        this.rest_orderfiltered = null;
        this.curr_book_filtered = null;
        this.adv_book_filtered = null;
        this.stay_book_filtered = null;
        this.isRequested = false;
    }
    //below is the submitData which fetches Data from API based on sent dates
    submitData() {
        this.isRequested = false;
        this.inc_data = null;
        this.inc_data1 = null;

        this.exp_data = null;
        this.exp_data1 = null;

        this.adv_booking_data = null;
        this.adv_booking_data1 = null;

        this.curr_booking_data = null;
        this.curr_booking_data1 = null;

        this.stay_booking_data = null;
        this.stay_booking_data1 = null;

        this.rest_order_data = null;
        this.rest_order_data1 = null;

        this.inc_businessservicesfiltered = null;
        this.exp_expenseNamefiltered = null;
        this.rest_orderfiltered = null;
        this.curr_book_filtered = null;
        this.adv_book_filtered = null;
        this.stay_book_filtered = null;
        this.isProgressing = true;

        this.httpClient
            .get(
                `${this.countryConfig.getCoreApiURL()}/api/report/dailyIncome/propertyId/${
                    this.property.id
                }/dates?startDate=${this.dateValue}&endDate=${
                    this.enddateValue
                }`
            )
            .subscribe(
                (res) => {
                    this.isRequested = true;
                    if (res != null && res != undefined) {
                        this.inc_data = new Array(res);
                        this.inc_data1 = this.inc_data[0];

                        this.triggerBusiness();
                        this.fetchExpData();
                        this.fetchRestData();
                        this.fetchCurrBookingData();
                        this.fetchAdvBookingData();
                        this.fetchStayBookingData();
                    }
                    this.triggerInc();
                    this.expensefiltervalue = "All";
                    this.curr_bookFiltervalue = "All";
                    this.adv_bookFiltervalue = "All";
                    this.stay_bookFiltervalue = "All";
                    this.orderfiltervalue = "All";
                    this.isProgressing = false;
                },
                (error) => {
                    this.isRequested = true;
                    this.isProgressing = false;
                }
            );
    }

    fetchExpData() {
        this.httpClient
            .get(
                `${this.countryConfig.getCoreApiURL()}/api/report/dailyExpense/propertyId/${
                    this.property.id
                }/dates?startDate=${this.dateValue}&endDate=${
                    this.enddateValue
                }`
            )
            .subscribe((exp) => {
                if (exp != null && exp != undefined) {
                    this.exp_data = new Array(exp);
                    this.exp_data1 = this.exp_data[0];
                    this.triggerExpenseName();
                }
            });
    }

    triggerInc() {
        this.totalCard = 0;
        this.totalCash = 0;
        this.totalBank = 0;
        this.totalPrePaid = 0;
        this.totalWallet = 0;
        this.totalCheque = 0;
        this.totalDD = 0;
        this.totalPaymentTerminal = 0;
        this.totalUPI = 0;
        this.totalBilltoroom = 0;
        this.totalMultimode = 0;
        this.totalCredit = 0;
        this.show_inc_card = false;
        this.show_inc_cash = false;
        this.show_inc_bank = false;
        this.show_inc_prepaid = false;
        this.show_inc_wallet = false;
        this.show_inc_cheque = false;
        this.show_inc_dd = false;
        this.show_inc_payment_terminal = false;
        this.show_inc_UPI = false;
        this.show_inc_billtoroom = false;
        this.show_inc_multi_payment = false;
        this.show_inc_credit = false;
        this.check_any_inc = false;
        this.selectedSegment = "income";
        this.incomefiltervalue = "All";

        if (
            this.inc_data1 != null &&
            this.inc_data1 != undefined &&
            this.inc_data1.length > 0
        ) {
            for (var i = 0; i < this.inc_data1.length; i++) {
                this.incomeDetails = this.inc_data1[i];
                this.totalCard = this.totalCard + this.incomeDetails.card; //new
                this.totalCash = this.totalCash + this.incomeDetails.cash;
                this.totalBank =
                    this.totalBank + this.incomeDetails.bankTransfer; //new
                this.totalPrePaid =
                    this.totalPrePaid + this.incomeDetails.prePaid; //new
                this.totalWallet = this.totalWallet + this.incomeDetails.wallet; //new
                this.totalCheque = this.totalCheque + this.incomeDetails.cheque; //new
                this.totalDD = this.totalDD + this.incomeDetails.demandDraft; //new
                this.totalPaymentTerminal =
                    this.totalPaymentTerminal +
                    this.incomeDetails.paymentTerminal; //new
                this.totalUPI = this.totalUPI + this.incomeDetails.upi;
                this.totalBilltoroom =
                    this.totalBilltoroom + this.incomeDetails.billToRoom; //new
                this.totalMultimode =
                    this.totalMultimode + this.incomeDetails.multiMode; //new
                this.totalCredit = this.totalCredit + this.incomeDetails.credit;
            }
        }
        this.totaloverall =
            this.totalCard +
            this.totalCash +
            this.totalBank +
            this.totalPrePaid +
            this.totalWallet +
            this.totalCheque +
            this.totalDD +
            this.totalPaymentTerminal +
            this.totalUPI +
            this.totalBilltoroom +
            this.totalMultimode +
            this.totalCredit;

        if (this.totalCard > 0) {
            this.show_inc_card = true;
            this.inc_percentCard = this.totalCard / this.totaloverall;

            this.totalCard = Math.round(this.totalCard * 100) / 100;
            this.cardTitle = String(this.totalCard);
            this.check_any_inc = true;
        }
        if (this.totalCash > 0) {
            this.show_inc_cash = true;
            this.inc_percentCash = this.totalCash / this.totaloverall;
            this.totalCash = Math.round(this.totalCash * 100) / 100;
            this.cashTitle = String(this.totalCash);
            this.check_any_inc = true;
        }
        if (this.totalBank > 0) {
            this.show_inc_bank = true;
            this.inc_percentBank = this.totalBank / this.totaloverall;
            this.totalBank = Math.round(this.totalBank * 100) / 100;
            this.bankTitle = String(this.totalBank);
            this.check_any_inc = true;
        }
        if (this.totalPrePaid > 0) {
            this.show_inc_prepaid = true;
            this.inc_percentPrepaid = this.totalPrePaid / this.totaloverall;
            this.totalPrePaid = Math.round(this.totalPrePaid * 100) / 100;
            this.prepaidTitle = String(this.totalPrePaid);
            this.check_any_inc = true;
        }
        if (this.totalWallet > 0) {
            this.show_inc_wallet = true;
            this.inc_percentWallet = this.totalWallet / this.totaloverall;
            this.totalWallet = Math.round(this.totalWallet * 100) / 100;
            this.walletTitle = String(this.totalWallet);
            this.check_any_inc = true;
        }
        if (this.totalCheque > 0) {
            this.show_inc_cheque = true;
            this.inc_percentCheque = this.totalCheque / this.totaloverall;
            this.totalCheque = Math.round(this.totalCheque * 100) / 100;
            this.chequeTitle = String(this.totalCheque);
            this.check_any_inc = true;
        }
        if (this.totalDD > 0) {
            this.show_inc_dd = true;
            this.inc_percentDD = this.totalDD / this.totaloverall;
            this.totalDD = Math.round(this.totalDD * 100) / 100;
            this.ddTitle = String(this.totalDD);
            this.check_any_inc = true;
        }
        if (this.totalPaymentTerminal > 0) {
            this.show_inc_payment_terminal = true;
            this.inc_percentPayment =
                this.totalPaymentTerminal / this.totaloverall;
            this.totalPaymentTerminal =
                Math.round(this.totalPaymentTerminal * 100) / 100;
            this.paymentTitle = String(this.totalPaymentTerminal);
            this.check_any_inc = true;
        }
        if (this.totalUPI > 0) {
            this.show_inc_UPI = true;
            this.inc_percentUPI = this.totalUPI / this.totaloverall;
            this.totalUPI = Math.round(this.totalUPI * 100) / 100;
            this.upiTitle = String(this.totalUPI);
            this.check_any_inc = true;
        }
        if (this.totalBilltoroom > 0) {
            this.show_inc_billtoroom = true;
            this.inc_percentBill = this.totalBilltoroom / this.totaloverall;
            this.totalBilltoroom = Math.round(this.totalBilltoroom * 100) / 100;
            this.billTitle = String(this.totalBilltoroom);
            this.check_any_inc = true;
        }
        if (this.totalMultimode > 0) {
            this.show_inc_multi_payment = true;
            this.inc_percentMultimode = this.totalMultimode / this.totaloverall;
            this.totalMultimode = Math.round(this.totalMultimode * 100) / 100;
            this.multiModeTitle = String(this.totalMultimode);
            this.check_any_inc = true;
        }
        if (this.totalCredit > 0) {
            this.show_inc_credit = true;
            this.inc_percentCredit = this.totalCredit / this.totaloverall;
            this.totalCredit = Math.round(this.totalCredit * 100) / 100;
            this.creditTitle = String(this.totalCredit);
            this.check_any_inc = true;
        }
        this.selectedSegment = "income";
    }
    triggerExp() {
        this.totalCard = 0;
        this.totalCash = 0;
        this.totalBank = 0;
        this.totalPrePaid = 0;
        this.totalWallet = 0;
        this.totalCheque = 0;
        this.totalDD = 0;
        this.totalPaymentTerminal = 0;
        this.totalUPI = 0;
        this.totalBilltoroom = 0;
        this.totalMultimode = 0;
        this.totalCredit = 0;
        this.selectedSegment = "expense";
        this.check_any_exp = false;
        this.show_exp_card = false;
        this.show_exp_cash = false;
        this.show_exp_bank = false;
        this.show_exp_prepaid = false;
        this.show_exp_wallet = false;
        this.show_exp_cheque = false;
        this.show_exp_dd = false;
        this.show_exp_payment_terminal = false;
        this.show_exp_UPI = false;
        this.show_exp_billtoroom = false;
        this.show_exp_multi_payment = false;
        this.show_exp_credit = false;
        this.expensefiltervalue = "All";
        if (
            this.exp_data1 != null &&
            this.exp_data1 != undefined &&
            this.exp_data1.length > 0
        ) {
            for (var i = 0; i < this.exp_data1.length; i++) {
                this.incomeDetails = this.exp_data1[i];
                this.totalCard = this.totalCard + this.incomeDetails.card; //new
                this.totalCash = this.totalCash + this.incomeDetails.cash;
                this.totalBank =
                    this.totalBank + this.incomeDetails.bankTransfer; //new
                this.totalPrePaid =
                    this.totalPrePaid + this.incomeDetails.prePaid; //new
                this.totalWallet = this.totalWallet + this.incomeDetails.wallet; //new
                this.totalCheque = this.totalCheque + this.incomeDetails.cheque; //new
                this.totalDD = this.totalDD + this.incomeDetails.demandDraft; //new
                this.totalPaymentTerminal =
                    this.totalPaymentTerminal +
                    this.incomeDetails.paymentTerminal; //new
                this.totalUPI = this.totalUPI + this.incomeDetails.upi;
                this.totalBilltoroom =
                    this.totalBilltoroom + this.incomeDetails.billToRoom; //new
                this.totalMultimode =
                    this.totalMultimode + this.incomeDetails.multiMode; //new
                this.totalCredit = this.totalCredit + this.incomeDetails.credit;
            }
        }
        this.totaloverall =
            this.totalCard +
            this.totalCash +
            this.totalBank +
            this.totalPrePaid +
            this.totalWallet +
            this.totalCheque +
            this.totalDD +
            this.totalPaymentTerminal +
            this.totalUPI +
            this.totalBilltoroom +
            this.totalMultimode +
            this.totalCredit;

        if (this.totalCard > 0) {
            this.show_exp_card = true;
            this.exp_percentCard = this.totalCard / this.totaloverall;
            this.totalCard = Math.round(this.totalCard * 100) / 100;
            this.cardTitle = String(this.totalCard);
            this.check_any_exp = true;
        }
        if (this.totalCash > 0) {
            this.show_exp_cash = true;
            this.exp_percentCash = this.totalCash / this.totaloverall;
            this.totalCash = Math.round(this.totalCash * 100) / 100;
            this.cashTitle = String(this.totalCash);
            this.check_any_exp = true;
        }
        if (this.totalBank > 0) {
            this.show_exp_bank = true;
            this.exp_percentBank = this.totalBank / this.totaloverall;
            this.totalBank = Math.round(this.totalBank * 100) / 100;
            this.bankTitle = String(this.totalBank);
            this.check_any_exp = true;
        }
        if (this.totalPrePaid > 0) {
            this.show_exp_prepaid = true;
            this.exp_percentPrepaid = this.totalPrePaid / this.totaloverall;
            this.totalPrePaid = Math.round(this.totalPrePaid * 100) / 100;
            this.prepaidTitle = String(this.totalPrePaid);
            this.check_any_exp = true;
        }
        if (this.totalWallet > 0) {
            this.show_exp_wallet = true;
            this.exp_percentWallet = this.totalWallet / this.totaloverall;
            this.totalWallet = Math.round(this.totalWallet * 100) / 100;
            this.walletTitle = String(this.totalWallet);
            this.check_any_exp = true;
        }
        if (this.totalCheque > 0) {
            this.show_exp_cheque = true;
            this.exp_percentCheque = this.totalCheque / this.totaloverall;
            this.totalCheque = Math.round(this.totalCheque * 100) / 100;
            this.chequeTitle = String(this.totalCheque);
            this.check_any_exp = true;
        }
        if (this.totalDD > 0) {
            this.show_exp_dd = true;
            this.exp_percentDD = this.totalDD / this.totaloverall;
            this.totalDD = Math.round(this.totalDD * 100) / 100;
            this.ddTitle = String(this.totalDD);
            this.check_any_exp = true;
        }
        if (this.totalPaymentTerminal > 0) {
            this.show_exp_payment_terminal = true;
            this.inc_percentPayment =
                this.totalPaymentTerminal / this.totaloverall;
            this.totalPaymentTerminal =
                Math.round(this.totalPaymentTerminal * 100) / 100;
            this.paymentTitle = String(this.totalPaymentTerminal);
            this.check_any_exp = true;
        }
        if (this.totalUPI > 0) {
            this.show_exp_UPI = true;
            this.exp_percentUPI = this.totalUPI / this.totaloverall;
            this.totalUPI = Math.round(this.totalUPI * 100) / 100;
            this.upiTitle = String(this.totalUPI);
            this.check_any_exp = true;
        }
        if (this.totalBilltoroom > 0) {
            this.show_exp_billtoroom = true;
            this.exp_percentBill = this.totalBilltoroom / this.totaloverall;
            this.totalBilltoroom = Math.round(this.totalBilltoroom * 100) / 100;
            this.billTitle = String(this.totalBilltoroom);
            this.check_any_exp = true;
        }
        if (this.totalMultimode > 0) {
            this.show_exp_multi_payment = true;
            this.exp_percentMultimode = this.totalMultimode / this.totaloverall;
            this.totalMultimode = Math.round(this.totalMultimode * 100) / 100;
            this.multiModeTitle = String(this.totalMultimode);
            this.check_any_exp = true;
        }
        if (this.totalCredit > 0) {
            this.show_exp_credit = true;
            this.exp_percentCredit = this.totalCredit / this.totaloverall;
            this.totalCredit = Math.round(this.totalCredit * 100) / 100;
            this.creditTitle = String(this.totalCredit);
            this.check_any_exp = true;
        }
    }

    // new new new
    fetchRestData() {
        this.httpClient
            .get(
                `${this.countryConfig.getCoreApiURL()}/api/report/restaurantOrder/propertyId/${
                    this.property.id
                }/dates?startDate=${this.dateValue}&endDate=${
                    this.enddateValue
                }`
            )
            .subscribe((restaurant) => {
                if (restaurant != null && restaurant != undefined) {
                    this.rest_order_data = new Array(restaurant);
                    this.rest_order_data1 = this.rest_order_data[0];
                    this.orderfilter();
                }
            });
    }

    fetchCurrBookingData() {
        this.httpClient
            .get(
                `${this.countryConfig.getCoreApiURL()}/api/report/currentBooking/propertyId/${
                    this.property.id
                }/dates?startDate=${this.dateValue}&endDate=${
                    this.enddateValue
                }`
            )
            .subscribe((currbooking) => {
                if (currbooking != null && currbooking != undefined) {
                    this.curr_booking_data = new Array(currbooking);
                    this.curr_booking_data1 = this.curr_booking_data[0];
                    this.currentBookingFilter();
                }
            });
    }
    fetchAdvBookingData() {
        this.httpClient
            .get(
                `${this.countryConfig.getCoreApiURL()}/api/report/advanceBooking/propertyId/${
                    this.property.id
                }/dates?startDate=${this.dateValue}&endDate=${
                    this.enddateValue
                }`
            )
            .subscribe((advbooking) => {
                if (advbooking != null && advbooking != undefined) {
                    this.adv_booking_data = new Array(advbooking);
                    this.adv_booking_data1 = this.adv_booking_data[0];
                    this.advanceBookingFilter();
                }
            });
    }
    fetchStayBookingData() {
        this.httpClient
            .get(
                `${this.countryConfig.getCoreApiURL()}/api/report/stayoverBooking/propertyId/${
                    this.property.id
                }/dates?startDate=${this.dateValue}&endDate=${
                    this.enddateValue
                }`
            )
            .subscribe((staybooking) => {
                if (staybooking != null && staybooking != undefined) {
                    this.stay_booking_data = new Array(staybooking);
                    this.stay_booking_data1 = this.stay_booking_data[0];
                    this.stayoverBookingFilter();
                }
            });
    }

    triggerBooking() {
        this.selectedSegment = "booking";
        this.triggerCurrentBooking();
    }
    triggerRestaurant() {
        this.selectedSegment = "restaurant";
        this.rest_totalorders = 0;
        this.rest_totaloverall = 0;
        this.show_rest_order = false;
        this.check_any_order = false;
        this.orderfiltervalue = "All";
        if (
            this.rest_order_data1 != null &&
            this.rest_order_data1 != undefined &&
            this.rest_order_data1.length > 0
        ) {
            for (var i = 0; i < this.rest_order_data1.length; i++) {
                this.order_detail = this.rest_order_data1[i];
                this.rest_totalorders =
                    this.rest_totalorders + this.order_detail.noOfOrders;
                this.rest_totaloverall =
                    this.rest_totaloverall + this.order_detail.netAmount;
            }
        }
        if (this.rest_totalorders > 0) {
            this.orderTitle = String(this.rest_totalorders);
            this.show_rest_order = true;
            this.check_any_order = true;
        }
    }

    triggerOrderFilter() {
        switch (this.orderfiltervalue) {
            case "All": {
                this.triggerRestaurant();
                break;
            }
            case this.orderfiltervalue: {
                this.selectedSegment = "restaurant";
                this.rest_totalorders = 0;
                this.rest_totaloverall = 0;
                this.show_rest_order = false;
                this.check_any_order = false;
                if (
                    this.rest_order_data1 != null &&
                    this.rest_order_data1 != undefined &&
                    this.rest_order_data1.length > 0
                ) {
                    for (var i = 0; i < this.rest_order_data1.length; i++) {
                        this.order_detail = this.rest_order_data1[i];
                        if (
                            this.orderfiltervalue ==
                            this.order_detail.restaurantOrderSource
                        ) {
                            this.rest_totalorders =
                                this.rest_totalorders +
                                this.order_detail.noOfOrders;
                            this.rest_totaloverall =
                                this.rest_totaloverall +
                                this.order_detail.netAmount;
                        }
                    }
                }
                if (this.rest_totalorders > 0) {
                    this.orderTitle = String(this.rest_totalorders);
                    this.show_rest_order = true;
                    this.check_any_order = true;
                }
                break;
            }
            default: {
                console.log("ERROR");
                break;
            }
        }
    }
    orderfilter() {
        var orderSource: string[] = new Array(this.rest_order_data1.length);
        if (
            this.rest_order_data1 != null &&
            this.rest_order_data1 != undefined
        ) {
            for (var j = 0; j < this.rest_order_data1.length; j++) {
                this.order_detail = this.rest_order_data1[j];
                orderSource[j] = String(
                    this.order_detail.restaurantOrderSource
                );
            }
        }
        this.rest_orderfiltered = orderSource.filter(
            (element, i) => i === orderSource.indexOf(element)
        );
    }

    triggerCurrentBooking() {
        this.bookingSegment = "current-booking";
        this.currBook_totaloverall = 0;
        this.currBook_totalRooms = 0;
        this.currBook_totalGuests = 0;
        this.curr_bookFiltervalue = "All";
        this.showCurr_any = false;
        this.showCurr_room = false;
        if (
            this.curr_booking_data1 != null &&
            this.curr_booking_data1 != undefined &&
            this.curr_booking_data1.length > 0
        ) {
            for (var i = 0; i < this.curr_booking_data1.length; i++) {
                this.currentBooking_detail = this.curr_booking_data1[i];
                this.currBook_totaloverall =
                    this.currBook_totaloverall +
                    this.currentBooking_detail.netAmount;
                this.currBook_totalGuests =
                    this.currBook_totalGuests +
                    this.currentBooking_detail.noOfGuests;
                this.currBook_totalRooms =
                    this.currBook_totalRooms +
                    this.currentBooking_detail.noOfRooms;
            }
        }

        if (this.currBook_totalRooms > 0) {
            this.showCurr_room = true;
            this.curr_roomTitle = String(this.currBook_totalRooms);
            this.curr_guestTitle = String(this.currBook_totalGuests);
            this.showCurr_any = true;
        }
    }
    currentBookingFilter() {
        var currBookingFilter: string[] = new Array(
            this.curr_booking_data1.length
        );
        if (
            this.curr_booking_data1 != null &&
            this.curr_booking_data1 != undefined
        ) {
            for (var j = 0; j < this.curr_booking_data1.length; j++) {
                this.currentBooking_detail = this.curr_booking_data1[j];
                currBookingFilter[j] = String(
                    this.currentBooking_detail.currentBookingSource
                );
            }
        }
        this.curr_book_filtered = currBookingFilter.filter(
            (element, i) => i === currBookingFilter.indexOf(element)
        );
    }
    triggerCurrBookingFilter() {
        switch (this.curr_bookFiltervalue) {
            case "All": {
                this.triggerCurrentBooking();
                break;
            }
            case this.curr_bookFiltervalue: {
                this.bookingSegment = "current-booking";
                this.currBook_totaloverall = 0;
                this.currBook_totalRooms = 0;
                this.currBook_totalGuests = 0;
                this.showCurr_any = false;
                this.showCurr_room = false;
                if (
                    this.curr_booking_data1 != null &&
                    this.curr_booking_data1 != undefined &&
                    this.curr_booking_data1.length > 0
                ) {
                    for (var i = 0; i < this.curr_booking_data1.length; i++) {
                        this.currentBooking_detail = this.curr_booking_data1[i];
                        if (
                            this.curr_bookFiltervalue ==
                            this.currentBooking_detail.currentBookingSource
                        ) {
                            this.currBook_totaloverall =
                                this.currBook_totaloverall +
                                this.currentBooking_detail.netAmount;
                            this.currBook_totalGuests =
                                this.currBook_totalGuests +
                                this.currentBooking_detail.noOfGuests;
                            this.currBook_totalRooms =
                                this.currBook_totalRooms +
                                this.currentBooking_detail.noOfRooms;
                        }
                    }
                }

                if (this.currBook_totalRooms > 0) {
                    this.showCurr_room = true;
                    this.curr_roomTitle = String(this.currBook_totalRooms);
                    this.curr_guestTitle = String(this.currBook_totalGuests);
                    this.showCurr_any = true;
                }
                break;
            }
            default: {
                console.log("ERROR");
                break;
            }
        }
    }
    triggerAdvanceBooking() {
        this.bookingSegment = "advance-booking";
        this.advBook_totaloverall = 0;
        this.advBook_totalRooms = 0;
        this.advBook_totalGuests = 0;
        this.showAdv_any = false;
        this.adv_bookFiltervalue = "All";
        this.showAdv_room = false;
        if (
            this.adv_booking_data1 != null &&
            this.adv_booking_data1 != undefined &&
            this.adv_booking_data1.length > 0
        ) {
            for (var i = 0; i < this.adv_booking_data1.length; i++) {
                this.advanceBooking_detail = this.adv_booking_data1[i];
                this.advBook_totaloverall =
                    this.advBook_totaloverall +
                    this.advanceBooking_detail.netAmount;
                this.advBook_totalGuests =
                    this.advBook_totalGuests +
                    this.advanceBooking_detail.noOfGuests;
                this.advBook_totalRooms =
                    this.advBook_totalRooms +
                    this.advanceBooking_detail.noOfRooms;
            }
        }

        if (this.advBook_totalRooms > 0) {
            this.showAdv_room = true;
            this.adv_roomTitle = String(this.advBook_totalRooms);
            this.adv_guestTitle = String(this.advBook_totalGuests);
            this.showAdv_any = true;
        }
    }
    triggerAdvBookingFilter() {
        switch (this.adv_bookFiltervalue) {
            case "All": {
                this.triggerAdvanceBooking();
                break;
            }
            case this.adv_bookFiltervalue: {
                this.bookingSegment = "advance-booking";
                this.advBook_totaloverall = 0;
                this.advBook_totalRooms = 0;
                this.advBook_totalGuests = 0;
                this.showAdv_any = false;
                this.showAdv_room = false;
                if (
                    this.adv_booking_data1 != null &&
                    this.adv_booking_data1 != undefined &&
                    this.adv_booking_data1.length > 0
                ) {
                    for (var i = 0; i < this.adv_booking_data1.length; i++) {
                        this.advanceBooking_detail = this.adv_booking_data1[i];
                        if (
                            this.adv_bookFiltervalue ==
                            this.advanceBooking_detail.advanceBookingSource
                        ) {
                            this.advBook_totaloverall =
                                this.advBook_totaloverall +
                                this.advanceBooking_detail.netAmount;
                            this.advBook_totalGuests =
                                this.advBook_totalGuests +
                                this.advanceBooking_detail.noOfGuests;
                            this.advBook_totalRooms =
                                this.advBook_totalRooms +
                                this.advanceBooking_detail.noOfRooms;
                        }
                    }
                }

                if (this.advBook_totalRooms > 0) {
                    this.showAdv_room = true;
                    this.adv_roomTitle = String(this.advBook_totalRooms);
                    this.adv_guestTitle = String(this.advBook_totalGuests);
                    this.showAdv_any = true;
                }
                break;
            }
            default: {
                console.log("ERROR");
                break;
            }
        }
    }
    triggerStayOverBooking() {
        this.bookingSegment = "stayover-booking";
        this.stayBook_totaloverall = 0;
        this.stayBook_totalRooms = 0;
        this.stayBook_totalGuests = 0;
        this.showStay_any = false;
        this.showStay_room = false;
        this.stay_bookFiltervalue = "All";
        if (
            this.stay_booking_data1 != null &&
            this.stay_booking_data1 != undefined &&
            this.stay_booking_data1.length > 0
        ) {
            for (var i = 0; i < this.stay_booking_data1.length; i++) {
                this.stayBooking_detail = this.stay_booking_data1[i];
                this.stayBook_totaloverall =
                    this.stayBook_totaloverall +
                    this.stayBooking_detail.netAmount;
                this.stayBook_totalGuests =
                    this.stayBook_totalGuests +
                    this.stayBooking_detail.noOfGuests;
                this.stayBook_totalRooms =
                    this.stayBook_totalRooms +
                    this.stayBooking_detail.noOfRooms;
            }
        }

        if (this.stayBook_totalRooms > 0) {
            this.showStay_room = true;
            this.stay_roomTitle = String(this.stayBook_totalRooms);
            this.stay_guestTitle = String(this.stayBook_totalGuests);
            this.showStay_any = true;
        }
    }
    triggerStayBookingFilter() {
        switch (this.stay_bookFiltervalue) {
            case "All": {
                this.triggerStayOverBooking();
                break;
            }
            case this.stay_bookFiltervalue: {
                this.bookingSegment = "stayover-booking";
                this.stayBook_totaloverall = 0;
                this.stayBook_totalRooms = 0;
                this.stayBook_totalGuests = 0;
                this.showStay_any = false;
                this.showStay_room = false;
                if (
                    this.stay_booking_data1 != null &&
                    this.stay_booking_data1 != undefined &&
                    this.stay_booking_data1.length > 0
                ) {
                    for (var i = 0; i < this.stay_booking_data1.length; i++) {
                        this.stayBooking_detail = this.stay_booking_data1[i];
                        if (
                            this.stay_bookFiltervalue ==
                            this.stayBooking_detail.externalSite
                        ) {
                            this.stayBook_totaloverall =
                                this.stayBook_totaloverall +
                                this.stayBooking_detail.netAmount;
                            this.stayBook_totalGuests =
                                this.stayBook_totalGuests +
                                this.stayBooking_detail.noOfGuests;
                            this.stayBook_totalRooms =
                                this.stayBook_totalRooms +
                                this.stayBooking_detail.noOfRooms;
                        }
                    }
                }

                if (this.stayBook_totalRooms > 0) {
                    this.showStay_room = true;
                    this.stay_roomTitle = String(this.stayBook_totalRooms);
                    this.stay_guestTitle = String(this.stayBook_totalGuests);
                    this.showStay_any = true;
                }
                break;
            }
            default: {
                console.log("ERROR");
                break;
            }
        }
    }
    advanceBookingFilter() {
        var advBookingFilter: string[] = new Array(
            this.adv_booking_data1.length
        );
        if (
            this.adv_booking_data1 != null &&
            this.adv_booking_data1 != undefined
        ) {
            for (var j = 0; j < this.adv_booking_data1.length; j++) {
                this.advanceBooking_detail = this.adv_booking_data1[j];
                advBookingFilter[j] = String(
                    this.advanceBooking_detail.advanceBookingSource
                );
            }
        }
        this.adv_book_filtered = advBookingFilter.filter(
            (element, i) => i === advBookingFilter.indexOf(element)
        );
    }
    stayoverBookingFilter() {
        var stayBookingFilter: string[] = new Array(
            this.stay_booking_data1.length
        );
        if (
            this.stay_booking_data1 != null &&
            this.stay_booking_data1 != undefined
        ) {
            for (var j = 0; j < this.stay_booking_data1.length; j++) {
                this.stayBooking_detail = this.stay_booking_data1[j];
                stayBookingFilter[j] = String(
                    this.stayBooking_detail.externalSite
                );
            }
        }
        this.stay_book_filtered = stayBookingFilter.filter(
            (element, i) => i === stayBookingFilter.indexOf(element)
        );
    }
    /// newnewnew

    confirm() {
        this.datetime.confirm(true);
    }

    reset() {
        this.datetime.reset();
    }
    confirm1() {
        this.datetime1.confirm(true);
    }

    reset1() {
        this.datetime1.reset();
    }
    formatDate(value: string) {
        return format(parseISO(value), "yyyy-MM-dd");
    }

    segmentChanged(event: any) {
        this.selectedSegment = event.target.value;
    }
    triggerBusiness() {
        var inc_businessservices: string[] = new Array(this.inc_data1.length);
        if (this.inc_data1 != null && this.inc_data1 != undefined) {
            for (var j = 0; j < this.inc_data1.length; j++) {
                this.incomeDetails = this.inc_data1[j];
                inc_businessservices[j] = String(
                    this.incomeDetails.businessservice
                );
            }
        }
        this.inc_businessservicesfiltered = inc_businessservices.filter(
            (element, i) => i === inc_businessservices.indexOf(element)
        );
    }
    triggerExpenseName() {
        var exp_expensename: string[] = new Array(this.exp_data1.length);
        if (this.exp_data1 != null && this.exp_data1 != undefined) {
            for (var j = 0; j < this.exp_data1.length; j++) {
                this.incomeDetails = this.exp_data1[j];
                exp_expensename[j] = String(this.incomeDetails.expenseName);
            }
        }
        this.exp_expenseNamefiltered = exp_expensename.filter(
            (element, i) => i === exp_expensename.indexOf(element)
        );
    }
    incomefilter() {
        switch (this.incomefiltervalue) {
            case "All": {
                this.submitData();
                break;
            }
            case this.incomefiltervalue: {
                this.totalCard = 0;
                this.totalCash = 0;
                this.totalBank = 0;
                this.totalPrePaid = 0;
                this.totalWallet = 0;
                this.totalCheque = 0;
                this.totalDD = 0;
                this.totalPaymentTerminal = 0;
                this.totalUPI = 0;
                this.totalBilltoroom = 0;
                this.totalMultimode = 0;
                this.totalCredit = 0;
                this.show_inc_card = false;
                this.show_inc_cash = false;
                this.show_inc_bank = false;
                this.show_inc_prepaid = false;
                this.show_inc_wallet = false;
                this.show_inc_cheque = false;
                this.show_inc_dd = false;
                this.show_inc_payment_terminal = false;
                this.show_inc_UPI = false;
                this.show_inc_billtoroom = false;
                this.show_inc_multi_payment = false;
                this.show_inc_credit = false;
                this.check_any_inc = false;
                this.selectedSegment = "income";
                if (
                    this.inc_data1 != null &&
                    this.inc_data1 != undefined &&
                    this.inc_data1.length > 0
                ) {
                    for (var i = 0; i < this.inc_data1.length; i++) {
                        this.incomeDetails = this.inc_data1[i];
                        if (
                            this.incomeDetails.businessservice ==
                            this.incomefiltervalue
                        ) {
                            this.totalCard =
                                this.totalCard + this.incomeDetails.card; //new
                            this.totalCash =
                                this.totalCash + this.incomeDetails.cash;
                            this.totalBank =
                                this.totalBank +
                                this.incomeDetails.bankTransfer; //new
                            this.totalPrePaid =
                                this.totalPrePaid + this.incomeDetails.prePaid; //new
                            this.totalWallet =
                                this.totalWallet + this.incomeDetails.wallet; //new
                            this.totalCheque =
                                this.totalCheque + this.incomeDetails.cheque; //new
                            this.totalDD =
                                this.totalDD + this.incomeDetails.demandDraft; //new
                            this.totalPaymentTerminal =
                                this.totalPaymentTerminal +
                                this.incomeDetails.paymentTerminal; //new
                            this.totalUPI =
                                this.totalUPI + this.incomeDetails.upi;
                            this.totalBilltoroom =
                                this.totalBilltoroom +
                                this.incomeDetails.billToRoom; //new
                            this.totalMultimode =
                                this.totalMultimode +
                                this.incomeDetails.multiMode; //new
                            this.totalCredit =
                                this.totalCredit + this.incomeDetails.credit;
                        }
                    }
                }
                this.totaloverall =
                    this.totalCard +
                    this.totalCash +
                    this.totalBank +
                    this.totalPrePaid +
                    this.totalWallet +
                    this.totalCheque +
                    this.totalDD +
                    this.totalPaymentTerminal +
                    this.totalUPI +
                    this.totalBilltoroom +
                    this.totalMultimode +
                    this.totalCredit;

                if (this.totalCard > 0) {
                    this.show_inc_card = true;
                    this.inc_percentCard = this.totalCard / this.totaloverall;
                    this.cardTitle = String(this.totalCard);
                    this.check_any_inc = true;
                }
                if (this.totalCash > 0) {
                    this.show_inc_cash = true;
                    this.inc_percentCash = this.totalCash / this.totaloverall;
                    this.cashTitle = String(this.totalCash);
                    this.check_any_inc = true;
                }
                if (this.totalBank > 0) {
                    this.show_inc_bank = true;
                    this.inc_percentBank = this.totalBank / this.totaloverall;
                    this.bankTitle = String(this.totalBank);
                    this.check_any_inc = true;
                }
                if (this.totalPrePaid > 0) {
                    this.show_inc_prepaid = true;
                    this.inc_percentPrepaid =
                        this.totalPrePaid / this.totaloverall;
                    this.prepaidTitle = String(this.totalPrePaid);
                    this.check_any_inc = true;
                }
                if (this.totalWallet > 0) {
                    this.show_inc_wallet = true;
                    this.inc_percentWallet =
                        this.totalWallet / this.totaloverall;
                    this.walletTitle = String(this.totalWallet);
                    this.check_any_inc = true;
                }
                if (this.totalCheque > 0) {
                    this.show_inc_cheque = true;
                    this.inc_percentCheque =
                        this.totalCheque / this.totaloverall;
                    this.chequeTitle = String(this.totalCheque);
                    this.check_any_inc = true;
                }
                if (this.totalDD > 0) {
                    this.show_inc_dd = true;
                    this.inc_percentDD = this.totalDD / this.totaloverall;
                    this.ddTitle = String(this.totalDD);
                    this.check_any_inc = true;
                }
                if (this.totalPaymentTerminal > 0) {
                    this.show_inc_payment_terminal = true;
                    this.inc_percentPayment =
                        this.totalPaymentTerminal / this.totaloverall;
                    this.paymentTitle = String(this.totalPaymentTerminal);
                    this.check_any_inc = true;
                }
                if (this.totalUPI > 0) {
                    this.show_inc_UPI = true;
                    this.inc_percentUPI = this.totalUPI / this.totaloverall;
                    this.upiTitle = String(this.totalUPI);
                    this.check_any_inc = true;
                }
                if (this.totalBilltoroom > 0) {
                    this.show_inc_billtoroom = true;
                    this.inc_percentBill =
                        this.totalBilltoroom / this.totaloverall;
                    this.billTitle = String(this.totalBilltoroom);
                    this.check_any_inc = true;
                }
                if (this.totalMultimode > 0) {
                    this.show_inc_multi_payment = true;
                    this.inc_percentMultimode =
                        this.totalMultimode / this.totaloverall;
                    this.multiModeTitle = String(this.totalMultimode);
                    this.check_any_inc = true;
                }
                if (this.totalCredit > 0) {
                    this.show_inc_credit = true;
                    this.inc_percentCredit =
                        this.totalCredit / this.totaloverall;
                    this.creditTitle = String(this.totalCredit);
                    this.check_any_inc = true;
                }
                this.selectedSegment = "income";

                break;
            }
            default: {
                console.log("ERROR");
                break;
            }
        }
    }

    expensefilter() {
        switch (this.expensefiltervalue) {
            case "All": {
                this.triggerExp();

                break;
            }

            case this.expensefiltervalue: {
                this.totalCard = 0;
                this.totalCash = 0;
                this.totalBank = 0;
                this.totalPrePaid = 0;
                this.totalWallet = 0;
                this.totalCheque = 0;
                this.totalDD = 0;
                this.totalPaymentTerminal = 0;
                this.totalUPI = 0;
                this.totalBilltoroom = 0;
                this.totalMultimode = 0;
                this.totalCredit = 0;
                this.selectedSegment = "expense";
                this.check_any_exp = false;
                this.show_exp_card = false;
                this.show_exp_cash = false;
                this.show_exp_bank = false;
                this.show_exp_prepaid = false;
                this.show_exp_wallet = false;
                this.show_exp_cheque = false;
                this.show_exp_dd = false;
                this.show_exp_payment_terminal = false;
                this.show_exp_UPI = false;
                this.show_exp_billtoroom = false;
                this.show_exp_multi_payment = false;
                this.show_exp_credit = false;
                if (
                    this.exp_data1 != null &&
                    this.exp_data1 != undefined &&
                    this.exp_data1.length > 0
                ) {
                    for (var i = 0; i < this.exp_data1.length; i++) {
                        this.incomeDetails = this.exp_data1[i];
                        if (
                            this.expensefiltervalue ==
                            this.incomeDetails.expenseName
                        ) {
                            this.totalCard =
                                this.totalCard + this.incomeDetails.card; //new
                            this.totalCash =
                                this.totalCash + this.incomeDetails.cash;
                            this.totalBank =
                                this.totalBank +
                                this.incomeDetails.bankTransfer; //new
                            this.totalPrePaid =
                                this.totalPrePaid + this.incomeDetails.prePaid; //new
                            this.totalWallet =
                                this.totalWallet + this.incomeDetails.wallet; //new
                            this.totalCheque =
                                this.totalCheque + this.incomeDetails.cheque; //new
                            this.totalDD =
                                this.totalDD + this.incomeDetails.demandDraft; //new
                            this.totalPaymentTerminal =
                                this.totalPaymentTerminal +
                                this.incomeDetails.paymentTerminal; //new
                            this.totalUPI =
                                this.totalUPI + this.incomeDetails.upi;
                            this.totalBilltoroom =
                                this.totalBilltoroom +
                                this.incomeDetails.billToRoom; //new
                            this.totalMultimode =
                                this.totalMultimode +
                                this.incomeDetails.multiMode; //new
                            this.totalCredit =
                                this.totalCredit + this.incomeDetails.credit;
                        }
                    }
                }
                this.totaloverall =
                    this.totalCard +
                    this.totalCash +
                    this.totalBank +
                    this.totalPrePaid +
                    this.totalWallet +
                    this.totalCheque +
                    this.totalDD +
                    this.totalPaymentTerminal +
                    this.totalUPI +
                    this.totalBilltoroom +
                    this.totalMultimode +
                    this.totalCredit;

                if (this.totalCard > 0) {
                    this.show_exp_card = true;
                    this.exp_percentCard = this.totalCard / this.totaloverall;
                    this.cardTitle = String(this.totalCard);
                    this.check_any_exp = true;
                }
                if (this.totalCash > 0) {
                    this.show_exp_cash = true;
                    this.exp_percentCash = this.totalCash / this.totaloverall;
                    this.cashTitle = String(this.totalCash);
                    this.check_any_exp = true;
                }
                if (this.totalBank > 0) {
                    this.show_exp_bank = true;
                    this.exp_percentBank = this.totalBank / this.totaloverall;
                    this.bankTitle = String(this.totalBank);
                    this.check_any_exp = true;
                }
                if (this.totalPrePaid > 0) {
                    this.show_exp_prepaid = true;
                    this.exp_percentPrepaid =
                        this.totalPrePaid / this.totaloverall;
                    this.prepaidTitle = String(this.totalPrePaid);
                    this.check_any_exp = true;
                }
                if (this.totalWallet > 0) {
                    this.show_exp_wallet = true;
                    this.exp_percentWallet =
                        this.totalWallet / this.totaloverall;
                    this.walletTitle = String(this.totalWallet);
                    this.check_any_exp = true;
                }
                if (this.totalCheque > 0) {
                    this.show_exp_cheque = true;
                    this.exp_percentCheque =
                        this.totalCheque / this.totaloverall;
                    this.chequeTitle = String(this.totalCheque);
                    this.check_any_exp = true;
                }
                if (this.totalDD > 0) {
                    this.show_exp_dd = true;
                    this.exp_percentDD = this.totalDD / this.totaloverall;
                    this.ddTitle = String(this.totalDD);
                    this.check_any_exp = true;
                }
                if (this.totalPaymentTerminal > 0) {
                    this.show_exp_payment_terminal = true;
                    this.inc_percentPayment =
                        this.totalPaymentTerminal / this.totaloverall;
                    this.paymentTitle = String(this.totalPaymentTerminal);
                    this.check_any_exp = true;
                }
                if (this.totalUPI > 0) {
                    this.show_exp_UPI = true;
                    this.exp_percentUPI = this.totalUPI / this.totaloverall;
                    this.upiTitle = String(this.totalUPI);
                    this.check_any_exp = true;
                }
                if (this.totalBilltoroom > 0) {
                    this.show_exp_billtoroom = true;
                    this.exp_percentBill =
                        this.totalBilltoroom / this.totaloverall;
                    this.billTitle = String(this.totalBilltoroom);
                    this.check_any_exp = true;
                }
                if (this.totalMultimode > 0) {
                    this.show_exp_multi_payment = true;
                    this.exp_percentMultimode =
                        this.totalMultimode / this.totaloverall;
                    this.multiModeTitle = String(this.totalMultimode);
                    this.check_any_exp = true;
                }
                if (this.totalCredit > 0) {
                    this.show_exp_credit = true;
                    this.exp_percentCredit =
                        this.totalCredit / this.totaloverall;
                    this.creditTitle = String(this.totalCredit);
                    this.check_any_exp = true;
                }
                break;
            }
            default: {
                console.log("ERROR");
                break;
            }
        }
    }
}
