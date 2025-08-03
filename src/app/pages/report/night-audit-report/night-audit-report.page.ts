import { BookingService } from "./../../../service/manage-booking/booking-service.service";
import { Booking } from "./../../../model/manage-booking/Booking/Booking";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import {
    ToastController,
    AlertController,
    NavController,
    LoadingController,
    ModalController,
} from "@ionic/angular";
import { AvailabilityService } from "src/app/service/AvailabilityService/availability.service";
import { DateService } from "src/app/service/DateService/date-service.service";
import { TokenStorage } from "src/app/token.storage";
import { Property } from "src/app/model/property/Property";
import { DatePipe } from "@angular/common";
import { PropertyService } from "src/app/service/property/property.service";
import { ActionSheetController } from "@ionic/angular";
import { Address } from "src/app/model/address-checker/Address";

import { Room } from "src/app/model/room";
import { OTAChannelPropertyDTO } from "src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO";
import { PropertiesOnlineTravelAgencies } from "src/app/model/Booking/propertiesOTA";
import { ExternalSiteList } from "src/app/model/Booking/externalSiteList";

@Component({
    selector: "app-night-audit-report",
    templateUrl: "./night-audit-report.page.html",
    styleUrls: ["./night-audit-report.page.scss"],
})
export class NightAuditReportPage implements OnInit {
    onNightAuditForm: FormGroup;
    onFilterForm: FormGroup;

    loader: boolean = false;
    booking: Booking;
    bookings: Booking[] = [];
    bookingFilter: Booking[] = [];

    SearchSelection: string = "0";
    p: number = 1;
    isProgressing: boolean = false;

    propertydetails: OTAChannelPropertyDTO;
    propertyOTADetails: PropertiesOnlineTravelAgencies;
    propertyOTA: PropertiesOnlineTravelAgencies[];
    externalSiteList: ExternalSiteList;

    isCheckedIn: boolean = false;
    isDueAmount: boolean = false;
    isSameDayBooking: boolean = false;
    addCheckoutBooking: boolean = false;

    isRead: boolean = false;

    rooms: Room[];

    roomName: any[] = [];
    BookingStatus: any[] = [];
    sourceOfBooking: any[] = [];
    BookingDate: string;
    CheckedInDate: string;
    CheckedOutDate: string;

    reportfromDateString: string;
    reportToDateString: string;

    property: Property;
    propertyId: number;
    addressProperty: Address;
    currency: string;
    isFilterVisible: boolean = false;
    visibleCards: boolean[] = [];
    isFromModalOpen = false;

    constructor(
        public token: TokenStorage,
        private toastController: ToastController,
        private formBuilder: FormBuilder,
        private router: Router,
        private changeDetectorRefs: ChangeDetectorRef,
        private alertCtrl: AlertController,
        public navCtrl: NavController,
        private bookingService: BookingService,
        public dateService: DateService,
        public datepipe: DatePipe,
        public loadingCtrl: LoadingController,
        private modalController: ModalController,
        private availabilityService: AvailabilityService,
        private propertyService: PropertyService,
        private actionSheetController: ActionSheetController
    ) {
        this.booking = new Booking();
        this.property = new Property();
        this.onNightAuditForm = this.formBuilder.group({
            FromDate: ["", Validators.compose([Validators.required])],
            ShowCheckOut: ["", Validators.compose([Validators.nullValidator])],
        });

        this.onFilterForm = this.formBuilder.group({
            roomType: ["", Validators.compose([Validators.nullValidator])],
            ShowCheckOut: ["", Validators.compose([Validators.nullValidator])],
            externalSite: ["", Validators.compose([Validators.nullValidator])],
            bookingDateControll: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            DueFilter: ["", Validators.compose([Validators.nullValidator])],
            SameDayFilter: ["", Validators.compose([Validators.nullValidator])],
            CheckedINFilter: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
        });

        this.propertyOTADetails = new PropertiesOnlineTravelAgencies();
        this.externalSiteList = new ExternalSiteList();

        this.property = this.token.getProperty();
    }

    ngOnInit() {
        this.getConfiguredPropertyDetailsByPropertyId(
            this.token.getProperty().id
        );
        if (
            this.token.getProperty().localCurrency != null &&
            this.token.getProperty().localCurrency != undefined
        ) {
            this.currency = this.token
                .getProperty()
                .localCurrency.toUpperCase();
        }
    }

    onFromDateChange(event: any) {
        this.booking.fromDate = event.detail.value;
        // console.log('Selected From Date:', this.booking.fromDate);
    }
    navigateToPage() {
        this.navCtrl.navigateForward("/report-dashboard");
    }

    toggleCardVisibility(index: number): void {
        // Toggle the visibility of the card at the given index
        this.visibleCards[index] = !this.visibleCards[index];
    }

    setFromDateOpen(isOpen: boolean) {
        this.isFromModalOpen = isOpen;
    }

    dismissFromDateModal() {
        this.isFromModalOpen = false;
    }

    onSearchDate() {
        this.onSearchReset();
        this.propertyId = this.token.getProperty().id;
        this.property = this.token.getProperty();

        this.reportfromDateString = this.datepipe.transform(
            this.booking.fromDate,
            "yyyy-MM-dd"
        );
        this.nightAudit(this.propertyId, this.reportfromDateString);
    }

    Reset() {
        this.onNightAuditForm.reset();
        this.isRead = false;

        this.isFilterVisible = false;

        this.bookings = [];
        this.bookingFilter = [];
        this.SearchSelection = "0";

        this.roomName = [];
        this.BookingStatus = [];
        this.sourceOfBooking = [];
        this.BookingDate = undefined;
        this.CheckedInDate = undefined;
        this.CheckedOutDate = undefined;
        this.isDueAmount = false;
        this.isSameDayBooking = false;
        this.isCheckedIn = false;
    }

    onSearchReset() {
        this.roomName = [];
        this.BookingStatus = [];
        this.sourceOfBooking = [];
        this.BookingDate = undefined;
        this.CheckedInDate = undefined;
        this.CheckedOutDate = undefined;
        this.isDueAmount = false;
        this.isSameDayBooking = false;
        this.isCheckedIn = false;
        this.isFilterVisible = false;
    }

    ionViewWillEnter() {
        this.property = this.token.getProperty();

        if (
            this.property.address != undefined &&
            this.property.address != null
        ) {
            this.addressProperty = this.property.address;
        }

        this.getRoomDetailByPropertyId(this.property.id);
    }

    filterModal() {
        this.isFilterVisible = false;
    }

    getRoomDetailByPropertyId(PropertyId: number) {
        this.propertyService.getRoomDetailsByPropertyId(PropertyId).subscribe(
            (data) => {
                this.rooms = data;

                if (
                    this.rooms != null &&
                    this.rooms != undefined &&
                    this.rooms.length > 0
                ) {
                    this.rooms.sort(this.token.roomSequenceByRanking(true));
                }

                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                //    this.loader = false;
            }
        );
    }

    getConfiguredPropertyDetailsByPropertyId(propertyId: number) {
        this.loader = true;
        this.propertyService
            .getConfiguredPropertyDetailsByPropertyId(propertyId)
            .subscribe(
                (data) => {
                    this.propertydetails = data;
                    this.propertyOTA =
                        this.propertydetails.propertiesOnlineTravelAgencies;
                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                }
            );
    }

    async roomOption(room) {
        const actionSheet = await this.actionSheetController.create({
            header: "Room Option",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                {
                    text: "Close",
                    role: "cancel",
                    icon: "close",
                    handler: () => {
                        actionSheet.dismiss();
                    },
                },
                {
                    text: "Details",
                    icon: "create",
                    handler: () => {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                room: JSON.stringify(room),
                            },
                        };

                        this.router.navigate(
                            ["room-details"],
                            navigationExtras
                        );
                    },
                },
                {
                    text: "Room List",
                    icon: "list-outline",
                    handler: () => {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                room: JSON.stringify(room),
                            },
                        };

                        this.router.navigate(["room-list"], navigationExtras);
                    },
                },
                {
                    text: "Plan Details",
                    icon: "construct-outline",
                    handler: () => {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                room: JSON.stringify(room),
                            },
                        };

                        this.router.navigate(
                            ["manage-room-plan"],
                            navigationExtras
                        );
                    },
                },
                {
                    text: "Rate and Availability",
                    icon: "construct-outline",
                    handler: () => {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                room: JSON.stringify(room),
                            },
                        };

                        this.router.navigate(
                            ["room-rate-and-availability"],
                            navigationExtras
                        );
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    getOTAPropertyDetails(otaChannelId) {
        if (
            otaChannelId != null &&
            otaChannelId != undefined &&
            otaChannelId > 0
        ) {
            this.propertyOTADetails = this.propertyOTA.find(
                (data) => data.id === otaChannelId
            );
            this.booking.externalSite =
                this.propertyOTADetails.onlineTravelAgencyName;
        } else {
            this.propertyOTADetails = null;
            let siteData = this.externalSiteList.externalBookingSites.find(
                (data) => data.id === otaChannelId
            );
            this.booking.externalSite = siteData.value;
        }
    }

    getNoOfCheckedOuts() {
        let sum = 0;
        if (this.bookings != null && this.bookings != undefined) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.bookings[i].bookingStatus === "CHECKEDOUT" ||
                    this.sameDay(this.bookings[i]) === true
                ) {
                    sum = sum + 1;
                }
            }
        }

        return sum;
    }

    getNoByStatus(status) {
        let sum = 0;
        if (this.bookings != null && this.bookings != undefined) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (this.bookings[i].bookingStatus === status) {
                    sum = sum + 1;
                }
            }
        }

        return sum;
    }

    getRoomSaleCount() {
        let sum = 0;
        if (this.bookings != null && this.bookings != undefined) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    !this.isCheckOutDay(this.bookings[i]) ||
                    this.sameDay(this.bookings[i]) === true
                ) {
                    if (this.bookings[i].noOfRooms != null) {
                        sum = sum + this.bookings[i].noOfRooms;
                    }
                }
            }
        }

        return sum;
    }

    getRoomSaleAmount() {
        let sum = 0;
        if (this.bookings != null && this.bookings != undefined) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    !this.isCheckOutDay(this.bookings[i]) ||
                    this.sameDay(this.bookings[i]) === true
                ) {
                    if (
                        this.bookings[i].payableAmount != null &&
                        this.bookings[i].payableAmount != undefined &&
                        this.getNoOfNight(this.bookings[i]) != null &&
                        this.getNoOfNight(this.bookings[i]) != undefined
                    ) {
                        sum =
                            sum +
                            (this.bookings[i].payableAmount -
                                this.getCommitionAmount(this.bookings[i])) /
                                this.getNoOfNight(this.bookings[i]);
                    }
                }
            }
        }

        return sum;
    }

    nightAudit(propertyId: number, date: string) {
        this.loader = true;
        this.isProgressing = true;
        this.bookingService.nightAudit(propertyId, date).subscribe(
            (data) => {
                this.bookings = data.body;
                this.bookingFilter = data.body;
                this.SearchSelection = "0";
                this.filterByDropdown();
                this.loader = false;
                this.isProgressing = false;
                this.isRead = true;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
                this.isProgressing = false;
                this.isRead = true;
            }
        );
    }

    onBookingDateChange(event: any) {
        this.BookingDate = event.detail.value;
        this.filterByDropdown();
    }

    filterByDropdown() {
        let searchResult;
        console.log(
            this.sourceOfBooking + "filter work1" + this.bookings.length
        );

        if (this.isDataFiltered() && this.isSameDayBooking === true) {
            this.bookings = this.bookingFilter;
            this.bookings = this.bookings.filter((item) => {
                searchResult =
                    ((this.isCheckedIn === false ||
                        (this.isCheckedIn === true &&
                            item.bookingStatus !== null &&
                            item.bookingStatus === "CHECKEDIN")) &&
                        (this.isDueAmount === false ||
                            (this.isDueAmount === true &&
                                item.outstandingAmount != null &&
                                item.outstandingAmount != undefined &&
                                item.outstandingAmount < 0)) &&
                        (this.addCheckoutBooking === true ||
                            (this.addCheckoutBooking === false &&
                                (this.sameDay(item) === true ||
                                    (this.sameDay(item) === false &&
                                        item.toDate != null &&
                                        item.toDate != undefined &&
                                        this.datepipe.transform(
                                            item.toDate,
                                            "yyyy-MM-dd"
                                        ) !=
                                            this.datepipe.transform(
                                                this.reportfromDateString,
                                                "yyyy-MM-dd"
                                            ))))) &&
                        (this.isSameDayBooking === false ||
                            (this.isSameDayBooking === true &&
                                this.sameDay(item) === true))) ||
                    ((this.CheckedInDate === undefined ||
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
                        (this.sourceOfBooking === null ||
                            this.sourceOfBooking === undefined ||
                            this.sourceOfBooking.length === 0 ||
                            (this.sourceOfBooking != undefined &&
                                this.sourceOfBooking != null &&
                                this.sourceOfBooking.length > 0 &&
                                item.externalSite != null &&
                                item.externalSite != undefined &&
                                this.sourceOfBooking.some(
                                    (data) =>
                                        data.toLowerCase() ===
                                        item.externalSite.toLowerCase()
                                ) === true &&
                                this.sourceOfBooking.filter((m) =>
                                    this.checkSourceOfBooking(m)
                                ))) &&
                        (this.roomName == null ||
                            this.roomName === undefined ||
                            this.roomName.length === 0 ||
                            (this.roomName != null &&
                                this.roomName != undefined &&
                                this.roomName.length > 0 &&
                                item.roomName != null &&
                                item.roomName != undefined &&
                                this.roomName.some(
                                    (room) =>
                                        room.toLowerCase() ===
                                        item.roomName.toLowerCase()
                                ) === true &&
                                this.roomName.filter((m) =>
                                    this.checkRoomName(m)
                                ))) &&
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
                        (this.BookingStatus == null ||
                            this.BookingStatus === undefined ||
                            this.BookingStatus.length === 0 ||
                            (this.BookingStatus != null &&
                                this.BookingStatus != undefined &&
                                this.BookingStatus.length > 0 &&
                                item.bookingStatus != null &&
                                item.bookingStatus != undefined &&
                                this.BookingStatus.some(
                                    (room) =>
                                        room.toLowerCase() ===
                                        item.bookingStatus.toLowerCase()
                                ) === true &&
                                this.BookingStatus.filter((m) =>
                                    this.checkBookingStatus(m)
                                ))));

                return searchResult;
            });
        } else {
            this.bookings = this.bookingFilter;
            this.bookings = this.bookings.filter((item) => {
                searchResult =
                    (this.isCheckedIn === false ||
                        (this.isCheckedIn === true &&
                            item.bookingStatus !== null &&
                            item.bookingStatus === "CHECKEDIN")) &&
                    (this.isDueAmount === false ||
                        (this.isDueAmount === true &&
                            item.outstandingAmount != null &&
                            item.outstandingAmount != undefined &&
                            item.outstandingAmount < 0)) &&
                    (this.addCheckoutBooking === true ||
                        (this.addCheckoutBooking === false &&
                            (this.sameDay(item) === true ||
                                (this.sameDay(item) === false &&
                                    item.toDate != null &&
                                    item.toDate != undefined &&
                                    this.datepipe.transform(
                                        item.toDate,
                                        "yyyy-MM-dd"
                                    ) !=
                                        this.datepipe.transform(
                                            this.reportfromDateString,
                                            "yyyy-MM-dd"
                                        ))))) &&
                    (this.isSameDayBooking === false ||
                        (this.isSameDayBooking === true &&
                            this.sameDay(item) === true)) &&
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
                    (this.sourceOfBooking === null ||
                        this.sourceOfBooking === undefined ||
                        this.sourceOfBooking.length === 0 ||
                        (this.sourceOfBooking != undefined &&
                            this.sourceOfBooking != null &&
                            this.sourceOfBooking.length > 0 &&
                            item.externalSite != null &&
                            item.externalSite != undefined &&
                            this.sourceOfBooking.some(
                                (data) =>
                                    data.toLowerCase() ===
                                    item.externalSite.toLowerCase()
                            ) === true &&
                            this.sourceOfBooking.filter((m) =>
                                this.checkSourceOfBooking(m)
                            ))) &&
                    (this.roomName == null ||
                        this.roomName === undefined ||
                        this.roomName.length === 0 ||
                        (this.roomName != null &&
                            this.roomName != undefined &&
                            this.roomName.length > 0 &&
                            item.roomName != null &&
                            item.roomName != undefined &&
                            this.roomName.some(
                                (room) =>
                                    room.toLowerCase() ===
                                    item.roomName.toLowerCase()
                            ) === true &&
                            this.roomName.filter((m) =>
                                this.checkRoomName(m)
                            ))) &&
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
                    (this.BookingStatus == null ||
                        this.BookingStatus === undefined ||
                        this.BookingStatus.length === 0 ||
                        (this.BookingStatus != null &&
                            this.BookingStatus != undefined &&
                            this.BookingStatus.length > 0 &&
                            item.bookingStatus != null &&
                            item.bookingStatus != undefined &&
                            this.BookingStatus.some(
                                (room) =>
                                    room.toLowerCase() ===
                                    item.bookingStatus.toLowerCase()
                            ) === true &&
                            this.BookingStatus.filter((m) =>
                                this.checkBookingStatus(m)
                            )));

                return searchResult;
            });
        }
        console.log("filter work" + this.bookings.length);
        this.isFilterVisible = false;
        this.changeDetectorRefs.detectChanges();
    }

    isDataFiltered() {
        if (
            (this.BookingStatus != null &&
                this.BookingStatus != undefined &&
                this.BookingStatus.length > 0) ||
            this.BookingDate != undefined ||
            (this.roomName != null &&
                this.roomName != undefined &&
                this.roomName.length > 0) ||
            (this.sourceOfBooking != null &&
                this.sourceOfBooking != undefined &&
                this.sourceOfBooking.length > 0) ||
            this.CheckedOutDate != undefined ||
            this.CheckedInDate != undefined
        ) {
            return true;
        } else {
            return false;
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

    checkBookingStatus(data) {
        return (
            this.bookings.some(
                (m) =>
                    m.bookingStatus != null &&
                    m.bookingStatus != undefined &&
                    m.bookingStatus.toLowerCase() === data.toLowerCase()
            ) === true
        );
    }

    checkRoomName(data) {
        return (
            this.bookings.some(
                (m) =>
                    m.roomName != null &&
                    m.roomName != undefined &&
                    m.roomName.toLowerCase() === data.toLowerCase()
            ) === true
        );
    }

    checkSourceOfBooking(data) {
        return (
            this.bookings.some(
                (m) =>
                    m.externalSite != null &&
                    m.externalSite != undefined &&
                    m.externalSite.toLowerCase() === data.toLowerCase()
            ) === true
        );
    }

    ratePerNight(row) {
        return (
            (row.payableAmount - this.getCommitionAmount(row)) /
            this.getNoOfNight(row)
        );
    }

    getCommitionAmount(row) {
        return (
            this.getAmount(row.bookingCommissionAmount) +
            this.getAmount(row.tcsFee) +
            this.getAmount(row.tdsFee)
        );
    }

    hotelCollect(row) {
        return row.payableAmount - this.getCommitionAmount(row);
    }

    getAmount(row) {
        if (row != null && row != undefined) {
            return row;
        } else {
            return 0;
        }
    }

    balanceRoomTarif(booking) {
        return (
            this.getTillDateRoomPrice(booking) -
            this.getTotalPaidRoomAmount(booking)
        );
    }

    getTillDateRoomPrice(booking) {
        let bookingFromDate = this.datepipe.transform(
            booking.fromDate,
            "yyyy-MM-dd"
        );
        let currentDate = this.datepipe.transform(
            this.reportfromDateString,
            "yyyy-MM-dd"
        );

        if (booking.fromDate != null && booking.fromDate != undefined) {
            if (
                new Date(bookingFromDate).getTime() <=
                    new Date(currentDate).getTime() &&
                new Date(currentDate).getTime() <=
                    new Date(this.getToDate(booking)).getTime()
            ) {
                let price =
                    ((booking.payableAmount -
                        this.getCommitionAmount(booking)) /
                        this.getNoOfNight(booking)) *
                    this.calculateDiffNightTillToday(booking);
                return price;
            } else if (
                new Date(currentDate).getTime() >
                new Date(this.getToDate(booking)).getTime()
            ) {
                return booking.payableAmount - this.getCommitionAmount(booking);
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    getToDate(booking) {
        let bookingTodate = this.datepipe.transform(
            booking.toDate,
            "yyyy-MM-dd"
        );

        if (
            booking.toTime != null &&
            booking.toTime != undefined &&
            booking.toTime != "NaN-NaN-NaN"
        ) {
            let bookingToTime = this.datepipe.transform(
                booking.toTime,
                "yyyy-MM-dd"
            );

            if (
                new Date(bookingTodate).getTime() <
                new Date(bookingToTime).getTime()
            ) {
                return bookingToTime;
            } else {
                return bookingTodate;
            }
        } else {
            return bookingTodate;
        }
    }

    calculateDiffNightTillToday(booking) {
        let noOfNights, Difference_In_Time;
        let differenceDay = 0;
        if (
            booking.fromDate != undefined &&
            booking.fromDate != null &&
            booking.fromDate != "NaN-NaN-NaN"
        ) {
            let fromdate = this.datepipe.transform(
                booking.fromDate,
                "yyyy-MM-dd"
            );
            let todate = this.datepipe.transform(
                this.reportfromDateString,
                "yyyy-MM-dd"
            );

            if (this.checkSameDayBookingTillToDate(booking) === true) {
                Difference_In_Time = 1;
            } else {
                Difference_In_Time =
                    new Date(todate).getTime() - new Date(fromdate).getTime();
            }

            noOfNights = Difference_In_Time / (1000 * 3600 * 24);
            differenceDay = Math.ceil(noOfNights);
        } else {
            noOfNights = 0;
            differenceDay = 0;
        }

        return differenceDay;
    }

    checkSameDayBookingTillToDate(booking) {
        let sameDayBooking = false;
        if (booking.fromDate != null && booking.fromDate != undefined) {
            let fromdate = this.datepipe.transform(
                booking.fromDate,
                "yyyy-MM-dd"
            );
            let todate = this.datepipe.transform(
                this.reportfromDateString,
                "yyyy-MM-dd"
            );

            if (fromdate === todate) {
                sameDayBooking = true;
            }
        }

        return sameDayBooking;
    }

    getTotalPaidRoomAmount(booking) {
        let sum = 0;
        if (booking != null && booking != undefined) {
            let bookingTotal =
                booking.payableAmount - this.getCommitionAmount(booking);

            if (
                bookingTotal >=
                this.getTotalRoomPaidPaymentByBookingPayment(
                    booking.paymentDtoList
                )
            ) {
                sum =
                    sum +
                    this.getTotalRoomPaidPaymentByBookingPayment(
                        booking.paymentDtoList
                    );
            } else {
                sum = sum + bookingTotal;
            }
        }

        return sum;
    }

    getTotalRoomTariffAmountNotPaid(booking) {
        return (
            booking.payableAmount -
            this.getTotalPaidRoomAmount(booking) -
            this.getCommitionAmount(booking)
        );
    }

    serviceAmountPaid(booking) {
        let sum = 0;

        let bookingTotalServiceAmount = booking.totalServiceAmount;

        if (
            bookingTotalServiceAmount >=
            this.getTotalServicePaidPaymentByBookingPayment(
                booking.paymentDtoList
            )
        ) {
            sum =
                sum +
                this.getTotalServicePaidPaymentByBookingPayment(
                    booking.paymentDtoList
                );
        } else {
            sum = sum + bookingTotalServiceAmount;
        }

        return sum;
    }

    serviceAmountNotPaid(booking) {
        return booking.totalServiceAmount - this.serviceAmountPaid(booking);
    }
    getTotalIncome(row) {
        return (
            this.getValue(row.payableAmount) +
            this.getValue(row.totalServiceAmount) +
            this.getValue(row.totalExpenseAmount) -
            this.getCommitionAmount(row)
        );
    }

    getValue(value) {
        if (value != null && value != undefined) {
            return value;
        } else {
            return 0;
        }
    }

    getTotalRoomTariffAmountPending() {
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum =
                    sum +
                    this.getTotalRoomTariffAmountNotPaid(this.bookings[i]);
            }
        }
        return sum;
    }

    getTotalAllIncome() {
        let sum = 0;
        if (this.bookings != null && this.bookings != undefined) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum = sum + this.getTotalIncome(this.bookings[i]);
            }
        }

        return sum;
    }

    getTotalOutstandingAmount() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.bookings[i].outstandingAmount != null &&
                    this.bookings[i].outstandingAmount != undefined
                ) {
                    sum =
                        sum +
                        this.bookings[i].outstandingAmount -
                        this.getCreditPaidAmount(this.bookings[i]);
                }
            }
        }
        return sum;
    }

    getTotalPaymentAmount() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.bookings[i].totalPaymentAmount != null &&
                    this.bookings[i].totalPaymentAmount != undefined
                ) {
                    sum =
                        sum +
                        this.bookings[i].totalPaymentAmount -
                        this.getCreditPaidAmount(this.bookings[i]);
                }
            }
        }
        return sum;
    }

    getTotalBillToRoomAmount() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum = sum + this.getBillToRoomAmount(this.bookings[i]);
            }
        }
        return sum;
    }

    getTotalCreditPaidAmount() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum = sum + this.getCreditPaidAmount(this.bookings[i]);
            }
        }
        return sum;
    }

    getTotalCreditAmount() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum = sum + this.getCreditAmount(this.bookings[i]);
            }
        }
        return sum;
    }

    getTotalServiceAmountPending() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum = sum + this.serviceAmountNotPaid(this.bookings[i]);
            }
        }
        return sum;
    }

    getTotalServiceAmountPaid() {
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum = sum + this.serviceAmountPaid(this.bookings[i]);
            }
        }
        return sum;
    }

    getTotalServiceAmount() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.bookings[i].totalServiceAmount != null &&
                    this.bookings[i].totalServiceAmount != undefined
                ) {
                    sum = sum + this.bookings[i].totalServiceAmount;
                }
            }
        }
        return sum;
    }

    getPayableAmount() {
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.bookings[i].payableAmount != null &&
                    this.bookings[i].payableAmount != undefined
                ) {
                    sum = sum + this.hotelCollect(this.bookings[i]);
                }
            }
        }
        return sum;
    }
    getTotalRoomTariffAmountPaid() {
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum = sum + this.getTotalPaidRoomAmount(this.bookings[i]);
            }
        }
        return sum;
    }

    getTotalRoomPriceTillToday() {
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.getTillDateRoomPrice(this.bookings[i]) != null &&
                    this.getTillDateRoomPrice(this.bookings[i]) != undefined &&
                    this.balanceRoomTarif(this.bookings[i]) > 0
                ) {
                    sum = sum + this.balanceRoomTarif(this.bookings[i]);
                }
            }
        }
        return sum;
    }

    getTotalComission() {
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                sum = sum + this.getCommitionAmount(this.bookings[i]);
            }
        }
        return sum;
    }

    getRoomAmountPerNight() {
        //return this.bookings.map(t => t.payableAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    (!this.isCheckOutDay(this.bookings[i]) &&
                        this.bookings[i].payableAmount != null &&
                        this.bookings[i].payableAmount != undefined &&
                        this.getNoOfNight(this.bookings[i]) != null &&
                        this.getNoOfNight(this.bookings[i]) != undefined) ||
                    (this.sameDay(this.bookings[i]) &&
                        this.bookings[i].payableAmount != null &&
                        this.bookings[i].payableAmount != undefined &&
                        this.getNoOfNight(this.bookings[i]) != null &&
                        this.getNoOfNight(this.bookings[i]) != undefined)
                ) {
                    sum = sum + this.ratePerNight(this.bookings[i]);
                }
            }
        }
        return sum;
    }

    getNoOfRooms() {
        // return this.bookings.map(t => t.beforeTaxAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    (!this.isCheckOutDay(this.bookings[i]) &&
                        this.bookings[i].noOfRooms != null &&
                        this.bookings[i].noOfRooms != undefined) ||
                    (this.sameDay(this.bookings[i]) &&
                        this.bookings[i].noOfRooms != null &&
                        this.bookings[i].noOfRooms != undefined)
                ) {
                    sum = sum + this.bookings[i].noOfRooms;
                }
            }
        }
        return sum;
    }

    getCreditPaidAmount(booking) {
        let sum = 0;

        if (
            this.getPaymentDataByStatusAndMode(booking, "Credit", "Paid") !=
                null &&
            this.getPaymentDataByStatusAndMode(booking, "Credit", "Paid") !=
                undefined &&
            this.getPaymentDataByStatusAndMode(booking, "Credit", "Paid")
                .length > 0
        ) {
            for (
                let i = 0;
                i <
                this.getPaymentDataByStatusAndMode(booking, "Credit", "Paid")
                    .length;
                i++
            ) {
                sum =
                    sum +
                    this.getPaymentDataByStatusAndMode(
                        booking,
                        "Credit",
                        "Paid"
                    )[i].transactionAmount;
            }
        }
        return sum;
    }

    getBillToRoomAmount(booking) {
        let sum = 0;

        if (
            this.getPaymentDataByMode(booking, "BillToRoom") != null &&
            this.getPaymentDataByMode(booking, "BillToRoom") != undefined &&
            this.getPaymentDataByMode(booking, "BillToRoom").length > 0
        ) {
            for (
                let i = 0;
                i < this.getPaymentDataByMode(booking, "BillToRoom").length;
                i++
            ) {
                sum =
                    sum +
                    this.getPaymentDataByMode(booking, "BillToRoom")[i]
                        .transactionAmount;
            }
        }
        return sum;
    }

    getPaymentDataByStatusAndMode(booking, mode, status) {
        let orderData = [];
        if (
            this.getPaymentData(booking) != null &&
            this.getPaymentData(booking) != undefined &&
            this.getPaymentData(booking).length > 0
        ) {
            orderData = this.getPaymentData(booking).filter((item) => {
                const searchResult =
                    item.paymentMode != null &&
                    item.paymentMode === mode &&
                    item.status != null &&
                    item.status === status;

                return searchResult;
            });
        }

        return orderData;
    }

    getPaymentData(booking) {
        if (
            booking.paymentDtoList != null &&
            booking.paymentDtoList != undefined &&
            booking.paymentDtoList.length > 0
        ) {
            return booking.paymentDtoList;
        } else {
            return null;
        }
    }

    getPaymentDataByMode(booking, mode) {
        let orderData = [];
        if (
            this.getPaymentData(booking) != null &&
            this.getPaymentData(booking) != undefined &&
            this.getPaymentData(booking).length > 0
        ) {
            orderData = this.getPaymentData(booking).filter((item) => {
                const searchResult =
                    item.paymentMode != null && item.paymentMode === mode;

                return searchResult;
            });
        }

        return orderData;
    }

    getCreditAmount(booking) {
        let sum = 0;

        if (
            this.getPaymentDataByMode(booking, "Credit") != null &&
            this.getPaymentDataByMode(booking, "Credit") != undefined &&
            this.getPaymentDataByMode(booking, "Credit").length > 0
        ) {
            for (
                let i = 0;
                i < this.getPaymentDataByMode(booking, "Credit").length;
                i++
            ) {
                sum =
                    sum +
                    this.getPaymentDataByMode(booking, "Credit")[i]
                        .transactionAmount;
            }
        }
        return sum;
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
                    item.paymentMode != "BillToRoom" &&
                    item.paymentMode != "CreditIndividual";

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
                    item.paymentMode != "BillToRoom" &&
                    item.paymentMode != "CreditIndividual";

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
        if (
            booking.expectedNights != null &&
            booking.expectedNights != undefined &&
            booking.expectedNights > 0
        ) {
            return booking.expectedNights;
        } else {
            return booking.noOfNights;
        }
    }

    isCheckOutDay(booking) {
        let isCheckoutDayBooking = false;

        let selectedDate = this.datepipe.transform(
            this.reportfromDateString,
            "yyyy-MM-dd"
        );
        let todate = this.datepipe.transform(booking.toDate, "yyyy-MM-dd");

        if (selectedDate === todate) {
            isCheckoutDayBooking = true;
        }

        return isCheckoutDayBooking;
    }

    sameDay(booking) {
        let sameDayBooking = false;

        let fromdate = this.datepipe.transform(booking.fromDate, "yyyy-MM-dd");
        let todate = this.datepipe.transform(booking.toDate, "yyyy-MM-dd");

        if (fromdate === todate) {
            sameDayBooking = true;
        }

        return sameDayBooking;
    }
}
