import { PropertyService } from "./../../../service/property/property.service";
import { AvailabilityService } from "src/app/service/AvailabilityService/availability.service";

import { Logger } from "../../../service/logger.service";
import {
    Component,
    OnInit,
    Renderer2,
    Input,
    ChangeDetectorRef,
    ViewChild, ElementRef, AfterViewInit
} from "@angular/core";
import {
    NavController,
    LoadingController,
    AlertController,
} from "@ionic/angular";
import { PopoverController } from "@ionic/angular";
import { BookingService } from "../../../../app/service/manage-booking/booking-service.service";
import { TokenStorage } from "./../../../token.storage";
import { Booking } from "../../../model/manage-booking/Booking/Booking";
import { ToastController } from "@ionic/angular";
import { NavigationExtras, Router } from "@angular/router";
import { ActionSheetController } from "@ionic/angular";
import { HttpErrorResponse } from "@angular/common/http";
import { ModalController } from "@ionic/angular";
import { CheckRoomtypeComponent } from "./../../../component/booking-list/check-roomtype/check-roomtype.component";
import { DateService } from "../../../service/DateService/date-service.service";
import { DatePipe } from "@angular/common";
import { Host } from "src/app/model/manage-booking/Host/Host";
import { CheckedInDialogComponent } from "../checked-in-dialog/checked-in-dialog.component";
import { CheckoutDialogComponent } from "../checkout-dialog/checkout-dialog.component";
import { RatesAndAvailability } from "src/app/model/manage-booking/rateandavailability/rateandavailability";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Room } from "src/app/model/room";
import { IonRouterOutlet } from "@ionic/angular";

import { ActionBookingMenuComponent } from "../action-booking-menu/action-booking-menu.component";
import { Property } from "src/app/model/property/Property";
import { CheckInGuestInfo } from "src/app/model/check-In/guestCheckInInfo";
export interface ExternalBookingSites {
    value: string;
    viewValue: string;
}

@Component({
    selector: "app-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {

    
    externalBookingSites: ExternalBookingSites[] = [
        {
            value: "Fit Frequent Individual Traveller",
            viewValue: "Fit Frequent Individual Traveller",
        },
        { value: "Walkin", viewValue: "Walk In" },
        { value: "Corporate", viewValue: "Corporate" },
        { value: "Agoda", viewValue: "Agoda" },
        { value: "AirBnB", viewValue: "AirBnB" },
        { value: "BookABach", viewValue: "BookABach" },
        { value: "Booking.com", viewValue: "Booking.com" },
        { value: "goibibo", viewValue: "goibibo" },
        { value: "Expedia", viewValue: "Expedia" },
        { value: "Google", viewValue: "Google" },
        { value: "Homes&Away", viewValue: "Homes&Away" },
        { value: "MakeMyTrip", viewValue: "MakeMyTrip" },
        { value: "OYO", viewValue: "OYO" },
        { value: "WebSite", viewValue: "WebSite" },
        { value: "Bookone Local", viewValue: "Bookone Local" },
        { value: "The Hotel Mate", viewValue: "The Hotel Mate" },
        { value: "Others", viewValue: "Others" },
    ];


    bookings: any;
    checkInInfo: CheckInGuestInfo[] = [];
    checkOutInfo: Booking[] = [];
    inHouseBooking: Booking[] = [];
    futureBookings: Booking[] = [];
    bookingFilter: any;
    bookingsId: Booking[] = [];
    bookingURLOB: Booking;
    bookingsSearchObject: Booking[] = [];
    isViewDetailClick: any = false;
    isProgressing: boolean;
    searchQuery: string = "";

    host: Host;

    ratesAndAvailability: RatesAndAvailability = {
        id: 0,
        date: "",
        noOfAvailable: 0,
        noOfBooked: 0,
        noOfOnHold: 0,
        price: 0,
        propertyId: 0,
        propertyName: "",
        roomId: 0,
        roomName: "",
        totalNoRooms: 0,
        status: "",
        restriction: "",
        roomRatePlans: [],
        stopSellOBE: false,
        stopSellOTA: false,
    };

    @Input() listStatus: string;

    selectedIndex: number;
    isToggle: boolean = false;
    bookingSearchSelection: string = "rb";
    roomNumberList: any[];
    ratesAndAvailabilities: any[];

    p: number = 1;
    rooms: Room[];
    onFilterForm: FormGroup;

    externalSite: FormControl = new FormControl();
    BookingStatusControll: FormControl = new FormControl();
    roomType: FormControl = new FormControl();
    bookingDateControll: FormControl = new FormControl();
    CheckedInDateControll: FormControl = new FormControl();
    CheckedOutDateControll: FormControl = new FormControl();
    searchByUserNameControl: FormControl = new FormControl();

    roomName: string = "All";
    BookingStatus: string = "All";
    sourceOfBooking: string = "All";

    BookingDate: string;
    CheckedInDate: string;
    CheckedOutDate: string;
    isFilterSection: boolean = false;

    onFindBookingForm: FormGroup;
    fromDateString: string;
    firstNameString: string;
    mobileString: string;
    lastNameString: string;
    emailString: string;
    externalBookingId: string;
    checkinSequenceNumber: string;
    toDateString: string;
    currentDay: string;
    currentMonth: string;

    toMinDate: string;
    toMaxDate: string;
    filterBooking: Booking;

    propertyReservationNumberFirstPart: string;
    reservationNumber: number;
    property: Property;

    filterName: string;

    constructor(
        public renderer: Renderer2,
        public availabilityService: AvailabilityService,
        private alertCtrl: AlertController,
        public datepipe: DatePipe,
        private routerOutlet: IonRouterOutlet,
        public navCtrl: NavController,
        private changeDetectorRefs: ChangeDetectorRef,
        private dateService: DateService,
        private propertyService: PropertyService,
        private formBuilder: FormBuilder,
        private modalController: ModalController,
        private bookingService: BookingService,
        public token: TokenStorage,
        private router: Router,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private actionSheetController: ActionSheetController,
        public popoverController: PopoverController
    ) {
        this.host = new Host();
        this.property = new Property();
        this.clearData();

        this.onFindBookingForm = this.formBuilder.group({
            FilterbySearch: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            bookingFromDate: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            bookingToDate: ["", Validators.compose([Validators.nullValidator])],
            firstName: ["", Validators.compose([Validators.nullValidator])],
            lastName: ["", Validators.compose([Validators.nullValidator])],
            emailFilter: ["", Validators.compose([Validators.nullValidator])],
            mobileFilter: ["", Validators.compose([Validators.nullValidator])],
            externalBookingIdFilter: ["", Validators.compose([Validators.nullValidator])],
            checkinSequenceNumber: ["", Validators.compose([Validators.nullValidator])],
            // PropertyReservationNumberFirstPart: [
            //     "",
            //     Validators.compose([Validators.nullValidator]),
            // ],
            PropertyReservationNumber: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
        });

        this.onFilterForm = this.formBuilder.group({
            roomType: ["", Validators.compose([Validators.nullValidator])],
            BookingStatusControll: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            externalSite: ["", Validators.compose([Validators.nullValidator])],
            bookingDateControll: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            CheckedInDateControll: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            CheckedOutDateControll: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            // ChildrenNo: ["", Validators.compose([Validators.nullValidator])],
        });
    }

    ngOnInit() {
        this.property = this.token.getProperty();

        if (
            this.property.shortName != null &&
            this.property.shortName != undefined
        ) {
            this.propertyReservationNumberFirstPart =
                this.property.shortName + "-B-";
        }
        this.bookingService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                //  Logger.log('Host'+JSON.stringify(resp));
                this.host.businessEmail = resp.body.username;
                this.host.businessName = resp.body.businessName;
            });

        this.clearData();

        this.getRoomDetailByPropertyId(this.token.getProperty().id);

        if (
            this.token.getFindBookingData() != null &&
            this.token.getFindBookingData() != undefined
        ) {
            this.bookingSearchSelection = "find";

            this.bookings = [];
            this.bookingsId = [];
            this.bookingsSearchObject = [];
            this.filterBooking = new Booking();
            this.filterBooking = this.token.getFindBookingData();

            if (
                this.filterBooking.propertyReservationNumber != null &&
                this.filterBooking.propertyReservationNumber != null
            ) {
                this.reservationNumber = this.returnOrderidNumber(
                    this.filterBooking.propertyReservationNumber
                );
            }
            this.firstNameString = this.filterBooking.firstName;
            this.lastNameString = this.filterBooking.lastName;
            this.emailString = this.filterBooking.email;
            this.mobileString = this.filterBooking.mobile;

            this.fromDateString = this.filterBooking.fromDate;
            this.toDateString = this.filterBooking.toDate;
            this.externalBookingId = this.filterBooking.externalBookingId;

            this.bookingService.findBookings(this.filterBooking).subscribe(
                (data) => {
                    this.bookings = data.body;
                    this.bookingsId = data.body;
                    this.bookingsSearchObject = data.body;
                    this.isProgressing = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.isProgressing = false;
                }
            );
        } else if (
            this.token.getAllBookingData() != null &&
            this.token.getAllBookingData() != undefined
        ) {
            this.bookingSearchSelection = "allb";

            this.host = this.token.getAllBookingData();

            this.bookingChanged();
        } else {
            this.bookingChanged();
        }

        this.token.claerBookingDetal();
    }

   

     

    async actionMenuModal(booking: Booking) {
        const modal = await this.modalController.create({
            component: ActionBookingMenuComponent,
            cssClass: "my-custom-class",
            swipeToClose: true,
            componentProps: {
                booking: booking,
            },
            presentingElement: this.routerOutlet.nativeEl,
        });

        modal.onDidDismiss().then((data) => {
            // console.log("list  modal dismissed", data);
            // if (data != undefined && data != null && data.data === "done") {
            //     this.bookingChanged();
            // } else if (
            //     data != undefined &&
            //     data != null &&
            //     data.data === "checkout"
            // ) {
            //    // this.getRatesAndAvailability(booking, true);
            //     this.bookingChanged();
            // }
            this.bookingChanged();
        });
        return await modal.present();
    }

    getRoomDetailByPropertyId(PropertyId: number) {
        this.rooms = [];
        this.propertyService.getRoomDetailsByPropertyId(PropertyId).subscribe(
            (data) => {
                this.rooms = data;

                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                //    this.loader = false;
            }
        );
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
        this.onFindBookingForm.reset();
    }

    //   getBookingData()
    //   {
    //     if(this.bookingSearchSelection ==='rb')
    //     {
    //         this.loadData();
    //     }
    //     else  if(this.bookingSearchSelection ==='allb')
    //     {
    //         this. getAllBookings();
    //     }
    //   }

    bookingChanged() {
        if (this.bookingSearchSelection === "rb") {
            this.token.clearFindBookingData();
            this.token.clearAllBookingData();
            this.loadData();
        } else if (this.bookingSearchSelection === "allb") {
            this.token.clearFindBookingData();
            this.getAllBookings();
        } else if (this.bookingSearchSelection === "tab") {
            this.token.clearFindBookingData();
            this.token.clearAllBookingData();
            this.getGuestsCheckingInToday();
        } else if (this.bookingSearchSelection === "tdb") {
            this.token.clearFindBookingData();
            this.token.clearAllBookingData();
            this.getGuestsCheckingOutToday();
        }else if (this.bookingSearchSelection === "ihb") {
            this.token.clearFindBookingData();
            this.token.clearAllBookingData();
            this.getGuestsInHouseToday();
        }else if (this.bookingSearchSelection === "fbb") {
            this.token.clearFindBookingData();
            this.token.clearAllBookingData();
            this.getFutureGuests();
        }else if (this.bookingSearchSelection === "find") {
            this.token.clearAllBookingData();
            this.findBooking();
        }
    }
   

    findBooking() {
        this.isProgressing = true;
        this.bookings = [];
        this.bookingsId = [];
        this.bookingsSearchObject = [];
        this.filterBooking = new Booking();
        this.filterBooking.propertyId = this.token.getProperty().id;
        this.filterBooking.firstName = this.firstNameString;
        this.filterBooking.lastName = this.lastNameString;
        this.filterBooking.email = this.emailString;
        this.filterBooking.mobile = this.mobileString;
        this.filterBooking.externalBookingId = this.externalBookingId;

        if (this.fromDateString != null && this.fromDateString != undefined) {
            this.filterBooking.fromDate =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.fromDateString
                );
        }

        if (this.toDateString != null && this.toDateString != undefined) {
            this.filterBooking.toDate =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.toDateString
                );
        }

        if (
            this.reservationNumber != null &&
            this.reservationNumber != undefined
        ) {
            this.filterBooking.propertyReservationNumber =
                this.propertyReservationNumberFirstPart +
                this.reservationNumber;
        }

        this.bookingService.findBookings(this.filterBooking).subscribe(
            (data) => {
                this.bookings = data.body;
                this.bookingsId = data.body;
                this.bookingsSearchObject = data.body;

                if (
                    this.bookings != null &&
                    this.bookings != undefined &&
                    this.bookings.length > 0
                ) {
                    this.token.saveFindBookingData(this.filterBooking);
                }

                this.isProgressing = false;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.isProgressing = false;
            }
        );
    }

    getAllBookings() {
        this.bookings = [];
        this.bookingsId = [];
        this.bookingsSearchObject = [];

        this.isProgressing = true;
        this.bookingService.getAllBookingsByHost(this.host).subscribe(
            (data) => {
                this.bookings = data.body;
                this.bookingsId = data.body;
                this.bookingsSearchObject = data.body;

                if (
                    this.bookings != null &&
                    this.bookings != undefined &&
                    this.bookings.length > 0
                ) {
                    this.token.saveAllBookingData(this.host);
                }

                this.isProgressing = false;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.isProgressing = false;
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

    loadData() {
        this.bookings = [];
        this.bookingsId = [];
        this.bookingsSearchObject = [];

        if (this.listStatus === "bookingList") {
            this.getDetail();
        } else if (this.listStatus === "recentBooking") {
            this.recentBookingData();
        }
    }

    

    

    clearData() {
        this.bookings = null;
        this.bookingsId = null;
        this.bookingsSearchObject = null;
    }

    dataReset() {
        this.reservationNumber = null;
        this.fromDateString = undefined;
        this.toDateString = undefined;
        this.firstNameString = null;
        this.lastNameString = null;
        this.emailString = null;
        this.mobileString = null;
        this.externalBookingId = null;
      }

    recentBookingData() {
        this.filterName = null;
        this.clearData();
        this.dataReset();
        this.bookings = [];
        this.bookingsId = [];
        this.bookingsSearchObject = [];
        this.token.clearFindBookingData();
        this.token.clearAllBookingData();
        this.loadData();
        this.p = 1;
    }

    getDetail() {
        this.isProgressing = true;
        this.bookings = [];
        this.bookingsId = [];
        this.bookingsSearchObject = [];
        this.bookingService
            .getCurrentAndFutureBookings(+this.token.getPropertyId())
            .subscribe(
                (data) => {
                    this.bookings = data.body;
                    this.bookingsId = data.body;
                    this.bookingsSearchObject = data.body;
                    this.isProgressing = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.isProgressing = false;
                    this.changeDetectorRefs.detectChanges();
                }
            );
    }


    getGuestsCheckingInToday() {
        this.isProgressing = true;
        this.bookingService
          .getGuestChekingInToday(+this.token.getPropertyId())
          .subscribe(
            (data) => {
              this.checkInInfo = data.body;
              this.bookings = data.body;
              if (this.bookings != null && this.bookings != undefined) {
                this.checkInInfo.reverse();
                this.bookings = this.checkInInfo;
                this.isProgressing = false;
              }

            },
            (error) => {
              this.isProgressing = false;
            }
          );
      }

      getGuestsCheckingOutToday() {
        this.isProgressing = true;
        this.bookingService
          .getGuestChekingOutToday(+this.token.getPropertyId())
          .subscribe(
            (data) => {
              this.checkOutInfo = data.body;
              this.bookingFilter = data.body;
    
              if (this.bookings != null && this.bookings != undefined) {
                this.checkOutInfo.reverse();
                this.bookings = this.checkOutInfo;
                this.isProgressing = false;
              }
            },
            (error) => {
              this.isProgressing = false;
            }
          );
      }

      getGuestsInHouseToday() {
        this.isProgressing = true;
        this.bookingService.getGuestInHouseToday(+this.token.getPropertyId()).subscribe(
          (data) => {
            this.inHouseBooking = data.body;
            this.bookingFilter = data.body;
    
            if (this.bookings != null && this.bookings != undefined) {
              this.inHouseBooking.reverse();
              this.bookings = this.inHouseBooking;
              this.isProgressing = false;
            }
          },
          (error) => {
            this.isProgressing = false;
          }
        );
      }

      getFutureGuests() {
        
        this.isProgressing = true;
        this.bookingService
          .getAdvanceBookings(+this.token.getPropertyId(),this.datepipe.transform(
            new Date(),
            "yyyy-MM-dd"
          ))
          .subscribe(
            (data) => {
              this.futureBookings = data.body;
              this.bookingFilter = data.body;
    
              if (this.bookings != null && this.bookings != undefined) {
                this.futureBookings.reverse();
                this.bookings = this.futureBookings;
                this.isProgressing = false;
              }
            },
            (error) => {
              this.isProgressing = false;
            }
          );
      }

    onMobileDail(mobileNumber) {
        Logger.log("mobileNumber" + mobileNumber);
    }

    createBooking() {
        Logger.log("create booking");
        this.navCtrl.navigateForward("booking");
    }

    onCancel(ev: any) {
        //this.getDetail();
        Logger.log("search cancel event");
    }

    getItems(ev: any) {
        const val = ev.target.value;

        console.log("search -- " + val);

        if (val === "") {
            this.bookingChanged();
        } else {
            this.bookings = this.bookingsSearchObject;
            this.bookings = this.bookings.filter((item) => {
                const searchResult =
                    (item.firstName != null &&
                        item.lastName &&
                        (item.firstName + " " + item.lastName)
                            .toLowerCase()
                            .trim()
                            .indexOf(val.trim().toLowerCase().trim()) > -1) ||
                    (item.bookingStatus != null &&
                        item.bookingStatus != undefined &&
                        item.bookingStatus
                            .toLowerCase()
                            .trim()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.roomName != null &&
                        item.roomName
                            .toLowerCase()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.email != null &&
                        item.email
                            .toLowerCase()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.id != null &&
                        String(item.id).indexOf(val.toLowerCase().trim()) >
                            -1) ||
                    (item.propertyReservationNumber != null &&
                        item.propertyReservationNumber != undefined &&
                        this.isNumber(val) === true &&
                        this.returnOrderidNumber(
                            item.propertyReservationNumber
                        ).indexOf(this.returnOrderidNumber(val)) > -1) ||
                    // (item.propertyReservationNumber != null &&
                    //     item.propertyReservationNumber != undefined &&
                    //     this.isNumber(val) === false &&
                    //     item.propertyReservationNumber
                    //         .toLowerCase()
                    //         .trim()
                    //         .indexOf(
                    //             this.returnOrderidNumber(
                    //                 val.toLowerCase().trim()
                    //             )
                    //         ) > -1) ||
                    (item.fromDate != null &&
                        this.dateService
                            .convertMillisecondsToDateFormat(item.fromDate)
                            .indexOf(val.trim()) > -1) ||
                    (item.toDate != null &&
                        this.dateService
                            .convertMillisecondsToDateFormat(item.toDate)
                            .indexOf(val.trim()) > -1);

                return searchResult;
            });
        }

        this.changeDetectorRefs.detectChanges();
    }

    isNumber(value) {
        if (
            parseInt(value) != null &&
            parseInt(value) != undefined &&
            isNaN(value) === false
        ) {
            return true;
        } else {
            return false;
        }
    }

    returnOrderidNumber(bookoneOrderId) {
        var res = bookoneOrderId.replace(/\D/g, "");
        return res;
    }

    clear(event) {}

    isRoomAllocatedInGroupBooking(row) {
        let isRoomAvailable: boolean = false;
        if (row.roomDetails != null && row.roomDetails != undefined) {
            for (let i = 0; i < row.roomDetails.length; i++) {
                if (
                    row.roomDetails[i].roomNumber != null &&
                    row.roomDetails[i].roomNumber != undefined
                ) {
                    isRoomAvailable = true;
                }
            }
        }

        return isRoomAvailable;
    }

    async viewdetail(booking: any) {
        this.actionMenuModal(booking);
    }

    sendConfirmationEmail(row) {
        this.isProgressing = true;
        this.bookingService.sendBookingConfirmation(row.id).subscribe(
            (response) => {
                this.isProgressing = false;
                if (response.status === 200) {
                    if (response.body === true) {
                        this.isProgressing = false;
                        this.presentToast("Booking Confirmation Sent");
                    } else {
                        this.isProgressing = false;
                        // this.openErrorSnackBar('Problem in sending the payment link');
                        this.presentToast(
                            "Problem in sending booking confirmation"
                        );
                    }
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417 || error.status === 500) {
                        this.isProgressing = false;
                        // this.openErrorSnackBar('Paymentlink sent Error');
                        this.presentToast("Booking confirmation sent Error");
                    }
                }
            }
        );
    }

    async checkoutDialog(booking: any) {
        this.isProgressing = true
        const modal = await this.modalController.create({
            component: CheckoutDialogComponent,

            componentProps: {
                booking: booking,
            },
        });
        this.isProgressing = false;
        modal.onDidDismiss().then((data) => {
            console.log("modal dismissed", data);
            if (data.data === "success") {
                this.bookingChanged();
                //this.getRatesAndAvailability(booking, true);
            }
        });
        return await modal.present();
    }

    
  singleDayBooking(row) {
    if (row === null || row === undefined) {
      return false;
    } else if (
      row.fromDate != undefined &&
      row.fromDate != null &&
      row.fromDate != "NaN-NaN-NaN" &&
      row.toDate != null &&
      row.toDate != undefined &&
      row.toDate != "NaN-NaN-NaN" &&
      this.datepipe.transform(row.toDate, "yyyy-MM-dd") ===
        this.datepipe.transform(row.fromDate, "yyyy-MM-dd")
    ) {
      return true;
    } else {
      return false;
    }
  }

    async checkedInDialog(booking: any) {
        const modal = await this.modalController.create({
            component: CheckedInDialogComponent,

            componentProps: {
                booking: booking,
            },
        });
        modal.onDidDismiss().then((data) => {
            console.log("modal dismissed", data);
            if (data.data === "success") {
                this.bookingChanged();
            }
        });
        return await modal.present();
    }

    async voidBooking(row) {
        const loader = await this.loadingCtrl.create({});
        this.bookingService.VoidBooking(row.id).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.presentToast("Booking void successfully.");
                    loader.dismiss();
                    this.bookingChanged();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        loader.dismiss();
                    }
                }
            }
        );
    }

    async noShow(row) {
        const loader = await this.loadingCtrl.create({});

        this.bookingService.noShowBooking(row.id).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.presentToast("successfully completed.");
                    loader.dismiss();
                    this.bookingChanged();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        loader.dismiss();
                    }
                }
            }
        );
    }

    roomRealese(row) {
        this.isProgressing = true;
        row.checkoutTime = new Date();
        this.bookingService.roomRealese(row).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.isProgressing = false;
                    this.presentToast("Room Release Done");
                    this.bookingChanged();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.isProgressing = false;
                        this.presentToast(
                            "CheckOut Error,Please check booking status and outstanding amount in booking details section"
                        );
                    }
                    this.isProgressing = false;
                }
            }
        );
    }

    async roomallocate(row) {
        const modal = await this.modalController.create({
            component: CheckRoomtypeComponent,

            componentProps: {
                booking: row,
            },
        });
        modal.onDidDismiss().then((data) => {
            Logger.log("modal dismissed", data);
            if (data.data === "success") {
                this.bookingChanged();
            }
        });
        return await modal.present();
    }

    checkout(row) {
        this.isProgressing = true;
        row.checkoutTime = new Date().getTime();

        if (
            row.roomDetails != undefined &&
            row.roomDetails != null &&
            row.roomDetails.length > 0
        ) {
            this.roomNumberList = [];
            for (let i = 0; i < row.roomDetails.length; i++) {
                this.roomNumberList.push(row.roomDetails[i].roomNumber);
            }

            row.roomNumbers = this.roomNumberList.toString();
        }

        this.bookingService.checkout(row).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.isProgressing = false;
                    this.presentToast("Guest CheckOut Done");
                    this.bookingChanged();

                    //   let todateString = this.datepipe.transform(row.toDate, 'yyyy-MM-dd');
                    //   let currentDate: Date = new Date();
                    //   let currentDateString = this.datepipe.transform(currentDate, 'yyyy-MM-dd');

                    //  let defference = new Date(todateString).getTime() - new Date(currentDateString).getTime();

                    //   if(defference > 0)
                    //   {
                    //     this.roomRealese(row);
                    //   }

                    this.roomRealese(row);
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.isProgressing = false;
                        this.presentToast(
                            "CheckOut Error,Please check booking status and outstanding amount in booking details section"
                        );
                        this.bookingChanged();
                        this.navCtrl.navigateForward(["checkout-detail"]);
                    }
                    this.isProgressing = false;
                }
            }
        );
    }

    async sendPaymentLink(id: number) {
        const loader = await this.loadingCtrl.create({});

        loader.present();
        this.bookingService.sendPaymentLink(id).subscribe(
            (response) => {
                if (response.status === 200) {
                    if (response.body === true) {
                        this.presentToast("Payment Link Sent");
                        loader.dismiss();
                    } else {
                        this.presentToast(
                            "Problem in sending the payment link"
                        );
                        loader.dismiss();
                    }
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    loader.dismiss();
                    if (error.status === 417 || error.status === 500) {
                        this.presentToast("Paymentlink sent Error");
                    }
                }
            }
        );
    }

    cancelRequest(requestId: number) {
        this.isProgressing = true;
        this.bookingService.cancel(requestId).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.isProgressing = false;
                    this.presentToast(
                        "Booking Cancelled,Please check the expense section."
                    );
                    this.bookingChanged();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.isProgressing = false;
                        this.presentToast(
                            "Cancellation Error,Please check booking status ,only confirmed booking can be cancelled"
                        );
                    }
                    this.isProgressing = false;
                }
            }
        );
    }

    checkIn(row) {
        this.isProgressing = true;
        row.checkinTime = new Date().getTime();
        this.bookingService.checkin(row).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.isProgressing = false;
                    this.presentToast("Guest Check-In Completed.");
                    this.bookingChanged();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.isProgressing = false;
                        this.presentToast(
                            "Please proceed with offline room allocation and update the booking."
                        );
                    }
                    this.isProgressing = false;
                }
            }
        );
    }

    async alertReleaseRoom(haeder: string, booking: any) {
        const alert = await this.alertCtrl.create({
            header: haeder,
            message:
                "Rooms are already allocated, please release the room numbers and perform this operation",

            backdropDismiss: false,
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {
                        Logger.log("Confirm Cancel");
                    },
                },
                {
                    text: "Release Room",
                    handler: () => {
                        this.roomRealese(booking);
                    },
                },
            ],
        });
        await alert.present();
    }

    async alert(haeder: string) {
        const alert = await this.alertCtrl.create({
            header: haeder,
            message: "This Action is disabled for this booking",

            backdropDismiss: false,
            buttons: [
                {
                    text: "Ok",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {
                        Logger.log("Confirm Cancel");
                    },
                },
            ],
        });
        await alert.present();
    }
    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    Reset() {
        this.roomName = "All";
        this.BookingStatus = "All";
        this.sourceOfBooking = "All";
        this.bookingSearchSelection = "allb"
        this.BookingDate = undefined;
        this.CheckedInDate = undefined;
        this.CheckedOutDate = undefined;
        this.isFilterSection = false;
        this.filterByDropdown();
    }

    filterByDropdown() {
        let searchResult;

        if (
            this.sourceOfBooking === "All" &&
            this.roomName === "All" &&
            this.BookingStatus === "All" &&
            this.BookingDate === undefined &&
            this.CheckedInDate === undefined &&
            this.CheckedOutDate === undefined
        ) {
            this.bookings = this.bookingsSearchObject;
            this.changeDetectorRefs.detectChanges();
        } else {
            this.bookings = this.bookingsSearchObject;
            this.bookings = this.bookings.filter((item) => {
                // Logger.log(this.dateService.convertMillisecondsToDateFormat(this.CheckedOutDate)+' === '+this.dateService.convertMillisecondsToDateFormat(item.toTime) );

                searchResult =
                    (this.CheckedInDate === undefined ||
                        (this.isCheckedInOrCheckedOut(item.bookingStatus) ===
                            false &&
                            this.CheckedInDate != undefined &&
                            item.fromTime != "" &&
                            item.fromTime != null &&
                            item.fromTime != undefined &&
                            this.dateService.convertMillisecondsToDateFormat(
                                item.fromTime
                            ) ===
                                this.dateService.convertMillisecondsToDateFormat(
                                    this.CheckedInDate
                                )) ||
                        this.CheckedInDate === undefined ||
                        (this.isCheckedInOrCheckedOut(item.bookingStatus) ===
                            true &&
                            this.CheckedInDate != undefined &&
                            item.checkinTime != "" &&
                            item.checkinTime != null &&
                            item.checkinTime != undefined &&
                            this.dateService.convertMillisecondsToDateFormat(
                                item.checkinTime
                            ) ===
                                this.dateService.convertMillisecondsToDateFormat(
                                    this.CheckedInDate
                                ))) &&
                    (this.CheckedOutDate === undefined ||
                        (item.bookingStatus != "CHECKEDOUT" &&
                            this.CheckedOutDate != undefined &&
                            item.toTime != "" &&
                            item.toTime != null &&
                            item.toTime != undefined &&
                            this.dateService.convertMillisecondsToDateFormat(
                                item.toTime
                            ) ===
                                this.dateService.convertMillisecondsToDateFormat(
                                    this.CheckedOutDate
                                )) ||
                        this.CheckedOutDate === undefined ||
                        (item.bookingStatus == "CHECKEDOUT" &&
                            this.CheckedOutDate != undefined &&
                            item.checkoutTime != "" &&
                            item.checkoutTime != null &&
                            item.checkoutTime != undefined &&
                            this.dateService.convertMillisecondsToDateFormat(
                                item.checkoutTime
                            ) ===
                                this.dateService.convertMillisecondsToDateFormat(
                                    this.CheckedOutDate
                                ))) &&
                    (this.sourceOfBooking === "All" ||
                        (this.sourceOfBooking != "All" &&
                            item.externalSite != null &&
                            item.externalSite != undefined &&
                            item.externalSite.toLowerCase() ===
                                this.sourceOfBooking.toLowerCase())) &&
                    (this.sourceOfBooking === "All" ||
                        (this.sourceOfBooking != "All" &&
                            item.externalSite != null &&
                            item.externalSite != undefined &&
                            item.externalSite.toLowerCase() ===
                                this.sourceOfBooking.toLowerCase())) &&
                    (this.roomName === "All" ||
                        (this.roomName != "All" &&
                            item.roomName != null &&
                            item.roomName != undefined &&
                            item.roomName.toLowerCase() ===
                                this.roomName.toLowerCase())) &&
                    (this.BookingDate === undefined ||
                        (this.BookingDate != undefined &&
                            item.fromDate != null &&
                            item.fromDate != undefined &&
                            this.dateService.convertMillisecondsToDateFormat(
                                item.fromDate
                            ) ===
                                this.dateService.convertMillisecondsToDateFormat(
                                    this.BookingDate
                                )) ||
                        this.BookingDate === undefined ||
                        (this.BookingDate != undefined &&
                            item.toDate != null &&
                            item.toDate != undefined &&
                            this.dateService.convertMillisecondsToDateFormat(
                                item.toDate
                            ) ===
                                this.dateService.convertMillisecondsToDateFormat(
                                    this.BookingDate
                                ))) &&
                    (this.BookingStatus === "All" ||
                        (this.BookingStatus != "All" &&
                            item.bookingStatus != null &&
                            item.bookingStatus != undefined &&
                            item.bookingStatus.toLowerCase() ===
                                this.BookingStatus.toLowerCase()));

                return searchResult;
            });
            this.changeDetectorRefs.detectChanges();
        }
    }

    isCheckedInOrCheckedOut(row) {
        if (
            row.bookingStatus === "CHECKEDOUT" ||
            row.bookingStatus === "CHECKEDIN"
        ) {
            return true;
        } else {
            return false;
        }
    }

    currentBookingTimeCheck(row) {
        if (
          // row.checkoutTime != null &&
          // row.checkoutTime != undefined &&
          row.toTime != null &&
          row.toTime != undefined
        ) {
          let toTimeEXP = this.datepipe.transform(row.toTime, "yyyy-MM-dd h:mm a");
    
          // let toDateSelected = this.datepipe.transform(
          //   row.checkoutTime,
          //   "yyyy-MM-dd h:mm a"
          // );
          let toDateSelected = this.datepipe.transform(
            new Date(),
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
    
  isFutureBooking(row) {
    if (
      row.fromDate != null &&
      row.fromDate != undefined
    ) {
      let fromDate = this.datepipe.transform(row.fromDate, "yyyy-MM-dd");

      let currentDate = this.datepipe.transform(
        new Date(),
        "yyyy-MM-dd"
      );

      let BookingDateOb = new Date(fromDate);
      let currentDateOb = new Date(currentDate);

      if (currentDateOb.getTime() < BookingDateOb.getTime()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
    
  checkBookingStatus(row, status)
  {
    if (!this.isFutureBooking(row) && this.timeCheck(row) === false && row.groupBookingId === null && row.bookingStatus == status)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

    timeCheck(row) {
        if (
          row.bookingStatus != "CHECKEDOUT" &&
          row.bookingStatus != "CANCELLED" &&
          row.bookingStatus != "ENQUIRY" &&
          row.bookingStatus != "NO_SHOW" &&
          row.bookingStatus != "VOID"
        ) {
          return this.currentBookingTimeCheck(row);
        }
        // else if (row.bookingStatus === "CHECKEDOUT") {
        //   return this.checkouttBookingTimeCheck(row);
        // }
        else {
          return false;
        }
      }
}
