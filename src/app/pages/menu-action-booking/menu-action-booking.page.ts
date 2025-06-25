import { Logger } from "../../service/logger.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Room } from "../../model/room";
import { Booking } from "./../../model/manage-booking/Booking/Booking";
import { TranslateProvider } from "../../providers";
import { TokenStorage } from "./../../token.storage";
import { formatDate } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { NavController, LoadingController, ModalController } from "@ionic/angular";
import { AuthService } from "./../../service/auth.service";
import { BookingService } from "../../service/manage-booking/booking-service.service";
import { Payment } from "../../model/manage-booking/Payment/Payment";
import { ToastController } from "@ionic/angular";
import { DateService } from "../../service/DateService/date-service.service";
import { ActivatedRoute } from "@angular/router";
import { Plan } from "../booking/plan";
import { MobileWallet } from "src/app/model/wallet/mobileWallet";
import { BankAccount } from "../business-setting/bank-details/BankAccount";
import { AUDIT_DATE_CHANGE, AUDIT_GUEST_DETAILS_UPDATE, AUDIT_NEW_BOOKING, AUDIT_ROOM_CATEGORY_CHANGE, EXTRAADULT, EXTRACHILD, PhoneNumberEXP, SMS_NUMBER } from "src/app/app.component";
import { PaymentService } from "src/app/service/payment/payment.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Msg } from "src/app/model/manage-booking/Msg/Msg";
import { NotificationService } from "src/app/service/NotificationService/notification.service";
import { Property } from "src/app/model/property/Property";
import { Location } from "@angular/common";
import { PointOfSale } from "src/app/model/Pos/pointOfSale";
import { TaxDetails } from "src/app/model/TaxDetail/TaxDetails";
import { SplitTaxDTO } from "../booking/booking.page";
import { ReservationService } from "src/app/service/ReservationService/reservation-service.service";
import { BusinessService } from "src/app/model/Reservation/businessServic";
import { RatesAndAvailability } from "src/app/model/manage-booking/rateandavailability/rateandavailability";
import { AvailabilityService } from "src/app/service/AvailabilityService/availability.service";
import { ExternalSiteList } from "src/app/model/Booking/externalSiteList";
import { PropertiesOnlineTravelAgencies } from "src/app/model/Booking/propertiesOTA";
import { OTAChannelPropertyDTO } from "src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO";
import { PropertyService } from "src/app/service/property/property.service";
import { DatePipe } from "@angular/common";
import { OTAPlan } from "src/app/model/otaPlan/otaPlan";
import { ApplicationUser } from "src/app/model/user";
import { CheckoutDialogComponent } from "src/app/component/booking-list/checkout-dialog/checkout-dialog.component";
import { Service } from "src/app/model/manage-booking/Service/Service";
import { PropertyServiceDTO } from "src/app/model/property/PropertyServices";
import { Audit } from "src/app/service/audit";

export interface NotAvailableRoomAndDate {
    roomNumber: string;
    date: string;
}

export interface RoomDetailsInterface {
    roomNumber: string;
    roomId: number;
    available: boolean;
    bookingId: number;
    guestName: string;
    roomStatus: string;
    description: string;
    floorNumber: string;
    floorName: string;
    noOfBed: number;
    bedType: string;
    bedDescription: string;
}

@Component({
    selector: "app-menu-action-booking",
    templateUrl: "./menu-action-booking.page.html",
    styleUrls: ["./menu-action-booking.page.scss"],
})
export class MenuActionBookingPage implements OnInit {
    msgs: any[] = [];
    isWalletAvailable: boolean = false;
    childrenno: string;
    onSaveMenuActionForm: FormGroup;
    onAvailabilityMenuActionForm: FormGroup;
    isRoomAvailable: boolean = true;
    rooms: Room[] = [];
    room: Room;
    booking: Booking;
    payment: Payment;
    confirmButton: string;
    headerTitle: string;

    noOfRooomNumber: number;
    noOfPersonNumber: number;
    minNoOfRoom: number;
    minNoOfPerson: number;

    checkinDate: Date;
    checkoutDate: Date;
    sameDayBooking: boolean;

    isAvailable: boolean = true;


    minDate: string;
    maxDate: string;
    toMinDate: string;
    toMaxDate: string;

    currentMonth: string;
    currentDay: string;

    onRoomTypeForm: FormGroup;

    RoomType: FormControl = new FormControl();
    bookingToDate: FormControl = new FormControl();
    PlanControll: FormControl = new FormControl();
    bookingFromDate: FormControl = new FormControl(new Date());
    RoomNo: FormControl = new FormControl(new Date());
    PersonNo: FormControl = new FormControl(new Date());
    ChildrenNo: FormControl = new FormControl(new Date());


    externalSite: FormControl = new FormControl();
    externalBookingID: FormControl = new FormControl();
    notes: FormControl = new FormControl();
    NotesValue: FormControl = new FormControl();

    firstName: FormControl = new FormControl();
    lastName: FormControl = new FormControl();
    email: FormControl = new FormControl();
    mobile: FormControl = new FormControl();

    paymentMode: FormControl = new FormControl();

    statusType: string;
    selectedRoomId: number;
    loader: boolean = false;

    plans: Plan[];
    plans2: Plan[];
    plan: Plan;
    isPlanAvailable: boolean;

    taxType: string = "withgst";
    taxPercentage: any;
    isReadOnlyField: boolean = false;
    isCopyBooking: boolean = false;
    isCheckAvailability: boolean = false;
    isPersonAvailable: boolean;
    isCard: boolean;
    businessPlan: string;

    bankAccount: BankAccount;
    mobileWallet: MobileWallet;

    isBankTransferAvailable: boolean = false;

    //
    releaseRoomDetails: any[] = [];

    cardNumber: FormControl = new FormControl();
    name: FormControl = new FormControl();
    cvv: FormControl = new FormControl();
    expYear: FormControl = new FormControl();
    expMonth: FormControl = new FormControl();

    accountName: FormControl = new FormControl();
    accountNumber: FormControl = new FormControl();
    bankName: FormControl = new FormControl();
    branchName: FormControl = new FormControl();
    transactionAmount: FormControl = new FormControl();
    swiftCode: FormControl = new FormControl();

    WalletClientFN: FormControl = new FormControl();
    WalletClientLN: FormControl = new FormControl();
    WalletClientPhone: FormControl = new FormControl();
    WalletClientWP: FormControl = new FormControl();
    WalletURL: FormControl = new FormControl();

    TransactionReferenceNumber: FormControl = new FormControl();

    onCardBookForm: FormGroup;
    onSaveForm: FormGroup;
    onbankForm: FormGroup;
    onWalletForm: FormGroup;

    bookingButtonLabel: string;
    isBookButtonDisable: boolean;

    differenceDay: number;
    property: Property;
    currency: string;

    pointOfSaleList: PointOfSale[];
    pointOfSale: PointOfSale;
    bookingRoomPrice: number;
    PlanRoomPrice: number;

    isDiscountEditMode: boolean = false;
    isDiscountAmountChangeRq: boolean = true;
    discountPriceBeforeEdit: number;
    isDataChanged: boolean = false;
    isSelectionDisabled: boolean = false;

    isPriceEditMode: boolean = false;
    isPlanAmountChangeRq: boolean = true;
    priceBeforeChanged: any;
    afterDiscountAmount: any;
    advancePaidAmount: any;

    isAdvancedAmountChange: boolean = false;
    isRoomAllowcationMessageSection: boolean = false;

    totalSplitTax: SplitTaxDTO[] = [];
    propertyTaxDetails: TaxDetails[];
    taxDetailsSelected: TaxDetails[] = [];

    businessServices: BusinessService[] = [];
    businessService: BusinessService;

    isDateChangeOperation: boolean = false;
    isRoomChangeOperation: boolean = false;

    payments: Payment[] = [];
    paymentsFilter: Payment[] = [];

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
    availabilityDTO: any[];

    isRoomAllowcationSection: boolean = false;
    roomNumbers: any[] = [];

    notAvailableRoomAndDate: NotAvailableRoomAndDate[] = [];
    availableRoomDetail: any[];
    bookingStatus: string;
    selectedRooms: any[];
    selectedRoomDetail: any;

    totalPlanAmount: number;
    bookingExtraPersonCharge: number = -1;
    bookingExtraChildCharge: number = -1;
    roomOnlyPricePerNight: any;
    tempTaxAmount: any;

    externalSiteList: ExternalSiteList;
    propertydetails: OTAChannelPropertyDTO;
    propertyOTADetails: PropertiesOnlineTravelAgencies;
    propertyOTA: PropertiesOnlineTravelAgencies[];
    otaChannelId: number;
    onlyTaxAmount: number = 0;

    isAvailabilityAvailable: boolean = true;
    bookingToDateInDateChange: string;
    isAvailabilityRoom: boolean = true;

    planCodes: Plan[];
    otaPlans: OTAPlan[];

    userData: ApplicationUser;
    CheckoutBookingTime: any;

    planPropertyServicesList: PropertyServiceDTO[] = [];
    planPropertyServicesAdult: PropertyServiceDTO;
    planPropertyServicesChild: PropertyServiceDTO;

    servicesAdult: Service;
    servicesChild: Service;
    planBookingServicesList: Service[] = [];

    bookingNoOfChildrens: any;
    bookingNoOfPersons: any;
    bookingNoOfExtraChild: any;
    bookingNoOfExtraPerson: any;
    currentDateTime: string;
    onOfPersons: number = 0;
    onOfChilds: number = 0;
    prevBooking: Booking;
    PosUserName: string;
    role: any = [];
    constructor(
        private bookingService: BookingService,
        private translate: TranslateProvider,
        private authService: AuthService,
        private _location: Location,
        public token: TokenStorage,
        public availabilityService: AvailabilityService,
        private reservationService: ReservationService,
        private notificationService: NotificationService,
        private paymentService: PaymentService,
        private changeDetectorRefs: ChangeDetectorRef,
        public navCtrl: NavController,
        private acRoute: ActivatedRoute,
        public modalController: ModalController,
        private dateService: DateService,
        private propertyService: PropertyService,
        public loadingCtrl: LoadingController,
        public datepipe: DatePipe,
        private toastController: ToastController,
        private formBuilder: FormBuilder
    ) {
        this.payment = new Payment();
        this.booking = new Booking();
        this.property = new Property();
        
        this.prevBooking = new Booking();
        this.propertyOTADetails = new PropertiesOnlineTravelAgencies();
        this.plan = new Plan();
        this.businessService = new BusinessService();
        this.pointOfSale = new PointOfSale();
        this.room = new Room();
        this.externalSiteList = new ExternalSiteList();
        this.userData = new ApplicationUser();
        this.planPropertyServicesAdult = new PropertyServiceDTO();
        this.planPropertyServicesChild = new PropertyServiceDTO();
        this.servicesAdult = new Service();
        this.servicesChild = new Service();

        this.rooms = this.token.getRoomTypes();

        this.property = this.token.getProperty();

        this.onRoomTypeForm = this.formBuilder.group({
            RoomType: ["", Validators.compose([Validators.required])],
        });

        this.onAvailabilityMenuActionForm = this.formBuilder.group({
            RoomType: ["", Validators.compose([Validators.required])],
            bookingFromDate: ["", Validators.compose([Validators.required])],
            PlanControll: ["", Validators.compose([Validators.required])],
            bookingToDate: ["", Validators.compose([Validators.required])],
            RoomNo: ["", Validators.compose([Validators.required])],
            PersonNo: ["", Validators.compose([Validators.required])],
            ChildrenNo: ["", Validators.compose([Validators.nullValidator])],
        });

        this.onSaveMenuActionForm = this.formBuilder.group({
            firstName: ["", Validators.compose([Validators.required])],
            lastName: ["", Validators.compose([Validators.required])],
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
            mobile: ["", Validators.compose([Validators.nullValidator])],
            RoomPlanChangeAmount: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],

            DiscountPercentage: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            externalSite: ["", Validators.compose([Validators.nullValidator])],
            externalBookingID: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            notes: ["", Validators.compose([Validators.nullValidator])],
            paymentMode: ["", Validators.compose([Validators.nullValidator])],
            NotesValue: ["", Validators.compose([Validators.nullValidator])],
        });

        //
        this.onCardBookForm = this.formBuilder.group({
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
            accountName: ["", Validators.compose([Validators.required])],
            accountNumber: ["", Validators.compose([Validators.required])],
            bankName: ["", Validators.compose([Validators.nullValidator])],
            branchName: ["", Validators.compose([Validators.nullValidator])],
            swiftCode: ["", Validators.compose([Validators.required])],
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

        this.currentDateTime = this.datepipe.transform(new Date(), "HH:mm");

        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.userData = resp.body;
                this.PosUserName = this.userData.firstName + " " + this.userData.lastName;
            });

        this.getAllBusinessService();

        if (
            this.property.localCurrency != undefined &&
            this.property.localCurrency != null
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }

        //  this.setCalenderDateLimit();

        this.acRoute.queryParams.subscribe((params) => {
            if (params["booking"] !== undefined) {
                this.booking = JSON.parse(params["booking"]);
                this.prevBooking = JSON.parse(params["booking"]);
                if (
                    this.booking.taxDetails != null &&
                    this.booking.taxDetails != undefined 
                ) {
                this.taxDetailsSelected = this.booking.taxDetails;
               

                }
                this.getBookingById(this.booking.id);
            }

            if (params["checkoutTime"] != undefined) {
                this.CheckoutBookingTime = JSON.parse(params["checkoutTime"]);
            }

            if (params["status"] !== undefined) {
                this.statusType = params["status"];

                if (this.statusType === "Add/Remove-Guest") {
                    this.disableForAddRemoveGuest();
                } else if (this.statusType === "Date-Change") {
                    this.isDateChangeOperation = true;
                    this.disableDateChanged();
                } else if (this.statusType === "Room-Change") {
                    this.isRoomChangeOperation = true;
                    this.disableRoomChange();
                } else if (this.statusType === "Plan-Change") {
                    this.disablePlanChange();
                } else if (this.statusType === "Copy") {
                    Logger.log(" copy ");
                    this.isCopyBooking = true;

                    this.confirmButton = "Create";
                    this.headerTitle = "Copy Booking";
                }
            }
        });

        this.bankAccount = new BankAccount();
        this.mobileWallet = new MobileWallet();

        this.businessPlan = this.token.getProperty().plan;

        this.bankAccount = this.token.getProperty().bankAccount;

        if (this.bankAccount != undefined && this.bankAccount != null) {
            this.isBankTransferAvailable = true;
        } else {
            this.isBankTransferAvailable = false;
        }

        this.mobileWallet = this.token.getProperty().mobileWallet;
        if (this.mobileWallet != undefined && this.mobileWallet != null) {
            this.isWalletAvailable = true;
        } else {
            this.isWalletAvailable = false;
        }
    }

    onCheckOutDateChange() {
        this.plans = this.plans2;
        this.roomPlanSelectByDate();

        this.calculateRoomPrice();

        if (this.isDateChangeOperation === true) {
            this.checkRoomAvailability(this.booking.roomDetails);
        }

        let todatetime = new Date(this.booking.toDate);

        if (this.businessService.twentyFourHoursCheckOut === false) {
            if (
                this.businessService.checkOutTime != null &&
                this.businessService.checkOutTime != undefined
            ) {
                todatetime.setHours(
                    Number(this.businessService.checkOutTime.split(":")[0])
                );
                todatetime.setMinutes(
                    Number(this.businessService.checkOutTime.split(":")[1])
                );
            }
        } else {
            this.booking.twentyFourHoursCheckOut = true;
            todatetime.setHours(Number(this.currentDateTime.split(":")[0]));
            todatetime.setMinutes(Number(this.currentDateTime.split(":")[1]));
        }

        this.booking.toTime = this.datepipe.transform(
            todatetime,
            "yyyy-MM-ddTHH:mm"
        );
    }

    setCountPlanPropertyServiceList() {
        if (this.booking.noOfExtraChild != null && this.booking.noOfExtraChild != undefined &&
            this.planPropertyServicesChild != null && this.planPropertyServicesChild != undefined) {
            this.planPropertyServicesChild.count = this.booking.noOfExtraChild * this.booking.noOfNights;
        }

        if (this.booking.noOfExtraPerson != null && this.booking.noOfExtraPerson != undefined &&
            this.planPropertyServicesAdult != null && this.planPropertyServicesAdult != undefined) {
            this.planPropertyServicesAdult.count = this.booking.noOfExtraPerson * this.booking.noOfNights;
        }

        this.bookingNoOfChildrens = this.getAmount(this.booking.noOfChildren);
        this.bookingNoOfPersons = this.getAmount(this.booking.noOfPersons);
        this.bookingNoOfExtraChild = this.getAmount(this.booking.noOfExtraChild);
        this.bookingNoOfExtraPerson = this.getAmount(this.booking.noOfExtraPerson);
    }

    setExtraPlanPropertyService() {

        let totalPerosn = this.getAmount(this.booking.noOfPersons) + this.getAmount(this.booking.noOfChildren);
        let totalExtraPerosn = this.getAmount(this.booking.noOfExtraChild) + this.getAmount(this.booking.noOfExtraPerson);

        let countOfMainPerson = (totalPerosn - totalExtraPerosn) * this.getAmount(this.booking.noOfNights);

        if (
            this.planPropertyServicesList != null &&
            this.planPropertyServicesList != undefined &&
            countOfMainPerson != undefined &&
            countOfMainPerson != null
        ) {
            for (let i = 0; i < this.planPropertyServicesList.length; i++) {
                this.planPropertyServicesList[i].count = countOfMainPerson;
                this.planPropertyServicesList[i].date = this.datepipe.transform(
                    new Date(),
                    "yyyy-MM-dd"
                );

                this.planPropertyServicesList[i].afterTaxAmount =
                    this.getServiceValue(
                        this.planPropertyServicesList[i].afterTaxAmount
                    ) * countOfMainPerson;
                this.planPropertyServicesList[i].beforeTaxAmount =
                    this.getServiceValue(
                        this.planPropertyServicesList[i].beforeTaxAmount
                    ) * countOfMainPerson;
                this.planPropertyServicesList[i].taxAmount = this.getServiceValue(
                    this.planPropertyServicesList[i].taxAmount
                ) * countOfMainPerson;

                this.planPropertyServicesList[i].autoExtend = true;
            }
        }


        if (
            this.booking.noOfExtraChild != null &&
            this.booking.noOfExtraChild > 0 &&
            this.planPropertyServicesChild != null
        ) {
            this.planPropertyServicesChild.count =
                this.booking.noOfExtraChild * this.booking.noOfNights;

            this.planPropertyServicesChild.afterTaxAmount =
                this.planPropertyServicesChild.afterTaxAmount *
                this.planPropertyServicesChild.count;

            this.planPropertyServicesChild.beforeTaxAmount =
                this.planPropertyServicesChild.beforeTaxAmount *
                this.planPropertyServicesChild.count;

            this.planPropertyServicesChild.taxAmount =
                this.planPropertyServicesChild.taxAmount *
                this.planPropertyServicesChild.count;

            this.planPropertyServicesChild.autoExtend = true;

            this.planPropertyServicesList.push(
                this.planPropertyServicesChild
            );
        }

        if (
            this.booking.noOfExtraPerson != null &&
            this.booking.noOfExtraPerson > 0 &&
            this.planPropertyServicesAdult != null
        ) {
            this.planPropertyServicesAdult.count =
                this.booking.noOfExtraPerson * this.booking.noOfNights;

            this.planPropertyServicesAdult.afterTaxAmount =
                this.planPropertyServicesAdult.afterTaxAmount *
                this.planPropertyServicesAdult.count;
            this.planPropertyServicesAdult.beforeTaxAmount =
                this.planPropertyServicesAdult.beforeTaxAmount *
                this.planPropertyServicesAdult.count;
            this.planPropertyServicesAdult.taxAmount =
                this.planPropertyServicesAdult.taxAmount *
                this.planPropertyServicesAdult.count;

            this.planPropertyServicesAdult.autoExtend = true;

            this.planPropertyServicesList.push(
                this.planPropertyServicesAdult
            );
        }

    }

    updatePropertyService() {

        if (
            this.planPropertyServicesAdult != null &&
            this.planPropertyServicesAdult != undefined
        ) {

            this.planPropertyServicesAdult.date = this.datepipe.transform(
                new Date().getTime(),
                "yyyy-MM-dd"
            );
            this.planPropertyServicesAdult.afterTaxAmount =
                this.getServiceValue(this.planPropertyServicesAdult.afterTaxAmount) *
                this.planPropertyServicesAdult.count;
            this.planPropertyServicesAdult.beforeTaxAmount =
                this.getServiceValue(this.planPropertyServicesAdult.beforeTaxAmount) *
                this.planPropertyServicesAdult.count;
            this.planPropertyServicesAdult.taxAmount =
                this.getServiceValue(this.planPropertyServicesAdult.taxAmount) *
                this.planPropertyServicesAdult.count;

            if (this.servicesAdult != null &&
                this.servicesAdult != undefined &&
                this.servicesAdult.id != null &&
                this.servicesAdult.id != undefined) {
                if (this.planPropertyServicesAdult.count != null && this.planPropertyServicesAdult.count > 0) {
                    this.planPropertyServicesAdult.id = this.servicesAdult.id;
                    this.updateServiceToBooing(
                        this.booking.id,
                        this.planPropertyServicesAdult
                    );
                }
                else {
                    this.deleteBookingService(this.servicesAdult);
                }

            }
            else {
                if (this.planPropertyServicesAdult.count > 0) {
                    this.planPropertyServicesList = [];
                    this.planPropertyServicesAdult.date = this.datepipe.transform(
                        new Date().getTime(),
                        "yyyy-MM-dd"
                    );
                    this.planPropertyServicesList.push(this.planPropertyServicesAdult);
                    this.addSeviceTopBooking(
                        this.booking.id,
                        this.planPropertyServicesList
                    );
                }


            }

        }

        if (
            this.planPropertyServicesChild != null &&
            this.planPropertyServicesChild != undefined
        ) {

            this.planPropertyServicesChild.date = this.datepipe.transform(
                new Date().getTime(),
                "yyyy-MM-dd"
            );

            this.planPropertyServicesChild.afterTaxAmount =
                this.getServiceValue(this.planPropertyServicesChild.afterTaxAmount) *
                this.planPropertyServicesChild.count;

            this.planPropertyServicesChild.beforeTaxAmount =
                this.getServiceValue(this.planPropertyServicesChild.beforeTaxAmount) *
                this.planPropertyServicesChild.count;

            this.planPropertyServicesChild.taxAmount =
                this.getServiceValue(this.planPropertyServicesChild.taxAmount) *
                this.planPropertyServicesChild.count;

            if (this.servicesChild != null &&
                this.servicesChild != undefined &&
                this.servicesChild.id != null &&
                this.servicesChild.id != undefined) {
                if (this.planPropertyServicesChild.count != null && this.planPropertyServicesChild.count > 0) {
                    this.planPropertyServicesChild.id = this.servicesChild.id;
                    this.updateServiceToBooing(
                        this.booking.id,
                        this.planPropertyServicesChild
                    );

                }
                else {
                    this.deleteBookingService(this.servicesChild);
                }
            }
            else {
                if (this.planPropertyServicesChild.count > 0) {
                    this.planPropertyServicesList = [];
                    this.planPropertyServicesChild.date = this.datepipe.transform(
                        new Date().getTime(),
                        "yyyy-MM-dd"
                    );
                    this.planPropertyServicesList.push(this.planPropertyServicesChild);
                    this.addSeviceTopBooking(
                        this.booking.id,
                        this.planPropertyServicesList
                    );
                }
            }

        }

        // service update

        let totalPerosn = this.bookingNoOfChildrens + this.bookingNoOfPersons;
        let totalExtraPerosn = this.bookingNoOfExtraChild + this.bookingNoOfExtraPerson;

        let exactPerson = (totalPerosn - totalExtraPerosn);
        let countOfMainPerson = exactPerson * this.getAmount(this.booking.noOfNights);

        if (this.planBookingServicesList != null && this.planBookingServicesList != undefined) {
            for (let i = 0; i < this.planBookingServicesList.length; i++) {
                if (this.planBookingServicesList[i].date != null) {
                    this.planBookingServicesList[i].date = this.datepipe.transform(
                        this.planBookingServicesList[i].date,
                        "yyyy-MM-dd"
                    );
                }
                else {
                    this.planBookingServicesList[i].date = this.datepipe.transform(
                        new Date().getTime(),
                        "yyyy-MM-dd"
                    );
                }

                this.planBookingServicesList[i].afterTaxAmount = (this.getAmount(this.planBookingServicesList[i].afterTaxAmount) / this.getAmount(this.planBookingServicesList[i].count)) * countOfMainPerson;
                this.planBookingServicesList[i].beforeTaxAmount = (this.getAmount(this.planBookingServicesList[i].beforeTaxAmount) / this.getAmount(this.planBookingServicesList[i].count)) * countOfMainPerson;
                this.planBookingServicesList[i].taxAmount = (this.getAmount(this.planBookingServicesList[i].taxAmount) / this.getAmount(this.planBookingServicesList[i].count)) * countOfMainPerson;
                this.planBookingServicesList[i].count = countOfMainPerson;
            }

            this.bookingService.updateBulkService(this.booking.id, this.planBookingServicesList).subscribe(
                (response) => {

                },
                (error) => {
                    if (error instanceof HttpErrorResponse) {
                    }
                }
            );


        }

    }

    addSeviceTopBooking(bookingId, serviceList: any[]) {
        this.loader = true;
        this.bookingService.saveBookingService(bookingId, serviceList).subscribe(
            (data) => {
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
                // Logger.log(JSON.stringify( this.businessServices));
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    deleteBookingService(row) {
        this.bookingService.deleteService(row.id).subscribe(
            (response) => {

            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                }
            }
        );
    }


    updateServiceToBooing(bookingId, service: any) {
        let services = [];
        services.push(service);
        this.bookingService.updateBulkService(bookingId, services).subscribe(
            (response) => {
                if (response.status === 200) {
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                }
            }
        );
    }

    initPlanPropertyServiceList() {
        if (
            this.plan.propertyServicesList != null &&
            this.plan.propertyServicesList != undefined
        ) {
            for (let i = 0; i < this.plan.propertyServicesList.length; i++) {
                this.plan.propertyServicesList[i].count = 1;
                this.plan.propertyServicesList[i].date = this.datepipe.transform(
                    new Date(),
                    "yyyy-MM-dd"
                );

                this.plan.propertyServicesList[i].servicePrice = this.getServiceValue(
                    this.plan.propertyServicesList[i].servicePrice
                );
                this.plan.propertyServicesList[i].afterTaxAmount =
                    this.getServiceValue(
                        this.plan.propertyServicesList[i].afterTaxAmount
                    );
                this.plan.propertyServicesList[i].beforeTaxAmount =
                    this.getServiceValue(
                        this.plan.propertyServicesList[i].beforeTaxAmount
                    );
                this.plan.propertyServicesList[i].taxAmount = this.getServiceValue(
                    this.plan.propertyServicesList[i].taxAmount
                );
                this.plan.propertyServicesList[i].taxPercentage =
                    this.getServiceValue(
                        this.plan.propertyServicesList[i].taxPercentage
                    );
                this.plan.propertyServicesList[i].autoExtend = true;
            }

            let planPropertyAllServicesList = this.plan.propertyServicesList;

            this.planPropertyServicesList = planPropertyAllServicesList.filter(
                (item) => {
                    const searchResult =
                        item.name === null ||
                        (item.name != null &&
                            item.name.trim().toLowerCase() !==
                            EXTRAADULT.trim().toLowerCase() &&
                            item.name.trim().toLowerCase() !==
                            EXTRACHILD.trim().toLowerCase());

                    return searchResult;
                }
            );

            this.planPropertyServicesAdult = this.plan.propertyServicesList.find(
                (data) =>
                    data.applicableToAdult != null &&
                    data.applicableToAdult === true &&
                    data.name.trim().toLowerCase() == EXTRAADULT.trim().toLowerCase() &&
                    data.serviceType.toLowerCase() == "food"
            );

            this.planPropertyServicesChild = this.plan.propertyServicesList.find(
                (data) =>
                    data.applicableToChild != null &&
                    data.applicableToChild === true &&
                    data.name.trim().toLowerCase() == EXTRACHILD.trim().toLowerCase() &&
                    data.serviceType.toLowerCase() == "food"
            );
        }
    }

    getServiceAfterTaxAmount() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum +
                this.getServiceValue(this.planPropertyServicesList[i].afterTaxAmount);
        }

        return sum;
    }

    getServiceBeforeAmount() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum +
                this.getServiceValue(this.planPropertyServicesList[i].beforeTaxAmount);
        }

        return sum;
    }

    getServiceCount() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum = sum + this.getServiceValue(this.planPropertyServicesList[i].count);
        }

        return sum;
    }
    getServicePrice() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum +
                this.getServiceValue(this.planPropertyServicesList[i].servicePrice);
        }

        return sum;
    }

    getServiceTaxAmount() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum + this.getServiceValue(this.planPropertyServicesList[i].taxAmount);
        }

        return sum;
    }
    getServiceValue(value) {
        if (value != null && value != undefined) {
            return value;
        } else {
            return 0;
        }
    }

    back() {
        this._location.back();
    }

    getOtaPlan(roomId: number, otaPlanId: string) {
        this.loader = true;
        this.otaPlans = [];
        this.bookingService
            .getOtaPlanRoomIdAndOtaPlanId(roomId, otaPlanId)
            .subscribe(
                (data) => {
                    this.otaPlans.push(data.body);

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    checkAvailabilityForRoom(availabilityDTO, roomDetals) {
        this.isAvailabilityRoom = true;

        let checkedOutDate = new Date(this.bookingToDateInDateChange);
        checkedOutDate.setHours(0);
        checkedOutDate.setMinutes(0);

        if (
            availabilityDTO != null &&
            availabilityDTO != undefined &&
            availabilityDTO.length > 0
        ) {
            for (let i = 0; i < availabilityDTO.length; i++) {
                if (
                    checkedOutDate.getTime() <
                    new Date(availabilityDTO[i].date).getTime()
                ) {
                    if (availabilityDTO[i].roomDetails != null) {
                        for (let j = 0; j < roomDetals.length; j++) {
                            if (
                                availabilityDTO[i].roomDetails.some(
                                    (data) =>
                                        data.roomNumber ===
                                        roomDetals[j].roomNumber
                                ) === false
                            ) {
                                this.isAvailabilityRoom = false;
                            }
                        }
                    }
                }
            }
        }

        return this.isAvailabilityRoom;
    }

    checkAvailabilityForDate(availabilityDTO) {
        this.isAvailabilityAvailable = true;

        let checkedOutDate = new Date(this.bookingToDateInDateChange);
        checkedOutDate.setHours(0);
        checkedOutDate.setMinutes(0);

        if (
            availabilityDTO != null &&
            availabilityDTO != undefined &&
            availabilityDTO.length > 0
        ) {
            for (let i = 0; i < availabilityDTO.length; i++) {
                if (
                    checkedOutDate.getTime() <
                    new Date(availabilityDTO[i].date).getTime()
                ) {
                    if (
                        availabilityDTO[i].noOfAvailable <
                        this.booking.noOfRooms
                    ) {
                        this.isAvailabilityAvailable = false;
                    }
                }
            }
        }

        return this.isAvailabilityAvailable;
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

                    if (this.booking.externalSite != null) {
                        this.propertyOTADetails = this.propertyOTA.find(
                            (data) =>
                                data.onlineTravelAgencyName ===
                                this.booking.externalSite
                        );

                        if (
                            this.propertyOTADetails != null &&
                            this.propertyOTADetails != undefined
                        ) {
                            this.otaChannelId = this.propertyOTADetails.id;
                            this.getOTAPropertyDetails(this.otaChannelId);
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

    getOTA_ID(otaChannelName) {
        if (otaChannelName != null && otaChannelName != undefined) {
            let siteData = this.externalSiteList.externalBookingSites.find(
                (data) => data.value === otaChannelName
            );
            if (siteData != undefined && siteData != null) {
                this.otaChannelId = siteData.id;
                this.changeDetectorRefs.detectChanges();
                this.getOTAPropertyDetails(this.otaChannelId);
            }
            // else
            // {

            // }
        }
    }

    calculateByTotalPayableAmounts(payableAmount) {
        this.tempTaxAmount = this.calculateTaxSlabOnGivenPrice(payableAmount);
        let afterDiscountAmount = Number(
            (payableAmount - this.tempTaxAmount).toFixed(2)
        );
        let discountAmount = Number(
            (
                this.booking.totalRoomTariffBeforeDiscount +
                this.booking.extraChildCharge +
                this.booking.extraPersonCharge -
                afterDiscountAmount
            ).toFixed(2)
        );
        this.afterDiscountAmount = Number(
            (
                this.booking.totalRoomTariffBeforeDiscount +
                this.booking.extraChildCharge +
                this.booking.extraPersonCharge -
                discountAmount
            ).toFixed(2)
        );
        this.booking.discountPercentage = Number(
            (discountAmount / this.bookingRoomPrice) * 100
        );
        this.calculateBookingAmounts();
    }

    calculateTaxSlabOnGivenPrice(price) {
        this.totalSplitTax = [];

        let totalTaxAmount = 0;
        let totalTaxPercentage = 0;
        if (this.taxDetailsSelected.length > 0) {
            this.booking.taxAmount = 0;
            for (let i = 0; i < this.taxDetailsSelected.length; i++) {
                let taxPercentage = this.token.getTaxPercentageByTaxDetail(
                    Math.round(this.roomOnlyPricePerNight),
                    this.taxDetailsSelected[i]
                );

                if (taxPercentage != null && taxPercentage != undefined) {
                    totalTaxPercentage = totalTaxPercentage + taxPercentage;

                    totalTaxAmount =
                        price - price / ((totalTaxPercentage + 100) / 100);

                    this.booking.taxAmount =
                        this.booking.taxAmount + totalTaxAmount;
                    this.tempTaxAmount =
                        this.booking.taxAmount + totalTaxAmount;
                }
            }
        } else {
            this.booking.taxAmount = this.onlyTaxAmount;
        }

        // this.booking.taxDetails = this.taxDetailsSelected;
        return totalTaxAmount;
    }

    onRoomChangeClick() {
        if (
            this.isRoomChangeOperation === true &&
            this.booking.roomDetails != null &&
            this.booking.roomDetails.length > 0
        ) {
            this.isRoomAllowcationMessageSection = true;
        }

        console.log("mksd");
    }

    getBookingById(bookingId: any) {
        
        this.bookingService
            .findBooking(bookingId)
            .toPromise()
            .then((b) => {
                this.booking = b.body;
                this.checkinDate = new Date(this.booking.fromDate);
                this.checkoutDate = new Date(this.booking.toDate);
                // this.isDateChangeAllowed();
                if (
                    this.booking.roomId != null &&
                    this.booking.roomId != undefined
                ) {
                    this.selectedRoomId = this.booking.roomId;
                    this.roomSelect(this.selectedRoomId);
                }
               

                if (
                    this.booking.taxDetails != null &&
                    this.booking.taxDetails != undefined 
                ) {
                this.taxDetailsSelected = this.booking.taxDetails;
              

                }
                

                if (
                    this.booking.toDate != null &&
                    this.booking.toDate != undefined
                ) {
                    // let ToDate = new Date(this.booking.toDate);
                    // ToDate.setDate(ToDate.getDate()+1);
                    this.bookingToDateInDateChange = this.datepipe.transform(
                        this.booking.toDate,
                        "yyyy-MM-dd"
                    );
                }

                this.paymentListRefresh(this.booking.propertyReservationNumber);

                if (
                    this.booking.taxDetails.length === 0 &&
                    this.booking.taxAmount != null &&
                    this.booking.taxAmount != undefined
                ) {
                    this.onlyTaxAmount = this.booking.taxAmount;
                }

                this.bookingExtraChildCharge = this.booking.extraChildCharge;
                this.bookingExtraPersonCharge = this.booking.extraPersonCharge;
                this.onOfPersons = this.booking.noOfPersons;
                this.onOfChilds = this.booking.noOfChildren;

                this.bookingStatus = this.booking.bookingStatus;

                this.booking.fromDate = this.datepipe.transform(
                    this.booking.fromDate,
                    "yyyy-MM-dd"
                );

                this.booking.toDate = this.datepipe.transform(
                    this.booking.toDate,
                    "yyyy-MM-dd"
                );

                this.dateLimit();

                if (this.isCopyBooking === true) {
                    this.booking.id = null;
                    this.booking.propertyReservationNumber = null;
                }

                if (
                    this.booking.advanceAmount != null &&
                    this.booking.advanceAmount != undefined
                ) {
                    this.advancePaidAmount = this.booking.advanceAmount;
                }

              
                if (
                    this.booking.roomTariffBeforeDiscount != null &&
                    this.booking.roomTariffBeforeDiscount != undefined
                ) {
                    this.totalPlanAmount =
                        this.booking.roomTariffBeforeDiscount;
                }

                if (
                    this.booking.externalSite != null &&
                    this.booking.externalSite != undefined
                ) {
                    this.getOTA_ID(this.booking.externalSite);
                }

                this.getConfiguredPropertyDetailsByPropertyId(
                    this.token.getProperty().id
                );

                this.changeDetectorRefs.detectChanges();
            })
            .catch((e) => { });
    }

    // isDateChangeAllowed(): boolean {
    //     return this.checkinDate.toDateString() !== this.checkoutDate.toDateString();
    //   }

    taxSelection(tax) {
        // Check if the tax is already selected
        const index = this.taxDetailsSelected.findIndex((t) => t.name === tax.name);
        
        if (index !== -1) {
            // If the tax is already selected, deselect it
            this.taxDetailsSelected.splice(index, 1);
        } else {
            // If the tax is not already selected, select it
            this.taxDetailsSelected.push(tax);
        }
    }

    checkTaxType(tax) {
        let check: boolean = false;
        if (this.taxDetailsSelected.some((r) => r.name === tax.name) === true) {
            check = true;
        }
        return check;
    }

    getAllBusinessService() {
        this.loader = true;
        this.reservationService
            .getAllBusinessServiceByPropertyId(String(this.property.id))
            .subscribe(
                (data) => {
                    this.businessServices = data.body;
                    this.loader = false;

                    this.businessService = this.businessServices.find(
                        (data) => data.name === "Accommodation"
                    );

                    if (
                        this.businessService != null &&
                        this.businessService != undefined
                    ) {
                        this.propertyTaxDetails = this.token.getTaxDetails(
                            this.businessService,
                            this.token.getProperty()
                        );


                        // if (this.taxDetailsSelected.length === 0) {
                        //     this.taxDetailsSelected.push(
                        //         this.propertyTaxDetails[0]
                        //     );
                        // }

                        if (
                            this.booking.roomBooking === true &&
                            this.booking.id === undefined
                        ) {
                            let fromDateTime = new Date(this.booking.fromDate);

                            if (this.businessService.twentyFourHoursCheckOut === false) {
                                if (
                                    this.businessService.checkInTime != null &&
                                    this.businessService.checkInTime != undefined
                                ) {
                                    fromDateTime.setHours(
                                        Number(this.businessService.checkInTime.split(":")[0])
                                    );
                                    fromDateTime.setMinutes(
                                        Number(this.businessService.checkInTime.split(":")[1])
                                    );
                                }
                            } else {
                                this.booking.twentyFourHoursCheckOut = true;
                                fromDateTime.setHours(
                                    Number(this.currentDateTime.split(":")[0])
                                );
                                fromDateTime.setMinutes(
                                    Number(this.currentDateTime.split(":")[1])
                                );
                            }

                            if (fromDateTime != null && fromDateTime != undefined) {
                                this.booking.fromTime = this.datepipe.transform(
                                    fromDateTime,
                                    "yyyy-MM-ddTHH:mm"
                                );
                            }

                            let todatetime = new Date(this.booking.toDate);

                            if (this.businessService.twentyFourHoursCheckOut === false) {
                                if (
                                    this.businessService.checkOutTime != null &&
                                    this.businessService.checkOutTime != undefined
                                ) {
                                    todatetime.setHours(
                                        Number(this.businessService.checkOutTime.split(":")[0])
                                    );
                                    todatetime.setMinutes(
                                        Number(this.businessService.checkOutTime.split(":")[1])
                                    );
                                }
                            } else {
                                this.booking.twentyFourHoursCheckOut = true;
                                todatetime.setHours(Number(this.currentDateTime.split(":")[0]));
                                todatetime.setMinutes(
                                    Number(this.currentDateTime.split(":")[1])
                                );
                            }

                            if (todatetime != null && todatetime != undefined) {
                                this.booking.toTime = this.datepipe.transform(
                                    todatetime,
                                    "yyyy-MM-ddTHH:mm"
                                );
                            }
                        }
                    }

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    calculateRoomPrice() {
        let noOfRoom = this.booking.noOfRooms;
        let noOfNights;
        let Difference_In_Time;

        if (
            this.booking.fromDate != undefined &&
            this.booking.fromDate != null &&
            this.booking.fromDate != "NaN-NaN-NaN" &&
            this.booking.toDate != null &&
            this.booking.toDate != undefined &&
            this.booking.toDate != "NaN-NaN-NaN"
        ) {
            let fromdate = this.datepipe.transform(
                this.booking.fromDate,
                "yyyy-MM-dd"
            );
            let todate = this.getToDate(this.booking);

            if (this.singleDayBooking() === true) {
                Difference_In_Time = 1;
            } else {
                Difference_In_Time =
                    new Date(todate).getTime() - new Date(fromdate).getTime();
            }

            noOfNights = Difference_In_Time / (1000 * 3600 * 24);
            this.differenceDay = Math.ceil(noOfNights);
        } else {
            noOfNights = 0;
            this.differenceDay = 0;
        }

        this.booking.noOfNights = this.differenceDay;
        this.booking.expectedNights = this.differenceDay;

        if (
            this.plan.minimumOccupancy * this.booking.noOfRooms <
            this.booking.noOfPersons
        ) {
            this.booking.noOfExtraPerson =
                this.booking.noOfPersons -
                this.plan.minimumOccupancy * this.booking.noOfRooms;

            if (
                this.bookingExtraPersonCharge != null &&
                this.bookingExtraPersonCharge != undefined &&
                this.onOfPersons === this.booking.noOfPersons
            ) {
                this.plan.extraChargePerPerson =
                    this.bookingExtraPersonCharge /
                    (this.booking.noOfExtraPerson * this.differenceDay);
                this.booking.extraPersonCharge = this.bookingExtraPersonCharge;
                this.bookingExtraPersonCharge = null;
            } else {
                this.booking.extraPersonCharge =
                    this.plan.extraChargePerPerson *
                    this.booking.noOfExtraPerson *
                    this.differenceDay;
            }
        } else {
            this.booking.noOfExtraPerson = 0;
            this.booking.extraPersonCharge = 0;
        }

        if (
            this.plan.noOfChildren * this.booking.noOfRooms <
            this.booking.noOfChildren
        ) {
            this.booking.noOfExtraChild =
                this.booking.noOfChildren -
                this.plan.noOfChildren * this.booking.noOfRooms;

            if (
                this.bookingExtraChildCharge != null &&
                this.bookingExtraChildCharge != undefined &&
                this.onOfChilds == this.booking.noOfChildren
            ) {
                this.plan.extraChargePerChild =
                    this.bookingExtraChildCharge /
                    (this.booking.noOfExtraChild * this.differenceDay);
                this.booking.extraChildCharge = this.bookingExtraChildCharge;
                this.bookingExtraChildCharge = null;
            } else {
                this.booking.extraChildCharge =
                    this.plan.extraChargePerChild *
                    this.booking.noOfExtraChild *
                    this.differenceDay;
            }
        } else {
            this.booking.noOfExtraChild = 0;
            this.booking.extraChildCharge = 0;
        }

        if (
            this.plan != undefined &&
            this.totalPlanAmount != undefined &&
            this.totalPlanAmount != null
        ) {
            this.bookingRoomPrice =
                this.totalPlanAmount * this.differenceDay * noOfRoom +
                this.booking.extraPersonCharge +
                this.booking.extraChildCharge;
            this.PlanRoomPrice = this.totalPlanAmount * this.differenceDay * noOfRoom;
            this.booking.roomTariffBeforeDiscount = this.totalPlanAmount;
        } else {
            this.bookingRoomPrice = 0;
            this.PlanRoomPrice = 0;
            this.booking.roomTariffBeforeDiscount = 0;
        }

        this.setCountPlanPropertyServiceList();
        this.calculateBookingAmounts();

        this.booking.totalRoomTariffBeforeDiscount = this.PlanRoomPrice;

        return this.PlanRoomPrice;
    }

    discountEditButtonClick(percentage) {
        this.isDiscountAmountChangeRq = false;
        this.isDiscountEditMode = true;

        this.discountPriceBeforeEdit = percentage;
    }

    discountButtonClick() {
        this.isDiscountAmountChangeRq = true;
        this.isDiscountEditMode = false;
        this.isDataChanged = true;
    }

    discountButtonClosed() {
        if (this.isDataChanged === false) {
            this.isSelectionDisabled = false;
        }

        this.isDiscountAmountChangeRq = true;
        this.isDiscountEditMode = false;
        this.booking.discountPercentage = this.discountPriceBeforeEdit;

        Logger.log("discount close");

        this.calculateBookingAmounts();
    }

    onchangeEditPrice(pricrChange) {
        this.isSelectionDisabled = true;
        this.isPlanAmountChangeRq = false;
        this.isPriceEditMode = true;

        this.priceBeforeChanged = pricrChange;
        // this.bookingRoomPrice = this.priceBeforeChanged;
    }

    onchangePrice() {
        this.isSelectionDisabled = true;
        this.isPlanAmountChangeRq = true;
        this.isPriceEditMode = false;
        this.isDataChanged = true;
    }

    onchangeClosedPrice() {
        if (this.isDataChanged === false) {
            this.isSelectionDisabled = false;
        }
        this.isPlanAmountChangeRq = true;
        this.isPriceEditMode = false;

        this.afterDiscountAmount = this.priceBeforeChanged;

        this.calculateDiscountAmounts(this.afterDiscountAmount);
    }

    calculateDiscountAmounts(afterDiscountAmount) {
        this.booking.discountAmount =
            this.bookingRoomPrice - afterDiscountAmount;
        this.booking.discountPercentage =
            (this.booking.discountAmount / this.bookingRoomPrice) * 100;

        this.booking.discountPercentage = Number(
            this.booking.discountPercentage.toFixed(4)
        );
        this.calculateBookingAmounts();

        this.advancedAmountChange();

        this.changeDetectorRefs.detectChanges();
    }

    advancedAmountChange() {
        if (
            this.advancePaidAmount != null &&
            this.advancePaidAmount != undefined &&
            this.advancePaidAmount > 0
        ) {
            this.isAdvancedAmountChange = true;
            this.payment.transactionAmount = this.advancePaidAmount;

            this.booking.paymentStatus = "PartiallyPaid";
            //this.isDisabledBookingPaymentStatus = true;
        } else {
            this.isAdvancedAmountChange = false;
            //  this.isDisabledBookingPaymentStatus = false;
            this.payment.transactionAmount =
                Number(this.booking.payableAmount) -
                Number(this.advancePaidAmount);
        }
    }

    disablePlanChange() {
        this.isReadOnlyField = true;

        this.RoomType.disable();
        this.bookingToDate.disable();
        this.bookingFromDate.disable();
        this.RoomNo.disable();
        //  this.PersonNo.enable();
        this.ChildrenNo.disable();
        this.PersonNo.disable();

        this.confirmButton = "Change";
        this.headerTitle = "Plan Change";
    }

    paymentModeChange() {
        Logger.log("paymentMOde :" + this.booking.modeOfPayment);

        if (this.booking.modeOfPayment == "Card") {
            this.isCard = true;
        } else {
            this.isCard = false;
        }
    }

    taxChange(event) {
        this.calculateBookingAmounts();
    }

    async CheckAvailability() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        this.booking.groupBooking = false;
        this.booking.propertyId = parseInt(this.token.getPropertyId());
        this.booking.fromDate = this.getUTCDateToDate(this.booking.fromDate);
        this.booking.toDate = this.getUTCDateToDate(this.booking.toDate);

        Logger.log("form validate" + JSON.stringify(this.booking));

        loader.present();
        const checkAvailabilityObsrv = this.bookingService
            .checkAvailability(this.booking)
            .subscribe(
                (response) => {
                    Logger.log("response : " + JSON.stringify(response));

                    if (response.status === 200) {
                        loader.dismiss();
                        this.bookingFromDate.disable();
                        this.bookingToDate.disable();
                        this.RoomType.disable();

                        this.booking.currency = this.property.localCurrency;
                        this.booking.available = response.body.available;

                        this.booking.totalAmount = response.body.bookingAmount;
                        this.booking.payableAmount =
                            response.body.bookingAmount;
                        this.payment.transactionAmount =
                            this.booking.payableAmount;

                        this.booking.noOfExtraPerson =
                            response.body.noOfExtraPerson;
                        this.booking.extraPersonCharge =
                            response.body.extraPersonCharge;

                        this.booking.noOfExtraChild =
                            response.body.noOfExtraChild;
                        this.booking.extraChildCharge =
                            response.body.extraChildCharge;

                        this.setExtraPlanPropertyService();
                        this.calculateRoomPrice();

                        if (this.booking.roomRatePlanName != undefined) {
                            this.calculateBookingAmounts();
                        }

                        if (response.body.available) {
                            document.getElementById(
                                "second-content"
                            ).style.display = "block";
                            document.getElementById(
                                "first-content"
                            ).style.display = "none";
                            this.onAvailabilityMenuActionForm.disable();
                            this.bookingButtonLabel = "Book";
                            this.isAvailable = true;

                            this.booking.available = true;

                            Logger.log("available");
                        } else {
                            document.getElementById(
                                "second-content"
                            ).style.display = "block";
                            document.getElementById(
                                "first-content"
                            ).style.display = "none";
                            this.onAvailabilityMenuActionForm.disable();
                            this.bookingButtonLabel = "Enquire";
                            this.isAvailable = false;

                            this.booking.available = false;

                            Logger.log(" not available");
                        }
                    }
                },
                (error) => {
                    loader.dismiss();
                    Logger.log(error);
                }
            );
    }

    Reset() {
        this.isAvailable = true;
        this.taxType = "withgst";
        this.booking.roomId = undefined;
        //  this.RoomType.reset();
        this.selectedRoomId = undefined;
        this.onAvailabilityMenuActionForm.reset();
        this.onSaveMenuActionForm.reset();
        this.booking = new Booking();

        // document.getElementById("second-content").style.display = "none";
        // document.getElementById("first-content").style.display = "block";
    }

    singleDayBooking() {
        if (this.plan === null || this.plan === undefined) {
            return false;
        } else if (
            this.plan.onedayPlan === null ||
            this.plan.onedayPlan === undefined
        ) {
            return false;
        } else if (this.plan.onedayPlan === false) {
            return false;
        } else if (this.plan.onedayPlan === true) {
            return true;
        }
    }
    calculateDiffNight() {
        let noOfNights, Difference_In_Time;
        if (
            this.booking.fromDate != undefined &&
            this.booking.fromDate != null &&
            this.booking.fromDate != "NaN-NaN-NaN" &&
            this.booking.toDate != null &&
            this.booking.toDate != undefined &&
            this.booking.toDate != "NaN-NaN-NaN"
        ) {
            let fromdate = this.datepipe.transform(
                this.booking.fromDate,
                "yyyy-MM-dd"
            );
            let todate = this.getToDate(this.booking);

            if (this.singleDayBooking() === true) {
                Difference_In_Time = 1;
            } else {
                Difference_In_Time =
                    new Date(todate).getTime() - new Date(fromdate).getTime();
            }

            noOfNights = Difference_In_Time / (1000 * 3600 * 24);
            this.differenceDay = Math.ceil(noOfNights);
        } else {
            noOfNights = 0;
            this.differenceDay = 0;
        }
    }


    calculateBookingAmounts() {
        this.calculateDiffNight();

        let noOfRoom = this.booking.noOfRooms;

        // let roomOnlyPricePerNight: number;
        let discountAmount: number;

        if (
            this.plan != undefined &&
            this.totalPlanAmount != undefined &&
            this.totalPlanAmount != null
        ) {
            if (
                this.booking.discountPercentage != undefined &&
                this.booking.discountPercentage !== null &&
                this.booking.discountPercentage > 0
            ) {
                this.booking.discountPercentage = Number(
                    this.booking.discountPercentage
                );

                this.roomOnlyPricePerNight =
                    this.totalPlanAmount *
                    ((100 - this.booking.discountPercentage) / 100);
                // discountAmount = this.totalPlanAmount * (this.booking.discountPercentage / 100) * noOfNights * noOfRoom;
                discountAmount =
                    this.bookingRoomPrice *
                    (this.booking.discountPercentage / 100);
                this.booking.discountAmount = Number(discountAmount.toFixed(2));
                // this.afterDiscountAmount = this.bookingRoomPrice - discountAmount;
            } else {
                this.roomOnlyPricePerNight = this.totalPlanAmount;
                discountAmount = 0;
                this.booking.discountAmount = 0;
                this.booking.discountPercentage = 0;
            }

            this.calculateTaxSlab();

            this.booking.payableAmount =
                this.bookingRoomPrice -
                this.booking.discountAmount +
                this.booking.taxAmount;
            this.booking.payableAmount = Math.round(this.booking.payableAmount);
            this.booking.totalAmount =
                this.bookingRoomPrice -
                this.booking.discountAmount +
                this.booking.taxAmount;
            this.booking.beforeTaxAmount =
                this.bookingRoomPrice - this.booking.discountAmount;
            this.booking.roomPrice = Math.round(this.roomOnlyPricePerNight);
            this.booking.discountAmount = Number(discountAmount.toFixed(2));
            // }
            //Logger.log(  this.booking.roomPrice+"Room only price tonight:" + roomOnlyPricePerNight + "\n Before Tax Amount:" + this.booking.beforeTaxAmount + "\nTax Type:" + this.taxType + "\n Tax Amount:" +  this.booking.taxAmount + "\n Booking Payable Amount:" + this.booking.payableAmount +  "\n Booking Total Amount:" + this.booking.totalAmount);
        }
        this.afterDiscountAmount =
            this.bookingRoomPrice - this.booking.discountAmount;
        // this.afterDiscountAmount = Number(this.afterDiscountAmount.toFixed(2));
        this.afterDiscountAmount = this.afterDiscountAmount;
        this.booking.totalBookingAmount = this.afterDiscountAmount;
        this.advancedAmountChange();
    }

    calculateTaxSlab() {
        this.totalSplitTax = [];
        if (this.taxDetailsSelected.length > 0) {
            this.booking.taxAmount = 0;
            for (let i = 0; i < this.taxDetailsSelected.length; i++) {
                let taxPercentage = this.token.getTaxPercentageByTaxDetail(
                    Math.round(this.roomOnlyPricePerNight),
                    this.taxDetailsSelected[i]
                );

                if (taxPercentage != null && taxPercentage != undefined) {
                    let totalTaxAmount =
                        (this.bookingRoomPrice - this.booking.discountAmount) *
                        (taxPercentage / 100);
                    this.booking.taxAmount =
                        this.booking.taxAmount + totalTaxAmount;

                    let tax: SplitTaxDTO = {
                        name: this.taxDetailsSelected[i].name,
                        percentage: taxPercentage,
                        taxAmount: totalTaxAmount,
                    };

                    this.taxDetailsSelected[i].percentage = taxPercentage;
                    this.taxDetailsSelected[i].taxAmount = totalTaxAmount;
                    this.taxDetailsSelected[i].taxableAmount =
                        this.bookingRoomPrice - this.booking.discountAmount;

                    this.totalSplitTax.push(tax);
                }
            }
        } else {
            this.booking.taxAmount = this.onlyTaxAmount;
        }

        this.booking.taxDetails = this.taxDetailsSelected;
    }

    roomSelect(roomId: number) {
        if (this.isRoomChangeOperation === true) {
            this.onRoomChangeClick();
        }
        this.booking.roomId = roomId;
        this.room = this.rooms.find((r) => r.id === roomId);

        if (
            this.room != null &&
            this.room != undefined &&
            this.room.hsnCode != undefined &&
            this.room.hsnCode != null
        ) {
            this.booking.hsnCode = this.room.hsnCode;
        }

        if (
            this.room != undefined &&
            this.room.roomOnlyPrice != null &&
            this.room.roomOnlyPrice != undefined
        ) {
            this.booking.roomPrice = this.room.roomOnlyPrice;
            this.booking.roomName = this.room.name;
        }
        this.plans = [];
        this.plans2 = [];
        this.getPlan(String(roomId));
    }

    PlanChangeBaseOnDate() {
        this.calculateBookingAmounts();
        this.plans = this.plans2;
        this.roomPlanSelectByDate();

        if (this.isDateChangeOperation === true) {
            this.checkRoomAvailability(this.booking.roomDetails);
        }

        this.onCheckOutDateChange();
    }

    checkRoomAvailability(room: any) {
        this.ratesAndAvailability.roomId = this.booking.roomId;
        this.ratesAndAvailability.propertyId = Number(
            this.token.getPropertyId()
        );
        this.ratesAndAvailability.fromDate =
            this.datepipe.transform(
                this.booking.fromDate,
                "yyyy-MM-dd"
            );

        this.ratesAndAvailability.toDate =
            this.datepipe.transform(
                this.booking.toDate,
                "yyyy-MM-dd"
            );

        this.getRatesForRoomByDate(this.ratesAndAvailability, room);
    }

    getRatesForRoomByDate(
        rateAndAvailability: RatesAndAvailability,
        room: any
    ) {
        this.availabilityService
            .getAvailabilityForRoomByDate(rateAndAvailability)
            .subscribe((resp) => {
                if (resp.body.length === 0) {
                    this.presentToast(
                        `Rates And Availability not setup for the dates,please load the rates.`
                    );
                    // this.isRoomAvailable = false;
                } else {
                    this.availabilityDTO = resp.body;
                    this.checkAvailabilityForDate(this.availabilityDTO);

                    if (
                        this.booking.roomDetails != null &&
                        this.booking.roomDetails.length > 0
                    ) {
                        this.checkAvailabilityForRoom(
                            this.availabilityDTO,
                            this.booking.roomDetails
                        );
                    }

                    this.notAvailableRoomAndDate = [];
                    if (room != null && room != undefined && room.length > 0) {
                        for (let i = 0; i < room.length; i++) {
                            this.checkNotAvailableRoomAndDate(
                                room[i].roomNumber,
                                this.availabilityDTO
                            );
                        }
                    }
                }
            });
    }

    checkNotAvailableRoomAndDate(roomNumber: any, availabilityDTO: any) {
        for (let i = 0; i < availabilityDTO.length; i++) {
            if (
                availabilityDTO[i].roomDetails != null &&
                availabilityDTO[i].roomDetails != undefined &&
                availabilityDTO[i].roomDetails.length > 0
            ) {
                let roomDetailObject = this.availabilityDTO[i].roomDetails.find(
                    (data) => data.roomNumber === roomNumber
                );

                if (
                    roomDetailObject != undefined &&
                    roomDetailObject.available === false &&
                    roomDetailObject.bookingId != this.booking.id
                ) {
                    let roomListOfNotAvailable: NotAvailableRoomAndDate = {
                        roomNumber: roomNumber,
                        date: availabilityDTO[i].date,
                    };

                    this.notAvailableRoomAndDate.push(roomListOfNotAvailable);
                }
            }
        }

        this.changeDetectorRefs.detectChanges();
    }

    onRoomAllowcationSection() {
        this.isRoomAllowcationMessageSection = false;
        this.booking.fromDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.fromDate
            );

        this.booking.toDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.toDate
            );

        this.roomRealese(this.booking);
    }

    roomRealese(row) {
        this.loader = true;
        row.checkoutTime = new Date().getTime();
        this.releaseRoomDetails = row.roomDetails;
        this.bookingService.roomRealese(row).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.loader = false;
                    this.notAvailableRoomAndDate = [];
                    this.getAllAvailableRoomsForBooking(this.booking);
                    this.isRoomAllowcationSection = true;
                    this.roomNumbers = [];
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.loader = false;

                        this.presentToast(
                            "Please check booking status and outstanding amount in booking details section"
                        );
                    } else {
                        this.getAllAvailableRoomsForBooking(this.booking);
                        this.isRoomAllowcationSection = true;
                        this.roomNumbers = [];
                    }
                }
            }
        );
    }

    getAllAvailableRoomsForBooking(booking: Booking) {
        this.availabilityService
            .getAvailableRoomsByDateAndRoomIdAndPropertyId(
                this.token.getPropertyId(),
                booking
            )
            .subscribe((resp1) => {
                if (resp1.body.length === 0) {
                    this.availableRoomDetail = [];
                    //  this.openErrorSnackBar(`No rooms found for room allocation,Check other roomtype.`);
                    // this.dialogRef.close();
                    // this.bookingErrorDialog("error", 'Booking', 'Room Allocation Error', "No rooms found for room allocation, Check other roomtype.", null, 'Cancel');
                } else {
                    this.availableRoomDetail = resp1.body;
                    this.changeDetectorRefs.detectChanges();
                }
            });
    }

    roomPlanSelectByDate() {
        if (
            this.booking.fromDate != undefined &&
            this.booking.toDate != undefined
        ) {
            // let fromdate = new Date(this.booking.fromDate);
            // let todate = new Date(this.booking.toDate);
            //   this.isCheckOutDate = true;
            this.plans = this.plans2;
            if (this.plans != undefined && this.plans != null) {
                this.plans = this.plans.filter((item) => {
                    const searchResult =
                        new Date(
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                item.effectiveDate
                            )
                        ).getTime() <=
                        new Date(
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                this.booking.fromDate
                            )
                        ).getTime() &&
                        new Date(
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                item.expiryDate
                            )
                        ).getTime() >=
                        new Date(
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                this.booking.toDate
                            )
                        ).getTime() &&
                        this.checkStatusOfPlan(item.onedayPlan) ===
                        this.checkSameDayBooking();

                    return searchResult;
                });

                if (this.plans.length > 0) {
                    this.isPlanAvailable = true;
                } else {
                    this.isPlanAvailable = false;
                }
            } else {
                this.isPlanAvailable = false;
            }

            this.changeDetectorRefs.detectChanges();
        }
    }

    checkSameDayBooking() {
        this.sameDayBooking = false;
        if (
            this.booking.fromDate != null &&
            this.booking.fromDate != undefined &&
            this.booking.toDate != null &&
            this.booking.toDate != undefined
        ) {
            let fromdate = this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.fromDate
            );
            let todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.toDate
            );

            if (fromdate === todate) {
                this.sameDayBooking = true;
            }
        }

        return this.sameDayBooking;
    }
    checkStatusOfPlan(status) {
        if (status === null || status === undefined) {
            return false;
        } else {
            return status;
        }
    }

    onPersonChange(maxPerson: any) {
        this.noOfPersonNumber = maxPerson;
        if (
            this.booking.noOfChildren === undefined ||
            this.booking.noOfChildren === null
        ) {
            this.booking.noOfChildren = 0;
        }

        if (this.booking.noOfPersons + this.booking.noOfChildren > maxPerson) {
            this.isPersonAvailable = false;
        } else {
            this.isPersonAvailable = true;
        }

        this.calculateRoomPrice();
    }

    //   onRoomQuantityChange(noOfRoom: any, noOfPerson: any, roomOccupacy: any) {
    //     this.noOfRooomNumber = noOfRoom;;
    //     this.noOfPersonNumber = noOfPerson;
    //     this.minNoOfRoom = Number(this.booking.noOfPersons) / roomOccupacy;

    //     if (this.booking.noOfRooms > noOfRoom || this.booking.noOfPersons > noOfPerson) {
    //       this.isRoomAvailable = false;
    //     }
    //     else {
    //       this.isRoomAvailable = true;
    //     }

    //   }

    onRoomQuantityChange(noOfRoom: any) {
        if (this.booking.noOfRooms > noOfRoom) {
            this.isRoomAvailable = false;
        } else {
            this.isRoomAvailable = true;
        }

        this.onRoomChangeClick();
    }

    disableRoomChange() {
        //this.onSaveMenuActionForm.disable();
        this.isReadOnlyField = true;

        this.RoomType.enable();
        this.bookingToDate.disable();
        this.bookingFromDate.disable();
        this.RoomNo.enable();
        this.PersonNo.disable();
        this.ChildrenNo.disable();

        this.confirmButton = "Change";
        this.headerTitle = "Change Room";
    }
    disableDateChanged() {
        //this.onSaveMenuActionForm.disable();

        this.isReadOnlyField = true;

        this.RoomType.disable();
        this.bookingToDate.enable();
        this.bookingFromDate.enable();

        // this.payableAmount.enable();
        // this.bookingTotalAmount.enable();
        this.RoomNo.disable();
        this.PersonNo.disable();
        this.ChildrenNo.disable();

        this.confirmButton = "Change";
        this.headerTitle = "Change Date";
    }

    disableForAddRemoveGuest() {
        // this.onSaveMenuActionForm.disable();
        this.isReadOnlyField = true;

        this.RoomType.disable();
        this.bookingToDate.disable();
        this.bookingFromDate.disable();
        this.RoomNo.disable();
        this.PersonNo.enable();
        this.ChildrenNo.enable();

        this.confirmButton = "Change";
        this.headerTitle = "Add/Remove Person";
    }

    setCalenderDateLimit() {
        let date: Date = new Date();
        this.minDate = this.getDate(date);
        date.setFullYear(date.getFullYear() + 1);
        this.maxDate = this.getDate(date);
    }
    sameDayDateChange() {
        this.calculateBookingAmounts();
        this.booking.toDate = new Date(this.booking.fromDate).toString();

        // toDate.setDate(toDate.getDate() + 1);
        // this.toMinDate = this.getDate(toDate);

        // toDate.setDate(toDate.getDate() + 30);
        // this.toMaxDate = this.getDate(toDate);

        // console.log(this.toMinDate + "" + this.toMaxDate);

        if (this.isDateChangeOperation === true) {
            this.checkRoomAvailability(this.booking.roomDetails);
        }
    }

    dateLimit() {
        let toDate = new Date(this.booking.fromDate);

        toDate.setDate(toDate.getDate() + 1);
        this.toMinDate = this.datepipe.transform(
            toDate,
            "yyyy-MM-dd"
        );

        toDate.setDate(toDate.getDate() + 30);
        this.toMaxDate = this.datepipe.transform(
            toDate,
            "yyyy-MM-dd"
        );
    }

    fromDateChange() {
        this.checkSameDayBooking();
        this.calculateBookingAmounts();

        this.dateLimit();

        if (this.isDateChangeOperation === true) {
            this.checkRoomAvailability(this.booking.roomDetails);
        }


        let fromDateTime = new Date(this.booking.fromDate);

        if (this.businessService.twentyFourHoursCheckOut === false) {
            if (
                this.businessService.checkInTime != null &&
                this.businessService.checkInTime != undefined
            ) {
                fromDateTime.setHours(
                    Number(this.businessService.checkInTime.split(":")[0])
                );
                fromDateTime.setMinutes(
                    Number(this.businessService.checkInTime.split(":")[1])
                );
            }
        } else {
            this.booking.twentyFourHoursCheckOut = true;
            fromDateTime.setHours(Number(this.currentDateTime.split(":")[0]));
            fromDateTime.setMinutes(Number(this.currentDateTime.split(":")[1]));
        }

        this.booking.fromTime = this.datepipe.transform(
            fromDateTime,
            "yyyy-MM-ddTHH:mm"
        );
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

    // getBookingInfoByID(bookingId: number) {
    //     this.bookingService.findBooking(bookingId).subscribe((response1) => {
    //         //  this.booking = new Booking();
    //         this.booking = response1.body;
    //         // this.booking.fromDate =
    //         //     this.dateService.convertMillisecondsToYYYMMDDFormat(
    //         //         this.booking.fromDate
    //         //     );
    //         // this.booking.toDate =
    //         //     this.dateService.convertMillisecondsToYYYMMDDFormat(
    //         //         this.booking.toDate
    //         //     );

    //         // this.selectedRoomId = this.booking.roomId;

    //         // if (this.isCopyBooking === true) {
    //         //     this.booking.id = null;
    //         //     this.booking.propertyReservationNumber = null;
    //         // }

    //         // if (
    //         //     this.booking.roomRatePlanName != undefined &&
    //         //     this.booking.roomRatePlanName != null
    //         // ) {
    //         //     this.plan = this.plans.find(
    //         //         (plan) => plan.name === this.booking.roomRatePlanName
    //         //     );

    //         //     if (
    //         //         this.plan != null &&
    //         //         this.plan != undefined &&
    //         //         this.plans.length > 0
    //         //     ) {
    //         //         this.plan = this.plans[0];
    //         //     }

    //         //     this.booking.planCode = this.plan.code;
    //         //     this.PlanControll.setValue(this.booking.roomRatePlanName);
    //         //     this.PlanChangeBaseOnDate();
    //         // }

    //         // if (
    //         //     this.booking.advanceAmount != null &&
    //         //     this.booking.advanceAmount != undefined
    //         // ) {
    //         //     this.advancePaidAmount = this.booking.advanceAmount;
    //         // }

    //         // if (
    //         //     this.booking.taxDetails != null &&
    //         //     this.booking.taxDetails != undefined &&
    //         //     this.booking.taxDetails.length > 0
    //         // ) {
    //         //     this.taxDetailsSelected = [];
    //         //     this.taxDetailsSelected = this.booking.taxDetails;
    //         // }
    //     });
    // }

    maxOccupancy() {
        let maximumOccupancy = 0,
            noOfChildren = 0,
            noOfRooms = 0;
        if (
            this.plan != null &&
            this.plan != undefined &&
            this.plan.maximumOccupancy != null &&
            this.plan.maximumOccupancy != undefined
        ) {
            maximumOccupancy = this.plan.maximumOccupancy;
        }

        if (
            this.plan != null &&
            this.plan != undefined &&
            this.plan.noOfChildren != null &&
            this.plan.noOfChildren != undefined
        ) {
            noOfChildren = this.plan.noOfChildren;
        }

        if (
            this.booking != null &&
            this.booking != undefined &&
            this.booking.noOfRooms != null &&
            this.booking.noOfRooms != undefined
        ) {
            noOfRooms = this.booking.noOfRooms;
        }

        return (maximumOccupancy + noOfChildren) * noOfRooms;
    }

    getPlan(roomId: string) {
        this.loader = true;
        this.planCodes = [];
        this.bookingService
            .getPlan(String(this.token.getPropertyId()), roomId)
            .subscribe(
                (data) => {
                    this.plans = data.body;
                    this.plans2 = data.body;
                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();

                    if (
                        this.booking.id != null &&
                        this.booking.id != undefined &&
                        this.booking.roomRatePlanName != undefined &&
                        this.booking.roomRatePlanName != null
                    ) {
                        this.PlanChangeBaseOnDate();
                        if (
                            this.plans.some(
                                (data) =>
                                    data.name === this.booking.roomRatePlanName
                            ) === true
                        ) {
                            this.plan = this.plans.find(
                                (plan) =>
                                    plan.name === this.booking.roomRatePlanName
                            );
                        } else if (
                            this.plans.some(
                                (data) =>
                                    data.code === this.booking.roomRatePlanName
                            ) === true
                        ) {
                            this.plan = this.plans.find(
                                (plan) =>
                                    plan.code === this.booking.roomRatePlanName
                            );

                            this.planCodes.push(this.plan);
                        } else {
                            this.getOtaPlan(
                                this.booking.roomId,
                                this.booking.roomRatePlanName
                            );
                        }

                        // this.totalPlanAmount = this.plan.amount;
                        this.booking.planCode = this.plan.code;
                        this.PlanControll.setValue(
                            this.booking.roomRatePlanName
                        );

                        if (this.booking.id != null && this.booking.id != undefined) {
                            this.initPlanPropertyServiceList();
                        }

                        this.onCheckOutDateChange();

                        this.changeDetectorRefs.detectChanges();
                    }
                },
                (error) => {
                    // Logger.log(JSON.stringify(error));
                    this.loader = false;
                }
            );
    }

    setPlan(planName: any) {
        this.plan = this.plans.find((plan) => plan.name === planName);

        if (this.plan != undefined) {
            this.booking.planCode = this.plan.code;
            this.totalPlanAmount = this.plan.amount;
            this.initPlanPropertyServiceList();
            this.calculateBookingAmounts();
        }

        if (this.singleDayBooking() === true) {
            this.setCheckOutDateForSameDay();
        }
        this.loader = false;
    }

    setCheckOutDateForSameDay() {
        let afterDate = new Date(
            this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.fromDate
            )
        );
        afterDate.setDate(afterDate.getDate() + 1);
        this.booking.toDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(afterDate);
    }

    onRoomQuantityCheck(
        noOfRoom: any,
        noOfPerson: any,
        roomOccupacy: any,
        maxRoom: any
    ) {
        this.noOfRooomNumber = maxRoom;
        this.noOfPersonNumber = noOfRoom * roomOccupacy;
        this.minNoOfRoom = Number(noOfPerson) / roomOccupacy;

        if (
            this.booking.noOfPersons > noOfRoom * roomOccupacy ||
            noOfRoom > maxRoom
        ) {
            this.isRoomAvailable = false;
        } else {
            this.isRoomAvailable = true;
        }
    }

    cancel() {
        this.navCtrl.navigateForward("booking-list");
    }

    bookingList() {
        setTimeout(() => {
            this.navCtrl.navigateBack("booking-list");
        }, 2000);
    }

    changePerson(booking: Booking) {
        booking.auditType = AUDIT_GUEST_DETAILS_UPDATE;
        let dynamicDateString = this.booking.toDate; 
        let dynamicDate = new Date(dynamicDateString);
        let year = dynamicDate.getFullYear();
        let month = (dynamicDate.getMonth() + 1).toString().padStart(2, '0'); 
        let day = dynamicDate.getDate().toString().padStart(2, '0');
        let formattedDate = `${year}-${month}-${day}`;
       this.booking.toDate = formattedDate 
        const createBookingObsr = this.bookingService
            .modifyGuestNumber(booking)
            .subscribe((response) => {
                if (response.status === 200) {
                    this.booking = response.body;
                    this.updatePropertyService();
                    //Get All Services
                    this.getBookingById(this.booking.id);
                    if (
                        this.booking.message !== null &&
                        this.booking.message === "success"
                    ) {
                        this.createAuditReport(
                            this.prevBooking,
                            this.booking, 
                            AUDIT_GUEST_DETAILS_UPDATE
                          );
                        this.presentToast(this.booking.message);
                        this.bookingList();
                    } else {
                        this.presentToast(this.booking.message);
                    }
                } else {
                    this.presentToast(`Error in updating Booking Details`);
                }
            });
    }

    calculate_EPA_EPD_Date() {
        if (
            this.booking.fromTime != undefined &&
            this.booking.fromTime != null &&
            this.booking.fromTime != "NaN"
        ) {
            let fromTime =
                this.datepipe.transform(this.booking.fromDate, "yyyy-MM-dd") +
                "T" +
                this.datepipe.transform(this.booking.fromTime, "HH:mm");
            this.booking.fromTime = new Date(fromTime).getTime().toString();
        }

        if (
            this.booking.toTime != undefined &&
            this.booking.toTime != null &&
            this.booking.toTime != "NaN"
        ) {
            let toTime =
                this.datepipe.transform(this.booking.toDate, "yyyy-MM-dd") +
                "T" +
                this.datepipe.transform(this.booking.toTime, "HH:mm");
            this.booking.toTime = new Date(toTime).getTime().toString();
        }
        Logger.log("calculate_EPA_EPD_Date");
    }

    async changeDate(booking: Booking) {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });
        loader.present();

        this.booking.fromDate = this.datepipe.transform(
            this.booking.fromDate,
            "yyyy-MM-dd"
        );

        this.booking.toDate = this.datepipe.transform(
            this.booking.toDate,
            "yyyy-MM-dd"
        );
        this.calculate_EPA_EPD_Date();
        this.loader = true;
        booking.auditType = AUDIT_DATE_CHANGE;

        const createBookingObsr = this.bookingService
            .modifyDate(booking)
            .subscribe((response) => {
                if (response.status === 200) {
                    this.booking = response.body;
                    //Get All Services
                    this.updatePropertyService();
                    this.getAllServices();
                    

                    // this.getBookingById(this.booking.id);
                    if (
                        this.booking.message !== null &&
                        this.booking.message === "success"
                    ) {
                        this.createAuditReport(
                            this.prevBooking,
                            this.booking,
                            AUDIT_DATE_CHANGE
                          );
                        this.presentToast(this.booking.message);
                        this.navCtrl.navigateForward("booking-list");
                        // if (this.roomNumbers.length > 0) {
                        //     this.allowcateRoom();
                        //     loader.dismiss();
                        // } else {
                        //     if (this.bookingStatus === "CHECKEDIN") {
                        //         this.checkin(this.booking);
                        //         loader.dismiss();
                        //     } else {
                        //         this.bookingList();
                        //         this.loader = false;
                        //         loader.dismiss();
                        //     }
                        // }

                        if (this.roomNumbers.length > 0) {
                            this.allowcateRoom();
                        } else {
                            if (
                                this.booking.roomDetails != null &&
                                this.booking.roomDetails != undefined &&
                                this.booking.roomDetails.length > 0
                            ) {
                                this.roomNumbers = this.booking.roomDetails;
                                this.roomInventoryUpdate(this.booking);
                            } else {
                                if (
                                    this.CheckoutBookingTime != null &&
                                    this.CheckoutBookingTime != undefined
                                ) {
                                    this.bookingService
                                        .checkOutStandingAmountByBookingId(this.booking.id)
                                        .subscribe((response) => {
                                            if (response.status === 200) {
                                                let data = response.body;

                                                if (data < 0) {

                                                    this.token.saveBookingDetal(this.booking);
                                                    this.navCtrl.navigateForward(["checkout-detail"]);
                                                } else {
                                                    this.checkoutDialog();
                                                }
                                            }
                                        });
                                } else {
                                    this.presentToast(this.booking.message);
                                    loader.dismiss();
                                }
                            }
                        }


                    } else {
                        this.presentToast(this.booking.message);
                        loader.dismiss();
                    }
                } else {
                    this.presentToast(`Error in updating Booking Details`);
                    // loader.dismiss();
                    this.roomNumbers = this.releaseRoomDetails;
                    this.navCtrl.navigateForward("booking-list");
                    if (
                        this.roomNumbers != null &&
                        this.roomNumbers != undefined &&
                        this.roomNumbers.length > 0
                    ) {
                        this.allowcateRoom();
                    }
                }
            });
    }

    roomInventoryUpdate(row) {
        this.loader = true;
        row.checkoutTime = new Date().getTime();
        this.releaseRoomDetails = row.roomDetails;
        this.bookingService.roomRealese(row).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.loader = false;

                    this.allowcateRoom();
                }
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

    getAllServices() {
        this.bookingService
            .getAllServicesByBooking(this.booking.id)
            .subscribe((response1) => {
                this.booking.services = response1.body;
                // Logger.log(`Services: ${this.booking.services}`);
            });
    }

    async checkoutDialog() {
        this.booking.toDate = this.datepipe.transform(
            this.CheckoutBookingTime,
            "yyyy-MM-dd"
        );
        const modal = await this.modalController.create({
            component: CheckoutDialogComponent,

            componentProps: {
                booking: this.booking,
            },
        });
        modal.onDidDismiss().then((data) => {

        });
        return await modal.present();
    }

    async checkin(row) {
        this.loader = true;
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });
        loader.present();

        if (
            row.roomDetails != null &&
            row.roomDetails != undefined &&
            row.roomDetails.length > 0
        ) {
            for (let i = 0; i < row.roomDetails.length; i++) {
                row.roomDetails[i].roomStatus = "VACANT_READY";
                this.changeRoomStatus(row.roomDetails[i]);
            }

            this.bookingService.checkin(row).subscribe(
                (response) => {
                    if (response.status === 200) {
                        this.bookingList();
                        loader.dismiss();
                        this.loader = false;
                    }
                },
                (error) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 417) {
                            this.loader = false;
                            // this.openErrorSnackBar('Please proceed with offline room allocation and update the booking.');
                            this.presentToast(
                                "Please proceed with offline room allocation and update the booking."
                            );
                            loader.dismiss();
                        }
                    }
                }
            );
        }
        else {
            this.bookingService.checkin(row).subscribe(
                (response) => {
                    if (response.status === 200) {
                        this.bookingList();
                        loader.dismiss();
                        this.loader = false;
                    }
                },
                (error) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 417) {
                            this.loader = false;
                            // this.openErrorSnackBar('Please proceed with offline room allocation and update the booking.');
                            this.presentToast(
                                "Please proceed with offline room allocation and update the booking."
                            );
                            loader.dismiss();
                        }
                    }
                }
            );
        }

    }


    changeRoomStatus(row) {
        this.loader = true;
        row.date = this.datepipe.transform(this.booking.checkinTime, "yyyy-MM-dd");
        row.roomStatus = "VACANT_READY";
        this.propertyService.updateRoomDetailStatusInCheckedInFrom(row).subscribe(
            () => {
                this.loader = false;
            },
            () => { }
        );
    }

    setRoom() {
    }

    async allowcateRoom() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });
        loader.present();

        this.selectedRooms = [];
        this.loader = true;

        for (let num = 0; num < this.roomNumbers.length; num++) {
            this.roomNumbers[num].available = false;
            this.roomNumbers[num].bookingId = this.booking.id;
            this.roomNumbers[num].guestName =
                this.booking.firstName + " " + this.booking.lastName;
        }

        this.booking.roomDetails = this.roomNumbers;

        // this.booking.checkinTime = new Date();
        this.bookingService.roomAllocation(this.booking).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.loader = false;
                    if (this.bookingStatus === "CHECKEDIN") {
                        this.checkin(this.booking);
                        loader.dismiss();
                    } else {
                        this.bookingList();
                        this.loader = false;
                        loader.dismiss();
                    }
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.loader = false;
                        this.presentToast(
                            "Please proceed with offline room allocation and update the booking."
                        );
                        loader.dismiss();
                    }
                }
            }
        );

        // if (this.roomNumbers.length !== this.booking.noOfRooms) {
        //     this.loader = false;
        //     this.presentToast(
        //         `Invalid room selection,Rooms Booked:${this.booking.noOfRooms} but selected:${this.roomNumbers.length}`
        //     );
        // } else {
        //     // for (let num = 0; num < this.roomNumbers.length; num++) {
        //     //     this.selectedRoomDetail = this.roomNumbers[num];
        //     //     const roomdetail: RoomDetailsInterface = {
        //     //         roomNumber: this.selectedRoomDetail.roomNumber,
        //     //         roomId: this.selectedRoomDetail.roomId,
        //     //         available: false,
        //     //         bookingId: this.booking.id,
        //     //         guestName:
        //     //             this.booking.firstName + " " + this.booking.lastName,
        //     //         description: this.selectedRoomDetail.description,
        //     //         roomStatus: "BLOCKED",
        //     //         floorNumber: this.selectedRoomDetail.floorNumber,
        //     //         floorName: this.selectedRoomDetail.floorName,
        //     //         noOfBed: this.selectedRoomDetail.noOfBed,
        //     //         bedType: this.selectedRoomDetail.bedType,
        //     //         bedDescription: this.selectedRoomDetail.bedDescription,
        //     //     };

        //     //     this.selectedRooms.push(roomdetail);
        //     // }
        //     // this.booking.roomDetails = this.selectedRooms;


        // }
    }

    async changeRoom(booking: Booking) {
        booking.auditType = AUDIT_ROOM_CATEGORY_CHANGE;
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });
        loader.present();

        try {
            const toTimeTimestamp = new Date(booking.toTime).getTime();
                        // Convert toDate to "YYYY-MM-DD" format
                        const toDateFormatted = this.datepipe.transform(this.booking.toDate, "yyyy-MM-dd");
                        this.booking.toDate = toDateFormatted
                        // Modify the booking object with the converted values
                        
            const createBookingObsr = this.bookingService
                .modifyRoom(this.booking)
                .subscribe((response) => {
                    if (response.status === 200) {
                        this.booking = response.body;
                        //Get All Services
                        this.getBookingById(this.booking.id);
                        if (
                            this.booking.message !== null &&
                            this.booking.message === "success"
                        ) {
                            this.createAuditReport(
                                this.prevBooking,
                                this.booking,
                                AUDIT_ROOM_CATEGORY_CHANGE
                              );
                            this.presentToast(this.booking.message);

                            if (this.roomNumbers.length > 0) {
                                this.allowcateRoom();
                                loader.dismiss();
                            } else {
                                if (this.bookingStatus === "CHECKEDIN") {
                                    this.checkin(this.booking);
                                    loader.dismiss();
                                } else {
                                    this.bookingList();
                                    loader.dismiss();
                                }
                            }
                        } else {
                            this.presentToast(this.booking.message);
                            loader.dismiss();
                        }
                    } else {
                        this.presentToast(`Error in updating Booking Details`);
                        loader.dismiss();
                    }
                });
        } catch (error) {
            console.error('Error while modifying room:', error);
            this.presentToast('An error occurred while modifying the room.');
            loader.dismiss();
        }
    }
    createAuditReport(
        prevBooking: Booking,
        currentBooking: Booking,
        operationType: string
      ) {
        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
          this.role.push(item);
        });
    
        let audit = new Audit();
    
        audit.auditType = operationType;
        audit.bookingId = currentBooking.id;
        audit.propertyId = currentBooking.propertyId;
        audit.role = this.role[0];
        audit.updatedAt = new Date().getTime().toString();
        audit.updatedBy = this.PosUserName;
        audit.reservationId = currentBooking.propertyReservationNumber;
    
        if (AUDIT_NEW_BOOKING === operationType) {
          audit.previousValue = "";
          audit.newValue = `Name: ${currentBooking.firstName},Rsvn#:${
            currentBooking.propertyReservationNumber
          },${currentBooking.roomName},rooms:${
            currentBooking.noOfRooms
          },Chk-In:${this.dateService.convertMillisecondsToDateFormat(
            currentBooking.fromDate
          )},Chk-Out:${this.dateService.convertMillisecondsToDateFormat(
            currentBooking.toDate
          )},Amt:${currentBooking.payableAmount}.`;
    
          audit.operatorNotes = "";
          audit.roomId = currentBooking.roomId;
          audit.updateType = "New Booking";
        } else if (AUDIT_ROOM_CATEGORY_CHANGE === operationType) {
          let releaseRoomNo = [];
          if (
            this.releaseRoomDetails != null &&
            this.releaseRoomDetails.length > 0
          ) {
            releaseRoomNo = this.releaseRoomDetails.map(function (item) {
              return item["roomNumber"];
            });
          }
    
          let AllocateRoomNo = [];
          if (this.roomNumbers != null && this.roomNumbers.length > 0) {
            AllocateRoomNo = this.roomNumbers.map(function (item) {
              return item["roomNumber"];
            });
          }
    
          let prevTo = this.getCurrentRoomChangeDate(prevBooking);
          let newFrom = this.getCurrentRoomChangeDate(currentBooking);
    
          // previous value
          audit.previousValue = `${
            prevBooking.roomName
          }, ${this.dateService.convertMillisecondsToDateFormat(
            prevBooking.fromDate
          )} to ${this.datepipe.transform(
            prevTo,
            "dd-MM-yyyy"
          )}, Rooms:${releaseRoomNo.toString()},Room Price/night:${
            prevBooking.roomPrice
          } `;
    
          // new value
          audit.newValue = `${currentBooking.roomName}, ${this.datepipe.transform(
            newFrom,
            "dd-MM-yyyy"
          )} to ${this.dateService.convertMillisecondsToDateFormat(
            currentBooking.toDate
          )}, Rooms:${AllocateRoomNo.toString()}, Room Price/night:${
            currentBooking.roomPrice
          }}`;
    
          audit.operatorNotes = currentBooking.operatorNotes;
          audit.roomId = currentBooking.roomId;
          audit.updateType = "Room Change";
        } else if (AUDIT_DATE_CHANGE === operationType) {
          audit.previousValue = `Chk-In:${this.dateService.convertMillisecondsToDateFormat(
            prevBooking.fromDate
          )},Chk-Out:${this.dateService.convertMillisecondsToDateFormat(
            prevBooking.toDate
          )}.`;
    
          audit.newValue = `Chk-In:${this.dateService.convertMillisecondsToDateFormat(
            currentBooking.fromDate
          )},Chk-Out:${this.dateService.convertMillisecondsToDateFormat(
            currentBooking.toDate
          )}.`;
    
          audit.operatorNotes = currentBooking.operatorNotes;
    
          audit.roomId = currentBooking.roomId;
          audit.updateType = "Date Change";
        } else if (AUDIT_GUEST_DETAILS_UPDATE === operationType) {
          audit.previousValue = `No Of Persons : ${prevBooking.noOfPersons}, and no of Childrens : ${prevBooking.noOfChildren}.`;
          audit.newValue = `No Of Persons : ${currentBooking.noOfPersons}, and no of Childrens : ${currentBooking.noOfChildren}.`;
          audit.operatorNotes = currentBooking.operatorNotes;
    
          audit.roomId = currentBooking.roomId;
          audit.updateType = "Room Change";
        }
        this.loader = true;
        this.propertyService.createAuditReport(audit).subscribe(
          (data) => {
            this.loader = false;
            if (AUDIT_GUEST_DETAILS_UPDATE === operationType) {
              this._location.back();
            }
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            this.loader = false;
          }
        );
      }
    
     
  getCurrentRoomChangeDate(booking) {
    let bookingTodate = this.datepipe.transform(booking.toDate, "yyyy-MM-dd");
    let bookingFromDate = this.datepipe.transform(
      booking.fromDate,
      "yyyy-MM-dd"
    );

    if (new Date(bookingFromDate).getTime() >= new Date().getTime()) {
      return booking.fromDate;
    } else if (new Date(bookingTodate).getTime() <= new Date().getTime()) {
      return booking.toDate;
    } else if (
      new Date(bookingFromDate).getTime() < new Date().getTime() &&
      new Date(bookingTodate).getTime() > new Date().getTime()
    ) {
      return new Date();
    }
  }
    SubMitBooking() {
        Logger.log("ssss");

        this.payment.amount = this.booking.payableAmount;
        this.payment.paymentMode = this.booking.modeOfPayment;
        this.payment.email = this.booking.email;
        this.payment.businessEmail = this.booking.businessEmail;
        this.payment.description = `Accomodation for  ${this.booking.firstName}  at  ${this.booking.businessName}`;
        this.payment.currency = this.token.getProperty().localCurrency;
        this.payment.email = this.booking.email;
        this.payment.name = this.token.getProperty().name;
        this.payment.otherChargesAmount = 0;
        this.payment.netReceivableAmount = this.booking.payableAmount;
        this.payment.businessEmail = this.booking.businessEmail;
        this.payment.taxAmount = 0;
        this.payment.transactionAmount = this.booking.payableAmount;
        this.payment.transactionChargeAmount = 0;
        Logger.log("ssss2");
        if (
            this.booking.modeOfPayment == "BankTransfer" ||
            this.booking.modeOfPayment == "Wallet" ||
            this.booking.modeOfPayment == "Card"
        ) {
            this.payment.status = "Paid";
        } else {
            this.payment.status = "NotPaid";
        }

        if (this.booking.modeOfPayment === "Card") {
            this.chargeCreditCard();
        } else if (this.booking.modeOfPayment != "Card") {
            this.createBooking(this.booking);
        } else if (this.bookingButtonLabel === "Enquire") {
            this.createBooking(this.booking);
        }
    }

    chargeCreditCard() {
        (<any>window).Stripe.card.createToken(
            {
                number: this.payment.cardNumber,
                exp_month: this.payment.expMonth,
                exp_year: this.payment.expYear,
                cvc: this.payment.cvv,
            },
            (status: number, response: any) => {
                if (status === 200) {
                    const token = response.id;
                    this.payment.token = token;
                    this.payment.amount = this.booking.payableAmount;
                    this.payment.currency =
                        this.token.getProperty().localCurrency;
                    this.payment.email = this.booking.email;
                    this.payment.businessEmail = this.booking.businessEmail;
                    this.payment.paymentMode = this.booking.modeOfPayment;
                    this.payment.description = `Accomodation for ${this.booking.firstName} at ${this.booking.businessName}`;
                    this.processPayment(this.payment);
                } else {
                    this.presentToast(
                        "Error message: " + response.error.message
                    );
                    this.isBookButtonDisable = false;
                }
            }
        );
    }
    sendConfirmationMessage(booking: Booking) {
        let msg = new Msg();
        msg.fromNumber = SMS_NUMBER;
        msg.toNumber = this.booking.mobile;
        msg.message = `Dear ${booking.firstName},Rsvn#:${booking.id},${booking.roomName
            },Chk-In:${this.dateService.convertMillisecondsToDateFormat(
                booking.fromDate
            )},Chk-Out:${this.dateService.convertMillisecondsToDateFormat(
                booking.toDate
            )},Amt:${booking.payableAmount}.Thx.${booking.businessEmail},${booking.mobile
            }`;
        Logger.log(msg.message);
        this.notificationService.sendTextMessage(msg).subscribe(
            (response1) => {
                msg = response1.body;
                if (msg.sid !== undefined || msg.sid !== null) {
                    this.presentToast("Booking Confirmation Sent.");
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    this.presentToast("Error in sending sms");
                }
            }
        );
    }
    async createBooking(booking: Booking) {
        Logger.log(
            `Inside Create Booking ${booking}` +
            "--" +
            JSON.stringify(this.booking)
        );

        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();

        this.bookingService.saveBooking(booking).subscribe(
            (response) => {
                loader.dismiss();

                // tslint:disable-next-line: align
                if (response.status === 200) {
                    this.booking = response.body;
                    if (this.booking.id != null) {
                        // if (
                        //     this.booking.mobile !== null &&
                        //     this.booking.mobile !== undefined
                        // ) {
                        //     this.sendConfirmationMessage(this.booking);
                        // }

                        this.isAvailable = true;

                        this.presentToast(
                            "Thanks for the booking .Please note the Reservation No: #" +
                            this.booking.id +
                            " and an email is sent with the booking details."
                        );

                        this.msgs.push({
                            severity: "success",
                            detail: `Thanks for the booking .Please note the Reservation No:  # ${this.booking.id} and an email is sent with the booking details.`,
                        });

                        this.payment.referenceNumber =
                            this.booking.id.toString();
                        this.payment.externalReference =
                            this.booking.externalBookingId;
                        this.payment.propertyId = this.booking.propertyId;
                        this.payment.date =
                            this.dateService.convertMillisecondsToYYYMMDDFormat(
                                new Date().getTime()
                            );
                        Logger.log(
                            "payment create booking : " +
                            JSON.stringify(this.payment)
                        );

                        this.paymentService
                            .savePayment(this.payment)
                            .subscribe((res) => {
                                this.isBookButtonDisable = false;
                                if (res.status === 200) {
                                    this.presentToast("Payment Details Saved");
                                } else {
                                    this.presentToast(
                                        "Error in updating payment details"
                                    );
                                }
                            });

                        this.cancel();

                        this.onCardBookForm.reset();
                        this.onSaveForm.reset();
                        this.onAvailabilityMenuActionForm.reset();
                        this.isBookButtonDisable = false;

                        this.navCtrl.navigateForward("booking-list");
                    } else {
                        this.isBookButtonDisable = false;
                        loader.dismiss();
                        this.msgs.push({
                            severity: "error",
                            summary:
                                "Please check the booking details and try again !",
                        });
                    }
                } else {
                    this.isBookButtonDisable = false;

                    loader.dismiss();
                    this.msgs.push({
                        severity: "error",
                        summary:
                            response.statusText + ":" + response.statusText,
                    });
                }
            },
            (error) => {
                loader.dismiss();
            }
        );
    }

    processPayment(payment: Payment) {
        this.paymentService.processPayment(payment).subscribe((response) => {
            if (response.status === 200) {
                this.payment = response.body;
                Logger.log(`Payment Status:${this.payment.status}`);
                if (this.payment.status === "Paid") {
                    this.presentToast(
                        "Payment processed successfully.Creating booking ..."
                    );

                    this.createBooking(this.booking);
                } else {
                    this.isBookButtonDisable = false;
                    this.presentToast(
                        "ErroCode:" +
                        payment.failureCode +
                        "and Error message :" +
                        payment.failureMessage
                    );
                }
            } else {
                this.isBookButtonDisable = false;
                this.msgs.push({
                    severity: "error",
                    summary:
                        "Seems there is a problem in processing the payment, we have received your booking and will get in touch . !",
                    // this.presentToast('Seems there is a problem in processing the payment, we have received your booking and will get in touch . !');
                });
            }
        });
    }

    getToDate(booking) {
        let bookingTodate = this.datepipe.transform(booking.toDate, "yyyy-MM-dd");

        if (
            booking.toTime != null &&
            booking.toTime != undefined &&
            booking.toTime != "NaN-NaN-NaN"
        ) {
            let bookingToTime = this.datepipe.transform(booking.toTime, "yyyy-MM-dd");

            if (
                new Date(bookingTodate).getTime() < new Date(bookingToTime).getTime()
            ) {
                return bookingToTime;
            } else {
                return bookingTodate;
            }
        } else {
            return bookingTodate;
        }
    }

    async FormSubMit() {
        
        this.calculateBookingAmounts();
        const dateString = Date.parse(this.booking.toDate);
        let date = new Date(this.booking.toDate);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let formattedDate = `${year}-${month}-${day}`;
        this.booking.toDate = formattedDate;

        if (
            this.booking.fromTime != undefined &&
            this.booking.fromTime != null
        ) {
            this.booking.fromTime = new Date(this.booking.fromTime)
                .getTime()
                .toString();
        }

        if (this.booking.toTime != undefined && this.booking.toTime != null) {
            this.booking.toTime = new Date(this.booking.toTime)
                .getTime()
                .toString();
        }

        if (this.statusType === "Add/Remove-Guest") {
            this.changePerson(this.booking);
        } else if (this.statusType === "Date-Change") {
            this.changeDate(this.booking);
        } else if (this.statusType === "Room-Change" || this.statusType === "Plan-Change") {
            this.changeRoom(this.booking);
        } 
        // else if (this.statusType === "Plan-Change") {
        //     this.SaveBooking();
        //     this.changeRoom(this.booking);
        // }
    }

    async SaveBooking() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();

        this.bookingService.saveBooking(this.booking).subscribe(
            (response) => {
                Logger.log("response: " + JSON.stringify(response));
                if (response.status === 200) {
                    loader.dismiss();
                    this.presentToast("Booking Details Saved");
                    //this.getBookingInfoByID(this.booking.id);
                    this.bookingList();
                } else {
                    loader.dismiss();
                    this.presentToast("Error in updating Booking Details");
                }
            },
            (error) => {
                loader.dismiss();
                this.presentToast("Error in updating Booking Details");
                Logger.log("error status: " + error.status);
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

    getUTCDateToDate(dateString: string) {
        var yearAndMonth = dateString?.split("-", 3);
        Logger.log(yearAndMonth + " --" + yearAndMonth[2]?.split("T", 1));

        return (
            yearAndMonth[0] +
            "-" +
            yearAndMonth[1] +
            "-" +
            yearAndMonth[2]?.split("T", 1)
        );
    }

    // calculation of booking
    paymentListRefresh(bookingReferenceNumber: string) {
        this.payments = [];
        this.paymentsFilter = [];
        this.paymentService
            .findPaymentByReferenceNumber(bookingReferenceNumber)
            .subscribe((res) => {
                this.payments = res;
                this.paymentsFilter = res;
            });
    }

    getBalaneAmountInCredit() {
        return (
            this.getPayableAmountInCredit() - this.getReceivedAmountInCredit()
        );
    }

    getPayableAmountInCredit() {
        return (
            this.booking.payableAmount +
            this.booking.totalServiceAmount +
            this.booking.totalExpenseAmount
        );
    }

    getReceivedAmountInCredit() {
        return (
            this.booking.roomTariffPaid +
            this.booking.serviceAmountPaid -
            this.getTotalCreditSettle() -
            this.getBookingRefundAmount()
        );
    }

    getTotalCreditSettle() {
        return this.getTotalPaymentAmountByMOPAndStatus("Credit", "Paid");
    }

    getBookingRefundAmount() {
        return this.getTotalExpenseBookingRefundPaymentByBookingPayment(
            this.payments
        );
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

    getTotalPaymentAmountByMOPAndStatus(paymentMode: string, status: string) {
        let sum = 0;

        if (
            this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status) !=
            null &&
            this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status) !=
            undefined &&
            this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status)
                .length > 0
        ) {
            for (
                let i = 0;
                i <
                this.getPaymentDataByModeOfPaymentAndStatus(paymentMode, status)
                    .length;
                i++
            ) {
                sum =
                    sum +
                    this.getPaymentDataByModeOfPaymentAndStatus(
                        paymentMode,
                        status
                    )[i].transactionAmount;
            }
        }
        return sum;
    }

    getPaymentDataByModeOfPaymentAndStatus(
        paymentMode: string,
        status: string
    ) {
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

    getAmount(row) {
        if (row != null && row != undefined) {
            return row;
        } else {
            return 0;
        }
    }

    getCommitionAmount() {
        return (
            this.getAmount(this.booking.bookingCommissionAmount) +
            this.getAmount(this.booking.tcsFee) +
            this.getAmount(this.booking.tdsFee)
        );
    }
}