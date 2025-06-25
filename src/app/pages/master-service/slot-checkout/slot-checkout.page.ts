import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
    ActionSheetController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { Address } from "src/app/model/address-checker/Address";
import { BusinessServiceTypes } from "src/app/model/business-service/businessServiceTypes";
import { CountryCode } from "src/app/model/countryCode";
import { CountryList } from "src/app/model/Customer/country";
import { ShipToAddress } from "src/app/model/Order/address";
import { Property } from "src/app/model/property/Property";
import { MobileWallet } from "src/app/model/wallet/mobileWallet";
import { PhoneNumberEXP } from "../../../app.component";
import { Customer } from "../../../model/Customer/customer";
import { Payment } from "../../../model/manage-booking/Payment/Payment";
import { BusinessService } from "../../../model/Reservation/businessServic";
import { ServiceCustomer } from "../../../model/Reservation/serviceCustomer";
import { Slot } from "../../../model/Reservation/slot";
import { SlotDate } from "../../../model/Reservation/SlotDate";
import { SlotReservation } from "../../../model/Reservation/slotReservation";
import { SlotTiming } from "../../../model/Reservation/SlotTiming";
import { DateService } from "../../../service/DateService/date-service.service";
import { Logger } from "../../../service/logger.service";
import { OrderService } from "../../../service/Order/order.service";
import { TokenStorage } from "../../../token.storage";

@Component({
    selector: "app-slot-checkout",
    templateUrl: "./slot-checkout.page.html",
    styleUrls: ["./slot-checkout.page.scss"],
})
export class SlotCheckoutPage implements OnInit {

    // client address
    cStreatNumber: FormControl = new FormControl();
    cStreatName: FormControl = new FormControl();
    cLocality: FormControl = new FormControl();
    cSuburb: FormControl = new FormControl();
    cCity: FormControl = new FormControl();
    cPostcode: FormControl = new FormControl();
    cState: FormControl = new FormControl();
    cCountry: FormControl = new FormControl();
    //
    slotDateLists: any[] = [];
    selectedIndex = 0;
    customers: ServiceCustomer[];
    customer: ServiceCustomer;
    // customer: ServiceCustomer;
    LengthOfPerson: number;
    submitLoader = false;

    bodyMessage: string;
    slotTimes: SlotTiming[];

    dateNotFound = false;

    isPerosnTabOpen = false;
    isPersonChangeDone = false;

    slotReservation: SlotReservation;
    copySlotReservation: SlotReservation;
    slotDate: SlotDate;
    slotDates: SlotDate[];
    slotTiming: SlotTiming;
    timing: SlotTiming;
    businessServices: BusinessService[];
    businessService: BusinessService;
    businessServiceType: BusinessServiceTypes;
    slot: Slot;
    slotFilterOb: Slot;
    loader = false;
    businessServiceIdValue: number;
    service: any;
    dateSelected: number;

    isServiceSelected = false;
    isDateFound = false;
    isDateSelected = false;
    isLocationSelected = false;
    isResourceSelected = false;

    serviceLoader = false;
    businessTypeNameValue: string;

    isSlotDataFound = false;

    payment: Payment;

    slotLocationLists: any[];
    slotResourceLists: any[];

    propertyId: number;

    isCustomercheck: boolean = false;

    onEmailCheckForm: FormGroup;
    onPhoneCheckForm: FormGroup;
    selecion: string = "Phone";

    CodeNumber: string;
    countryCode: CountryCode;
    customerDto: Customer;

    onClientAddressForm : FormGroup;
    onSubmitForm: FormGroup;

    clientAddress : ShipToAddress; 
    address: ShipToAddress;
    CountryArray: CountryList;

    orderDateUI: string;

    propertyAddress: Address;

    StreatNumber: FormControl = new FormControl();
    StreatName: FormControl = new FormControl();
    Locality: FormControl = new FormControl();

    Suburb: FormControl = new FormControl();
    City: FormControl = new FormControl();
    Postcode: FormControl = new FormControl();
    State: FormControl = new FormControl();
    Country: FormControl = new FormControl();

    Date: FormControl = new FormControl();
    BusinessService: FormControl = new FormControl();
    BusinessServiceType: FormControl = new FormControl();
    Location: FormControl = new FormControl();
    Resource: FormControl = new FormControl();
    LocationName: FormControl = new FormControl();
    ResourceName: FormControl = new FormControl();
    SlotName: FormControl = new FormControl();
    BookedNumber: FormControl = new FormControl();
    NoOfAvailable: FormControl = new FormControl();
    NoOfBooked: FormControl = new FormControl();
    NoOfPerson: FormControl = new FormControl();
    SpecialNotes : FormControl = new FormControl();
    AddressSelection: FormControl = new FormControl();
    // CompanyName: FormControl = new FormControl();
    PaymentMode: FormControl = new FormControl();
    Price: FormControl = new FormControl();

    onReservationForm: FormGroup;
    onCustomerForm: FormGroup;
    onCardBookForm: FormGroup;

    firstName: FormControl = new FormControl();
    lastName: FormControl = new FormControl();
    Email: FormControl = new FormControl();
    Mobile: FormControl = new FormControl();
    // Role: FormControl = new FormControl();

    isPersonalDetailCompleted = false;

    cardNumber: FormControl = new FormControl();
    name: FormControl = new FormControl();
    cvv: FormControl = new FormControl();
    expYear: FormControl = new FormControl();
    expMonth: FormControl = new FormControl();
    TransactionReferenceNumber: FormControl = new FormControl();

    WalletClientFN : FormControl = new FormControl();
    WalletClientLN : FormControl = new FormControl();
    WalletClientPhone : FormControl = new FormControl();
    WalletClientWP : FormControl = new FormControl();
    WalletURL : FormControl = new FormControl();

    isServiceOrder = false;
    timeId: number;

    isCustomerEditable = false;

    customerSelectedIndex = 0;
    isdashboardBooking = false;

    property: Property;
    isCustomerInfoViewOnly: boolean = false;
    isPhoneReadOnly: boolean = false;
    isEmailReadOnly: Boolean = false;
    isBusinessAddress: boolean = false;
    cuustomerAddressName: string;
    businessAdressName: string;
    serviceAddressType: any;
    provideBusinessAndCustomerAddress: boolean;
    isPaymentMethodDisabled: boolean =  false;
    mobileWallet: MobileWallet;
    isWalletAvailable: boolean;

    onWalletForm : FormGroup;

    constructor(
        private reservationService: OrderService,
        public token: TokenStorage,
        private navCtrl: NavController,
        private toastController: ToastController,
        private formBuilder: FormBuilder,
        private actionSheetController: ActionSheetController,
        private acRoute: ActivatedRoute,
        private orderService: OrderService,
        private dateService: DateService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.slot = new Slot();
        this.slotFilterOb = new Slot();
        this.slotTiming = new SlotTiming();
        this.timing = new SlotTiming();
        this.slotDate = new SlotDate();
        this.businessServiceType = new BusinessServiceTypes();
        this.slotReservation = new SlotReservation();
        this.customer = new ServiceCustomer();
        this.businessService = new BusinessService();
        this.payment = new Payment();
        this.customers = [];
        this.customerDto = new Customer();
        this.slotReservation = this.token.getSlotBookData();
        this.CountryArray = new CountryList();
        this.propertyAddress = new Address();
        this.address = new ShipToAddress();
        this.clientAddress = new ShipToAddress();
        this.propertyAddress = this.token.getProperty().address;
        this.countryCode = new CountryCode();
        this.property = new Property();
        this.mobileWallet = new MobileWallet();

        this.mobileWallet = this.token.getProperty().mobileWallet;
        if (this.mobileWallet != undefined && this.mobileWallet != null) {
            this.isWalletAvailable = true;
        } else {
            this.isWalletAvailable = false;
        }

        this.locationAddress();

        // this.getAllBusinessService(this.slotReservation.propertyId);
        Logger.log(
            "this.slotReservation ",
            JSON.stringify(this.slotReservation)
        );
        this.onPhoneCheckForm = this.formBuilder.group({
            countryCodeC: ["", Validators.compose([Validators.required])],
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

        this.onWalletForm = this.formBuilder.group({
            WalletClientFN: ["", Validators.compose([Validators.nullValidator])],
            WalletClientLN: ["", Validators.compose([Validators.nullValidator])],
            WalletClientPhone: ["", Validators.compose([Validators.nullValidator])],
            WalletClientWP: ["", Validators.compose([Validators.nullValidator])],
            WalletURL : ["", Validators.compose([Validators.nullValidator])],
            TransactionReferenceNumber: [
                "",
                Validators.compose([Validators.required]),
            ],
        });

        this.onClientAddressForm = this.formBuilder.group({
            cStreatNumber: ["", Validators.compose([Validators.nullValidator])],
            cStreatName: ["", Validators.compose([Validators.nullValidator])],
            cLocality: ["", Validators.compose([Validators.nullValidator])],
            cSuburb: ["", Validators.compose([Validators.required])],
            cCity: ["", Validators.compose([Validators.required])],
            cPostcode: ["", Validators.compose([Validators.nullValidator])],
            cState: ["", Validators.compose([Validators.required])],
            cCountry: ["", Validators.compose([Validators.required])],
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
            // 'DeliveryMethod': ['', Validators.compose([
            //     Validators.required
            // ])],
            StreatNumber: ["", Validators.compose([Validators.nullValidator])],
            StreatName: ["", Validators.compose([Validators.nullValidator])],
            Locality: ["", Validators.compose([Validators.nullValidator])],
            Suburb: ["", Validators.compose([Validators.required])],
            City: ["", Validators.compose([Validators.required])],
            Postcode: ["", Validators.compose([Validators.nullValidator])],
            State: ["", Validators.compose([Validators.required])],
            Country: ["", Validators.compose([Validators.required])],
            PaymentMethod: ["", Validators.compose([Validators.required])],
            SpecialNotes : ["", Validators.compose([Validators.nullValidator])],
            StatusPayment: ["", Validators.compose([Validators.required])],
            TransactionReferenceNumber : ["", Validators.compose([Validators.nullValidator])],
            AddressSelection: ["", Validators.compose([Validators.nullValidator])],
        });
        this.onReservationForm = this.formBuilder.group({
            Date: [
                "",
                Validators.compose([
                    Validators.nullValidator, // re
                ]),
            ],
            BusinessService: [
                "",
                Validators.compose([
                    Validators.nullValidator, // re
                ]),
            ],
            Price: ["", Validators.compose([Validators.nullValidator])],
            PaymentMode: ["", Validators.compose([Validators.required])],
            BusinessServiceType: [
                "",
                Validators.compose([
                    Validators.nullValidator, // re
                ]),
            ],
            Location: [
                "",
                Validators.compose([
                    Validators.nullValidator, // re
                ]),
            ],
            Resource: [
                "",
                Validators.compose([
                    Validators.nullValidator, // re
                ]),
            ],
            SlotName: [
                "",
                Validators.compose([
                    Validators.nullValidator, // re
                ]),
            ],
            LocationName: ["", Validators.compose([Validators.nullValidator])],
            ResourceName: ["", Validators.compose([Validators.nullValidator])],
            NoOfAvailable: ["", Validators.compose([Validators.nullValidator])],
            NoOfPerson: ["", Validators.compose([Validators.nullValidator])],
            NoOfBooked: ["", Validators.compose([Validators.nullValidator])],
            // 'CompanyName': ['', Validators.compose([
            // Validators.nullValidator,
            // ])]
        });

        this.onCustomerForm = this.formBuilder.group({
            firstName: ["", Validators.compose([Validators.required])],
            lastName: ["", Validators.compose([Validators.required])],
            Email: ["", Validators.compose([Validators.email])],
            Mobile: ["", Validators.compose([Validators.required])],
            // 'Role': ['', Validators.compose([
            //     Validators.nullValidator
            // ])],
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
    }

    ngOnInit() {
        this.property = this.token.getProperty();

        if (
            this.token.getSlotBookData() != undefined ||
            this.token.getSlotBookData() != null
        ) {
            this.slotReservation = this.token.getSlotBookData();

            //
            this.serviceAddressType = "Business";
            if (
                this.slotReservation.canChangeBusinessAddress == undefined ||
                this.slotReservation.canChangeBusinessAddress == true
            ) {
                this.isBusinessAddress = false;
            } else {
                this.isBusinessAddress = true;
            }

            Logger.log('this.isBusinessAddress '+ this.isBusinessAddress);

            if (
                this.slotReservation.provideBusinessAndCustomerAddress == undefined ||
                this.slotReservation.provideBusinessAndCustomerAddress == false
            ) {
                this.provideBusinessAndCustomerAddress = false;
            } else {
                this.provideBusinessAndCustomerAddress = true;
            }


            if (
                this.slotReservation.customerLocationName != undefined &&
                this.slotReservation.customerLocationName != null
            ) {
                this.cuustomerAddressName = this.slotReservation.customerLocationName +' Address';
            } else {
                this.cuustomerAddressName = "Customer Address";
            }

            if (
                this.slotReservation.businessLocationName != undefined &&
                this.slotReservation.businessLocationName != null
            ) {
                this.businessAdressName = this.slotReservation.businessLocationName +' Address';
            } else {
                this.businessAdressName = "Business Address";
            }

            //
            this.slotReservation.totalAmount = 0.0;
            this.slotReservation.beforeTaxAmount = 0.0;
            if (
                this.property.gstNumber == null ||
                this.property.gstNumber == undefined ||
                this.property.gstNumber == ""
              ) {
                for (const serviceTypes of this.slotReservation.businessServiceTypes) {
                  let tempSlotCount = 0;
                  for (const resource of serviceTypes.slots[0].resourceList) {
                    for (const time of resource.bookedTimings) {
                      tempSlotCount += 1;
                    }
                  }
                  this.slotReservation.totalAmount +=
                    serviceTypes.slots[0].beforeTax * tempSlotCount;
                  this.slotReservation.beforeTaxAmount +=
                    serviceTypes.slots[0].beforeTax * tempSlotCount;
                }
                this.slotReservation.taxAmount =
                  this.slotReservation.totalAmount - this.slotReservation.beforeTaxAmount;
                this.slotReservation.afterTaxAmount = this.slotReservation.totalAmount;
              } else {
                for (const serviceTypes of this.slotReservation.businessServiceTypes) {
                  let tempSlotCount = 0;
                  for (const resource of serviceTypes.slots[0].resourceList) {
                    for (const time of resource.bookedTimings) {
                      tempSlotCount += 1;
                    }
                  }
                  this.slotReservation.totalAmount +=
                    serviceTypes.slots[0].price * tempSlotCount;
                  this.slotReservation.beforeTaxAmount +=
                    serviceTypes.slots[0].beforeTax * tempSlotCount;
                }
                this.slotReservation.taxAmount =
                  this.slotReservation.totalAmount - this.slotReservation.beforeTaxAmount;
                this.slotReservation.afterTaxAmount = this.slotReservation.totalAmount;
              }
            
           

            Logger.log(
                " this.SlotReservation : " +
                    JSON.stringify(this.slotReservation)
            );

            this.isdashboardBooking = true;

            // this.slotTiming = this.slotReservation.businessServiceTypes[0].slots[0].resourceList;
            // this.slotDate = this.slotReservation.businessServiceTypes.;
            // this.slot = this.slotReservation.slots;
            this.propertyId = this.slotReservation.propertyId;

            this.isServiceOrder = true;
            this.slotReservation.bookingStatus = "NEW";
            this.slotReservation.noOfPerson = 1;
            this.isPerosnTabOpen = true;

            //  this.customer = this.token.getCustomer();
            //   this.slotReservation.customerDtoList = [];
            //   this.slotReservation.customerDtoList.push(this.customer);

            // this.slotReservation.businessServiceTypes =   this.slot.businessServiceTypeId;

            // this.slotTimes = [];
            // this.slotTimes.push(this.slotTiming);
            // this.timeId = this.slotTiming.id;
            // this.isResourceSelected = true;

            // this.slotDateLists.push(this.slotDate.date);
            // this.slotReservation.date = this.slotDate.date;

            // this.slotReservation.locationName = this.slotDate.location.locationName;
            // this.slotLocationLists = [];
            // this.slotLocationLists.push(this.slotReservation.locationName);
            // this.isDateSelected = true;

            // this.slotResourceLists = [];
            // this.slotReservation.resourceName = this.slotDate.resource.resourceName;
            // this.slotResourceLists.push(this.slotReservation.resourceName);
            // this.isLocationSelected = true;

            // this.slotReservation.locationName = this.slotDate.location.locationName;
            // this.slotReservation.resourceName =  this.slotDate.resource.resourceName;
            // this.slotReservation.businessTypeName = this.businessTypeNameValue;
            // this.slotReservation.slotId = this.slotDate.id;

            // this.slotReservation.fromTime = this.slotTiming.startTime;
            // this.slotReservation.toTime = this.slotTiming.finishTime;
            // this.slotReservation.totalAmount = this.slotTiming.slotPricingDto.afterTaxAmount;
            // this.slotReservation.beforeTaxAmount = this.slotTiming.slotPricingDto.beforeTaxAmount;
            // this.slotReservation.afterTaxAmount = this.slotTiming.slotPricingDto.afterTaxAmount;
            // this.slotReservation.taxAmount = this.slotTiming.slotPricingDto.taxAmount;
            // this.slotReservation.slotTimingId =  this.slotTiming.id;
            // this.slot.noOfBooked = this.slotTiming.slotAvailabilityDto.noOfBooked;
            // this.slot.noOfAvailable  = this.slotTiming.slotAvailabilityDto.noOfAvailable;

            this.isSlotDataFound = true;
            this.slotReservation.modeOfPayment = "Cash";
            this.payment.status = "NotPaid";
            this.changeDetectorRefs.detectChanges();

            // this.getAllBusinessService(this.slotReservation.propertyId);
        }
    }

    onSegmentChange()
    {
        if(this.slotReservation.modeOfPayment === 'BankTransfer' || this.slotReservation.modeOfPayment ==='Wallet'  || this.slotReservation.modeOfPayment ==='Card')
        {
            this.payment.status = "Paid";
            this.isPaymentMethodDisabled = true;
        }
        else
        {
            this.payment.status = "NotPaid";
            this.isPaymentMethodDisabled = false;
        }
    }

    getCustomerAddress()
    {
        this.clientAddress = new ShipToAddress();
        this.clientAddress.city = this.customerDto.address.city;
        this.clientAddress.country = this.customerDto.address.country;
        this.clientAddress.locality = this.customerDto.address.locality;
        this.clientAddress.postcode = this.customerDto.address.postcode;
        this.clientAddress.state = this.customerDto.address.state;
        this.clientAddress.streetName = this.customerDto.address.streetName;
        this.clientAddress.streetNumber = this.customerDto.address.streetNumber;
        this.clientAddress.suburb = this.customerDto.address.suburb;
        this.slotReservation.serviceAddress = this.clientAddress;
    }

    checkAddressSelection() {
        if (this.serviceAddressType === "Business") {
            Logger.log("this.property" + JSON.stringify(this.property));
            this.address = new ShipToAddress();
            this.address.city = this.property.address.city;
            this.address.country = this.property.address.country;
            this.address.locality = this.property.address.locality;
            this.address.postcode = this.property.address.postcode;
            this.address.state = this.property.address.state;
            this.address.streetName = this.property.address.streetName;
            this.address.streetNumber = this.property.address.streetNumber;
            this.address.suburb = this.property.address.suburb;
            this.slotReservation.serviceAddress = this.address;
        } else if (this.serviceAddressType === "Customer") {
            Logger.log("this.customer" + JSON.stringify(this.customerDto));
            this.address = new ShipToAddress();
            this.address.city = this.customerDto.address.city;
            this.address.country = this.customerDto.address.country;
            this.address.locality = this.customerDto.address.locality;
            this.address.postcode = this.customerDto.address.postcode;
            this.address.state = this.customerDto.address.state;
            this.address.streetName = this.customerDto.address.streetName;
            this.address.streetNumber = this.customerDto.address.streetNumber;
            this.address.suburb = this.customerDto.address.suburb;
            this.slotReservation.serviceAddress = this.address;
        }
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
    //   selectionMethod(event)
    //   {
    //     if (this.slotReservation.deliveryMethod === 'Home Delivery')
    //     {
    //         this.address = new ShipToAddress();
    //     }
    //     else if (this.slotReservation.deliveryMethod === 'Pick From Store')
    //     {
    //         this.address = new ShipToAddress();
    //         this.address.streetNumber = this.propertyAddress.streetNumber;
    //         this.address.streetName = this.propertyAddress.streetName;
    //         this.address.suburb = this.propertyAddress.suburb;
    //         this.address.city = this.propertyAddress.city;
    //         this.address.country = this.propertyAddress.country;
    //         this.address.postcode = this.propertyAddress.postcode;
    //         this.address.state = this.propertyAddress.state;
    //         this.address.locality = this.propertyAddress.locality;
    //     }
    //   }
    selection(event) {
        this.slotReservation.email = undefined;
        this.slotReservation.mobile = undefined;
    }
    onSetMobile() {
        if (this.CodeNumber != undefined) {
            this.slotReservation.mobile = this.CodeNumber;
        }
    }

    countryCodePicker(event) {
        if (this.CodeNumber != undefined) {
            Logger.log(this.CodeNumber);
            this.slotReservation.mobile = this.CodeNumber;
        }
    }
    checkUser() {
        this.customerLookup();
    }
    customerLookup() {
        this.loader = true;

        if (this.selecion === "Email") {
            this.orderService
                .getCustomerDetailsByEmail(this.slotReservation.email)
                .subscribe(
                    (data) => {
                        Logger.log("Get customer " + JSON.stringify(data.body));
                        this.slotReservation.customerDtoList = [];

                        this.customerDto.id = data.body.id;
                        this.customerDto.firstName = data.body.firstName;
                        this.customerDto.lastName = data.body.lastName;
                        this.customerDto.mobile = data.body.mobile;
                        this.customerDto.email = data.body.email;
                        this.customerDto.address = data.body.address;
                        this.slotReservation.firstName = data.body.firstName;
                        this.slotReservation.lastName = data.body.lastName;
                        this.slotReservation.mobile = data.body.mobile;
                        this.slotReservation.customerDtoList.push(
                            this.customerDto
                        );

                        this.isCustomerInfoViewOnly = true;
                        this.isCustomercheck = true;
                        this.loader = false;

                        
                        if(this.provideBusinessAndCustomerAddress === true)
                        {
                            this.getCustomerAddress();
                        }
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
            this.orderService
                .getCustomerDetailsByMobile(this.slotReservation.mobile)
                .subscribe(
                    (data) => {
                        Logger.log("Get customer " + JSON.stringify(data.body));
                        this.slotReservation.customerDtoList = [];
                        this.customerDto.id = data.body.id;
                        this.customerDto.firstName = data.body.firstName;
                        this.customerDto.lastName = data.body.lastName;
                        this.customerDto.mobile = data.body.mobile;
                        this.customerDto.email = data.body.email;
                        this.customerDto.address = data.body.address;
                        this.slotReservation.firstName = data.body.firstName;
                        this.slotReservation.lastName = data.body.lastName;
                        this.slotReservation.email = data.body.email;
                        this.slotReservation.customerDtoList.push(
                            this.customerDto
                        );
                        this.isCustomerInfoViewOnly = true;
                        this.isCustomercheck = true;
                        this.loader = false;

                        if(this.provideBusinessAndCustomerAddress === true)
                        {
                            this.getCustomerAddress();
                        }
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
    getAllBusinessService(propertyId) {
        this.serviceLoader = true;
        // Logger.log('all service');
        this.reservationService
            .getAllBusinessServiceByPropertyId(propertyId)
            .subscribe(
                (data) => {
                    this.businessServices = data.body;
                    this.serviceLoader = false;

                    if (this.isServiceOrder === true) {
                        this.businessService = this.businessServices.find(
                            (service) =>
                                service.id === this.slot.businessServiceId
                        );

                        this.isServiceSelected = true;
                        this.changeDetectorRefs.detectChanges();

                        this.businessServiceType = this.businessService.businessServiceTypes.find(
                            (service) =>
                                service.id === this.slot.businessServiceTypeId
                        );

                        this.businessTypeNameValue = this.businessServiceType.name;
                    }

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.serviceLoader = false;
                    // Logger.log('all service' + JSON.stringify(error));
                }
            );
    }

    setService(event) {
        this.businessService = event;
        this.slot.businessServiceId = this.businessService.id;
        this.isServiceSelected = true;

        this.businessServiceIdValue = this.businessService.id;
    }

    setServiceType(event) {
        if (this.isDateFound === true) {
            this.slotReservation = new SlotReservation();
        }

        this.businessServiceType = event;
        this.businessTypeNameValue = this.businessServiceType.name;
        this.slotReservation.businessTypeId = this.businessServiceType.id;
        this.slot.businessServiceTypeId = this.businessServiceType.id;
        this.getDateList();
    }

    setLocation(locationName) {
        if (this.isLocationSelected === true) {
            this.slotReservation.resourceName = null;
            this.slotTiming = new SlotTiming();
        }

        this.applySlotLocationFilter(
            this.slotReservation.date,
            this.slotReservation.locationName
        );

        for (let i = 0; i < this.slotFilterOb.slotDateList.length; i++) {
            if (
                this.slotResourceLists.indexOf(
                    this.slotFilterOb.slotDateList[i].resource.resourceName
                ) == -1
            ) {
                this.slotResourceLists.push(
                    this.slotFilterOb.slotDateList[i].resource.resourceName
                );
            }
        }

        this.isLocationSelected = true;
    }

    applySlotLocationFilter(dateString: string, locationName: string) {
        this.slotFilterOb.slotDateList = this.slot.slotDateList.filter(
            (item) => {
                const searchResult =
                    item.location.locationName != null &&
                    item.location.locationName
                        .toLowerCase()
                        .trim()
                        .indexOf(locationName.toLowerCase().trim()) > -1 &&
                    item.date != null &&
                    item.date.toString().indexOf(dateString) > -1;
                return searchResult;
            }
        );
    }

    setResource(resourceName) {
        this.slotTimes = [];

        // this.isSlotDataFound = false;

        if (this.isResourceSelected === true) {
            this.slotTiming = new SlotTiming();
        }

        Logger.log(
            "this.slotReservation : " + JSON.stringify(this.slotReservation)
        );

        this.applySlotFilter(
            this.slotReservation.date,
            this.slotReservation.resourceName,
            this.slotReservation.locationName
        );

        for (let i = 0; i < this.slotFilterOb.slotDateList.length; i++) {
            this.slotTimes = this.slotFilterOb.slotDateList[i].slotTimingDtos;
        }

        this.isResourceSelected = true;
    }

    applySlotFilter(
        dateString: string,
        ResourceName: string,
        locationName: string
    ) {
        this.slotFilterOb.slotDateList = this.slot.slotDateList.filter(
            (item) => {
                const searchResult =
                    item.location.locationName != null &&
                    item.location.locationName
                        .toLowerCase()
                        .trim()
                        .indexOf(locationName.toLowerCase().trim()) > -1 &&
                    item.resource.resourceName != null &&
                    item.resource.resourceName
                        .toLowerCase()
                        .trim()
                        .indexOf(ResourceName.toLowerCase().trim()) > -1 &&
                    item.date != null &&
                    item.date.toString().indexOf(dateString) > -1;
                return searchResult;
            }
        );
    }

    getDate(date) {
        this.slotResourceLists = [];
        this.slotLocationLists = [];
        // this.isDateSelected = false;
        // this.isLocationSelected = false;
        // this.isResourceSelected = false;
        // this.isSlotDataFound = false;

        // this.slotReservation.locationName = undefined;

        if (this.isDateSelected === true) {
            this.slotReservation.resourceName = null;
            this.slotReservation.locationName = null;
            this.slotTiming = new SlotTiming();
        }

        this.slotFilterOb = this.slot;
        this.applySlotDateFilter(this.slotReservation.date);

        for (let i = 0; i < this.slotFilterOb.slotDateList.length; i++) {
            if (
                this.slotLocationLists.indexOf(
                    this.slotFilterOb.slotDateList[i].location.locationName
                ) == -1
            ) {
                this.slotLocationLists.push(
                    this.slotFilterOb.slotDateList[i].location.locationName
                );
            }
        }

        this.isDateSelected = true;
    }

    applySlotDateFilter(dateString: string) {
        this.slotFilterOb.slotDateList = this.slot.slotDateList.filter(
            (item) => {
                const searchResult =
                    item.date != null &&
                    item.date.toString().indexOf(dateString.toString().trim()) >
                        -1;
                return searchResult;
            }
        );
    }

    setSlotTime(event) {
        this.slotTiming = this.slotTimes.find((time) => time.id === event);

        for (let i = 0; i < this.slotDates.length; i++) {
            if (this.slotReservation.date === this.slotDates[i].date) {
                for (
                    let j = 0;
                    j < this.slotDates[i].slotTimingDtos.length;
                    j++
                ) {
                    if (
                        this.slotDates[i].slotTimingDtos[j].id ===
                        this.slotTiming.id
                    ) {
                        this.slotDate = this.slotDates[i];

                        this.slotReservation.locationName = this.slotDate.location.locationName;
                        this.slotReservation.resourceName = this.slotDate.resource.resourceName;
                        this.slotReservation.businessTypeName = this.businessTypeNameValue;
                        this.slotReservation.slotId = this.slotDate.id;

                        this.slotReservation.fromTime = this.slotTiming.startTime;
                        this.slotReservation.toTime = this.slotTiming.finishTime;
                        this.slotReservation.totalAmount = this.slotTiming.slotPricingDto.afterTaxAmount;
                        this.slotReservation.beforeTaxAmount = this.slotTiming.slotPricingDto.beforeTaxAmount;
                        this.slotReservation.afterTaxAmount = this.slotTiming.slotPricingDto.afterTaxAmount;
                        this.slotReservation.taxAmount = this.slotTiming.slotPricingDto.taxAmount;
                        this.slotReservation.slotTimingId = this.slotTiming.id;

                        this.slot.noOfBooked = this.slotTiming.slotAvailabilityDto.noOfBooked;
                        this.slot.noOfAvailable = this.slotTiming.slotAvailabilityDto.noOfAvailable;

                        this.LengthOfPerson = String(
                            this.slot.noOfAvailable
                        ).length;

                        this.isdashboardBooking = true;
                        this.isSlotDataFound = true;
                    }
                }
            }
        }
    }

    onPersonChange(event) {
        if (this.slot.noOfAvailable < this.slotReservation.noOfPerson) {
            this.slotReservation.noOfPerson = this.slot.noOfAvailable;

            //   this.NoOfPerson.reset();
            this.NoOfPerson.setValue(this.slot.noOfAvailable);

            Logger.log(
                "  this.slotReservation.noOfPerson 3" +
                    this.slotReservation.noOfPerson
            );
            this.changeDetectorRefs.detectChanges();
        }

        if (this.slotReservation.noOfPerson > 0) {
            this.isPerosnTabOpen = true;
        } else {
            this.isPerosnTabOpen = false;
        }

        if (this.slotReservation.noOfPerson === this.customers.length) {
            this.isPersonalDetailCompleted = true;

            // this.price.setValue( this.slotReservation.afterTaxAmount * this.slotReservation.noOfPerson);
        } else {
            this.isPersonalDetailCompleted = false;
            this.onCustomerForm.reset();
        }
    }

    async onMenu(customer: any, index: number) {
        const actionSheet = await this.actionSheetController.create({
            header: "Customer",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                {
                    text: "Delete",
                    handler: () => {
                        this.customers.splice(index, 1);

                        if (
                            this.slotReservation.noOfPerson ===
                            this.customers.length
                        ) {
                            this.isPersonalDetailCompleted = true;

                            // this.price.setValue( this.slotReservation.afterTaxAmount * this.slotReservation.noOfPerson);
                        } else {
                            this.isPersonalDetailCompleted = false;
                            this.onCustomerForm.reset();
                        }
                    },
                },
                {
                    text: "Edit",
                    handler: () => {
                        this.customer = customer;
                        this.isPersonalDetailCompleted = false;
                        this.isCustomerEditable = true;
                        this.customerSelectedIndex = index;
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    UpdateCustomer() {
        this.customers[this.customerSelectedIndex] = this.customer;
        //   this.customer = new Customer();
        this.isPersonalDetailCompleted = true;
        this.isCustomerEditable = false;

        if (this.slotReservation.noOfPerson === this.customers.length) {
            this.isPersonalDetailCompleted = true;

            // this.price.setValue( this.slotReservation.afterTaxAmount * this.slotReservation.noOfPerson);
        } else {
            this.isPersonalDetailCompleted = false;
            this.onCustomerForm.reset();
        }
    }

    AddCustomer() {
        // this.isPersonChangeDone = true;

        this.customer.propertyId = this.propertyId;
        this.customers.push(this.customer);
        // this.customer = new Customer();

        if (this.slotReservation.noOfPerson === this.customers.length) {
            this.isPersonalDetailCompleted = true;

            // this.price.setValue( this.slotReservation.afterTaxAmount * this.slotReservation.noOfPerson);
        } else {
            this.isPersonalDetailCompleted = false;
            this.onCustomerForm.reset();
        }
    }

    getDateList() {
        this.loader = true;
        // this.reservationService.checkSlotAvailability(this.slot).subscribe(data => {
        //   this.slot = data.body;
        // //   Logger.log('this.slot : '+JSON.stringify(this.slot));
        //   this.slotDates = this.slot.slotDateList;

        //   if (this.slot.slotDateList.length > 0)
        //   {

        //     this.dateNotFound = false;
        //     this.slot.businessServiceTypeId = this.businessServiceType.id;
        //     this.slot.businessServiceId =  this. businessServiceIdValue;

        //     for (let i = 0; i < this.slot.slotDateList.length ; i++) {
        //       if (this.slotDateLists.indexOf(this.slot.slotDateList[i].date) == -1) {
        //         this.slotDateLists.push(this.slot.slotDateList[i].date);
        //       }
        //     }
        //     this.slotDateLists.sort((a, b) => a - b);

        //     this.isDateFound = true;
        //     this.loader = false;

        //     this.changeDetectorRefs.detectChanges();
        //   } else {
        //     this.loader = false;
        //     this.dateNotFound = true;
        //   }

        // }, error => {
        // //  Logger.log(JSON.stringify(error));
        //   this.loader = false;
        // });
    }

    Book() {
        this.loader = true;
        this.submitLoader = true;
        this.slotReservation.propertyId = this.propertyId;
        // this.slotReservation.beforeTaxAmount = this.slotReservation.beforeTaxAmount * this.slotReservation.noOfPerson;
        // this.slotReservation.afterTaxAmount = this.slotReservation.afterTaxAmount * this.slotReservation.noOfPerson ;
        // this.slotReservation.taxAmount = this.slotReservation.taxAmount * this.slotReservation.noOfPerson;
        this.slotReservation.firstName = this.customer.firstName;
        this.slotReservation.lastName = this.customer.lastName;
        this.slotReservation.email = this.customer.email;
        this.slotReservation.mobile = this.customer.mobile;

        this.payment.amount = this.slotReservation.afterTaxAmount;
        this.payment.netReceivableAmount = this.slotReservation.beforeTaxAmount;
        this.payment.transactionAmount = this.slotReservation.afterTaxAmount;
        this.payment.transactionChargeAmount = this.slotReservation.afterTaxAmount;
        this.payment.currency = this.property.localCurrency;
        this.payment.status = "NotPaid";
        this.payment.propertyId = this.propertyId;
        this.payment.email = this.token.getProperty().email;
        this.payment.businessEmail = this.token.getProperty().email;
        this.payment.paymentMode = this.slotReservation.modeOfPayment;
        this.payment.description = `Accommodation for ${this.slotReservation.resourceName} at ${this.slotReservation.locationName}`;
        this.payment.taxAmount = this.slotReservation.taxAmount;
        this.payment.deliveryChargeAmount = 0;

        this.savePayment(this.payment);
    }

    checkModeOfPayment() {
        this.submitLoader = false;
    }

    onBook() {
        this.submitLoader = true;
        // this.slotReservation.firstName = this.customer.firstName;
        // this.slotReservation.lastName = this.customer.lastName;
        // this.slotReservation.email = this.customer.email;
        // this.slotReservation.mobile = this.customer.mobile;
        // this.slotReservation.propertyId =  this.propertyId;
        // this.slotReservation.customerDtoList.push(this.customer);
        // this.slotReservation.beforeTaxAmount = this.slotReservation.beforeTaxAmount * this.slotReservation.noOfPerson;
        // this.slotReservation.afterTaxAmount = this.slotReservation.afterTaxAmount * this.slotReservation.noOfPerson ;
        // this.slotReservation.taxAmount = this.slotReservation.taxAmount * this.slotReservation.noOfPerson;

        Logger.log("reservation" + JSON.stringify(this.slotReservation));
        this.reservationService.book(this.slotReservation).subscribe(
            (data) => {
                Logger.log("data" + JSON.stringify(data.body));
                this.submitLoader = false;
                // this.onReservationForm.reset();
                this.navCtrl.navigateRoot("reservation-list");
                this.presentToast(
                    "Reservation successfully completed No#" +
                        data.body.businessReservationNumber
                );
                this.token.clearADDToSlotCart();
            },
            (error) => {
                //  Logger.log(JSON.stringify(error));
                this.submitLoader = false;
            }
        );
    }

    cardPayment() {
        this.payment.status = "Paid";
        this.getOrderDateAndTime();
        this.slotReservation.serviceAddress = this.address;
        // this.slotReservation.orderStatus = 'Submitted';

        this.payment.paymentMode = this.slotReservation.modeOfPayment;
        this.payment.firstName = this.slotReservation.firstName;
        this.payment.lastName = this.slotReservation.lastName;
        this.payment.netReceivableAmount = this.slotReservation.beforeTaxAmount;
        this.payment.transactionAmount = this.slotReservation.afterTaxAmount;
        this.payment.currency = this.property.localCurrency;
        this.payment.propertyId = this.slotReservation.propertyId;
        this.payment.amount = this.slotReservation.afterTaxAmount;
        this.payment.taxAmount = this.slotReservation.taxAmount;
        this.payment.deliveryChargeAmount = 0;

        this.chargeCreditCard();
    }
    //   chargeCreditCard(payment: Payment) {
    //     this.loader = true;
    //     (window as any).Stripe.card.createToken(
    //       {
    //         number: payment.cardNumber,
    //         exp_month: payment.expMonth,
    //         exp_year: payment.expYear,
    //         cvc: payment.cvv,
    //       },
    //       (status: number, response: any) => {
    //         if (status === 200) {
    //           const token = response.id;
    //           payment.token = token;

    //           this.payment.token = token;

    //           // Logger.log('Card info done' + JSON.stringify(this.payment));

    //           this.processPayment(this.payment);
    //         } else if (status === 402) {
    //           this.loader = false;

    //           this.bodyMessage = 'Wrong card information!' + ' Code: ' + status;
    //           this.presentToast(this.bodyMessage);

    //         } else {
    //           this.loader = false;

    //           this.bodyMessage = 'Card Payment Faied!' + ' Code: ' + status;
    //           this.presentToast(this.bodyMessage);

    //         }
    //       }
    //     ),
    //       (error) => {
    //         this.loader = false;
    //       };
    //   }
    //   processPayment(payment: Payment) {
    //     this.loader = true;
    //     this.orderService.processPayment(payment)
    //       .subscribe(response => {
    //         if (response.status === 200) {
    //           this.payment = payment;

    //           if (this.payment.status === 'Paid') {
    //             this.presentToast('Payment processed successfully');

    //             this.savePayment(payment);
    //           } else {
    //             this.presentToast('ErroCode:' + payment.failureCode + 'and Error message :' + payment.failureMessage);
    //           }
    //         } else {
    //           this.loader = false;
    //         }

    //       });

    //   }
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
        this.slotReservation.date = this.getDateDBFormat(currentDate);
        // this.slotReservation. = this.getOrderTimeformatAMPM(new Date());
    }
    cashPayment() {
        this.getOrderDateAndTime();
        this.slotReservation.serviceAddress = this.address;
        // this.slotReservation.orderStatus = 'Submitted';

        this.payment.paymentMode = this.slotReservation.modeOfPayment;
        this.payment.firstName = this.slotReservation.firstName;
        this.payment.lastName = this.slotReservation.lastName;
        this.payment.netReceivableAmount = this.slotReservation.beforeTaxAmount;
        this.payment.transactionAmount = this.slotReservation.afterTaxAmount;
        this.payment.currency = this.property.localCurrency;
        this.payment.propertyId = this.slotReservation.propertyId;
        this.payment.amount = this.slotReservation.afterTaxAmount;
        this.payment.taxAmount = this.slotReservation.taxAmount;
        this.payment.deliveryChargeAmount = 0;

        Logger.log("1" + JSON.stringify(this.payment));
        this.savePayment(this.payment);
    }
    bankPayment() {
        this.getOrderDateAndTime();
        this.slotReservation.serviceAddress = this.address;
        // this.slotReservation.orderStatus = 'Submitted';

        this.payment.paymentMode = this.slotReservation.modeOfPayment;
        this.payment.firstName = this.slotReservation.firstName;
        this.payment.lastName = this.slotReservation.lastName;
        this.payment.netReceivableAmount = this.slotReservation.beforeTaxAmount;
        this.payment.transactionAmount = this.slotReservation.afterTaxAmount;
        this.payment.currency = this.property.localCurrency;
        this.payment.propertyId = this.slotReservation.propertyId;
        this.payment.amount = this.slotReservation.afterTaxAmount;
        this.payment.taxAmount = this.slotReservation.taxAmount;
        this.payment.deliveryChargeAmount = 0;

        Logger.log("1" + JSON.stringify(this.payment));
        this.savePayment(this.payment);
    }
    //   savePayment(payment: Payment) {
    //     this.loader = true;
    //     Logger.log('save payment 1' + JSON.stringify(payment));
    //     this.orderService.savePayment(payment)
    //       .subscribe(response => {
    //         if (response.status === 200) {
    //           this.payment = response.body;
    //           this.slotReservation.paymentId = this.payment.id;
    //           if (this.isbookingRequest === false)
    //           {
    //             this.isbookingRequest = true;
    //             this.book();
    //           }

    //         } else {
    //           this.loader = false;
    //         }
    //       });
    //   }

    CardSubMit() {
        this.submitLoader = true;
        this.chargeCreditCard();
    }

    chargeCreditCard() {
        this.loader = true;
        (window as any).Stripe.card.createToken(
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

                    this.payment.netReceivableAmount = this.slotReservation.beforeTaxAmount;
                    this.payment.transactionAmount = this.slotReservation.afterTaxAmount;
                    this.payment.status = "Paid";
                    this.payment.amount = this.slotReservation.afterTaxAmount;
                    this.payment.currency = this.property.localCurrency;
                    this.payment.propertyId = this.propertyId;
                    this.payment.email = this.token.getProperty().email;
                    this.payment.businessEmail = this.token.getProperty().email;
                    this.payment.paymentMode = this.slotReservation.modeOfPayment;
                    this.payment.description = `Payment for ${this.slotReservation.customerDtoList[0].firstName} ${this.slotReservation.customerDtoList[0].lastName} at ${this.slotReservation.businessName} #${this.slotReservation.propertyId}`;

                    Logger.log(JSON.stringify(this.payment));
                    this.processPayment(this.payment);
                } else if (status === 402) {
                    this.loader = false;

                    this.bodyMessage =
                        "Wrong card information!" + " Code: " + status;
                    this.presentToast(this.bodyMessage);
                } else {
                    this.loader = false;

                    this.bodyMessage =
                        "Card Payment Faied!" + " Code: " + status;
                    this.presentToast(this.bodyMessage);
                }
            }
        );
        this.loader = false;
    }

    processPayment(payment: Payment) {
        this.loader = true;
        this.reservationService
            .processPayment(payment)
            .subscribe((response) => {
                if (response.status === 200) {
                    this.onCardBookForm.reset();
                    this.payment = response.body;
                    this.slotReservation.propertyId = this.payment.id;
                    this.loader = false;
                    //   Logger.log( this.slotReservation.propertyId + `Payment Status:`+JSON.stringify(this.payment));
                    if (this.payment.status === "Paid") {
                        this.presentToast("Payment processed successfully");

                        this.savePayment(payment);
                    } else {
                        this.presentToast(
                            "ErroCode:" +
                                payment.failureCode +
                                "and Error message :" +
                                payment.failureMessage
                        );
                    }
                } else {
                    this.loader = false;
                    this.submitLoader = false;
                }
            });
    }

    savePayment(payment: Payment) {
        this.loader = true;
        payment.date = this.dateService.convertMillisecondsToYYYMMDDFormat(new Date().getTime());
        Logger.log("save payment" + JSON.stringify(payment));
        this.orderService.savePayment(payment).subscribe((response) => {
            if (response.status === 200) {
                this.payment = response.body;
                this.slotReservation.paymentId = this.payment.id;
                this.onBook();
            } else {
                this.loader = false;
                this.submitLoader = false;
            }
        });
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
}
