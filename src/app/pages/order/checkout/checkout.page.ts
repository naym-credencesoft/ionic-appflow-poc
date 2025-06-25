import { AddToCartPageModule } from "./../add-to-cart/add-to-cart.module";
import { BankAccount } from "src/app/pages/business-setting/bank-details/BankAccount";
import { ReservationService } from "src/app/service/ReservationService/reservation-service.service";
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewRef } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
    ActionSheetController,
    IonRouterOutlet,
    IonSlides,
    LoadingController,
    MenuController,
    ModalController,
    NavController,
    NavParams,
    ToastController,
} from "@ionic/angular";
import { BusinessServiceTypes } from "src/app/model/business-service/businessServiceTypes";
import { PointOfSale } from "src/app/model/Pos/pointOfSale";
import { Property } from "src/app/model/property/Property";
import { Slot } from "src/app/model/Reservation/slot";
import { MobileWallet } from "src/app/model/wallet/mobileWallet";
import { AUDIT_ORDER_CREATE, AUDIT_ORDER_UPDATE, PhoneNumberEXP } from "../../../app.component";
import { Address } from "../../../model/address-checker/Address";
import { CountryCode } from "../../../model/countryCode";
import { CountryList } from "../../../model/Customer/country";
import { Customer } from "../../../model/Customer/customer";
import { Payment } from "../../../model/manage-booking/Payment/Payment";
import { ShipToAddress } from "../../../model/Order/address";
import { Order } from "../../../model/Order/order";
import { BusinessService } from "../../../model/Reservation/businessServic";
import { ClosedDays } from "../../../model/Reservation/closeddays";
import { OpenDays } from "../../../model/Reservation/opendays";
import { SlotReservation } from "../../../model/Reservation/slotReservation";
import { DateService } from "../../../service/DateService/date-service.service";
import { Logger } from "../../../service/logger.service";
import { OrderService } from "../../../service/Order/order.service";
import { TokenStorage } from "../../../token.storage";
import { ResourceList } from "src/app/model/business-service/resourceList";
import { LocationList } from "src/app/model/Reservation/locationList";
import { Slots } from "src/app/model/business-service/slots";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { AuthService } from "src/app/service/auth.service";
import { ApplicationUser } from "src/app/model/user";
import { BusinessProperties } from "src/app/model/Order/businessProperties";
import { BusinessServiceDtoList } from "src/app/model/business-service/businessServiceDtoList";
import { ProductGroup } from "src/app/model/product/productGroup";
import { DeliveryOption } from "src/app/model/Order/deliveryOption";
import { OrderProduct } from "src/app/model/Order/product";
import { productVariationDtoList } from "src/app/model/Order/productVariation";
import {
    Available_Status,
    OutOfStock_Status,
    PaidButOutOfStock_Status,
} from "../status";
import { PaymentService } from "src/app/service/payment/payment.service";
import { DatePipe, Location } from "@angular/common";
import { Expense } from "src/app/model/Expense/Expense";
import { ExpenseModel } from "src/app/model/Expense/ExpenseModel";
import { ExpenseService } from "src/app/service/ExpenseService/expense-service.service";
import { TaxDetails } from "src/app/model/TaxDetail/TaxDetails";
import { SplitTaxDTO } from "../../booking/booking.page";
import { CustomerService } from "src/app/service/Customer/customer.service";
import { KotGeneratePage } from "../kot-generate/kot-generate.page";
import { PropertyService } from "src/app/service/property/property.service";
import { Audit } from "src/app/service/audit";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { KOT } from "../KOT";
import { CheckUserType } from "src/app/model/checkUserType";
import { ActionBookingMenuComponent } from "src/app/component/booking-list/action-booking-menu/action-booking-menu.component";
import { OpenProductComponent } from "src/app/model/open-product/open-product.component";
import { ItemReleaseComponent } from "src/app/model/item-release/item-release.component";
import { BusinessOfferDto } from "src/app/model/businessOfferDto";
import { ServiceCharge } from "src/app/model/serviceCharge";


export interface ProductGroupList {
    businessServiceId: number;
    productGroup: any[];
}

export interface TimingArrayAndDetails {
    time: string;
    details: any;
}

export interface BookingData {
    id: number;
    firstName: any;
    lastName: any;
    propertyReservationNumber: string;
    email: string;
    mobile: string;
    roomName: string;
    roomNumber: any;
    customerId: number;
    isGroupBooking: boolean;
    bookingOb: any;
}

@Component({
    selector: "app-checkout",
    templateUrl: "./checkout.page.html",
    styleUrls: ["./checkout.page.scss"],
})
export class CheckoutPage implements OnInit {
    @Input() orderDTO: Order;
    @Input() isBackPageVisible: boolean;
    taxDetails: TaxDetails[];
    // @ViewChild("serachTermProduct", { static: false })
    viewValueSerachTermProduct: ElementRef;
    Available_Status: string = Available_Status;
    OutOfStock_Status: string = OutOfStock_Status;
    PaidButOutOfStock_Status: string = PaidButOutOfStock_Status;
    maxOrderItemDiscountPercentage: number;
    searchResult: string;
    user: ApplicationUser;
    bookingSearchReselt: string;
    checkUserType: CheckUserType;
    productGroupsSearchList: any[] = [];
    filteredProductGroupsSearchList: any[] = [];

    bookingdata: BookingData[];
    bookingFilter: any[] = [];

    closedDay: ClosedDays;
    openDay: OpenDays;
    countryCode: CountryCode;

    prepareDay: number = 0;
    prepareHour: number = 0;
    prepareMinute: number = 0;

    headerTitle: string;
    bodyMessage: string;

    leadHour: number = 0;
    leadDay: number = 0;
    leadMin: number = 0;
    nonGstTotalAmount: number;
    leadMaxDay: number = 0;
    leadMaxMin: number = 0;
    leadMaxHour: number = 0;
    orderProductSelectedToShift: OrderProduct;
    orderProductSelectedToShiftList: OrderProduct[] = [];
    businessService: BusinessServiceDtoList;
    CountryArray: CountryList;
    pointOfSaleListFilter: PointOfSale[] = [];
    loader: boolean = false;
    selecion: string = "Phone";
    customerSearchSelecion: string = "fn";
    order: Order;
    customer: Customer;
    address: ShipToAddress;
    propertyAddress: any;
    serviceCharges: ServiceCharge[] = [];

    Email: FormControl = new FormControl();
    Phone: FormControl = new FormControl();
    firstName: FormControl = new FormControl();
    lastName: FormControl = new FormControl();
    // DeliveryMethod : FormControl = new FormControl();
    PaymentMethod: FormControl = new FormControl();

    productGroupListData: any[] = [];

    StreetNumber: FormControl = new FormControl();
    streetName: FormControl = new FormControl();
    locality: FormControl = new FormControl();
    suburb: FormControl = new FormControl();
    city: FormControl = new FormControl();
    postcode: FormControl = new FormControl();
    state: FormControl = new FormControl();
    country: FormControl = new FormControl();

    cardNumber: FormControl = new FormControl();
    // name: FormControl = new FormControl();
    // cvv: FormControl = new FormControl();
    // expYear: FormControl = new FormControl();
    // expMonth: FormControl = new FormControl();

    StatusPayment: FormControl = new FormControl();

    isCustomercheck: boolean = false;
    orderDateUI: string;
    payment: Payment;
    slotReservation: SlotReservation;
    isPropServiceExecutive: boolean = false;
    EmailCheck: FormControl = new FormControl();
    countryCodeC: FormControl = new FormControl();
    PhoneC: FormControl = new FormControl();

    onEmailCheckForm: FormGroup;
    onPhoneCheckForm: FormGroup;
    // onPhoneCheckForm: FormGroup;

    onSubmitForm: FormGroup;
    onCardBookForm: FormGroup;

    delivertDateAndTime: string;
    CodeNumber: string;
    PhoneNumberWithOutCode: string;

    isbookingRequest: boolean = false;

    property: Property;
    isCustomerInfoViewOnly: boolean = false;
    isPhoneReadOnly: boolean = false;
    isEmailReadOnly: Boolean = false;

    mobileWallet: MobileWallet;
    isWalletAvailable: boolean = false;
    onWalletForm: FormGroup;
    onbankForm: FormGroup;

    TransactionReferenceNumber: FormControl = new FormControl();

    WalletClientFN: FormControl = new FormControl();
    WalletClientLN: FormControl = new FormControl();
    WalletClientPhone: FormControl = new FormControl();
    WalletClientWP: FormControl = new FormControl();
    WalletURL: FormControl = new FormControl();
    isGstNumber: boolean;
    taxPercentage: number;

    //
    bankAccount: BankAccount;
    methodType: string;
    AvailableSLotBusinessServiceTypes: BusinessServiceTypes[] = [];
    businessServiceType: BusinessServiceTypes;
    slot: Slots;

    slotTimingArrayList: any[];
    timesArray: TimingArrayAndDetails[] = [];

    pointOfSaleList: PointOfSale[];
    pointOfSale: PointOfSale;

    onInDineForm: FormGroup;
    onTakeAwayForm: FormGroup;
    onFinalDetailForm: FormGroup;
    onRoomOrderForm: FormGroup;
    role: any = [];
    maxOrderDiscountPercentage: number;
    promoCode: any;

    //RequiredDate: FormControl = new FormControl();
    countryCodeController: FormControl = new FormControl();
    // DeliverySlot: FormControl = new FormControl();
    LocationName: FormControl = new FormControl();
    ResourceName: FormControl = new FormControl();
    CounterNumber: FormControl = new FormControl();
    OperatorName: FormControl = new FormControl();
    BusinessServiceType: FormControl = new FormControl();
    ServiceChargeAmount:  FormControl = new FormControl();
    BookingControl: FormControl = new FormControl();
    searchControl: FormControl = new FormControl();
    Room: FormControl = new FormControl();
    BusinesService: FormControl = new FormControl();


    isNewOrderCreated: boolean = true;
    TimeSlotDetails: any;

    selectedResourceArray: any[] = [];
    selectedLocationArray: any[];
    resource: ResourceList;
    resources: ResourceList[];
    resourceSingleObject: ResourceList;
    locations: LocationList[];
    location: LocationList;

    locationNameSelected: any[] = [];
    resourceSelected: any[] = [];

    booking: Booking;
    bookings: Booking[] = [];

    RoomNo: string;
    bookingId: number;
    isCustomerInfoReadOnly: boolean = false;

    orderProduct: OrderProduct;
    orderProducts: any[];
    businessServices: any[];
    propertyId: number;
    currency: string;
    discountPercentage: number = 0;
    businessPlan: string;
    isBankTransferAvailable: boolean;

    propertiesDto: BusinessProperties;

    productGroupsList: ProductGroupList[] = [];
    businessServiceList: BusinessServiceDtoList[] = [];
    bserviceid: number;
    selectedIndex: number;
    businessServiceId: number;

    productGroup: ProductGroup;
    deliveryOptions: DeliveryOption[] = [];

    deliveryOption: any;
    paymentReservation: Payment;
    total: number;
    totalQuantity: number;
    isVAvailable: boolean;
    subTotalAmount: number;
    isPaidOrder: boolean;

    paymentDTO: Payment;

    productVariations: productVariationDtoList[];
    productVariation: productVariationDtoList;
    quantityVariation: number;
    totalPriceVariation: number;
    quantity: number;
    totalPrice: number;

    pGroupINumber = 0;
    isclickG = false;
    isTimeSlotAvailable: boolean = false;

    isPaymentSection: boolean = false;
    isOderDetailsPlace: boolean = false;

    orderSelectedProducts: any[];
    productVariationSelected: any[];

    isDiscountAmountChangeRq: boolean = true;
    discountPriceBeforeEdit: any;
    isSelectionDisabled: boolean = false;
    isDiscountEditMode: boolean = false;
    isDataChanged: boolean = false;
    expense: ExpenseModel;
    totalProductDiscount: any = 0;
    isShowBookingList: boolean = false;
    roomDetails: any[] = [];
    bookingSearchResult: string;
    orderSlotTime: string;

    propertyTaxDetails: TaxDetails[];
    taxDetailsSelected: TaxDetails[] = [];
    totalSplitTax: any[];
    isExpend: boolean = false;
    slideConfig = {
        //effect: 'flip',
        // slidesPerView: 1,
        // centeredSlides: false,
        allowTouchMove: false,
        autoHeight: true,
    };

    dyneInOrders: Order[];
    orders: Order[];
    orderFilterData: Order[];
    isTodaysDyneInOrder: boolean = false;
    isTodaysRoomOrder: boolean = false;
    noOfPax = 1;
    isItemUpdate: boolean = false;
    isShowNameList: boolean = false;
    customers: Customer[];
    isConfirmOrder: boolean = false;
    isConvertOrder: boolean = false;
    userData: ApplicationUser;

    orderSegment: string = "Review";
    orderStatus: any;
    updateOrder: boolean = false;
    showServiceCharge: boolean = false;
    PosUserName: string;
    isCartList: boolean = false;
    prevOrder: Order;
    selectedEditIndex: number;
    amountEditMode: Boolean = false;
    editVariable: Boolean = false;
    deliveryMethod: string;
    orderServiceId: any;
    advancedPayments: Payment[] = [];
    partialPaidAmount: number = 0;
    partialDueAmount: number = 0;
    previousOrderproductLine: any[] = [];
    previousOrderAmount: number;
    PhoneNumberWithoutCode: string;
    customerAddress: Address;
    isOrderIdAvailable: boolean = true;
    kotList: KOT[] = [];
    setCustomServiceCharge: boolean = false;
    paymentsNotPaid: Payment[];
    customerExist: boolean;
    payments: Payment[] = [];
    paymentsPaid: Payment[] = [];
    serviceSelected = false;
    openProductGroup: ProductGroup;
    disbleService: boolean = false;
    promoMessage = "";
    businessOfferDto: BusinessOfferDto[];
    orderProductSelected: OrderProduct;
    serviceCharge: ServiceCharge;
    promoCodeSelected: boolean = false;
    groupedOrderLines: any;
    kot: KOT;
    isMaxError: boolean = false;
    previousDeliveryMethod:string;
    constructor(
        private toastController: ToastController,
        private navCtrl: NavController,
      
        private routerOutlet: IonRouterOutlet,
        private route: Router,
        public loadingCtrl: LoadingController,
        private actionSheetController: ActionSheetController,
        private expenseService: ExpenseService,
        private customerService: CustomerService,
        private locationBack: Location,
        private authService: AuthService,
        private reservationService: ReservationService,
        private orderService: OrderService,
        private dateService: DateService,
        private changeDetectorRefs: ChangeDetectorRef,
        private acRoute: ActivatedRoute,
        private paymentService: PaymentService,
        public token: TokenStorage,
        // private modalController: ModalController,
        public menuCtrl: MenuController,
        private formBuilder: FormBuilder,
        private propertyService: PropertyService,
        private bookingService: BookingService,
        private modalController: ModalController,
        public datepipe: DatePipe,
    ) {
        this.prevOrder = new Order();
        this.order = new Order();
        this.paymentReservation = new Payment();
        this.customer = new Customer();
        this.CountryArray = new CountryList();
        // this.propertyAddress = new Address();
        this.address = new ShipToAddress();
        this.bankAccount = new BankAccount();
        this.slot = new Slots();
        this.checkUserType = new CheckUserType();
        this.payment = new Payment();
        
        this.pointOfSale = new PointOfSale();
        this.businessService = new BusinessServiceDtoList();
        this.propertyAddress = this.token.getProperty().address;
        this.countryCode = new CountryCode();
        this.property = new Property();
        this.businessServiceType = new BusinessServiceTypes();
        this.resource = new ResourceList();
        this.userData = new ApplicationUser();
        this.location = new LocationList();
        this.expense = new ExpenseModel();
        this.slotReservation = new SlotReservation();
        this.booking = new Booking();
        this.user = new ApplicationUser();
        this.propertiesDto = new BusinessProperties();
        this.productGroup = new ProductGroup();
        this.paymentDTO = new Payment();

        this.businessServices = [];
        this.orderProducts = [];
        this.kot = new KOT();
    }

    ngOnInit() {

        this.initController();

        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.user = resp.body;
                this.PosUserName = this.user.firstName + " " + this.user.lastName;
                if (this.user.maxOrderDiscountPercentage != null && this.user.maxOrderDiscountPercentage != undefined && this.user.maxOrderDiscountPercentage > 0)
                    {
                      this.maxOrderDiscountPercentage = this.user.maxOrderDiscountPercentage;
                    }
                    else
                    {
                      this.maxOrderDiscountPercentage = 100;
                    }
                if (this.user.maxOrderItemDiscountPercentage != null && this.user.maxOrderItemDiscountPercentage != undefined && this.user.maxOrderItemDiscountPercentage >= 0) {
                    this.maxOrderItemDiscountPercentage = this.user.maxOrderItemDiscountPercentage;
                }
                else {
                    this.maxOrderItemDiscountPercentage = 100;
                }
            });

        this.property = this.token.getProperty();
        this.propertyId = Number(this.property.id);
        this.currency = this.property.localCurrency.toUpperCase();
        this.getOfferDetails();

        let isPaymentOrBookingFetched = false;

        this.acRoute.queryParams.subscribe((params) => {
            if (params["order"] != undefined) {
                this.order = JSON.parse(params["order"]);
                this.isCartList = false;
                this.prevOrder = this.order;
                this.prevOrder = this.order;
            
                if (this.token.getRole().includes("PROP_SERVICE_EXECUTIVE")) {
                    this.isPropServiceExecutive = true;
                }
                
                
                
                this.previousOrderproductLine = this.prevOrder?.orderLineDtoList;
                this.previousOrderAmount = this.prevOrder?.totalOrderAmount;
                this.previousDeliveryMethod = this.orderDTO?.deliveryMethod;
                // console.log("previousorderamount "+ this.previousOrderAmount)
                if (this.order.serviceChargeAmount == null || this.order.serviceChargeAmount == undefined || this.order.serviceChargeAmount === 0) {
                    this.showServiceCharge = false
                } else {
                    this.showServiceCharge = true
                }
                if (this.order.deliveryMethod === "Room Order") {
                    this.order.modeOfPayment = "Cash";

                }
                this.getOrderDetailById(this.order.id);
                if (this.order.deliveryMethod != "Room Order") {
                    if (
                      this.order.bookOneOrderId != null &&
                      this.order.bookOneOrderId != undefined
                    ) {
                      this.getPaymentByRevId(this.order.bookOneOrderId);
                    }
                  } else {
                    if (
                      this.order.bookingId != null &&
                      this.order.bookingId != undefined
                    ) {
                      this.getBookingById();
                    }
                  }
                
            }
           
            if (params["orderStatusone"] != undefined) {
                this.orderStatus = params["orderStatusone"];
                if (this.orderStatus === 'Update') {
                    this.updateOrder = true;
                   
                }
            }
            if (params["isConvertOrder"] != undefined) {
                this.isConvertOrder = true;
            }

            if (params["itemUpdate"] != undefined) {
                this.isItemUpdate = true;
            }

            if (params["dyneInOrder"] != undefined) {
                this.order = JSON.parse(params["dyneInOrder"]);

                this.isNewOrderCreated = true;
                this.isTodaysDyneInOrder = false;
                this.onSelectType("InDine");
            }

            if (params["quickDyneInOrder"] != undefined) {
                this.order = JSON.parse(params["quickDyneInOrder"]);

                this.isNewOrderCreated = true;
                this.isTodaysDyneInOrder = true;
                this.onSelectType("InDine");
                this.orderSegment = "Details";
            }

            if (params["roomOrder"] != undefined) {
                this.order = JSON.parse(params["roomOrder"]);
                this.isNewOrderCreated = true;
                this.isTodaysRoomOrder = true;
                this.onSelectType("RoomOrder");

                this.getGuestsInHouseToday(
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        this.order.orderedDate
                    )
                );

                if (
                    this.order.firstName === null ||
                    (this.order.firstName === undefined &&
                        this.order.lastName === null) ||
                    this.order.lastName === undefined
                ) {
                    if (
                        this.order.customerName != null &&
                        this.order.customerName != undefined
                    ) {
                        let customerName = this.order.customerName.split(
                            " ",
                            2
                        );
                        this.order.firstName = customerName[0];
                        this.order.lastName = customerName[1];

                        //Logger.log(this.order.firstName + 'this.order.customerName '+this.order.lastName );
                    }
                }
            }

        });
 
        if (this.orderDTO != undefined && this.orderDTO != null) {
            this.order = this.orderDTO;
            this.prevOrder = this.order;
            // console.log("previous order " + JSON.stringify(this.prevOrder.orderLineDtoList))
            this.previousOrderproductLine = this.prevOrder.orderLineDtoList;
            // this.previousOrderAmount = this.prevOrder.totalOrderAmount;
            // console.log("previous order amount" +this.order.totalOrderAmount)
            this.getNoOfPax();

            if (this.order.taxDetails != null && this.order.taxDetails != undefined && this.order.taxDetails.length > 0) {
                this.taxDetails = this.order.taxDetails;
            }

            this.isExpend = true;
            this.deliveryMethod = this.order.deliveryMethod;

            this.discountPercentage = this.getValue(this.order.discountPercentage);

            this.kotList = [];
            if (this.order.kotDtoList != null && this.order.kotDtoList.length > 0) {
                this.kotList = this.order.kotDtoList;
            }

            if (this.order.serviceChargeName != null && this.order.serviceChargePercentage != null) {
                this.setCustomServiceCharge = false;
            } else {
                this.setCustomServiceCharge = true;
            }


            if (
                this.orderDTO.orderStatus != null &&
                this.orderDTO.orderStatus != undefined &&
                this.orderDTO.orderStatus === "Confirmed"
            ) {
                this.isConfirmOrder = true;
            }

            // if (this.order.bookingId != null) {
            //     this.getBookingById();
            // }
            // if (this.order.deliveryMethod != "Room Order") {
            //     if (
            //         this.order.bookOneOrderId != null &&
            //         this.order.bookOneOrderId != undefined
            //     ) {
            //         this.getPaymentByRevId(this.order.bookOneOrderId);
            //     }
            // }

            if (
                this.order.orderedTime != null &&
                this.order.orderedTime != undefined &&
                this.order.orderedTime.split("-").length > 1
            ) {
                this.orderSlotTime = this.order.orderedTime;
            } else if (
                this.order.requiredTime != null &&
                this.order.requiredTime != undefined &&
                this.order.requiredTime.split("-").length > 1
            ) {
                this.orderSlotTime = this.order.requiredTime;
            } else if (
                this.order.orderSlot != null &&
                this.order.orderSlot != undefined &&
                this.order.orderSlot.split("-").length > 1
            ) {
                this.orderSlotTime = this.order.orderSlot;
            }

            this.discountPercentage = this.getValue(this.order.discountPercentage);

            this.isNewOrderCreated = false;

            if (
                this.order.firstName === null ||
                (this.order.firstName === undefined && this.order.lastName === null) ||
                this.order.lastName === undefined
            ) {
                if (
                    this.order.customerName != null &&
                    this.order.customerName != undefined
                ) {
                    let customerName = this.order.customerName.split(" ", 2);
                    this.order.firstName = customerName[0];
                    this.order.lastName = customerName[1];

                    //Logger.log(this.order.firstName + 'this.order.customerName '+this.order.lastName );
                }
            }

            if (this.order.deliveryMethod === "Home Delivery") {
                this.customerExist = true;
                this.customer.id = this.order.customerId;
                this.customer.firstName = this.order.firstName;
                this.customer.lastName = this.order.lastName;
                this.customer.mobile = this.order.mobile;
                this.customer.email = this.order.email;

                if (
                    this.order.shipToAddress != null &&
                    this.order.shipToAddress != undefined
                ) {
                    this.customerAddress = this.order.shipToAddress;
                }

                if (this.order.id === null || this.order.id === undefined) {
                    this.requiredDateAndTimeCalculate();
                }
            } else if (
                this.order.deliveryMethod === "Room Order" &&
                !this.isOrderIdAvailable
            ) {
                if (this.order.bookingId != null && this.order.bookingId != undefined) {
                    // this.getBookingById(this.order.bookingId);
                }
                this.getCartFromOrder();
            }
            if (this.order.mobile != null && this.order.mobile != undefined) {
                this.setMobileNumberByCode(this.order.mobile);
            } else {
                this.PhoneNumberWithoutCode = this.order.mobile;
                this.checkDefaultCountryCode();
            }
        } else {
            this.isNewOrderCreated = true;
        }
      
        this.viewInit();
        this.checkDefaultCountryCode();
        this.getPOSInformation(this.property.id);
        this.getUserData();

        this.locationAddress();
        this.requiredDateAndTimeCalculate();

        if (this.order.id === null || this.order.id === undefined) {
            this.order.modeOfPayment = "Cash";
            this.payment.status = "NotPaid";
        }

        if (
            this.order.advanceAmount === null ||
            this.order.advanceAmount === undefined
          ) {
            this.order.advanceAmount = 0;
          }
    }
showproducts(){
    this.productGroup = new ProductGroup();
   
    if(this.productGroupsList.length >= 0){
        this.productGroup = this.productGroupsList[0]?.productGroup[0]
    }
    
}
    getValue(value) {
        if (value != null && value != undefined) {
            return value;
        }
        else {
            return 0;
        }
    }

    setDefaultCounter(isRequestTimeCheck) {
        let isMatch: boolean = false;
        if (
          this.order.id == null ||
          this.order.id === undefined ||
          (this.order.id != null &&
            this.order.id != undefined &&
            this.order.operatorName != null &&
            this.order.operatorName != undefined &&
            this.PosUserName != null &&
            this.PosUserName != undefined &&
            this.order.operatorName.toLocaleLowerCase() ===
              this.PosUserName.toLocaleLowerCase() ||
              (this.PosUserName != null &&
                this.PosUserName != undefined &&
                isRequestTimeCheck === true))
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
    
                    if (this.order.id === null || this.order.id === undefined) {
                      this.order.counterNumber = this.pointOfSale.counterNumber;
                      this.order.operatorName = this.PosUserName;
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

      async getServiceCharge(businessServiceId: number) {
        try {
            this.loader = true;
            this.serviceCharges = [];
            const data = await this.reservationService.getServiceCharge(businessServiceId).toPromise();
            this.serviceCharges = data.body;
            if (this.serviceCharges.length == 1) {
              this.order.serviceChargeName = this.serviceCharges[0].name;
              this.serviceChargeChange()
            }
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
        } catch (error) {
            this.loader = false;
            // Logger.log(JSON.stringify(error));
        }
      }

      serviceChargeChange() {
        if (this.serviceCharges != null && this.serviceCharges.length > 0) {
          this.serviceCharge = this.serviceCharges.find(
            (data) => data.name === this.order.serviceChargeName
          );
          this.order.serviceChargePercentage = Number(
            this.serviceCharge.percentage
          );
        }
        
        if (this.order.complimentary == true) {
          this.order.serviceChargeName = null;
          this.order.serviceChargePercentage = 0;
          this.order.serviceChargeAmount = 0;
        }
        
        this.calculatePrice();
      }

    async getOfferDetails() {
        try {
            this.loader = true;
            const data = await this.orderService.getOfferDetailsBySeoFriendlyName(this.property.seoFriendlyName).toPromise();
            this.businessOfferDto = data.body;
            this.loader = false;
            if (this.order.complimentary == true) {
              this.promoCode = this.businessOfferDto.find(offer => offer.name === "Complimentary");
              this.promoMessage = '"' + this.promoCode.couponCode + '" applied!';
              this.disbleService = true;
              this.isDiscountEditMode = true;
            }
        } catch (error) {
            // Handle error
        }
    }

    async  addOpenItem(){
        const modal = await this.modalController.create({
            component: OpenProductComponent,
            componentProps: {
                orderProducts: this.orderProducts, 
                productGroup: this.openProductGroup,  
            },
          });
          modal.onDidDismiss().then((data) => {
            this.calculateTaxSlab();
            this.isCartList = true
             this.successDialogClose();
          });
          return await modal.present();
    }

    successDialogClose() {
        this.modalController.dismiss("done");
    }
    dismiss() {
        this.modalController.dismiss();
    }

    paymentStatusCheck() {
        if (this.order.orderPaymentStatus === "Paid") {
          this.order.advanceAmount = 0;
          this.calculatePrice();
          this.order.advanceAmount = this.order.totalOrderAmount;
          this.calculatePrice();
        } else if (this.order.orderPaymentStatus === "NotPaid") {
          this.order.advanceAmount = 0;
          this.calculatePrice();
        }
      }


    async getBookingById() {
        try {
            const response1 = await this.bookingService.findBooking(this.order.bookingId).toPromise();
            this.booking = response1.body;
            this.getPaymentDetailsByBooking();
        } catch (error) {
            this.loader = false;
        }
    }
    
    ionViewWillEnter(){
        if (this.order.deliveryMethod != "Room Order") {
            if (
              this.order.bookOneOrderId != null &&
              this.order.bookOneOrderId != undefined
            ) {
              this.getPaymentByRevId(this.order.bookOneOrderId);
            }
          } else {
            if (
              this.order.bookingId != null &&
              this.order.bookingId != undefined
            ) {
              this.getBookingById();
            }
          }
          this.getOfferDetails();

          
    }


    async getPaymentDetailsByBooking() {

        try {
            const res = await this.paymentService.findPaymentByReferenceNumber(this.booking?.propertyReservationNumber).toPromise();

            this.paymentsNotPaid = res.filter((item) => {
                const searchResult =
                    item.orderId != null &&
                    item.orderId === this.order.id &&
                    item.status != null &&
                    item.status === "NotPaid";

                return searchResult;
            });

            this.payments = res.filter((item) => {
                const searchResult =
                    item.orderId != null &&
                    item.orderId === this.order.id;

                return searchResult;
            });
            //   console.log("this.payments"+JSON.stringify(this.payments))
            this.paymentsPaid = this.payments.filter((item) => {
                const searchResult =
                    item.status != null &&
                    item.status.toLowerCase() === "paid";

                return searchResult;
            });


          
            // console.log("this.payments"+JSON.stringify(this.payments))
            if (this.outStandingAmount() >= 0 && this.order.totalOrderAmount > 0 || this.getPaidAmount() > 0) {
                this.isPaidOrder = true;
            } else {
                this.isPaidOrder = false;
            }
        } catch (error) {
            // Handle error
        }
    }

    outStandingAmount() {
        return this.getPaidAmount() - this.order.totalOrderAmount;
    }

    getPaidAmount() {

        //    console.log("this.paymentsPaid"+JSON.stringify(this.paymentsPaid))
        let sum = 0;
        if (this.paymentsPaid != null && this.paymentsPaid != undefined) {
            for (let i = 0; i < this.paymentsPaid.length; i++) {
                sum = sum + this.paymentsPaid[i].transactionAmount;
                // console.log("sum"+sum)
            }
        }

        return sum;
    }

    getNoOfPax() {
        if (this.order.id === null || this.order.id === undefined) {
            this.order.noOfPerson = 1;
        }
        else if (this.order.noOfPerson === null || this.order.noOfPerson === undefined) {
            this.order.noOfPerson = 1;
        }
    }

    editSellUnitPrice(selectedIndex) {
        this.selectedEditIndex = selectedIndex;
        this.amountEditMode = true;
        this.editVariable = true;
        // console.log ("index",selectedIndex)
    }

    saveSellUnitPrice(selectedIndex) {
        this.amountEditMode = false;
        this.editVariable = false;
    }

    cancelRow() {
        this.amountEditMode = false;
    }

    onChangeList() {
        if (this.isCartList === false) {
            this.isCartList = true;
        }
        else {
            this.isCartList = false;
        }
    }
    initController() {
        this.onFinalDetailForm = this.formBuilder.group({
            PaymentMethod: ["", Validators.compose([Validators.required])],
            StatusPayment: ["", Validators.compose([Validators.nullValidator])],

        });

        this.onInDineForm = this.formBuilder.group({
            customerSearchController: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            nameSearchController: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            BusinesService: ["", Validators.compose([Validators.required])],
            firstName: ["", Validators.compose([Validators.nullValidator])],
            lastName: ["", Validators.compose([Validators.nullValidator])],
            Email: [
                "",
                Validators.compose([
                    Validators.nullValidator,
                    Validators.email,
                ]),
            ],
            countryCodeController: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            Phone: [
                "",
                Validators.compose([
                    Validators.nullValidator,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],
            BusinessServiceType: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            // DeliverySlot: ["", Validators.compose([Validators.nullValidator])],
            LocationName: ["", Validators.compose([Validators.nullValidator])],
            ResourceName: ["", Validators.compose([Validators.nullValidator])],
            //  SpecialNotes: ["", Validators.compose([Validators.nullValidator])],
            CounterNumber: ["", Validators.compose([Validators.nullValidator])],
            OperatorName: ["", Validators.compose([Validators.nullValidator])],
        });

        this.onTakeAwayForm = this.formBuilder.group({
            customerSearchController: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            nameSearchController: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            // RequiredDate: [
            //     "",
            //     Validators.compose([Validators.required]),
            // ],
            firstName: ["", Validators.compose([Validators.required])],
            lastName: ["", Validators.compose([Validators.required])],
            Email: [
                "",
                Validators.compose([
                    Validators.nullValidator,
                    Validators.email,
                ]),
            ],
            countryCodeController: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            Phone: [
                "",
                Validators.compose([
                    Validators.nullValidator,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],
            CounterNumber: ["", Validators.compose([Validators.nullValidator])],
            OperatorName: ["", Validators.compose([Validators.nullValidator])],

        });

        this.onRoomOrderForm = this.formBuilder.group({
            // RequiredDate: [
            //     "",
            //     Validators.compose([Validators.required]),
            // ],
            searchControl: ["", Validators.compose([Validators.nullValidator])],
            Room: ["", Validators.compose([Validators.required])],
            BookingControl: ["", Validators.compose([Validators.required])],
            firstName: ["", Validators.compose([Validators.nullValidator])],
            lastName: ["", Validators.compose([Validators.nullValidator])],
            Email: [
                "",
                Validators.compose([
                    Validators.nullValidator,
                    Validators.email,
                ]),
            ],
            countryCodeController: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            Phone: [
                "",
                Validators.compose([
                    Validators.nullValidator,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],
            CounterNumber: ["", Validators.compose([Validators.nullValidator])],
            OperatorName: ["", Validators.compose([Validators.nullValidator])],

        });

        //.........................

        this.onPhoneCheckForm = this.formBuilder.group({
            countryCodeC: ["", Validators.compose([Validators.required])],
            countryCodeController: [
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

        this.onbankForm = this.formBuilder.group({
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

        this.onEmailCheckForm = this.formBuilder.group({
            EmailCheck: ["", Validators.compose([Validators.email])],
        });

        this.onSubmitForm = this.formBuilder.group({
            firstName: ["", Validators.compose([Validators.required])],
            lastName: ["", Validators.compose([Validators.required])],
            Email: [
                "",
                Validators.compose([Validators.required, Validators.email]),
            ],
            Phone: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],
            StreetNumber: ["", Validators.compose([Validators.nullValidator])],
            streetName: ["", Validators.compose([Validators.nullValidator])],
            locality: ["", Validators.compose([Validators.nullValidator])],
            suburb: ["", Validators.compose([Validators.required])],
            city: ["", Validators.compose([Validators.required])],
            postcode: ["", Validators.compose([Validators.nullValidator])],
            state: ["", Validators.compose([Validators.required])],
            country: ["", Validators.compose([Validators.required])],
            CounterNumber: ["", Validators.compose([Validators.nullValidator])],
            OperatorName: ["", Validators.compose([Validators.nullValidator])],
        });

        this.onCardBookForm = this.formBuilder.group({
            cardNumber: [
                "",
                Validators.compose([
                    Validators.required,
                    ,
                ]),
            ],
            // name: ["", Validators.compose([Validators.required])],
            // cvv: [
            //     "",
            //     Validators.compose([
            //         Validators.required,
            //         Validators.pattern(PhoneNumberEXP),
            //     ]),
            // ],
            // expYear: ["", Validators.compose([Validators.required])],
            // expMonth: ["", Validators.compose([Validators.required])],
        });
    }

    viewInit() {
        if (
            this.property.localCurrency != null &&
            this.property.localCurrency != undefined
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }

        this.propertyAddress = this.property.address;
        this.businessPlan = this.property.plan;
        this.bankAccount = this.property.bankAccount;

        if (this.bankAccount != undefined && this.bankAccount != null) {
            this.isBankTransferAvailable = true;
        } else {
            this.isBankTransferAvailable = false;
        }

        this.mobileWallet = this.property.mobileWallet;
        if (this.mobileWallet != undefined && this.mobileWallet != null) {
            this.isWalletAvailable = true;
        } else {
            this.isWalletAvailable = false;
        }

        if (this.order.id === undefined) {
            this.orderCurrentDate();
            this.getGuestsInHouseToday(this.order.orderedDate);

            if (this.order.deliveryMethod != "Room Order") {
                this.onSelectType('InDine');
            }

        }

        if (
            this.token.getBusinessProperties() != null &&
            this.token.getBusinessProperties() != undefined
        ) {
            this.propertiesDto = this.token.getBusinessProperties();
            this.businessServiceSetup();
        } else {
            this.getAllBusinessService(String(this.property.id));
        }

        this.getPOSInformation(this.property.id);
        this.todaysOrder(String(this.property.id));
    }

    onNextPage() {
        this.orderSegment = "Details";
    }

    getUserData() {
        this.loader = true;
        const UserId = this.token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(data => {
            this.userData = data.body;
            this.loader = false;
            this.changeDetectorRefs.detectChanges();

        }, error => {
            this.loader = false;
        });

    }

    getAllBusinessService(PropertyId: string) {
        this.loader = true;
        this.orderService.findByPropertyId(PropertyId).subscribe(
            (data) => {
                this.propertiesDto = data.body;

                this.token.saveBusinessProperties(this.propertiesDto);

                this.loader = false;
                this.businessServiceSetup();
            },
            (error) => {
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            }
        );
    }

    businessServiceSetup() {
        this.orderProducts = [];
        this.productGroupsList = [];
        this.businessServiceList = [];

        if (this.propertiesDto.businessServiceDtoList.length > 0) {
            this.businessServiceList =
                this.propertiesDto.businessServiceDtoList;
            let businessServiceRestaurant = [];

            if (this.order.id === undefined) {
                // for (let i = 0; i < this.propertiesDto.businessServiceDtoList.length; i++) {
                //   if (this.propertiesDto.businessServiceDtoList[i].active === true) {
                //     this.bserviceid = this.propertiesDto.businessServiceDtoList[i].id;
                //     this.setService(this.propertiesDto.businessServiceDtoList[i].id);

                //     break;
                //   }
                // }
                let searchResult;
                businessServiceRestaurant = this.businessServiceList;
                businessServiceRestaurant = businessServiceRestaurant.filter(
                    (item) => {
                        searchResult =
                            item.name != null &&
                            item.name != undefined &&
                            item.name.toLowerCase() === "restaurants" &&
                            item.active != null &&
                            item.active != undefined &&
                            item.active === true;

                        return searchResult;
                    }
                );

                if (
                    businessServiceRestaurant != null &&
                    businessServiceRestaurant != undefined &&
                    businessServiceRestaurant.length > 0
                ) {
                    this.bserviceid = businessServiceRestaurant[0].id;
                    this.setService(businessServiceRestaurant[0].id);
                } else {
                    this.bserviceid =
                        this.propertiesDto.businessServiceDtoList[0].id;
                    this.setService(
                        this.propertiesDto.businessServiceDtoList[0].id
                    );
                }
            } else {
                this.isNewOrderCreated = false;
                this.bserviceid = this.order.businessServiceId;
                this.setService(this.order.businessServiceId);
            }
        }

        if (this.businessService != null && this.businessService != undefined) {
            this.propertyTaxDetails = this.token.getTaxDetails(
                this.businessService,
                this.property
            );
            if (this.order.id === null || this.order.id === undefined) {

                if (this.taxDetailsSelected.length === 0) {
                    for (let i = 0; i < this.propertyTaxDetails.length; i++) {
                        if (
                            this.propertyTaxDetails[i].name.toLowerCase() ===
                            "cgst" ||
                            this.propertyTaxDetails[i].name.toLowerCase() === "sgst"
                        ) {
                            this.taxDetailsSelected.push(
                                this.propertyTaxDetails[i]
                            );
                        }
                    }
                    //this.taxDetailsSelected.push(this.propertyTaxDetails[0]);
                }
            }

        }

        this.changeDetectorRefs.detectChanges();
    }

    calculateTaxSlab() {
        this.totalSplitTax = [];
        this.order.taxAmount = 0;

        if (this.taxDetailsSelected.length > 0) {
            for (let i = 0; i < this.taxDetailsSelected.length; i++) {
                let taxPercentage = this.token.getTaxPercentageByTaxDetail(
                    this.total,
                    this.taxDetailsSelected[i]
                );

                if (taxPercentage != null && taxPercentage != undefined) {
                    let totalTaxAmount =
                        (this.subTotalAmount - this.nonGstTotalAmount) * (taxPercentage / 100)
                    this.order.taxAmount =
                        this.order.taxAmount + totalTaxAmount;

                    let tax: SplitTaxDTO = {
                        name: this.taxDetailsSelected[i].name,
                        percentage: taxPercentage,
                        taxAmount: totalTaxAmount,
                    };

                    this.taxDetailsSelected[i].percentage = taxPercentage;
                    this.taxDetailsSelected[i].taxAmount = totalTaxAmount;
                    this.taxDetailsSelected[i].taxableAmount =
                        this.total - this.order.discountAmount;

                    this.totalSplitTax.push(tax);
                } else {
                    this.taxDetailsSelected[i].taxAmount = 0;
                }
            }
        }
        this.order.taxAmount = Math.round(this.order.taxAmount)
        this.order.taxDetails = this.taxDetailsSelected;
    }

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

    setService(ServiceId: number) {
        this.selectedIndex = -1;
        this.serviceSelected = !!ServiceId;
        this.businessServiceId = 0;
        this.productGroup = new ProductGroup();
        // reset

        this.businessService = new BusinessServiceDtoList();
        this.businessService = this.propertiesDto.businessServiceDtoList.find(
            (data) => data.id === ServiceId
        );

        this.propertyTaxDetails = this.token.getTaxDetails(
            this.businessService,
            this.property
        );

        this.checkBusinessServiceType();
        this.checkTaxPercentage();

        this.orderProducts = [];
        this.productGroupsList = [];
        this.businessServices = [];

        this.businessServices.push(this.businessService);
        this.getAllGroupProduct(
            this.businessService.id,
            0,
            this.businessService
        );

        this.getAllDeliveryOptionByServiceId(this.businessService.id);
        this.getServiceCharge(this.businessService.id);
        this.requiredDateAndTimeCalculate();
    }

    getAllDeliveryOptionByServiceId(businessServiceId: number) {
        this.loader = true;
        this.reservationService.getDeliveryOption(businessServiceId).subscribe(
            (data) => {
                this.deliveryOptions = data.body;
                this.loader = false;

                if (this.order.id != undefined && this.order.id != null) {
                    if (this.order.deliveryMethod === "Home Delivery") {
                        if (this.deliveryOptions.length > 0) {
                            this.deliveryOption = this.deliveryOptions.find(
                                (data) => data.code === this.order.deliveryCode
                            );
                            //  Logger.log('this.deliveryOption  '+ JSON.stringify(this.deliveryOption));

                            this.order.deliveryCode = this.deliveryOption.code;
                            this.order.deliveryChargeAmount =
                                this.deliveryOption.charges;
                            this.payment.deliveryChargeAmount =
                                this.deliveryOption.charges;
                            this.paymentReservation.deliveryChargeAmount =
                                this.deliveryOption.charges;
                        }
                    }
                }

                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
                // Logger.log(JSON.stringify(error));
            }
        );
    }
    clearProductSearch(event) {
        // console.log("claer ");
        this.bookingSearchReselt = "";
        this.productGroupsSearchList = this.filteredProductGroupsSearchList;
        this.getAllGroupProductFromTokenStorage(this.bserviceid);
    }

    onProductSearch(s: string) {

        this.isCartList = false;
        let searchResult;
        
        if (this.bookingSearchReselt === "") {
            this.productGroupsSearchList = this.filteredProductGroupsSearchList;
        } else {
            this.productGroupsSearchList = this.filteredProductGroupsSearchList;

            this.productGroupsSearchList = this.productGroupsSearchList.filter(
                (item) => {
                    searchResult =
                        (item.name != null &&
                            item.name != undefined &&
                            item.name
                                .toLowerCase()
                                .trim()
                                .indexOf(
                                    this.bookingSearchReselt
                                        .toLowerCase()
                                        .trim()
                                ) > -1) ||
                        (item.productCode != null &&
                            item.productCode != undefined &&
                            item.productCode
                                .toLowerCase()
                                .trim()
                                .indexOf(
                                    this.bookingSearchReselt
                                        .toLowerCase()
                                        .trim()
                                ) > -1) ||
                        (item.productVariationDtoList != null &&
                            item.productVariationDtoList.length > 0 &&
                            item.productVariationDtoList.some(
                                (variation) =>
                                    variation.name != null &&
                                    variation.name != undefined &&
                                    variation.name
                                        .toLowerCase()
                                        .trim()
                                        .indexOf(
                                            this.bookingSearchReselt
                                                .toLowerCase()
                                                .trim()
                                        ) > -1
                            )) ||
                        (item.productVariationDtoList != null &&
                            item.productVariationDtoList.length > 0 &&
                            item.productVariationDtoList.some(
                                (variation) =>
                                    variation.code != null &&
                                    variation.code != undefined &&
                                    variation.code
                                        .toLowerCase()
                                        .trim()
                                        .indexOf(
                                            this.bookingSearchReselt
                                                .toLowerCase()
                                                .trim()
                                        ) > -1
                            ));
                    
                    return searchResult;
                }
            );
            this.productGroupsSearchList = this.productGroupsSearchList.filter(
                (item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
            );
          
        }
    }
    // onProductSearch(filterValue: any) {
    //     let searchResult;
    //     let productSearch = filterValue.target.value;

    //     if (productSearch === "" || productSearch.length < 1) {
    //         this.productGroupsSearchList = this.filteredProductGroupsSearchList;
    //         this.getAllGroupProductFromTokenStorage(this.bserviceid);
    //     } else {
    //         this.productGroupsSearchList = this.filteredProductGroupsSearchList;

    //         this.productGroupsSearchList = this.productGroupsSearchList.filter(
    //             (item) => {
    //                 searchResult =
    //                     (item.name != null &&
    //                         item.name != undefined &&
    //                         item.name
    //                             .toLowerCase()
    //                             .trim()
    //                             .indexOf(productSearch.toLowerCase().trim()) >
    //                             -1) ||
    //                     (item.productVariationDtoList != null &&
    //                         item.productVariationDtoList.length > 0 &&
    //                         item.productVariationDtoList.some(
    //                             (variation) =>
    //                                 variation.name != null &&
    //                                 variation.name != undefined &&
    //                                 variation.name
    //                                     .toLowerCase()
    //                                     .trim()
    //                                     .indexOf(
    //                                         productSearch.toLowerCase().trim()
    //                                     ) > -1
    //                         ));

    //                 return searchResult;
    //             }
    //         );
    //     }
    // }

    getAllGroupProductFromTokenStorage(businessServiceId: number) {
        this.productGroupsList = [];
        this.productGroupsSearchList = [];
        this.filteredProductGroupsSearchList = [];

        this.productGroupListData = this.token.getOrderProductList();

        this.productGroupListData = this.productGroupListData.filter((item) => {

            let searchResult =
                item.isSubGroup === null ||
                item.isSubGroup === undefined ||
                item.isSubGroup === false;

            return searchResult;
        });

        if (this.order.id != undefined) {
            this.getCartFromOrder();
        }
        const productGroup: ProductGroupList = {
            businessServiceId: businessServiceId,
            productGroup: this.productGroupListData,
        };

        this.productGroupsList.push(productGroup);
        if (this.updateOrder === true || this.isConvertOrder === true) {
            this.showproducts();
        }
        for (let i = 0; i < this.productGroupListData.length; i++) {
            for (
                let j = 0;
                j < this.productGroupListData[i].productDtoList.length;
                j++
            ) {
                this.productGroupListData[i].productDtoList[j].groupName =
                    this.productGroupListData[i].name;
                this.productGroupsSearchList.push(
                    this.productGroupListData[i].productDtoList[j]
                );
                this.filteredProductGroupsSearchList.push(
                    this.productGroupListData[i].productDtoList[j]
                );
            }
        }

        this.changeDetectorRefs.detectChanges();
    }

    getAllGroupProduct(
        businessServiceId: number,
        index: number,
        busnessserviceList
    ) {
        this.loader = true;
        this.productGroupsList = [];
        this.productGroupsSearchList = [];
        this.filteredProductGroupsSearchList = [];

        this.orderService
            .findProductsByBusinessServiceId(businessServiceId)
            .subscribe(
                (data) => {
                    this.productGroupsList = [];
                    this.token.saveOrderProductList(data.body);

                    this.productGroupListData = data.body;
                    let productGroups = data.body;

                    if (this.order.id != undefined) {
                        this.getCartFromOrder();
                    }

                    this.productGroupListData = this.productGroupListData.filter((item) => {

                        let searchResult =
                            item.isSubGroup === null ||
                            item.isSubGroup === undefined ||
                            item.isSubGroup === false;

                        return searchResult;
                    });

                    const productGroup: ProductGroupList = {
                        businessServiceId: businessServiceId,
                        productGroup: this.productGroupListData,
                    };

                    this.productGroupsList.push(productGroup);
                    
                    if (this.updateOrder === true || this.isConvertOrder === true ) {
                        this.showproducts();
                    }

                    for (let i = 0; i < data.body.length; i++) {
                        for (
                            let j = 0;
                            j < data.body[i].productDtoList.length;
                            j++
                        ) {
                            data.body[i].productDtoList[j].groupName =
                                data.body[i].name;
                            this.productGroupsSearchList.push(
                                data.body[i].productDtoList[j]
                            );
                            this.filteredProductGroupsSearchList.push(
                                data.body[i].productDtoList[j]
                            );
                        }
                    }
                    this.openProductGroup = productGroups.find((group)=> group.name == "Open Items");
                    // if (busnessserviceList.length == index + 1)
                    // {
                    //     this.loader = false;
                    // }
                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    getCartFromOrder() {
        if (this.isConvertOrder === false) {
            if (this.order.deliveryMethod === "Dine In") {
                this.methodType = "InDine";
            } else if (this.order.deliveryMethod === "Take Away") {
                this.methodType = "TakeAway";
            } else if (this.order.deliveryMethod === "Room Order") {
                this.methodType = "RoomOrder";
            } else if (this.order.deliveryMethod === "Home Delivery") {
                this.methodType = "HomeDelivery";
            }

        }
        if (this.isConvertOrder === true) {
            if (this.order.deliveryMethod === "Dine In") {
                this.methodType = "InDine";
            } else if (this.order.deliveryMethod === "Take Away") {
                this.methodType = "TakeAway";
            } else if (this.order.deliveryMethod === "Room Order") {
                this.methodType = "RoomOrder";
            } else if (this.order.deliveryMethod === "Home Delivery") {
                this.methodType = "HomeDelivery";
            }

        }

        if (
            this.order.orderLineDtoList != null &&
            this.order.orderLineDtoList
        ) {
            for (let i = 0; i < this.order.orderLineDtoList.length; i++) {
                for (let j = 0; j < this.productGroupListData.length; j++) {
                    for (
                        let k = 0;
                        k < this.productGroupListData[j].productDtoList.length;
                        k++
                    ) {
                        if (
                            this.productGroupListData[j].productDtoList[k]
                                .productCode ===
                            this.order.orderLineDtoList[i].productCode &&
                            this.productGroupListData[j].productDtoList[k]
                                .name === this.order.orderLineDtoList[i].name
                        ) {
                            this.selectedIndex = j;
                            this.productGroupListData[j].productDtoList[
                                k
                            ].notes = this.order.orderLineDtoList[i].notes;

                            this.productGroupListData[j].productDtoList[
                                k
                            ].status = this.order.orderLineDtoList[i].status;

                            this.productGroupListData[j].productDtoList[
                                k
                            ].unitsInOrder =
                                this.order.orderLineDtoList[i].unitsInOrder;
                            this.productGroupListData[j].productDtoList[k].discountInPercentage =
                                this.order.orderLineDtoList[i].discountInPercentage;
                            this.productGroupListData[j].productDtoList[k].discountedPrice =
                                this.order.orderLineDtoList[i].discountedPrice;
                            this.productGroupListData[j].productDtoList[k].sellUnitPrice =
                                this.order.orderLineDtoList[i].sellUnitPrice;
                                this.productGroupListData[j].productDtoList[k].isNewItem = false;
                                this.productGroupListData[j].productDtoList[k].shiftVariation = false;

                            this.onProductAdd(
                                this.productGroupListData[j].productDtoList[k],
                                k,
                                this.productGroupListData[j],
                                this.order.businessServiceId,
                                this.selectedIndex,
                                true
                            );
                        } else {
                            for (
                                let l = 0;
                                l <
                                this.productGroupListData[j].productDtoList[k]
                                    .productVariationDtoList.length;
                                l++
                            ) {
                                if (
                                    ((this.order.orderLineDtoList[i]
                                        .productCode === null ||
                                        this.order.orderLineDtoList[i]
                                            .productCode === undefined) &&
                                        this.productGroupListData[j]
                                            .productDtoList[k]
                                            .productVariationDtoList[l].name ===
                                        this.order.orderLineDtoList[i]
                                            .name) ||
                                    (this.order.orderLineDtoList[i]
                                        .productCode != null &&
                                        this.order.orderLineDtoList[i]
                                            .productCode != undefined &&
                                        this.productGroupListData[j]
                                            .productDtoList[k]
                                            .productVariationDtoList[l].code ===
                                        this.order.orderLineDtoList[i]
                                            .productCode &&
                                        this.productGroupListData[j]
                                            .productDtoList[k]
                                            .productVariationDtoList[l].name ===
                                        this.order.orderLineDtoList[i].name)
                                ) {
                                    //Logger.log('variation === ');
                                    this.selectedIndex = j;
                                    this.productGroupListData[j].productDtoList[
                                        k
                                    ].productVariationDtoList[l].notes =
                                        this.order.orderLineDtoList[i].notes;

                                    this.productGroupListData[j].productDtoList[
                                        k
                                    ].productVariationDtoList[l].status =
                                        this.order.orderLineDtoList[i].status;

                                    this.productGroupListData[j].productDtoList[
                                        k
                                    ].productVariationDtoList[l].unitsInOrder =
                                        this.order.orderLineDtoList[
                                            i
                                        ].unitsInOrder;
                                    this.productGroupListData[j].productDtoList[
                                        k
                                    ].productVariationDtoList[l].discountedPrice =
                                        this.order.orderLineDtoList[i].discountedPrice;
                                    this.productGroupListData[j].productDtoList[
                                        k
                                    ].productVariationDtoList[l].discountInPercentage =
                                        this.order.orderLineDtoList[i].discountInPercentage;

                                    this.productGroupListData[j].productDtoList[
                                        k
                                    ].productVariationDtoList[l].sellUnitPrice =
                                        this.order.orderLineDtoList[i].sellUnitPrice;
                                        this.productGroupListData[j].productDtoList[
                                            k
                                          ].productVariationDtoList[l].isNewItem = false;
                                          this.productGroupListData[j].productDtoList[
                                            k
                                          ].productVariationDtoList[l].shiftVariation = false;
                  
                                    this.onProductVariationAdd(
                                        this.productGroupListData[j]
                                            .productDtoList[k],
                                        k,
                                        this.productGroupListData[j],
                                        this.order.businessServiceId,
                                        this.selectedIndex,
                                        this.productGroupListData[j]
                                            .productDtoList[k]
                                            .productVariationDtoList[l],
                                        l,
                                        true
                                    );

                                    //onProductVariationAdd(product,p,productGroup,businessServiceId,this.selectedIndex,variation ,v ,true)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    async shiftItems() {
        const modal = await this.modalController.create({
            component: ItemReleaseComponent,
            cssClass: "my-custom-class",
            swipeToClose: true,
            componentProps: {
                orderProducts: this.orderProductSelectedToShiftList,
                order: this.order,
                businessService: this.businessService,
            },
            presentingElement: this.routerOutlet.nativeEl,
        });

        modal.onDidDismiss().then((result) => {
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


            const data = result.data; 
            const role = result.role;
            if (role === 'success' && data) { 
                for (let i = 0; i < this.orderProductSelectedToShiftList.length; i++) {
                    if(this.orderProductSelectedToShiftList[i].productVariationDtoList.length == 0){
                      const index: number = this.orderProducts.indexOf(this.orderProductSelectedToShiftList[i]);
                      if (index !== -1) {
                        this.orderProducts.splice(index, 1);
                      }
                    } else {
                      this.orderProductSelectedToShiftList[i].variationDtoList.forEach((v)=>{
                        if (v.shiftVariation == true) {
                          this.orderProducts.forEach((op)=>{
          
                            const index: number = op.productVariationDtoList.indexOf(v);
                            if (index !== -1) {
                              op.productVariationDtoList.splice(index, 1);
                            }
                          });
                        }
                       
                      })
                    }
                    
                  }
                  this.orderProductSelectedToShiftList = [];
        this.orderNow();
        this.calculatePrice();
        }
            // this.orderProductSelectedToShiftList = [];
            // this.orderNow();
            // this.calculatePrice();
        });
        return await modal.present();
    }


    checkTaxPercentage() {
        if (
            this.property.gstNumber === undefined ||
            this.property.gstNumber === null ||
            this.property.gstNumber === ""
        ) {
            this.isGstNumber = false;
            this.taxPercentage = 0;
        } else {
            this.isGstNumber = true;

            if (
                this.businessService.taxDetails != null &&
                this.businessService.taxDetails != undefined &&
                this.businessService.taxDetails.length > 0
            ) {
                this.taxPercentage =
                    this.businessService.taxDetails[0].percentage;
                Logger.log("service");
            } else if (
                this.property.taxDetails != null &&
                this.property.taxDetails != undefined &&
                this.property.taxDetails.length > 0
            ) {
                Logger.log("property");
                if (
                    this.property.taxDetails[0].percentage != null &&
                    this.property.taxDetails[0].percentage != undefined
                ) {
                    this.taxPercentage = this.property.taxDetails[0].percentage;
                    Logger.log("property1");
                } else {
                    this.taxPercentage = 0;
                    Logger.log("property2");
                }
            } else {
                Logger.log("property3");
                this.taxPercentage = 0;
            }
        }
    }

    resetAllItemDiscount() {
        this.order.productDiscount = null;
        this.discountToAllProducts();
    }
    discountToAllProducts() {
        if (this.order.productDiscount > this.maxOrderItemDiscountPercentage) {
            this.order.productDiscount = this.maxOrderItemDiscountPercentage;
        }
        for (let i = 0; i < this.orderProducts.length; i++) {
            //product
            if (this.order.productDiscount > 0) {
                let productDiscount = (this.orderProducts[i].sellUnitPrice * this.order.productDiscount) / 100;
                this.orderProducts[i].discountInPercentage = this.order.productDiscount;
                this.orderProducts[i].discountedPrice = this.orderProducts[i].sellUnitPrice - productDiscount;

            } else {
                this.orderProducts[i].discountedPrice = null;
                this.orderProducts[i].discountInPercentage = null;
            }


            if (this.orderProducts[i].discountedPrice !== null && this.orderProducts[i].discountedPrice >= 0) {
                this.orderProducts[i].totalPrice = this.orderProducts[i].discountedPrice * this.orderProducts[i].unitsInOrder;
            } else {
                this.orderProducts[i].totalPrice = this.orderProducts[i].sellUnitPrice * this.orderProducts[i].unitsInOrder;
            }

            //variation
            if (this.orderProducts[i]?.productVariationDtoList != null && this.orderProducts[i]?.productVariationDtoList.length > 0) {
            for (let j = 0; j < this.orderProducts[i].productVariationDtoList?.length; j++) {
                if (this.order.productDiscount > 0) {
                    let variationDiscount = (this.orderProducts[i].productVariationDtoList[j].sellUnitPrice * this.order.productDiscount) / 100;

                    this.orderProducts[i].productVariationDtoList[j].discountedPrice = this.orderProducts[i].productVariationDtoList[j].sellUnitPrice - variationDiscount;
                    this.orderProducts[i].productVariationDtoList[j].discountInPercentage = this.order.productDiscount;
                } else {
                    this.orderProducts[i].productVariationDtoList[j].discountedPrice = null;
                    this.orderProducts[i].productVariationDtoList[j].discountInPercentage = null;
                }

                if (this.orderProducts[i].productVariationDtoList[j].discountedPrice !== null && this.orderProducts[i].productVariationDtoList[j].discountedPrice >= 0) {
                    this.orderProducts[i].productVariationDtoList[j].totalPrice = this.orderProducts[i].productVariationDtoList[j].discountedPrice * this.orderProducts[i].productVariationDtoList[j].unitsInOrder;
                } else {
                    this.orderProducts[i].productVariationDtoList[j].totalPrice = this.orderProducts[i].productVariationDtoList[j].sellUnitPrice * this.orderProducts[i].productVariationDtoList[j].unitsInOrder;
                }
            }
            this.calculatePrice();
        }
    }

    }

    async getPaymentByRevId(revId) {

        try {
            this.loader = true;
            const data = await this.paymentService.findPaymentByReferenceNumber(revId).toPromise();

            if (data.length > 0) {
                this.payments = data;

                this.paymentsNotPaid = data.filter((item) => {
                    const searchResult =
                        item.status != null &&
                        item.status === "NotPaid";

                    return searchResult;
                });

                this.paymentsPaid = this.payments.filter((item) => {
                    const searchResult =
                        item.status != null && item.status.toLocaleLowerCase() === "paid";

                    return searchResult;

                });


                // this.advancedPayments = this.payments.filter((item) =>{
                //   const searchResults = item.status != null && item.status.toLocaleLowerCase() === "paid"
                //                         && item.advancePayment != null && item.advancePayment === true;

                //   return searchResults;
                // });
            }

            this.UIDetectChange();
        } catch (error) {
            this.loader = false;
        }
    }

    calculateSubTotal() {
        let subTotal = 0;
        if (
            this.order.orderLineDtoList != null &&
            this.order.orderLineDtoList != undefined
        ) {
            for (let i = 0; i < this.order.orderLineDtoList.length; i++) {
                if (
                    this.order.orderLineDtoList[i].status === undefined ||
                    this.order.orderLineDtoList[i].status === null ||
                    this.order.orderLineDtoList[i].status ===
                    this.Available_Status ||
                    this.order.orderLineDtoList[i].status ===
                    this.PaidButOutOfStock_Status
                ) {
                    if (
                        this.order.orderLineDtoList[i].discountedPrice !=
                        null &&
                        this.order.orderLineDtoList[i].discountedPrice !=
                        undefined &&
                        this.order.orderLineDtoList[i].discountedPrice > 0
                    ) {
                        subTotal =
                            subTotal +
                            this.order.orderLineDtoList[i].discountedPrice *
                            this.order.orderLineDtoList[i].unitsInOrder;
                    } else {
                        subTotal =
                            subTotal +
                            this.order.orderLineDtoList[i].sellUnitPrice *
                            this.order.orderLineDtoList[i].unitsInOrder;
                    }
                }
            }
        }

        this.order.subTotalAmount = subTotal;
        this.subTotalAmount = subTotal;
        this.calculateProductDistount();
        return subTotal;
    }

    // calculateProductDistount() {
    //     this.totalProductDiscount = 0;
    //     for (let i = 0; i < this.orderProducts.length; i++) {
    //         if (
    //             this.orderProducts[i].discountedPrice != 0 &&
    //             this.orderProducts[i].discountedPrice != null
    //         ) {
    //             this.totalProductDiscount =
    //                 this.totalProductDiscount +
    //                 (this.orderProducts[i].sellUnitPrice -
    //                     this.orderProducts[i].discountedPrice) *
    //                     this.orderProducts[i].unitsInOrder;
    //         } else {
    //         }

    //         if (this.orderProducts[i].productVariationDtoList != undefined) {
    //             for (
    //                 let j = 0;
    //                 j < this.orderProducts[i].productVariationDtoList.length;
    //                 j++
    //             ) {
    //                 if (
    //                     this.orderProducts[i].productVariationDtoList[j]
    //                         .discountedPrice != 0 &&
    //                     this.orderProducts[i].productVariationDtoList[j]
    //                         .discountedPrice != null
    //                 ) {
    //                     this.totalProductDiscount =
    //                         this.totalProductDiscount +
    //                         (this.orderProducts[i].productVariationDtoList[j]
    //                             .sellUnitPrice -
    //                             this.orderProducts[i].productVariationDtoList[j]
    //                                 .discountedPrice) *
    //                             this.orderProducts[i].productVariationDtoList[j]
    //                                 .unitsInOrder;
    //                 }
    //             }
    //         }
    //     }
    // }
    calculateProductDistount() {
        this.totalProductDiscount = 0;
        for (let i = 0; i < this.orderProducts.length; i++) {
            if (
                this.orderProducts[i].discountedPrice != null
            ) {
                this.totalProductDiscount =
                    this.totalProductDiscount +
                    (this.orderProducts[i].sellUnitPrice -
                        this.orderProducts[i].discountedPrice) *
                    this.orderProducts[i].unitsInOrder;
            } else {
            }

            if (this.orderProducts[i].productVariationDtoList != undefined) {
                for (
                    let j = 0;
                    j < this.orderProducts[i].productVariationDtoList.length;
                    j++
                ) {
                    if (

                        this.orderProducts[i].productVariationDtoList[j].discountedPrice !=
                        null
                    ) {
                        this.totalProductDiscount =
                            this.totalProductDiscount +
                            (this.orderProducts[i].productVariationDtoList[j].sellUnitPrice -
                                this.orderProducts[i].productVariationDtoList[j]
                                    .discountedPrice) *
                            this.orderProducts[i].productVariationDtoList[j].unitsInOrder;
                    }
                }
            }
        }
    }

    setCustomerInfo(databody) {
        this.order.firstName = databody.firstName;
        this.order.lastName = databody.lastName;
        this.order.mobile = databody.mobile;
        this.order.email = databody.email;
        this.order.customerId = databody.id;
        this.isCustomerInfoViewOnly = true;

        if (this.order.mobile != null && this.order.mobile != undefined) {
            this.setMobileNumberByCode(this.order.mobile);
        }

        this.customers = [];

        this.isShowNameList = false;
        this.searchResult = "";
    }

    getOrderDetailById(id: number) {
        this.orderService
            .findById(id)
            .toPromise()
            .then((resp) => {
                this.order = resp.body;
                if (this.order.noOfPerson != null && this.order.noOfPerson != undefined) {
                    this.noOfPax = this.order.noOfPerson
                } else {
                    this.noOfPax = this.noOfPax
                }
                if (this.order.deliveryMethod === "Room Order") {
                    this.order.modeOfPayment = "Cash";
                    this.payment.status = "NotPaid"
                }
                if (this.order.taxDetails.length > 0) {
                    this.taxDetailsSelected = this.order.taxDetails
                }
                if (
                    this.order.orderStatus != null &&
                    this.order.orderStatus != undefined &&
                    this.order.orderStatus === "Confirmed"
                ) {
                    this.isConfirmOrder = true;
                }

                this.isTimeSlotAvailable = true;
                this.isNewOrderCreated = false;

                if (
                    this.order.orderedTime != null &&
                    this.order.orderedTime != undefined &&
                    this.order.orderedTime.split("-").length > 1
                ) {
                    this.orderSlotTime = this.order.orderedTime;
                } else if (
                    this.order.requiredTime != null &&
                    this.order.requiredTime != undefined &&
                    this.order.requiredTime.split("-").length > 1
                ) {
                    this.orderSlotTime = this.order.requiredTime;
                } else if (
                    this.order.orderSlot != null &&
                    this.order.orderSlot != undefined &&
                    this.order.orderSlot.split("-").length > 1
                ) {
                    this.orderSlotTime = this.order.orderSlot;
                }

                if (
                    this.order.mobile != null &&
                    this.order.mobile != undefined
                ) {
                    this.setMobileNumberByCode(this.order.mobile);
                }

                //this.resourceSelected = this.order.resourceName;
                // this.locationNameSelected = this.order.locationName;

                if (
                    this.order.bookOneOrderId != null &&
                    this.order.bookOneOrderId != undefined
                ) {
                    this.getPaymentByRevId(this.order.bookOneOrderId);
                }

                this.getGuestsInHouseToday(
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        this.order.orderedDate
                    )
                );

                this.calculateSubTotal();

                if (
                    this.order.discountAmount != undefined &&
                    this.order.discountAmount != null &&
                    this.order.discountAmount > 0
                ) {
                    this.discountPercentage = Math.round(
                        (this.order.discountAmount * 100) /
                        this.order.subTotalAmount);
                } else {
                    this.discountPercentage = 0;
                }

                if (
                    this.order.firstName === null ||
                    (this.order.firstName === undefined &&
                        this.order.lastName === null) ||
                    this.order.lastName === undefined
                ) {
                    if (
                        this.order.customerName != null &&
                        this.order.customerName != undefined
                    ) {
                        let customerName = this.order.customerName.split(
                            " ",
                            2
                        );
                        this.order.firstName = customerName[0];
                        this.order.lastName = customerName[1];

                        //Logger.log(this.order.firstName + 'this.order.customerName '+this.order.lastName );
                    }
                }

                if (this.order.deliveryMethod === "Home Delivery") {
                    this.isCustomercheck = true;
                    this.customer.id = this.order.customerId;
                    this.customer.firstName = this.order.firstName;
                    this.customer.lastName = this.order.lastName;
                    this.customer.mobile = this.order.mobile;
                    this.customer.email = this.order.email;

                    if (
                        this.order.shipToAddress != null &&
                        this.order.shipToAddress != undefined
                    ) {
                        this.address = this.order.shipToAddress;
                    }

                    this.requiredDateAndTimeCalculate();
                }
                // else  if(this.order.deliveryMethod === 'Room Order')
                // {
                //   if(this.order.bookingId != null && this.order.bookingId != undefined)
                //   {
                //    // this.getBookingById(this.order.bookingId);
                //   }
                // }

                if (
                    this.order.businessReservationNumber != null &&
                    this.order.businessReservationNumber != undefined
                ) {
                    this.getReservationDetailsById(
                        this.order.businessReservationNumber
                    );
                }

                if (this.order.deliveryMethod === "Dine In") {
                    if (
                        this.token.getBusinessProperties() != null &&
                        this.token.getBusinessProperties() != undefined
                    ) {
                        this.propertiesDto = this.token.getBusinessProperties();
                        this.businessServiceSetup();
                    } else {
                        this.getAllBusinessService(String(this.property.id));
                    }
                }

                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            })
            .catch((e) => {
                this.loader = false;
            });
    }

    getReservationDetailsById(reservationId) {
        this.loader = true;
        this.reservationService
            .getReservationByReservationId(reservationId)
            .subscribe(
                (data) => {
                    this.slotReservation = data.body;

                    if (
                        this.slotReservation.slotReservationDtos != null &&
                        this.slotReservation.slotReservationDtos != undefined &&
                        this.slotReservation.slotReservationDtos.length > 0
                    ) {
                        if (
                            this.slotReservation.slotReservationDtos[0]
                                .businessServiceId != null &&
                            this.slotReservation.slotReservationDtos[0]
                                .businessServiceId != undefined
                        ) {
                            this.businessServiceType.id =
                                this.slotReservation.slotReservationDtos[0].businessServiceTypeId;

                            this.slot.businessServiceTypeId =
                                this.businessServiceType.id;
                            this.slot.date =
                                this.dateService.convertMillisecondsToYYYMMDDFormat(
                                    this.order.orderedDate
                                );

                            this.slotTimingArrayList = [];
                            this.timesArray = [];

                            if (
                                this.businessService != undefined &&
                                this.businessService != null &&
                                this.businessService.serviceReservation !=
                                null &&
                                this.businessService.serviceReservation !=
                                undefined &&
                                this.businessService.serviceReservation === true
                            ) {
                                this.getSlotByDate(
                                    this.slot,
                                    String(this.slot.businessServiceTypeId)
                                );
                            }

                            this.ResourceName.reset();
                            this.LocationName.reset();
                            //  this.DeliverySlot.reset();
                        }
                    }
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    setRoom(roomno) {
        this.order.roomNo = roomno;
    }

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
                this.loader = true;
                if (this.customerSearchSelecion === "fn") {
                    this.searchCustomerByFirstName(filterValue);
                } else if (this.customerSearchSelecion === "ln") {
                    this.searchCustomerByLastName(filterValue);
                }
            } else {
            }
        } else {
            this.changeDetectorRefs.detectChanges();
        }
    }

    searchCustomerByFirstName(firstName: string) {
        this.customerService
            .getCustomerDetailsByFirstNameAndPropertyId(
                firstName,
                this.token.getProperty().id
            )
            .subscribe(
                (data) => {
                    this.customers = [];
                    this.isShowNameList = true;
                    this.customers = data.body;

                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();
                },
                (_error) => {
                    if (_error.status === 404) {
                    }
                    this.customers = [];
                    this.isShowNameList = false;
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                }
            );
    }

    searchCustomerByLastName(lastName: string) {
        this.customerService
            .getCustomerDetailsByLastNameAndPropertyId(
                lastName,
                this.token.getProperty().id
            )
            .subscribe(
                (data) => {
                    this.customers = [];
                    this.isShowNameList = true;
                    this.customers = data.body;

                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (_error) => {
                    if (_error.status === 404) {
                    }
                    this.customers = [];
                    this.isShowNameList = false;
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                }
            );
    }

    setBooking(book) {
        this.roomDetails = [];
        this.Room.reset();
        this.booking = book;

        if (this.booking.groupBooking === false) {
            this.roomDetails = this.booking.roomDetails;
        } else {
            for (let i = 0; i < this.booking.roomDetails.length; i++) {
                if (
                    this.booking.roomDetails[i].guestName ===
                    this.booking.firstName + " " + this.booking.lastName
                ) {
                    this.roomDetails = [];
                    this.roomDetails.push(this.booking.roomDetails[i]);
                }
            }
        }

        if (this.roomDetails.length > 0) {
            this.RoomNo = this.roomDetails[0].roomNumber; 
            this.setRoom(this.RoomNo); 
        }

        if (
            this.booking.groupBooking === true &&
            this.roomDetails != null &&
            this.roomDetails != undefined &&
            this.roomDetails.length > 0
        ) {
            this.order.bookingId = this.booking.id;
            this.order.customerId = this.roomDetails[0].customerId;
            this.order.firstName = this.booking.firstName;
            this.order.lastName = this.booking.lastName;
            this.order.email = "";
            this.order.mobile = "";

            this.customer.id = this.roomDetails[0].customerId;
            this.customer.firstName = this.booking.firstName;
            this.customer.lastName = this.booking.lastName;
            this.customer.email = "";
            this.customer.mobile = "";
        } else {
            this.order.bookingId = this.booking.id;
            this.order.customerId = this.booking.customerId;
            this.order.firstName = this.booking.firstName;
            this.order.lastName = this.booking.lastName;
            this.order.email = this.booking.email;
            this.order.mobile = this.booking.mobile;
            if (
                this.booking.mobile != null &&
                this.booking.mobile != undefined
            ) {
                this.setMobileNumberByCode(this.booking.mobile);
            }

            this.customer.id = this.booking.customerId;
            this.customer.firstName = this.booking.firstName;
            this.customer.lastName = this.booking.lastName;
            this.customer.email = this.booking.email;
            this.customer.mobile = this.booking.mobile;
        }

        this.isCustomerInfoReadOnly = true;

        this.payment.referenceNumber = book.propertyReservationNumber;
        this.paymentReservation.referenceNumber =
            book.propertyReservationNumber;
        this.RoomNo = book.roomNumbers;
        this.setRoom(book.roomNumbers);
        this.isCustomerInfoReadOnly = true;
    }

    setMobileNumberByCode(phoneNumber) {
        let countryOb = this.countryCode.countries.find(
            (data) => data.code === phoneNumber.substring(0, data.code.length)
        );
        this.CodeNumber = countryOb.code;
        this.PhoneNumberWithOutCode = phoneNumber.substring(
            this.CodeNumber.length
        );
    }

    isRoomOrderLoader() {
        let loader = false;

        if (
            this.order.id != null &&
            this.order.id != undefined &&
            this.order.deliveryMethod != null &&
            this.order.deliveryMethod != undefined &&
            this.order.deliveryMethod === "Room Order"
        ) {
            loader = true;
        }

        if (
            this.order.id != null &&
            this.order.id != undefined &&
            this.booking != null &&
            this.booking != undefined &&
            this.RoomNo != null &&
            this.RoomNo != undefined
        ) {
            loader = false;
        }

        return loader;
    }

    getGuestsInHouseToday(dateString: string) {
        this.bookings = [];
        this.booking.propertyId = this.property.id;
        this.reservationService
            //   .getGuestInHouseToday(+this.property.id, dateString)
            .getGuestInHouseByPropertyId(+this.property.id)
            .subscribe((data) => {
                this.bookings = data.body;
                this.bookingdata = [];

                for (let i = 0; i < this.bookings.length; i++) {
                    if (
                        this.bookings[i].roomDetails != null &&
                        this.bookings[i].roomDetails != undefined &&
                        this.bookings[i].roomDetails.length > 0
                    ) {
                        if (this.bookings[i].groupBooking === false) {
                            for (
                                let j = 0;
                                j < this.bookings[i].roomDetails.length;
                                j++
                            ) {
                                const data: BookingData = {
                                    id: this.bookings[i].id,
                                    firstName: this.bookings[i].firstName,
                                    lastName: this.bookings[i].lastName,
                                    email: this.bookings[i].email,
                                    mobile: this.bookings[i].mobile,
                                    propertyReservationNumber:
                                        this.bookings[i]
                                            .propertyReservationNumber,
                                    roomName: this.bookings[i].roomName,
                                    isGroupBooking: false,
                                    customerId: this.bookings[i].customerId,
                                    roomNumber:
                                        this.bookings[i].roomDetails[j]
                                            .roomNumber,
                                    bookingOb: this.bookings[i],
                                };
                                this.bookingdata.push(data);
                            }
                        } else {
                            for (
                                let j = 0;
                                j < this.bookings[i].roomDetails.length;
                                j++
                            ) {
                                if (
                                    this.bookings[i].firstName +
                                    " " +
                                    this.bookings[i].lastName ===
                                    this.bookings[i].roomDetails[j].guestName
                                ) {
                                    const data: BookingData = {
                                        id: this.bookings[i].id,
                                        firstName: this.bookings[i].firstName,
                                        lastName: this.bookings[i].lastName,
                                        email: this.bookings[i].email,
                                        mobile: this.bookings[i].mobile,
                                        propertyReservationNumber:
                                            this.bookings[i]
                                                .propertyReservationNumber,
                                        roomName: this.bookings[i].roomName,
                                        roomNumber:
                                            this.bookings[i].roomDetails[j]
                                                .roomNumber,
                                        isGroupBooking: true,
                                        customerId:
                                            this.bookings[i].roomDetails[j]
                                                .customerId,
                                        bookingOb: this.bookings[i],
                                    };
                                    this.bookingdata.push(data);
                                }
                            }
                        }
                        this.bookingdata.sort((a, b) => b.id - a.id);
                        this.bookingdata = this.bookingdata.filter(
                            (test, index, array) =>
                                index ===
                                array.findIndex(
                                    (findTest) =>
                                        findTest.roomNumber === test.roomNumber
                                )
                        );
                        this.bookingdata.sort(
                            (a, b) => a.roomNumber - b.roomNumber
                        );
                    }
                }

                this.bookingFilter = this.bookingdata;

                if (this.isNewOrderCreated === false) {
                    if (
                        this.order.bookingId != null &&
                        this.order.bookingId != undefined
                    ) {
                        this.booking = this.bookings.find(
                            (data) => data.id === this.order.bookingId
                        );

                        this.RoomNo = this.order.roomNo;
                    }
                }

                if (this.isTodaysRoomOrder === true) {
                    if (
                        this.order.bookingId != null &&
                        this.order.bookingId != undefined
                    ) {
                        this.booking = this.bookings.find(
                            (data) => data.id === this.order.bookingId
                        );

                        this.RoomNo = this.order.roomNo;
                    }
                }

                this.loader = false;

                this.changeDetectorRefs.detectChanges();
            }),
            (error) => {
                this.loader = false;
            };
    }

    onBookingDetailsSelected(data) {
        this.bookingSearchResult = "";
        this.order.bookingId = undefined;
        this.order.customerId = undefined;
        this.order.firstName = undefined;
        this.order.lastName = undefined;
        this.order.email = undefined;
        this.order.mobile = undefined;
        this.customer.id = undefined;
        this.customer.firstName = undefined;
        this.customer.lastName = undefined;
        this.customer.email = undefined;
        this.customer.mobile = undefined;
        this.payment.referenceNumber = undefined;
        this.paymentReservation.referenceNumber = undefined;

        this.roomDetails = [];
        this.setBooking(data.bookingOb);
        this.setRoom(data.roomNumber);
        this.RoomNo = data.roomNumber;
        this.isShowBookingList = false;
    }

    clear(event) { }

    getItems(filterValue: any) {
        filterValue = filterValue.target.value; // Remove whitespace

        if (filterValue === "") {
            this.bookingdata = this.bookingFilter;
            this.isShowBookingList = false;
            this.changeDetectorRefs.detectChanges();
        } else {
            this.isShowBookingList = true;
            this.bookingdata = this.bookingFilter;
            this.bookingdata = this.bookingdata.filter((item) => {
                const searchResult =
                    (item.firstName != null &&
                        item.lastName &&
                        (item.firstName + " " + item.lastName)
                            .toLowerCase()
                            .trim()
                            .indexOf(filterValue) > -1) ||
                    (item.propertyReservationNumber != null &&
                        item.propertyReservationNumber
                            .toLowerCase()
                            .indexOf(filterValue) > -1) ||
                    (item.email != null &&
                        item.email.toLowerCase().indexOf(filterValue) > -1) ||
                    (item.roomName != null &&
                        item.roomName.toLowerCase().indexOf(filterValue) >
                        -1) ||
                    (item.roomNumber != null &&
                        String(item.roomNumber).indexOf(filterValue) > -1) ||
                    (item.id != null &&
                        String(item.id).indexOf(filterValue) > -1) ||
                    (item.propertyReservationNumber != null &&
                        String(item.propertyReservationNumber).indexOf(
                            filterValue
                        ) > -1);

                return searchResult;
            });

            this.changeDetectorRefs.detectChanges();
        }
    }

    orderCurrentDate() {
        let currentDate: Date = new Date();

        //   const fromDateMilliSeconds = currentDate.getTime();

        let daySelected = this.getDay(currentDate);
        let yearSelected = String(currentDate.getFullYear());
        let monthSelected = this.getMonth(currentDate.getMonth() + 1);

        // this.order.requiredDate =
        //   yearSelected + "-" + monthSelected + "-" + daySelected;
        this.order.orderedDate =
            yearSelected + "-" + monthSelected + "-" + daySelected;
        this.slot.date = this.order.orderedDate;
        this.slotReservation.date = this.order.orderedDate;

        if (this.order.deliveryMethod != "Dine In") {
            this.order.orderedTime = this.getOrderTimeformatAMPM(new Date());
        }
    }

    getDay(date: Date) {
        let currentDay;
        if (date.getDate().toString().length == 1) {
            currentDay = "0" + date.getDate();
        } else {
            currentDay = "" + date.getDate();
        }

        return currentDay;
    }

    getMonth(date: number) {
        let currentMonth;
        if (date.toString().length == 1) {
            currentMonth = "0" + date;
        } else {
            currentMonth = "" + date;
        }

        return currentMonth;
    }

    checkDefaultCountryCode() {
        if (
            this.property.address != undefined &&
            this.property.address != null &&
            this.property.address.country != null &&
            this.property.address.country != undefined
        ) {
            let code = this.CountryArray.countries.find(
                (data) =>
                    data.value.toLowerCase() ===
                    this.property.address.country.toLowerCase()
            ).countryCode;

            if (code != undefined) {
                this.CodeNumber = code;
            }
        }
    }

    checkBusinessServiceType() {
        this.AvailableSLotBusinessServiceTypes = [];

        if (
            this.businessService.businessServiceTypes != null &&
            this.businessService.businessServiceTypes != undefined
        ) {
            for (
                let i = 0;
                i < this.businessService.businessServiceTypes.length;
                i++
            ) {
                if (
                    this.businessService.businessServiceTypes[i].slots !=
                    null &&
                    this.businessService.businessServiceTypes[i].slots !=
                    undefined &&
                    this.businessService.businessServiceTypes[i].slots.length >
                    0
                ) {
                    if (
                        this.businessService.businessServiceTypes[i]
                            .bookable === true
                    ) {
                        this.AvailableSLotBusinessServiceTypes.push(
                            this.businessService.businessServiceTypes[i]
                        );
                    }
                }
            }
        }

        if (this.order.id === undefined) {
            if (this.AvailableSLotBusinessServiceTypes.length > 0) {
                this.businessServiceType.id =
                    this.AvailableSLotBusinessServiceTypes[0].id;
                this.setOffering(this.businessServiceType.id);
            }
        } else {
            if (
                this.businessService != undefined &&
                this.businessService != null &&
                this.businessService.serviceReservation != null &&
                this.businessService.serviceReservation != undefined &&
                this.businessService.serviceReservation === false
            ) {
                this.slot.businessServiceTypeId =
                    this.order.businessServiceTypeId;
                this.businessServiceType.id = this.slot.businessServiceTypeId;
                this.setOffering(this.businessServiceType.id);
            } else {
                if (
                    this.order.businessReservationNumber != null &&
                    this.order.businessReservationNumber != undefined
                ) {
                    this.getReservationDetailsById(
                        this.order.businessReservationNumber
                    );
                } else {
                    this.slot.businessServiceTypeId =
                        this.order.businessServiceTypeId;
                    this.businessServiceType.id =
                        this.slot.businessServiceTypeId;
                    this.setOffering(this.businessServiceType.id);
                }
            }
        }
    }

    checkResource(recName) {
        if (
            this.resourceSelected != null &&
            this.resourceSelected != undefined &&
            this.resourceSelected.length > 0
        ) {
            if (
                this.resourceSelected.some((data) => data.name === recName) ===
                true
            ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    addresourceToArray(rec) {
        // console.log("rec :"+ JSON.stringify(rec))
        if (
            this.locationNameSelected != undefined &&
            this.locationNameSelected != null &&
            this.locationNameSelected.length > 0 &&
            this.isTodaysDyneInOrder === false
        ) {

            if (
                this.resourceSelected.some(
                    (data) => data.name === rec.name
                ) === true
            ) {
                const index = this.resourceSelected.indexOf(rec);
                if (index > -1) {
                    this.resourceSelected.splice(index, 1);
                } else {
                    this.resourceSelected.push(rec);
                }
            } else {
                this.resourceSelected.push(rec);
                // console.log("resource selected "+ JSON.stringify(this.resourceSelected))
            }
            this.resourceSelected = [];
            this.resourceSelected.push(rec);


            this.setResource(this.resourceSelected);
        }
    }

    checkResourceAvailableStatus(rec) {
        if (
            this.checkResource(rec.name) === false &&
            this.checkResourceStatus(rec.name, this.order.locationName) ===
            true
        ) {
            return "available";
        } else if (
            this.checkResource(rec.name) === true &&
            this.checkResourceStatus(rec.name, this.order.locationName) ===
            false || this.checkResourceStatus(rec.name, this.order.locationName) ===
            true
        ) {
            return "booked";
        } else if (
            this.checkResource(rec.name) === false &&
            this.checkResourceStatus(rec.name, this.order.locationName) ===
            false
        ) {
            return "available";
        }
    }
    updateCounter(value: number) {

        this.noOfPax += value;
    }

    setResource(data) {
        this.resourceSelected = data;
        this.resources = [];
        let resourceNameList = [];

        for (let i = 0; i < this.resourceSelected.length; i++) {
            this.resourceSingleObject = new ResourceList();

            resourceNameList.push(this.resourceSelected[i].name);

            this.resourceSingleObject.bookedTimings = [];
            this.resourceSingleObject.bookedTimings.push(
                this.TimeSlotDetails.details
            );

            this.resourceSingleObject.locationList = [];
            this.resourceSingleObject.locationList = this.locations;

            this.resourceSingleObject.name = this.resourceSelected[i].name;

            this.resources.push(this.resourceSingleObject);
        }

        this.order.resourceName = resourceNameList.toString();

        this.businessServiceType.slots = [];

        this.slot.date = this.order.orderedDate;
        this.slot.resourceList = [];
        // this.slot.resourceList.push(this.resource);
        this.slot.resourceList = this.resources;

        this.businessServiceType.slots.push(this.slot);

        this.slotReservation.businessServiceTypes = [];
        this.slotReservation.businessServiceTypes.push(
            this.businessServiceType
        );
    }

    setResceDataToReservation() {
        this.businessServiceType.slots = [];

        this.slot.date = this.order.orderedDate;
        this.slot.resourceList = [];
        this.slot.resourceList.push(this.resource);
        this.businessServiceType.slots.push(this.slot);

        this.slotReservation.businessServiceTypes = [];
        this.slotReservation.businessServiceTypes.push(
            this.businessServiceType
        );
    }

    checkLocation(locName) {
        if (
            this.locationNameSelected != null &&
            this.locationNameSelected != undefined &&
            this.locationNameSelected.length > 0
        ) {
            const index = this.locationNameSelected.indexOf(locName);
            if (index > -1) {
                return true;
            } else {
                return false;
            }
        } else {
            this.resourceSelected = [];
            return false;
        }
    }

    addLocationToArray(loc) {


        if (
            this.locationNameSelected != null &&
            this.locationNameSelected != undefined &&
            this.locationNameSelected.length > 0
        ) {
            const index = this.locationNameSelected.indexOf(loc);
            if (index > -1) {
                this.locationNameSelected.splice(index, 1);
            } else {
                this.locationNameSelected.push(loc);
            }
        } else {
            this.locationNameSelected = [];
            this.locationNameSelected.push(loc);
        }

        this.setLocation(this.locationNameSelected);
    }

    setLocation(data) {
        // console.log("location data: "+JSON.stringify(data));
        this.locationNameSelected = data;
        this.locations = [];
        let locationNameList = [];

        for (let i = 0; i < this.locationNameSelected.length; i++) {
            this.location = new LocationList();
            this.location.name = this.locationNameSelected[i];
            this.locations.push(this.location);
            locationNameList.push(this.locationNameSelected[i]);
        }

        this.order.locationName = locationNameList.toString();

        this.ResourceName.reset();
    }

    setTimeSlot(data) {
        // Logger.log('time select');
        this.selectedResourceArray = [];
        this.selectedLocationArray = [];
        this.TimeSlotDetails = data;

        this.locationNameSelected = undefined;
        this.resourceSelected = undefined;

        this.resource.bookedTimings = [];
        this.resource.bookedTimings.push(this.TimeSlotDetails.details);

        this.order.orderSlot = this.TimeSlotDetails.time;
        this.orderSlotTime = this.order.orderSlot;

        for (let i = 0; i < this.slot.resourceList.length; i++) {
            if (
                this.slot.resourceList[i].availableTimings != null &&
                this.slot.resourceList[i].availableTimings != undefined &&
                this.slot.resourceList[i].availableTimings.length > 0
            ) {
                for (
                    let j = 0;
                    j < this.slot.resourceList[i].availableTimings.length;
                    j++
                ) {
                    if (
                        this.TimeSlotDetails.time ===
                        this.slot.resourceList[i].availableTimings[j]
                            .startTime +
                        "-" +
                        this.slot.resourceList[i].availableTimings[j]
                            .finishTime
                    ) {
                        this.selectedResourceArray.push(
                            this.slot.resourceList[i]
                        );

                        for (
                            let k = 0;
                            k < this.slot.resourceList[i].locationList.length;
                            k++
                        ) {
                            if (
                                this.selectedLocationArray.indexOf(
                                    this.slot.resourceList[i].locationList[k]
                                        .name
                                )
                            ) {
                                this.selectedLocationArray.push(
                                    this.slot.resourceList[i].locationList[k]
                                        .name
                                );
                            }
                        }
                    }
                }
            }
        }

        this.ResourceName.reset();
        this.LocationName.reset();
    }

    setOffering(serviceTypeId: number) {
        this.businessServiceType = this.AvailableSLotBusinessServiceTypes.find(
            (data) => data.id === serviceTypeId
        );

        this.slot.businessServiceTypeId = serviceTypeId;
        this.order.businessServiceTypeId = serviceTypeId;

        this.slot.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            this.order.orderedDate
        );

        this.slotTimingArrayList = [];
        this.timesArray = [];

        if (
            this.token.getORDER_SLOT_DATA() != null &&
            this.token.getORDER_SLOT_DATA() != undefined
        ) {
            this.slot = this.token.getORDER_SLOT_DATA();
            this.slotSetup();
        } else {
            this.getSlotByDate(
                this.slot,
                String(this.slot.businessServiceTypeId)
            );
        }

        this.ResourceName.reset();
        this.LocationName.reset();
        //  this.DeliverySlot.reset();
    }

    getSlotByDate(slot: Slots, serviceTypeId: string) {
        this.loader = true;

        this.reservationService
            .getSlotDataByDate(slot, serviceTypeId)
            .subscribe(
                (data) => {
                    this.slot = data.body;
                    this.token.saveORDER_SLOT_DATA(this.slot);

                    this.slotSetup();
                },
                (error) => {
                    this.loader = false;
                    // Logger.log('all service' + JSON.stringify(error));
                }
            );
    }

    async slotSetup() {
        const loaderCycle = await this.loadingCtrl.create({});
        // loaderCycle.present();
        this.slotTimingArrayList = [];
        this.timesArray = [];

        if (
            this.slot.resourceList != null &&
            this.slot.resourceList != undefined &&
            this.slot.resourceList.length > 0
        ) {
            for (let i = 0; i < this.slot.resourceList.length; i++) {
                if (
                    this.slot.resourceList[i].availableTimings != null &&
                    this.slot.resourceList[i].availableTimings != undefined &&
                    this.slot.resourceList[i].availableTimings.length > 0
                ) {
                    for (
                        let j = 0;
                        j < this.slot.resourceList[i].availableTimings.length;
                        j++
                    ) {
                        if (
                            this.slotTimingArrayList.indexOf(
                                this.slot.resourceList[i].availableTimings[j]
                                    .startTime +
                                "-" +
                                this.slot.resourceList[i].availableTimings[
                                    j
                                ].finishTime
                            ) == -1
                        ) {
                            this.slotTimingArrayList.push(
                                this.slot.resourceList[i].availableTimings[j]
                                    .startTime +
                                "-" +
                                this.slot.resourceList[i].availableTimings[
                                    j
                                ].finishTime
                            );

                            const timeSLot: TimingArrayAndDetails = {
                                time:
                                    this.slot.resourceList[i].availableTimings[
                                        j
                                    ].startTime +
                                    "-" +
                                    this.slot.resourceList[i].availableTimings[
                                        j
                                    ].finishTime,
                                details:
                                    this.slot.resourceList[i].availableTimings[
                                    j
                                    ],
                            };

                            this.timesArray.push(timeSLot);
                        }
                    }
                }
            }
        }

        if (this.isNewOrderCreated === false) {
            if (
                this.order.businessReservationNumber != null &&
                this.order.businessReservationNumber != undefined &&
                this.businessService != undefined &&
                this.businessService != null &&
                this.businessService.serviceReservation != null &&
                this.businessService.serviceReservation != undefined &&
                this.businessService.serviceReservation === true
            ) {
                if (
                    this.slotReservation.slotReservationDtos != null &&
                    this.slotReservation.slotReservationDtos != undefined &&
                    this.slotReservation.slotReservationDtos.length > 0
                ) {
                    for (let i = 0; i < this.timesArray.length; i++) {
                        if (
                            this.timesArray[i].time ===
                            this.slotReservation.slotReservationDtos[0]
                                .startTime +
                            "-" +
                            this.slotReservation.slotReservationDtos[0]
                                .finishTime
                        ) {
                            this.TimeSlotDetails = this.timesArray[i];
                            this.setTimeSlotForReservation(
                                this.TimeSlotDetails
                            );
                        }
                    }
                }
                // console.log("service reservation");
            } else {
                // console.log(" this.orderSlotTime order" + this.orderSlotTime);
                if (
                    this.orderSlotTime != null &&
                    this.orderSlotTime != undefined
                ) {
                    for (let i = 0; i < this.timesArray.length; i++) {
                        // console.log(
                        //     "service order" +
                        //         this.timesArray[i].time +
                        //         "  === " +
                        //         this.orderSlotTime
                        // );
                        if (this.timesArray[i].time === this.orderSlotTime) {
                            this.TimeSlotDetails = this.timesArray[i];
                            this.setTimeSlotForOrder(this.TimeSlotDetails);
                        }
                    }
                } else {

                    for (let i = 0; i < this.timesArray.length; i++) {
                        this.timeCheck(this.timesArray[i].time, this.timesArray[i]);



                    }
                }
                // console.log("service order");
            }
        } else {
            if (
                this.timesArray != null &&
                this.timesArray != null &&
                this.timesArray.length
            ) {
                // const loaderCycle = await this.loadingCtrl.create({});
                // loaderCycle.present();

                for (let i = 0; i < this.timesArray.length; i++) {
                    this.timeCheck(this.timesArray[i].time, this.timesArray[i]);

                    if (
                        this.isTimeSlotAvailable === true ||
                        i + 1 === this.timesArray.length
                    ) {
                        //loaderCycle.dismiss();
                    }
                }
            }
        }
        loaderCycle.dismiss();
        this.loader = false;
        this.changeDetectorRefs.detectChanges();
    }

    timeCheck(timeIntervalString: string, timeArrayDetails: any) {
        let isTimeChecked: boolean = false;
        let startTime = timeIntervalString.split("-")[0];
        let endTime = timeIntervalString.split("-")[1];

        let currentDate = new Date();

        //currentDate.setHours(1);

        let startDate = new Date(currentDate.getTime());
        startDate.setHours(Number(startTime.split(":")[0]));
        startDate.setMinutes(Number(startTime.split(":")[1]));
        startDate.setSeconds(0);

        let endDate = new Date(currentDate.getTime());
        endDate.setHours(Number(endTime.split(":")[0]));
        endDate.setMinutes(Number(endTime.split(":")[1]));
        endDate.setSeconds(0);

        let valid = startDate < currentDate && endDate > currentDate;

        if (valid === true) {
            this.setTimeSlot(timeArrayDetails);
            this.isTimeSlotAvailable = true;
            this.order.orderSlot = timeArrayDetails.time;

            if (this.isTodaysDyneInOrder === true) {
                this.setTimeSlotForOrder(timeArrayDetails);
            }
        }
    }

    setTimeSlotForOrder(data) {
        this.selectedResourceArray = [];
        this.selectedLocationArray = [];
        this.TimeSlotDetails = data;

        this.resource.bookedTimings = [];
        this.resource.bookedTimings.push(this.TimeSlotDetails.details);

        this.order.orderSlot = this.TimeSlotDetails.time;

        for (let i = 0; i < this.slot.resourceList.length; i++) {
            if (
                this.slot.resourceList[i].availableTimings != null &&
                this.slot.resourceList[i].availableTimings != undefined &&
                this.slot.resourceList[i].availableTimings.length > 0
            ) {
                for (
                    let j = 0;
                    j < this.slot.resourceList[i].availableTimings.length;
                    j++
                ) {
                    if (
                        this.TimeSlotDetails.time ===
                        this.slot.resourceList[i].availableTimings[j]
                            .startTime +
                        "-" +
                        this.slot.resourceList[i].availableTimings[j]
                            .finishTime
                    ) {
                        this.selectedResourceArray.push(
                            this.slot.resourceList[i]
                        );

                        for (
                            let k = 0;
                            k < this.slot.resourceList[i].locationList.length;
                            k++
                        ) {
                            if (
                                this.selectedLocationArray.indexOf(
                                    this.slot.resourceList[i].locationList[k]
                                        .name
                                )
                            ) {
                                this.selectedLocationArray.push(
                                    this.slot.resourceList[i].locationList[k]
                                        .name
                                );
                            }
                        }
                    }
                }
            }
        }

        this.locationNameSelected = this.order.locationName.split(",");

        this.locations = [];
        for (let i = 0; i < this.locationNameSelected.length; i++) {
            this.location = new LocationList();
            this.location.name = this.locationNameSelected[i];
            this.locations.push(this.location);
        }

        this.resourceSelected = [];

        let resourceNameList = this.order.resourceName.split(",");

        for (let i = 0; i < this.selectedResourceArray.length; i++) {
            for (let j = 0; j < resourceNameList.length; j++) {
                if (
                    this.selectedResourceArray[i].name === resourceNameList[j]
                ) {
                    this.resourceSelected.push(this.selectedResourceArray[i]);
                }
            }
        }

        this.setResource(this.resourceSelected);
    }

    setDateTime = function (date, str) {
        var sp = str.split(":");
        date.setHours(parseInt(sp[0], 10));
        date.setMinutes(parseInt(sp[1], 10));
        date.setSeconds(parseInt(sp[2], 10));
        return date;
    };

    setTimeSlotForReservation(data) {
        this.selectedResourceArray = [];
        this.selectedLocationArray = [];
        this.TimeSlotDetails = data;

        this.resource.bookedTimings = [];
        this.resource.bookedTimings.push(this.TimeSlotDetails.details);

        this.order.orderSlot = this.TimeSlotDetails.time;

        for (let i = 0; i < this.slot.resourceList.length; i++) {
            if (
                this.slot.resourceList[i].availableTimings != null &&
                this.slot.resourceList[i].availableTimings != undefined &&
                this.slot.resourceList[i].availableTimings.length > 0
            ) {
                for (
                    let j = 0;
                    j < this.slot.resourceList[i].availableTimings.length;
                    j++
                ) {
                    if (
                        this.TimeSlotDetails.time ===
                        this.slot.resourceList[i].availableTimings[j]
                            .startTime +
                        "-" +
                        this.slot.resourceList[i].availableTimings[j]
                            .finishTime
                    ) {
                        this.selectedResourceArray.push(
                            this.slot.resourceList[i]
                        );

                        for (
                            let k = 0;
                            k < this.slot.resourceList[i].locationList.length;
                            k++
                        ) {
                            if (
                                this.selectedLocationArray.indexOf(
                                    this.slot.resourceList[i].locationList[k]
                                        .name
                                )
                            ) {
                                this.selectedLocationArray.push(
                                    this.slot.resourceList[i].locationList[k]
                                        .name
                                );
                            }
                        }
                    }
                }
            }
        }

        // this.locationNameSelected = this.slotReservation.slotReservationDtos[0].locationName;
        // this.location.name = this.locationNameSelected;
        this.locations = [];
        this.locations.push(this.location);

        this.resource.locationList = this.locations;

        this.order.locationName = this.location.name;

        for (let i = 0; i < this.selectedResourceArray.length; i++) {
            if (
                this.selectedResourceArray[i].name ===
                this.slotReservation.slotReservationDtos[0].resourceName
            ) {
                this.resourceSelected = this.selectedResourceArray[i];
            }
        }

        //   this.resource.name = this.resourceSelected.name;

        this.order.resourceName = this.resource.name;

        this.businessServiceType.slots = [];

        this.slot.date = this.order.orderedDate;
        this.slot.resourceList = [];
        this.slot.resourceList.push(this.resource);
        this.businessServiceType.slots.push(this.slot);

        this.slotReservation.businessServiceTypes = [];
        this.slotReservation.businessServiceTypes.push(
            this.businessServiceType
        );
    }

    setCounter(counterNumber) {
        this.pointOfSale = this.pointOfSaleList.find(
            (data) => data.counterNumber === counterNumber
        );
        this.order.counterName = this.pointOfSale.counterName;
    }

    getPOSInformation(propertyId: number) {
        this.loader = true;
        this.pointOfSaleList = [];
        this.pointOfSaleListFilter = [];
        this.propertyService.getAllPointOfSale(propertyId).subscribe(
          (data) => {
            this.pointOfSaleList = data;
            this.pointOfSaleListFilter = data;
            this.loader = false;
            if (
              this.order.id != undefined &&
              this.order.counterNumber != null &&
              this.order.counterNumber != undefined
            ) {
              this.pointOfSale = this.pointOfSaleList.find(
                (data) => data.counterNumber === this.order.counterNumber
              );
            }
            if (this.setDefaultCounter(true) === false) {
              this.pointOfSaleList = this.pointOfSaleListFilter;
            }
    
            this.UIDetectChange();
          },
          (error) => {
            this.loader = false;
          }
        );
      }

    onSegmentChange() {
        if (
            this.order.modeOfPayment === "BankTransfer" ||
            this.order.modeOfPayment === "Wallet" ||
            this.order.modeOfPayment === "Card"
        ) {
            this.payment.status = "Paid";
        } else {
            this.payment.status = "NotPaid";
        }
    }

    checkData() {
        Logger.log("order " + JSON.stringify(this.order));
    }

    countryCodePicker(event) {
        // if (this.CodeNumber != undefined) {
        //     // Logger.log(this.CodeNumber);
        //     this.order.mobile = this.CodeNumber;
        // }
    }

    //   mobileChange()
    //   {
    //       if(this.order.mobile.length < this.CodeNumber.length)
    //       {
    //           this.onPhoneCheckForm.reset();
    //           Logger.log('mobile c t');
    //       }

    //       Logger.log('mobile c');
    //   }

    selection(event) {
        this.order.email = undefined;
        this.order.mobile = undefined;
    }

    searchSelection(event) {
        this.customers = [];

        // this.onEmailCheckForm.reset();
        // this.onPhoneCheckForm.reset();
        this.checkDefaultCountryCode();
        this.isShowNameList = false;
        this.searchResult = "";
    }

    checkUser() {
        this.customerLookup();
    }

    locationAddress() {
        this.address = new ShipToAddress();
        this.address.streetNumber = this.propertyAddress.streetNumber;
        this.address.streetName = this.propertyAddress.streetName;
        this.address.suburb = this.propertyAddress.suburb;
        this.address.city = this.propertyAddress.city;
        this.address.country = this.propertyAddress.country;
        this.address.postcode = this.propertyAddress.postcode;
        this.address.state = this.propertyAddress.state;
        this.address.locality = this.propertyAddress.locality;
    }

    selectionMethod(event) {
        if (this.order.deliveryMethod === "Home Delivery") {
            this.address = new ShipToAddress();
        } else if (this.order.deliveryMethod === "Pick From Store") {
            this.address = new ShipToAddress();
            this.address.streetNumber = this.propertyAddress.streetNumber;
            this.address.streetName = this.propertyAddress.streetName;
            this.address.suburb = this.propertyAddress.suburb;
            this.address.city = this.propertyAddress.city;
            this.address.country = this.propertyAddress.country;
            this.address.postcode = this.propertyAddress.postcode;
            this.address.state = this.propertyAddress.state;
            this.address.locality = this.propertyAddress.locality;
        }
    }

    searchCustomerLookup() {
        this.loader = true;

        if (this.customerSearchSelecion === "Email") {
            this.orderService
                .getCustomerDetailsByEmail(this.order.email)
                .subscribe(
                    (data) => {
                        // Logger.log("Get customer " + JSON.stringify(data.body));
                        this.order.firstName = data.body.firstName;
                        this.order.lastName = data.body.lastName;
                        this.order.mobile = data.body.mobile;
                        this.order.customerId = data.body.id;
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

                        this.onInDineForm.controls.firstName.patchValue(undefined);
                        this.onInDineForm.controls.lastName.patchValue(undefined);
                        this.onInDineForm.controls.Email.patchValue(undefined);
                        this.order.customerId = undefined;
                        this.PhoneNumberWithOutCode = undefined;
                    }
                );
        } else if (this.customerSearchSelecion === "Phone") {
            this.order.mobile = this.CodeNumber + this.PhoneNumberWithOutCode;
            this.orderService
                .getCustomerDetailsByMobile(this.order.mobile)
                .subscribe(
                    (data) => {
                        //  Logger.log("Get customer " + JSON.stringify(data.body));
                        this.order.firstName = data.body.firstName;
                        this.order.lastName = data.body.lastName;
                        this.order.email = data.body.email;
                        this.order.customerId = data.body.id;
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
                        this.onInDineForm.controls.firstName.patchValue(undefined);
                        this.onInDineForm.controls.lastName.patchValue(undefined);
                        this.onInDineForm.controls.Email.patchValue(undefined);
                        this.order.customerId = undefined;
                        //this.PhoneNumberWithOutCode = undefined;
                    }
                );
        }
    }

    searchCustomerLookupTakeAway() {
        this.loader = true;

        if (this.customerSearchSelecion === "Email") {
            this.orderService
                .getCustomerDetailsByEmail(this.order.email)
                .subscribe(
                    (data) => {
                        // Logger.log("Get customer " + JSON.stringify(data.body));
                        this.order.firstName = data.body.firstName;
                        this.order.lastName = data.body.lastName;
                        this.order.mobile = data.body.mobile;
                        this.order.customerId = data.body.id;
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

                        this.onTakeAwayForm.controls.firstName.patchValue(undefined);
                        this.onTakeAwayForm.controls.lastName.patchValue(undefined);
                        this.onTakeAwayForm.controls.Email.patchValue(undefined);
                        this.order.customerId = undefined;
                        this.PhoneNumberWithOutCode = undefined;
                    }
                );
        } else if (this.customerSearchSelecion === "Phone") {
            this.order.mobile = this.CodeNumber + this.PhoneNumberWithOutCode;
            this.orderService
                .getCustomerDetailsByMobile(this.order.mobile)
                .subscribe(
                    (data) => {
                        //  Logger.log("Get customer " + JSON.stringify(data.body));
                        this.order.firstName = data.body.firstName;
                        this.order.lastName = data.body.lastName;
                        this.order.email = data.body.email;
                        this.order.customerId = data.body.id;
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
                        this.onTakeAwayForm.controls.firstName.patchValue(undefined);
                        this.onTakeAwayForm.controls.lastName.patchValue(undefined);
                        this.onTakeAwayForm.controls.Email.patchValue(undefined);
                        this.order.customerId = undefined;
                        //this.PhoneNumberWithOutCode = undefined;
                    }
                );
        }
    }

    customerLookup() {
        this.loader = true;

        if (this.selecion === "Email") {
            this.orderService
                .getCustomerDetailsByEmail(this.order.email)
                .subscribe(
                    (data) => {
                        // Logger.log("Get customer " + JSON.stringify(data.body));
                        this.order.firstName = data.body.firstName;
                        this.order.lastName = data.body.lastName;
                        this.order.mobile = data.body.mobile;
                        this.order.customerId = data.body.id;
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

                        this.order.firstName = undefined;
                        this.order.lastName = undefined;
                        this.order.mobile = undefined;
                        this.order.email = undefined;
                        this.order.customerId = undefined;
                        // this.PhoneNumberWithOutCode = undefined;
                    }
                );
        } else if (this.selecion === "Phone") {
            this.order.mobile = this.CodeNumber + this.PhoneNumberWithOutCode;
            this.orderService
                .getCustomerDetailsByMobile(this.order.mobile)
                .subscribe(
                    (data) => {
                        //  Logger.log("Get customer " + JSON.stringify(data.body));
                        this.order.firstName = data.body.firstName;
                        this.order.lastName = data.body.lastName;
                        this.order.email = data.body.email;
                        this.order.customerId = data.body.id;
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
                        this.order.firstName = undefined;
                        this.order.lastName = undefined;
                        this.order.mobile = undefined;
                        this.order.email = undefined;
                        this.order.customerId = undefined;
                        //this.PhoneNumberWithOutCode = undefined;
                    }
                );
        }
    }

    requiredDateAndTimeCalculate() {
        if (
            this.businessService.maxLeadTime != undefined ||
            this.businessService.maxLeadTime == 0
        ) {
            let maxLead = new Date(
                0,
                0,
                0,
                0,
                this.businessService.maxLeadTime,
                0
            );

            this.leadMaxDay = Math.floor(
                this.businessService.maxLeadTime / 1440
            );
            this.leadMaxMin = maxLead.getMinutes();
            this.leadMaxHour = maxLead.getHours();
        }

        if (
            this.businessService.minLeadTime != undefined ||
            this.businessService.minLeadTime == 0
        ) {
            let minLead = new Date(
                0,
                0,
                0,
                0,
                this.businessService.minLeadTime,
                0
            );

            this.leadHour = minLead.getHours();
            this.leadDay = Math.floor(this.businessService.minLeadTime / 1440);
            this.leadMin = minLead.getMinutes();
        }

        if (
            this.businessService.stdPrepTime != undefined ||
            this.businessService.stdPrepTime == 0
        ) {
            var prep = new Date(
                0,
                0,
                0,
                0,
                this.businessService.stdPrepTime,
                0
            );

            this.prepareDay = Math.floor(
                this.businessService.maxLeadTime / 1440
            );
            this.prepareHour = prep.getHours();
            this.prepareMinute = prep.getMinutes();
        }

        this.claculateDeliveryTime(this.businessService);
    }

    claculateDeliveryTime(businessServiceDto: BusinessServiceDtoList) {
        this.openDay = new OpenDays();
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        let totalHour = 0;
        let totalDay = 0;
        let totalMin = 0;
        const workingHour = 0;

        const currentDate: Date = new Date();
        const afterDate: Date = new Date();

        if (
            this.methodType != undefined &&
            this.methodType === "HomeDelivery" &&
            this.isCustomercheck === true
        ) {
            totalHour = this.prepareHour;
            totalDay = this.prepareDay;
            totalMin = this.prepareMinute;
        } else {
            totalHour = this.prepareHour + this.leadMaxHour;
            totalDay = this.leadMaxDay + this.prepareDay;
            totalMin = this.leadMaxMin + this.prepareMinute;
        }

        Logger.log(totalMin + " " + totalDay + " " + totalHour);

        // this.openDay = businessServiceDto.serviceOpenList.find(
        //   (data) =>
        //     data.day.toLocaleUpperCase() ===
        //     days[afterDate.getDay()].toLocaleUpperCase()
        // );

        afterDate.setDate(afterDate.getDate() + totalDay);
        afterDate.setHours(currentDate.getHours() + totalHour);
        afterDate.setMinutes(totalMin + currentDate.getMinutes());

        if (
            this.methodType != undefined &&
            this.methodType === "HomeDelivery" &&
            this.isCustomercheck === true
        ) {
            if (
                this.deliveryOption != undefined &&
                this.deliveryOption.maxTime != undefined &&
                this.deliveryOption.maxTime != null
            ) {
                afterDate.setMinutes(
                    Number(this.deliveryOption.maxTime) +
                    totalMin +
                    currentDate.getMinutes()
                );
            }
        } else {
        }

        this.order.requiredDate = this.getDeliveryDate(afterDate);
        this.order.requiredTime = this.getOrderTimeformatAMPM(afterDate);

        // this.changeDetectorRefs.detectChanges();
    }

    getDeliveryDate(date: Date) {
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

        this.delivertDateAndTime =
            currentDay + "-" + currentMonth + "-" + date.getFullYear();
        return date.getFullYear() + "-" + currentMonth + "-" + currentDay;
    }

    getOrderTimeformatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        const strTime = hours + ":" + minutes + " " + ampm;
        return strTime;
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

        this.orderDateUI =
            currentDay + "-" + currentMonth + "-" + date.getFullYear();
        return date.getFullYear() + "-" + currentMonth + "-" + currentDay;
    }

    getOrderDateAndTime() {
        const currentDate: Date = new Date();
        this.order.orderedDate = this.getDateDBFormat(currentDate);

        if (this.order.deliveryMethod != "Dine In") {
            this.order.orderedTime = this.getOrderTimeformatAMPM(new Date());
        }
    }

    onCardPayment() {
        this.loader = true;

        if (
            this.order.mobile === undefined &&
            this.PhoneNumberWithOutCode != null &&
            this.PhoneNumberWithOutCode != undefined
        ) {
            this.order.mobile = this.CodeNumber + this.PhoneNumberWithOutCode;
        }

        if (
            this.order.deliveryChargeAmount != null &&
            this.order.deliveryChargeAmount != undefined
        ) {
            this.payment.deliveryChargeAmount = this.order.deliveryChargeAmount;
            this.paymentReservation.deliveryChargeAmount =
                this.order.deliveryChargeAmount;
        } else {
            this.order.deliveryChargeAmount = 0;
            this.payment.deliveryChargeAmount = 0;
            this.paymentReservation.deliveryChargeAmount = 0;
        }

        this.order.modeOfPayment = "Card";
        this.slotReservation.modeOfPayment = "Card";

        this.payment.paymentMode = "Card";
        this.payment.status = "Paid";

        this.paymentReservation.paymentMode = "Card";
        this.paymentReservation.status = "Paid";

        if (this.methodType === "InDine") {
            this.order.deliveryMethod = "Dine In";
        } else if (this.methodType === "TakeAway") {
            this.order.deliveryMethod = "Take Away";
        } else if (this.methodType === "RoomOrder") {
            this.order.deliveryMethod = "Room Order";
        } else if (this.methodType === "HomeDelivery") {
            this.order.deliveryMethod = "Home Delivery";
        }
        this.submitOrder();
    }

    chargeCreditCard(payment: Payment) {
        this.loader = true;
        (window as any).Stripe.card.createToken(
            {
                number: payment.cardNumber,
                exp_month: payment.expMonth,
                exp_year: payment.expYear,
                cvc: payment.cvv,
            },
            (status: number, response: any) => {
                if (status === 200) {
                    const token = response.id;
                    payment.token = token;

                    this.payment.token = token;

                    this.payment.businessServiceName =
                        this.businessService.name;
                    this.savePayment(this.payment);
                    this.changeDetectorRefs.detectChanges();
                } else if (status === 402) {
                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();

                    this.bodyMessage =
                        "Wrong card information!" + " Code: " + status;
                    this.presentToast(this.bodyMessage);
                } else {
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();

                    this.bodyMessage =
                        "Card Payment Faied!" + " Code: " + status;
                    this.presentToast(this.bodyMessage);
                }
            }
        ),
            (error) => {
                this.loader = false;
            };
    }

    onReservationSubmit() {
        this.loader = true;
        this.slotReservation.bookingStatus = "NEW";
        this.slotReservation.noOfPerson = 1;

        this.reservationService.book(this.slotReservation).subscribe(
            (data) => {
                if (data.status === 200) {
                    this.loader = false;
                    this.order.businessReservationNumber = String(data.body.id);

                    if (
                        this.payment.paymentMode === "Card" &&
                        this.payment.status === "Paid"
                    ) {
                        // this.chargeCreditCard(this.payment);
                    } else {
                        this.savePayment(this.payment);
                    }
                    // this.headerTitle = 'Success!';
                    // this.bodyMessage =
                    //   'Booking Placed Successfully! Code: ' +
                    //   data.body.businessReservationNumber +
                    //   '.';
                    // this.openSuccessSnackBar(this.bodyMessage);
                    // this.showSuccess(this.contentDialog);
                    //this.backClicked();
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.loader = false;
                    this.headerTitle = "Error!";
                    this.bodyMessage = "Booking Failed!";
                    this.presentToast(this.bodyMessage);
                    // this.showDanger(this.contentDialog);

                    this.changeDetectorRefs.detectChanges();
                }
            },
            (error) => {
                this.loader = false;

                this.headerTitle = "Error!";
                this.bodyMessage = "Booking Failed!";
                this.presentToast(this.bodyMessage);
                // this.showDanger(this.contentDialog);
                this.changeDetectorRefs.detectChanges();
            }
        );
    }

    processReservationPayment() {
        this.loader = true;
        // this.paymentReservation.date = this.datepipe.transform(
        //   new Date().getTime(),
        //   "yyyy-MM-dd"
        // );

        this.paymentReservation.date =
            this.dateService.convertMillisecondsToYYYMMDDFormat(
                new Date().getTime()
            );

        if (this.isPaidOrder === true) {
            this.paymentReservation.status = "Paid";
        }

        this.reservationService.savePayment(this.paymentReservation).subscribe(
            (res1) => {
                if (res1.status === 200) {
                    this.loader = false;
                    this.slotReservation.paymentId = res1.body.id;
                    // Logger.log(
                    //   'Bank Transfer payment response ' + JSON.stringify(this.payment)
                    // );
                    this.slotReservation.modeOfPayment =
                        this.payment.paymentMode;

                    this.onReservationSubmit();
                } else {
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();

                    this.headerTitle = "Error!";
                    this.bodyMessage = "Payment Failed! Code: " + res1.status;
                    // this.showDanger(this.contentDialog);
                    this.presentToast(this.bodyMessage);
                }
            },
            (error) => {
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            }
        );
    }

    submitReservation() {

        this.slotReservation.businessName = this.propertiesDto.businessName;
        this.slotReservation.resourceName = this.resource.name;
        this.slotReservation.locationName = this.location.name;
        this.slotReservation.bookingStatus = "NEW";
        this.slotReservation.businessTypeName = this.propertiesDto.businessType;
        this.slotReservation.currency = this.propertiesDto.localCurrency;

        this.slotReservation.businessTermResource =
            this.businessService.businessTermResource;
        this.slotReservation.businessTypeId =
            this.businessService.businessTypeId;
        this.slotReservation.propertyId = this.property.id;
        this.slotReservation.businessLocationName =
            this.businessService.businessLocationName;
        this.slotReservation.customerLocationName =
            this.businessService.customerLocationName;
        this.slotReservation.canChangeBusinessAddress =
            this.businessService.canChangeBusinessAddress;
        this.slotReservation.businessTermLocation =
            this.businessService.businessTermLocation;
        this.slotReservation.businessTermResource =
            this.businessService.businessTermResource;
        this.slotReservation.businessProductName =
            this.businessService.businessProductName;
        this.slotReservation.businessServiceName =
            this.businessService.businessServiceName;
        this.slotReservation.provideBusinessAndCustomerAddress =
            this.businessService.provideBusinessAndCustomerAddress;
        this.slotReservation.taxAmount = this.order.taxAmount;

        //  if(this.propertyAddress != null && this.propertyAddress!= undefined)
        // {
        //     this.slotReservation.serviceAddress.suburb = this.propertyAddress.suburb;
        //     this.slotReservation.serviceAddress.streetNumber = this.propertyAddress.streetNumber;
        //     this.slotReservation.serviceAddress.streetName = this.propertyAddress.streetName;
        //     this.slotReservation.serviceAddress.locality = this.propertyAddress.locality;
        //     this.slotReservation.serviceAddress.city = this.propertyAddress.city;
        //     this.slotReservation.serviceAddress.state = this.propertyAddress.state;
        //     this.slotReservation.serviceAddress.country = this.propertyAddress.country;
        //     this.slotReservation.serviceAddress.postcode = this.propertyAddress.postcode;
        //  }

        if (
            this.customer != null &&
            this.customer != undefined &&
            this.customer.email != undefined &&
            this.customer.mobile != undefined
        ) {
            this.slotReservation.customerDtoList = [];
            this.customer.firstName = this.order.firstName;
            this.customer.lastName = this.order.lastName;
            this.customer.mobile = this.order.mobile;
            this.customer.email = this.order.email;

            if (
                this.order.customerId != undefined &&
                this.order.customerId != null
            ) {
                this.customer.id = this.order.customerId;
            }

            this.slotReservation.firstName = this.customer.firstName;
            this.slotReservation.lastName = this.customer.lastName;
            this.slotReservation.email = this.customer.email;
            this.slotReservation.mobile = this.customer.mobile;

            this.slotReservation.customerDtoList.push(this.customer);
        } else {
            if (
                this.order.firstName != null &&
                this.order.firstName != undefined
            ) {
                this.customer = new Customer();
                this.customer.firstName = this.order.firstName;
                this.customer.lastName = this.order.lastName;
                this.customer.email = this.order.email;
                this.customer.mobile = this.order.mobile;

                this.slotReservation.firstName = this.customer.firstName;
                this.slotReservation.lastName = this.customer.lastName;
                this.slotReservation.email = this.customer.email;
                this.slotReservation.mobile = this.customer.mobile;

                this.slotReservation.customerDtoList = [];
                this.slotReservation.customerDtoList.push(this.customer);
            }
        }

        if (
            this.businessServiceType.slotPricingDto != null &&
            this.businessServiceType.slotPricingDto != undefined
        ) {
            this.slotReservation.afterTaxAmount =
                this.businessServiceType.slotPricingDto.afterTaxAmount;
            this.slotReservation.currency =
                this.businessServiceType.slotPricingDto.currency;
            this.slotReservation.totalAmount =
                this.businessServiceType.slotPricingDto.afterTaxAmount;
            this.slotReservation.beforeTaxAmount =
                this.businessServiceType.slotPricingDto.beforeTaxAmount;
            this.slotReservation.afterTaxAmount =
                this.businessServiceType.slotPricingDto.afterTaxAmount;
        } else {
            this.slotReservation.afterTaxAmount = 0;
            this.slotReservation.currency = this.propertiesDto.localCurrency;
            this.slotReservation.totalAmount = 0;
            this.slotReservation.beforeTaxAmount = 0;
            this.slotReservation.afterTaxAmount = 0;
        }

        if (
            this.slotReservation.beforeTaxAmount != null &&
            this.slotReservation.beforeTaxAmount != undefined &&
            this.slotReservation.afterTaxAmount != null &&
            this.slotReservation.afterTaxAmount != undefined
        ) {
            this.slotReservation.taxAmount =
                this.slotReservation.afterTaxAmount -
                this.slotReservation.beforeTaxAmount;
        } else {
            this.slotReservation.taxAmount = 0;
        }

        this.paymentReservation.firstName = this.slotReservation.firstName;
        this.paymentReservation.lastName = this.slotReservation.lastName;
        this.paymentReservation.netReceivableAmount =
            this.slotReservation.beforeTaxAmount;
        this.paymentReservation.transactionAmount =
            this.slotReservation.afterTaxAmount;
        this.paymentReservation.amount = this.slotReservation.afterTaxAmount;
        this.paymentReservation.propertyId = this.slotReservation.propertyId;
        this.paymentReservation.transactionChargeAmount =
            this.slotReservation.afterTaxAmount;
        this.paymentReservation.email = this.slotReservation.email;
        this.paymentReservation.businessEmail = this.propertiesDto.email;
        this.paymentReservation.currency = this.propertiesDto.localCurrency;
        this.paymentReservation.taxAmount = this.order.taxAmount;
        this.paymentReservation.businessServiceName = this.businessService.name;
        this.paymentReservation.counterName = this.order.counterName;
        this.paymentReservation.counterNumber = this.order.counterNumber;
        this.paymentReservation.operatorName = this.order.operatorName;

        if (
            this.slotReservation.businessServiceTypes != null &&
            this.slotReservation.businessServiceTypes != undefined &&
            this.slotReservation.businessServiceTypes.length > 0
        ) {
            this.processReservationPayment();
        } else {
            this.savePayment(this.payment);
        }
    }
    getPosInfo() {
        let counterName = this.token.getProperty().name + "-" + this.token.getProperty().id;
        this.pointOfSale = this.pointOfSaleListFilter.find(data => data.counterName === counterName);


        if (this.pointOfSale != null && this.pointOfSale != undefined) {
            let operatorNameList = this.pointOfSale.operatorName;

            if (operatorNameList != null && operatorNameList != undefined && operatorNameList.length > 0) {
                if (operatorNameList.some(data => data === this.PosUserName) === true) {
                    this.pointOfSaleList = [];
                    operatorNameList = [];
                    operatorNameList.push(this.PosUserName);
                    this.pointOfSale.operatorName = [];
                    this.pointOfSale.operatorName = operatorNameList;
                    this.pointOfSaleList.push(this.pointOfSale);

                    this.order.counterNumber = this.pointOfSale.counterNumber;
                    this.order.operatorName = this.PosUserName;
                }
            }
        }

        this.order.operatorName = this.PosUserName;
    }

    onCashPayment() {
        this.loader = true;
        console.log("total order", this.order.totalOrderAmount)

        if (
            this.order.mobile === undefined && 
            this.PhoneNumberWithOutCode != null &&
            this.PhoneNumberWithOutCode != undefined 
        ) {
            this.order.mobile = this.CodeNumber + this.PhoneNumberWithOutCode;
        }
        if (this.customer.firstName != null && this.customer.firstName != undefined){
            this.order.mobile =  this.order.mobile;
        } else {
            this.order.mobile = null; 
        }
        if (
            this.order.deliveryChargeAmount != null &&
            this.order.deliveryChargeAmount != undefined
        ) {
            this.payment.deliveryChargeAmount = this.order.deliveryChargeAmount;
        } else {
            this.order.deliveryChargeAmount = 0;
            this.payment.deliveryChargeAmount = 0;
        }

        // this.order.modeOfPayment = "Cash";
        this.slotReservation.modeOfPayment = this.order.modeOfPayment;

        this.payment.paymentMode = this.order.modeOfPayment;

        this.paymentReservation.paymentMode = this.order.modeOfPayment;
        this.paymentReservation.status = this.payment.status;

        if (this.methodType === "InDine") {
            this.order.deliveryMethod = "Dine In";
        } else if (this.methodType === "TakeAway") {
            this.order.deliveryMethod = "Take Away";
        } else if (this.methodType === "RoomOrder") {
            this.order.deliveryMethod = "Room Order";
        } else if (this.methodType === "HomeDelivery") {
            this.order.deliveryMethod = "Home Delivery";
        }

        this.submitOrder();
    }

    submitOrder() {

        this.calculateTaxSlab();

        this.getPosInfo();

        if (this.paymentsNotPaid != null && this.paymentsNotPaid != undefined && this.paymentsNotPaid.length > 0) {
            this.payment = this.paymentsNotPaid[0];
        }


        if (this.methodType === "InDyne" && this.TimeSlotDetails != null && this.TimeSlotDetails != undefined && this.TimeSlotDetails.time != null) {
            this.order.orderSlot = this.TimeSlotDetails.time;
        }

        this.orderCurrentDate();
        this.order.propertyId = this.property.id;
        this.order.businessServiceId = this.businessService.id;

        // this.order.orderStatus = "Submitted";

        if (this.order.deliveryMethod == "Room Order") {
            this.payment.businessServiceName = "Restaurants";
            this.payment.referenceNumber = this.booking?.propertyReservationNumber;
            if(this.order.id == null && this.order.discountPercentage == 100){
              this.order.complimentary = true;
              this.payment.description = "(Complimentary)";
            } else if (this.order.id != null && this.order.discountPercentage == 100) {
              this.order.complimentary = true;
              this.payment.description = this.order.bookOneOrderId+"\n(Complimentary)";
            } else {
              this.payment.description = this.order.bookOneOrderId;
            }
      
            if(this.payment.status === "NotPaid"){
                this.payment.paymentMode = "BillToRoom"
            }
            if(this.order.customerName != null){
              this.payment.customerName = this.order.customerName;
            }
            if (this.order.roomNo != null && this.order.roomNo != undefined) {
              this.payment.roomNumber = this.order.roomNo;
            }
          } else {
            this.payment.businessServiceName = this.businessService.name;
      
            if (this.order.id != null && this.order.id != undefined) {
              this.payment.referenceNumber = this.order.bookOneOrderId;
            }
            if (this.payment.status === "NotPaid") {
              this.payment.paymentMode = "Cash"
            }
            this.payment.roomNumber = null;
            if(this.order.discountPercentage == 100){
              this.order.complimentary = true;
              this.payment.description = "(Complimentary)";
            } else if (this.order.id != null && this.order.discountPercentage == 100) {
              this.order.complimentary = true;
              this.payment.description = this.order.bookOneOrderId+"\n(Complimentary)";
            } else {
              this.payment.description = this.order.bookOneOrderId;
            }
          }

        this.order.orderPaymentStatus = "NotPaid";
        if (this.order.firstName != undefined) {
            this.order.customerName =
                this.order.firstName + " " + this.order.lastName;
        }

        this.order.externalSite = "POS";

        if (this.address != null && this.address != undefined) {
            this.order.shipToAddress = this.address;
        }

        // if (this.order.paymentId != undefined && this.order.paymentId != null) {
        //     this.payment.id = this.order.paymentId;
        // }

        this.payment.businessServiceName = this.businessService.name;
        this.payment.transactionChargeAmount = this.order.totalOrderAmount;
        this.payment.email = this.order.email;
        this.payment.businessEmail = this.propertiesDto.email;
        this.payment.currency = this.propertiesDto.localCurrency;
        this.payment.firstName = this.order.firstName;
        this.payment.lastName = this.order.lastName;
        this.payment.netReceivableAmount = this.subTotalAmount;
        this.payment.propertyId = this.order.propertyId;
        this.payment.taxAmount = this.order.taxAmount;
        this.payment.counterName = this.order.counterName;
        this.payment.counterNumber = this.order.counterNumber;
        this.payment.operatorName = this.order.operatorName;
        if (this.order.id != null && this.order.id != undefined) {
            this.payment.referenceNumber = this.order.bookOneOrderId;
        }
        if (this.paymentsNotPaid == null || this.paymentsNotPaid.length === 0) {
            this.payment.id = null
        }
        this.payment.serviceChargeAmount = this.order.serviceChargeAmount;
        if (
            this.partialPaidAmount != null &&
            this.partialPaidAmount != undefined &&
            this.partialPaidAmount > 0
        ) {
            this.getDueAmount();
            this.payment.amount = this.partialDueAmount;
            this.payment.transactionChargeAmount = this.partialDueAmount;
            this.payment.transactionAmount = this.partialDueAmount;
            this.payment.status = "NotPaid";
        } else {
            this.payment.amount = this.getOrderAmount();
            this.payment.transactionChargeAmount = this.getOrderAmount();
            this.payment.transactionAmount = this.getOrderAmount();
            this.payment.status = "NotPaid";
        }

        this.order.paidAmount = this.getPaidAmount();
        this.order.outstandingAmount = this.order.totalOrderAmount - this.getPaidAmount();
        if (
            (this.methodType === "InDyne" &&
                this.businessService.serviceReservation === null) ||
            (this.methodType === "InDyne" &&
                this.businessService.serviceReservation === undefined) ||
            (this.methodType === "InDyne" &&
                this.businessService.serviceReservation === true)
        ) {
            if (
                this.order.email != null &&
                this.order.email != undefined &&
                this.order.mobile != null &&
                this.order.mobile != undefined &&
                this.order.firstName != null &&
                this.order.firstName != undefined &&
                this.order.lastName != null &&
                this.order.lastName != undefined
            ) {
                this.submitReservation();
            } else {
                if (
                    this.order.email === null ||
                    this.order.email === undefined ||
                    this.order.email === ""
                ) {
                    this.order.email = this.token.getProperty().email;
                }
                if (
                    this.order.mobile === null ||
                    this.order.mobile === undefined ||
                    this.order.mobile === ""
                ) {
                    this.order.mobile = this.token.getProperty().mobile;
                }

                if (
                    this.order.mobile === null ||
                    this.order.mobile === undefined ||
                    this.order.mobile === ""
                ) {
                    this.order.mobile = this.token.getProperty().mobile;
                }

                if (
                    this.order.firstName === null ||
                    this.order.firstName === undefined ||
                    this.order.firstName === ""
                ) {
                    this.order.firstName =
                        this.token.getProperty().managerFirstName;
                }

                if (
                    this.order.lastName === null ||
                    this.order.lastName === undefined ||
                    this.order.lastName === ""
                ) {
                    this.order.lastName =
                        this.token.getProperty().managerLastName;
                }

                this.submitReservation();
            }
        } else {
            if (this.getOrderAmount() >= 0) {
                this.orderAndPaymentCreate();
            }
            else {
                if (this.paymentsNotPaid != null && this.paymentsNotPaid != undefined) {
                    for (let i = 1; i < this.paymentsNotPaid.length; i++) {
                        this.deletepayment(this.paymentsNotPaid[i].id);
                    }
                }


                this.book();
            }
        }
    }
    // submitOrder() {

    //     if(this.methodType === "InDyne" && this.TimeSlotDetails != null && this.TimeSlotDetails != undefined && this.TimeSlotDetails.time != null)
    //     {
    //       this.order.orderSlot = this.TimeSlotDetails.time;
    //     }

    //     this.orderCurrentDate();
    //     this.order.propertyId = this.property.id;
    //     this.order.businessServiceId = this.businessService.id;

    //     this.order.orderStatus = "Submitted";

    //     this.order.orderPaymentStatus = this.payment.status
    //     if (this.order.firstName != undefined) {
    //         this.order.customerName =
    //             this.order.firstName + " " + this.order.lastName;
    //     }

    //     this.order.externalSite = "POS";

    //     if (this.address != null && this.address != undefined) {
    //         this.order.shipToAddress = this.address;
    //     }

    //     if (this.order.paymentId != undefined && this.order.paymentId != null) {
    //         this.payment.id = this.order.paymentId;
    //     }

    //     this.payment.businessServiceName = this.businessService.name;
    //     this.payment.transactionChargeAmount = this.order.totalOrderAmount;
    //     this.payment.email = this.order.email;
    //     this.payment.businessEmail = this.propertiesDto.email;
    //     this.payment.currency = this.propertiesDto.localCurrency;
    //     this.payment.paymentMode = this.order.modeOfPayment;
    //     this.payment.firstName = this.order.firstName;
    //     this.payment.lastName = this.order.lastName;
    //     this.payment.netReceivableAmount = this.subTotalAmount;
    //     this.payment.transactionAmount = this.order.totalOrderAmount;
    //     this.payment.propertyId = this.order.propertyId;
    //     this.payment.amount = this.order.totalOrderAmount;
    //     this.payment.taxAmount = this.order.taxAmount;
    //     this.payment.counterName = this.order.counterName;
    //     this.payment.counterNumber = this.order.counterNumber;
    //     this.payment.operatorName = this.order.operatorName;
    //     this.payment.serviceChargeAmount = this.order.serviceChargeAmount;

    //     if (
    //         (this.methodType === "InDyne" &&
    //             this.businessService.serviceReservation === null) ||
    //         (this.methodType === "InDyne" &&
    //             this.businessService.serviceReservation === undefined) ||
    //         (this.methodType === "InDyne" &&
    //             this.businessService.serviceReservation === true)
    //     ) {
    //         if (
    //             this.order.email != null &&
    //             this.order.email != undefined &&
    //             this.order.mobile != null &&
    //             this.order.mobile != undefined &&
    //             this.order.firstName != null &&
    //             this.order.firstName != undefined &&
    //             this.order.lastName != null &&
    //             this.order.lastName != undefined
    //         ) {
    //             this.submitReservation();
    //         } else {
    //             if (
    //                 this.order.email === null ||
    //                 this.order.email === undefined ||
    //                 this.order.email === ""
    //             ) {
    //                 this.order.email = this.token.getProperty().email;
    //             }
    //             if (
    //                 this.order.mobile === null ||
    //                 this.order.mobile === undefined ||
    //                 this.order.mobile === ""
    //             ) {
    //                 this.order.mobile = this.token.getProperty().mobile;
    //             }

    //             if (
    //                 this.order.mobile === null ||
    //                 this.order.mobile === undefined ||
    //                 this.order.mobile === ""
    //             ) {
    //                 this.order.mobile = this.token.getProperty().mobile;
    //             }

    //             if (
    //                 this.order.firstName === null ||
    //                 this.order.firstName === undefined ||
    //                 this.order.firstName === ""
    //             ) {
    //                 this.order.firstName =
    //                     this.token.getProperty().managerFirstName;
    //             }

    //             if (
    //                 this.order.lastName === null ||
    //                 this.order.lastName === undefined ||
    //                 this.order.lastName === ""
    //             ) {
    //                 this.order.lastName =
    //                     this.token.getProperty().managerLastName;
    //             }

    //             this.submitReservation();
    //         }
    //     } else {
    //         Logger.log("not In dyne");
    //         if (
    //             this.payment.paymentMode === "Card" &&
    //             this.payment.status === "Paid"
    //         ) {
    //             this.chargeCreditCard(this.payment);
    //         } else {
    //             this.savePayment(this.payment);
    //         }
    //     }
    // }

    getOrderAmount() {

        let orderAmount = this.order.totalOrderAmount - this.getPaidAmount();
        if (orderAmount > 0) {
            return this.order.totalOrderAmount - this.getPaidAmount();
        }
        else {
            return 0;
        }
        //   console.log("orderAmount"+ orderAmount)
    }
    deletepayment(Id) {
        this.paymentService.deletePaymentById(Id).subscribe(
            (data) => {
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                // if (error instanceof HttpErrorResponse) {
                //   this.openErrorSnackBar(error.message);
                // }
            }
        );
    }

    orderAndPaymentCreate() {
        if (
            this.payment.paymentMode === "Card" &&
            this.payment.status === "Paid"
        ) {
            this.chargeCreditCard(this.payment);
        } else {
            this.savePayment(this.payment);
        }
    }

    onWalletPayment() {
        this.loader = true;

        if (
            this.order.mobile === undefined &&
            this.PhoneNumberWithOutCode != null &&
            this.PhoneNumberWithOutCode != undefined
        ) {
            this.order.mobile = this.CodeNumber + this.PhoneNumberWithOutCode;
        }

        if (
            this.order.deliveryChargeAmount != null &&
            this.order.deliveryChargeAmount != undefined
        ) {
            this.payment.deliveryChargeAmount = this.order.deliveryChargeAmount;
            this.paymentReservation.deliveryChargeAmount =
                this.order.deliveryChargeAmount;
        } else {
            this.order.deliveryChargeAmount = 0;
            this.payment.deliveryChargeAmount = 0;
            this.paymentReservation.deliveryChargeAmount = 0;
        }

        this.order.modeOfPayment = "Wallet";
        this.slotReservation.modeOfPayment = "Wallet";

        this.payment.paymentMode = "Wallet";
        this.payment.status = "Paid";

        this.paymentReservation.paymentMode = "Wallet";
        this.paymentReservation.status = "Paid";

        if (this.methodType === "InDine") {
            this.order.deliveryMethod = "Dine In";
        } else if (this.methodType === "TakeAway") {
            this.order.deliveryMethod = "Take Away";
        } else if (this.methodType === "RoomOrder") {
            this.order.deliveryMethod = "Room Order";
        } else if (this.methodType === "HomeDelivery") {
            this.order.deliveryMethod = "Home Delivery";
        }
        this.submitOrder();
    }

    onBankPayment() {
        this.loader = true;

        if (
            this.order.mobile === undefined &&
            this.PhoneNumberWithOutCode != null &&
            this.PhoneNumberWithOutCode != undefined
        ) {
            this.order.mobile = this.CodeNumber + this.PhoneNumberWithOutCode;
        }

        if (
            this.order.deliveryChargeAmount != null &&
            this.order.deliveryChargeAmount != undefined
        ) {
            this.payment.deliveryChargeAmount = this.order.deliveryChargeAmount;
            this.paymentReservation.deliveryChargeAmount =
                this.order.deliveryChargeAmount;
        } else {
            this.order.deliveryChargeAmount = 0;
            this.payment.deliveryChargeAmount = 0;
            this.paymentReservation.deliveryChargeAmount = 0;
        }

        this.order.modeOfPayment = "BankTransfer";
        this.slotReservation.modeOfPayment = "BankTransfer";

        this.payment.paymentMode = "BankTransfer";
        this.payment.status = "Paid";

        this.payment.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date().getTime()
        );

        this.payment.name = undefined;
        this.payment.cardNumber = undefined;
        this.payment.cvv = undefined;
        this.payment.expMonth = undefined;
        this.payment.expYear = undefined;

        this.paymentReservation.paymentMode = "BankTransfer";
        this.paymentReservation.status = "Paid";

        if (this.methodType === "InDine") {
            this.order.deliveryMethod = "Dine In";
        } else if (this.methodType === "TakeAway") {
            this.order.deliveryMethod = "Take Away";
        } else if (this.methodType === "RoomOrder") {
            this.order.deliveryMethod = "Room Order";
        } else if (this.methodType === "HomeDelivery") {
            this.order.deliveryMethod = "Home Delivery";
        }
        this.submitOrder();
    }


    savePayment(payment: Payment) {
        this.loader = true;

        payment.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date().getTime()
        );

        if (this.paymentsNotPaid != null && this.paymentsNotPaid != undefined) {
            for (let i = 1; i < this.paymentsNotPaid.length; i++) {
                this.deletepayment(this.paymentsNotPaid[i].id);
            }
        }


        // if (this.isPaidOrder === true) {
        //   payment.status = "Paid";
        // }

        if (this.order.id != null && this.order.id != undefined) {
            payment.orderId = this.order.id;
        }
        if (this.methodType === "RoomOrder") {
            this.payment.paymentMode = "BillToRoom";
        }
        this.reservationService.savePayment(payment).subscribe((response) => {
            if (response.status === 200) {
                this.payment = response.body;
                this.order.paymentId = this.payment.id;

                this.book();
            } else {
                this.loader = false;
            }
        });
    }

    book() {
        //Logger.log("this.order " + JSON.stringify(this.order));
        if (this.order.deliveryMethod != "Home Delivery") {
            this.propertyAddress = this.property.address;
            // this.order.shipToAddress = this.propertyAddress;
        }
        if (
            this.order.id != null &&
            this.order.id != undefined &&
            this.order.id > 0 &&
            this.order.deliveryMethod === "Room Order"
        ) {
            this.roomOrder();
        } else {
            this.createOrder();
        }
    }



    roomOrder() {
        if (this.order.orderStatus != null && this.order.orderStatus === "Confirmed") {
            this.order.orderStatus = "Submitted";
        }
        this.order.noOfPerson = this.noOfPax;
        this.reservationService.roomOrder(this.order).subscribe(
            (data) => {
                this.loader = false;

                this.balanceCalculate(this.order?.id);
                this.confirmRoomOrder(this.order?.id);

                this.createAuditReport(this.prevOrder, this.order, AUDIT_ORDER_UPDATE);
                this.presentToast(
                    "Order update successfully Order Iddsfghj#" +
                    this.order.bookOneOrderId
                );

                if (this.isPaidOrder === true) {
                    this.onExpenseCreate();
                }
                if (
                    this.order?.modeOfPayment === "PartiallyPaid" &&
                    this.order?.id === undefined
                ) {
                    this.paymentDetail(this.order);
                }



                this.orderComplete(this.order?.id);
                console.log("total order", this.order.totalOrderAmount)
            },
            (error) => {
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            }

        );
    }

    async createOrder() {

        this.loader = true;
        this.order.noOfPerson = this.noOfPax;
        try {
            if (this.order.email === "") {
                this.order.email = null;
            }
            if (this.order.mobile === "") {
                this.order.mobile = null;
            }
            // if (this.order.id === null || this.order.id === undefined) {
            //     this.order.kotPrintCount = 0;
            // }
            const data = await this.reservationService.order(this.order).toPromise();
            if (data.status == 200) {
                this.loader = false;
                this.balanceCalculate(data.body.id);
                if (
                this.order.deliveryMethod === "Dine In" ||
                this.isConfirmOrder
            ) {
                setTimeout(() => {
                    this.confirmOtherOrder(data.body.id);
                }, 1000);
            } if (this.order.deliveryMethod === "Room Order") {
                this.confirmRoomOrder(data.body.id)
            }
               
               
            }

            if (this.order.id === undefined) {
                this.order.id = data.body.id;
                this.order.bookOneOrderId = data.body.bookOneOrderId;
                this.order.orderLineDtoList = data.body.orderLineDtoList;
                this.generateKot(this.order.orderLineDtoList);
                // this.createOrderKot(this.order.orderLineDtoList);
                this.createAuditReport(null, this.order, AUDIT_ORDER_CREATE);
                this.presentToast("Order created successfully Order Id#" + data.body.bookOneOrderId);

            } else {
                this.order.id = data.body.id;
                this.order.bookOneOrderId = data.body.bookOneOrderId;
                this.order.orderLineDtoList = data.body.orderLineDtoList;
                this.createAuditReport(this.prevOrder, this.order, AUDIT_ORDER_UPDATE);
                this.presentToast("Order updated successfully Order Id#" + data.body.bookOneOrderId);

            }

            if (this.deliveryMethod === 'Room Order' && this.order.deliveryMethod != "Room Order") {
                if (this.orderServiceId != null) {
                    this.deleteBookingService(this.orderServiceId);
                }
            }

            // if (this.isPaidOrder === true) {
            //     this.onExpenseCreate();
            // }

            // if (this.isConfirmOrder == false && (this.order.deliveryMethod === "Dine In" || this.order.deliveryMethod === "Room Order")) {
            //     this.confirmOrder(data.body.id);
            // }
            
            // if (
            //     this.order.deliveryMethod === "Dine In" ||
            //     this.isConfirmOrder
            // ) {
            //     this.confirmOtherOrder(data.body.id);
            // } if (this.order.deliveryMethod === "Room Order") {
            //     this.confirmRoomOrder(data.body.id)
            // }

            if (this.advancedPayments.length == 0 && this.order.advanceAmount > 0) {
                this.paymentDetail(data.body);
            }


            this.onNewOrder();
            this.orderComplete(data.body.id);

        } catch (error) {
            this.loader = true;
            this.UIDetectChange();
        }
    }

    generateKot(orderLines) {
        // Filter orderLines for those with groupKot set to true
        const orderLinesToGroup = orderLines.filter(line => line.groupKot);
    
        // Group those orderLines by productGroupId
        this.groupedOrderLines = this.groupByProductGroupId(orderLinesToGroup);
        this.createKot(this.groupedOrderLines, orderLines.filter(line => !line.groupKot));
      }
    
      createKot(groupedOrderLines, individualOrderLines) {
        const currentDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
        // Create KOTs for grouped orderLines
        let kotListToBeCreate = [];
        for (const productGroupId in groupedOrderLines) {
         
          if (groupedOrderLines.hasOwnProperty(productGroupId)) {
            const orderLineDtoList = groupedOrderLines[productGroupId];
            let printerName = this.productGroupsList[0].productGroup.find((group)=>group.name == orderLineDtoList[0].productGroupName).printerName;
            let kot = new KOT();
            kot.date = this.datepipe.transform(new Date(), "yyyy-MM-dd");
            kot.operatorName = this.order.operatorName;
            kot.propertyId = this.order.propertyId;
            kot.tableNo = this.order.resourceName;
            kot.time = this.order.requiredTime;
            kot.productGroupName = orderLineDtoList[0].productGroupName;
            kot.orderLines = orderLineDtoList;
            kot.orderNo = this.order.bookOneOrderId;
            kot.orderType = this.order.deliveryMethod;
            kot.priority = this.kotList.length + 1;
            kot.printerName = printerName;
            kotListToBeCreate.push(kot);
          }
        
        }
    
        this.orderService.createKots(kotListToBeCreate).subscribe(
          (data) => {
            // Handle success
          },
          (error) => {
            this.loader = false;
            // Handle error
          }
        );
    
        if (individualOrderLines.length > 0) {
            this.createOrderKot(individualOrderLines);
          
          
        }
        
      
      }
    
      groupByProductGroupId(orderLines: any[]): any {
        return orderLines.reduce((groupedOrderLines, orderLine) => {
          const groupId = orderLine.productGroupId;
          if (!groupedOrderLines[groupId]) {
            groupedOrderLines[groupId] = [];
          }
          groupedOrderLines[groupId].push(orderLine);
          return groupedOrderLines;
        }, {});
      }
    
      createOrderKot(orderLineDtoList) {
        let printerName = this.productGroupsList[0].productGroup.find((group)=>group.name == orderLineDtoList[0].productGroupName).printerName;
        this.kot.date = this.datepipe.transform(new Date(), "yyyy-MM-dd");
        this.kot.operatorName = this.order.operatorName;
        this.kot.propertyId = this.order.propertyId;
        this.kot.tableNo = this.order.resourceName;
        this.kot.time = this.order.requiredTime;
        this.kot.orderLines = orderLineDtoList;
        this.kot.orderNo = this.order.bookOneOrderId;
        this.kot.orderType = this.order.deliveryMethod;
        this.kot.priority = this.kotList.length +1;
        this.kot.printerName = printerName;
        this.orderService.createKot(this.kot).subscribe(
          (data) => {
          },
          (error) => {
            this.loader = false;
          }
        );
      }
    
      checkKotUnitInOrder(item) {
        let UnitInOrder = 0;
        for (let i = 0; i < this.kotList.length; i++) {
          for (let l = 0; l < this.kotList[i].orderLines.length; l++) {
            if (
              this.kotList[i].orderLines[l].name === item.name &&
              this.kotList[i].orderLines[l].productCode === item.productCode &&
              this.checkStatus(this.kotList[i].orderLines[l].status) != Available_Status
            ) {
              UnitInOrder =
                UnitInOrder + this.kotList[i].orderLines[l].unitsInOrder;
            }
          }
        }
    
        return UnitInOrder;
      }
    
      checkKotUnitInOrderForVariation(item) {
        let UnitInOrder = 0;
        for (let i = 0; i < this.kotList.length; i++) {
          for (let l = 0; l < this.kotList[i].orderLines.length; l++) {
            if (
              this.kotList[i].orderLines[l].name === item.name &&
              this.kotList[i].orderLines[l].productCode === item.code &&
              this.checkStatus(this.kotList[i].orderLines[l].status) != Available_Status
            ) {
              UnitInOrder =
                UnitInOrder + this.kotList[i].orderLines[l].unitsInOrder;
            }
          }
        }
    
        return UnitInOrder;
      }

      checkStatus(status) {
        if (status === null || status === undefined || status === "") {
          return "Available";
        }
    
        return status;
      }
    
      getKotItemInOrder(item) {
        let itemList = []
        for (let i = 0; i < this.kotList.length; i++) {
          for (let l = 0; l < this.kotList[i].orderLines.length; l++) {
            if (
              this.kotList[i].orderLines[l].name === item.name &&
              this.kotList[i].orderLines[l].productCode === item.productCode
            ) {
              itemList.push(this.kotList[i].orderLines[l]);
            }
          }
        }
    
        return itemList;
      }
    
      getKotItemInOrderVariation(item) {
        let itemList = []
        for (let i = 0; i < this.kotList.length; i++) {
          for (let l = 0; l < this.kotList[i].orderLines.length; l++) {
            if (
              this.kotList[i].orderLines[l].name === item.name &&
              this.kotList[i].orderLines[l].productCode === item.code
            ) {
              itemList.push(this.kotList[i].orderLines[l]);
            }
          }
        }
    
        return itemList;
      }

    confirmOrder(orderId: number) {
        this.loader = true;
        this.orderService.getConfirmOrderByOrderId(orderId).subscribe(
            (data) => {
                if (
                    data.body != null &&
                    data.body != undefined &&
                    data.body.message != null &&
                    data.status == 200
                ) {
                    //   this.openErrorSnackBar(data.body.message);
                }
                this.loader = false;
                this.UIDetectChange();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    balanceCalculate(orderId: number) {
        this.loader = true;
        this.orderService.calculateOutstandingAmount(orderId).subscribe(
            (data) => {
                this.loader = false;

                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    paymentDetail(row) {
        if (this.partialPaidAmount > 0) {
            this.payment.id = undefined;
            this.getDueAmount();

            this.payment.orderId = row.id;
            this.payment.amount = this.partialPaidAmount;
            this.payment.transactionChargeAmount = this.partialPaidAmount;
            this.payment.transactionAmount = this.partialPaidAmount;
            this.payment.status = "Paid";
            this.payment.referenceNumber = row.bookOneOrderId;
            if (row.advanceAmount > 0) {
                // this.payment.advancePayment = true;
            }
            this.payment.description = row.bookOneOrderId;

            this.paymentService.savePayment(this.payment).subscribe((res) => { });
        }

        // let navigationExtras: NavigationExtras = {
        //   queryParams: {
        //     id: JSON.stringify(row.id),
        //   },
        // };
        // this.router.navigate(["/order/order-payment"], navigationExtras);
    }
    getDueAmount() {
        if (
            this.order.totalOrderAmount === null ||
            this.order.totalOrderAmount === undefined
        ) {
            this.order.totalOrderAmount = 0;
        }

        if (
            this.partialPaidAmount === null ||
            this.partialPaidAmount === undefined
        ) {
            this.partialPaidAmount = 0;
        }

        return (this.partialDueAmount =
            this.order.totalOrderAmount - this.partialPaidAmount);
    }

    deleteBookingService(serviceId) {
        this.bookingService.deleteService(serviceId).subscribe(
            (response) => {
                if (response.status === 200) {

                    this.presentToast("Service Deleted Successfully.");
                }

            },
            (error) => {
            }
        );
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

    // createOrder() {
    //     this.order.noOfPerson = this.noOfPax;
    //     this.order.orderedTime = this.getOrderTimeformatAMPM(new Date());
    //     this.reservationService.order(this.order).subscribe(
    //         (data) => {
    //             this.loader = false;
    //             // this.changeDetectorRefs.detectChanges();

    //             if (
    //                 this.order.deliveryMethod === "Dine In"  ||
    //                 this.isConfirmOrder
    //             ) {
    //                 this.confirmOtherOrder(data.body.id);
    //             } if (this.order.deliveryMethod === "Room Order") {
    //                 this.confirmRoomOrder(data.body.id)
    //             } 
    //             else {
    //                 if (this.order.id === undefined) {
    //                     this.order.id = data.body.id;
    //                     this.order.bookOneOrderId = data.body.bookOneOrderId;
    //                     this.createAuditReport(null, this.order, AUDIT_ORDER_CREATE);
    //                     this.presentToast(
    //                         "Order create successfully Order Id#" +
    //                             data.body.bookOneOrderId +".For total booking payment, please use the balance calculator in payment details page before proceeding."
    //                     );
    //                 } else {
    //                     this.createAuditReport(this.prevOrder, this.order, AUDIT_ORDER_UPDATE);
    //                     this.presentToast(
    //                         "Order update successfully Order Id#" +
    //                             data.body.bookOneOrderId
    //                     );
    //                 }

    //                 if (this.isPaidOrder === true) {
    //                     this.onExpenseCreate();
    //                 }
    //                 this.onNewOrder();
    //             }
    //             this.orderComplete(data.body.id);
    //         },
    //         (error) => {
    //             this.loader = false;
    //             this.changeDetectorRefs.detectChanges();
    //         }
    //     );
    // }

    confirmRoomOrder(orderId: number) {
        this.loader = true;
        this.orderService.getConfirmOrderByOrderId(orderId).subscribe(
            (data) => {
                if (
                    data.body != null &&
                    data.body != undefined &&
                    data.body.message != null
                ) {
                    this.presentToast(data.body.message);
                }

                this.presentToast(
                    "Order updated successfully Order Id#" +
                    data.body.bookOneOrderId
                );

                if (this.isPaidOrder === true) {
                    this.onExpenseCreate();
                }

                // this.onNewOrder();

                // if (this.isItemUpdate === true) {
                //     setTimeout(() => {
                //         if (this.isNewOrderCreated === false) {
                //             this.locationBack.back();
                //         }
                //     }, 1000);
                // } else {
                //     this.onListPage();
                // }
                // this.loader = false;
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    // createAuditReport(prevOrder : Order , currentOrder : Order, operationType : string)
    // {
    //   this.role = [];
    //   JSON.parse(this.token.getRole()).forEach((item) => {
    //     this.role.push(item);
    //   });

    //   let audit = new Audit();

    //   audit.auditType = operationType;
    //   audit.orderId = currentOrder.id;
    //   audit.propertyId = currentOrder.propertyId;
    //   audit.role = this.role[0];
    //   audit.updatedAt = new Date().getTime().toString();
    //   audit.updatedBy = this.PosUserName;
    //   audit.reservationId = currentOrder.bookOneOrderId;

    //   if (AUDIT_ORDER_CREATE === operationType)
    //   {

    //     if (currentOrder.deliveryMethod === "Dine In") {

    //       audit.previousValue = "";
    //       audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Resource:${currentOrder.resourceName},Location:${currentOrder.locationName},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount}.`;

    //     } else if (currentOrder.deliveryMethod === "Room Order") {

    //       audit.bookingId = currentOrder.bookingId;
    //       audit.previousValue = "";
    //       audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)}, Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Room No:${currentOrder.roomNo},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount}.`;

    //     }
    //     else
    //     {
    //       audit.previousValue = "";
    //       audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount}.`;
    //     }

    //     audit.operatorNotes = "";
    //     audit.updateType = "New Order";

    //   } else if (AUDIT_ORDER_UPDATE === operationType)
    //   {
    //     if (currentOrder.deliveryMethod === "Dine In") {

    //       audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Resource:${currentOrder.resourceName},Location:${currentOrder.locationName},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount}.`;
    //       audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)},Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Resource:${prevOrder.resourceName},Location:${prevOrder.locationName},Discount:${prevOrder.discountAmount}, Total:${prevOrder.totalOrderAmount}.`;

    //     } else if (currentOrder.deliveryMethod === "Room Order") {

    //       audit.bookingId = currentOrder.bookingId;

    //       audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)}, Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Room No:${currentOrder.roomNo},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount}.`;
    //       audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)}, Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Room No:${prevOrder.roomNo},Discount:${prevOrder.discountAmount}, Total:${prevOrder.totalOrderAmount}.`;

    //     }
    //     else
    //     {
    //       audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount}.`;
    //       audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)},Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Discount:${prevOrder.discountAmount}, Total:${prevOrder.totalOrderAmount}.`;
    //     }

    //     audit.operatorNotes = "";
    //     audit.updateType = "Update Order";
    //   }

    //   this.loader = true;
    //   this.propertyService.createAuditReport(audit).subscribe(
    //     (data) => {
    //       this.loader = false;

    //       this.changeDetectorRefs.detectChanges();
    //     },
    //     (error) => {
    //       this.loader = false;
    //     }
    //   );
    // }
    // createAuditReport(prevOrder: Order, currentOrder: Order, operationType: string) {
    //     this.role = [];
    //     JSON.parse(this.token.getRole()).forEach((item) => {
    //         this.role.push(item);
    //     });

    //     let audit = new Audit();

    //     audit.auditType = operationType;
    //     audit.orderId = currentOrder.id;
    //     audit.propertyId = currentOrder.propertyId;
    //     audit.role = this.role[0];
    //     audit.updatedAt = new Date().getTime().toString();
    //     audit.updatedBy = this.PosUserName;
    //     audit.reservationId = currentOrder.bookOneOrderId;

    //     if (AUDIT_ORDER_CREATE === operationType) {
    //         if (currentOrder.deliveryMethod === "Dine In") {

    //             let newItems = this.orderSelectedProducts.map(product => product.name).join(",");

    //             audit.previousValue = "";
    //             audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Resource:${currentOrder.resourceName},Location:${currentOrder.locationName},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Total Items:(${this.orderSelectedProducts.length}).`;

    //         } else if (currentOrder.deliveryMethod === "Room Order") {
    //             let newItems = this.orderSelectedProducts.map(product => product.name).join(",");
    //             audit.bookingId = currentOrder.bookingId;
    //             audit.previousValue = "";
    //             audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)}, Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Room No:${currentOrder.roomNo},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Total Items:(${this.orderSelectedProducts.length}).`;

    //         }
    //         else {
    //             let newItems = this.orderSelectedProducts.map(product => product.name).join(",");
    //             audit.previousValue = "";
    //             audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Total Items:(${this.orderSelectedProducts.length}).`;
    //         }

    //         audit.operatorNotes = "";
    //         audit.updateType = "New Order";

    //     } else if (AUDIT_ORDER_UPDATE === operationType) {
    //         if (currentOrder.deliveryMethod === "Dine In") {

    //             let newItems = this.orderSelectedProducts.map(product => product.name).join(",");
    //             let oldItems = this.previousOrderproductLine.map(product => product.name).join(",");
    //             audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Resource:${currentOrder.resourceName},Location:${currentOrder.locationName},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Total Items:(${this.orderSelectedProducts.length}).`;
    //             audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)},Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Resource:${prevOrder.resourceName},Location:${prevOrder.locationName},Discount:${prevOrder.discountAmount}, Total:${this.previousOrderAmount} , Total Items:(${this.previousOrderproductLine.length}).`;

    //         } else if (currentOrder.deliveryMethod === "Room Order") {

    //             let newItems = this.orderSelectedProducts.map(product => product.name).join(",");
    //             let oldItems = this.previousOrderproductLine.map(product => product.name).join(",");
    //             audit.bookingId = currentOrder.bookingId;

    //             audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)}, Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Room No:${currentOrder.roomNo},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Total Items:(${this.orderSelectedProducts.length}).`;
    //             audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)}, Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Room No:${prevOrder.roomNo},Discount:${prevOrder.discountAmount}, Total:${this.previousOrderAmount} , Total Items:(${this.previousOrderproductLine.length}).`;

    //         }
    //         else {
    //             let newItems = this.orderSelectedProducts.map(product => product.name).join(",");
    //             let oldItems = this.previousOrderproductLine.map(product => product.name).join(",");
    //             audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Total Items:(${this.orderSelectedProducts.length}).`;
    //             audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)},Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Discount:${prevOrder.discountAmount}, Total:${this.previousOrderAmount} , Total Items:(${this.previousOrderproductLine.length}).`;
    //         }

    //         if (this.previousOrderproductLine.length > this.orderSelectedProducts.length) {
    //             audit.operatorNotes = "Item Removed";
    //         } else if (this.previousOrderproductLine.length < this.orderSelectedProducts.length) {
    //             audit.operatorNotes = "Item Added";
    //         } else {
    //             audit.operatorNotes = "";
    //         }

    //         audit.updateType = "Update Order";
    //     }

    //     this.loader = true;
    //     this.propertyService.createAuditReport(audit).subscribe(
    //         (data) => {
    //             this.loader = false;

    //             this.changeDetectorRefs.detectChanges();
    //         },
    //         (error) => {
    //             this.loader = false;
    //         }
    //     );
    // }
    getCountOfOldSelectedProducts(oldOrderSelectedProducts:any[]){
        let totalQuantity = 0;
        for (let i = 0; i < oldOrderSelectedProducts.length; i++) {
          if (
            oldOrderSelectedProducts[i].productVariationDtoList != null &&
            oldOrderSelectedProducts[i].productVariationDtoList != undefined &&
            oldOrderSelectedProducts[i].productVariationDtoList.length > 0
          ) {
            for (
              let j = 0;
              j < oldOrderSelectedProducts[i].productVariationDtoList.length;
              j++
            ) {
              if (
                oldOrderSelectedProducts[i].productVariationDtoList[j].totalPrice !=
                  undefined &&
                oldOrderSelectedProducts[i].productVariationDtoList[j].totalPrice !=
                  null &&
                oldOrderSelectedProducts[i].productVariationDtoList[j].totalPrice >= 0
              ) {
                totalQuantity = totalQuantity + 1;
              }
            }
          } else if (
            oldOrderSelectedProducts[i].unitsInOrder != undefined &&
            oldOrderSelectedProducts[i].unitsInOrder != null &&
            oldOrderSelectedProducts[i].unitsInOrder > 0
          ) {
            totalQuantity = totalQuantity + 1;
          }
    
        }
        return totalQuantity;
      }

      getCountOfNewSelectedProducts(newOrderSelectedProducts:any[]){
        let totalQuantity = 0;
        for (let i = 0; i < newOrderSelectedProducts.length; i++) {
          if (
            newOrderSelectedProducts[i].productVariationDtoList != null &&
            newOrderSelectedProducts[i].productVariationDtoList != undefined &&
            newOrderSelectedProducts[i].productVariationDtoList.length > 0
          ) {
            for (
              let j = 0;
              j < newOrderSelectedProducts[i].productVariationDtoList.length;
              j++
            ) {
              if (
                newOrderSelectedProducts[i].productVariationDtoList[j].totalPrice !=
                  undefined &&
                newOrderSelectedProducts[i].productVariationDtoList[j].totalPrice !=
                  null &&
                newOrderSelectedProducts[i].productVariationDtoList[j].totalPrice >= 0
              ) {
                totalQuantity = totalQuantity + 1;
              }
            }
          } else if (
            newOrderSelectedProducts[i].unitsInOrder != undefined &&
            newOrderSelectedProducts[i].unitsInOrder != null &&
            newOrderSelectedProducts[i].unitsInOrder > 0
          ) {
            totalQuantity = totalQuantity + 1;
          }
    
        }
        return totalQuantity;
      }

    createAuditReport(prevOrder : Order , currentOrder : Order, operationType : string)
    {
      this.role = [];
      JSON.parse(this.token.getRole()).forEach((item) => {
        this.role.push(item);
      });
  
      let audit = new Audit();
  
      audit.auditType = operationType;
      audit.orderId = currentOrder.id;
      audit.propertyId = currentOrder.propertyId;
      audit.role = this.role[0];
      audit.updatedAt = new Date().getTime().toString();
      audit.updatedBy = this.PosUserName;
      audit.reservationId = currentOrder.bookOneOrderId;
  
      if (AUDIT_ORDER_CREATE === operationType)
      {
  
        // let item = "";
        // if (currentOrder.productDtoList != null && currentOrder.productDtoList != undefined && currentOrder.productDtoList.length > 0)
        // {
        //   console.log("1");
        //   for (let i = 0; currentOrder.productDtoList.length > i; i++)
        //   {
        //     console.log("2"+currentOrder.productDtoList[i].name);
        //     if (currentOrder.productDtoList[i].discountedPrice != null &&
        //       currentOrder.productDtoList[i].discountedPrice != undefined &&
        //       currentOrder.productDtoList[i].discountedPrice > 0)
        //     {
        //       item = item + `${currentOrder.productDtoList[i].name},Quantity:${currentOrder.productDtoList[i].unitsInOrder},Total:${currentOrder.productDtoList[i].discountedPrice * currentOrder.productDtoList[i].unitsInOrder}, `;
        //     }
        //     else
        //     {
        //       item = item + `${currentOrder.productDtoList[i].name},Quantity:${currentOrder.productDtoList[i].unitsInOrder},Total:${currentOrder.productDtoList[i].sellUnitPrice * currentOrder.productDtoList[i].unitsInOrder}, `;
        //     }
  
        //     console.log("item "+JSON.stringify(item));
        //   }
        // }
  
  
        if (currentOrder.deliveryMethod === "Dine In") {
          let newItems = this.orderSelectedProducts
            .map(product => {
              if (product.unitsInOrder === null) {
                let variationItems = product.productVariationDtoList
                  .filter(variation => variation.unitsInOrder !== null)
                  .map(variation => `${variation.name}(${variation.unitsInOrder})`);
                return variationItems.join(", ");
              } else {
  
                return `${product.name}(${product.unitsInOrder})`;
              }
            })
            .join(", ");
  
          audit.previousValue = "";
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},Resource:${currentOrder.resourceName},Location:${currentOrder.locationName},Discount:${currentOrder.discountAmount}, Total Amount:${currentOrder.totalOrderAmount} ,Delivery Method:${currentOrder.deliveryMethod}, Items:(${newItems}).`;
  
        } else if (currentOrder.deliveryMethod === "Room Order") {
          let newItems = this.orderSelectedProducts.map(product => {
            if (product.unitsInOrder === null) {
              let variationItems = product.productVariationDtoList
                .filter(variation => variation.unitsInOrder !== null)
                .map(variation => `${variation.name}(${variation.unitsInOrder})`);
              return variationItems.join(", ");
            } else {
  
              return `${product.name}(${product.unitsInOrder})`;
            }
          })
          .join(", ");
  
          audit.bookingId = currentOrder.bookingId;
          audit.previousValue = "";
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)}, Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},Room No:${currentOrder.roomNo},Discount:${currentOrder.discountAmount}, Total Amount:${currentOrder.totalOrderAmount} ,Delivery Method:${currentOrder.deliveryMethod}, Items:(${newItems}).`;
  
        }
        else
        {
          let newItems = this.orderSelectedProducts.map(product => {
            if (product.unitsInOrder === null) {
              let variationItems = product.productVariationDtoList
                .filter(variation => variation.unitsInOrder !== null)
                .map(variation => `${variation.name}(${variation.unitsInOrder})`);
              return variationItems.join(", ");
            } else {
  
              return `${product.name}(${product.unitsInOrder})`;
            }
          })
          .join(", ");
  
          audit.previousValue = "";
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},Discount:${currentOrder.discountAmount}, Total Amount:${currentOrder.totalOrderAmount} ,Delivery Method:${currentOrder.deliveryMethod}, Items:(${newItems}).`;
        }
  
        audit.operatorNotes = "";
        audit.updateType = "New Order";
  
      } else if (AUDIT_ORDER_UPDATE === operationType)
      {
        if (currentOrder.deliveryMethod === "Dine In") {
  
          let newItems = this.orderSelectedProducts.map(product => {
            if (product.unitsInOrder === null) {
              let variationItems = product.productVariationDtoList
                .filter(variation => variation.unitsInOrder !== null)
                .map(variation => `${variation.name}(${variation.unitsInOrder})`);
              return variationItems.join(", ");
            } else {
  
              return `${product.name}(${product.unitsInOrder})`;
            }
          })
          .join(", ");
  
          let oldItems = this.previousOrderproductLine.map(product => {
            if (product.unitsInOrder === null) {
              let variationItems = product.productVariationDtoList
                .filter(variation => variation.unitsInOrder !== null)
                .map(variation => `${variation.name}(${variation.unitsInOrder})`);
              return variationItems.join(", ");
            } else {
  
              return `${product.name}(${product.unitsInOrder})`;
            }
          })
          .join(", ");
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},Resource:${currentOrder.resourceName},Location:${currentOrder.locationName},Discount:${currentOrder.discountAmount}, Total Amount:${currentOrder.totalOrderAmount} ,Delivery Method:${currentOrder.deliveryMethod}, New Items:${newItems}`;
          audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)},Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},Resource:${prevOrder.resourceName},Location:${prevOrder.locationName},Discount:${prevOrder.discountAmount}, Total Amount:${this.previousOrderAmount} ,Delivery Method:${this.previousDeliveryMethod}, Old Items:${oldItems}.`;
  
        } else if (currentOrder.deliveryMethod === "Room Order") {
  
          let newItems = this.orderSelectedProducts.map(product => {
            if (product.unitsInOrder === null) {
              let variationItems = product.productVariationDtoList
                .filter(variation => variation.unitsInOrder !== null)
                .map(variation => `${variation.name}(${variation.unitsInOrder})`);
              return variationItems.join(", ");
            } else {
  
              return `${product.name}(${product.unitsInOrder})`;
            }
          })
          .join(", ");
  
          let oldItems = this.previousOrderproductLine.map(product => {
            if (product.unitsInOrder === null) {
              let variationItems = product.productVariationDtoList
                .filter(variation => variation.unitsInOrder !== null)
                .map(variation => `${variation.name}(${variation.unitsInOrder})`);
              return variationItems.join(", ");
            } else {
  
              return `${product.name}(${product.unitsInOrder})`;
            }
          })
          .join(", ");
  
          audit.bookingId = currentOrder.bookingId;
  
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)}, Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},Room No:${currentOrder.roomNo},Discount:${currentOrder.discountAmount}, Total Amount:${currentOrder.totalOrderAmount} ,Delivery Method:${currentOrder.deliveryMethod}, New Items:${newItems}.`;
          audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)}, Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},Room No:${prevOrder.roomNo},Discount:${prevOrder.discountAmount}, Total Amount:${this.previousOrderAmount}  ,Delivery Method:${this.previousDeliveryMethod}, Old Items:${oldItems}.`;
  
        }
        else
        {
          let newItems = this.orderSelectedProducts.map(product => {
            if (product.unitsInOrder === null) {
              let variationItems = product.productVariationDtoList
                .filter(variation => variation.unitsInOrder !== null)
                .map(variation => `${variation.name}(${variation.unitsInOrder})`);
              return variationItems.join(", ");
            } else {
  
              return `${product.name}(${product.unitsInOrder})`;
            }
          })
          .join(", ");
  
          let oldItems = this.previousOrderproductLine.map(product => {
            if (product.unitsInOrder === null) {
              let variationItems = product.productVariationDtoList
                .filter(variation => variation.unitsInOrder !== null)
                .map(variation => `${variation.name}(${variation.unitsInOrder})`);
              return variationItems.join(", ");
            } else {
  
              return `${product.name}(${product.unitsInOrder})`;
            }
          })
          .join(", ");
  
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},Discount:${currentOrder.discountAmount}, Total Amount:${currentOrder.totalOrderAmount} ,Delivery Method:${currentOrder.deliveryMethod}, New Items:${newItems}.`;
          audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)},Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},Discount:${prevOrder.discountAmount}, Total Amount:${this.previousOrderAmount} ,Delivery Method:${this.previousDeliveryMethod}, Old Items:${oldItems}.`;
        }
  
        if (this.getCountOfOldSelectedProducts(this.previousOrderproductLine) > this.getCountOfNewSelectedProducts(this.orderSelectedProducts)) {
          audit.operatorNotes = "Item Removed";
        } else if (this.getCountOfOldSelectedProducts(this.previousOrderproductLine) < this.getCountOfNewSelectedProducts(this.orderSelectedProducts)) {
          audit.operatorNotes = "Item Added";
        } else {
          audit.operatorNotes = "";
        }
  
        if(currentOrder.deliveryMethod === (this.previousDeliveryMethod || prevOrder.deliveryMethod)){
          audit.updateType = "Update Order";
        } else {
          audit.updateType = "Convert Order";
        }
  
      }
  
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


    confirmOtherOrder(orderId: number) {
        this.loader = true;
        this.orderService.getConfirmOrderByOrderId(orderId).subscribe(
            (data) => {
                if (
                    data.body != null &&
                    data.body != undefined &&
                    data.body.message != null
                ) {
                    this.presentToast(data.body.message);
                }

                if (this.order.id === undefined) {
                    this.presentToast(
                        "Order create successfully Order Id#" +
                        data.body.bookOneOrderId
                    );
                } else {
                    this.presentToast(
                        "Order update successfully Order Id#" +
                        data.body.bookOneOrderId
                    );
                    // if (this.isItemUpdate === true) {
                    //     setTimeout(() => {
                    //         if (this.isNewOrderCreated === false) {
                    //             this.locationBack.back();
                    //         }
                    //     }, 1000);
                    // } else {
                    //     this.onListPage();
                    // }
                }

                if (this.isPaidOrder === true) {
                    this.onExpenseCreate();
                }
                this.onNewOrder();
                this.UIDetectChange();
                this.loader = false;
                // if (this.isItemUpdate === true) {
                //     setTimeout(() => {
                //         if (this.isNewOrderCreated === false) {
                //             this.locationBack.back();
                //         }
                //     }, 1000);
                // } else {
                //     this.onListPage();
                // }
            },
            (error) => {
                this.loader = false;
                this.UIDetectChange();
            }
        );
    }

    onExpenseCreate() {
        //  Logger.log(this.expense);
        this.loader = true;
        this.expense.date = String(new Date().getTime());
        this.expense.submittedBy = this.user.username;
        this.expense.businessEmail = this.user.username;
        this.expense.propertyId = Number(this.token.getPropertyId());
        this.expense.name = "Order Refund";
        this.expense.amount = this.order.refundAmount;
        this.expense.orderId = this.order.id;
        this.expense.description =
            "Expence created from :" +
            this.order.bookOneOrderId +
            ". and Customer Name : " +
            this.order.firstName +
            " " +
            this.order.lastName +
            ".";

        this.expenseService.saveExpense(this.expense).subscribe(
            (response) => {
                // Logger.log (response);
            },
            (error) => {
                // this.presentToast(`Error Code ${error.message}`);
                this.loader = false;
            }
        );
    }

    onBackSection() {
        this.isPaymentSection = false;
    }

    onNextPayment() {
        // this.sliderPayment.getActiveIndex().then((index) => {
        //     this.slideIndexPayment = index;
        //     this.sliderPayment.slideNext();
        // });
    }

    onBackPayment() {
        // this.sliderPayment.getActiveIndex().then((index) => {
        //     this.slideIndexPayment = index;
        //     this.sliderPayment.slidePrev();
        // });

    }

    onNext() {
        // this.slider.getActiveIndex().then((index) => {
        //     this.slideIndex = index;
        //     this.slider.slideNext();
        // });


    }

    onBack() {
        // this.slider.getActiveIndex().then((index) => {
        //     this.slideIndex = index;
        //     this.slider.slidePrev();
        // });

    }

    backPage() {
        this.isOderDetailsPlace = false;
    }

    onSelectType(typeName) {

        this.methodType = typeName;

        if (this.methodType === "InDine") {
            this.order.deliveryMethod = "Dine In";

        } else if (this.methodType === "TakeAway") {
            this.order.deliveryMethod = "Take Away";
        } else if (this.methodType === "RoomOrder") {
            this.order.deliveryMethod = "Room Order";
        } else if (this.methodType === "HomeDelivery") {
            this.order.deliveryMethod = "Home Delivery";
        }
        if (this.methodType === "QuickInDine") {
            this.order.deliveryMethod = "Dine In";
        }
    }

    onSelectTypeList() {
        this.methodType = undefined;
        this.onNewOrder();
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    //
    onProductMinus(
        product: any,
        p: number,
        productGroup: any,
        businessServiceId: number,
        i: number
    ) {
        if (
            this.orderProducts.some(
                (opRoduct) => opRoduct.id === product.id
            ) === true
        ) {
            this.orderProduct = new OrderProduct();

            this.orderProduct = this.orderProducts.find(
                (cart) => cart.id === product.id
            );

            this.quantity = this.orderProduct.unitsInOrder;

            this.quantity = this.quantity - 1;

            if (
                this.orderProduct.discountedPrice !== null &&
                this.orderProduct.discountedPrice !== 0
            ) {
                this.totalPrice =
                    this.orderProduct.discountedPrice * this.quantity;
            } else {
                this.totalPrice =
                    this.orderProduct.sellUnitPrice * this.quantity;
            }

            
            product.unitsInOrder = this.quantity;
            this.orderProduct.unitsInOrder = this.quantity;
            // console.log("sdxcs",JSON.stringify(this.productGroup.productDtoList))
                productGroup?.productDtoList?.forEach(element => {
                        if (element.id === product.id) {
                            element.unitsInOrder = this.quantity
                        } else {
                            
                        }
                    
                });
                this.changeDetectorRefs.detectChanges();
            this.orderProduct.totalPrice = this.totalPrice;

            if (this.orderProduct.unitsInOrder === 0) {
                if (this.productGroupsList[i] != undefined) {
                    const groupIndex =
                        this.productGroupsList[i].productGroup.indexOf(
                            productGroup
                        );
                    // this.orderProducts = this.orderProducts.filter(item => item.id !== this.orderProduct.id);
                    this.productGroupsList[i].productGroup[
                        groupIndex
                    ].productDtoList[p].unitsInOrder = null;

                    this.orderProducts.splice(
                        this.orderProducts.indexOf(product),
                        1
                    );
                }
            } else {
                // this.productGroupsList[i].productGroup[pg].productDtoList[p].unitsInOrder = this.orderProduct.unitsInOrder;
                this.orderProducts[this.orderProducts.indexOf(product)] =
                    this.orderProduct;
            }
        } else {
            this.orderProduct = new OrderProduct();
            this.orderProduct = product;
            this.orderProduct.businessServiceId = businessServiceId;
            this.orderProduct.productGroupName = productGroup.name;

            this.quantity = this.orderProduct.unitsInOrder;

            this.quantity = this.quantity - 1;

            if (
                this.orderProduct.discountedPrice !== null &&
                this.orderProduct.discountedPrice !== 0
            ) {
                this.totalPrice =
                    this.orderProduct.discountedPrice * this.quantity;
            } else {
                this.totalPrice =
                    this.orderProduct.sellUnitPrice * this.quantity;
            }

            this.orderProduct.unitsInOrder = this.quantity;
            this.orderProduct.totalPrice = this.totalPrice;

            if (this.orderProduct.unitsInOrder === 0) {
                const groupIndex =
                    this.productGroupsList[i].productGroup.indexOf(
                        productGroup
                    );
                this.productGroupsList[i].productGroup[
                    groupIndex
                ].productDtoList[p].unitsInOrder = null;

                this.orderProducts.splice(
                    this.orderProducts.indexOf(product),
                    1
                );
            } else {
                this.orderProducts[this.orderProducts.indexOf(product)] =
                    this.orderProduct;
            }
        }
        this.calculateTaxSlab();
        //this.calculateQuantity();
    }

    onProductAdd(
        product: any,
        p: number,
        productGroup: any,
        businessServiceId: number,
        i: number,
        isChangeFromInput: boolean
    ) {
        if (
            this.orderProducts.some(
                (opRoduct) => opRoduct.id === product.id
            ) === true
        ) {
            this.orderProduct = new OrderProduct();

            this.orderProduct = this.orderProducts.find(
                (cart) => cart.id === product.id
            );

            // if( this.orderProduct.unitsInOrder <0)
            // {
            //   this.orderProduct.unitsInOrder = 0;
            // }

            this.quantity = this.orderProduct.unitsInOrder;
           
        this.changeDetectorRefs.detectChanges();
            if (product.discountInPercentage > this.maxOrderItemDiscountPercentage) {
                product.discountInPercentage = this.maxOrderItemDiscountPercentage;
            }
            if (isChangeFromInput === true) {
            } else {
                this.quantity = this.quantity + 1;
            }
            if (product.discountInPercentage != null && product.discountInPercentage > 0) {
                let productDiscount = (product.sellUnitPrice * product.discountInPercentage) / 100;
                product.discountedPrice = product.sellUnitPrice - productDiscount;
            } else {
                product.discountedPrice = null;
            }

            if (product.discountInPercentage > this.maxOrderItemDiscountPercentage) {
                product.discountInPercentage = this.maxOrderItemDiscountPercentage;
            }
            if (product.discountedPrice !== null) {
                this.totalPrice = product.discountedPrice * this.quantity;
            } else {
                this.totalPrice = product.sellUnitPrice * this.quantity;
            }

            this.orderProduct.unitsInOrder = this.quantity;

            product.unitsInOrder = this.quantity;
            productGroup?.productDtoList?.forEach(element => {
                if (element.id === product.id) {
                    element.unitsInOrder = this.quantity
                } else {
                    
                }
            
        });
            this.orderProduct.totalPrice = this.totalPrice;
            this.orderProduct.nonGstItem = productGroup.nonGstItem;
            // this.productGroupsList[i].productGroup[pg].productDtoList[p].unitsInOrder = this.orderProduct.unitsInOrder;

            this.orderProducts[this.orderProducts.indexOf(product)] =
                this.orderProduct;
        } else {
            this.orderProduct = new OrderProduct();
            this.orderProduct = product;
            this.orderProduct.businessServiceId = businessServiceId;
            this.orderProduct.productGroupName = productGroup.name;
            if (
                product.unitsInOrder != undefined &&
                product.unitsInOrder != null &&
                product.unitsInOrder > 0
            ) {
                if (isChangeFromInput === true) {
                } else {
                    this.orderProduct.unitsInOrder = product.unitsInOrder;
                }
            } else {
                if (isChangeFromInput === true) {
                } else {
                    this.orderProduct.unitsInOrder = 1;
                }
            }
            if (product.discountedPrice !== null) {
                this.totalPrice =
                    product.discountedPrice * product.unitsInOrder;
            } else {
                this.totalPrice = product.sellUnitPrice * product.unitsInOrder;
            }

            // this.orderProduct.unitsInOrder = this.quantity;
            this.orderProduct.totalPrice = this.totalPrice;
            this.orderProduct.nonGstItem = productGroup.nonGstItem
            // this.orderProduct.totalPrice = product.sellUnitPrice * this.orderProduct.unitsInOrder;

            // this.productGroupsList[i].productGroup[pg].productDtoList[p].unitsInOrder = this.orderProduct.unitsInOrder;

            this.orderProducts.push(this.orderProduct);
        }
        // this.token.saveAddToCartProduct(this.orderProducts);
        // this.isTimmerOff = true;

        //this.calculateQuantity();
        this.calculateTaxSlab();
    }
    onProductVariationMinus(
        product: any,
        p: number,
        productGroup: any,
        businessServiceId: number,
        i: number,
        variation: any,
        v: number
    ) {
        
        // this.token.isDataShowed('false');
        console.log("variation", productGroup.productDtoList)
        if (
            this.orderProducts.some(
                (opRoduct) => opRoduct.id === product.id
            ) === true
        ) {
            this.orderProduct = new OrderProduct();
            this.orderProduct = this.orderProducts.find(
                (cart) => cart.id === product.id
            );

            this.productVariations = [];
            this.productVariation = new productVariationDtoList();
            this.productVariations = this.orderProduct.productVariationDtoList;

            if (
                this.productVariations.some(
                    (c) => c.code === variation.code
                ) === true
            ) {
                this.productVariation = this.productVariations.find(
                    (list) => list.code === variation.code
                );

                this.quantityVariation = this.productVariation.unitsInOrder;
                this.quantityVariation = this.quantityVariation - 1;

                if (
                    this.productVariation.discountedPrice !== null &&
                    this.productVariation.discountedPrice !== 0
                ) {
                    this.totalPriceVariation =
                        this.productVariation.discountedPrice *
                        this.quantityVariation;
                } else {
                    this.totalPriceVariation =
                        this.productVariation.sellUnitPrice *
                        this.quantityVariation;
                }

                // this.productVariation.discountedPrice = 0;
                console.log(this.quantityVariation,variation.unitsInOrder);
                variation.unitsInOrder = this.quantityVariation;
               
                console.log( variation.unitsInOrder);
                
                this.productVariation.totalPrice = this.totalPriceVariation;

                product.productVariationDtoList[product.productVariationDtoList.indexOf(variation)] = variation;
                this.productVariation.unitsInOrder = this.quantityVariation;
                productGroup?.productDtoList?.forEach(element => {
                    element.productVariationDtoList.forEach(element2 => {
                        if (element2.code === variation.code) {
                            element2.unitsInOrder = this.quantityVariation
                        } else {
                            
                        }
                    });
                });
                this.changeDetectorRefs.detectChanges();
                if (this.productVariation.unitsInOrder === 0) {
                    this.productVariation.unitsInOrder = null;
                    this.productVariation.totalPrice = null;
                } else {
                    this.productVariations[
                        this.productVariations.indexOf(this.productVariation)
                    ] = this.productVariation;

                    this.orderProduct.productVariationDtoList ==
                        this.productVariations;

                    this.orderProducts[this.orderProducts.indexOf(product)] =
                        this.orderProduct;
                      
                }
                
            }
        } else {
            this.orderProduct = new OrderProduct();
            this.productVariations = [];

            this.productVariation = new productVariationDtoList();

            this.productVariations = product.productVariationDtoList;

            if (
                this.productVariations.some(
                    (c) => c.code === variation.code
                ) === true
            ) {
                this.productVariation = this.productVariations.find(
                    (list) => list.code === variation.code
                );

                this.quantityVariation = this.productVariation.unitsInOrder;
                this.quantityVariation = this.quantityVariation - 1;

                if (
                    this.productVariation.discountedPrice !== null &&
                    this.productVariation.discountedPrice !== 0
                ) {
                    this.totalPriceVariation =
                        this.productVariation.discountedPrice *
                        this.quantityVariation;
                } else {
                    this.totalPriceVariation =
                        this.productVariation.sellUnitPrice *
                        this.quantityVariation;
                }

                // this.productVariation.discountedPrice = 0;
                variation.unitsInOrder = this.quantityVariation;

                this.productVariation.unitsInOrder = this.quantityVariation;
                this.productVariation.totalPrice = this.totalPriceVariation;

                if (this.productVariation.unitsInOrder === 0) {
                    this.productVariation.unitsInOrder = null;
                    this.productVariation.totalPrice = null;
                } else {
                    this.productVariations[
                        this.productVariations.indexOf(this.productVariation)
                    ] = this.productVariation;

                    this.orderProduct.productVariationDtoList =
                        this.productVariations;

                    this.orderProducts[this.orderProducts.indexOf(product)] =
                        this.orderProduct;
                }
            }
        }
        this.calculateTaxSlab();
        //this.calculateQuantity();
    }

    onProductVariationAdd(
        product: any,
        p: number,
        productGroup: any,
        businessServiceId: number,
        i: number,
        variation: any,
        v: number,
        isChangeFromInput: boolean
    ) {
        if (
            this.orderProducts.some(
                (opRoduct) => opRoduct.id === product.id
            ) === true
        ) {
            this.orderProduct = new OrderProduct();

            this.orderProduct = this.orderProducts.find(
                (cart) => cart.id === product.id
            );
            this.calculateVariationAmount(this.orderProduct);
            this.productVariations = [];
            this.productVariation = new productVariationDtoList();

            this.productVariations = this.orderProduct.productVariationDtoList;

            if (variation.discountInPercentage > this.maxOrderItemDiscountPercentage) {
                variation.discountInPercentage = this.maxOrderItemDiscountPercentage;
            }
            if (
                this.productVariations.some(
                    (c) => c.code === variation.code
                ) === true
            ) {
                this.productVariation = this.productVariations.find(
                    (list) => list.code === variation.code
                );

                this.quantityVariation = this.productVariation.unitsInOrder;
                if (isChangeFromInput === false) {
                    this.quantityVariation = this.quantityVariation + 1;
                }
                if (variation.discountInPercentage > this.maxOrderItemDiscountPercentage) {
                    variation.discountInPercentage = this.maxOrderItemDiscountPercentage;
                }

                if (variation.discountInPercentage != null && variation.discountInPercentage >= 0) {
                    let variationDiscount = (variation.sellUnitPrice * variation.discountInPercentage) / 100;
                    variation.discountedPrice = variation.sellUnitPrice - variationDiscount;
                } else {
                    variation.discountedPrice = null;
                }
                this.productVariation.discountedPrice = variation.discountedPrice;

                if (
                    this.productVariation.discountedPrice !== null &&
                    this.productVariation.discountedPrice >= 0
                ) {
                    this.totalPriceVariation =
                        this.productVariation.discountedPrice * this.quantityVariation;
                } else {
                    this.totalPriceVariation =
                        this.productVariation.sellUnitPrice * this.quantityVariation;
                }

                // this.productVariation.discountedPrice = 0;
                variation.unitsInOrder = this.quantityVariation;
                this.productVariation.unitsInOrder = this.quantityVariation;
                productGroup?.productDtoList?.forEach(element => {
                    element.productVariationDtoList.forEach(element2 => {
                        if (element2.code === variation.code) {
                            element2.unitsInOrder = this.quantityVariation
                        } else {
                            
                        }
                    });
                });
                this.productVariation.totalPrice = this.totalPriceVariation;

                this.productVariations[
                    this.productVariations.indexOf(this.productVariation)
                ] = this.productVariation;

                this.orderProduct.productVariationDtoList =
                    this.productVariations;
                this.orderProduct.nonGstItem = productGroup.nonGstItem;
                this.orderProducts[this.orderProducts.indexOf(product)] =
                    this.orderProduct;
                
            }
        } else {
            this.orderProduct = new OrderProduct();
            this.orderProduct = product;
            this.orderProduct.productGroupName = productGroup.name;
            this.orderProduct.businessServiceId = businessServiceId;

            this.productVariation = new productVariationDtoList();
            this.productVariation = variation;

            // this.productVariation.discountedPrice = 0;
            if (variation.discountInPercentage == null) {
                this.productVariation.discountedPrice = null;
            }
            if (
                variation.unitsInOrder != undefined ||
                variation.unitsInOrder != null
            ) {
                this.productVariation.unitsInOrder = variation.unitsInOrder;

                if (
                    this.productVariation.discountedPrice !== null &&
                    this.productVariation.discountedPrice !== 0
                ) {
                    this.productVariation.totalPrice =
                        this.productVariation.discountedPrice *
                        this.productVariation.unitsInOrder;
                } else {
                    this.productVariation.totalPrice =
                        this.productVariation.sellUnitPrice *
                        this.productVariation.unitsInOrder;
                }
                // this.productVariation.totalPrice = this.productVariation.sellUnitPrice * this.productVariation.unitsInOrder;
            } else {
                this.productVariation.unitsInOrder = 1;
                if (
                    this.productVariation.discountedPrice !== null &&
                    this.productVariation.discountedPrice !== 0
                ) {
                    this.productVariation.totalPrice =
                        this.productVariation.discountedPrice *
                        this.productVariation.unitsInOrder;
                } else {
                    this.productVariation.totalPrice =
                        this.productVariation.sellUnitPrice *
                        this.productVariation.unitsInOrder;
                }
            }

            this.productVariations = [];

            this.productVariations = this.orderProduct.productVariationDtoList;

            this.productVariations[v] = this.productVariation;

            this.orderProduct.productVariationDtoList = this.productVariations;
            this.orderProduct.nonGstItem = productGroup.nonGstItem;
            this.orderProducts.push(this.orderProduct);
        }

        //this.calculateQuantity();
        this.calculateTaxSlab();
        // this.viewValueSerachTermProduct.nativeElement.value = "";
    }

  
    calculateVariationAmount(orderProduct: any) {
        for (let j = 0; j < orderProduct.productVariationDtoList.length; j++) {

            if (orderProduct.productVariationDtoList[j].discountedPrice !== null && orderProduct.productVariationDtoList[j].discountedPrice >= 0) {
                orderProduct.productVariationDtoList[j].totalPrice = orderProduct.productVariationDtoList[j].discountedPrice * orderProduct.productVariationDtoList[j].unitsInOrder;
            } else {
                orderProduct.productVariationDtoList[j].totalPrice = orderProduct.productVariationDtoList[j].sellUnitPrice * orderProduct.productVariationDtoList[j].unitsInOrder;
            }
        }
        this.calculatePrice();
    }
    calculateQuantity() {
        this.totalQuantity = 0;

        for (let i = 0; i < this.orderProducts.length; i++) {
            if (
                this.orderProducts[i].productVariationDtoList != null &&
                this.orderProducts[i].productVariationDtoList != undefined &&
                this.orderProducts[i].productVariationDtoList.length > 0
            ) {
                for (
                    let j = 0;
                    j < this.orderProducts[i].productVariationDtoList.length;
                    j++
                ) {
                    if (
                        this.orderProducts[i].productVariationDtoList[j]
                            .totalPrice != undefined &&
                        this.orderProducts[i].productVariationDtoList[j]
                            .totalPrice != null &&
                        this.orderProducts[i].productVariationDtoList[j]
                            .totalPrice >= 0 &&
                            this.orderProducts[i].productVariationDtoList[j].unitsInOrder > 0
                    ) {
                        this.totalQuantity = this.totalQuantity + 1;
                    }
                }
            } else if (
                this.orderProducts[i].unitsInOrder != undefined &&
                this.orderProducts[i].unitsInOrder != null &&
                this.orderProducts[i].unitsInOrder > 0
            ) {
                this.totalQuantity = this.totalQuantity + 1;
            }

            if (this.totalQuantity === 0) {
                // this.orderProducts = [];
                // this.changeDetectorRefs.detectChanges();
            }
        }

        return this.totalQuantity;
    }

    isVariationAvailable(productVariationDtoList) {
        this.isVAvailable = false;
        for (let i = 0; i < productVariationDtoList.length; i++) {
            if (
                productVariationDtoList[i].unitsInOrder != undefined &&
                productVariationDtoList[i].unitsInOrder > 0
            ) {
                this.isVAvailable = true;
            }
        }
        return this.isVAvailable;
    }

    todaysOrder(proprtyId: string) {
        let date = new Date();
        date.setDate(date.getDate() + 1);

        let fromdate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date().getTime()
        );
        let todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            date.getTime()
        );
        this.getOrderByPropertyIdAndDateRange(
            String(proprtyId),
            fromdate,
            todate
        );
    }

    getOrderByPropertyIdAndDateRange(
        propertyId: string,
        formDate: string,
        toDate: string
    ) {
        this.loader = true;
        this.orders = [];
        this.orderFilterData = [];
        this.dyneInOrders = [];
        this.orderService
            .getOrderByPropertyIdAndDateRange(propertyId, formDate, toDate)
            .subscribe(
                (data) => {
                    this.orders = data.body;
                    this.orderFilterData = this.orders;

                    this.orders = this.orderFilterData;
                    this.dyneInOrders = this.orders.filter((item) => {
                        const searchResult =
                            item.deliveryMethod != null &&
                            item.deliveryMethod.indexOf("Dine In") > -1;

                        return searchResult;
                    });

                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    checkResourceStatus(resourceName: string, locationName: string) {
        let isResourceMatch = false;
        if (this.order.id === undefined || this.order.id === null) {
            for (let i = 0; i < this.dyneInOrders.length; i++) {
                if (
                    this.dyneInOrders[i].orderStatus != null &&
                    this.dyneInOrders[i].orderStatus != undefined &&
                    this.dyneInOrders[i].locationName === locationName &&
                    this.dyneInOrders[i].orderSlot === this.orderSlotTime &&
                    this.dyneInOrders[i].orderStatus != "Completed" &&
                    this.dyneInOrders[i].orderStatus != "Cancelled"
                ) {
                    for (
                        let j = 0;
                        j < this.dyneInOrders[i].resourceName?.split(",").length;
                        j++
                    ) {
                        if (
                            this.dyneInOrders[i].resourceName?.split(",")[j] ===
                            resourceName
                        ) {
                            isResourceMatch = true;
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < this.dyneInOrders.length; i++) {
                if (
                    this.dyneInOrders[i].orderStatus != null &&
                    this.dyneInOrders[i].orderStatus != undefined &&
                    this.dyneInOrders[i].orderStatus != "Completed" &&
                    this.dyneInOrders[i].orderStatus != "Cancelled" &&
                    this.dyneInOrders[i].orderSlot === this.orderSlotTime &&
                    this.dyneInOrders[i].locationName === locationName &&
                    this.order.id != this.dyneInOrders[i].id
                ) {
                    for (
                        let j = 0;
                        j < this.dyneInOrders[i].resourceName?.split(",").length;
                        j++
                    ) {
                        if (
                            this.dyneInOrders[i].resourceName?.split(",")[j] ===
                            resourceName
                        ) {
                            isResourceMatch = true;
                        }
                    }
                }
            }
        }

        return isResourceMatch;
    }
    checkPrice(amount: any) {
        if (amount != null && amount != undefined) {
          return amount;
        } else {
          return 0;
        }
      }
      
      calculatePrice() {
        this.total = 0;
        this.nonGstTotalAmount = 0;
        for (let i = 0; i < this.orderProducts.length; i++) {
          if (
            this.orderProducts[i].productVariationDtoList != null &&
            this.orderProducts[i].productVariationDtoList != undefined &&
            this.orderProducts[i].productVariationDtoList.length > 0
          ) {
            for (
              let j = 0;
              j < this.orderProducts[i].productVariationDtoList.length;
              j++
            ) {
              if (
                this.orderProducts[i].productVariationDtoList[j].totalPrice !=
                  null &&
                this.orderProducts[i].productVariationDtoList[j].totalPrice > 0 &&
                this.isPriceAddedtoTotal(
                  this.orderProducts[i].productVariationDtoList[j].status
                ) === true
              ) {
                this.total =
                  this.total +
                  this.orderProducts[i].productVariationDtoList[j].totalPrice;
    
                // calculate non taxable product
                if (this.orderProducts[i].nonGstItem == true) {
                  this.nonGstTotalAmount = this.nonGstTotalAmount + this.orderProducts[i].productVariationDtoList[j].totalPrice;
                }
                // for topping
                if (
                  this.orderProducts[i].productVariationDtoList[j] != null &&
                  this.orderProducts[i].productVariationDtoList[j] != undefined &&
                  this.orderProducts[i].productVariationDtoList[j]
                    .addOnProductGroup != null &&
                  this.orderProducts[i].productVariationDtoList[j]
                    .addOnProductGroup != undefined &&
                  this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                    .productDtoList != null &&
                  this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                    .productDtoList != undefined &&
                  this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                    .productDtoList.length > 0
                ) {
                  for (
                    let ex = 0;
                    ex <
                    this.orderProducts[i].productVariationDtoList[j]
                      .addOnProductGroup?.productDtoList?.length;
                    ex++
                  ) {
                    if (
                      this.isPriceAddedtoTotal(
                        this.orderProducts[i].productVariationDtoList[j]
                          .addOnProductGroup?.productDtoList[ex].status
                      ) === true
                    ) {
                      if (
                        this.orderProducts[i].productVariationDtoList[j]
                          .addOnProductGroup?.productDtoList[ex].discountedPrice !==
                          null &&
                        this.orderProducts[i].productVariationDtoList[j]
                          .addOnProductGroup?.productDtoList[ex].discountedPrice !==
                          0
                      ) {
                        this.total =
                          this.total +
                          this.checkPrice(
                            this.orderProducts[i].productVariationDtoList[j]
                              .addOnProductGroup?.productDtoList[ex].discountedPrice
                          ) *
                            this.checkPrice(
                              this.orderProducts[i].productVariationDtoList[j]
                                .addOnProductGroup?.productDtoList[ex].unitsInOrder
                            );
                      } else {
                        this.total =
                          this.total +
                          this.checkPrice(
                            this.orderProducts[i].productVariationDtoList[j]
                              .addOnProductGroup?.productDtoList[ex].sellUnitPrice
                          ) *
                            this.checkPrice(
                              this.orderProducts[i].productVariationDtoList[j]
                                .addOnProductGroup?.productDtoList[ex].unitsInOrder
                            );
                      }
                    }
                  }
                }
    
                // for extra
    
                if (
                  this.orderProducts[i].productVariationDtoList[j] != null &&
                  this.orderProducts[i].productVariationDtoList[j] != undefined &&
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraProductGroup != null &&
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraProductGroup != undefined &&
                  this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                    .productDtoList != null &&
                  this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                    .productDtoList != undefined &&
                  this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                    .productDtoList.length > 0
                ) {
                  for (
                    let ex = 0;
                    ex <
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraProductGroup?.productDtoList.length;
                    ex++
                  ) {
                    if (
                      this.isPriceAddedtoTotal(
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraProductGroup?.productDtoList[ex].status
                      ) === true
                    ) {
                      if (
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraProductGroup?.productDtoList[ex].discountedPrice !==
                          null &&
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraProductGroup?.productDtoList[ex].discountedPrice !==
                          0
                      ) {
                        this.total =
                          this.total +
                          this.checkPrice(
                            this.orderProducts[i].productVariationDtoList[j]
                              .extraProductGroup?.productDtoList[ex].discountedPrice
                          ) *
                            this.checkPrice(
                              this.orderProducts[i].productVariationDtoList[j]
                                .extraProductGroup?.productDtoList[ex].unitsInOrder
                            );
                      } else {
                        this.total =
                          this.total +
                          this.checkPrice(
                            this.orderProducts[i].productVariationDtoList[j]
                              .extraProductGroup?.productDtoList[ex].sellUnitPrice
                          ) *
                            this.checkPrice(
                              this.orderProducts[i].productVariationDtoList[j]
                                .extraProductGroup?.productDtoList[ex].unitsInOrder
                            );
                      }
                    }
                  }
                }
    
                if (
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraUnitInOrder != null &&
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraUnitInOrder != undefined
                ) {
                  this.total =
                    this.total +
                    this.checkPrice(
                      this.orderProducts[i].productVariationDtoList[j]
                        .extraUnitInOrder
                    ) *
                      this.checkPrice(
                        this.orderProducts[i].productVariationDtoList[j]
                          .sellUnitPrice
                      );
                }
    
                if (
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraUnitInOrder != null &&
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraUnitInOrder != undefined
                ) {
                  if (
                    this.orderProducts[i].productVariationDtoList[j]
                      .discountedPrice !== null &&
                    this.orderProducts[i].productVariationDtoList[j]
                      .discountedPrice !== 0
                  ) {
                    this.total =
                      this.total +
                      this.checkPrice(
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraUnitInOrder
                      ) *
                        this.checkPrice(
                          this.orderProducts[i].productVariationDtoList[j]
                            .discountedPrice
                        );
                  } else {
                    this.total =
                      this.total +
                      this.checkPrice(
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraUnitInOrder
                      ) *
                        this.checkPrice(
                          this.orderProducts[i].productVariationDtoList[j]
                            .sellUnitPrice
                        );
                  }
                }
              }
            }
          } else if (
            this.orderProducts[i].unitsInOrder != null &&
            this.orderProducts[i].unitsInOrder > 0 &&
            this.isPriceAddedtoTotal(this.orderProducts[i].status) === true
          ) {
            this.total = this.total + this.orderProducts[i].totalPrice;
    
            // calculate non taxable product
            if(this.orderProducts[i].nonGstItem == true){
              this.nonGstTotalAmount = this.nonGstTotalAmount + this.orderProducts[i].totalPrice;
            }
            // for topping
    
            if (
              this.orderProducts[i] != null &&
              this.orderProducts[i] != undefined &&
              this.orderProducts[i].addOnProductGroup != null &&
              this.orderProducts[i].addOnProductGroup != undefined &&
              this.orderProducts[i].addOnProductGroup?.productDtoList != null &&
              this.orderProducts[i].addOnProductGroup?.productDtoList != undefined &&
              this.orderProducts[i].addOnProductGroup?.productDtoList.length > 0
            ) {
              for (
                let tp = 0;
                tp < this.orderProducts[i].addOnProductGroup?.productDtoList.length;
                tp++
              ) {
                if (
                  this.isPriceAddedtoTotal(
                    this.orderProducts[i].addOnProductGroup?.productDtoList[tp]
                      .status
                  ) === true
                ) {
                  if (
                    this.orderProducts[i].addOnProductGroup?.productDtoList[tp]
                      .discountedPrice !== null &&
                    this.orderProducts[i].addOnProductGroup?.productDtoList[tp]
                      .discountedPrice !== 0
                  ) {
                    this.total =
                      this.total +
                      this.orderProducts[i].addOnProductGroup?.productDtoList[tp]
                        .discountedPrice *
                        this.orderProducts[i].addOnProductGroup?.productDtoList[tp]
                          .unitsInOrder;
                  } else {
                    this.total =
                      this.total +
                      this.orderProducts[i].addOnProductGroup?.productDtoList[tp]
                        .sellUnitPrice *
                        this.orderProducts[i].addOnProductGroup?.productDtoList[tp]
                          .unitsInOrder;
                  }
                }
              }
            }
    
            // for extra
    
            if (
              this.orderProducts[i] != null &&
              this.orderProducts[i] != undefined &&
              this.orderProducts[i].extraProductGroupDto != null &&
              this.orderProducts[i].extraProductGroupDto != undefined &&
              this.orderProducts[i].extraProductGroupDto.productDtoList != null &&
              this.orderProducts[i].extraProductGroupDto.productDtoList !=
                undefined &&
              this.orderProducts[i].extraProductGroupDto.productDtoList.length > 0
            ) {
              for (
                let ex = 0;
                ex <
                this.orderProducts[i].extraProductGroupDto.productDtoList.length;
                ex++
              ) {
                if (
                  this.isPriceAddedtoTotal(
                    this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                      .status
                  ) === true
                ) {
                  if (
                    this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                      .discountedPrice !== null &&
                    this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                      .discountedPrice !== 0
                  ) {
                    this.total =
                      this.total +
                      this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                        .discountedPrice *
                        this.orderProducts[i].extraProductGroupDto.productDtoList[
                          ex
                        ].unitsInOrder;
                  } else {
                    this.total =
                      this.total +
                      this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                        .sellUnitPrice *
                        this.orderProducts[i].extraProductGroupDto.productDtoList[
                          ex
                        ].unitsInOrder;
                  }
                }
              }
            }
            // end
            // if(this.orderProducts[i].extraUnitInOrder != null && this.orderProducts[i].extraUnitInOrder != undefined)
            // {
            //   this.total = this.total + this.orderProducts[i].extraUnitInOrder* this.orderProducts[i].sellUnitPrice;
            // }
    
            if (
              this.orderProducts[i].extraUnitInOrder != null &&
              this.orderProducts[i].extraUnitInOrder != undefined
            ) {
              if (
                this.orderProducts[i].discountedPrice !== null &&
                this.orderProducts[i].discountedPrice !== 0
              ) {
                this.total =
                  this.total +
                  this.orderProducts[i].extraUnitInOrder *
                    this.orderProducts[i].discountedPrice;
              } else {
                this.total =
                  this.total +
                  this.orderProducts[i].extraUnitInOrder *
                    this.orderProducts[i].sellUnitPrice;
              }
            } 
            
          }
        }
    
        if (
          this.order != undefined && this.order != null &&
          (this.order.discountAmount === undefined ||
          this.order.discountAmount === null)
        ) {
          this.order.discountAmount = 0;
        }
    
        if (this.isPaidOrder === true) {
          this.order.refundAmount = this.calculateRefundPrice();
        } else {
          this.order.refundAmount = 0;
        }
    
        this.order.beforeTaxAmount = this.total;
        this.subTotalAmount = this.total;
        this.order.discountAmount = Math.round(
          (this.discountPercentage * this.total) / 100
        );
        this.order.discountPercentage = this.discountPercentage;
    if (this.order.serviceChargeAmount != null && this.order.serviceChargeAmount != undefined && this.order.serviceChargeAmount >0 ) {
    // this.isIndeterminate = true;
    this.order.serviceChargeAmount = this.order.serviceChargeAmount;
    // this.calculateServiceCharge = true;
    //  this.showServiceChargeOptions(true)
    }else{
      this.order.serviceChargeAmount = 0;
    }
        /*
        if ( this.calculateServiceCharge == true) {
          
          this.order.serviceChargeAmount = Number(
            (this.total * this.businessService.serviceChargePercentage) / 100
          );
          
        } else {
          let serviceChargePercentage = 0;
          console.log("this.order.serviceChargePercentage: "+this.order.serviceChargePercentage);
          if (
            this.order.serviceChargePercentage != null &&
            this.order.serviceChargePercentage != undefined
          ) {
            serviceChargePercentage = this.order.serviceChargePercentage;
          }
    
          this.order.serviceChargeAmount = Number(
            (this.total * serviceChargePercentage) / 100
          );
        }
      */
     if(this.order.serviceChargeName != null && this.order.serviceChargeName != undefined){
      let serviceChargePercentage = 0;
      if (
        this.order.serviceChargePercentage != null &&
        this.order.serviceChargePercentage != undefined
      ) {
        serviceChargePercentage = this.order.serviceChargePercentage;
      }
    
      this.order.serviceChargeAmount = Number(
        (this.total * serviceChargePercentage) / 100
      );
     }
     this.order.serviceChargeAmount = Math.round(this.order.serviceChargeAmount);
     
        this.subTotalAmount =
          this.total +
          this.order.serviceChargeAmount -
          this.order.discountAmount -
          this.getRefundAmount();
        this.calculateTaxSlab();
        //Logger.log( this.total + '  this.total '+  this.order.deliveryChargeAmount+ ' this.order.serviceChargeAmount '+ this.order.discountAmount+' this.order.discountAmount ');
    
        if (this.businessService.priceInclusiveOfTax == true) {
          if (
            this.order.deliveryChargeAmount != null &&
            this.order.deliveryChargeAmount != undefined
          ) {
            this.order.totalOrderAmount =
              this.total +
              this.order.deliveryChargeAmount +
              // this.order.taxAmount +
              this.order.serviceChargeAmount -
              this.order.discountAmount;
          } else {
            this.order.totalOrderAmount =
              this.total +
              // this.order.taxAmount +
              this.order.serviceChargeAmount -
              this.order.discountAmount;
            this.payment.deliveryChargeAmount = 0;
            this.paymentReservation.deliveryChargeAmount = 0;
          }
        } else {
          if (
            this.order.deliveryChargeAmount != null &&
            this.order.deliveryChargeAmount != undefined
          ) {
            this.order.totalOrderAmount =
              this.total +
              this.order.deliveryChargeAmount +
              this.order.taxAmount +
              this.order.serviceChargeAmount -
              this.order.discountAmount;
          } else {
            this.order.totalOrderAmount =
              this.total +
              this.order.taxAmount +
              this.order.serviceChargeAmount -
              this.order.discountAmount;
            this.payment.deliveryChargeAmount = 0;
            this.paymentReservation.deliveryChargeAmount = 0;
          }
        }
    
        this.order.totalOrderAmount =
          this.order.totalOrderAmount - this.order.refundAmount;
        // this.order.totalOrderAmount = Math.round(this.order.totalOrderAmount);
        // this.order.advanceAmount = this.order.totalOrderAmount;
    
        if (
          this.order.deliveryMethod != null &&
          this.order.deliveryMethod != undefined &&
          this.order.deliveryMethod != "Room Order"
        ) {
          if (
            this.order.bookOneOrderId != null &&
            this.order.bookOneOrderId != undefined &&
            this.order.totalOrderAmount != null &&
            this.order.totalOrderAmount != undefined &&
            this.order.totalOrderAmount > 0
          ) {
            if (this.outStandingAmount() >= 0 || this.getPaidAmount() > 0) {
              this.isPaidOrder = true;
            } else {
              this.isPaidOrder = false;
            }
          }
        }
    
        this.subTotalAmount = Math.round(this.subTotalAmount);
        this.nonGstTotalAmount = Math.round(this.nonGstTotalAmount);
        this.order.totalOrderAmount = Math.round(this.order.totalOrderAmount);
        this.calculateProductDistount();
        return this.total;
      }
    

    // calculatePrice() {
    //     this.total = 0;
    //     this.nonGstTotalAmount = 0;

    //     for (let i = 0; i < this.orderProducts.length; i++) {
    //         if (
    //             this.orderProducts[i].productVariationDtoList != null &&
    //             this.orderProducts[i].productVariationDtoList != undefined &&
    //             this.orderProducts[i].productVariationDtoList.length > 0
    //         ) {
    //             for (
    //                 let j = 0;
    //                 j < this.orderProducts[i].productVariationDtoList.length;
    //                 j++
    //             ) {
    //                 if (
    //                     this.orderProducts[i].productVariationDtoList[j]
    //                         .totalPrice != null &&
    //                     this.orderProducts[i].productVariationDtoList[j]
    //                         .totalPrice > 0 &&
    //                     this.isPriceAddedtoTotal(
    //                         this.orderProducts[i].productVariationDtoList[j]
    //                             .status
    //                     ) === true
    //                 ) {
    //                     this.total =
    //                         this.total +
    //                         this.orderProducts[i].productVariationDtoList[j]
    //                             .totalPrice;
    //                 }
    //                 if (this.orderProducts[i].nonGstItem == true) {
    //                     this.nonGstTotalAmount = this.nonGstTotalAmount + this.orderProducts[i].productVariationDtoList[j].totalPrice;
    //                 }
    //             }
    //         } else if (
    //             this.orderProducts[i].unitsInOrder != null &&
    //             this.orderProducts[i].unitsInOrder > 0 &&
    //             this.isPriceAddedtoTotal(this.orderProducts[i].status) === true
    //         ) {
    //             this.total = this.total + this.orderProducts[i].totalPrice;
    //             if (this.orderProducts[i].nonGstItem == true) {
    //                 this.nonGstTotalAmount = this.nonGstTotalAmount + this.orderProducts[i].totalPrice;
    //             }
    //         }
    //     }

    //     if (
    //         this.order.discountAmount === undefined ||
    //         this.order.discountAmount === null
    //     ) {
    //         this.order.discountAmount = 0;
    //     }

    //     if (this.isPaidOrder === true) {
    //         this.order.refundAmount = this.calculateRefundPrice();
    //     } else {
    //         this.order.refundAmount = 0;
    //     }
    //     this.order.beforeTaxAmount = this.total;
    //     this.subTotalAmount = this.total;
    //     this.order.discountAmount =
    //         (this.discountPercentage * this.total) / 100;

    //     // this.order.taxAmount = Number(
    //     //   ((this.subTotalAmount - this.order.refundAmount) * this.taxPercentage) /
    //     //     100
    //     // );

    //     // this.order.serviceChargeAmount = 0;

    //     // this.order.serviceChargeAmount = Number(
    //     //     (this.total * this.businessService.serviceChargePercentage) / 100
    //     // );

    //     if (this.showServiceCharge && this.user.includeServicePermission === true) {
    //         this.order.serviceChargeAmount = (this.total * this.businessService.serviceChargePercentage) / 100;
    //     } else {
    //         this.order.serviceChargeAmount = 0;
    //     }

    //     if(this.order.serviceChargeName != null && this.order.serviceChargeName != undefined){
    //         let serviceChargePercentage = 0;
    //         if (
    //           this.order.serviceChargePercentage != null &&
    //           this.order.serviceChargePercentage != undefined
    //         ) {
    //           serviceChargePercentage = this.order.serviceChargePercentage;
    //         }
          
    //         this.order.serviceChargeAmount = Number(
    //           (this.total * serviceChargePercentage) / 100
    //         );
    //        }

    //        this.order.serviceChargeAmount = Math.round(this.order.serviceChargeAmount);


    //        this.subTotalAmount =
    //        this.total +
    //        this.order.serviceChargeAmount -
    //        this.order.discountAmount -
    //        this.getRefundAmount();
    //     this.calculateTaxSlab();
    //     //Logger.log( this.total + '  this.total '+  this.order.deliveryChargeAmount+ ' this.order.serviceChargeAmount '+ this.order.discountAmount+' this.order.discountAmount ');

    //     if (this.businessService.priceInclusiveOfTax == true) {
    //         if (
    //             this.order.deliveryChargeAmount != null &&
    //             this.order.deliveryChargeAmount != undefined
    //         ) {
    //             this.order.totalOrderAmount =
    //                 this.total +
    //                 this.order.deliveryChargeAmount +
    //                 // this.order.taxAmount +
    //                 this.order.serviceChargeAmount -
    //                 this.order.discountAmount;
    //         } else {
    //             this.order.totalOrderAmount =
    //                 this.total +
    //                 // this.order.taxAmount +
    //                 this.order.serviceChargeAmount -
    //                 this.order.discountAmount;
    //             this.payment.deliveryChargeAmount = 0;
    //             this.paymentReservation.deliveryChargeAmount = 0;
    //         }
    //     } else {
    //         if (
    //             this.order.deliveryChargeAmount != null &&
    //             this.order.deliveryChargeAmount != undefined
    //         ) {
    //             this.order.totalOrderAmount =
    //                 this.total +
    //                 this.order.deliveryChargeAmount +
    //                 this.order.taxAmount +
    //                 this.order.serviceChargeAmount -
    //                 this.order.discountAmount;
    //         } else {
    //             this.order.totalOrderAmount =
    //                 this.total +
    //                 this.order.taxAmount +
    //                 this.order.serviceChargeAmount -
    //                 this.order.discountAmount;
    //             this.payment.deliveryChargeAmount = 0;
    //             this.paymentReservation.deliveryChargeAmount = 0;
    //         }
    //     }
    //     this.nonGstTotalAmount = Math.round(this.nonGstTotalAmount);
    //     this.order.totalOrderAmount =
    //         Math.round(this.order.totalOrderAmount - this.order.refundAmount);

    //     this.calculateProductDistount();
    //     return this.total;
    // }

    
  getRefundAmount() {
    if (
      this.order.refundAmount != null &&
      this.order.refundAmount != undefined
    ) {
      return this.order.refundAmount;
    } else {
      return 0;
    }
  }

    isPriceAddedtoTotal(status: string) {
        if (
            status === undefined ||
            status === null ||
            status === this.Available_Status ||
            status === this.PaidButOutOfStock_Status
        ) {
            return true;
        } else {
            return false;
        }
    }

    checkDateIsBetweenTwoDate(offer) {
        const date = new Date();
    
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
    
        if (date > start && date < end) {
          return true;
        } else {
          return false;
        }
      }

      applyPromoCode(offer) {
        if (offer !== "") {
            this.promoCodeSelected = true;
          let currentDate = new Date().getTime();
          if (offer.startDate <= currentDate && currentDate <= offer.endDate) {
            if (offer.minimumOrderAmount < this.calculatePrice()) {
              this.discountPercentage = offer.discountPercentage;
              this.order.discountPercentage = offer.discountPercentage;
              this.maxOrderDiscountPercentage = this.order.discountPercentage;
              // this.order.discountAmount = this.order.netAmount * (this.order.discountPercentage / 100);
              // this.order.taxAmount = (this.order.netAmount * this.taxPercentage) / 100;
              // this.order.totalOrderAmount = this.order.netAmount + this.order.taxAmount +  this.order.deliveryChargeAmount - this.order.discountAmount;
              // this.totalAmount = this.order.totalOrderAmount;
              this.disbleService = true;
              this.order.serviceChargeAmount = 0;
              this.order.serviceChargePercentage = 0;
              this.order.serviceChargeName = undefined;
              this.order.couponCode = offer.couponCode;
              this.promoMessage = '"' + offer.couponCode + '" applied!';
            } else {
              this.promoMessage =
                "Minimum order amount is " + offer.minimumOrderAmount;
            }
          } else {
            this.discountPercentage = 0;
            this.order.discountPercentage = 0;
            this.promoMessage = '"' + offer.couponCode + '" has expired!';
          }
        } else {
          // if (this.homeDelivery == true) {
          //   this.deliveryChargeAmount = this.order.deliveryChargeAmount;
          // } else {
          //   this.deliveryChargeAmount = 0;
          // }
          this.discountPercentage = 0;
          this.order.discountPercentage = 0;
          // this.order.discountAmount =
          //   this.order.netAmount * (this.order.discountPercentage / 100);
          // this.order.taxAmount = (this.order.netAmount * this.taxPercentage) / 100;
          // this.order.totalOrderAmount = this.order.netAmount + this.order.taxAmount +   this.order.deliveryChargeAmount - this.order.discountAmount;
    
          this.promoMessage = "Not available!";
        }
      }

    calculateRefundPrice() {
        let RefundPrice = 0;

        for (let i = 0; i < this.orderProducts.length; i++) {
            if (
                this.orderProducts[i].productVariationDtoList != null &&
                this.orderProducts[i].productVariationDtoList != undefined &&
                this.orderProducts[i].productVariationDtoList.length > 0
            ) {
                for (
                    let j = 0;
                    j < this.orderProducts[i].productVariationDtoList.length;
                    j++
                ) {
                    if (
                        this.orderProducts[i].productVariationDtoList[j]
                            .totalPrice != null &&
                        this.orderProducts[i].productVariationDtoList[j]
                            .totalPrice > 0 &&
                        this.isPriceRefundAble(
                            this.orderProducts[i].productVariationDtoList[j]
                                .status
                        ) === true
                    ) {
                        RefundPrice =
                            RefundPrice +
                            this.orderProducts[i].productVariationDtoList[j]
                                .totalPrice;
                    }
                }
            } else if (
                this.orderProducts[i].unitsInOrder != null &&
                this.orderProducts[i].unitsInOrder > 0 &&
                this.isPriceRefundAble(this.orderProducts[i].status) === true
            ) {
                RefundPrice = RefundPrice + this.orderProducts[i].totalPrice;
            }
        }

        return RefundPrice;
    }

    onProductGroupClick(
        i: number,
        productGroup: any,
        businessServiceId: number
    ) {
        this.pGroupINumber = i;
        if (this.isclickG === false) {
            this.isclickG = true;
        } else {
            this.isclickG = false;
        }
        this.selectedIndex = i;
        this.businessServiceId = businessServiceId;
        this.productGroup = new ProductGroup();
        this.productGroup = productGroup;
        this.isCartList = false;
    }

    isPriceRefundAble(status: string) {
        if (
            status != undefined &&
            status != null &&
            status === this.PaidButOutOfStock_Status
        ) {
            return true;
        } else {
            return false;
        }
    }

    orderNow() {
        this.isOderDetailsPlace = true;

        this.orderSelectedProducts = [];
        for (let i = 0; i < this.orderProducts.length; i++) {
            if (
              this.orderProducts[i].productVariationDtoList != null &&
              this.orderProducts[i].productVariationDtoList != undefined &&
              this.orderProducts[i].productVariationDtoList.length > 0
            ) {
              this.productVariationSelected = [];
              for (
                let j = 0;
                j < this.orderProducts[i].productVariationDtoList.length;
                j++
              ) {
                /*
                if (
                  this.orderProducts[i].productVariationDtoList[j].totalPrice !=
                    undefined &&
                  this.orderProducts[i].productVariationDtoList[j].totalPrice !=
                    null &&
                  this.orderProducts[i].productVariationDtoList[j].totalPrice >= 0
                ) {
                  */
                  // for variation
                  if (
                    this.orderProducts[i].productVariationDtoList[j]
                      .addOnProductGroup != undefined &&
                    this.orderProducts[i].productVariationDtoList[j]
                      .addOnProductGroup != null &&
                    this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                      .productDtoList != undefined &&
                    this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                      .productDtoList != null &&
                    this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                      .productDtoList.length > 0
                  ) {
                    // variation topping
                    let productNote = "";
                    for (
                      let ap2 = 0;
                      ap2 <
                      this.orderProducts[i].productVariationDtoList[j]
                        .addOnProductGroup?.productDtoList.length;
                      ap2++
                    ) {
                      if (
                        this.orderProducts[i].productVariationDtoList[j]
                          .addOnProductGroup?.productDtoList[ap2].unitsInOrder !=
                          null &&
                        this.orderProducts[i].productVariationDtoList[j]
                          .addOnProductGroup?.productDtoList[ap2].unitsInOrder > 0
                      ) {
                        productNote =
                          productNote +
                          this.orderProducts[i].productVariationDtoList[j]
                            .addOnProductGroup?.productDtoList[ap2].name +
                          " Unit:" +
                          this.orderProducts[i].productVariationDtoList[j]
                            .addOnProductGroup?.productDtoList[ap2].unitsInOrder +
                          ".";
      
                        this.orderProductSelected = new OrderProduct();
                        this.orderProductSelected =
                          this.orderProducts[i].productVariationDtoList[
                            j
                          ].addOnProductGroup?.productDtoList[ap2];
      
                        this.orderProductSelected.extraProductGroupId = null;
                        this.orderProductSelected.toppingProductGroupId =
                          this.orderProducts[i].productVariationDtoList[
                            j
                          ].addOnProductGroup.id;
      
                        this.orderSelectedProducts.push(this.orderProductSelected);
                      }
                    }
      
                    this.orderProductSelected = new OrderProduct();
                    this.orderProductSelected =
                      this.orderProducts[i].productVariationDtoList[j];
                    this.orderProductSelected.notes = productNote;
                    this.orderProductSelected.extraProductGroupId = null;
                    this.orderProductSelected.toppingProductGroupId = null;
      
                    this.orderSelectedProducts.push(this.orderProductSelected);
                  } else {
                    this.orderProductSelected = new OrderProduct();
                    this.orderProductSelected =
                      this.orderProducts[i].productVariationDtoList[j];
                    this.orderProductSelected.extraProductGroupId = null;
                    this.orderProductSelected.toppingProductGroupId = null;
      
                    this.productVariationSelected.push(this.orderProductSelected);
                  }
      
                  if (
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraProductGroup != undefined &&
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraProductGroup != null &&
                    this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                      .productDtoList != undefined &&
                    this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                      .productDtoList != null &&
                    this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                      .productDtoList.length > 0
                  ) {
                    // variation for extra
                    for (
                      let ep2 = 0;
                      ep2 <
                      this.orderProducts[i].productVariationDtoList[j]
                        .extraProductGroup?.productDtoList.length;
                      ep2++
                    ) {
                      if (
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraProductGroup?.productDtoList[ep2].unitsInOrder !=
                          null &&
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraProductGroup?.productDtoList[ep2].unitsInOrder > 0
                      ) {
                        this.orderProductSelected = new OrderProduct();
                        this.orderProductSelected =
                          this.orderProducts[i].productVariationDtoList[
                            j
                          ].extraProductGroup?.productDtoList[ep2];
      
                        this.orderProductSelected.extraProductGroupId =
                          this.orderProducts[i].productVariationDtoList[
                            j
                          ].extraProductGroup.id;
                        this.orderProductSelected.toppingProductGroupId = null;
      
                        this.orderSelectedProducts.push(this.orderProductSelected);
                      }
                    }
                  }
      
                  if (
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraUnitInOrder != null &&
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraUnitInOrder != undefined &&
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraUnitInOrder > 0
                  ) {
                    this.productVariationSelected.push(
                      this.getVariationByExtraUnitInOrder(
                        this.orderProducts[i].productVariationDtoList[j]
                      )
                    );
                    //this.orderProducts[i].productVariationDtoList[j].extraUnitInOrder = undefined;
                  }
                // }
              }
              
              if (this.productVariationSelected.length > 0) {
                this.orderProducts[i].productVariationDtoList =
                  this.productVariationSelected;
                this.orderSelectedProducts.push(this.orderProducts[i]);
              }
            } else if (
              this.orderProducts[i].unitsInOrder != undefined &&
              this.orderProducts[i].unitsInOrder != null &&
              this.orderProducts[i].unitsInOrder > 0
            ) {
              if (
                this.orderProducts[i].addOnProductGroup != undefined &&
                this.orderProducts[i].addOnProductGroup != null &&
                this.orderProducts[i].addOnProductGroup?.productDtoList != null &&
                this.orderProducts[i].addOnProductGroup?.productDtoList != undefined &&
                this.orderProducts[i].addOnProductGroup?.productDtoList.length > 0
              ) {
                // product topping
                let productNote = "";
                for (
                  let ap1 = 0;
                  ap1 < this.orderProducts[i].addOnProductGroup?.productDtoList.length;
                  ap1++
                ) {
                  if (
                    this.orderProducts[i].addOnProductGroup?.productDtoList[ap1]
                      .unitsInOrder != null &&
                    this.orderProducts[i].addOnProductGroup?.productDtoList[ap1]
                      .unitsInOrder > 0
                  ) {
                    productNote =
                      productNote +
                      this.orderProducts[i].addOnProductGroup?.productDtoList[ap1]
                        .name +
                      " Unit:" +
                      this.orderProducts[i].addOnProductGroup?.productDtoList[ap1]
                        .unitsInOrder +
                      ".";
      
                    this.orderProductSelected = new OrderProduct();
                    this.orderProductSelected =
                      this.orderProducts[i].addOnProductGroup?.productDtoList[ap1];
      
                    this.orderProductSelected.extraProductGroupId = null;
                    this.orderProductSelected.toppingProductGroupId =
                      this.orderProducts[i].addOnProductGroup.id;
      
                    this.orderSelectedProducts.push(this.orderProductSelected);
                  }
                }
                this.orderProductSelected = new OrderProduct();
                this.orderProductSelected = this.orderProducts[i];
                this.orderProductSelected.notes = productNote; //
                this.orderProductSelected.extraProductGroupId = null;
                this.orderProductSelected.toppingProductGroupId = null;
      
                this.orderSelectedProducts.push(this.orderProductSelected);
              } else {
                this.orderProductSelected = new OrderProduct();
                this.orderProductSelected = this.orderProducts[i];
                this.orderProductSelected.extraProductGroupId = null;
                this.orderProductSelected.toppingProductGroupId = null;
      
                this.orderSelectedProducts.push(this.orderProductSelected);
              }
      
              if (
                this.orderProducts[i].extraProductGroupDto != undefined &&
                this.orderProducts[i].extraProductGroupDto != null &&
                this.orderProducts[i].extraProductGroupDto.productDtoList != null &&
                this.orderProducts[i].extraProductGroupDto.productDtoList !=
                  undefined &&
                this.orderProducts[i].extraProductGroupDto.productDtoList.length > 0
              ) {
                // product extra
                for (
                  let ep1 = 0;
                  ep1 <
                  this.orderProducts[i].extraProductGroupDto.productDtoList.length;
                  ep1++
                ) {
                  if (
                    this.orderProducts[i].extraProductGroupDto.productDtoList[ep1]
                      .unitsInOrder != null &&
                    this.orderProducts[i].extraProductGroupDto.productDtoList[ep1]
                      .unitsInOrder > 0
                  ) {
                    this.orderProductSelected = new OrderProduct();
                    this.orderProductSelected =
                      this.orderProducts[i].extraProductGroupDto.productDtoList[ep1];
                    this.orderProductSelected.extraProductGroupId =
                      this.orderProducts[i].extraProductGroupDto.id;
                    this.orderProductSelected.toppingProductGroupId = null;
      
                    this.orderSelectedProducts.push(this.orderProductSelected);
                  }
                }
              }
              if (
                this.orderProducts[i].extraUnitInOrder != null &&
                this.orderProducts[i].extraUnitInOrder != undefined &&
                this.orderProducts[i].extraUnitInOrder > 0
              ) {
                this.orderSelectedProducts.push(
                  this.getProductByExtraUnitInOrder(this.orderProducts[i])
                );
                // this.orderProducts[i].extraUnitInOrder = undefined;
              }
            }
          }

        this.order.productDtoList = this.orderSelectedProducts;

        this.AvailableSLotBusinessServiceTypes = [];

        if (
            this.businessService.businessServiceTypes != null &&
            this.businessService.businessServiceTypes != undefined
        ) {
            for (
                let i = 0;
                i < this.businessService.businessServiceTypes.length;
                i++
            ) {
                if (
                    this.businessService.businessServiceTypes[i].slots !=
                    null &&
                    this.businessService.businessServiceTypes[i].slots !=
                    undefined &&
                    this.businessService.businessServiceTypes[i].slots.length >
                    0
                ) {
                    if (
                        this.businessService.businessServiceTypes[i]
                            .bookable === true
                    ) {
                        this.AvailableSLotBusinessServiceTypes.push(
                            this.businessService.businessServiceTypes[i]
                        );
                    }
                }
            }
        }

        this.requiredDateAndTimeCalculate();
        this.orderCurrentDate();
        this.isPaymentSection = true;
        // this.isDateAndTimePick = true;
        if (this.methodType === "QuickInDine") {
            this.order.modeOfPayment = "Cash";
            this.payment.status = "NotPaid";
        }
    }

    getVariationByExtraUnitInOrder(variation) {
        this.productVariation = new productVariationDtoList();
        this.productVariation.unitsInOrder = variation.extraUnitInOrder;
        this.productVariation.sellUnitPrice = variation.sellUnitPrice;
        this.productVariation.discountedPrice = variation.discountedPrice;
        this.productVariation.id = variation.id;
        this.productVariation.buyUnitPrice = variation.buyUnitPrice;
        this.productVariation.code = variation.code;
        this.productVariation.productId = variation.productId;
        this.productVariation.id = variation.id;
        this.productVariation.buyUnitPrice = variation.buyUnitPrice;
        this.productVariation.name = variation.name;
        this.productVariation.quantityVariation = variation.quantityVariation;
        this.productVariation.maintainStock = variation.maintainStock;
        this.productVariation.factorToProduct = variation.factorToProduct;
        this.productVariation.inventoryId = variation.inventoryId;
        this.productVariation.recipeId = variation.recipeId;
        this.productVariation.status = "Available";
    
        if (
          this.productVariation.discountedPrice !== null &&
          this.productVariation.discountedPrice !== 0
        ) {
          this.productVariation.totalPrice =
            this.productVariation.discountedPrice *
            this.productVariation.unitsInOrder;
        } else {
          this.productVariation.totalPrice =
            this.productVariation.sellUnitPrice *
            this.productVariation.unitsInOrder;
        }
    
        return this.productVariation;
      }

      getProductByExtraUnitInOrder(orderProducts) {
        this.orderProduct = new OrderProduct();
    
        this.orderProduct.id = orderProducts.id;
        this.orderProduct.description = orderProducts.description;
        this.orderProduct.name = orderProducts.name;
        this.orderProduct.notes = orderProducts.notes;
        this.orderProduct.productCode = orderProducts.productCode;
        this.orderProduct.businessServiceId = orderProducts.businessServiceId;
        this.orderProduct.productGroupName = orderProducts.productGroupName;
        this.orderProduct.unitsInOrder = orderProducts.extraUnitInOrder;
        this.orderProduct.buyUnitPrice = orderProducts.buyUnitPrice;
        this.orderProduct.category = orderProducts.category;
        this.orderProduct.discountedPrice = orderProducts.discountedPrice;
        this.orderProduct.productGroupId = orderProducts.productGroupId;
        this.orderProduct.shortDescription = orderProducts.shortDescription;
        this.orderProduct.productGroupName = orderProducts.productGroupName;
        this.orderProduct.groupName = orderProducts.groupName;
        this.orderProduct.sellUnitPrice = orderProducts.sellUnitPrice;
    
        if (orderProducts.discountedPrice !== null) {
          this.totalPrice =
            orderProducts.discountedPrice * orderProducts.extraUnitInOrder;
        } else {
          this.totalPrice =
            orderProducts.sellUnitPrice * orderProducts.extraUnitInOrder;
        }
    
        // this.orderProduct.unitsInOrder = this.quantity;
        this.orderProduct.totalPrice = this.totalPrice;
        this.orderProduct.status = "Available";
    
        return this.orderProduct;
      }
    discountEditButtonClick(percentage) {
        this.isSelectionDisabled = true;
        this.isDiscountAmountChangeRq = false;
        this.isDiscountEditMode = true;

        this.discountPriceBeforeEdit = percentage;
    }

    onDiscountPercentageChange(): void {
        if (this.discountPercentage > this.maxOrderDiscountPercentage) {
            this.isMaxError = true;
            // this.discountPercentage = this.maxOrderDiscountPercentage;
        } else {
            this.isMaxError = false;
        }
        this.calculatePrice(); 
    }

    discountButtonClick() {
        if (this.maxOrderDiscountPercentage < this.discountPercentage)
            {
                this.isMaxError = true;
            } else
            {
                this.isMaxError = false;
                this.order.discountPercentage = this.discountPercentage;
        this.isSelectionDisabled = true;
        this.isDiscountAmountChangeRq = true;
        this.isDiscountEditMode = false;
        this.isDataChanged = true;
            }
    }

    discountButtonClosed() {
        if (this.isDataChanged === false) {
            this.isSelectionDisabled = false;
        }

        this.isDiscountAmountChangeRq = true;
        this.isDiscountEditMode = false;
        this.discountPercentage = this.discountPriceBeforeEdit;
        this.order.discountPercentage = this.discountPercentage;
        this.calculatePrice();
    }



    onNewOrder() {
        this.isOderDetailsPlace = false;
        this.orderProducts = [];
        this.productGroup = new ProductGroup();
        this.totalQuantity = 0;
        this.selectedIndex = undefined;
        this.methodType = undefined;
        this.resourceSelected = [];
        this.locationNameSelected = [];
        //this.isDateAndTimePick = false;

        if (
            this.token.getBusinessProperties() != null &&
            this.token.getBusinessProperties() != undefined
        ) {
            this.propertiesDto = this.token.getBusinessProperties();
            this.businessServiceSetup();
        } else {
            this.getAllBusinessService(String(this.property.id));
        }
        //this.changeSelection();

        this.order.modeOfPayment = "Cash";
        this.payment.status = "NotPaid";
    }

    isAvailableStock(status: string) {
        if (
            status === undefined ||
            status === null ||
            status === this.Available_Status
        ) {
            return true;
        } else {
            return false;
        }
    }

    isItemOutOfStock(outOfStock: boolean) {
        if (
            outOfStock != undefined &&
            outOfStock != null &&
            outOfStock === true
        ) {
            return true;
        } else {
            return false;
        }
    }
    onShiftProductVariation( product: any,p: number,productGroup: any,businessServiceId: number,i: number,variation: any,v: number,shiftVariation:any){
        const isChecked = shiftVariation.detail.checked;
        
        this.orderProductSelectedToShift = new OrderProduct();
        this.orderProductSelectedToShift = product;
        this.orderProductSelectedToShift.productGroupName = productGroup.name;
        this.orderProductSelectedToShift.businessServiceId = businessServiceId;
        this.productVariation = new productVariationDtoList();
        this.productVariation = variation;
    
        if(variation.discountInPercentage == null){
          this.productVariation.discountedPrice = null;
        }
    
        if (
          variation.unitsInOrder != undefined ||
          variation.unitsInOrder != null
        ) {
          this.productVariation.unitsInOrder = variation.unitsInOrder;
    
          if (
            this.productVariation.discountedPrice !== null &&
            this.productVariation.discountedPrice !== 0
          ) {
            this.productVariation.totalPrice =
              this.productVariation.discountedPrice *
              this.productVariation.unitsInOrder;
          } else {
            this.productVariation.totalPrice =
              this.productVariation.sellUnitPrice *
              this.productVariation.unitsInOrder;
          }
          // this.productVariation.totalPrice = this.productVariation.sellUnitPrice * this.productVariation.unitsInOrder;
        } else {
          this.productVariation.unitsInOrder = 1;
          if (
            this.productVariation.discountedPrice !== null &&
            this.productVariation.discountedPrice !== 0
          ) {
            this.productVariation.totalPrice =
              this.productVariation.discountedPrice *
              this.productVariation.unitsInOrder;
          } else {
            this.productVariation.totalPrice =
              this.productVariation.sellUnitPrice *
              this.productVariation.unitsInOrder;
          }
        }
       
        this.productVariations = [];
    
        this.productVariations = this.orderProductSelectedToShift.productVariationDtoList;
    
        this.productVariations[v] = this.productVariation;
        this.productVariations[v].shiftVariation = isChecked;
        this.orderProductSelectedToShift.shiftVariation = true;

        this.orderProductSelectedToShift.productVariationDtoList = this.productVariations;
        this.orderProductSelectedToShift.variationDtoList = this.productVariations;
        this.orderProductSelectedToShift.nonGstItem = productGroup.nonGstItem;
       // Check if all variations have isShiftVariation set to false
    const allShiftVariationsFalse = this.orderProductSelectedToShift.productVariationDtoList.every(
      (variation) => !variation.shiftVariation
    );
    
    if (allShiftVariationsFalse) {
      // Remove the product if it exists in the list
      const index: number = this.orderProductSelectedToShiftList.indexOf(this.orderProductSelectedToShift);
      if (index > -1) {
        this.orderProductSelectedToShiftList.splice(index, 1);
      }
    } else {
      // Add the product to the list if it doesn't already exist
      if (this.orderProductSelectedToShiftList.indexOf(this.orderProductSelectedToShift) === -1) {
        this.orderProductSelectedToShiftList.push(this.orderProductSelectedToShift);
      }
    }
        
      }
     
      onShiftProduct( product: any,p: number,productGroup: any,businessServiceId: number,i: number){
   
        this.orderProductSelectedToShift = new OrderProduct();
        this.orderProductSelectedToShift = product;
        this.orderProductSelectedToShift.businessServiceId = businessServiceId;
        this.orderProductSelectedToShift.productGroupName = productGroup.name;
        if (
          product.unitsInOrder != undefined &&
          product.unitsInOrder != null &&
          product.unitsInOrder > 0
        ) {
            this.orderProductSelectedToShift.unitsInOrder = product.unitsInOrder;
        } 
        if (product.discountedPrice !== null) {
          this.totalPrice = product.discountedPrice * product.unitsInOrder;
        } else {
          this.totalPrice = product.sellUnitPrice * product.unitsInOrder;
        }
  
        this.orderProductSelectedToShift.totalPrice = this.totalPrice;
        this.orderProductSelectedToShift.nonGstItem = productGroup.nonGstItem;
        if (this.orderProductSelectedToShiftList.indexOf(this.orderProductSelectedToShift) > -1) {
          const index: number = this.orderProductSelectedToShiftList.indexOf(this.orderProductSelectedToShift);
          if (index !== -1) {
            this.orderProductSelectedToShiftList.splice(index, 1);
          }
        } else {
          this.orderProductSelectedToShiftList.push(this.orderProductSelectedToShift);
        }
        // console.log(" this.orderProductSelectedToShift"+JSON.stringify( this.orderProductSelectedToShift))
    }
  
  
    onListPage() {
        this.navCtrl.navigateBack("manage-order");
    }

    orderList() {
        this.onListPage();
    }

    orderDashboard() {
        this.navCtrl.navigateBack("order-dashboard");
    }

    async orderComplete(orderId) {
        const navigationExtras: NavigationExtras = {
            state: {
                order: this.order
            }
        };
        this.navCtrl.navigateForward(["kot-generate/" + orderId], navigationExtras);
    }

    menuAction() {
        this.menuCtrl.toggle();
    }

    async onMenu() {
        const actionSheet = await this.actionSheetController.create({
            header: "Switch Dashboard",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                {
                    text: "Order Management",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("manage-order");
                    },
                },
                {
                    text: "Order Dashboard",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("order-dashboard");
                    },
                },
            ],
        });
        await actionSheet.present();
    }
}
