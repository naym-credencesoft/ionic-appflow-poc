import { BookingService } from "./../../service/manage-booking/booking-service.service";
import { Booking } from "./../../model/manage-booking/Booking/Booking";
import { Logger } from "../../service/logger.service";
import {
    ChangeDetectorRef,
    Component,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from "@angular/core";
import {
    NavController,
    MenuController,
    LoadingController,
    ActionSheetController,
} from "@ionic/angular";
import { TranslateProvider } from "../../providers";
import { TokenStorage } from "../../token.storage";
import { environment } from "../../../environments/environment";
import { ExpenseService } from "./../../service/ExpenseService/expense-service.service";
import { PaymentService } from "./../../service/payment/payment.service";
import { NavigationExtras, Router } from "@angular/router";
import { CheckUserType } from "src/app/model/checkUserType";
import { DateService } from "src/app/service/DateService/date-service.service";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { Expense } from "src/app/model/Expense/Expense";
import { ExternalSiteList } from "src/app/model/Booking/externalSiteList";
import { PropertiesOnlineTravelAgencies } from "src/app/model/Booking/propertiesOTA";
import { PropertyService } from "src/app/service/property/property.service";
import { OTAChannelPropertyDTO } from "src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO";
import { Property } from "src/app/model/property/Property";
import { RoomAvailability } from "src/app/model/RoomAvailability/RoomAvailability";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { RoomDetailsInterface } from "../accomodation-dashboard/accomodation-dashboard.page";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"],
})
export class HomePage {
    @ViewChild("circleCanvas", { static: false }) circleCanvas: ElementRef;
    openMenu: Boolean = false;
    searchQuery: String = "";
    items: string[];
    showItems: Boolean = false;
    rooms: any;
    adults: any;
    TODAYS_ROOMS = [];
    TODAYS_ROOMS_FILTER = [];

    TotalRevenue: number;
    TotalExpense: number = 0;
    TotalPayment: number = 0;

    childs: any = 0;
    children: number;
    hotellocation: string;

    agmStyles: any[] = environment.agmStyles;

    // search conditions
    public checkin = {
        name: this.translate.get("app.pages.home.label.checkin"),
        date: new Date().toISOString(),
    };

    public checkout = {
        name: this.translate.get("app.pages.home.label.checkout"),
        date: new Date(
            new Date().setDate(new Date().getDate() + 1)
        ).toISOString(),
    };

    slideOpts = {
        initialSlide: 0,
        speed: 400,
    };
    plan: string;

    //@ViewChild(Slides) slides: Slides;
    role: any[];
    roleArray: any;
    businessType: string;

    checkUserType: CheckUserType;
    roomavailability: RoomAvailability;
    isNewReservation: boolean = false;
    isNewOrder: boolean = false;
    isBookingManagement: boolean = false;
    isKOT: boolean = false;
    isBusinessProfile: boolean = false;
    isPropertyManagement: boolean = false;
    isRoomManagement: boolean = false;
    isRateAndAvailability: boolean = false;
    isServiceManagement: boolean = false;
    isProductManagement: boolean = false;
    isPaymentManagement: boolean = false;
    isExpenseManagement: boolean = false;
    isCustomerManagement: boolean = false;
    isInvoiceManagement: boolean = false;
    isReport: boolean = false;
    isFoodGroceryReports: boolean = false;
    isExternalReservation: boolean = false;
    isAccomodationDashboard: boolean = false;
    paymentCard: boolean = false;
    isBusinessPromotion: boolean = false;
    isHRM: boolean = false;
    businessPlan: string;
    subscriptionSelected: any[];
    bookings: Booking[] = [];
    booking: Booking;

    isPropAdmin: boolean = false;
    isHidden: boolean = true;
    isPropManager: boolean = false;
    propertyId: number;
    loader: boolean = false;

    currentBookings: Booking[] = [];
    currentBookingsFilterObjs: Booking[] = [];

    paymentRecords: Payment[] = [];
    paymentRecordsForBooking: Payment[] = [];

    expenseObjs: Expense[] = [];
    expenseObjsFilter: Expense[] = [];
    expenseName: any[];

    bookingCard: boolean = false;
    revCard: boolean = false;
    externalSiteList: ExternalSiteList;
    propertyOTA: PropertiesOnlineTravelAgencies[];
    propertydetails: OTAChannelPropertyDTO;
    property: Property;
    currency: string;

    expCard: boolean = false;
    roomCard: boolean = false;
    roomData: any;

    isCaseManagement: boolean = false;
    isSupplier: boolean = false;
    isInventory: boolean = false;
    isPurchaseOrder: boolean = false;
    isBusinessLead: boolean = false;
    userData: ApplicationUser;

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        private router: Router,
        private dateService: DateService,
        private bookingService: BookingService,
        private actionSheetController: ActionSheetController,
        private changeDetectorRefs: ChangeDetectorRef,
        private propertyService: PropertyService,
        public loadingCtrl: LoadingController,
        public token: TokenStorage,
        private paymentService: PaymentService,
        private expenseService: ExpenseService,
        private authService: AuthService,
        private translate: TranslateProvider
    ) {
        this.externalSiteList = new ExternalSiteList();
        this.checkUserType = new CheckUserType();
        this.propertydetails = new OTAChannelPropertyDTO();
        this.property = new Property();
        this.userData = new ApplicationUser();
        //this.totalExpense();
        //this.totalPayment();
        //  this.getBalance();
        //  this.onTodaysAuditReport();
    }

    ngOnInit() {
        this.plan = this.token.getProperty().plan;
        this.property = this.token.getProperty();
        // console.log(
        //     "property details",
        //     this.property,
        //     this.currentBookingsFilterObjs
        // );

        if (
            this.property.localCurrency != null &&
            this.property.localCurrency != undefined
        ) {
            this.currency = this.property.localCurrency.toLocaleUpperCase();
        }
        this.getUserData();
    }

    ngAfterViewInit() {
        this.onCurrentDateBookingData();
        // console.log("l3")
    }

    getUserData() {
        const UserId = this.token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(
            (data) => {
                this.userData = data.body;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {}
        );
    }

    sliderChanges() {
        this.roomCard = false;
        this.expCard = false;
        this.paymentCard = false;
        this.bookingCard = false;
        this.revCard = false;
    }

    shouldShowPieChart(): boolean {
        const values = [
            this.getValue(this.roomData?.totalNumberOfRooms),
            this.getValue(this.roomData?.noOfAvailable),
            this.getValue(this.roomData?.noOfBooked),
            this.getHoldRoom(),
        ];

        return !values.every((value) => value === 0);
    }

    getHoldRoom() {
        //return this.bookings.map(t => t.payableAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        // console.log("today's room", this.TODAYS_ROOMS)
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.TODAYS_ROOMS.length; i++) {
                if (
                    this.TODAYS_ROOMS[i].available != null &&
                    this.TODAYS_ROOMS[i].available != undefined &&
                    this.TODAYS_ROOMS[i].available === false
                ) {
                    sum = sum + 1;
                } else {
                    if (
                        // this.TODAYS_ROOMS[i].roomStatus === "NOT_READY" ||
                        this.TODAYS_ROOMS[i].roomStatus === "DO_NOT_DISTRUB" ||
                        this.TODAYS_ROOMS[i].roomStatus === "SLEEP_OUT" ||
                        this.TODAYS_ROOMS[i].roomStatus === "ON_QUEUE" ||
                        // this.TODAYS_ROOMS[i].roomStatus === "LATE_CHECK_OUT" ||
                        this.TODAYS_ROOMS[i].roomStatus === "CHECKING_OUT" ||
                        this.TODAYS_ROOMS[i].roomStatus === "OCCUPIED" ||
                        this.TODAYS_ROOMS[i].roomStatus === "BLOCKED"
                    ) {
                        sum = sum + 1;
                    }
                }
            }
        }
        return sum;
    }

    onCurrentDateBookingData() {
        let reportToDateString, reportfromDateString;
        let currentDate = new Date();
        reportfromDateString =
            this.dateService.convertMillisecondsToYYYMMDDFormat(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        reportToDateString =
            this.dateService.convertMillisecondsToYYYMMDDFormat(currentDate);
        this.propertyId = this.token.getProperty().id;
        this.booking = new Booking();
        this.booking.propertyId = this.propertyId;
        this.booking.fromDate = reportfromDateString;
        this.booking.toDate = reportToDateString;
        this.getBooking(this.booking);
        this.getConfiguredPropertyDetailsByPropertyId(this.propertyId);

        this.roomavailability = new RoomAvailability();
        this.roomavailability.PropertyId = this.propertyId;
        this.roomavailability.FromDate = reportfromDateString;
        this.roomavailability.ToDate = reportToDateString;

        this.propertyService
            .getAllRoomsByDate(this.roomavailability)
            .subscribe((data) => {
                if (
                    data.body != null &&
                    data.body != undefined &&
                    data.body.length > 0
                ) {
                    this.roomData = data.body[0];
                    // this.convertObjectToArrayByCurrentDay(this.roomData);
                    // console.log(
                    //     this.getHoldRoom(),
                    //     this.getValue(this.roomData?.totalNumberOfRooms),
                    //     this.getValue(this.roomData?.noOfAvailable),
                    //     this.getValue(this.roomData?.noOfBooked),
                    //     this.getHoldRoom(),
                    //     "qwertyuiopasdfghjkl"
                    // );

                    if (
                        this.getValue(this.roomData?.totalNumberOfRooms) > 0 ||
                        this.getValue(this.roomData?.noOfAvailable) > 0 ||
                        this.getValue(this.roomData?.noOfBooked) > 0 ||
                        this.getHoldRoom() > 0
                    ) {
                        const canvas: HTMLCanvasElement =
                            this.circleCanvas?.nativeElement;
                        const ctx: CanvasRenderingContext2D =
                            canvas.getContext("2d");

                        const values = [
                            this.getValue(this.roomData?.totalNumberOfRooms),
                            this.getValue(this.roomData?.noOfAvailable),
                            this.getValue(this.roomData?.noOfBooked),
                            this.getHoldRoom(),
                        ];

                        const colors = [
                            "#F89A34",
                            "#877DBB",
                            "#6d636b",
                            "#ec8c8c",
                        ];
                        // const suffixes = ["R-", "A-", "B-", "H-"];

                        const total = values.reduce((acc, val) => acc + val, 0);

                        canvas.width = canvas.height = 115;

                        let startAngle = 0;

                        for (let i = 0; i < values.length; i++) {
                            values[i] = Math.max(values[i], 0);

                            const percentage = values[i] / total;
                            const endAngle =
                                startAngle + 2 * Math.PI * percentage;
                            const midAngle =
                                startAngle + (endAngle - startAngle) / 2;

                            // Outer circle
                            ctx.beginPath();
                            ctx.moveTo(canvas.width / 2, canvas.height / 2);
                            ctx.arc(
                                canvas.width / 2,
                                canvas.height / 2,
                                canvas.width / 2,
                                startAngle,
                                endAngle
                            );
                            ctx.fillStyle = colors[i];
                            ctx.fill();
                            ctx.closePath();

                            // Draw number in the middle of the segment
                            const textX =
                                canvas.width / 2 +
                                (canvas.width / 3.5) * Math.cos(midAngle);
                            const textY =
                                canvas.height / 2 +
                                (canvas.width / 3.5) * Math.sin(midAngle);
                            if (values[i] !== 0) {
                                ctx.fillStyle = "#ffffff";
                                ctx.font = "10px Arial";
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                // ctx.fillText(
                                //     suffixes[i] + values[i].toString(),
                                //     textX,
                                //     textY
                                // );
                                ctx.fillText(
                                    values[i].toString(),
                                    textX,
                                    textY
                                );
                            }

                            if (i === 0) {
                                ctx.fillStyle = "#000000";
                                ctx.beginPath();
                                ctx.moveTo(canvas.width / 2, canvas.height / 2);
                                ctx.arc(
                                    canvas.width / 2,
                                    canvas.height / 2,
                                    canvas.width / 5,
                                    startAngle,
                                    midAngle
                                );
                                ctx.lineTo(canvas.width / 2, canvas.height / 2);
                                ctx.fillStyle = "white";
                                ctx.fill();
                                ctx.closePath();
                            }

                            startAngle = endAngle;
                        }

                        // Inner circle (to create space)
                        ctx.beginPath();
                        ctx.arc(
                            canvas.width / 2,
                            canvas.height / 2,
                            canvas.width / 5,
                            0,
                            2 * Math.PI
                        );
                        ctx.fillStyle = "#259bbf";
                        ctx.fill();
                        ctx.strokeStyle = "white"; // White border color
                        ctx.lineWidth = 1; // Border thickness
                        ctx.stroke(); // Apply the border
                        ctx.closePath();

                        // for (let i = 0; i < values.length; i++) {
                        //   const percentage = values[i] / total;
                        //   const endAngle = startAngle + 2 * Math.PI * percentage;
                        //   const midAngle = startAngle + (endAngle - startAngle) / 2;

                        //   ctx.beginPath();
                        //   ctx.moveTo(canvas.width / 2, canvas.height / 2);
                        //   ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
                        //   ctx.fillStyle = colors[i];
                        //   ctx.fill();
                        //   ctx.closePath();

                        //   const textX = canvas.width / 2 + (canvas.width / 4) * Math.cos(midAngle);
                        //   const textY = canvas.height / 2 + (canvas.width / 4) * Math.sin(midAngle);

                        //   ctx.fillStyle = '#fff';
                        //   ctx.font = '14px Arial';
                        //   ctx.textAlign = 'center';
                        //   ctx.textBaseline = 'middle';
                        //   ctx.fillText(values[i].toString(), textX, textY);

                        //   startAngle = endAngle;
                        // }
                    }
                }
                this.changeDetectorRefs.detectChanges();
            });
    }

    // convertObjectToArrayByCurrentDay(roomData) {
    //     this.TODAYS_ROOMS = [];
    //     this.TODAYS_ROOMS_FILTER = [];

    //     for (let k = 0; k < parseInt(JSON.stringify(roomData.length)); k++) {
    //         for (
    //             let i = 0;
    //             i < parseInt(JSON.stringify(roomData[k].floors.length));
    //             i++
    //         ) {
    //             for (
    //                 let j = 0;
    //                 j <
    //                 parseInt(
    //                     JSON.stringify(roomData[k].floors[i].rooms.length)
    //                 );
    //                 j++
    //             ) {
    //                 let roominterterface: RoomDetailsInterface = {
    //                     date: roomData[k].date,
    //                     roomType: roomData[k].floors[i].rooms[j].roomType,
    //                     roomNumber: roomData[k].floors[i].rooms[j].roomNumber,
    //                     available: roomData[k].floors[i].rooms[j].available,
    //                     roomId: roomData[k].floors[i].rooms[j].roomId,
    //                     guestName: roomData[k].floors[i].rooms[j].guestName,
    //                     bookingId: roomData[k].floors[i].rooms[j].bookingId,
    //                     description: roomData[k].floors[i].rooms[j].description,
    //                     roomStatus: roomData[k].floors[i].rooms[j].roomStatus,
    //                     floorNumber: roomData[k].floors[i].rooms[j].floorNumber,
    //                     floorName: roomData[k].floors[i].rooms[j].floorName,
    //                     noOfBed: roomData[k].floors[i].rooms[j].noOfBed,
    //                     bedType: roomData[k].floors[i].rooms[j].bedType,
    //                     roomOb: roomData[k].floors[i].rooms[j],
    //                     roomSequenceNumber:
    //                         roomData[k].floors[i].rooms[j].roomSequenceNumber,
    //                     checkoutBookingId:
    //                         roomData[k].floors[i].rooms[j].checkoutBookingId,
    //                 };
    //                 this.TODAYS_ROOMS.push(roominterterface);

    //                 this.TODAYS_ROOMS = this.sortTodaysArray(this.TODAYS_ROOMS);
    //                 this.TODAYS_ROOMS_FILTER = this.TODAYS_ROOMS;
    //                 console.log(".......Data",this.TODAYS_ROOMS )
    //             }
    //         }
    //     }
    //     this.changeDetectorRefs.detectChanges();
    // }

    getValue(data) {
        if (data != null && data != undefined) {
            return data;
        } else {
            return 0;
        }
    }

    getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    ionViewDidEnter() {
        this.property = this.token.getProperty();
        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });

        const filters = {
            roles: (roles) =>
                roles.find((x) => this.roleArray.includes(x.toUpperCase())),
        };

        if (this.token.getProperty() !== null) {
            this.businessType = this.token.getProperty().businessType;
            this.businessPlan = this.token.getProperty().plan;

            if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
                this.isPropAdmin = true;
                this.getSubscriptionFormTokenStorage(
                    String(this.token.getProperty().id)
                );
                this.propAdminAccess();
            } else if (this.checkUserType.isFontDesk(this.role[0]) == true) {
                this.fontDeskAccess();
            } else if (
                this.checkUserType.isServiceRestaurant(this.role[0]) == true
            ) {
                this.restaurantServiceAccess();
            } else if (this.checkUserType.isManager(this.role[0]) == true) {
                this.isPropManager = true;
                this.propManagerAccess();
            } else if (this.checkUserType.isPropFinance(this.role[0]) == true) {
                this.propFinenceAccess();
            } else if (
                this.checkUserType.isHouseKeeping(this.role[0]) == true
            ) {
                this.houseKeeingAccess();
            } else if (
                this.checkUserType.isMarketingManager(this.role[0]) == true
            ) {
                this.MarketingManagerAccess();
            } else if (this.checkUserType.isFontDeskEx(this.role[0]) == true) {
                this.FontDeskExecutiveAccess();
            } else if (
                this.checkUserType.isSeviceExecutive(this.role[0]) == true
            ) {
                this.serviceExecutiveAccess();
            }

            if (
                this.checkUserType.isSoftwareConsulting(this.businessType) ===
                true
            ) {
                this.isCaseManagement = true;
            }
        }

        this.onCurrentDateBookingData();
        // console.log("l1")
    }

    serviceExecutiveAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = false;
        this.isBookingManagement = false;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = false;
        this.isRateAndAvailability = false;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = false;
        this.isExpenseManagement = false;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = false;
        this.isHRM = false;
        this.isAccomodationDashboard = false;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }
    MarketingManagerAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = false;
        this.isNewOrder = false;
        this.isKOT = false;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = false;
        this.isRateAndAvailability = true;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = false;
        this.isExpenseManagement = false;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = false;
        this.isReport = false;
        this.isHRM = false;
        this.isAccomodationDashboard = false;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = true;
        this.isBusinessLead = true;
    }
    houseKeeingAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = false;
        this.isNewOrder = false;
        this.isKOT = false;
        this.isBookingManagement = false;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = true;
        this.isRateAndAvailability = false;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = false;
        this.isExpenseManagement = false;
        this.isCustomerManagement = false;
        this.isInvoiceManagement = false;
        this.isReport = true;
        this.isHRM = false;
        this.isAccomodationDashboard = true;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }
    propFinenceAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = true;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = true;
        this.isRoomManagement = true;
        this.isRateAndAvailability = true;
        this.isServiceManagement = true;
        this.isProductManagement = true;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = true;
        this.isHRM = true;
        this.isAccomodationDashboard = true;
        this.isSupplier = true;
        this.isInventory = true;
        this.isPurchaseOrder = true;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }
    propManagerAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = true;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = true;
        this.isRoomManagement = true;
        this.isRateAndAvailability = true;
        this.isServiceManagement = true;
        this.isProductManagement = true;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = true;
        this.isHRM = true;
        this.isAccomodationDashboard = true;
        this.isSupplier = true;
        this.isInventory = true;
        this.isPurchaseOrder = true;
        this.isBusinessPromotion = false;
        this.isBusinessLead = true;
    }
    restaurantServiceAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = true;
        this.isBookingManagement = false;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = false;
        this.isRateAndAvailability = false;
        this.isServiceManagement = true;
        this.isProductManagement = true;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = false;
        this.isReport = true;
        this.isHRM = false;
        this.isAccomodationDashboard = false;
        this.isSupplier = true;
        this.isInventory = true;
        this.isPurchaseOrder = true;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }
    fontDeskAccess() {
        this.isCaseManagement = true;
        this.isNewReservation = false;
        this.isNewOrder = true;
        this.isKOT = false;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = true;
        this.isRoomManagement = true;
        this.isRateAndAvailability = true;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = true;
        this.isHRM = false;
        this.isAccomodationDashboard = true;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }

    FontDeskExecutiveAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = false;
        this.isNewOrder = true;
        this.isKOT = false;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = false;
        this.isRateAndAvailability = true;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = false;
        this.isExpenseManagement = false;
        this.isCustomerManagement = false;
        this.isInvoiceManagement = false;
        this.isReport = true;
        this.isHRM = false;
        this.isAccomodationDashboard = true;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }

    propAdminAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = true;
        this.isBookingManagement = true;
        this.isBusinessProfile = true;
        this.isPropertyManagement = true;
        this.isRoomManagement = true;
        this.isRateAndAvailability = true;
        this.isServiceManagement = true;
        this.isProductManagement = true;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = true;
        this.isHRM = true;
        this.isAccomodationDashboard = true;
        this.isSupplier = true;
        this.isInventory = true;
        this.isPurchaseOrder = true;
        this.isBusinessPromotion = false;
        this.isBusinessLead = true;
    }

    getTotalExpenseByToday() {
        let sum = 0;

        for (let i = 0; i < this.expenseObjs.length; i++) {
            if (this.expenseObjs[i].amount != null) {
                sum = sum + this.expenseObjs[i].amount;
            }
        }

        return sum;
    }

    getTotalExpenseByName(name: string) {
        let sum = 0;

        for (let i = 0; i < this.getExpenseDataByName(name).length; i++) {
            sum = sum + this.getExpenseDataByName(name)[i].amount;
        }

        return sum;
    }

    getExpenseDataByName(name: string) {
        let orderData = [];
        if (
            this.expenseObjsFilter != null &&
            this.expenseObjsFilter != undefined &&
            this.expenseObjsFilter.length > 0
        ) {
            orderData = this.expenseObjsFilter.filter((item) => {
                const searchResult = item.name != null && item.name === name;

                return searchResult;
            });
        }

        return orderData;
    }

    getTotalRoomPrice() {
        let sum = 0;
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                sum = sum + this.currentBookingsFilterObjs[i].payableAmount;
            }
        }
        return sum;
    }
    getTotalPaidRoomAmount() {
        let sum = 0;
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                let bookingTotal =
                    this.currentBookingsFilterObjs[i].payableAmount +
                    this.currentBookingsFilterObjs[i].totalServiceAmount +
                    this.currentBookingsFilterObjs[i].totalExpenseAmount;

                if (
                    bookingTotal >=
                    this.getTotalRoomPaidPaymentByBookingPayment(
                        this.currentBookingsFilterObjs[i].paymentDtoList
                    )
                ) {
                    sum =
                        sum +
                        this.getTotalRoomPaidPaymentByBookingPayment(
                            this.currentBookingsFilterObjs[i].paymentDtoList
                        );
                } else {
                    sum = sum + bookingTotal;
                }
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
                    item.paymentMode != "BillToRoom" &&   item.paymentMode != "CreditIndividual";

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

    getTotalServiceNotPaid() {
        return this.getTotalServiceFromCurrentBooking() - this.servicepaid();
    }
    servicepaid() {
        let sum = 0;
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                let bookingTotalServiceAmount =
                    this.currentBookingsFilterObjs[i].totalServiceAmount;

                if (
                    bookingTotalServiceAmount >=
                    this.getTotalServicePaidPaymentByBookingPayment(
                        this.currentBookingsFilterObjs[i].paymentDtoList
                    )
                ) {
                    sum =
                        sum +
                        this.getTotalServicePaidPaymentByBookingPayment(
                            this.currentBookingsFilterObjs[i].paymentDtoList
                        );
                } else {
                    sum = sum + bookingTotalServiceAmount;
                }
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
                    item.paymentMode != "BillToRoom" &&  item.paymentMode !="CreditIndividual";

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

    getTotalServiceFromCurrentBooking() {
        let sum = 0;
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                sum =
                    sum + this.currentBookingsFilterObjs[i].totalServiceAmount;
            }
        }
        return sum;
    }

    getTotalRoomPriceNotPaid() {
        return this.getTotalRoomPrice() - this.getTotalPaidRoomAmount();
    }

    getTotalTaxAmount() {
        let sum = 0;
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                sum = sum + this.currentBookingsFilterObjs[i].taxAmount;
            }
        }
        return sum;
    }

    getTotalRevenue() {
        let sum = 0;
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                let booking = 0,
                    service = 0;

                if (this.currentBookingsFilterObjs[i].totalServiceAmount) {
                    service =
                        this.currentBookingsFilterObjs[i].totalServiceAmount;
                }

                if (this.currentBookingsFilterObjs[i].payableAmount) {
                    booking = this.currentBookingsFilterObjs[i].payableAmount;
                }
                sum = sum + booking + service;
            }
        }
        return sum;
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

    getTotalOTABooking() {
        let sum = 0;

        if (this.propertyOTA != null && this.propertyOTA != undefined) {
            for (let i = 0; i < this.propertyOTA.length; i++) {
                sum =
                    sum +
                    this.getBookingDataBySource(
                        this.propertyOTA[i].onlineTravelAgencyName
                    );
            }
        }

        return sum;
    }

    getBooking(booking: Booking) {
        this.loader = true;
        this.bookingService
            .accommodationAudit(booking.propertyId, booking.fromDate)
            .subscribe(
                (data) => {
                    this.currentBookings = data.body;

                    if (data.body != null && data.body.length > 0) {
                        this.currentBookings = data.body.filter((item) => {
                            const searchResult =
                                item.bookingStatus != null &&
                                item.bookingStatus != undefined &&
                                item.bookingStatus != "ENQUIRY" &&
                                item.bookingStatus != "CANCELLED" &&
                                item.bookingStatus != "VOID" &&
                                item.bookingStatus != "NO_SHOW";

                            return searchResult;
                        });

                        this.currentBookingsFilterObjs = this.currentBookings;

                        this.getAllPaymentsByBooking();
                        // this.onCurrentDateBookingData();
                        // console.log("l2")

                        let fromDate = this.getMinDate();
                        let toDate = this.getMaxDate();

                        this.getBookingExpense(
                            String(this.booking.propertyId),
                            fromDate,
                            toDate
                        );
                    }

                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    getMinDate() {
        let dateString;
        let dateArray = [];
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                if (this.currentBookingsFilterObjs[i].fromDate != null) {
                    dateArray.push(
                        new Date(this.currentBookingsFilterObjs[i].fromDate)
                    );
                }
            }
        }

        let minDate = new Date(Math.min(...dateArray));

        if (minDate != null && minDate != undefined) {
            dateString =
                this.dateService.convertMillisecondsToYYYMMDDFormat(minDate);
        }

        return dateString;
    }

    getMaxDate() {
        let dateString;
        let dateArray = [];
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                if (this.currentBookingsFilterObjs[i].toDate != null) {
                    dateArray.push(
                        new Date(this.currentBookingsFilterObjs[i].toDate)
                    );
                }
            }
        }

        let maxDate = new Date(Math.max(...dateArray));

        if (maxDate != null && maxDate != undefined) {
            dateString =
                this.dateService.convertMillisecondsToYYYMMDDFormat(maxDate);
        }

        return dateString;
    }

    getTotalPaymentAmountByBooking() {
        return this.getTotalRevenue() + this.getTotalExpenseByBookingObjs();
    }

    getNotPaidExpenceAmount() {
        return (
            this.getTotalExpenseByBookingObjs() -
            this.getTotalPaidExpenseByBookingObjs()
        );
    }

    getTotalPaidExpenseByBookingObjs() {
        let sum = 0;
        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                let bookingTotalExpense =
                    this.currentBookingsFilterObjs[i].totalExpenseAmount;

                if (
                    bookingTotalExpense >=
                    this.getTotalExpensePaidPaymentByBookingPayment(
                        this.currentBookingsFilterObjs[i].paymentDtoList
                    )
                ) {
                    sum =
                        sum +
                        this.getTotalExpensePaidPaymentByBookingPayment(
                            this.currentBookingsFilterObjs[i].paymentDtoList
                        );
                } else {
                    sum = sum + bookingTotalExpense;
                }
            }
        }
        return sum;
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
                    item.paymentMode != "BillToRoom" &&  item.paymentMode !="CreditIndividual";

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

    getTotalExpenseByBookingObjs() {
        let sum = 0;

        for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
            if (this.currentBookingsFilterObjs[i].totalExpenseAmount != null) {
                sum =
                    sum + this.currentBookingsFilterObjs[i].totalExpenseAmount;
            }
        }

        return sum;
    }

    getAllPaymentsByBooking() {
        this.paymentRecords = [];
        this.paymentRecordsForBooking = [];

        //this.paymentRecords = data;

        this.loader = false;

        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs != undefined &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            for (let i = 0; i < this.currentBookingsFilterObjs.length; i++) {
                if (
                    this.currentBookingsFilterObjs[i].paymentDtoList != null &&
                    this.currentBookingsFilterObjs[i].paymentDtoList !=
                        undefined &&
                    this.currentBookingsFilterObjs[i].paymentDtoList.length > 0
                ) {
                    for (
                        let j = 0;
                        j <
                        this.currentBookingsFilterObjs[i].paymentDtoList.length;
                        j++
                    ) {
                        this.paymentRecordsForBooking.push(
                            this.currentBookingsFilterObjs[i].paymentDtoList[j]
                        );
                    }
                }
            }
        }
        this.paymentRecords = this.paymentRecordsForBooking;
    }

    getTotalPaidAmountWithoutBillToRoomAndCredit() {
        let paidButCashNotInHand =
            this.getTotalAmountStatusAndMode("Paid", "BillToRoom") +
            this.getTotalAmountStatusAndMode("Paid", "Credit");

        if (this.getTotalPaymentAmountByStatus("Paid") > paidButCashNotInHand) {
            return (
                this.getTotalPaymentAmountByStatus("Paid") -
                paidButCashNotInHand
            );
        } else {
            return 0;
        }
    }

    getNotPaidAmount() {
        return (
            this.getTotalPaymentAmountByBooking() -
            this.getTotalPaidAmountWithoutBillToRoomAndCredit()
        );
    }

    getTotalPaymentAmountByMOD(paymentMode: string) {
        let sum = 0;

        if (
            this.getPaymentDataByMode(paymentMode) != null &&
            this.getPaymentDataByMode(paymentMode) != undefined &&
            this.getPaymentDataByMode(paymentMode).length > 0
        ) {
            for (
                let i = 0;
                i < this.getPaymentDataByMode(paymentMode).length;
                i++
            ) {
                sum =
                    sum +
                    this.getPaymentDataByMode(paymentMode)[i].transactionAmount;
            }
        }
        return sum;
    }

    getPaymentDataByMode(paymentMode: string) {
        let orderData = [];
        if (
            this.paymentRecordsForBooking != null &&
            this.paymentRecordsForBooking != undefined &&
            this.paymentRecordsForBooking.length > 0
        ) {
            orderData = this.paymentRecordsForBooking.filter((item) => {
                const searchResult =
                    item.paymentMode != null &&
                    item.paymentMode === paymentMode;

                return searchResult;
            });
        }

        return orderData;
    }

    getPaymentDataByStatus(status: string) {
        let orderData = [];
        if (
            this.paymentRecordsForBooking != null &&
            this.paymentRecordsForBooking != undefined &&
            this.paymentRecordsForBooking.length > 0
        ) {
            orderData = this.paymentRecordsForBooking.filter((item) => {
                const searchResult =
                    item.status != null && item.status === status;

                return searchResult;
            });
        }

        return orderData;
    }
    getTotalPaymentAmountByStatus(status: string) {
        let sum = 0;

        if (
            this.getPaymentDataByStatus(status) != null &&
            this.getPaymentDataByStatus(status) != undefined &&
            this.getPaymentDataByStatus(status).length > 0
        ) {
            for (
                let i = 0;
                i < this.getPaymentDataByStatus(status).length;
                i++
            ) {
                sum =
                    sum +
                    this.getPaymentDataByStatus(status)[i].transactionAmount;
            }
        }
        return sum;
    }
    getTotalAmountStatusAndMode(status: string, paymentMode: string) {
        let sum = 0;

        if (
            this.getPaymentDataByStatusAndMode(status, paymentMode) != null &&
            this.getPaymentDataByStatusAndMode(status, paymentMode) !=
                undefined &&
            this.getPaymentDataByStatusAndMode(status, paymentMode).length > 0
        ) {
            for (
                let i = 0;
                i <
                this.getPaymentDataByStatusAndMode(status, paymentMode).length;
                i++
            ) {
                sum =
                    sum +
                    this.getPaymentDataByStatusAndMode(status, paymentMode)[i]
                        .transactionAmount;
            }
        }
        return sum;
    }

    getPaymentDataByStatusAndMode(status: string, paymentMode: string) {
        let orderData = [];
        if (
            this.paymentRecordsForBooking != null &&
            this.paymentRecordsForBooking != undefined &&
            this.paymentRecordsForBooking.length > 0
        ) {
            orderData = this.paymentRecordsForBooking.filter((item) => {
                const searchResult =
                    item.status != null &&
                    item.status === status &&
                    item.paymentMode != null &&
                    item.paymentMode === paymentMode;

                return searchResult;
            });
        }

        return orderData;
    }

    getBookingExpense(propertyId: string, formDate: string, toDate: string) {
        this.loader = true;
        this.expenseObjsFilter = [];
        this.expenseName = [];
        this.expenseService
            .findByPropertyIdAndDateRange(propertyId, formDate, toDate)
            .subscribe(
                (data) => {
                    this.expenseObjs = data;

                    this.expenseObjs = data;

                    // if (
                    //     this.currentBookingsFilterObjs != null &&
                    //     this.currentBookingsFilterObjs != undefined &&
                    //     this.currentBookingsFilterObjs.length > 0
                    // ) {
                    //     for (
                    //         let i = 0;
                    //         i < this.currentBookingsFilterObjs.length;
                    //         i++
                    //     ) {
                    //         for (let j = 0; j < this.expenseObjs.length; j++) {
                    //             if (
                    //                 (this.expenseObjs[j].bookingId !=
                    //                     undefined &&
                    //                     this.expenseObjs[j].bookingId != null &&
                    //                     this.expenseObjs[j].bookingId) ===
                    //                 (this.currentBookingsFilterObjs[i].id !=
                    //                     null &&
                    //                     this.currentBookingsFilterObjs[i].id)
                    //             ) {
                    //                 this.expenseObjsFilter.push(
                    //                     this.expenseObjs[j]
                    //                 );

                    //                 if (this.expenseObjs[j].name != null) {
                    //                     if (
                    //                         this.expenseName.indexOf(
                    //                             this.expenseObjs[j].name
                    //                         ) === -1
                    //                     ) {
                    //                         this.expenseName.push(
                    //                             this.expenseObjs[j].name
                    //                         );
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }

                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    getTotalDirectBooking() {
        let sum = 0;

        for (
            let i = 0;
            i < this.externalSiteList.externalBookingSites.length;
            i++
        ) {
            sum =
                sum +
                this.getBookingDataBySource(
                    this.externalSiteList.externalBookingSites[i].value
                );
        }

        return sum;
    }
    getBookingDataBySource(source: string) {
        let searchResult,
            bookingData = [];

        if (
            this.currentBookingsFilterObjs != null &&
            this.currentBookingsFilterObjs.length > 0
        ) {
            bookingData = this.currentBookingsFilterObjs;
            bookingData = bookingData.filter((item) => {
                searchResult =
                    item.externalSite != null &&
                    item.externalSite != undefined &&
                    item.externalSite === source;
                return searchResult;
            });
        }

        return bookingData.length;
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
                    sum = sum + this.bookings[i].outstandingAmount;
                }
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

    getServiceAmountPaid() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.bookings[i].serviceAmountPaid != null &&
                    this.bookings[i].serviceAmountPaid != undefined
                ) {
                    sum = sum + this.bookings[i].serviceAmountPaid;
                }
            }
        }
        return sum;
    }

    getServiceAmountPending() {
        // return this.bookings.map(t => t.totalServiceAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.bookings[i].serviceAmountPending != null &&
                    this.bookings[i].serviceAmountPending != undefined
                ) {
                    sum = sum + this.bookings[i].serviceAmountPending;
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
                    sum = sum + this.bookings[i].totalPaymentAmount;
                }
            }
        }
        return sum;
    }

    getPayableAmount() {
        //return this.bookings.map(t => t.payableAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.bookings.length > 0) {
            for (let i = 0; i < this.bookings.length; i++) {
                if (
                    this.bookings[i].payableAmount != null &&
                    this.bookings[i].payableAmount != undefined
                ) {
                    sum = sum + this.bookings[i].payableAmount;
                }
            }
        }
        return sum;
    }

    onTodaysAuditReport() {
        let reportfromDateString =
            this.dateService.convertMillisecondsToYYYMMDDFormat(
                new Date().getTime()
            );
        this.nightAudit(this.token.getProperty().id, reportfromDateString);
    }

    nightAudit(propertyId: number, date: string) {
        this.bookingService.nightAudit(propertyId, date).subscribe(
            (data) => {
                this.bookings = data.body;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {}
        );
    }

    getSubscriptionFormTokenStorage(propertyId: string) {
        this.bookingService
            .getPropertySubcription(String(propertyId))
            .subscribe(
                (data) => {
                    this.subscriptionSelected = data;

                    if (
                        this.subscriptionSelected != null &&
                        this.subscriptionSelected != undefined &&
                        this.subscriptionSelected.length > 0
                    ) {
                        if (
                            this.subscriptionSelected != null &&
                            this.subscriptionSelected != undefined &&
                            this.subscriptionSelected.length > 0
                        ) {
                            for (
                                let i = 0;
                                i < this.subscriptionSelected.length;
                                i++
                            ) {
                                if (
                                    this.subscriptionSelected[i].name ===
                                    "Guest Management"
                                ) {
                                }
                                if (
                                    this.subscriptionSelected[i].name ===
                                    "Service Management"
                                ) {
                                }
                                if (
                                    this.subscriptionSelected[i].name ===
                                    "Business Setup"
                                ) {
                                }
                                if (
                                    this.subscriptionSelected[i].name === "HRM"
                                ) {
                                    this.isHRM = true;
                                }

                                if (
                                    this.subscriptionSelected[i].name ===
                                        "Accommodation Reports" ||
                                    this.subscriptionSelected[i].name ===
                                        "Food & Grocery Reports"
                                ) {
                                    this.isFoodGroceryReports = true;
                                }
                            }
                        }
                    }
                },
                (error) => {}
            );
    }

    totalPayment() {
        this.paymentService
            .findPaymentSummaryByPropertyId(+this.token.getPropertyId())
            .subscribe((resp1) => {
                for (let num = 0; num < resp1.length; num++) {
                    this.TotalPayment = this.TotalPayment + resp1[num][0];
                }
            });
    }

    totalExpense() {
        this.expenseService
            .findExpenseSummaryByPropertyId(+this.token.getPropertyId())
            .subscribe((resp1) => {
                for (let num = 0; num < resp1.length; num++) {
                    this.TotalExpense = this.TotalExpense + resp1[num][0];
                }
            });
    }

    getBalance(): number {
        this.TotalRevenue = this.TotalPayment - this.TotalExpense;
        return this.TotalRevenue;
    }

    onSecondSlideChanged() {
        // let currentIndex = this.slides.getActiveIndex();
        //   Logger.log("Current index is", currentIndex);
    }
    onExternalReservation() {
        Logger.log("onExternalReservation");
        this.navCtrl.navigateForward("external-reservation");
    }
    onManageExp() {
        Logger.log("onManageExp");
        this.navCtrl.navigateForward("expence-list");
    }
    onManagePaymeny() {
        Logger.log("onRateAndAvailability");
        this.navCtrl.navigateForward("payment-list");
    }
    onRateAndAvailability() {
        Logger.log("onRateAndAvailability");
        this.navCtrl.navigateForward("master-rates-and-availability");
    }
    onManageRoom() {
        Logger.log("Manage Room");
        this.navCtrl.navigateForward("manage-room");
    }
    onManageBooking() {
        Logger.log("Manage Booking");
        this.navCtrl.navigateForward("booking-list");
    }
    onRecentBooking() {
        Logger.log("recent booking");
        this.navCtrl.navigateForward("recentbooking");
    }
    onTodaysRate() {
        Logger.log("todays rate");
        this.navCtrl.navigateForward("todays-rate-and-availability");
    }
    onCheckIn() {
        Logger.log("guest-check-in-today");
        this.navCtrl.navigateForward("guest-check-in-today");
    }
    onCheckOut() {
        Logger.log("guest-checkout-today");
        this.navCtrl.navigateForward("guest-checkout-today");
    }
    onInHouseGuest() {
        Logger.log("guest-in-house");
        this.navCtrl.navigateForward("in-house-guest");
    }

    onNewBooking() {
        Logger.log("onNewBooking");
        // this.navCtrl.navigateForward('booking');
        this.debounce(() => {
            this.router.navigate(["booking"]);
          }, 300)();
        
    }
    onRoomEnquiry() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                status: "enquiry",
            },
        };
        this.router.navigate(["booking"], navigationExtras);
    }

    onMangeGuest(bookingId: string) {
        this.navCtrl.navigateForward("manage-customer", { queryParams: { managecustomer: bookingId } });
    }

    onManagePlan() {}
    onManageService() {
        this.navCtrl.navigateForward("manage-service");
    }

    onManageProperty() {
        this.navCtrl.navigateForward("manage-property");
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    initializeItems() {
        this.items = [
            "La Belle Place - Rio de Janeiro",
            "Marshall Hotel - Marshall Islands",
            "Maksoud Plaza - São Paulo",
            "Hotel Copacabana - Rio de Janeiro",
            "Pousada Marés do amanhã - Maragogi",
        ];
    }

    itemSelected(item: string) {
        this.hotellocation = item;
        this.showItems = false;
    }

    childrenArr(chil) {
        const child = Number(chil);
        this.childs = Array(child)
            .fill(0)
            .map((v, i) => i);
    }

    editprofile() {
        this.navCtrl.navigateForward("edit-profile");
    }

    settings() {
        this.navCtrl.navigateForward("settings");
    }

    goToWalk() {
        this.navCtrl.navigateRoot("walkthrough");
    }

    logout() {
        this.token.signOut();
        this.navCtrl.navigateRoot("login");
        window.localStorage.clear();
        window.sessionStorage.clear();
    }

    register() {
        this.navCtrl.navigateForward("register");
    }

    messages() {
        this.navCtrl.navigateForward("messages");
    }

    onTodos() {
        this.navCtrl.navigateForward("todos-list");
    }

    //.....

    bookingList() {
        this.navCtrl.navigateForward("booking-list");
    }

    reports() {
        this.navCtrl.navigateForward("report-dashboard");
    }

    debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            fn.apply(this, args);
          }, delay);
        };
      }
      
      serviceDashboard() {
        this.debounce(() => {
          this.navCtrl.navigateForward('service-dashboard');
        }, 300)();
      }

    acDashboard() {
        this.navCtrl.navigateForward("accomodation-dashboard");
    }

    async onMenu() {
        const actionSheet = await this.actionSheetController.create({
            header: "Switch Dashboard",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                {
                    text: "Service Dashboard",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateForward("service-dashboard");
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    menuAction() {
        this.menuCtrl.toggle();
    }
}
