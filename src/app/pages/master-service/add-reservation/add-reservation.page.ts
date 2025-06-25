import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController, NavController } from "@ionic/angular";
import { BusinessServiceDtoList } from "src/app/model/business-service/businessServiceDtoList";
import { BusinessServiceTypes } from "../../../model/business-service/businessServiceTypes";
import { ResourceList } from "../../../model/business-service/resourceList";
import { Slots } from "../../../model/business-service/slots";
import { BusinessProperties } from "../../../model/Order/businessProperties";
import { Property } from "../../../model/property/Property";
import { BusinessService } from "../../../model/Reservation/businessServic";
import { LocationList } from "../../../model/Reservation/locationList";
import { Slot } from "../../../model/Reservation/slot";
import { SlotDate } from "../../../model/Reservation/SlotDate";
import { SlotReservation } from "../../../model/Reservation/slotReservation";
import { SlotTiming } from "../../../model/Reservation/SlotTiming";
import { DateService } from "../../../service/DateService/date-service.service";
import { Logger } from "../../../service/logger.service";
import { OrderService } from "../../../service/Order/order.service";
import { TokenStorage } from "../../../token.storage";

export class ReservationData {
    slot: any;
    date: any;
    slotTime: any;
    propertyId: number;
    businessTermLocation: string;
    businessTermResource: string;
}

@Component({
    selector: "app-add-reservation",
    templateUrl: "./add-reservation.page.html",
    styleUrls: ["./add-reservation.page.scss"],
})
export class AddReservationPage implements OnInit {
    enabledDates = [];
    slotDateLists: any[] = [];
    slotLocationLists: any[];
    slotResourceLists: any[];
    slotTimes: SlotTiming[];
    slotTiming: SlotTiming;
    slotDateList: SlotDate[];
    slotDateListss: SlotDate[];
    slotByDate: Slot;
    serviceIndex2: any;
    serviceTypeIndex2: any;

    resourceArrayList: ResourceList[] = [];
    resource: ResourceList;

    bookedTiming: SlotTiming;
    location: LocationList;

    slotResource: string;
    slotLocation: string;
    slotTimeIndex: any;

    resourceName = "";
    locationName = "";
    locationLabel = "Location";
    resourceLabel = "Resource";

    businessServiceTypesCart: BusinessServiceTypes;
    slotReservation: SlotReservation;

    dateNotFound = false;
    selectedIndex = 0;
    reservationData: ReservationData;

    businessService: BusinessService;
    businessServiceType: BusinessServiceTypes;
    slot: Slot;
    slots: Slots;
    slotPrice: any;
    loader = false;
    businessServiceIdValue: number;
    service: any;
    dateSelected: string;

    isServiceSelected = false;
    isDateFound = false;
    isDateSelected = false;
    minDate: string;
    maxDate: string;

    ServicePropertyId: number;

    // ,,,,,,
    businessServiceDto: BusinessServiceDtoList;
    propertiesDto: BusinessProperties;
    businessServices: Slots[];
    property: Property;

    iServiceClick = false;
    serviceIndex = 0;

    isRecLocClick = false;
    reclocIndex = 0;
    slotCount: number;

    serviceSelected: any;
    slotSelected: any;
    resourceSelectedList: any[];
    slortResource: any;
    slotSelected2: Slots;

    bookingTimeListLength: any[];
    availabilityNumber = 0;
    serviceTypeFilterData: any;
    isBookingOffering: boolean = true;
    constructor(
        private productService: OrderService,
        public menuCtrl: MenuController,
        private navCtrl: NavController,
        private router: Router,
        private dateService: DateService,
        private changeDetectorRefs: ChangeDetectorRef,
        public token: TokenStorage
    ) {
        this.property = new Property();
        this.propertiesDto = new BusinessProperties();
        this.businessServices = [];

        this.slotTiming = new SlotTiming();
        this.slot = new Slot();
        this.slots = new Slots();
        this.slotReservation = new SlotReservation();
        this.businessServiceType = new BusinessServiceTypes();
        this.businessService = new BusinessService();
        this.businessServiceTypesCart = new BusinessServiceTypes();
        this.businessServiceDto = new BusinessServiceDtoList();
    }

    ngOnInit() {
        this.property = this.token.getProperty();
        this.ServicePropertyId = this.property.id;

        // this.slotReservation = this.token.getSlotBookData();
        Logger.log("back");
    }

    navigateToPage() {
        this.navCtrl.navigateForward('/service-dashboard');
      }

    checckOfferingByMethod(serviceTypes, isBooking) {
        this.serviceTypeFilterData = serviceTypes;

        this.serviceTypeFilterData = this.serviceTypeFilterData.filter((item) => {
            const searchResult = (
                (item.bookable === null && isBooking === true || item.bookable === undefined && isBooking === true || (item.bookable === isBooking && isBooking === true)) ||
                ((item.bookable === isBooking && isBooking === false)));

            return searchResult;
        });

        if (this.serviceTypeFilterData === undefined || this.serviceTypeFilterData === null) {
            return true;
        }
        else if (this.serviceTypeFilterData.length > 0) {
            return true;
        }
        else {
            return false;
        }

    }


    ionViewWillEnter() {
        this.token.clearADDToSlotCart();
        this.getAllBusinessService(String(this.property.id));
        // if (
        //   this.token.getSlotBookData() != null &&
        //   this.token.getSlotBookData() != undefined
        // ) {
        //   this.slotReservation = this.token.getSlotBookData();
        //   Logger.log('back2');
        // }

        // this.businessServices = [];

        // this.slotTiming = new SlotTiming();
        // this.slot = new Slot();
        // this.slots = new Slots();
        // this.slotReservation = new SlotReservation();
        // this.businessServiceType = new BusinessServiceTypes();
        // this.businessService = new BusinessService();
        // this.businessServiceTypesCart = new BusinessServiceTypes();
    }
    getAllBusinessService(PropertyId: string) {
        this.loader = true;
        this.productService.findByPropertyId(PropertyId).subscribe(
            (data) => {
                this.propertiesDto = data.body;

                if (this.propertiesDto.businessServiceDtoList.length > 0) {
                    this.businessServiceDto = this.propertiesDto.businessServiceDtoList[0];

                    if (
                        this.businessServiceDto != null &&
                        this.businessServiceDto != undefined
                    ) {
                        this.slotRevdata(this.businessServiceDto);
                    }

                    Logger.log(
                        "back2" + JSON.stringify(this.businessServiceDto)
                    );
                }
                this.loader = false;
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    slotRevdata(value) {
        if (
            value.customerLocationName != undefined &&
            value.customerLocationName != null
        ) {
            this.slotReservation.customerLocationName =
                value.customerLocationName;
        }

        if (
            value.businessLocationName != undefined &&
            value.businessLocationName != null
        ) {
            this.slotReservation.businessLocationName =
                value.businessLocationName;
        }

        if (
            value.businessTermLocation != undefined &&
            value.businessTermLocation != null
        ) {
            this.slotReservation.businessTermLocation =
                value.businessTermLocation;
        } else {
            this.slotReservation.businessTermLocation = "Location";
        }

        if (
            value.businessTermResource != undefined &&
            value.businessTermResource != null
        ) {
            this.slotReservation.businessTermResource =
                value.businessTermResource;
            this.resourceLabel = this.slotReservation.businessTermResource;
        } else {
            this.slotReservation.businessTermResource = "Resource";
        }

        if (
            value.canChangeBusinessAddress != undefined &&
            value.canChangeBusinessAddress === true
        ) {
            this.slotReservation.canChangeBusinessAddress = true;
        } else {
            this.slotReservation.canChangeBusinessAddress = false;
        }

        if (
            value.provideBusinessAndCustomerAddress != undefined &&
            value.provideBusinessAndCustomerAddress === true
        ) {
            this.slotReservation.provideBusinessAndCustomerAddress = true;
        } else {
            this.slotReservation.provideBusinessAndCustomerAddress = false;
        }

        Logger.log(
            "this.resourceLabel  datata rttratac : " + this.resourceLabel
        );

        this.changeDetectorRefs.detectChanges();
    }

    onServiceSelect(service, index) {
        this.loader = false;
        this.serviceIndex = index;
        if (this.iServiceClick === false) {
            this.iServiceClick = true;
        } else {
            this.iServiceClick = false;
        }

        this.businessService = service;

        this.slots.businessServiceId = this.businessService.id;
        this.isServiceSelected = true;
    }
    onBook(bServiceDtoList) {
        this.slotRevdata(bServiceDtoList);
        this.isDateFound = true;
    }
    setServiceType(event, serviceIndex, serviceTypeIndex) {
        // this.businessServiceType = undefined;
        this.serviceIndex2 = serviceIndex;
        this.serviceTypeIndex2 = serviceTypeIndex;

        this.dateSelected = undefined;
        this.isDateSelected = false;
        this.isRecLocClick = false;
        this.isDateFound = false;
        this.slotPrice = undefined;
        this.resourceArrayList = [];
        // Logger.log("service : " + JSON.stringify(event));
        this.businessServiceType = event;
        this.slotPrice = event.slotPricingDto.afterTaxAmount;
        this.slots.businessServiceTypeId = this.businessServiceType.id;
        // this.isDateFound = true;
        const today = new Date().toLocaleDateString();
        this.minDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            today
        );
        this.maxDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            event.endDate
        );
        Logger.log(
            "this.businessServiceType ",
            JSON.stringify(this.businessServiceType)
        );
        // Logger.log('this.service ', JSON.stringify(event));
        this.businessServiceIdValue = this.businessService.id;

        this.businessServiceTypesCart = new BusinessServiceTypes();
        this.businessServiceTypesCart = event;
        // this.businessServiceTypesCart.id = event.id;
        // this.businessServiceTypesCart.name = event.name;
        // this.businessServiceTypesCart.businessTermResource = event.businessTermResource;
        // this.businessServiceTypesCart.businessTermLocation = event.businessTermLocation;
        // this.businessServiceTypesCart.capacityPerSlot = event.capacityPerSlot;
        // this.businessServiceTypesCart.description = event.description;
        // this.businessServiceTypesCart.slotPricingDto = event.slotPricingDto;
        // // this.businessServiceTypesCart.businessServiceId = value.businessServiceId;
        // this.businessServiceTypesCart.durationInMinutes = event.durationInMinutes;
    }

    getDateList() {
        this.loader = true;
        let bstid = this.slots.businessServiceTypeId;
        this.productService
            .getSlotsByBusinessServiceTypeAndDate(
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.dateSelected
                ),
                this.slots.businessServiceTypeId
            )
            .subscribe(
                (data) => {
                    this.slots = data.body;
                    this.slots.businessServiceTypeId = bstid;
                    Logger.log("this.slots : " + JSON.stringify(this.slots));

                    // this.slotDateList = this.slot.slotDateList;

                    this.loader = false;
                    this.enabledDates = [];
                    this.slotLocationLists = [];
                    this.slotResourceLists = [];
                    this.slotDateListss = [];

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    Logger.log(JSON.stringify(error));
                    this.loader = false;
                }
            );
    }

    getDate() {
        Logger.log("dateSelected" + this.getUTCDateToDate(this.dateSelected));
        this.slotReservation.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            this.dateSelected
        );

        // Logger.log('dateCheck '+ this.dateCheck(this.slotReservation.date ));
        this.getDateList();
        this.isDateSelected = true;
    }
    setSlotTime2(slotTimeIndex, resourceIndex: number, resource: any) {
        Logger.log(
            "i 2" + this.checkAvailability(resource.name, slotTimeIndex)
        );
        if (
            this.checkAvailability(resource.name, slotTimeIndex) !=
            slotTimeIndex.slotAvailabilityDto.noOfAvailable
        ) {
            this.setSlotTime(slotTimeIndex, resourceIndex, resource);
        } else {
            Logger.log(" not available");
        }
    }

    checkAvailability(resourceName: string, bookingTime: any) {
        this.availabilityNumber = 0;

        if (
            this.slotReservation.businessServiceTypes != undefined &&
            this.slotReservation.businessServiceTypes.some(
                (p) => p.id === this.businessServiceTypesCart.id
            ) === true
        ) {
            this.serviceSelected = this.slotReservation.businessServiceTypes.find(
                (cart) => cart.id === this.businessServiceTypesCart.id
            );
            Logger.log(
                " service  true" +
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.slots.date
                )
            );
            if (
                this.slotReservation.businessServiceTypes[
                    this.slotReservation.businessServiceTypes.indexOf(
                        this.serviceSelected
                    )
                ].slots.some(
                    (s) =>
                        s.date ===
                        this.dateService.convertMillisecondsToYYYMMDDFormat(
                            this.slots.date
                        )
                ) === true
            ) {
                this.slotSelected = this.slotReservation.businessServiceTypes[
                    this.slotReservation.businessServiceTypes.indexOf(
                        this.serviceSelected
                    )
                ].slots.find(
                    (slot) =>
                        slot.date ===
                        this.dateService.convertMillisecondsToYYYMMDDFormat(
                            this.slots.date
                        )
                );

                this.resourceSelectedList = this.slotSelected.resourceList;
                Logger.log(
                    " date true" + JSON.stringify(this.resourceSelectedList)
                );

                if (
                    this.resourceSelectedList.some(
                        (r) => r.name === this.resourceName
                    ) === true
                ) {
                    this.slortResource = this.resourceSelectedList.find(
                        (res) => res.name === this.resourceName
                    );

                    Logger.log(
                        "this.slortResource" +
                        JSON.stringify(this.slortResource)
                    );

                    if (
                        this.slortResource.bookedTimings.some(
                            (bt) =>
                                bt.startTime === bookingTime.startTime &&
                                bt.finishTime === bookingTime.finishTime
                        ) === true
                    ) {
                        this.bookingTimeListLength = this.slortResource.bookedTimings.filter(
                            (item) => {
                                const searchResult =
                                    item.startTime != null &&
                                    item.startTime
                                        .trim()
                                        .indexOf(
                                            bookingTime.startTime.trim().trim()
                                        ) > -1 &&
                                    item.finishTime != null &&
                                    item.finishTime
                                        .trim()
                                        .indexOf(
                                            bookingTime.finishTime.trim()
                                        ) > -1;

                                return searchResult;
                            }
                        );

                        this.availabilityNumber = this.bookingTimeListLength.length;

                        return this.availabilityNumber;
                        Logger.log(
                            "this.bookingTimeListLength" +
                            this.bookingTimeListLength.length
                        );
                    } else {
                        return this.availabilityNumber;
                    }
                } else {
                    return this.availabilityNumber;
                }
            } else {
                return this.availabilityNumber;
            }
        } else {
            return this.availabilityNumber;
        }
    }

    setSlotTime(slotTimeIndex, resourceIndex: number, resource: any) {

        // if( this.dateCheck(this.slotReservation.date ) === true)
        // {
        //     this.removeSlot(this.slotReservation.date);
            
        // }

        this.bookedTiming = new SlotTiming();
        this.bookedTiming = slotTimeIndex;

        this.location = new LocationList();
        if (resource.locationList.length > 0) {
            this.location = resource.locationList[0];
        }

        this.resource = new ResourceList();
        this.resource.name = resource.name;
        this.resource.desc = resource.desc;
        this.resource.imageUrl = resource.imageUrl;

        if (
            this.resourceArrayList.some(
                (data) => data.name === resource.name
            ) === true
        ) {
            Logger.log(
                "exist" +
                this.resourceArrayList
                    .map((item) => item.name)
                    .indexOf(resource.name)
            );
            const resourceIndexNumber = this.resourceArrayList
                .map((item) => item.name)
                .indexOf(resource.name);
            Logger.log(
                "index" +
                this.resourceArrayList[resourceIndexNumber].bookedTimings
                    .map((time) => time.startTime)
                    .indexOf(this.bookedTiming.startTime)
            );
            const timeSlotIndex = this.resourceArrayList[
                resourceIndexNumber
            ].bookedTimings
                .map((time) => time.startTime)
                .indexOf(this.bookedTiming.startTime);

            if (timeSlotIndex === -1) {
                this.resourceArrayList[resourceIndexNumber].bookedTimings.push(
                    this.bookedTiming
                );

                Logger.log(" new time -1");
            } else {
                Logger.log(" exist time");

                this.resourceArrayList[
                    resourceIndexNumber
                ].bookedTimings.splice(timeSlotIndex, 1);

                if (
                    this.resourceArrayList[resourceIndexNumber].bookedTimings
                        .length === 0
                ) {
                    this.resourceArrayList.splice(resourceIndexNumber, 1);
                }
            }
        } else {
            Logger.log("exist not");
            this.resource.bookedTimings = [];
            this.resource.bookedTimings.push(this.bookedTiming);

            this.resource.locationList = [];
            this.resource.locationList.push(this.location);
            this.resourceArrayList.push(this.resource);
        }

        this.slotTiming = slotTimeIndex;
        // Logger.log(JSON.stringify(resource)+'this.slotTime ' + JSON.stringify(this.slotTime));
        this.setResource(resourceIndex);

        Logger.log(JSON.stringify(this.resourceArrayList));

        this.slotTimeIndex = slotTimeIndex;
    }
    setResource(slotResourceIndex) {
        // Logger.log('search slotResource ' + JSON.stringify(this.slotResource));
        // this.applySlotFilter(this.searchDate, this.slotResource, this.slotLocation);

        Logger.log(JSON.stringify(slotResourceIndex));
        // Logger.log((this.slots.resourceList[slotResourceIndex]));
        // tslint:disable-next-line: max-line-length
        if (
            this.slots.resourceList[slotResourceIndex] !== undefined &&
            this.slots.resourceList[slotResourceIndex] !== null &&
            this.slots.resourceList[slotResourceIndex].locationList !==
            undefined &&
            this.slots.resourceList[slotResourceIndex].locationList !== null &&
            this.slots.resourceList[slotResourceIndex].locationList?.length
        ) {
            this.locationName = this.slots.resourceList[
                slotResourceIndex
            ].locationList[0].name;
            this.resourceName = this.slots.resourceList[slotResourceIndex].name;
        }

        this.slotTimes = [];
        Logger.log("this.locationName ", JSON.stringify(this.locationName));

        if (
            this.slots.resourceList[slotResourceIndex] != undefined &&
            this.slots.resourceList[slotResourceIndex] != null
        ) {
            this.slotTimes = this.slots.resourceList[
                slotResourceIndex
            ].availableTimings;
        }

        // for (let i = 0; i < this.slotDateFilter.length; i++) {
        //   this.slotTimes = this.slotDateFilter[i].slotTimingDtos;
        // }
        // this.resourceSelected = true;
        // this.slotTimeIndex = '';
    }

    // removeSlot(date : string){
    //     if (
    //         this.slotReservation.businessServiceTypes != undefined &&
    //         this.slotReservation.businessServiceTypes.some(
    //             (p) => p.id === this.businessServiceTypesCart.id
    //         ) === true
    //     ) {
    //         Logger.log("rv exixting");
    //         this.serviceSelected = this.slotReservation.businessServiceTypes.find(
    //             (cart) => cart.id === this.businessServiceTypesCart.id
    //         );

    //         if (
    //             this.slotReservation.businessServiceTypes[
    //                 this.slotReservation.businessServiceTypes.indexOf(
    //                     this.serviceSelected
    //                 )
    //             ].slots.some((s) => s.date === date) === true
    //         ) {
    //             Logger.log("rv exixting date");
    //             this.slotSelected = this.slotReservation.businessServiceTypes[
    //                 this.slotReservation.businessServiceTypes.indexOf(
    //                     this.serviceSelected
    //                 )
    //             ].slots.find((slot) => slot.date === date);

    //             Logger.log('rv this.slotSelected '+ JSON.stringify(this.slotSelected));

    //             let slotIndex = this.slotReservation.businessServiceTypes[
    //                 this.slotReservation.businessServiceTypes.indexOf(
    //                     this.serviceSelected
    //                 )
    //             ].slots.indexOf(this.slotSelected);

    //             if(slotIndex != -1)
    //             {
    //                 this.slotReservation.businessServiceTypes[
    //                     this.slotReservation.businessServiceTypes.indexOf(
    //                         this.serviceSelected
    //                     )
    //                 ].slots.splice(slotIndex, 1);

    //                 Logger.log('rv this.slotReservation '+ JSON.stringify(this.slotReservation));
    
    //             }

               
    //             Logger.log('rv slotIndex '+ slotIndex);

    //         }
        

    //     }
      
    // }

    // dateCheck(date : string){
    //     let isDateChecked  = false;
    //     if (
    //         this.slotReservation.businessServiceTypes != undefined &&
    //         this.slotReservation.businessServiceTypes.some(
    //             (p) => p.id === this.businessServiceTypesCart.id
    //         ) === true
    //     ) {
    //         Logger.log(" exixting");
    //         this.serviceSelected = this.slotReservation.businessServiceTypes.find(
    //             (cart) => cart.id === this.businessServiceTypesCart.id
    //         );

    //         if (
    //             this.slotReservation.businessServiceTypes[
    //                 this.slotReservation.businessServiceTypes.indexOf(
    //                     this.serviceSelected
    //                 )
    //             ].slots.some((s) => s.date === date) === true
    //         ) {
    //             Logger.log(" exixting date");
               
    //             isDateChecked  = true;
    //         }
    //         else
    //         {
    //             isDateChecked  = false;
    //         }

    //     }
    //     else
    //     {
    //         isDateChecked  = false; 
    //     }       

    //     return isDateChecked;
    // }

    onAddAnotherClick() {

        // Logger.log(" exixting date"+JSON.stringify( this.slotReservation));

        this.slots.date = this.slotReservation.date;
        // this.slots.resourceList = this.resourceArrayList;
        // this.businessServiceTypesCart.slots = [];
        // this.businessServiceTypesCart.slots.push(this.slots);

        if (
            this.slotReservation.businessServiceTypes != undefined &&
            this.slotReservation.businessServiceTypes.some(
                (p) => p.id === this.businessServiceTypesCart.id
            ) === true
        ) {
            Logger.log(" exixting service");
            this.serviceSelected = this.slotReservation.businessServiceTypes.find(
                (cart) => cart.id === this.businessServiceTypesCart.id
            );

            if (
                this.slotReservation.businessServiceTypes[
                    this.slotReservation.businessServiceTypes.indexOf(
                        this.serviceSelected
                    )
                ].slots.some((s) => s.date === this.slots.date) === true
            ) {
                Logger.log(" exixting date");
                this.slotSelected = this.slotReservation.businessServiceTypes[
                    this.slotReservation.businessServiceTypes.indexOf(
                        this.serviceSelected
                    )
                ].slots.find((slot) => slot.date === this.slots.date);

                this.resourceSelectedList = this.slotSelected.resourceList;

                Logger.log(" exixting date");

                // Logger.log('this.businessServiceTypesCart.slots '+ JSON.stringify(this.resourceArrayList));

                for (let i = 0; i < this.resourceArrayList.length; i++) 
                {
                    if (
                        this.resourceSelectedList.some(
                            (r) => r.name === this.resourceArrayList[i].name
                        ) === true
                    ) {
                        Logger.log('r exist');
                        this.slortResource = this.resourceSelectedList.find(
                            (res) => res.name === this.resourceArrayList[i].name
                        );

                        //Logger.log('r exist data this.slortResource '+ JSON.stringify(this.slortResource));

                        // this.slotSelected2 = this.slotReservation.businessServiceTypes[
                        //     this.slotReservation.businessServiceTypes.indexOf(
                        //         this.serviceSelected
                        //     )
                        // ].slots[
                        //     this.slotReservation.businessServiceTypes[
                        //         this.slotReservation.businessServiceTypes.indexOf(
                        //             this.serviceSelected
                        //         )
                        //     ].slots.indexOf(this.slotSelected)
                        // ];
                        // Logger.log('r slotSelected2 data '+ JSON.stringify(this.slotSelected2));

                        for (
                            let j = 0;
                            j < this.resourceArrayList[i].bookedTimings.length;
                            j++) 
                         {

                            if (
                                this.slortResource.bookedTimings.some(
                                    (sr) => sr.startTime === this.resourceArrayList[i].bookedTimings[j].startTime && sr.finishTime === this.resourceArrayList[i].bookedTimings[j].finishTime
                                ) === true
                            ) {
                                // Logger.log('time t'+ this.resourceArrayList[i].bookedTimings[j].startTime);
                            }
                            else
                            {
                                if(this.slortResource.bookedTimings != null && this.slortResource.bookedTimings != undefined && this.slortResource.bookedTimings.length > 0)
                                {
                                    this.slortResource.bookedTimings.push(this.resourceArrayList[i].bookedTimings[j]);
                                }
                                else
                                {
                                    this.slortResource.bookedTimings =[];
                                    this.slortResource.bookedTimings.push(this.resourceArrayList[i].bookedTimings[j]);
                                }
                           
                                Logger.log('time f'+ this.resourceArrayList[i].bookedTimings[j].startTime);
                            }

                        }

                        this.resourceSelectedList[this.resourceSelectedList.indexOf(this.slortResource)] = this.slortResource;

                        // Logger.log(' this.slortResource '+ JSON.stringify( this.slortResource))
                     } else {
                        Logger.log('not r exist');

                        if(this.resourceSelectedList != null && this.resourceSelectedList != undefined && this.resourceSelectedList.length >0)
                        {
                            this.resourceSelectedList.push(this.resourceArrayList[i]);
                        }
                        else
                        {
                            this.resourceSelectedList = [];
                            this.resourceSelectedList.push(this.resourceArrayList[i]);
                        }
                        // this.slotReservation.businessServiceTypes[
                        //     this.slotReservation.businessServiceTypes.indexOf(
                        //         this.serviceSelected
                        //     )
                        // ].slots[
                        //     this.slotReservation.businessServiceTypes[
                        //         this.slotReservation.businessServiceTypes.indexOf(
                        //             this.serviceSelected
                        //         )
                        //     ].slots.indexOf(this.slotSelected)
                        // ].resourceList.push(this.resourceArrayList[i]);
                   }
                }
                 this.slotReservation.businessServiceTypes[this.slotReservation.businessServiceTypes.indexOf(this.serviceSelected)].slots[
                   this.slotReservation.businessServiceTypes[this.slotReservation.businessServiceTypes.indexOf(this.serviceSelected)].slots.indexOf( this.slotSelected)
                  ].resourceList = this.resourceSelectedList;
            } 
            else 
            {
                Logger.log(" exixting date not");

                this.slots.resourceList = this.resourceArrayList;
                // this.businessServiceTypesCart.slots = [];
                // this.businessServiceTypesCart.slots.push(this.slots);

                // this.slotReservation.businessServiceTypes[
                //     this.slotReservation.businessServiceTypes.indexOf(
                //         this.serviceSelected
                //     )
                // ].slots.push(this.slots);

                this.serviceSelected = this.slotReservation.businessServiceTypes.find(
                    (cart) => cart.id === this.businessServiceTypesCart.id
                );
    
                this.slotReservation.businessServiceTypes[
                    this.slotReservation.businessServiceTypes.indexOf(
                        this.serviceSelected
                    )
                ].slots.push(this.slots);

                Logger.log('this.slotReservation '+ JSON.stringify(this.slotReservation));
            }
        } else {
            Logger.log(" not exixting service");

            this.slots.resourceList = this.resourceArrayList;
            this.businessServiceTypesCart.slots = [];
            this.businessServiceTypesCart.slots.push(this.slots);

            if (this.slotReservation.businessServiceTypes === undefined) {
                this.slotReservation.businessServiceTypes = [];
                this.slotReservation.businessServiceTypes.push(
                    this.businessServiceTypesCart
                );
            } else {
                this.slotReservation.businessServiceTypes.push(
                    this.businessServiceTypesCart
                );
            }
        }

        Logger.log("serviceSelected" + JSON.stringify(this.slotReservation));
        this.slotReservation.propertyId = this.property.id;
        this.slotReservation.businessName = this.property.businessName;
        this.slotReservation.resourceName = this.resourceName;
        this.slotReservation.locationName = this.locationName;
        this.slotReservation.bookingStatus = "NEW";
        this.slotReservation.businessTypeName = this.property.businessType;
        this.slotReservation.currency = this.property.localCurrency;
        // this.token.clearADDToSlotCart();
        // this.token.saveSlotBookData(this.slotReservation);
        this.serviceIndex2 = undefined;
        this.businessServiceType = undefined;
        this.dateSelected = undefined;
        this.isDateSelected = false;
        this.isRecLocClick = false;
        this.isDateFound = false;
        this.resourceArrayList = [];

        this.priceCalculate();
    }
    priceCalculate() {
        this.slotReservation.totalAmount = 0;
        this.slotReservation.beforeTaxAmount = 0;
        this.slotCount = 0;
        for (const serviceTypes of this.slotReservation.businessServiceTypes) {
            for (const slots of serviceTypes.slots) {
                let tempSlotCount = 0;
                for (const resource of slots.resourceList) {
                    for (const time of resource.bookedTimings) {
                        tempSlotCount += 1;
                    }
                }
                this.slotReservation.totalAmount += slots.price * tempSlotCount;
                this.slotReservation.beforeTaxAmount +=
                    slots.beforeTax * tempSlotCount;
                this.slotCount += tempSlotCount;
            }
        }
        this.slotReservation.taxAmount =
            this.slotReservation.totalAmount -
            this.slotReservation.beforeTaxAmount;
        this.slotReservation.afterTaxAmount = this.slotReservation.totalAmount;
    }
    showReservationCart() {
        this.token.clearADDToSlotCart();
        this.token.saveSlotBookData(this.slotReservation);
        this.router.navigate(["/add-to-slot"]);
        this.slotReservation = new SlotReservation();
    }
    onBookingClick() {
        Logger.log(
            "this.resourceArrayList ",
            JSON.stringify(this.resourceArrayList)
        );
        // this.token.clearADDToSlotCart();
        // this.token.saveSlotBookData(this.slotReservation);
        Logger.log(
            "this.slotReservation ",
            JSON.stringify(this.slotReservation)
        );
        // this.token.saveSlotData(this.slotReservation.businessServiceTypes);
        this.router.navigate(["/add-reservation"]);
    }
    getUTCDateToDate(dateString: string) {
        const yearAndMonth = dateString.split("-", 3);
        return (
            yearAndMonth[0] +
            "-" +
            yearAndMonth[1] +
            "-" +
            yearAndMonth[2].split("T", 1)
        );
    }

    onLocRec(index) {
        this.reclocIndex = index;
        if (this.isRecLocClick === false) {
            this.isRecLocClick = true;
        } else {
            this.isRecLocClick = false;
        }
    }

    book(slotTime: any, slotDate: any) {
        this.token.clearReservationData();
        this.reservationData = new ReservationData();
        this.reservationData.slotTime = slotTime;
        this.reservationData.slot = this.slot;
        this.reservationData.propertyId = this.ServicePropertyId;
        this.reservationData.date = slotDate;
        this.reservationData.businessTermLocation = this.businessServiceType.businessTermLocation;
        this.reservationData.businessTermResource = this.businessServiceType.businessTermResource;
        this.token.clearADDToSlotCart();
        this.token.saveReservationData(this.reservationData);

        this.router.navigate(["/add-reservation"]);

        // let navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         data :  JSON.stringify(this.reservationData),
        //     }
        // };

        // this.navCtrl.navigateForward(['add-reservation'] , navigationExtras);
    }
}
