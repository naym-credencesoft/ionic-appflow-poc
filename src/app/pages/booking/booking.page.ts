import { PropertyService } from "src/app/service/property/property.service";
import { ReservationService } from "./../../service/ReservationService/reservation-service.service";
import { HttpErrorResponse } from "@angular/common/http";
import { addDays } from 'date-fns';
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
    LoadingController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { Location } from "@angular/common";
import { Property } from "src/app/model/property/Property";
import { TaxDetails } from "src/app/model/TaxDetail/TaxDetails";
import { MobileWallet } from "src/app/model/wallet/mobileWallet";
import { Payment } from "../../model/manage-booking/Payment/Payment";
import { Room } from "../../model/room";
import { TranslateProvider } from "../../providers";
import { DateService } from "../../service/DateService/date-service.service";
import { Logger } from "../../service/logger.service";
import { BookingService } from "../../service/manage-booking/booking-service.service";
import { PaymentService } from "../../service/payment/payment.service";
import { BankAccount } from "../business-setting/bank-details/BankAccount";
import {
    AUDIT_CHECK_IN,
    AUDIT_DATE_CHANGE,
    AUDIT_GUEST_DETAILS_UPDATE,
    AUDIT_NEW_BOOKING,
    AUDIT_ROOM_CATEGORY_CHANGE,
    EXTRAADULT,
    EXTRACHILD,
    PhoneNumberEXP,
    SMS_NUMBER,
} from "./../../app.component";
import { Booking } from "./../../model/manage-booking/Booking/Booking";
import { Msg } from "./../../model/manage-booking/Msg/Msg";
import { AuthService } from "./../../service/auth.service";
import { NotificationService } from "./../../service/NotificationService/notification.service";
import { TokenStorage } from "./../../token.storage";
import { Plan } from "./plan";
import { BusinessService } from "src/app/model/Reservation/businessServic";
import { PointOfSale } from "src/app/model/Pos/pointOfSale";
import { CountryCode } from "src/app/model/countryCode";
import { OrderService } from "src/app/service/Order/order.service";
import { RoomDetails } from "src/app/model/RoomDetails/RoomDetails";
import { ExternalSiteList } from "src/app/model/Booking/externalSiteList";
import { OTAChannelPropertyDTO } from "src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO";
import { PropertiesOnlineTravelAgencies } from "src/app/model/Booking/propertiesOTA";
import { CustomerService } from "src/app/service/Customer/customer.service";
import { Customer } from "src/app/model/Customer/customer";
import { PropertyPayment } from "src/app/model/PropertyPayment/propertyPayment";
import { Todos } from "../todos/todos";
import { OTAPlan } from "src/app/model/otaPlan/otaPlan";
import { DatePipe } from "@angular/common";
import { ApplicationUser } from "src/app/model/user";
import { CheckUserType } from "src/app/model/checkUserType";
import { PropertySequence } from "./propertySequence";
import { PropertyServiceDTO } from "src/app/model/property/PropertyServices";
import { Service } from "src/app/model/manage-booking/Service/Service";
import { Audit } from "src/app/service/audit";

export interface SplitTaxDTO {
    name: string;
    percentage: number;
    taxAmount: number;
}

@Component({
    selector: "app-booking",
    templateUrl: "./booking.page.html",
    styleUrls: ["./booking.page.scss"],
})
export class BookingPage implements OnInit {
    onCardBookForm: FormGroup;
    onTRForm: FormGroup;
    onSaveForm: FormGroup;
    onPaymentForm: FormGroup;
    onPriceForm: FormGroup;
    onbankForm: FormGroup;
    onWalletForm: FormGroup;
    onAvailabilityForm: FormGroup;
    rooms: Room[];
    msgs: any[] = [];
    booking: Booking;
    bookingRoom: Booking;
    payment: Payment;
    isSuccess: boolean = false;
    taxPercentage: number;
    minDate: string;
    maxDate: string;
    toMinDate: string;
    toMaxDate: string;

    currentMonth: string;
    currentDay: string;
    bookingButtonLabel: string;

    isBookButtonDisable: boolean = false;
    isCard: boolean = false;
    isPersonAvailable: boolean = true;
    isRoomAvailable: boolean = true;
    isAvailable: boolean = true;

    property: Property;
    plan: Plan;

    PlanControll: FormControl = new FormControl();
    RoomType: FormControl = new FormControl();
    bookingToDate: FormControl = new FormControl();
    bookingFromDate: FormControl = new FormControl(new Date());
    externalSite: FormControl = new FormControl();
    externalBookingID: FormControl = new FormControl();
    notes: FormControl = new FormControl();
    CounterNumber: FormControl = new FormControl();
    OperatorName: FormControl = new FormControl();
    DiscountPercentage: FormControl = new FormControl();
    RoomPlanChangeAmount: FormControl = new FormControl();
    ExtraPersonChange: FormControl = new FormControl();
    ExtraChildChange: FormControl = new FormControl();
    conveninceFeeChangeAmount: FormControl = new FormControl();
    roomPlanChangeAmountTotalPrice: FormControl = new FormControl();
    TDSAmount: FormControl = new FormControl();
    ComissionFeeChangeAmount: FormControl = new FormControl();
    TCSAmount: FormControl = new FormControl();
    paymentMode: FormControl = new FormControl();
    advanceAmount: FormControl = new FormControl();
    bookingPaymentMode: FormControl = new FormControl();
    ExpectArrivaingDate: FormControl = new FormControl();
    ExpectDepartingDate: FormControl = new FormControl();

    cardNumber: FormControl = new FormControl();
    name: FormControl = new FormControl();
    cvv: FormControl = new FormControl();
    expYear: FormControl = new FormControl();
    expMonth: FormControl = new FormControl();

    plans: Plan[];
    plans2: Plan[];
    planCodes: Plan[];

    loader: boolean = false;

    isPlanAvailable: boolean = false;
    isDateSelected: boolean = false;

    isProgressing: boolean = false;

    bankAccount: BankAccount;
    isBankTransferAvailable: boolean = false;
    mobileWallet: MobileWallet;
    isWalletAvailable: boolean = false;

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
    businessPlan: string;
    taxType: string = "withgst";

    RoomId: number;
    roomDetailsReceived: boolean = false;

    room: Room;
    isGstNumber: boolean = false;
    differenceDay: number;
    bookingRoomPrice: number;
    PlanRoomPrice: number;

    totalSplitTax: SplitTaxDTO[] = [];
    propertyTaxDetails: TaxDetails[];
    taxDetailsSelected: TaxDetails[] = [];
    advancePaidAmount: number = 0;

    businessServices: BusinessService[] = [];
    businessService: BusinessService;
    afterDiscountAmount: number;

    isAdvancedAmountChange: boolean = false;
    isDisabledBookingPaymentStatus: boolean = false;
    currency: string;
    isDiscountEditMode: boolean = false;
    isDiscountAmountChangeRq: boolean = true;
    discountPriceBeforeEdit: number;
    isDataChanged: boolean = false;
    isSelectionDisabled: boolean = false;

    isExtraPersonCharge: boolean = false;
    isExtraChildCharge: boolean = false;
    isPriceEditMode: boolean = false;
    isPlanAmountChangeRq: boolean = true;
    priceBeforeChanged: any;

    advancedPayment: Payment;

    pointOfSaleList: PointOfSale[];
    pointOfSaleListFilter: PointOfSale[];
    pointOfSale: PointOfSale;

    isCustomercheck: boolean = false;
    selecion: string = "fn";
    searchResult: string;

    onEmailCheckForm: FormGroup;
    onPhoneCheckForm: FormGroup;

    CodeNumber: string;
    countryCode: CountryCode;

    countryCodeC: FormControl = new FormControl();
    PhoneC: FormControl = new FormControl();
    EmailCheck: FormControl = new FormControl();

    usercheckSelection: FormControl = new FormControl();
    CodeNumberControll: FormControl = new FormControl();

    CustomerMobileNumber: string;
    isCustomerInfoViewOnly: boolean = false;
    isEmailReadOnly: boolean = false;
    isPhoneReadOnly: boolean = false;
    selectRoomDetail: RoomDetails;

    externalSiteList: ExternalSiteList;
    otaChannelId: number;

    propertydetails: OTAChannelPropertyDTO;
    propertyOTADetails: PropertiesOnlineTravelAgencies;
    propertyOTA: PropertiesOnlineTravelAgencies[];

    isConveninceFeeChangeRq: boolean = false;
    isPaymentConveninceFee: boolean = false;
    isConvienceFeeEditMode: boolean = false;

    isBConveninceFeeChangeRq: boolean = false;
    isPaymentBConveninceFee: boolean = false;
    isBConvienceFeeEditMode: boolean = false;

    isTotalPriceEditMode: boolean = false;
    isTotalPriceSelectionDisabled: boolean = false;
    isDataChangedTotalPrice: boolean = false;

    totalPriceBeforeChanged: any;
    tempTaxAmount: any;
    roomOnlyPricePerNight: any;

    isShowNameList: boolean = false;
    customers: Customer[];

    bookingExtraChildCharge: number = -1;
    bookingExtraPersonCharge: number = -1;
    totalPlanAmount: number;
    taxBeforeChanged: number;
    payableAmountChange: any;

    isEnquieryBooking: boolean = false;
    onlyTaxAmount: number = 0;
    propertyPaymentList: PropertyPayment[] = [];
    businessType: string;
    isNetOrPayableAmountChange: boolean = false;

    isTCSFeeChangeRq: boolean = false;
    isPaymentTCSFee: boolean = false;
    isTCSEditMode: boolean = false;

    isTDSFeeChangeRq: boolean = false;
    isPaymentTDSFee: boolean = false;
    isTDSEditMode: boolean = false;

    todos: Todos;
    otaPlans: OTAPlan[];
    bookingStatus: string;
    userData: ApplicationUser;
    propertySequencesList: PropertySequence[] = [];
    propertySequence: PropertySequence;
    currentIndex: number = 0;
    isPlanAmountEditMode: boolean = false;
    checkUserType: CheckUserType;
    role: any = [];

    isAvailabilityDone: boolean = false;
    currentDateTime: string;

    planPropertyServicesList: PropertyServiceDTO[] = [];
    planPropertyServicesAdult: PropertyServiceDTO;
    planPropertyServicesChild: PropertyServiceDTO;

    servicesAdult: Service;
    servicesChild: Service;
    planBookingServicesList: Service[] = [];
    roomBooking: boolean = false;
    PosUserName: string;
    maxDiscountPercentage: any;
    discountDisabled: boolean = false;

    constructor(
        private paymentService: PaymentService,
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
        public token: TokenStorage,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private formBuilder: FormBuilder
    ) {
        this.todos = new Todos();
        this.payment = new Payment();
        this.booking = new Booking();
        this.bookingRoom = new Booking();
        this.plan = new Plan();
        this.bankAccount = new BankAccount();
        this.room = new Room();
        this.businessService = new BusinessService();
        this.countryCode = new CountryCode();
        this.pointOfSale = new PointOfSale();
        this.selectRoomDetail = new RoomDetails();
        this.externalSiteList = new ExternalSiteList();
        this.propertydetails = new OTAChannelPropertyDTO();
        this.propertyOTADetails = new PropertiesOnlineTravelAgencies();
        this.userData = new ApplicationUser();
        this.checkUserType = new CheckUserType();
        this.planPropertyServicesAdult = new PropertyServiceDTO();
        this.planPropertyServicesChild = new PropertyServiceDTO();
        this.servicesAdult = new Service();
        this.servicesChild = new Service();

        this.rooms = this.token.getRoomTypes();

        this.property = new Property();
        this.property = this.token.getProperty();

        this.checkDefaultCountryCode();

        if (
            this.property.localCurrency != undefined &&
            this.property.localCurrency != null
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }

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

        // if (this.token.getBookingDetal() != null) {
        //     this.booking = this.token.getBookingDetal();
        //     Logger.log('this.booking '+JSON.stringify(this.booking));
        //     this.token.claerBookingDetal();
        // }

        this.onTRForm = this.formBuilder.group({
            TransactionReferenceNumber: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
        });

        this.onPhoneCheckForm = this.formBuilder.group({
            countryCodeC: ["", Validators.compose([Validators.nullValidator])],
            CodeNumberControll: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            PhoneC: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],
        });

        this.onEmailCheckForm = this.formBuilder.group({
            EmailCheck: ["", Validators.compose([Validators.email])],
        });

        this.onAvailabilityForm = this.formBuilder.group({
            RoomType: ["", Validators.compose([Validators.required])],
            PlanControll: ["", Validators.compose([Validators.required])],
            bookingFromDate: ["", Validators.compose([Validators.required])],
            bookingToDate: ["", Validators.compose([Validators.required])],
            RoomNo: ["", Validators.compose([Validators.required])],
            PersonNo: ["", Validators.compose([Validators.required])],
            ChildrenNo: ["", Validators.compose([Validators.nullValidator])],
            externalSite: ["", Validators.compose([Validators.required])],
            externalBookingID: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
        });

        this.onPriceForm = this.formBuilder.group({
            PlanAmountChange: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            TCSAmount: ["", Validators.compose([Validators.nullValidator])],
            TDSAmount: ["", Validators.compose([Validators.nullValidator])],
            ComissionFeeChangeAmount: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            roomPlanChangeAmountTotalPrice: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            ExtraPersonChange: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            ExtraChildChange: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            conveninceFeeChangeAmount: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            RoomPlanChangeAmount: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],

            DiscountPercentage: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
        });

        this.onPaymentForm = this.formBuilder.group({
            advanceAmount: ["", Validators.compose([Validators.nullValidator])],
            paymentMode: ["", Validators.compose([Validators.required])],
            bookingPaymentMode: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
        });

        this.onSaveForm = this.formBuilder.group({
            firstName: ["", Validators.compose([Validators.required])],
            lastName: ["", Validators.compose([Validators.required])],
            email: [
                "",
                Validators.compose([
                    // Validators.pattern(
                    //     "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
                    // ),
                    Validators.nullValidator,
                    Validators.email,
                ]),
            ],
            mobile: ["", Validators.compose([Validators.nullValidator])],
            countryCodeC: ["", Validators.compose([Validators.nullValidator])],
            CodeNumberControll: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            PhoneC: [
                "",
                Validators.compose([
                    Validators.nullValidator,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],

            notes: ["", Validators.compose([Validators.nullValidator])],
            CounterNumber: ["", Validators.compose([Validators.nullValidator])],
            OperatorName: ["", Validators.compose([Validators.nullValidator])],
            usercheckSelection: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            nameSearchController: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            ExpectArrivaingDate: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            ExpectDepartingDate: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
        });

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

        //........

        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.userData = resp.body;
                this.booking.businessEmail = resp.body.username;
                this.booking.businessName = resp.body.businessName;
                this.PosUserName = this.userData.firstName + " " + this.userData.lastName;
                if (
                    this.userData.maxBookingDiscountPercentage != null &&
                    this.userData.maxBookingDiscountPercentage != undefined &&
                    this.userData.maxBookingDiscountPercentage > 0
                  ) {
                    this.maxDiscountPercentage = this.userData.maxBookingDiscountPercentage;
                  } else {
                    this.maxDiscountPercentage = 100;
                  }
            });
        this.getPropertySequence(this.token.getProperty().id);
        this.setCalenderDateLimit();
        this.getAllBusinessService();
    }
    ngOnInit() {


        //
        this.currentDateTime = this.datepipe.transform(new Date(), "HH:mm");
        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });

        this.businessType = this.token.getProperty().businessType;
        this.getAllPropertyPayment(this.token.getProperty().id);

     

        if (
            this.property.gstNumber === undefined ||
            this.property.gstNumber === null ||
            this.property.gstNumber === ""
        ) {
            this.taxType = "withoutgst";
        } else {
            this.taxType = "withgst";
            this.isGstNumber = true;
        }

        if (this.booking.id == null || this.booking.id == undefined) {
            this.booking.modeOfPayment = "Cash";
            this.booking.noOfRooms = 1;
            this.booking.noOfPersons = 1;
        }

        this.getPOSInformation(this.property.id);
        this.getConfiguredPropertyDetailsByPropertyId(
            this.token.getProperty().id
        );
    }

    ionViewWillEnter(){
        this.acRoute.queryParams.subscribe((params) => {
            if (params["bookingOb"] != undefined) {
                let bookingob = JSON.parse(params["bookingOb"]);
                this.booking.id = bookingob.id;
                this.roomDetailsReceived = true;
                this.RoomId = bookingob.roomId;
                this.booking.roomId = bookingob.roomId;
                this.booking.roomRatePlanName = bookingob.roomRatePlanName;
                this.setRoom(this.RoomId);
                this.booking = bookingob;
                this.booking.fromDate =
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        bookingob.fromDate
                    );                    
                this.isEnquieryBooking = false; 
                this.booking.toDate =
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        bookingob.toDate
                    );

                    if (
                        this.booking.fromTime != null &&
                        this.booking.fromTime != undefined
                    ) {
                        this.booking.fromTime = this.datepipe.transform(
                            this.booking.fromTime,
                            "yyyy-MM-ddTHH:mm"
                        );
                    }
    
                    if (
                        this.booking.toTime != null &&
                        this.booking.toTime != undefined
                    ) {
                        this.booking.toTime = this.datepipe.transform(
                            this.booking.toTime,
                            "yyyy-MM-ddTHH:mm"
                        );
                    }
                this.getCustomerDetails(this.booking.customerId);
                this.bookingStatus = this.booking.bookingStatus;
                // this.setPlan(this.booking.roomRatePlanName);
            }
            if (params["todosBookingOb"] != undefined) {
                this.bookingRoom = JSON.parse(params["todosBookingOb"]);
                this.bookingStatus = this.bookingRoom.bookingStatus;
                this.RoomId = this.bookingRoom.roomId;
                this.setRoom(this.RoomId);
                this.booking.roomBooking = this.bookingRoom.roomBooking;
                this.booking.noOfRooms = this.bookingRoom.noOfRooms;
                this.booking.id = null;

                this.booking.fromDate =
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        this.bookingRoom.fromDate
                    );
                this.booking.toDate =
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        this.bookingRoom.toDate
                    );
                    if (
                        this.booking.fromTime != null &&
                        this.booking.fromTime != undefined
                    ) {
                        this.booking.fromTime = this.datepipe.transform(
                            this.booking.fromTime,
                            "yyyy-MM-ddTHH:mm"
                        );
                    }
    
                    if (
                        this.booking.toTime != null &&
                        this.booking.toTime != undefined
                    ) {
                        this.booking.toTime = this.datepipe.transform(
                            this.booking.toTime,
                            "yyyy-MM-ddTHH:mm"
                        );
                    }
                this.booking.businessEmail = this.bookingRoom.businessEmail;
                this.booking.businessName = this.bookingRoom.businessName;
                this.booking.roomBooking = this.bookingRoom.roomBooking;
                this.booking.roomId = this.bookingRoom.roomId;
                this.booking.email = this.bookingRoom.email;
                this.booking.mobile = this.bookingRoom.mobile;
                this.booking.noOfPersons = this.bookingRoom.noOfPersons;
                this.booking.todoNotes = this.bookingRoom.notes;
                this.booking.noOfChildren = this.bookingRoom.noOfChildren;
                this.booking.propertyId = this.bookingRoom.propertyId;

                this.booking.firstName = this.bookingRoom.firstName;
                this.booking.lastName = this.bookingRoom.lastName;

                this.booking.customerImageurl =
                    this.bookingRoom.customerImageurl;

                if (
                    this.booking.roomDetails != null &&
                    this.booking.roomDetails != undefined
                ) {
                    this.selectRoomDetail = this.booking.roomDetails[0];
                    this.booking.roomDetails = null;
                    this.setRoom(this.booking.roomId);
                }

                this.booking.customerId = this.bookingRoom.customerId;
                if (this.booking.customerId != null) {
                    this.getCustomerDetails(this.booking.customerId);
                } else if (this.booking.email != null) {
                    this.selecion = "Email";
                    this.customerLookup();
                } else if (this.booking.mobile != null) {
                    if (
                        this.booking.mobile != null &&
                        this.booking.mobile != undefined
                    ) {
                        this.setMobileNumberByCode(this.booking.mobile);
                    }
                    this.selecion = "Phone";
                    this.customerLookup();
                } else {
                    this.isCustomercheck = true;
                }

                this.booking.todosId = this.bookingRoom.todosId;
                if (this.booking.todosId != null) {
                    this.getTodosById(this.booking.todosId);
                }
            }
            if (params["RoomBooking"] != undefined) {
                this.bookingRoom = JSON.parse(params["RoomBooking"]);
                this.RoomId = this.bookingRoom.roomId;
                this.roomDetailsReceived = true;
                const tomorrowDate = addDays(new Date(), 1);

                this.setRoom(this.RoomId);
                this.booking.roomBooking = this.bookingRoom.roomBooking;
                this.booking.noOfRooms = this.bookingRoom.noOfRooms;
                this.booking.id = null;

                this.roomBooking = true;

                this.booking.fromDate =
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        this.bookingRoom.fromDate
                    );
                    this.booking.toDate =  this.dateService.convertMillisecondsToYYYMMDDFormat(
                        this.bookingRoom.toDate
                    );
                    if (
                        this.booking.fromTime != null &&
                        this.booking.fromTime != undefined
                    ) {
                        this.booking.fromTime = this.datepipe.transform(
                            this.booking.fromTime,
                            "yyyy-MM-ddTHH:mm"
                        );
                    }
    
                    if (
                        this.booking.toTime != null &&
                        this.booking.toTime != undefined
                    ) {
                        this.booking.toTime = this.datepipe.transform(
                            this.booking.toTime,
                            "yyyy-MM-ddTHH:mm"
                        );
                    }
                if (this.booking.noOfRooms == null || this.booking.noOfRooms == undefined) {
                    this.booking.noOfRooms = 1;
                }

                if (this.booking.noOfPersons == null || this.booking.noOfPersons == undefined) {
                    this.booking.noOfPersons = 1;
                }

                if (this.otaChannelId == null || this.otaChannelId == undefined) {
                    this.otaChannelId = -2;
                    this.getOTAPropertyDetails(this.otaChannelId);
                }

                this.fromDateChange();
                this.bookingStatus = this.bookingRoom.bookingStatus;
                this.selectRoomDetail = this.bookingRoom.roomDetails[0];
            } else if (params["bookingId"] != undefined) {
                this.getBookingById(params["bookingId"]);
            } else if (params["datechange"] != undefined) {
                this.getBookingById(params["datechange"]);
            } else if (params["status"] != undefined) {
                if (
                    params["status"] != null &&
                    params["status"] != undefined &&
                    params["status"] === "enquiry"
                ) {
                    this.isEnquieryBooking = true;
                }
            }  
            console.log("this.isEnquieryBooking", this.isEnquieryBooking)
        });
        this.getPOSInformation(this.property.id);
        this.getConfiguredPropertyDetailsByPropertyId(
            this.token.getProperty().id
        );
    }


    getPropertySequence(propertyId: number) {
        this.loader = true;
        this.propertyService.getPropertySequence(propertyId).subscribe(
            (data) => {
                this.propertySequencesList = data.body;

                this.propertySequence = this.propertySequencesList.find(
                    (data) => data.name === "BOOKING"
                );
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    onchangeChildCharge(beforeCharge) {
        this.isExtraChildCharge = true;
        this.bookingExtraChildCharge = beforeCharge;
    }

    onchangeExtraChild() {
        this.isExtraChildCharge = false;
        this.booking.extraChildCharge = this.bookingExtraChildCharge;
    }

    onchangePersonCharge(beforeCharge) {
        this.bookingExtraPersonCharge = beforeCharge;
        this.isExtraPersonCharge = true;
    }
    onchangeExtraPerson() {
        this.isExtraPersonCharge = false;
        this.booking.extraPersonCharge = this.bookingExtraPersonCharge;
    }

    back() {
        this._location.back();
    }

    getTodosById(id: number) {
        this.loader = true;
        this.bookingService.getTodosById(id).subscribe(
            (data) => {
                this.loader = false;
                if (data.body != null && data.body != undefined) {
                    this.todos = data.body;
                }
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    IsActive(mode) {
        if (
            mode === "Wallet" &&
            this.token.getProperty().mobileWallet != undefined &&
            this.token.getProperty().mobileWallet != null
        ) {
            return true;
        } else if (
            (mode === "Cheque" ||
                mode === "DemandDraft" ||
                mode === "Credit") &&
            this.businessType === "Accommodation"
        ) {
            return true;
        } else if (
            mode != "Wallet" &&
            mode != "Cheque" &&
            mode != "DemandDraft"
        ) {
            return true;
        } else {
            return false;
        }
    }

    getAllPropertyPayment(propertyId: number) {
        this.paymentService.getAllPaymentBypropertyId(propertyId).subscribe(
            (data) => {
                this.propertyPaymentList = data;
                this.changeDetectorRefs.detectChanges();
                // Logger.log(JSON.stringify( this.businessServices));
            },
            (error) => {}
        );
    }
    getCustomerDetails(customerID: number) {
        this.loader = true;
        this.customerService.getCustomerById(String(customerID)).subscribe(
            (response) => {
                this.loader = false;

                if (response.body != null) {
                    this.setCustomerDetails(response.body);

                    this.changeDetectorRefs.detectChanges();
                }
            },
            (error) => {}
        );
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

                    if (
                        this.booking.externalSite != null &&
                        this.booking.externalSite != undefined
                    ) {
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
                        } else {
                            let siteData =
                                this.externalSiteList.externalBookingSites.find(
                                    (data) =>
                                        data.value === this.booking.externalSite
                                );

                            if (siteData != null && siteData != undefined) {
                                this.otaChannelId = siteData.id;
                            }
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

    checkDefaultCountryCode() {
        if (
            this.property.address != undefined &&
            this.property.address != null &&
            this.property.address.country != null &&
            this.property.address.country != undefined
        ) {
            let code = this.countryCode.countries.find(
                (data) =>
                    data.name.toLowerCase() ===
                    this.property.address.country.toLowerCase()
            ).code;

            if (code != undefined) {
                this.CodeNumber = code;
            }
        }
    }

    getPOSInformation(propertyId: number) {
        this.loader = true;
        this.bookingService.getAllPointOfSale(propertyId).subscribe(
            (data) => {
                this.pointOfSaleList = data;
                this.pointOfSaleListFilter = data;
                this.loader = false;

                if (
                    this.booking.counterNumber != null &&
                    this.booking.counterNumber != undefined
                ) {
                    this.pointOfSale = this.pointOfSaleList.find(
                        (data) =>
                            data.counterNumber === this.booking.counterNumber
                    );
                }
                if (this.setDefaultCounter() === false) {
                    this.pointOfSaleList = this.pointOfSaleListFilter;
                  }
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    setDefaultCounter() {
        let isMatch: boolean = false;
        if (
          this.booking.id == null ||
          this.booking.id === undefined ||
          (this.booking.id != null &&
            this.booking.id != undefined &&
            this.booking.operatorName != null &&
            this.booking.operatorName != undefined &&
            this.PosUserName != null &&
            this.PosUserName != undefined &&
            this.booking.operatorName.toLocaleLowerCase() ===
              this.PosUserName.toLocaleLowerCase())
        ) {
          this.pointOfSaleList = this.pointOfSaleListFilter;
          this.pointOfSaleList = this.pointOfSaleList.filter((item) => {
            const searchResult =
              item.operatorName != null &&
              item.operatorName.indexOf(this.PosUserName) > -1;
    
            return searchResult;
          });
    
          if (
            this.pointOfSaleList != null &&
            this.pointOfSaleList != undefined &&
            this.pointOfSaleList.length > 0
          ) {
            for (let i = 0; i < this.pointOfSaleList.length; i++) {
              if (
                this.pointOfSaleList[i].operatorName != null &&
                this.pointOfSaleList[i].operatorName.length
              ) {
                for (
                  let j = 0;
                  j < this.pointOfSaleList[i].operatorName.length;
                  j++
                ) {
                  if (
                    this.pointOfSaleList[i].operatorName[j].toLocaleLowerCase() ===
                    this.PosUserName.toLocaleLowerCase()
                  ) {
                    this.pointOfSale = this.pointOfSaleList[i];
    
                    if (this.booking.id === null || this.booking.id === undefined) {
                      this.booking.counterNumber = this.pointOfSale.counterNumber;
                      this.booking.operatorName = this.PosUserName;
                    }
    
                    this.pointOfSale.operatorName = [];
                    this.pointOfSale.operatorName.push(this.PosUserName);
                    this.pointOfSaleList[i] = this.pointOfSale;
                    isMatch = true;
                  }
                }
              }
            }
          }
        }
    
        return isMatch;
      }

    selection(event) {
        this.customers = [];
        // this.booking.email = undefined;
        // this.booking.mobile = undefined;


        this.isShowNameList = false;
       
        this.onEmailCheckForm.reset();
        this.onPhoneCheckForm.reset();
        this.checkDefaultCountryCode();
        this.searchResult = "";
    }

    countryCodePicker(event) {
        if (this.CodeNumber != undefined) {
            Logger.log(this.CodeNumber);
            this.booking.mobile = undefined;
        }
    }

    searchNewCustomer() {
        this.customers = [];
        this.CustomerMobileNumber = "";
        this.booking.customerId = undefined;
        this.booking.firstName = undefined;
        this.booking.lastName = undefined;
        this.booking.mobile = undefined;
        this.booking.email = undefined;

        this.isCustomerInfoViewOnly = false;
        this.isCustomercheck = false;
        this.isEmailReadOnly = false;
        this.isPhoneReadOnly = false;
        this.isShowNameList = false;
        this.searchResult = "";
    }

    checkUser() {
        this.customerLookup();
    }

    setCustomerDetails(databody) {
        this.booking.customerId = databody.id;
        this.booking.firstName = databody.firstName;
        this.booking.lastName = databody.lastName;
        this.booking.mobile = databody.mobile;
        this.booking.email = databody.email;

        if (this.booking.mobile != null && this.booking.mobile != undefined) {
            this.setMobileNumberByCode(this.booking.mobile);
        }

        this.isCustomerInfoViewOnly = true;
        this.isCustomercheck = true;
        this.changeDetectorRefs.detectChanges();
    }

    addNewOne() {
        this.isCustomercheck = true;
    }

    customerLookup() {
        this.loader = true;

        if (this.selecion === "Email") {
            this.orderService
                .getCustomerDetailsByEmail(this.booking.email)
                .subscribe(
                    (data) => {
                        this.booking.customerId = data.body.id;
                        this.booking.firstName = data.body.firstName;
                        this.booking.lastName = data.body.lastName;
                        this.booking.mobile = data.body.mobile;
                        this.booking.email = data.body.email;

                        if (
                            this.booking.mobile != null &&
                            this.booking.mobile != undefined
                        ) {
                            this.setMobileNumberByCode(this.booking.mobile);
                        }

                        this.isCustomerInfoViewOnly = true;
                        this.isCustomercheck = true;
                        this.loader = false;
                    },
                    (_error) => {
                        if (_error.status === 404) {
                            Logger.log("_error 404");
                        }
                        this.isEmailReadOnly = true;
                        this.isCustomercheck = true;
                        this.loader = false;
                    }
                );
        } else if (this.selecion === "Phone") {
            this.booking.mobile = this.CodeNumber + this.CustomerMobileNumber;
            this.orderService
                .getCustomerDetailsByMobile(this.booking.mobile)
                .subscribe(
                    (data) => {
                        Logger.log("Get customer " + JSON.stringify(data.body));

                        this.booking.customerId = data.body.id;
                        this.booking.firstName = data.body.firstName;
                        this.booking.lastName = data.body.lastName;
                        this.booking.mobile = data.body.mobile;
                        this.booking.email = data.body.email;

                        if (
                            this.booking.mobile != null &&
                            this.booking.mobile != undefined
                        ) {
                            this.setMobileNumberByCode(this.booking.mobile);
                        }

                        this.isCustomerInfoViewOnly = true;
                        this.isCustomercheck = true;
                        this.loader = false;
                    },
                    (_error) => {
                        if (_error.status === 404) {
                            Logger.log("_error 404");
                        }
                        this.isPhoneReadOnly = true;
                        this.isCustomercheck = true;
                        this.loader = false;
                    }
                );
        }
    }

    setMobileNumberByCode(phoneNumber) {
        let countryOb = this.countryCode.countries.find(
            (data) => data.code === phoneNumber.substring(0, data.code.length)
        );

        if (countryOb != undefined) {
            this.CodeNumber = countryOb.code;
            this.CustomerMobileNumber = phoneNumber.substring(
                this.CodeNumber.length
            );
            this.changeDetectorRefs.detectChanges();
        }
    }

    customer2ndLookup() {
        this.loader = true;

        if (
            this.selecion === "Email" &&
            this.CustomerMobileNumber != null &&
            this.CustomerMobileNumber != undefined
        ) {
            this.booking.mobile = this.CodeNumber + this.CustomerMobileNumber;
            this.orderService
                .getCustomerDetailsByMobile(this.booking.mobile)
                .subscribe(
                    (data) => {
                        this.booking.customerId = data.body.id;
                        this.loader = false;
                    },
                    (_error) => {
                        if (_error.status === 404) {
                            Logger.log("_error 404");
                        }
                        this.loader = false;
                    }
                );
        } else if (
            this.selecion === "Phone" &&
            this.booking.email != null &&
            this.booking.email != undefined
        ) {
            this.orderService
                .getCustomerDetailsByEmail(this.booking.email)
                .subscribe(
                    (data) => {
                        this.booking.customerId = data.body.id;
                        this.loader = false;
                    },
                    (_error) => {
                        if (_error.status === 404) {
                            Logger.log("_error 404");
                        }
                        this.loader = false;
                    }
                );
        }
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
                    // Logger.log("totalTaxPercentage  " + totalTaxPercentage);
                    totalTaxAmount =
                        price - price / ((totalTaxPercentage + 100) / 100);
                    //  Logger.log("totalTaxAmount  " + totalTaxAmount);

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

    onchangeEditTotalPrice(priceChange) {
        this.isTotalPriceSelectionDisabled = true;
        this.isTotalPriceEditMode = true;

        this.priceBeforeChanged = priceChange;
        // this.bookingRoomPrice = this.priceBeforeChanged;
        this.taxBeforeChanged = this.booking.taxAmount;
    }

    //

    onchangeEditPrice(priceChange) {
        this.isSelectionDisabled = true;
        this.isPlanAmountChangeRq = false;
        this.isPriceEditMode = true;

        this.priceBeforeChanged = priceChange;
        // this.bookingRoomPrice = this.priceBeforeChanged;
    }

    onchangePrice() {
        this.isSelectionDisabled = true;
        this.isPlanAmountChangeRq = true;
        this.isPriceEditMode = false;
        this.isTotalPriceEditMode = false;
        this.isDataChanged = true;
    }

    amountTotalPayableAmounts(amount) {
        this.payableAmountChange = amount;
    }

    onchangeTotalPrice() {
        this.isTotalPriceSelectionDisabled = true;
        this.isTotalPriceEditMode = false;
        this.isDataChangedTotalPrice = true;
        this.calculateByTotalPayableAmounts(this.payableAmountChange);
    }

    calculateByTotalPayableAmounts(payableAmount) {
        // console.log(
        //     payableAmount +
        //         " payableAmount " +
        //         this.priceBeforeChanged +
        //         " this.bookingRoomPrice" +
        //         this.bookingRoomPrice
        // );
        this.tempTaxAmount =
            (this.taxBeforeChanged * payableAmount) / this.priceBeforeChanged;

        let netAmount = payableAmount - this.tempTaxAmount;
        let discountAmount = this.bookingRoomPrice - netAmount;

        this.booking.discountPercentage = Number(
            (discountAmount / this.bookingRoomPrice) * 100
        );

        this.calculateBookingAmounts();
    }

    onchangeClosedTotalPrice() {
        if (this.isDataChangedTotalPrice === false) {
            this.isTotalPriceSelectionDisabled = false;
        }

        this.isTotalPriceEditMode = false;

        // this.afterDiscountAmount = this.priceBeforeChanged;
        this.booking.payableAmount = this.priceBeforeChanged;

        // this.calculateByTotalPayableAmounts(this.booking.payableAmount);
        this.calculateBookingAmounts();
    }

    onchangeClosedPrice() {
        if (this.isDataChanged === false) {
            this.isSelectionDisabled = false;
        }
        this.isPriceEditMode = false;
        this.isPlanAmountChangeRq = true;
        this.isTotalPriceEditMode = false;
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

    taxSelection(tax) {
        if (this.taxDetailsSelected.some((r) => r.name === tax.name) === true) {
            this.taxDetailsSelected.splice(
                this.taxDetailsSelected.indexOf(tax),
                1
            );
        } else {
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

                    Logger.log(JSON.stringify(this.businessService));

                    if (
                        this.businessService != null &&
                        this.businessService != undefined
                    ) {
                        this.propertyTaxDetails = this.token.getTaxDetails(
                            this.businessService,
                            this.property
                        );

                        if (this.taxDetailsSelected.length === 0) {
                            for (
                                let i = 0;
                                i < this.propertyTaxDetails.length;
                                i++
                            ) {
                                if (
                                    this.propertyTaxDetails[
                                        i
                                    ].name.toLowerCase() === "cgst" ||
                                    this.propertyTaxDetails[
                                        i
                                    ].name.toLowerCase() === "sgst"
                                ) {
                                    this.taxDetailsSelected.push(
                                        this.propertyTaxDetails[i]
                                    );
                                }
                            }
                            //this.taxDetailsSelected.push(this.propertyTaxDetails[0]);
                        }

                        if (
                            this.booking.roomBooking === true &&
                            this.booking.id === undefined
                        ) {
                            let fromDateTime = new Date(this.booking.fromDate);

                            if (
                                this.businessService.twentyFourHoursCheckOut ===
                                false
                            ) {
                                if (
                                    this.businessService.checkInTime != null &&
                                    this.businessService.checkInTime !=
                                        undefined
                                ) {
                                    fromDateTime.setHours(
                                        Number(
                                            this.businessService.checkInTime.split(
                                                ":"
                                            )[0]
                                        )
                                    );
                                    fromDateTime.setMinutes(
                                        Number(
                                            this.businessService.checkInTime.split(
                                                ":"
                                            )[1]
                                        )
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

                            if (
                                fromDateTime != null &&
                                fromDateTime != undefined
                            ) {
                                this.booking.fromTime = this.datepipe.transform(
                                    fromDateTime,
                                    "yyyy-MM-ddTHH:mm"
                                );
                            }

                            let todatetime = new Date(this.booking.toDate);

                            if (
                                this.businessService.twentyFourHoursCheckOut ===
                                false
                            ) {
                                if (
                                    this.businessService.checkOutTime != null &&
                                    this.businessService.checkOutTime !=
                                        undefined
                                ) {
                                    todatetime.setHours(
                                        Number(
                                            this.businessService.checkOutTime.split(
                                                ":"
                                            )[0]
                                        )
                                    );
                                    todatetime.setMinutes(
                                        Number(
                                            this.businessService.checkOutTime.split(
                                                ":"
                                            )[1]
                                        )
                                    );
                                }
                            } else {
                                this.booking.twentyFourHoursCheckOut = true;
                                todatetime.setHours(
                                    Number(this.currentDateTime.split(":")[0])
                                );
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

    setCounter(counterNumber) {
        this.pointOfSale = this.pointOfSaleList.find(
            (data) => data.counterNumber === counterNumber
        );
        this.booking.counterName = this.pointOfSale.counterName;
    }

    getBookingById(bookingId: any) {
        this.bookingService
            .findBooking(bookingId)
            .toPromise()
            .then((b) => {
                this.booking = b.body;

                this.bookingStatus = this.booking.bookingStatus;

                this.bookingExtraChildCharge = this.booking.extraChildCharge;
                this.bookingExtraPersonCharge = this.booking.extraPersonCharge;

                this.booking.fromDate = this.getUTCDateToDate(
                    this.booking.fromDate
                );
                this.booking.toDate = this.getUTCDateToDate(
                    this.booking.toDate
                );

                if (
                    this.booking.advanceAmount != null &&
                    this.booking.advanceAmount != undefined
                ) {
                    this.advancePaidAmount = this.booking.advanceAmount;
                }

                if (
                    this.booking.taxDetails != null &&
                    this.booking.taxDetails != undefined &&
                    this.booking.taxDetails.length > 0
                ) {
                    this.taxDetailsSelected = [];
                    this.taxDetailsSelected = this.booking.taxDetails;
                }

                if (
                    this.booking.mobile != null &&
                    this.booking.mobile != undefined
                ) {
                    this.setMobileNumberByCode(this.booking.mobile);
                }

                if (
                    this.booking.roomTariffBeforeDiscount != null &&
                    this.booking.roomTariffBeforeDiscount != undefined
                ) {
                    this.totalPlanAmount =
                        this.booking.roomTariffBeforeDiscount;
                }

                if (
                    this.booking.taxDetails.length === 0 &&
                    this.booking.taxAmount != null &&
                    this.booking.taxAmount != undefined
                ) {
                    this.onlyTaxAmount = this.booking.taxAmount;
                }

                this.getAllServices();

                this.getPOSInformation(this.property.id);

                if (
                    this.booking.taxDetails != null &&
                    this.booking.taxDetails != undefined &&
                    this.booking.taxDetails.length > 0
                ) {
                    this.taxDetailsSelected = [];
                    this.taxDetailsSelected = this.booking.taxDetails;

                    if (
                        this.taxDetailsSelected.some(
                            (data) => data.name == "TDS"
                        ) == true
                    ) {
                        let tds = this.taxDetailsSelected.find(
                            (data) => data.name == "TDS"
                        );
                        this.booking.tdsFee = tds.taxAmount;
                    }

                    if (
                        this.taxDetailsSelected.some(
                            (data) => data.name == "TCS"
                        ) == true
                    ) {
                        let tcs = this.taxDetailsSelected.find(
                            (data) => data.name == "TCS"
                        );
                        this.booking.tcsFee = tcs.taxAmount;
                    }
                }

                if (
                    this.booking.fromTime != null &&
                    this.booking.fromTime != undefined
                ) {
                    this.booking.fromTime = this.datepipe.transform(
                        this.booking.fromTime,
                        "yyyy-MM-ddTHH:mm"
                    );
                }

                if (
                    this.booking.toTime != null &&
                    this.booking.toTime != undefined
                ) {
                    this.booking.toTime = this.datepipe.transform(
                        this.booking.toTime,
                        "yyyy-MM-ddTHH:mm"
                    );
                }

                this.changeDetectorRefs.detectChanges();
            })
            .catch((e) => {});
    }

    getAllServices() {
        this.bookingService
            .getAllServicesByBooking(this.booking.id)
            .subscribe((response1) => {
                this.booking.services = response1.body;
                this.changeDetectorRefs.detectChanges();
                // Logger.log(`Services: ${this.booking.services}`);
            });
    }

    onCheckOutDateChange() {
        this.plans = this.plans2;
        this.roomPlanSelectByDate();
    }

    setRoom(roomId) {
        this.booking.roomId = roomId;
        Logger.log("roomId " + roomId);
        this.booking.planCode = undefined;
        this.isDateSelected = false;

        if (this.rooms != undefined && this.rooms != null) {
            this.room = this.rooms.find((room) => room.id === roomId);
            if (this.room.hsnCode != null && this.room.hsnCode != undefined) {
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
        }

        this.plans = [];
        this.plans2 = [];
        this.getPlan(roomId);
    }

    clear(event) {}
    applyFilterName(ev: any) {
        let filterValue = ev.target.value;

        //console.log("search -- " + filterValue);
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

        if (filterValue === "") {
            // this.businessServicesFilter = this.businessServices;
            // this.isShowServiceList = false;
            this.isShowNameList = false;
            this.customers = [];
            this.changeDetectorRefs.detectChanges();
        } else if (
            filterValue != null &&
            filterValue != undefined &&
            filterValue.length > 2
        ) {
            
            let namefilter = filterValue;
            let nameLine = namefilter.split(" ");
            if (nameLine.length === 1) {
                this.loader = true
                if (this.selecion === "fn") {
                    this.searchCustomerByFirstName(filterValue);
                } else if (this.selecion === "ln") {
                    this.searchCustomerByLastName(filterValue);
                }
            } else {
            }
        } else {
            this.changeDetectorRefs.detectChanges();
        }
    }
    async searchCustomerByFirstName(firstName: string) {
        try {
            const data = await this.customerService.getCustomerDetailsByFirstNameAndPropertyId(
                firstName,
                this.token.getProperty().id
            ).toPromise();
            
            this.customers = [];
            this.loader = false;
            this.isShowNameList = true;
            this.customers = data.body;
        } catch (error) {
            if (error.status === 404) {
                // Handle 404 error if needed
            }
            this.customers = [];
            this.isShowNameList = false;
        } finally {
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
        }
    }
    

    async searchCustomerByLastName(lastName: string) {
        
        try {
            const data = await this.customerService.getCustomerDetailsByLastNameAndPropertyId(
                lastName,
                this.token.getProperty().id
            ).toPromise();
           this.loader = false;
           this.customers = [];
            this.isShowNameList = true;
            this.customers = data.body;
        } catch (error) {
            if (error.status === 404) {
                // Handle 404 error if needed
            }
            this.customers = [];
        } finally {
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
        }
    }
    

    taxChange(event) {
        Logger.log("discount persentage " + this.booking.discountPercentage);
        //this.calculateBookingAmounts();
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
            let fromdate = this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.fromDate
            );
            let todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.toDate
            );

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

    // created as alternate of  calculateTaxSlab()
    calculateTaxSlabOnBasePrice() {
        this.totalSplitTax = [];
        if (this.taxDetailsSelected.length > 0) {
            this.booking.taxAmount = 0;
            for (let i = 0; i < this.taxDetailsSelected.length; i++) {
                let taxPercentage = this.token.getTaxPercentageByTaxDetail(
                    Math.round(this.roomOnlyPricePerNight),
                    this.taxDetailsSelected[i]
                );

                if (taxPercentage != null && taxPercentage != undefined) {
                    let totalTaxAmount = Math.round(
                        this.bookingRoomPrice * (taxPercentage / 100)
                    );
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
                        this.bookingRoomPrice;

                    this.totalSplitTax.push(tax);
                }
            }
        } else {
            this.booking.taxAmount = this.onlyTaxAmount;
        }
        // Logger.log("this.booking.taxAmount base price " + this.booking.taxAmount);

        this.booking.taxDetails = this.taxDetailsSelected;
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

        
    if (
        (this.booking.discountPercentage != undefined &&
        this.booking.discountPercentage !== null &&
        this.booking.discountPercentage > 0 &&
        (this.maxDiscountPercentage < this.booking.discountPercentage))
      ) {
        this.discountDisabled = true;
      }
      else
      {
        this.discountDisabled = false;
      }
    }

    advancedAmountChange() {
        if (
            this.advancePaidAmount != null &&
            this.advancePaidAmount != undefined &&
            this.advancePaidAmount > 0 &&
            this.booking.payableAmount > this.advancePaidAmount
        ) {
            this.isAdvancedAmountChange = true;
            this.payment.transactionAmount = this.advancePaidAmount;

            this.booking.paymentStatus = "PartiallyPaid";
            this.isDisabledBookingPaymentStatus = true;
        } else if (
            this.advancePaidAmount != null &&
            this.advancePaidAmount != undefined &&
            this.advancePaidAmount > 0 &&
            this.booking.payableAmount <= this.advancePaidAmount
        ) {
            // this.advancePaidAmount = this.booking.payableAmount;
            this.isAdvancedAmountChange = true;
            this.payment.transactionAmount = this.advancePaidAmount;

            this.booking.paymentStatus = "Paid";
            this.isDisabledBookingPaymentStatus = true;
        } else {
            this.booking.paymentStatus = "NotPaid";
            this.isAdvancedAmountChange = false;
            this.isDisabledBookingPaymentStatus = false;
            this.payment.transactionAmount =
                Number(this.booking.payableAmount) -
                Number(this.advancePaidAmount);
        }
    }

    // advancedAmountChange() {
    //     if (
    //         this.advancePaidAmount != null &&
    //         this.advancePaidAmount != undefined &&
    //         this.advancePaidAmount > 0 &&
    //         this.booking.payableAmount > this.advancePaidAmount
    //     ) {
    //         this.isAdvancedAmountChange = true;
    //         this.payment.transactionAmount = this.advancePaidAmount;

    //         this.booking.paymentStatus = "PartiallyPaid";
    //         this.isDisabledBookingPaymentStatus = true;
    //     } else if (
    //         this.advancePaidAmount != null &&
    //         this.advancePaidAmount != undefined &&
    //         this.advancePaidAmount > 0 &&
    //         this.booking.payableAmount <= this.advancePaidAmount
    //     ) {
    //         this.advancePaidAmount = this.booking.payableAmount;
    //         this.isAdvancedAmountChange = true;
    //         this.payment.transactionAmount = this.advancePaidAmount;

    //         this.booking.paymentStatus = "Paid";
    //         this.isDisabledBookingPaymentStatus = true;
    //     } else {
    //         this.booking.paymentStatus = "NotPaid";
    //         this.isAdvancedAmountChange = false;
    //         this.isDisabledBookingPaymentStatus = false;
    //         this.payment.transactionAmount =
    //             Number(this.booking.payableAmount) -
    //             Number(this.advancePaidAmount);
    //     }
    // }

    setDefaultPlanAmount() {
        this.totalPlanAmount = this.plan.amount;
    }

    setExtraPlanPropertyService() {
        let totalPerosn =
            this.getAmount(this.booking.noOfPersons) +
            this.getAmount(this.booking.noOfChildren);
        let totalExtraPerosn =
            this.getAmount(this.booking.noOfExtraChild) +
            this.getAmount(this.booking.noOfExtraPerson);

        let countOfMainPerson =
            (totalPerosn - totalExtraPerosn) *
            this.getAmount(this.booking.noOfNights);

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
                this.planPropertyServicesList[i].taxAmount =
                    this.getServiceValue(
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

            this.planPropertyServicesList.push(this.planPropertyServicesChild);
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

            this.planPropertyServicesList.push(this.planPropertyServicesAdult);
        }
    }

    initPlanPropertyServiceList() {
        if (
            this.plan.propertyServicesList != null &&
            this.plan.propertyServicesList != undefined
        ) {
            for (let i = 0; i < this.plan.propertyServicesList.length; i++) {
                this.plan.propertyServicesList[i].count = 1;
                this.plan.propertyServicesList[i].date =
                    this.datepipe.transform(new Date(), "yyyy-MM-dd");

                this.plan.propertyServicesList[i].servicePrice =
                    this.getServiceValue(
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
                this.plan.propertyServicesList[i].taxAmount =
                    this.getServiceValue(
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

            this.planPropertyServicesAdult =
                this.plan.propertyServicesList.find(
                    (data) =>
                        data.applicableToAdult != null &&
                        data.applicableToAdult === true &&
                        data.name.trim().toLowerCase() ==
                            EXTRAADULT.trim().toLowerCase() &&
                        data.serviceType.toLowerCase() == "food"
                );

            this.planPropertyServicesChild =
                this.plan.propertyServicesList.find(
                    (data) =>
                        data.applicableToChild != null &&
                        data.applicableToChild === true &&
                        data.name.trim().toLowerCase() ==
                            EXTRACHILD.trim().toLowerCase() &&
                        data.serviceType.toLowerCase() == "food"
                );
        }
    }

    setPlan(planName: any) {
        this.plan = this.plans.find((plan) => plan.name === planName);

        if (this.plan != undefined) {
            this.booking.planCode = this.plan.code;
            this.booking.roomRatePlanName = this.plan.name;
            this.totalPlanAmount = this.plan.amount;

            this.initPlanPropertyServiceList();

            if (
                this.plan.checkoutPeriod != null &&
                this.plan.checkoutPeriod != undefined
            ) {
                this.booking.checkoutPeriod = this.plan.checkoutPeriod;

                let currentTime = new Date();
                let todatetime = new Date(this.booking.toDate);
                let fromdatetime = new Date(this.booking.fromDate);

                todatetime.setHours(
                    currentTime.getHours() + Number(this.plan.checkoutPeriod)
                );
                todatetime.setMinutes(currentTime.getMinutes());

                this.booking.toTime = this.datepipe.transform(
                    todatetime,
                    "yyyy-MM-ddTHH:mm"
                );

                fromdatetime.setHours(currentTime.getHours());
                fromdatetime.setMinutes(currentTime.getMinutes());

                this.booking.fromTime = this.datepipe.transform(
                    fromdatetime,
                    "yyyy-MM-ddTHH:mm"
                );
            } else {
                this.booking.checkoutPeriod = null;
            }
            this.changeDetectorRefs.detectChanges();
        }

        if (this.singleDayBooking() === true) {
            this.setCheckOutDateForSameDay();
        }
    }

    PlanChangeBaseOnDate() {
        this.isDateSelected = true;
        this.plans = this.plans2;
        this.roomPlanSelectByDate();

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

    roomPlanSelectByDate() {
        if (
            this.booking.fromDate != undefined &&
            this.booking.toDate != undefined
        ) {
            // let fromdate = new Date(this.booking.fromDate);
            // let todate = new Date(this.booking.toDate);
            //this.isCheckOutDate = true;
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
    checkStatusOfPlan(status) {
        if (status === null || status === undefined) {
            return false;
        } else {
            return status;
        }
    }
    checkSameDayBooking() {
        let sameDayBooking = false;
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
                sameDayBooking = true;
            }
        }

        return sameDayBooking;
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
                        this.booking.roomRatePlanName != undefined &&
                        this.booking.roomRatePlanName != null
                    ) {
                        this.setPlan(this.booking.roomRatePlanName);
                        this.calculateBookingAmounts();
                    }

                    //this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    // Logger.log(JSON.stringify(error));
                    this.loader = false;
                }
            );
    }

    setBookingMOP() {
        if (
            this.advancePaidAmount != null &&
            this.advancePaidAmount != undefined &&
            this.advancePaidAmount > 0
        ) {
            if (this.booking.payableAmount > this.advancePaidAmount) {
                this.booking.paymentStatus = "PartiallyPaid";
            } else if (this.booking.payableAmount <= this.advancePaidAmount) {
                this.booking.paymentStatus = "Paid";
            }

            this.isDisabledBookingPaymentStatus = true;
        } else {
            this.isDisabledBookingPaymentStatus = false;
            if (this.booking.modeOfPayment === "Card") {
                this.booking.paymentStatus = "Paid";
                this.isDisabledBookingPaymentStatus = true;
            } else if (
                this.booking.modeOfPayment === "BankTransfer" ||
                this.booking.modeOfPayment === "Wallet" ||
                this.isPaidPayment(this.booking.modeOfPayment)
            ) {
                this.booking.paymentStatus = "Paid";
                this.isDisabledBookingPaymentStatus = false;
            } else {
                this.booking.paymentStatus = "NotPaid";
                this.isDisabledBookingPaymentStatus = false;
            }
        }
    }

    isPaidPayment(mode) {
        if (
            this.propertyPaymentList.some((data) => data.paymentMode === mode)
        ) {
            let propertyPayment = this.propertyPaymentList.find(
                (data) => data.paymentMode === mode
            );
            if (propertyPayment != undefined) {
                return propertyPayment.isPaid;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    paymentModeChange() {
        if (this.booking.modeOfPayment == "Card") {
            this.isCard = true;
        } else {
            this.isCard = false;
        }
    }

    onPersonQuantityChange(noOfPerson: any) {
        if (
            this.booking.noOfChildren === undefined ||
            this.booking.noOfChildren === null
        ) {
            this.booking.noOfChildren = 0;
        }

        if (this.booking.noOfPersons + this.booking.noOfChildren > noOfPerson) {
            this.isPersonAvailable = false;
        } else {
            this.isPersonAvailable = true;
        }

        this.calculateRoomPrice();
    }
    onRoomQuantityChange(noOfRoom: any) {
        if (this.booking.noOfRooms > noOfRoom) {
            this.isRoomAvailable = false;
        } else {
            this.isRoomAvailable = true;
        }
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
            let fromdate = this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.fromDate
            );
            let todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.booking.toDate
            );

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
                this.bookingExtraPersonCharge > -1
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
                this.bookingExtraChildCharge > -1
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
            this.PlanRoomPrice =
                this.totalPlanAmount * this.differenceDay * noOfRoom;
            this.booking.roomTariffBeforeDiscount = this.totalPlanAmount;
        } else {
            this.bookingRoomPrice = 0;
            this.PlanRoomPrice = 0;
            this.booking.roomTariffBeforeDiscount = 0;
        }

        this.calculateBookingAmounts();

        this.booking.totalRoomTariffBeforeDiscount = this.PlanRoomPrice;

        return this.PlanRoomPrice;
    }

    fromDateChange() {
        let toDate = new Date(this.booking.fromDate);

        toDate.setDate(toDate.getDate());
        this.toMinDate = this.getDate(toDate);

        toDate.setDate(toDate.getDate() + 30);
        this.toMaxDate = this.getDate(toDate);
        this.plans = this.plans2;
        this.roomPlanSelectByDate();

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
    setCalenderDateLimit() {
        let date: Date = new Date();
        this.minDate = this.getDate(date);
        date.setFullYear(date.getFullYear() + 1);
        this.maxDate = this.getDate(date);
    }

    clearInput(): void {
        this.booking.noOfRooms = null;
    }

    clearInputOne(): void {
        this.booking.noOfPersons = null;
    }
    clearInputTwo(): void {
        this.booking.noOfChildren = null;
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
    onSetIndex(index) {
        this.currentIndex = index;
    }
    Reset() {
        if(this.roomDetailsReceived != true) {
            this.RoomId = undefined;
            this.isAvailabilityDone = false;
            this.currentIndex = 0;
            this.isSuccess = false;
            this.isAvailable = true;
            this.plan = new Plan();
            this.booking.groupBooking = false;
            this.isBookButtonDisable = false;
            this.advancePaidAmount = 0;
            this.booking = new Booking();
        } else {
            this.isAvailabilityDone = false;
            this.currentIndex = 0;
            this.isSuccess = false;
            this.isAvailable = true;
            this.plan = new Plan();
            this.booking.groupBooking = false;
            this.isBookButtonDisable = false;
            this.advancePaidAmount = 0;
            this.booking.roomRatePlanName = null;
            this.booking.noOfRooms = null;
            this.booking.noOfPersons = null;
            this.booking.noOfChildren = null;
            this.otaChannelId = null;
        }
  
        
      
    }

    cancel() {
        this.navCtrl.navigateRoot("home");
    }
    ResetAllField() {
        this.Reset();

        this.checkDefaultCountryCode();

        //    this.booking.roomId = undefined;

        this.advancePaidAmount = 0;
        this.isCard = false;
        this.onCardBookForm.reset();
        this.onSaveForm.reset();
        this.onPaymentForm.reset();
        this.onPriceForm.reset();

        this.onAvailabilityForm.enable();
        // document.getElementById("second-content").style.display = "none";
        document.getElementById("first-content").style.display = "block";
    }

    FormSubMit() {
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

        this.isBookButtonDisable = true;

        if (this.isPhoneReadOnly === false) {
            this.booking.mobile = this.CodeNumber + this.CustomerMobileNumber;
        }

        this.customer2ndLookup();

        this.payment.amount = this.booking.payableAmount;
        this.payment.paymentMode = this.booking.modeOfPayment;
        this.payment.email = this.booking.email;
        this.payment.businessEmail = this.booking.businessEmail;
        this.payment.description = `Accomodation for  ${this.booking.firstName}  at  ${this.booking.businessName}`;
        this.payment.currency = this.property.localCurrency;
        this.payment.email = this.booking.email;
        this.payment.name = this.token.getProperty().name;
        this.payment.otherChargesAmount = 0;
        this.payment.netReceivableAmount = this.booking.payableAmount;
        this.payment.businessEmail = this.booking.businessEmail;
        this.payment.taxAmount = 0;
        this.payment.transactionAmount = this.booking.payableAmount;
        this.payment.transactionChargeAmount = 0;

        if (
            this.booking.modeOfPayment == "BankTransfer" ||
            this.booking.modeOfPayment == "Wallet" ||
            this.booking.modeOfPayment == "Card"
        ) {
            this.payment.status = "Paid";
        } else {
            this.payment.status = "NotPaid";
        }

        if (
            this.bookingButtonLabel === "Book" &&
            this.booking.modeOfPayment != null &&
            this.booking.modeOfPayment === "Card"
        ) {
            this.chargeCreditCard();
        } else if (
            this.bookingButtonLabel === "Book" &&
            this.booking.modeOfPayment != null
        ) {
            this.createBooking(this.booking);
        } else if (this.bookingButtonLabel === "Enquire") {
            this.enquireBooking(this.booking);
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
                    if (this.advancePaidAmount > 0) {
                        this.payment.amount = this.advancePaidAmount;
                    } else {
                        this.payment.amount = this.booking.payableAmount;
                    }
                    const token = response.id;
                    this.payment.token = token;
                    this.payment.counterName = this.booking.counterName;
                    this.payment.counterNumber = this.booking.counterNumber;
                    this.payment.operatorName = this.booking.operatorName;
                    this.payment.businessServiceName =
                        this.businessService.name;
                    this.payment.amount = this.booking.payableAmount;
                    this.payment.currency = this.property.localCurrency;
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

    sendConfirmationMessage(booking: Booking) {
        let msg = new Msg();
        msg.fromNumber = SMS_NUMBER;
        msg.toNumber = this.booking.mobile;
        msg.message = `Dear ${booking.firstName},Rsvn#:${booking.id},${
            booking.roomName
        },Chk-In:${this.dateService.convertMillisecondsToDateFormat(
            booking.fromDate
        )},Chk-Out:${this.dateService.convertMillisecondsToDateFormat(
            booking.toDate
        )},Amt:${booking.payableAmount}.Thx.${booking.businessEmail},${
            booking.mobile
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

    async enquireBooking(booking: Booking) {
        if (
            booking.discountPercentage != null &&
            booking.discountPercentage != undefined
        ) {
            booking.discountPercentage = Number(
                booking.discountPercentage.toFixed(4)
            );
        } else {
            booking.discountPercentage = 0;
        }

        booking.advanceAmount = this.advancePaidAmount;

        if (this.advancePaidAmount > 0) {
            booking.outstandingAmount = booking.payableAmount;
            booking.outstandingAmount =
                booking.outstandingAmount - this.advancePaidAmount;
        } else {
            if (booking.paymentStatus === "Paid") {
                booking.outstandingAmount = 0;
                booking.advanceAmount = booking.payableAmount;
            } else if (booking.paymentStatus === "NotPaid") {
                booking.outstandingAmount = booking.payableAmount;
            }
        }

        // const loader = await this.loadingCtrl.create({
        //     duration: 5000,
        // });

        // loader.present();

        this.bookingService.saveEnquire(booking).subscribe(
            (response) => {
                Logger.log(
                    "booking inside response " + JSON.stringify(response)
                );
                // loader.dismiss();

                Logger.log("booking inside loader dismiss ");

                // tslint:disable-next-line: align
                if (response.status === 200) {
                    this.booking = response.body;
                    if (this.booking.id != null) {
                        this.isAvailable = true;
                        this.isSuccess = true;

                        this.presentToast(
                            "Thanks for the booking .Please note the Reservation No: #" +
                                this.booking.propertyReservationNumber +
                                " and an email is sent with the booking details."
                        );

                        this.msgs.push({
                            severity: "success",
                            detail: `Thanks for the booking .Please note the Reservation No:  # ${this.booking.propertyReservationNumber} and an email is sent with the booking details.`,
                        });

                        this.onCardBookForm.reset();
                        this.onSaveForm.reset();
                        this.onPaymentForm.reset();
                        this.onPriceForm.reset();
                        this.onAvailabilityForm.reset();
                        this.isBookButtonDisable = false;

                        this.navCtrl.navigateForward("booking-list");

                        Logger.log("nagivate");

                        this.ResetAllField();
                    } else {
                        Logger.log("booking id fail ");

                        this.isBookButtonDisable = false;
                        // loader.dismiss();
                        this.msgs.push({
                            severity: "error",
                            summary:
                                "Please check the booking details and try again !",
                        });
                    }
                } else {
                    this.isBookButtonDisable = false;
                    Logger.log("booking responce fail ");

                    // loader.dismiss();
                    this.msgs.push({
                        severity: "error",
                        summary:
                            response.statusText + ":" + response.statusText,
                    });
                }
            },
            (error) => {
                // loader.dismiss();
            }
        );
    }

    async createBooking(booking: Booking) {
 
        if (
            booking.discountPercentage != null &&
            booking.discountPercentage != undefined
        ) {
            booking.discountPercentage = Number(
                booking.discountPercentage.toFixed(4)
            );
        } else {
            booking.discountPercentage = 0;
        }

        if (
            this.booking.otaBooking != null &&
            this.booking.otaBooking != undefined &&
            this.booking.otaBooking === true
          ) {
            booking.advanceAmount = this.advancePaidAmount;
            booking.payableAmount = booking.payableAmount;
          } else {
            booking.advanceAmount = Math.round(this.advancePaidAmount);
            booking.payableAmount = Math.round(booking.payableAmount);
          }

          if (this.advancePaidAmount > 0) {
            if (
              this.booking.otaBooking != null &&
              this.booking.otaBooking != undefined &&
              this.booking.otaBooking === true
            ) {
              booking.outstandingAmount = booking.payableAmount;
              booking.outstandingAmount =
                booking.outstandingAmount - this.advancePaidAmount;
            } else {
              booking.outstandingAmount = Math.round(booking.payableAmount);
              booking.outstandingAmount = Math.round(
                booking.outstandingAmount - this.advancePaidAmount
              );
            }
          } else {
            if (booking.paymentStatus === "Paid") {
              booking.outstandingAmount = 0;
      
              if (
                this.booking.otaBooking != null &&
                this.booking.otaBooking != undefined &&
                this.booking.otaBooking === true
              ) {
                booking.advanceAmount = booking.payableAmount;
              } else {
                booking.advanceAmount = Math.round(booking.payableAmount);
              }
            } else if (booking.paymentStatus === "NotPaid") {
              if (
                this.booking.otaBooking != null &&
                this.booking.otaBooking != undefined &&
                this.booking.otaBooking === true
              ) {
                booking.outstandingAmount = booking.payableAmount;
              } else {
                booking.outstandingAmount = Math.round(booking.payableAmount);
              }
            }
          }

        // const loader = await this.loadingCtrl.create({
        //     duration: 5000,
        // });

        // loader.present();

        this.bookingService.saveBooking(booking).subscribe(
            (response) => {
                Logger.log(
                    "booking inside response " + JSON.stringify(response)
                );
                // loader.dismiss();

                Logger.log("booking inside loader dismiss ");

                // tslint:disable-next-line: align
                if (response.status === 200) {
                    this.booking = response.body;
                    this.currentIndex = 4;
                    this.createAuditReport(null, this.booking, AUDIT_NEW_BOOKING);

                    if (this.booking.id != null) {
                        // if (
                        //     this.booking.mobile !== null &&
                        //     this.booking.mobile !== undefined
                        // ) {

                        //     this.sendConfirmationMessage(this.booking);
                        // }

                        if (
                            this.planPropertyServicesList != null &&
                            this.planPropertyServicesList != undefined &&
                            this.planPropertyServicesList.length > 0
                        ) {
                            this.addSeviceTopBooking(
                                this.booking.id,
                                this.planPropertyServicesList
                            );
                        }

                        if (this.todos != null && this.todos != undefined) {
                            this.todos.done = !this.todos.done;
                            this.updateTodos(this.todos);
                        }

                        this.payment.sourceOfBooking = booking.externalSite;

                        if (
                        this.booking.otaBooking != null &&
                        this.booking.otaBooking != undefined &&
                        this.booking.otaBooking === true
                        ) {
                        this.payment.amount = booking.payableAmount;
                        this.payment.transactionAmount = booking.payableAmount;
                        this.payment.netReceivableAmount = booking.payableAmount;
                        } else {
                        this.payment.amount = Math.round(booking.payableAmount);
                        this.payment.transactionAmount = Math.round(
                            booking.payableAmount
                        );
                        this.payment.netReceivableAmount = Math.round(
                            booking.payableAmount
                        );
                        }

                        this.payment.referenceNumber =
                        this.booking.propertyReservationNumber;
                        this.payment.externalReference = this.booking.externalBookingId;
                        this.payment.propertyId = this.booking.propertyId;
                        this.payment.businessServiceName = this.businessService.name;
                        this.payment.counterName = booking.counterName;
                        this.payment.counterNumber = booking.counterNumber;
                        this.payment.operatorName = booking.operatorName;
                        this.payment.companyName = booking.companyName;
                        this.payment.date = this.datepipe.transform(
                        new Date().getTime(),
                        "yyyy-MM-dd"
                        );

                        this.advancedPayment = new Payment();

                        if (this.advancePaidAmount > 0) {
                        this.advancedPayment = this.payment;

                        this.payment.bookingCommissionAmount = 0;
                        this.payment.convenienceFee = 0;

                        this.payment.transactionAmount =
                            this.payment.transactionAmount - this.advancePaidAmount;
                        this.payment.amount =
                            this.payment.amount - this.advancePaidAmount;
                        this.payment.netReceivableAmount =
                            this.payment.netReceivableAmount - this.advancePaidAmount;
                        this.payment.status = "NotPaid";
                        this.payment.paymentMode = "Cash";
                        } else {
                        this.payment.status = this.booking.paymentStatus;
                        this.payment.paymentMode = this.booking.modeOfPayment;
                        this.payment.bookingCommissionAmount =
                            this.booking.bookingCommissionAmount;
                        this.payment.convenienceFee = this.booking.convenienceFee;

                        // if (
                        //     this.booking.modeOfPayment == "UPI" &&
                        //     this.receiptNumber != null &&
                        //     this.receiptNumber != undefined &&
                        //     this.receiptNumber.length > 0
                        // ) {
                        //     this.payment.receiptNumber = this.receiptNumber;
                        // } else if (
                        //     this.booking.modeOfPayment == "PaymentTerminal" &&
                        //     this.cardLastFourDigit != null &&
                        //     this.cardLastFourDigit != undefined
                        // ) {
                        //     this.payment.lastFourDigitCardNumber = this.cardLastFourDigit;
                        // }
                        }
                      

                        if (this.advancePaidAmount > 0) {
                        //this.advancedPayment = this.payment;

                        this.advancedPayment.bookingCommissionAmount =
                            this.booking.bookingCommissionAmount;
                        this.advancedPayment.convenienceFee = this.booking.convenienceFee;
                        this.advancedPayment.transactionAmount = this.advancePaidAmount;
                        this.advancedPayment.amount = this.advancePaidAmount;
                        this.advancedPayment.netReceivableAmount = this.advancePaidAmount;
                        this.advancedPayment.taxAmount = 0;
                        this.advancedPayment.status = "Paid";
                        this.advancedPayment.paymentMode = this.booking.modeOfPayment;
                        this.advancedPayment.description = `Advance payment for Reservation No:  # ${this.booking.propertyReservationNumber} at ${this.booking.businessName}`;
                        this.advancedPayment.businessServiceName =
                            this.businessService.name;
                        this.advancedPayment.counterName = booking.counterName;
                        this.advancedPayment.counterNumber = booking.counterNumber;
                        this.advancedPayment.operatorName = booking.operatorName;
                        this.advancedPayment.sourceOfBooking = booking.externalSite;

                        // if (
                        //     this.booking.modeOfPayment == "UPI" &&
                        //     this.receiptNumber != null &&
                        //     this.receiptNumber != undefined &&
                        //     this.receiptNumber.length > 0
                        // ) {
                        //     this.advancedPayment.receiptNumber = this.receiptNumber;
                        // } else if (
                        //     this.booking.modeOfPayment == "PaymentTerminal" &&
                        //     this.cardLastFourDigit != null &&
                        //     this.cardLastFourDigit != undefined
                        // ) {
                        //     this.payment.lastFourDigitCardNumber = this.cardLastFourDigit;
                        // }

                        this.savePaymentAdvance(this.advancedPayment);
                        }

                        if (
                            this.selectRoomDetail != null &&
                            this.selectRoomDetail != undefined
                        ) {
                            this.bookingRoomAllowcation(this.booking);
                        }

                        this.isAvailable = true;
                        this.isSuccess = true;

                        this.presentToast(
                            "Thanks for the booking .Please note the Reservation No: #" +
                                this.booking.propertyReservationNumber +
                                " and an email is sent with the booking details."
                        );

                        this.msgs.push({
                            severity: "success",
                            detail: `Thanks for the booking .Please note the Reservation No:  # ${this.booking.propertyReservationNumber} and an email is sent with the booking details.`,
                        });

                
                        this.onCardBookForm.reset();
                        this.onSaveForm.reset();
                        this.onPaymentForm.reset();
                        this.onPriceForm.reset();
                        this.onAvailabilityForm.reset();
                        this.isBookButtonDisable = false;

                        // this.navCtrl.navigateForward("booking-list");

                        //this.ResetAllField();
                    } else {
                        this.isBookButtonDisable = false;
                        // loader.dismiss();
                        this.msgs.push({
                            severity: "error",
                            summary:
                                "Please check the booking details and try again !",
                        });
                    }
                } else {
                    this.isBookButtonDisable = false;
                    Logger.log("booking responce fail ");

                    // loader.dismiss();
                    this.msgs.push({
                        severity: "error",
                        summary:
                            response.statusText + ":" + response.statusText,
                    });
                }
            },
            (error) => {
                // loader.dismiss();
            }
        );
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
        audit.updatedBy = this.booking.operatorName;
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
        //   if (
        //     this.releaseRoomDetails != null &&
        //     this.releaseRoomDetails.length > 0
        //   ) {
        //     releaseRoomNo = this.releaseRoomDetails.map(function (item) {
        //       return item["roomNumber"];
        //     });
        //   }
    
          let AllocateRoomNo = [];
        //   if (this.roomNumbers != null && this.roomNumbers.length > 0) {
        //     AllocateRoomNo = this.roomNumbers.map(function (item) {
        //       return item["roomNumber"];
        //     });
        //   }
    
        //   let prevTo = this.getCurrentRoomChangeDate(prevBooking);
        //   let newFrom = this.getCurrentRoomChangeDate(currentBooking);
    
          // previous value
        //   audit.previousValue = `${
        //     prevBooking.roomName
        //   }, ${this.dateService.convertMillisecondsToDateFormat(
        //     prevBooking.fromDate
        //   )} to ${this.datepipe.transform(
        //     prevTo,
        //     "dd-MM-yyyy"
        //   )}, Rooms:${releaseRoomNo.toString()},Room Price/night:${
        //     prevBooking.roomPrice
        //   }, Total Room Price:${this.getTotalBookingRoomPrice(
        //     prevBooking,
        //     prevBooking.fromDate,
        //     prevTo
        //   )}. `;
    
          // new value
        //   audit.newValue = `${currentBooking.roomName}, ${this.datepipe.transform(
        //     newFrom,
        //     "dd-MM-yyyy"
        //   )} to ${this.dateService.convertMillisecondsToDateFormat(
        //     currentBooking.toDate
        //   )}, Rooms:${AllocateRoomNo.toString()}, Room Price/night:${
        //     currentBooking.roomPrice
        //   }, Total Room Price:${this.getTotalBookingRoomPrice(
        //     currentBooking,
        //     newFrom,
        //     currentBooking.toDate
        //   )}.`;
    
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
    savePaymentAdvance(payment: Payment) {
        this.paymentService.savePayment(payment).subscribe((res) => {

          //this.close();
        });
      }
    addSeviceTopBooking(bookingId, serviceList: any[]) {
        this.loader = true;
        this.bookingService
            .saveBookingService(bookingId, serviceList)
            .subscribe(
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

    goToList() {
        this.navCtrl.navigateRoot("booking-list");
    }

    updateTodos(row) {
        this.loader = true;
        this.bookingService.saveTodos(row).subscribe(
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

    async CheckAvailability() {
        // this.isAvailabilityDone = false;
        // const loader = await this.loadingCtrl.create({
        //     duration: 5000,
        // });

        this.booking.groupBooking = false;
        this.booking.propertyId = parseInt(this.token.getPropertyId());
        this.booking.fromDate = this.getUTCDateToDate(this.booking.fromDate);
        this.booking.toDate = this.getUTCDateToDate(this.booking.toDate);

        Logger.log("form validate" + JSON.stringify(this.booking));

        // loader.present();
        this.loader = true;

        const checkAvailabilityObsrv = this.bookingService
            .checkAvailability(this.booking)
            .subscribe(
                (response) => {
                    Logger.log("response : " + JSON.stringify(response));

                    if (response.status === 200) {
                        this.isAvailabilityDone = true;
                        // loader.dismiss();
                        this.loader = false;

                        this.bookingFromDate.disable();
                        this.bookingToDate.disable();
                        this.RoomType.disable();

                        if (this.singleDayBooking() === true) {
                            this.booking.toDate = this.booking.fromDate;
                        }

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
                        this.currentIndex = 1;

                        this.calculateRoomPrice();

                        if (this.booking.roomRatePlanName != undefined) {
                            this.calculateBookingAmounts();
                        }

                        this.setExtraPlanPropertyService();

                        if (response.body.available) {
                            // document.getElementById(
                            //     "second-content"
                            // ).style.display = "block";
                            document.getElementById(
                                "first-content"
                            ).style.display = "none";
                            this.onAvailabilityForm.disable();

                            if (this.isEnquieryBooking === true) {
                                this.bookingButtonLabel = "Enquire";
                            } else {
                                this.bookingButtonLabel = "Book";
                            }

                            this.isAvailable = true;

                            this.booking.available = true;
                            if (
                                this.businessService != null &&
                                this.businessService != undefined &&
                                this.businessService.includeService != null &&
                                this.businessService.includeService != undefined
                              ) {
                                this.booking.includeService = this.businessService.includeService;
                              } else {
                                this.booking.includeService = true;
                              }
                              if(this.booking.isIncludeExpense == null || this.booking.isIncludeExpense == undefined){
                                this.booking.isIncludeExpense = false;
                              }
                            Logger.log("available");
                        } else {
                            // document.getElementById(
                            //     "second-content"
                            // ).style.display = "block";
                            document.getElementById(
                                "first-content"
                            ).style.display = "none";
                            this.onAvailabilityForm.disable();
                            this.bookingButtonLabel = "Enquire";
                            this.isAvailable = false;

                            this.booking.available = false;

                            Logger.log(" not available");
                        }
                    }
                },
                (error) => {
                    // loader.dismiss();
                    this.loader = false;

                    Logger.log(error);
                }
            );
    }

    setPayableAmount() {
        // let fromdate = new Date(this.booking.fromDate);
        // let todate = new Date(this.booking.toDate);
        // let Difference_In_Time = fromdate.getTime() - todate.getTime();
        // let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        // Logger.log("day : " + Math.abs(Difference_In_Days));
        // this.booking.payableAmount =
        //     this.plan.amount *
        //     Math.abs(Difference_In_Days) *
        //     this.booking.noOfRooms;
        // this.booking.totalAmount = this.booking.payableAmount;
        // Logger.log(" this.booking.payableAmount " + this.booking.payableAmount);
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    getUTCDateToDate(dateString: string) {
        var yearAndMonth = dateString.split("-", 3);
        Logger.log(yearAndMonth + " --" + yearAndMonth[2].split("T", 1));

        return (
            yearAndMonth[0] +
            "-" +
            yearAndMonth[1] +
            "-" +
            yearAndMonth[2].split("T", 1)
        );
    }

    convenienceFeeCalculate(propertyOTADetails: any, beforeTaxAmount: any) {
        if (
            this.booking.id != undefined &&
            this.booking.id != null &&
            !this.isNetOrPayableAmountChange
        ) {
            return this.booking.convenienceFee;
        } else {
            if (
                propertyOTADetails != null &&
                propertyOTADetails != undefined &&
                propertyOTADetails.convenienceFeeType != null &&
                propertyOTADetails.convenienceFeeType != undefined &&
                propertyOTADetails.convenienceFee != null &&
                propertyOTADetails.convenienceFee != undefined &&
                beforeTaxAmount != null &&
                beforeTaxAmount != undefined
            ) {
                if (propertyOTADetails.convenienceFeeType === "Person") {
                    if (
                        this.booking.noOfPersons != null &&
                        this.booking.noOfPersons != undefined
                    ) {
                        this.booking.convenienceFee =
                            this.booking.noOfPersons *
                            propertyOTADetails.convenienceFee;
                        return this.booking.convenienceFee;
                    } else {
                        this.booking.convenienceFee = 0;
                        return 0;
                    }
                } else if (
                    propertyOTADetails.convenienceFeeType === "Percentage"
                ) {
                    this.booking.convenienceFee =
                        (this.booking.beforeTaxAmount *
                            propertyOTADetails.convenienceFee) /
                        100;
                    return this.booking.convenienceFee;
                } else if (propertyOTADetails.convenienceFeeType === "Fixed") {
                    this.booking.convenienceFee =
                        propertyOTADetails.convenienceFee;
                    return propertyOTADetails.convenienceFee;
                } else {
                    this.booking.convenienceFee = 0;
                    return 0;
                }
            } else {
                this.booking.convenienceFee = 0;
                return 0;
            }
        }
    }

    tdsAmountCalculate(propertyOTADetails: any, beforeTaxAmount: any) {
        if (
            this.booking.id != undefined &&
            this.booking.id != null &&
            !this.isNetOrPayableAmountChange
        ) {
            return this.booking.tdsFee;
        } else {
            if (
                propertyOTADetails != null &&
                propertyOTADetails != undefined &&
                propertyOTADetails.tdsType != null &&
                propertyOTADetails.tdsType != undefined &&
                propertyOTADetails.tdsFee != null &&
                propertyOTADetails.tdsFee != undefined &&
                beforeTaxAmount != null &&
                beforeTaxAmount != undefined
            ) {
                if (propertyOTADetails.tdsType === "Person") {
                    if (
                        this.booking.noOfPersons != null &&
                        this.booking.noOfPersons != undefined
                    ) {
                        this.booking.tdsFee =
                            this.booking.noOfPersons *
                            propertyOTADetails.tdsFee;
                        return this.booking.tdsFee;
                    } else {
                        this.booking.tdsFee = 0;
                        return 0;
                    }
                } else if (propertyOTADetails.tdsType === "Percentage") {
                    this.booking.tdsFee =
                        (this.booking.beforeTaxAmount *
                            propertyOTADetails.tdsFee) /
                        100;
                    return this.booking.tdsFee;
                } else if (propertyOTADetails.tdsType === "Fixed") {
                    this.booking.tdsFee = propertyOTADetails.tdsFee;
                    return propertyOTADetails.tdsFee;
                } else {
                    this.booking.tdsFee = 0;
                    return 0;
                }
            } else {
                this.booking.tdsFee = 0;
                return 0;
            }
        }
    }

    tcsAmountCalculate(propertyOTADetails: any, beforeTaxAmount: any) {
        if (
            this.booking.id != undefined &&
            this.booking.id != null &&
            !this.isNetOrPayableAmountChange
        ) {
            return this.booking.tcsFee;
        } else {
            if (
                propertyOTADetails != null &&
                propertyOTADetails != undefined &&
                propertyOTADetails.tcsType != null &&
                propertyOTADetails.tcsType != undefined &&
                propertyOTADetails.tcsFee != null &&
                propertyOTADetails.tcsFee != undefined &&
                beforeTaxAmount != null &&
                beforeTaxAmount != undefined
            ) {
                if (propertyOTADetails.tcsType === "Person") {
                    if (
                        this.booking.noOfPersons != null &&
                        this.booking.noOfPersons != undefined
                    ) {
                        this.booking.tcsFee =
                            this.booking.noOfPersons *
                            propertyOTADetails.tcsFee;
                        return this.booking.tcsFee;
                    } else {
                        this.booking.tcsFee = 0;
                        return 0;
                    }
                } else if (propertyOTADetails.tcsType === "Percentage") {
                    this.booking.tcsFee =
                        (this.booking.beforeTaxAmount *
                            propertyOTADetails.tcsFee) /
                        100;
                    return this.booking.tcsFee;
                } else if (propertyOTADetails.tcsType === "Fixed") {
                    this.booking.tcsFee = propertyOTADetails.tcsFee;
                    return propertyOTADetails.tcsFee;
                } else {
                    this.booking.tcsFee = 0;
                    return 0;
                }
            } else {
                this.booking.tcsFee = 0;
                return 0;
            }
        }
    }

    bookingCommissionAmountCalculate(
        propertyOTADetails: any,
        beforeTaxAmount: any
    ) {
        if (
            this.booking.id != undefined &&
            this.booking.id != null &&
            !this.isNetOrPayableAmountChange
        ) {
            return this.booking.bookingCommissionAmount;
        } else {
            if (
                propertyOTADetails != null &&
                propertyOTADetails != undefined &&
                propertyOTADetails.bookingCommissionFeeType != null &&
                propertyOTADetails.bookingCommissionFeeType != undefined &&
                propertyOTADetails.bookingCommissionFee != null &&
                propertyOTADetails.bookingCommissionFee != undefined &&
                beforeTaxAmount != null &&
                beforeTaxAmount != undefined
            ) {
                if (propertyOTADetails.bookingCommissionFeeType === "Person") {
                    if (
                        this.booking.noOfPersons != null &&
                        this.booking.noOfPersons != undefined
                    ) {
                        this.booking.bookingCommissionAmount =
                            this.booking.noOfPersons *
                            propertyOTADetails.bookingCommissionFee;
                        return this.booking.bookingCommissionAmount;
                    } else {
                        this.booking.bookingCommissionAmount = 0;
                        return 0;
                    }
                } else if (
                    propertyOTADetails.bookingCommissionFeeType === "Percentage"
                ) {
                    this.booking.bookingCommissionAmount =
                        (this.booking.beforeTaxAmount *
                            propertyOTADetails.bookingCommissionFee) /
                        100;
                    return this.booking.bookingCommissionAmount;
                } else if (
                    propertyOTADetails.bookingCommissionFeeType === "Fixed"
                ) {
                    this.booking.bookingCommissionAmount =
                        propertyOTADetails.bookingCommissionFee;
                    return propertyOTADetails.bookingCommissionFee;
                } else {
                    this.booking.bookingCommissionAmount = 0;
                    return 0;
                }
            } else {
                this.booking.bookingCommissionAmount = 0;
                return 0;
            }
        }
    }

    convinenceFeeEdit() {
        this.isConvienceFeeEditMode = true;
        this.isPaymentConveninceFee = true;
        this.isConveninceFeeChangeRq = true;
    }

    convinenceFeeCheck() {
        this.isConvienceFeeEditMode = false;
        this.isConveninceFeeChangeRq = false;
        if (
            this.booking.convenienceFee != null &&
            this.booking.convenienceFee != undefined &&
            this.booking.convenienceFee > 0
        ) {
            this.isPaymentConveninceFee = true;
        } else {
            this.isPaymentConveninceFee = false;
        }
    }

    convinenceFeeClosed() {
        this.isPaymentConveninceFee = false;
        this.isConvienceFeeEditMode = false;
        this.isConveninceFeeChangeRq = false;
        this.changeDetectorRefs.detectChanges();
    }

    bConvinenceFeeEdit() {
        this.isBConvienceFeeEditMode = true;
        this.isPaymentBConveninceFee = true;
        this.isBConveninceFeeChangeRq = true;
    }

    bConvinenceFeeCheck() {
        this.isBConvienceFeeEditMode = false;
        this.isBConveninceFeeChangeRq = false;
        if (
            this.booking.bookingCommissionAmount != null &&
            this.booking.bookingCommissionAmount != undefined &&
            this.booking.bookingCommissionAmount > 0
        ) {
            this.isPaymentBConveninceFee = true;
        } else {
            this.isPaymentBConveninceFee = false;
        }
    }

    bConvinenceFeeClosed() {
        this.isPaymentBConveninceFee = false;
        this.isBConvienceFeeEditMode = false;
        this.isBConveninceFeeChangeRq = false;
        this.changeDetectorRefs.detectChanges();
    }

    bookingRoomAllowcation(booking: Booking) {
        
        this.selectRoomDetail.guestName =
        booking.firstName + " " + booking.lastName;
      this.selectRoomDetail.bookingId = booking.id;
      this.selectRoomDetail.customerId = booking.customerId;
      this.selectRoomDetail.available = false;
  
      booking.roomDetails = [];
      booking.checkinTime = null;
      booking.businessName = this.property.name;
  
      this.selectRoomDetail.customerId = undefined;
      this.selectRoomDetail.roomStatus = "BLOCKED";
      this.selectRoomDetail.date = undefined;
  
      booking.roomDetails.push(this.selectRoomDetail);

        this.bookingService.roomAllocation(booking).subscribe(
            (response) => {
                if (response.status === 200) {
                    if (this.bookingStatus === "CHECKEDIN") {
                        this.currentDayCheckedIn(this.booking);
                    } else {
                        this.presentToast("Room Allocation Completed.");
                    }

                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.loader = false;
                        this.changeDetectorRefs.detectChanges();
                        this.presentToast(
                            "Please proceed with offline room allocation and update the booking."
                        );
                    }
                }
            }
        );
    }

    currentDayCheckedIn(row) {
        row.checkinTime = this.datepipe.transform(
          new Date().getTime(),
          "yyyy-MM-ddTHH:mm"
        );
        row.checkinTime = new Date(row.checkinTime).getTime().toString();
    
        if (
          row.roomDetails != null &&
          row.roomDetails != undefined &&
          row.roomDetails.length > 0
        ) {
          for (let i = 0; i < row.roomDetails.length; i++) {
            row.roomDetails[i].roomStatus = "VACANT_READY";
            this.changeRoomStatus(row.roomDetails[i]);
          }
    
          this.currentDaybookingCheckedIn(row);
        } else {
          this.currentDaybookingCheckedIn(row);
        }
    }

    currentDaybookingCheckedIn(row) {
        this.booking.auditType = AUDIT_CHECK_IN;
        this.loader = true;
        this.bookingService.checkin(row).subscribe(
          (response) => {
            if (response.status === 200) {
              this.loader = false;
              this.createAuditReportCheckIn(this.booking);
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
              }
            }
          }
        );
      }

      changeRoomStatus(row) {
        this.loader = true;
        row.date = this.datepipe.transform(this.booking.checkinTime, "yyyy-MM-dd");
        row.roomStatus = "VACANT_READY";
        this.propertyService.updateRoomDetailStatusInCheckedInFrom(row).subscribe(
          () => {
            this.loader = false;
          },
          () => {}
        );
      }
    

    CheckedIn(row) {
        this.booking.auditType = AUDIT_CHECK_IN;
        this.bookingService.checkin(row).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.loader = false;
                    this.createAuditReportCheckIn(this.booking);
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

    createAuditReportCheckIn(currentBooking : Booking)
    {
      this.role = [];
      JSON.parse(this.token.getRole()).forEach((item) => {
        this.role.push(item);
      });
  
      let audit = new Audit();
  
      audit.reservationId = currentBooking.propertyReservationNumber;
      audit.auditType = AUDIT_CHECK_IN;
      audit.bookingId = currentBooking.id;
      audit.propertyId = currentBooking.propertyId;
      audit.role = this.role[0];
      audit.updatedAt = new Date().getTime().toString();
      audit.updatedBy = currentBooking.operatorName;
  
      if (currentBooking != null && currentBooking != undefined)
      {
        audit.newValue =  this.datepipe.transform(currentBooking.checkinTime, 'yyyy-MM-dd');
      }
  
      audit.operatorNotes = "";
      audit.roomId = currentBooking.roomId;
      audit.updateType = "CHECKEDIN BOOKING";
  
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

    //
    tcsCheck() {
        this.isTCSEditMode = false;
        this.isTCSFeeChangeRq = false;
        if (
            this.booking.tcsFee != null &&
            this.booking.tcsFee != undefined &&
            this.booking.tcsFee > 0
        ) {
            this.isPaymentTCSFee = true;
        } else {
            this.isPaymentTCSFee = false;
        }
    }

    tcsFeeEdit() {
        this.isTCSEditMode = true;
        this.isTCSFeeChangeRq = true;
        this.isPaymentTCSFee = true;
    }
    tcsClosed() {
        this.isTCSEditMode = false;
        this.isTCSFeeChangeRq = false;
        this.isPaymentTCSFee = false;
    }

    tdsFeeEdit() {
        this.isTDSEditMode = true;
        this.isTDSFeeChangeRq = true;
        this.isPaymentTDSFee = true;
    }

    tdsClosed() {
        this.isTDSEditMode = false;
        this.isTDSFeeChangeRq = false;
        this.isPaymentTDSFee = false;
    }

    tdsCheck() {
        this.isTDSEditMode = false;
        this.isTDSFeeChangeRq = false;
        if (
            this.booking.tdsFee != null &&
            this.booking.tdsFee != undefined &&
            this.booking.tdsFee > 0
        ) {
            this.isPaymentTDSFee = true;
        } else {
            this.isPaymentTDSFee = false;
        }
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

    bookingRoomPriceChangeAccess() {
        if (
            this.checkUserType.isFontDesk(this.role[0]) == true ||
            this.checkUserType.isFontDeskEx(this.role[0]) == true
        ) {
            return false;
        } else {
            return true;
        }
    }

    checkAmountEditAccess() {
        if (
            this.booking != null &&
            this.booking != undefined &&
            this.booking.id != null &&
            this.booking.id != undefined
        ) {
            if (this.checkUserType.isFontDeskEx(this.role[0]) == true) {
                return false;
            } else {
                if (
                    this.booking != null &&
                    this.booking != undefined &&
                    this.booking.bookingStatus === "CHECKEDOUT"
                ) {
                    if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    planAmountEditButtonClick() {
        this.isPlanAmountEditMode = true;
        this.changeDetectorRefs.detectChanges();
    }
    planAmountButtonClick() {
        this.isPlanAmountEditMode = false;
        this.changeDetectorRefs.detectChanges();
    }

    fromTimeChange() {
        if (
            this.booking.checkoutPeriod != null &&
            this.booking.checkoutPeriod != undefined
        ) {
            if (
                this.booking.fromTime != null &&
                this.booking.fromTime != undefined
            ) {
                let todatetime = new Date(this.booking.fromTime);

                todatetime.setHours(
                    todatetime.getHours() + Number(this.booking.checkoutPeriod)
                );
                todatetime.setMinutes(todatetime.getMinutes());

                this.booking.toTime = this.datepipe.transform(
                    todatetime,
                    "yyyy-MM-ddTHH:mm"
                );
            }
        }
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

    getServiceAfterTaxAmount() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum +
                this.getServiceValue(
                    this.planPropertyServicesList[i].afterTaxAmount
                );
        }

        return sum;
    }

    getServiceBeforeAmount() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum +
                this.getServiceValue(
                    this.planPropertyServicesList[i].beforeTaxAmount
                );
        }

        return sum;
    }

    getServiceCount() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum +
                this.getServiceValue(this.planPropertyServicesList[i].count);
        }

        return sum;
    }
    getServicePrice() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum +
                this.getServiceValue(
                    this.planPropertyServicesList[i].servicePrice
                );
        }

        return sum;
    }

    getServiceTaxAmount() {
        let sum = 0;
        for (let i = 0; i < this.planPropertyServicesList.length; i++) {
            sum =
                sum +
                this.getServiceValue(
                    this.planPropertyServicesList[i].taxAmount
                );
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
}
