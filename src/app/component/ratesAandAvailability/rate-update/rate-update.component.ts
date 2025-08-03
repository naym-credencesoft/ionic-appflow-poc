import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { CheckSubscription } from 'src/app/checkSubscription';
import { RatesAndAvailability } from 'src/app/model/manage-booking/rateandavailability/rateandavailability';
import { OTAPlan } from 'src/app/model/otaPlan/otaPlan';
import { OTAChannelPropertyDTO } from 'src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { Property } from 'src/app/model/property/Property';
// import { RateAndAvailability } from 'src/app/model/rateAndAvailability';
import { Room } from 'src/app/model/room';
import { OtaAvailability } from 'src/app/pages/availability-update/otaAvailability';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { AddSubscriptionService } from 'src/app/service/subscription-service.service';
import { TokenStorage } from 'src/app/token.storage';

export interface PlanListInterface {
    name: string;
    code: string;
  }

@Component({
  selector: 'app-rate-update',
  templateUrl: './rate-update.component.html',
  styleUrls: ['./rate-update.component.css']
})
export class RateUpdateComponent implements OnInit {
    stopSellOtaName: any[];
    selectedIndex: any;

    @ViewChild("input", { static: false })
    set input(element: ElementRef<HTMLInputElement>) {
      if (element) {
        element.nativeElement.focus();
      }
    }
  
    @Input() roomData: Room;
    @Input() propertyData: RatesAndAvailability[];
    propertydetails: OTAChannelPropertyDTO;
    propertyRateData: any[] = [];
    isOtaPlanListVisible: boolean = false;
    isBookingEngine: boolean;
    isBookingjiniSubscription:boolean = false;
    isChannelManager: boolean;
    isBookoneChannelManager :boolean =false
    selectedInputIndex: number = -1;
    selectedInputIndexRoomPrice: number = -1;
    selectedInputIndexTotalRoom: number = -1;
    selectedInputIndexSold: number = -1;
    selectedInputIndexHold: number = -1;
    loader: boolean = false;
    isDropdownOpen: { [outerIndex: number]: { [innerIndex: number]: boolean } } = {};// Track dropdown state by index

    room: Room;
    isSectionVisible: boolean[] = [];
    @Output() roomItemEvent = new EventEmitter<string>();
    subscriptionSelected: any[];
    property: Property;
    isAirbnbSubscription:boolean = false;
    isBookingDotcomSubscription:boolean = false;
    isChannexSubscription:boolean = false;
  constructor(private changeDetectorRefs: ChangeDetectorRef,
    private checkSubscription: CheckSubscription,
    private router: Router,
    public navCtrl: NavController,
    private subcriptionService: AddSubscriptionService,
    private dateService: DateService,
    private propertyService: PropertyService,
    private toastController: ToastController,
    private availabilityService : AvailabilityService,
    private token : TokenStorage) {
    this.stopSellOtaName  = [];
    this.room = new Room();
    this.property = new Property();
   }

   ngOnInit() {
    this.property = this.token.getProperty();
    this.isBookingEngine = this.checkSubscription.isSubscriptionMatch(
      this.checkSubscription.getBookingEngine(),
      this.token.getProperty().subscriptionList
    );
//  this.getSubscriptionForProperty(this.property.id);
 this.getConfiguredPropertyDetailsByPropertyId(this.property.id);
 this.getSubscriptionForProperty(Number(this.property.id));
    this.isChannelManager = this.checkSubscription.isSubscriptionMatch(
      this.checkSubscription.getChannelManagement(),
      this.token.getProperty().subscriptionList
    );
    this.isBookoneChannelManager = this.checkSubscription.isSubscriptionMatch(
        this.checkSubscription.getBookoneChannelManager(),
        this.token.getProperty().subscriptionList
      );
    
  }
  toggleSection(i: number): void {
    this.isSectionVisible[i] = !this.isSectionVisible[i];
  }
  getOtaInventoryCount(ratesAndAvailabilities: RatesAndAvailability,otaName:String){
    let noOfAvailable = null;
    if (
      ratesAndAvailabilities.otaAvailabilityList != null &&
      ratesAndAvailabilities.otaAvailabilityList.length > 0
    ) {
      for (let j = 0; j < ratesAndAvailabilities.otaAvailabilityList.length; j++) {
        if (
          otaName === ratesAndAvailabilities.otaAvailabilityList[j].otaName
        ) {
          noOfAvailable = ratesAndAvailabilities.otaAvailabilityList[j].noOfAvailable;
        }
      }
    }
    return noOfAvailable;
  }

refresh() {
    this.property = this.token.getProperty();
    this.isBookingEngine = this.checkSubscription.isSubscriptionMatch(
      this.checkSubscription.getBookingEngine(),
      this.token.getProperty().subscriptionList
    );
//  this.getSubscriptionForProperty(this.property.id);
 this.getConfiguredPropertyDetailsByPropertyId(this.property.id);
 this.getSubscriptionForProperty(Number(this.property.id));
    this.isChannelManager = this.checkSubscription.isSubscriptionMatch(
      this.checkSubscription.getChannelManagement(),
      this.token.getProperty().subscriptionList
    );
    this.isBookoneChannelManager = this.checkSubscription.isSubscriptionMatch(
        this.checkSubscription.getBookoneChannelManager(),
        this.token.getProperty().subscriptionList
      );
}


  getOtaPlanAmount(ratesAndAvailabilities: RatesAndAvailability,otaPlan:OTAPlan){
    let planPrice = "X";

    if (
      ratesAndAvailabilities.roomRatePlans != null &&
      ratesAndAvailabilities.roomRatePlans.length > 0
    ) {
      for (let i = 0; i < ratesAndAvailabilities.roomRatePlans.length; i++) {
       for (let j = 0; j < ratesAndAvailabilities.roomRatePlans[i].otaPlanList.length; j++) {
          if (ratesAndAvailabilities.roomRatePlans[i].otaPlanList[j].otaName == otaPlan.otaName
            && ratesAndAvailabilities.roomRatePlans[i].otaPlanList[j].planName == otaPlan.planName
          ) {
            planPrice = ratesAndAvailabilities.roomRatePlans[i].otaPlanList[j].price.toString();
          }
       }
      }
    }

    return planPrice;
  }
  getOtaPlanList(ratesAndAvailabilities: RatesAndAvailability[], otaName: string): OTAPlan[] {
    let otaPlanList: OTAPlan[] = [];
    
    for (let i = 0; i < ratesAndAvailabilities.length; i++) {
      let roomRatePlans = ratesAndAvailabilities[i].roomRatePlans;

      if (roomRatePlans != null && roomRatePlans.length > 0) {
        for (let j = 0; j < roomRatePlans.length; j++) {
          let otaPlanListInRatePlan = roomRatePlans[j].otaPlanList;

          if (otaPlanListInRatePlan != null && otaPlanListInRatePlan.length > 0) {
            for (let k = 0; k < otaPlanListInRatePlan.length; k++) {
              let currentOtaPlan = otaPlanListInRatePlan[k];
              if (currentOtaPlan.otaName === otaName && 
                  !otaPlanList.some(plan => plan.otaPlanId === currentOtaPlan.otaPlanId)) {
                otaPlanList.push(currentOtaPlan);
              }
            }
          }
        }
      }
    }

    otaPlanList.sort((a, b) => {
      if (a.planName < b.planName) return -1;
      if (a.planName > b.planName) return 1;
      return 0;
  });
    return otaPlanList;
}
  getSubscriptionForProperty(propertyId: number) {
    this.subcriptionService
      .getPropertySubcription(String(propertyId))
      .subscribe(
        (data) => {
          this.subscriptionSelected = data;

          if (
            this.subscriptionSelected != null &&
            this.subscriptionSelected != undefined &&
            this.subscriptionSelected.length > 0
          ) {
            for (let i = 0; i < this.subscriptionSelected.length; i++) {
              if (
                this.subscriptionSelected[i].name === "Bookingjini Subscription"
              ) {
                this.isBookingjiniSubscription = true;
              }
              if (
                this.subscriptionSelected[i].name === "Airbnb Subscription"
              ) {
                this.isAirbnbSubscription = true;
              }
              if (
                this.subscriptionSelected[i].name === "Booking.com Subscription"
              ) {
                this.isBookingDotcomSubscription = true;
              }
              if (
                this.subscriptionSelected[i].name === "Channex Subscription"
              ) {
                this.isChannexSubscription = true;
              }
            }
          }
          this.changeDetectorRefs.detectChanges();
        },
        (error) => {}
      );
  }
  ngOnChanges() {
    this.room = this.roomData;
    this.propertyRateData = this.propertyData;
  
  }
  getOtaImageUrl(otaName: String) {
    
    let otaLogoUrl = null;
    for (let i = 0; i < this.propertydetails?.propertiesOnlineTravelAgencies.length; i++) {
      if (this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyName != null && this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyName != undefined
        && otaName != null && otaName != undefined &&
        this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyName.toLocaleLowerCase() == otaName.toLocaleLowerCase()) {
        if (this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyLogoUrl != null &&
          this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyLogoUrl != " "
        ) {
          otaLogoUrl = this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyLogoUrl;
        }

      }
    }
    return otaLogoUrl;
  }
  getConfiguredPropertyDetailsByPropertyId(propertyId: number) {
    this.loader = true;
    this.propertyService
      .getConfiguredPropertyDetailsByPropertyId(propertyId)
      .subscribe(
        (data) => {
          this.propertydetails = data;
          this.loader = false;
        
        },
        (error) => {
          this.loader = false;
        
        }
      );
  }
  getExternalOtaUrl(){
    if((this.isBookingjiniSubscription == true && this.isBookingDotcomSubscription == true && this.isAirbnbSubscription == false)
    || (this.isChannexSubscription == true && this.isBookingDotcomSubscription == true && this.isAirbnbSubscription == false)){
      return "/assets/img/booking.com-logo.png";
    } else if ((this.isBookingjiniSubscription == true && this.isAirbnbSubscription == true && this.isBookingDotcomSubscription == false)
      || (this.isChannexSubscription == true && this.isAirbnbSubscription == true && this.isBookingDotcomSubscription == false)) {
        return "/assets/img/airbnb-logo.png";
    } else if ((this.isBookingjiniSubscription == true && this.isAirbnbSubscription == true && this.isBookingDotcomSubscription == true)
      || (this.isChannexSubscription == true && this.isAirbnbSubscription == true && this.isBookingDotcomSubscription == true)) {
        return "/assets/img/airbnbOrbooking.com-logo.png";
    }
  }
  @HostListener('document:click', ['$event.target'])
closeOnOutsideClick(target: HTMLElement): void {
  if (!target.closest('.dropdown')) {
    // this.closeAllDropdowns();
  }
}
goToMasterRatePage(date, otPlan:OTAPlan,otaName, otaInventoryCount) {

    const queryParams = {
        room: JSON.stringify(this.room),
        date,
        otaplan: JSON.stringify(otPlan),
        otaName,
        otaInventoryCount
    };

    this.navCtrl.navigateForward(['master-rates-update'], {
        queryParams,
    });
}

goToMasterAvailabilityPage(ratesAndAvailability: RatesAndAvailability,otaName:string,bulkUpdate:boolean){
    let otaAvailability = new OtaAvailability();
    otaAvailability = this.getOtaAvailability(ratesAndAvailability,otaName);
    if (bulkUpdate == false) {
      otaAvailability.fromDate = ratesAndAvailability.date;
      otaAvailability.toDate = ratesAndAvailability.date;
      otaAvailability.noOfAvailable = this.getOtaInventoryCount(ratesAndAvailability, otaName);
      otaAvailability.otaName = otaName;
    } else {
      otaAvailability.fromDate = undefined;
      otaAvailability.toDate = undefined;
      otaAvailability.noOfAvailable = undefined;
      otaAvailability.otaName = otaName;
    }
    let navigationExtras: NavigationExtras = {
        queryParams: {
            data: JSON.stringify(otaAvailability),
          
        }
      };
    this.router.navigate(['availability-update'], navigationExtras);
}

getOtaAvailability(ratesAndAvailabilities: RatesAndAvailability,otaName:String){
    let otaAvailability: OtaAvailability;
    
      if (
        ratesAndAvailabilities.otaAvailabilityList != null &&
        ratesAndAvailabilities.otaAvailabilityList.length > 0
      ) {
        for (
          let j = 0;
          j < ratesAndAvailabilities.otaAvailabilityList.length;
          j++
        ) {
          if (ratesAndAvailabilities.otaAvailabilityList[j].otaName === otaName) {
            otaAvailability = ratesAndAvailabilities.otaAvailabilityList[j];
          }
          
        }
      
    }
    if (otaAvailability == undefined) {
      otaAvailability = new OtaAvailability();
    }
    return otaAvailability;
  }
toggleDropdown(outerIndex: number, innerIndex: number): void {
    if (!this.isDropdownOpen[outerIndex]) {
      this.isDropdownOpen[outerIndex] = {};
    }

    // Toggle the current dropdown
    this.isDropdownOpen[outerIndex][innerIndex] = !this.isDropdownOpen[outerIndex][innerIndex];

    // Close other dropdowns in the same outer index group
    Object.keys(this.isDropdownOpen[outerIndex]).forEach((key) => {
      if (Number(key) !== innerIndex) {
        this.isDropdownOpen[outerIndex][key] = false;
      
      }
    })}
  // Optionally close all dropdowns
//   closeAllDropdowns(): void {
//     this.isDropdownOpen = this.isDropdownOpen.map(() => false);
//   }

  

  OTAAvailabilityOfRateAndAvailability(roomRate){
    let navigationExtras: NavigationExtras = {
        queryParams: {
            data: JSON.stringify(roomRate),
          
        }
      };
    this.router.navigate(['ota-availability'], navigationExtras);
   
  }
  getOTAPlanCount(ratesAndAvailabilities: RatesAndAvailability) {
    let otaPlanCount = 0;
    if (
      ratesAndAvailabilities.roomRatePlans != null &&
      ratesAndAvailabilities.roomRatePlans.length > 0
    ) {
      for (let j = 0; j < ratesAndAvailabilities.roomRatePlans.length; j++) {
        otaPlanCount = otaPlanCount + ratesAndAvailabilities.roomRatePlans[j].otaPlanList.length;

      }
    }
    return otaPlanCount;
  }



  OTARateUpdate(roomRate){
    let navigationExtras: NavigationExtras = {
        queryParams: {
            data: JSON.stringify(roomRate),
          
        }
      };
    this.router.navigate(['ota-rates'], navigationExtras);
  }

  getPlanList(ratesAndAvailabilities: RatesAndAvailability[]) {

    let planList: PlanListInterface[];
    planList = [];
    for (let i = 0; i < ratesAndAvailabilities.length; i++) {
      if (
        ratesAndAvailabilities[i].roomRatePlans != null &&
        ratesAndAvailabilities[i].roomRatePlans.length > 0
      ) {
        for (
          let j = 0;
          j < ratesAndAvailabilities[i].roomRatePlans.length;
          j++
        ) {
          if (
            planList.some(
              (data) =>
                data.name === ratesAndAvailabilities[i].roomRatePlans[j].name &&
                data.code === ratesAndAvailabilities[i].roomRatePlans[j].code
            ) == false
          ) {
            const planData: PlanListInterface = {
              name: ratesAndAvailabilities[i].roomRatePlans[j].name,
              code: ratesAndAvailabilities[i].roomRatePlans[j].code,
            };
            planList.push(planData);
            
          }
        }
      }
    }
    return planList;
  }

  getPlanPrice(ratesAndAvailabilities: RatesAndAvailability, selectedPlan: any) {
    let planPrice = -1;

    if (
      ratesAndAvailabilities.roomRatePlans != null &&
      ratesAndAvailabilities.roomRatePlans.length > 0
    ) {
      for (let j = 0; j < ratesAndAvailabilities.roomRatePlans.length; j++) {
        if (
          selectedPlan.name === ratesAndAvailabilities.roomRatePlans[j].name &&
          selectedPlan.code === ratesAndAvailabilities.roomRatePlans[j].code
        ) {
          planPrice = ratesAndAvailabilities.roomRatePlans[j].amount;
        }
      }
    }

    return planPrice;
  }

  updateRateAndAvailabilityFor(ratesAndAvailability: RatesAndAvailability) {
    this.loader = true;
    this.availabilityService
      .updateRatesAvailability(ratesAndAvailability)
      .subscribe(
        (response) => {
          this.loader = false;
          this.presentToast(`Rates & Availabilities Updated`);
          this.changeDetectorRefs.detectChanges();
        },
        (error) => {
          this.loader = false;
        }
      );
  }

  getOtaNames(ratesAndAvailabilities: RatesAndAvailability[]){
    let otaNames: OTAPlan[];
    otaNames = [];
    for (let i = 0; i < ratesAndAvailabilities.length; i++) {
      if (
        ratesAndAvailabilities[i].roomRatePlans != null &&
        ratesAndAvailabilities[i].roomRatePlans.length > 0
      ) {
        for (
          let j = 0;
          j < ratesAndAvailabilities[i].roomRatePlans.length;
          j++
        ) {
          for (let k = 0; k < ratesAndAvailabilities[i].roomRatePlans[j].otaPlanList.length; k++) {
            if (otaNames.some((data) => data.otaName == ratesAndAvailabilities[i].roomRatePlans[j].otaPlanList[k].otaName) == false) {
                otaNames.push(ratesAndAvailabilities[i].roomRatePlans[j].otaPlanList[k]);
            }
          }
        }
      }
    }
    otaNames.sort((a, b) => {
      if (a.otaName < b.otaName) return -1;
      if (a.otaName > b.otaName) return 1;
      return 0;
  });
    return otaNames;
  }

  onBlurMethod(roomRate) {
    this.selectedInputIndex = -1;
    this.updateRateAndAvailabilityFor(roomRate);
  }

  onInputClickMethod(i) {
    this.selectedInputIndex = i;
  }

  onBlurMethodHold(roomRate) {
    this.selectedInputIndexHold = -1;
    this.updateRateAndAvailabilityFor(roomRate);
  }

  onInputClickMethodHold(i) {
    this.selectedInputIndexHold = i;
  }

  onBlurMethodSold(roomRate) {
    this.selectedInputIndexSold = -1;
    this.updateRateAndAvailabilityFor(roomRate);
  }

  onInputClickMethodSold(i) {
    this.selectedInputIndexSold = i;
  }

  onBlurMethodRoomPrice(roomRate) {
    this.selectedInputIndexRoomPrice = -1;
    this.updateRateAndAvailabilityFor(roomRate);
  }

  onInputClickMethodRoomPrice(i) {
  
    this.selectedInputIndexRoomPrice = i;
  }

  onBlurMethodTotalRoom(roomRate) {
    this.selectedInputIndexTotalRoom = -1;
    this.updateRateAndAvailabilityFor(roomRate);
  }

  onInputClickMethodTotalRoom(i) {
    this.selectedInputIndexTotalRoom = i;
  }

  getDayNumber(date: string) {
    if (date != null && date != "") {
      return new Date(date).getDay();
    } else {
      return -1;
    }
  }



  onEditRoomPlan(roomRate: RatesAndAvailability, planData) {
    let data: any;
    if (roomRate.roomRatePlans != null && roomRate.roomRatePlans.length > 0) {
      data = roomRate.roomRatePlans.find(
        (plan) => plan.name == planData.name && plan.code == planData.code
      );
    }

    if (data != undefined) {
        this.onAddOrUpdatePlanEdit(data,roomRate);
    }
  }

  onAddOrUpdatePlanEdit(row,  rateInfo)
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            room: JSON.stringify(this.room),
            permission : 5,
            plan:  JSON.stringify(row),
            date: JSON.stringify(rateInfo.date),
        }
      };
    this.router.navigate(['add-or-update-plan'], navigationExtras);
  }
  onSingleRoomBlock(row,otaAvailability:OtaAvailability,stopSell){
    let navigationExtras: NavigationExtras = {
        queryParams: {
            propertyId: this.room.propertyId,
            roomId: this.room.id,
            permission: "1",
            row: encodeURIComponent(JSON.stringify(otaAvailability)), 
            isChannelManager: this.isChannelManager,
            isBookingEngine: this.isBookingEngine,
            blockRoom: stopSell
        }
      };
    this.router.navigate(['stop-sell'], navigationExtras);
    // this.stopSellOtaName = [];
    // for (let i = 0; i < row.otaAvailabilityList.length; i++) {
    //     if (row.otaAvailabilityList[i].stopSell == true) {
    //         this.stopSellOtaName.push(row.otaAvailabilityList[i].otaName);
    //     }
             
    //  }
    // if( row.stopSellOTA === null ||  row.stopSellOTA === undefined)
    //     {
    //         row.stopSellOTA = false;
    //     }
    
    //     if( row.stopSellOBE === null ||  row.stopSellOBE === undefined)
    //     {
    //         row.stopSellOBE = false;
    //     }

    //     let DateList = [];
    //     DateList.push(this.dateService.convertMillisecondsToYYYMMDDFormat(row.date));
    //     if (stopSell == false) {
    //         if (this.stopSellOtaName?.indexOf(otaAvailability.otaName) > -1) {
    //             const index: number = this.stopSellOtaName?.indexOf(otaAvailability.otaName);
    //             if (index !== -1) {
    //               this.stopSellOtaName?.splice(index, 1);
    //             }
    //           }
    //     }
    //     this.availabilityService
    // .blockAndUnBlockAvailabilityForOTA(
    //   DateList,
    //   row.roomId,
    //   row.stopSellOBE,
    //   row.stopSellOTA,
    //   this.stopSellOtaName
    // )
    // .subscribe(
    //   (resp) => {
    //     this.loader = false;
    //     console.log("resp " + resp);

    //     if (row.stopSellOTA == true) {
    //       this.presentToast("Stop sell OTA Updated Successfully.");
    //     } else if (row.stopSellOBE == true) {
    //       this.presentToast("Stop sell OBE Updated Successfully.");
    //     } else if(row.stopSellOTA == false || row.stopSellOBE == false){
    //       this.presentToast("Stop sell Removed Successfully.");
    //     }
    //     this.roomItemEvent.emit("update-room");
    //     this.changeDetectorRefs.detectChanges();
    //   },
    //   (error) => {
    //     //this.openErrorSnackBar(`Fail.`);
    //     this.loader = false;
    //     this.roomItemEvent.emit("update-room");
    //   }
    // );

  }
  onBlockRoomEdit(row) {
    if( row.stopSellOTA === null ||  row.stopSellOTA === undefined)
    {
        row.stopSellOTA = false;
    }

    if( row.stopSellOBE === null ||  row.stopSellOBE === undefined)
    {
        row.stopSellOBE = false;
    }

    let DateList = [];
    DateList.push(this.dateService.convertMillisecondsToYYYMMDDFormat(row.date));
    this.stopSellOtaName = [];
    if (row.stopSellOTA == true) {
        for (let i = 0; i < row.roomRatePlans.length; i++) {
            if (row.roomRatePlans[i].otaPlanList.length > 0) {
             for (let j = 0; j < row.roomRatePlans[i].otaPlanList.length; j++) {
                 this.stopSellOtaName.push(row.roomRatePlans[i].otaPlanList[j].otaName)
             }
            }
         }
    }
    
    this.availabilityService
    .blockAndUnBlockAvailabilityForOTA(
      DateList,
      row.roomId,
      row.stopSellOBE,
      row.stopSellOTA,
      this.stopSellOtaName
    )
    .subscribe(
      (resp) => {
        this.loader = false;
        console.log("resp " + resp);

        if (row.stopSellOTA == true) {
          this.presentToast("Stop sell OTA Updated Successfully.");
        } else if (row.stopSellOBE == true) {
          this.presentToast("Stop sell OBE Updated Successfully.");
        } else if(row.stopSellOTA == false || row.stopSellOBE == false){
          this.presentToast("Stop sell Removed Successfully.");
        }
        this.roomItemEvent.emit("update-room");
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        //this.openErrorSnackBar(`Fail.`);
        this.loader = false;
        this.roomItemEvent.emit("update-room");
      }
    );
    
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 3000
    });
    toast.present();
  }

}
