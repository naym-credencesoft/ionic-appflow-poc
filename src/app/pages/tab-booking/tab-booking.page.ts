import { ChangeDetectorRef, Component, OnInit, ViewRef } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import {
    LoadingController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { ExternalSiteList } from "src/app/model/Booking/externalSiteList";
import { PropertiesOnlineTravelAgencies } from "src/app/model/Booking/propertiesOTA";
import { CheckUserType } from "src/app/model/checkUserType";
import { OTAChannelPropertyDTO } from "src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO";
import { Property } from "src/app/model/property/Property";
import { TaxDetails } from "src/app/model/TaxDetail/TaxDetails";
import { PaymentService } from "src/app/service/payment/payment.service";
import { PropertyService } from "src/app/service/property/property.service";
import { Payment } from "../../model/manage-booking/Payment/Payment";
import { Room } from "../../model/room";
import { TranslateProvider } from "../../providers";
import { DateService } from "../../service/DateService/date-service.service";
import { Logger } from "../../service/logger.service";
import { BookingService } from "../../service/manage-booking/booking-service.service";
import { SplitTaxDTO } from "../booking/booking.page";
import { Plan } from "../booking/plan";
import { Booking } from "./../../model/manage-booking/Booking/Booking";
import { AuthService } from "./../../service/auth.service";
import { TokenStorage } from "./../../token.storage";
import { OTAPlan } from "src/app/model/otaPlan/otaPlan";
import { ReservationService } from "src/app/service/ReservationService/reservation-service.service";
import { BusinessService } from "src/app/model/Reservation/businessServic";
import { ApplicationUser } from 'src/app/model/user';

import { Router } from '@angular/router';
@Component({
    selector: "app-tab-booking",
    templateUrl: "./tab-booking.page.html",
    styleUrls: ["./tab-booking.page.scss"],
})
export class TabBookingPage implements OnInit {
    childrenno: number;
    onSaveTabForm: FormGroup;
    onAvailabilityTabForm: FormGroup;
    rooms: Room[];
    booking: Booking;
    payment: Payment;

    isAvailable: boolean = true;

    RoomType: FormControl = new FormControl();
    bookingToDate: FormControl = new FormControl();
    PlanControll: FormControl = new FormControl();
    bookingFromDate: FormControl = new FormControl();
    externalSite: FormControl = new FormControl();
    externalBookingID: FormControl = new FormControl();
    notes: FormControl = new FormControl();
    ExtraPersonChange: FormControl = new FormControl();
    ExtraChildChange: FormControl = new FormControl();

    plan: Plan;
    plans: Plan[];
    plans2: Plan[];
    loader: boolean;

    externalSiteList: ExternalSiteList;
    otaChannelId: number;
    propertydetails: OTAChannelPropertyDTO;
    propertyOTADetails: PropertiesOnlineTravelAgencies;
    propertyOTA: PropertiesOnlineTravelAgencies[];
    roomRatePlanName: string;
    bookingRoomId: number;
    differenceDay: number;
    totalPlanAmount: any;
    roomOnlyPricePerNight: number;
    bookingRoomPrice: number;
    isDataChangedTotalPrice: boolean = false;

    isNetOrPayableAmountChange: boolean = false;

    totalSplitTax: SplitTaxDTO[] = [];
    propertyTaxDetails: TaxDetails[];
    taxDetailsSelected: TaxDetails[] = [];
    advancePaidAmount: number = 0;
    afterDiscountAmount: number;

    isAdvancedAmountChange: boolean = false;
    isDisabledBookingPaymentStatus: boolean = false;

    bookingExtraChildCharge: number = -1;
    bookingExtraPersonCharge: number = -1;
    PlanRoomPrice: number;
    currency: any;
    property : Property;

    role: any[];
    roleArray: any;
    checkUserType: CheckUserType;

    isDiscountEditMode: boolean = false;
    isDiscountAmountChangeRq: boolean = true;
    discountPriceBeforeEdit: any;
    isDataChanged: boolean = false;
    isSelectionDisabled: boolean = false;
    isPriceEditMode: boolean = false;
    priceBeforeChanged: any;

    isPlanAmountChangeRq: boolean = true;
    isTotalPriceEditMode: boolean = false;
    isTotalPriceSelectionDisabled: boolean = false;
    taxBeforeChanged: number;
    payableAmountChange: any;
    tempTaxAmount: any;
    onlyTaxAmount: number = 0;

    isConveninceFeeChangeRq: boolean = false;
    isPaymentConveninceFee: boolean = false;
    isConvienceFeeEditMode: boolean = false;

    isBConveninceFeeChangeRq: boolean = false;
    isPaymentBConveninceFee: boolean = false;
    isBConvienceFeeEditMode: boolean = false;

    payments: Payment[] = [];
    paymentsFilter: Payment[] = [];

    isPlanAmountEditMode: boolean = false;

    isTCSFeeChangeRq: boolean = false;
    isPaymentTCSFee: boolean = false;
    isTCSEditMode: boolean = false;

    isTDSFeeChangeRq: boolean = false;
    isPaymentTDSFee: boolean = false;
    isTDSEditMode: boolean = false;
    planCodes: Plan[];
    otaPlans: OTAPlan[];
    isExtraPersonCharge: boolean = false;
    isExtraChildCharge: boolean = false;

    businessServices: BusinessService[] = [];
    businessService: BusinessService;
    userData: ApplicationUser;
    isEnquiryBooking: boolean;

    constructor(
        private bookingService: BookingService,
        private translate: TranslateProvider,
        private authService: AuthService,
        private navCtrl: NavController,
        private reservationService: ReservationService,
        public token: TokenStorage,
        private propertyService: PropertyService,
        private changeDetectorRefs: ChangeDetectorRef,
        private dateService: DateService,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private formBuilder: FormBuilder,
        private paymentService: PaymentService,
        private router: Router,
    ) {
        //   this.stripe.setPublishableKey('my_publishable_key');
        this.userData = new ApplicationUser();
        this.plan = new Plan();
        this.checkUserType = new CheckUserType();
        this.property = new Property();
        this.payment = new Payment();
        this.booking = new Booking();
        this.rooms = this.token.getRoomTypes();
        this.externalSiteList = new ExternalSiteList();
        this.propertydetails = new OTAChannelPropertyDTO();
        this.propertyOTADetails = new PropertiesOnlineTravelAgencies();
        this.businessService = new BusinessService();

        this.onAvailabilityTabForm = this.formBuilder.group({
            RoomType: ["", Validators.compose([Validators.required])],
            bookingFromDate: ["", Validators.compose([Validators.required])],
            bookingToDate: ["", Validators.compose([Validators.required])],
            PlanControll: ["", Validators.compose([Validators.required])],
            RoomNo: ["", Validators.compose([Validators.required])],
            PersonNo: ["", Validators.compose([Validators.required])],
            ChildrenNo: ["", Validators.compose([Validators.required])],
        });

        this.onSaveTabForm = this.formBuilder.group({
            TDSAmount: ["", Validators.compose([Validators.nullValidator])],
            TCSAmount: ["", Validators.compose([Validators.nullValidator])],
            ComissionFeeChangeAmount: ["", Validators.compose([Validators.nullValidator])],
            conveninceFeeChangeAmount: ["", Validators.compose([Validators.nullValidator])],
            roomPlanChangeAmountTotalPrice: ["", Validators.compose([Validators.nullValidator])],
            RoomPlanChangeAmount: ["", Validators.compose([Validators.nullValidator])],
            DiscountPercentage: ["", Validators.compose([Validators.nullValidator])],
            PlanAmountChange: ["", Validators.compose([Validators.nullValidator])],
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
              externalSite: ['', Validators.compose([
                Validators.nullValidator,
              ])],
            externalBookingID: [
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
            notes: ["", Validators.compose([Validators.nullValidator])],
        });
    }

    ngOnInit() {
       
        this.authService
    .getUserByUserId(this.token.getUserId())
    .subscribe((resp) => {
        this.userData = resp.body;
    });

        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
          this.role.push(item);
        });
    
        const filters = {
          roles: (roles) =>
            roles.find((x) => this.roleArray.includes(x.toUpperCase())),
        };

        
        this.property = this.token.getProperty();
        if (
            this.property.localCurrency != undefined &&
            this.property.localCurrency != null
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }
        
        this.getBookingInfoByID();
        this.getAllBusinessService();
        this.getConfiguredPropertyDetailsByPropertyId(this.token.getProperty().id);
    }

    ionViewWillEnter() {
        this.authService
        .getUserByUserId(this.token.getUserId())
        .subscribe((resp) => {
            this.userData = resp.body;
        });
    
            this.role = [];
            JSON.parse(this.token.getRole()).forEach((item) => {
              this.role.push(item);
            });
        
            const filters = {
              roles: (roles) =>
                roles.find((x) => this.roleArray.includes(x.toUpperCase())),
            };
    
            
            this.property = this.token.getProperty();
            if (
                this.property.localCurrency != undefined &&
                this.property.localCurrency != null
            ) {
                this.currency = this.property.localCurrency.toUpperCase();
            }
            
            this.getBookingInfoByID();
            this.getAllBusinessService();
            this.getConfiguredPropertyDetailsByPropertyId(this.token.getProperty().id);
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
                    }

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    back() {
        this.router.navigate(['/booking-list']);
    }
    


    onchangeChildCharge(beforeCharge)
    { 
        this.isExtraChildCharge = true;
        this.bookingExtraChildCharge = beforeCharge;
    }

    onchangeExtraChild()
    { 
        this.isExtraChildCharge = false; 
        this.booking.extraChildCharge = this.bookingExtraChildCharge;
    }

    onchangePersonCharge(beforeCharge) {
        this.bookingExtraPersonCharge = beforeCharge;
        this.isExtraPersonCharge = true;
    }
    onchangeExtraPerson()
    { 
        this.isExtraPersonCharge = false; 
        this.booking.extraPersonCharge = this.bookingExtraPersonCharge;
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
    bookingTab() {
            this.router.navigate(['/booking-list-details/bookingTab']);
        
    }

    servicesTab() {
        this.router.navigate(['/booking-list-details/servicesTab']);
    }

    setLocation(location: string) {
        this.router.navigate(['/booking-list-details/paymentsTab']);
    }

    expenseTab() {
        this.router.navigate(['/booking-list-details/expenseTab']);
    }
    customerTab(bookingId: string) {
        this.router.navigate(['/booking-list-details/customerTab'], { queryParams: { booking: bookingId } });
    }
    

    getPlan(roomId: string) {
        this.planCodes = [];
        this.loader = true;
        this.bookingService
            .getPlan(String(this.token.getPropertyId()), roomId)
            .subscribe(
                (data) => {
                    this.plans = data.body;
                    this.plans2 = data.body;
                    this.loader = false;
                    this.roomRatePlanName = this.booking.roomRatePlanName;
                    if (
                        this.booking.roomRatePlanName != undefined &&
                        this.booking.roomRatePlanName != null
                      ) {
                     
                        if (
                            this.plans.some(
                              (data) => data.name === this.booking.roomRatePlanName
                            ) === true
                        ) {
                            this.plan = this.plans.find(
                              (plan) => plan.name === this.booking.roomRatePlanName
                            );
                          } else if (
                            this.plans.some(
                              (data) => data.code === this.booking.roomRatePlanName
                            ) === true
                        ) {
                            this.plan = this.plans.find(
                              (plan) => plan.code === this.booking.roomRatePlanName
                            );
              
                            this.planCodes.push(this.plan);
                        } else {
                            this.getOtaPlan(
                              this.booking.roomId,
                              this.booking.roomRatePlanName
                            );
                          }
                        
                        if (
                          (this.plan === undefined && this.plans.length > 0) ||
                          (this.plan == null && this.plans.length > 0)
                        ) {
                          this.plan = this.plans[0];
                        }
            
                        // this.calculatePlanRoomPrice();
                      }

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    // Logger.log(JSON.stringify(error));
                    this.loader = false;
                }
            );
    }

    getOtaPlan(roomId: number, otaPlanId: string) {
        this.loader = true;
        this.otaPlans = [];
        this.bookingService.getOtaPlanRoomIdAndOtaPlanId(roomId, otaPlanId).subscribe(
            (data) => {

            this.otaPlans.push(data.body);
    
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            this.loader = false;
          }
        );
      }

    getBookingInfoByID() {
        this.bookingService
            .findBooking((this.token.getBookingId()))
            .subscribe((response1) => {
                this.booking = response1.body;
                this.childrenno = this.booking.noOfChildren
                this.getBalaneAmountInCredit();
                this.bookingRoomId = this.booking.roomId;
                if (this.booking.bookingStatus === "ENQUIRY") {
                    this.isEnquiryBooking = true;
                  } else {
                    this.isEnquiryBooking = false;
                  }
                  
                this.getPlan(String(this.booking.roomId));
                this.paymentListRefresh(this.booking.propertyReservationNumber);

                if (this.booking.fromDate != null) {
                    this.booking.fromDate =
                        this.dateService.convertMillisecondsToYYYMMDDFormat(
                            this.booking.fromDate
                        );
                }

                if (this.booking.toDate != null) {
                    this.booking.toDate =
                        this.dateService.convertMillisecondsToYYYMMDDFormat(
                            this.booking.toDate
                        );
                }

               
                this.bookingExtraPersonCharge = this.booking.extraPersonCharge;
                this.bookingExtraChildCharge = this.booking.extraChildCharge;

                if (
                    this.booking.taxDetails != null &&
                    this.booking.taxDetails != undefined &&
                    this.booking.taxDetails.length > 0
                ) {
                this.taxDetailsSelected = this.booking.taxDetails;

                }

                if (
                    this.booking.roomTariffBeforeDiscount != null &&
                    this.booking.roomTariffBeforeDiscount != undefined
                  ) {
                    this.totalPlanAmount = this.booking.roomTariffBeforeDiscount;
                  }
            
                  if (
                    this.booking.taxDetails.length === 0 &&
                    this.booking.taxAmount != null &&
                    this.booking.taxAmount != undefined
                  ) {
                    this.onlyTaxAmount = this.booking.taxAmount;
                  }

                  if(this.booking.advanceAmount != null  && 
                    this.booking.advanceAmount != undefined && 
                    this.booking.advanceAmount >0)
                  {
                    this.advancePaidAmount = this.booking.advanceAmount;
                  }
                  
                this.calculateRoomPrice();;
                this.changeDetectorRefs.detectChanges();
            });

           
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
                this.bookingRoomPrice * (this.booking.discountPercentage / 100);
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
            this.booking.roomPrice = (Math.round(this.roomOnlyPricePerNight));
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

    setPlan(planName: any) {
        if (
            this.plans != null &&
            this.plans != undefined &&
            this.plans.length > 0
        ) {
            this.plan = this.plans.find((plan) => plan.name === planName);
        }

        if (this.plan != undefined) {
            this.booking.planCode = this.plan.code;
            this.totalPlanAmount = this.plan.amount;
        }
    }

    async FormSubMit() {
        
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

       

        loader.present();
        // this.booking.fromTime = Date.parse(this.booking.fromTime).toString();
        if (isNaN(Number(this.booking.fromTime.toString()))) {
            // If 'toTime' is not a timestamp, convert it to timestamp
            this.booking.fromTime = Date.parse(this.booking.fromTime).toString();
        }
        // this.booking.toTime = Date.parse(this.booking.toTime).toString();
        if (isNaN(Number(this.booking.toTime.toString()))) {
            // If 'toTime' is not a timestamp, convert it to timestamp
            this.booking.toTime = Date.parse(this.booking.toTime).toString();
        }
        this.bookingService.saveBooking(this.booking).subscribe(
            (response) => {
                Logger.log("response: " + JSON.stringify(response));
                if (response.status === 200) {
                    loader.dismiss();
                    this.presentToast("Booking Details Saved");
                    this.navCtrl.navigateRoot("booking-list");
                    this.getBookingInfoByID();
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
              this.booking.taxAmount = this.booking.taxAmount + totalTaxAmount;
    
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

    taxChange(event) {
        Logger.log("discount persentage " + this.booking.discountPercentage);
        //this.calculateBookingAmounts();
    }

    onchangeEditPrice(priceChange) {
        this.isSelectionDisabled = true;
        this.isPlanAmountChangeRq = false;
        this.isPriceEditMode = true;

        this.priceBeforeChanged = priceChange;
        // this.bookingRoomPrice = this.priceBeforeChanged;
    }

    onchangeClosedPrice() {
        if (this.isDataChanged === false) {
            this.isSelectionDisabled = false;
        }
        this.isPlanAmountChangeRq = true;
        this.isTotalPriceEditMode = false;
        this.afterDiscountAmount = this.priceBeforeChanged;

        this.calculateDiscountAmounts(this.afterDiscountAmount);
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
    onchangePrice() {
        this.isSelectionDisabled = true;
        this.isPlanAmountChangeRq = true;
        this.isPriceEditMode = false;
        this.isTotalPriceEditMode = false;
        this.isDataChanged = true;
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

    onchangeEditTotalPrice(priceChange) {
        this.isTotalPriceSelectionDisabled = true;
        this.isTotalPriceEditMode = true;

        this.priceBeforeChanged = priceChange;
        // this.bookingRoomPrice = this.priceBeforeChanged;
        this.taxBeforeChanged = this.booking.taxAmount;
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

        this.tempTaxAmount =
          (this.taxBeforeChanged * payableAmount) / this.priceBeforeChanged;
        let netAmount = payableAmount - this.tempTaxAmount;
        let discountAmount = this.bookingRoomPrice - netAmount;
        this.booking.discountPercentage =
          (discountAmount / this.bookingRoomPrice) * 100;
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

              totalTaxAmount = price - price / ((totalTaxPercentage + 100) / 100);
        
    
              this.booking.taxAmount = this.booking.taxAmount + totalTaxAmount;
              this.tempTaxAmount = this.booking.taxAmount + totalTaxAmount;
    
            
            }
          }
        } else {
          this.booking.taxAmount = this.onlyTaxAmount;
        }
    
        this.booking.taxDetails = this.taxDetailsSelected;
        return totalTaxAmount;
      }
    checkAmountEditAccess() {
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

    convinenceFeeEdit() {
        this.isConvienceFeeEditMode = true;
        this.isPaymentConveninceFee = true;
        this.isConveninceFeeChangeRq = true;
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

    bConvinenceFeeEdit() {
        this.isBConvienceFeeEditMode = true;
        this.isPaymentBConveninceFee = true;
        this.isBConveninceFeeChangeRq = true;
    }
    convinenceFeeClosed() {
        this.isPaymentConveninceFee = false;
        this.isConvienceFeeEditMode = false;
        this.isConveninceFeeChangeRq = false;
        this.changeDetectorRefs.detectChanges();
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
        // console.log("getpayment amount "+  this.getPayableAmountInCredit() )
        // console.log("get recived payment amount "+   this.getReceivedAmountInCredit())
        return (
          this.getPayableAmountInCredit() -
          this.getReceivedAmountInCredit() -
          this.getCommitionAmount()
        );
      }

      getPayableAmountInCredit() {
        // console.log("payble amount "+ this.booking.totalPayableAmount)
        // console.log("service amount "+  this.booking.totalServiceAmount)
        // console.log("expence amount "+  this.getPayableAmountInCredit() )

        return (
          this.booking.totalPayableAmount
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
    
    
    planAmountEditButtonClick() {
    this.isPlanAmountEditMode = true;
    this.UIDetectChange();
    }

    planAmountButtonClick() {
        this.isPlanAmountEditMode = false;
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

    setDefaultPlanAmount() {
        this.totalPlanAmount = this.plan.amount;
    }

}
