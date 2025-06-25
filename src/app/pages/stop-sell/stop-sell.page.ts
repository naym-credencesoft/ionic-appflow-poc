import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, JsonPipe, Location } from "@angular/common";
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import { IonContent, NavController, ToastController } from '@ionic/angular';
import { Room } from 'src/app/model/room';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from 'src/app/service/property/property.service';
import { PropertiesOnlineTravelAgencies } from 'src/app/model/Booking/propertiesOTA';
import { OTAChannelPropertyDTO } from 'src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { OtaAvailability } from '../availability-update/otaAvailability';
import { AddSubscriptionService } from 'src/app/service/subscription-service.service';
import { Plan } from '../booking/plan';
import { OTANames } from 'src/app/model/OTANames';
import { CheckSubscription } from 'src/app/checkSubscription';

@Component({
  selector: 'app-stop-sell',
  templateUrl: './stop-sell.page.html',
  styleUrls: ['./stop-sell.page.scss'],
})
export class StopSellPage implements OnInit {
    @ViewChild(IonContent) content!: IonContent;
  noOfAvailbale = 0;
  rooms: Room[] = [];
  isProgressing: boolean = false;
  isViewOnly: boolean = false;
  selectedOption: string | null = 'custom';
  stopSellOBE:boolean = false;
  stopSellOBERelease:boolean = false;
  stopSellOTA:boolean = false;
  stopSellOTARelease:boolean = false;
  blockRoom: boolean = false;
  RoomType: FormControl = new FormControl();
  StopSellOBE: FormControl = new FormControl();
  StopSellOBERelease: FormControl = new FormControl();
  StopSellOTARelease: FormControl = new FormControl();
  StopSellOTA: FormControl = new FormControl();
  DateList: FormControl = new FormControl();
  DayChangeType: FormControl = new FormControl();
  rateAndAvailFromDate: FormControl = new FormControl("", [
    Validators.required,
  ]);
  rateAndAvailToDate: FormControl = new FormControl("", [
    Validators.required,
  ]);

  RoomName: FormControl = new FormControl("", [
    Validators.required,
  ]);



  addOrUpdateOTAAvailability: FormGroup = new FormGroup({
    rateAndAvailFromDate: this.rateAndAvailFromDate,
    rateAndAvailToDate: this.rateAndAvailToDate,
    roomName: this.RoomName,
    StopSellOBE: this.StopSellOBE,
    StopSellOTA: this.StopSellOTA,
    DateList: this.DateList,
    DayChangeType: this.DayChangeType,
  });

    addorupdateForm: FormGroup = new FormGroup({
    rateAndAvailFromDate: this.rateAndAvailFromDate,
    rateAndAvailToDate: this.rateAndAvailToDate,
    StopSellOBE: this.StopSellOBE,
    StopSellOTA: this.StopSellOTA,
    DateList: this.DateList,
    DayChangeType: this.DayChangeType,
    });
  roomName: any;
  otaNames:OTANames;
  roomnames: any;
  isView: boolean = false;
  propertyId: number;
  fromDate: string;
  toDate: string;
  roomId:number;
  plans:Plan[];
  daySelected: any[] = [];
  noOfDays: number | null = null;
  daysList = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  propertyOTA: PropertiesOnlineTravelAgencies[];
  dayChange:string="customO";
  OtaControll: FormControl = new FormControl();
  OtaControlls: FormArray;
  showdiv :boolean = false;
  isBookingjiniSubscription:boolean = false;
  isAirbnbSubscription:boolean = false;
  isBookingDotcomSubscription:boolean = false;
  isChannexSubscription:boolean = false;
  isBookoneChannelManager :boolean =false
  public model: any[] = [];
  toMinDate: string;
  travelAgencyName:any;
  maxToDate: string;
  toMaxDate: string;
    propertydetails: any;
    otaList: any;
    subscriptionSelected: any[];
    otaPlans: any[];
    selectedotaname: any;
    today: string;
    paramsData: any;
  constructor(public navCtrl: NavController,private cdr: ChangeDetectorRef,private route:ActivatedRoute,private checkSubscription: CheckSubscription, private token: TokenStorage, private propertyService: PropertyService,private subcriptionService: AddSubscriptionService,
    private changeDetectorRefs: ChangeDetectorRef,private fb: FormBuilder,private zone: NgZone,
    private acRoute: ActivatedRoute, private router: Router,
    private _location: Location, private toastController: ToastController, public datepipe: DatePipe, private availabilityService: AvailabilityService,) {
        this.plans = [];
this.travelAgencyName = [];
this.otaNames = new OTANames();
this.token.remove("fromDate");
 this.token.remove("toDate");
 this.route.queryParams.subscribe(params => {
        
    if (params['row']) {
        try {
            this.paramsData = JSON.parse(decodeURIComponent(params['row']));
            console.log("this.paramsData",this.paramsData)
            
            // this.showdiv = true
            // this.noOfRooms = this.roomDetails?.noOfRooms || 0;
        } catch (error) {
            console.error('Error parsing room details:', error);
        }
    }
});
  }

  ngOnInit() {
    this.OtaControlls = this.fb.array([]);
    this.rooms = this.token.getRoomTypes();
    this.propertyId = this.token.getProperty().id;
    this.getConfiguredPropertyDetailsByPropertyId(this.propertyId) ;
this.getSubscriptionForProperty(this.propertyId);
const now = new Date();
    this.today = now.toISOString().split('T')[0];

    // Initialize fromDate to today's date
    if(this.dayChange == "customO"){
        this.daySelected = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
    }  
    this.isBookoneChannelManager = this.checkSubscription.isSubscriptionMatch(
        this.checkSubscription.getBookoneChannelManager(),
        this.token.getProperty().subscriptionList
      );
  }
  otaselected(item: string, event: any) {
    if (event.detail.checked) {
      // Add to array if checked and not already present
      if (!this.travelAgencyName.includes(item)) {
        this.travelAgencyName.push(item);
      }
    } else {
      // Remove from array if unchecked
      this.travelAgencyName = this.travelAgencyName.filter(agency => agency !== item);
    }
  }
  fromDateChange(){
    // this.fromDate = this.today;
    if(this.fromDate && this.toDate) {
        let toDate = new Date(this.fromDate);

    this.toMinDate = this.fromDate;

    var fromDateObj = new Date(this.fromDate);
    fromDateObj.setDate(fromDateObj.getDate() + 14);
    this.toMaxDate = fromDateObj.toISOString().slice(0, 10);
    this.toDate = undefined;
    this.model = [];
    }
    
  }
  updateToDateLimit() {

    if (this.fromDate) {
      let startDate = new Date(this.fromDate);
      let maxDate = new Date(startDate);
      maxDate.setDate(startDate.getDate() + 90); // Add 90 days
  
      // Convert date to 'YYYY-MM-DD' format for ion-datetime
      this.maxToDate = maxDate.toISOString().split('T')[0];
      this.model = [];
      // Reset toDate if it exceeds the new maxToDate
      if (this.toDate && new Date(this.toDate) > maxDate) {
        this.toDate = this.maxToDate;
      }
    }
  }
  calculateDaysDifference() {
    if (this.fromDate && this.toDate) {
      const startDate = new Date(this.fromDate);
      const endDate = new Date(this.toDate);
  
      if (startDate && endDate) {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        this.noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
        // Generate and update model array
        this.model = this.getDatesBetween(
          new Date(this.datepipe.transform(startDate, "yyyy-MM-dd")),
          new Date(this.datepipe.transform(endDate, "yyyy-MM-dd"))
        );
      } else {
        this.noOfDays = 0;
        this.model = [];
      }
    } else {
      this.noOfDays = 0;
      this.model = [];
    }
  }
  
  toDateChange(){
    if((this.fromDate != null && this.fromDate != undefined) && (this.toDate != undefined && this.toDate != null)){
      let result = this.getDatesBetween(
        new Date(this.datepipe.transform(new Date(this.fromDate), "yyyy-MM-dd")),
        new Date(this.datepipe.transform(new Date(this.toDate), "yyyy-MM-dd"))
      );
      
      if (result != null && result != undefined && result.length > 0) {
        this.model = [];
        for (let i = 0; i < result.length; i++) {
          const date = result[i];
          const index = this._findDate(date);
          if (index === -1) {
            this.model.push(date);
          } else {
            this.model.splice(index, 1);
          }

        }
      }
    }
  }
  scrollToTop() {
    this.content.scrollToTop(500); // Scrolls to top with animation (500ms)
  }
  getConfiguredPropertyDetailsByPropertyId(propertyId: number) {

    // this.loader = true;
    this.otaList =[]
    this.propertyService
      .getConfiguredPropertyDetailsByPropertyId(propertyId)
      .subscribe(
        (data) => {
          this.propertydetails = data;
          this.propertydetails?.propertiesOnlineTravelAgencies.forEach(ele => {
            this.otaList.push(ele);
          });
          this.propertyOTA =
          data.propertiesOnlineTravelAgencies.filter(element => {
            return this.otaNames.bookoneCMOTANames.map(name => name.toLocaleLowerCase())
            .includes(element.onlineTravelAgencyName.toLocaleLowerCase());
          });
          if(this.paramsData){
            this.roomId = this.paramsData.roomId;
                this.fromDate = new Date(Number(this.paramsData.fromDate)).toISOString().split('T')[0];
                this.toDate = new Date(Number(this.paramsData.toDate)).toISOString().split('T')[0];
                const fromDate = new Date(this.fromDate);
                 const toDate = new Date(this.toDate);
                
                    if (fromDate && toDate) {
                        const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
                        this.noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                        // Generate and update model array
                        this.model = this.getDatesBetween(
                        new Date(this.datepipe.transform(fromDate, "yyyy-MM-dd")),
                        new Date(this.datepipe.transform(toDate, "yyyy-MM-dd"))
                        );
                    } else {
                        this.noOfDays = 0;
                        this.model = [];
                    }
                if(this.paramsData.stopSell == false) {
                    this.stopSellOTARelease = true;
                    this.updateStopSellOTAOne(this.stopSellOTARelease);
                    this.showdiv = true;
                    console.log("==================>gvgvg",this.propertyOTA);
                    this.propertyOTA.forEach(externalSite => {
                        externalSite?.onlineTravelAgencyName == this.paramsData?.otaName
                        if(this.paramsData?.otaName){
                            const customEvent = new CustomEvent('ionChange', { detail: { checked: true } });
                                this.otaselected(this.paramsData?.otaName, customEvent);
                        }
                        else{
                            this.otaselected(externalSite?.onlineTravelAgencyName, { detail: { checked: false } });
                        }
                    });
                    // this.OtaControll.setValue(
                    //     this.propertyOTA.some(item => item?.onlineTravelAgencyName === this.paramsData?.otaName)
                    //   );                      
                } else if (this.paramsData.stopSell == true){
                    this.stopSellOTA = true;
                    this.updateStopSellOTA(this.stopSellOTA);
                    this.showdiv = true;
                    this.propertyOTA.forEach(externalSite => {
                        externalSite?.onlineTravelAgencyName == this.paramsData?.otaName
                        if(this.paramsData?.otaName){
                            const customEvent = new CustomEvent('ionChange', { detail: { checked: true } });
                                this.otaselected(this.paramsData?.otaName, customEvent);
                        }
                        else{
                            this.otaselected(externalSite?.onlineTravelAgencyName, { detail: { checked: false } });
                        }
                    });
                }
        }
        },
        (error) => {        
        }
      );
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
        //   this.changeDetectorRefs.detectChanges();
        },
        (error) => {}
      );
  }
  dayTypeChange(){
    
    if (this.dayChange == 'toDay') {
        this.fromDate = this.datepipe.transform(
        new Date(),
        "yyyy-MM-dd"
      );
      this.toDate = this.datepipe.transform(
        new Date(),
        "yyyy-MM-dd"
      );
      const today = new Date().getDay() - 1;
      this.daySelected = [this.daysList[today]];
      this.isView = true;
      this.isViewOnly = false;
    }else if(this.dayChange == 'customO'){
      this.fromDate = undefined;
     this.toDate = undefined;
      this.daySelected = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
      this.isView = false;
      this.isViewOnly = false;
    }else if(this.dayChange == 'weekDays'){
      const weekDates = this.getCurrentWeekDates();
      this.fromDate = weekDates.fromDate;
      this.toDate = weekDates.toDate;
      this.daySelected = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"];
      this.isView = true;
      this.isViewOnly = false;
    }else if(this.dayChange == 'weekend'){
      const weekendDates = this.getCurrentWeekend();
      this.fromDate = weekendDates.saturday;
      this.toDate = weekendDates.sunday;
      this.daySelected = ["SATURDAY","SUNDAY"];
      this.isView = true;
      this.isViewOnly = false;
    }
  }

  setSelectedDateRangeonbasisOfAction() {
    try {
      const fromDate = new Date(this.addOrUpdateOTAAvailability.controls["rateAndAvailFromDate"].value);
      const toDate = new Date(this.addOrUpdateOTAAvailability.controls["rateAndAvailToDate"].value);
      // Set time to 00:00:00 to avoid issues with time zone or time components
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      this.model = [];
      if (fromDate <= toDate) {
        let currentDate = new Date(fromDate);
        while (currentDate <= toDate) {
          const dateString = this.datepipe.transform(currentDate, "yyyy-MM-dd");
          if (dateString && !this.model.includes(dateString)) {
            this.model.push(dateString);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    } catch (error) {
      console.error("Error in setSelectedDateRangeonbasisOfAction : ", error);
    }
  }

  getCurrentWeekend(): { saturday: string; sunday: string } {
    const today = new Date();

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = today.getDay();

    // Calculate the difference to Saturday (6) and Sunday (0)
    const diffToSaturday = 6 - currentDay; // Days until Saturday
    const diffToSunday = currentDay === 0 ? 0 : 7 - currentDay; // Days until Sunday

    // Get Saturday and Sunday dates
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + diffToSaturday);

    const sunday = new Date(today);
    sunday.setDate(today.getDate() + diffToSunday);

    // Format the dates as YYYY-MM-DD
    const formatDate = (date: Date) =>
      date.toISOString().split('T')[0]; // "YYYY-MM-DD"

    return {
      saturday: formatDate(saturday),
      sunday: formatDate(sunday),
    };
  }
 
  daySelection(day) {
    if (this.isView === false) {
      if (this.daySelected.indexOf(day) != -1) {
        this.daySelected.splice(this.daySelected.indexOf(day), 1);
      } else {
        this.daySelected.push(day);
      }
    }
  }
  checkWeekDays(day) {
    let check: boolean = false;
    if (this.daySelected.indexOf(day) != -1) {
      check = true;
    }
    return check;
  }
 
getCurrentWeekDates(): { fromDate: string; toDate: string } {
    const today = new Date();

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = today.getDay();

    // Calculate the difference to the start (Monday) and end (Friday) of the week
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay; // If today is Sunday, adjust to get Monday
    const diffToFriday = currentDay === 0 ? -2 : 5 - currentDay; // Adjust for Friday

    // Get the start (Monday) and end (Friday) of the week
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const friday = new Date(today);
    friday.setDate(today.getDate() + diffToFriday);

    // Format the dates (YYYY-MM-DD)
    const formatDate = (date: Date) =>
      date.toISOString().split('T')[0]; // "YYYY-MM-DD"

    return {
      fromDate: formatDate(monday), // Start of the week (Monday)
      toDate: formatDate(friday),   // End of the workweek (Friday)
    };
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


  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }

//   public remove(date: Date): void {
//     const index = this._findDate(date);
//     this.model.splice(index, 1);

//     if(this.model.length == 0){
//       this.rateAndAvailFromDate.reset();
//       this.rateAndAvailToDate.reset();
//       this.StopSellOTA.reset();
//       this.StopSellOBE.reset();
//       this.StopSellOBERelease.reset();
//       this.StopSellOTARelease.reset();
//     }
//   }

  ionViewDidEnter(){
    if(!this.paramsData) {
        this.addOrUpdateOTAAvailability.reset();
        this.rateAndAvailFromDate.reset();
        this.rateAndAvailToDate.reset();
        this.StopSellOTA.reset();
        this.StopSellOBE.reset();
        this.StopSellOBERelease.reset();
        this.StopSellOTARelease.reset();
    }
   
  }

  reset(){

    this.showdiv = false;
    this.addOrUpdateOTAAvailability.reset();
    this.rateAndAvailFromDate.reset();
    this.rateAndAvailToDate.reset();
    this.StopSellOTA.reset();
    this.StopSellOBE.reset();
    this.stopSellOTA = false;
    this.stopSellOBE = false;
    this.StopSellOBERelease.reset();
    this.StopSellOTARelease.reset();
    this.stopSellOBERelease = false;
    this.stopSellOTARelease = false;
    this.dayChange = 'customO'
  }

  updateStopSellOBE(stopSellOBE) {
    this.stopSellOBE = stopSellOBE;
    this.blockRoom = true;
    this.changeDetectorRefs.detectChanges();
  }

  updateStopSellOBEOne(stopSellOBERelease) {
    this.stopSellOBERelease = stopSellOBERelease;
    this.blockRoom = false;
    this.changeDetectorRefs.detectChanges();
  }

  updateStopSellOTA(stopSellOTA: boolean) {
  
    this.stopSellOTA = stopSellOTA;
    if (stopSellOTA) {
      this.showdiv = true;
      this.blockRoom = true;
           // Select all checkboxes
      if(this.paramsData?.otaName){
        this.otaselected(this.paramsData?.otaName, { detail: { checked: true } });
      }else{
        this.propertyOTA.forEach(externalSite => {
            this.otaselected(externalSite?.onlineTravelAgencyName, { detail: { checked: true } });
          });
             // Update form control
      this.OtaControll.setValue(this.propertyOTA.map(() => true));
      }
 
     
  
   
    } else {
      this.showdiv = false;
      this.blockRoom = false;
  
            // Select all checkboxes
            if(this.paramsData?.otaName){
                this.otaselected(this.paramsData?.otaName, { detail: { checked: false } });
              }else{
                this.propertyOTA.forEach(externalSite => {
                    this.otaselected(externalSite?.onlineTravelAgencyName, { detail: { checked: false } });
                  });
                     // Update form control
              this.OtaControll.setValue(this.propertyOTA.map(() => false));
              }
            }
  
    this.changeDetectorRefs.detectChanges();
  }
  
  
  updateStopSellOTAOne(stopSellOTARelease: boolean) {
    this.stopSellOTARelease = stopSellOTARelease;
    if (stopSellOTARelease) {
      this.showdiv = true;
      this.blockRoom = false;
      if(this.paramsData?.otaName){
        this.otaselected(this.paramsData?.otaName, { detail: { checked: true } });
      }else{
        this.propertyOTA.forEach(externalSite => {
            this.otaselected(externalSite?.onlineTravelAgencyName, { detail: { checked: true } });
          });
             // Update form control
      this.OtaControll.setValue(this.propertyOTA.map(() => true));
      }
 
    } else {
      this.showdiv = false;
      this.blockRoom = false;

      if(this.paramsData?.otaName){
        this.otaselected(this.paramsData?.otaName, { detail: { checked: false } });
      }else{
        this.propertyOTA.forEach(externalSite => {
            this.otaselected(externalSite?.onlineTravelAgencyName, { detail: { checked: false } });
          });
             // Update form control
      this.OtaControll.setValue(this.propertyOTA.map(() => false));
      }
 
    }
    this.changeDetectorRefs.detectChanges();
  }

  goback() {
    this._location.back();
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
  
  
  isDisabled() {
   
    if (
        ((this.travelAgencyName.length != 0 && this.stopSellOTA) || ((this.travelAgencyName.length != 0 && this.stopSellOTA && this.stopSellOBE)) || (!this.stopSellOTA && this.stopSellOBE)) ||
        ((this.travelAgencyName.length != 0 && !this.stopSellOTA && this.stopSellOTARelease) || (!this.stopSellOTA && this.stopSellOBERelease))
        && this.addOrUpdateOTAAvailability.valid && this.model.length >= 1) {
      return false;
    }else if (
        ((this.travelAgencyName.length != 0 && this.stopSellOTARelease) 
        || ((this.travelAgencyName.length != 0 && this.stopSellOTARelease && this.stopSellOBERelease)) 
        || (!this.stopSellOTARelease && this.stopSellOBERelease)) ||
        ((this.travelAgencyName.length != 0 && !this.stopSellOTA && this.stopSellOTARelease) 
        || (!this.stopSellOTA && this.stopSellOBERelease))
        && this.addorupdateForm.valid && this.model.length >= 1) {
      return false; 
         } else {
      return true;
    }
  }
  isDisabledOne() {
    if (
        ((this.travelAgencyName.length != 0 && this.stopSellOTA) 
        || ((this.travelAgencyName.length != 0 && this.stopSellOTA && this.stopSellOBE)) 
        || (!this.stopSellOTA && this.stopSellOBE)) ||
        ((this.travelAgencyName.length != 0 && !this.stopSellOTA && this.stopSellOTARelease) 
        || (!this.stopSellOTA && this.stopSellOBERelease))
        && this.addorupdateForm.valid && this.model.length >= 1) {
      return false;
    } else if (
        ((this.travelAgencyName.length != 0 && this.stopSellOTARelease) 
        || ((this.travelAgencyName.length != 0 && this.stopSellOTARelease && this.stopSellOBERelease)) 
        || (!this.stopSellOTARelease && this.stopSellOBERelease)) ||
        ((this.travelAgencyName.length != 0 && !this.stopSellOTA && this.stopSellOTARelease) 
        || (!this.stopSellOTA && this.stopSellOBERelease))
        && this.addorupdateForm.valid && this.model.length >= 1) {
      return false; 
         } else {
      return true;
    }
  }
  setRoomId(roomId) {
    let room = this.rooms.filter((res) => res.id === roomId);
    this.roomName = room[0].name;
    
  }
  selectTab(option: string) {
    this.zone.run(() => {
        this.selectedOption = option;
      });
    this.reset();
    this.dayChange = 'customO';
    this.dayTypeChange();
    this.cdr.detectChanges();
  }

//   onSubmit() {
//     this.isProgressing = true;
//     let DateList = [];
//     for (let i = 0; i < this.model.length; i++) {
//       DateList.push(this.datepipe.transform(this.model[i], "yyyy-MM-dd"));
//     }
 
// //    stopSellArray = 
//     if (DateList.length != 0 && DateList.length === this.model.length) {
//       this.availabilityService
//         .blockAndUnBlockAvailabilityForOTA(
//           DateList,
//           this.roomId,
//           this.stopSellOBE,
//           this.stopSellOTA,
//           this.travelAgencyName
//         )
//         .subscribe(
//           (resp) => {
//             this.isProgressing = false;
//             if (this.stopSellOTA == true) {
//               this.presentToast("Stop sell OTA Updated Successfully", 'success');
//             } else if (this.stopSellOBE == true) {
//               this.presentToast("Stop sell OBE Updated Successfully", 'success');
//             }

//             if (this.stopSellOTA === true && this.stopSellOBE === true) {
//               this.presentToast("Stop sell OTA And OBE Updated Successfully", 'success');
//             }
            
//             this.navCtrl.navigateForward("rate-and-availability");
//           },
//           (error) => {
//             if (this.stopSellOTA == true) {
//               this.presentToast("Stop sell OTA/OBE Update Failed", 'failed');
//             } else if (this.stopSellOBE == true) {
//               this.presentToast("Stop sell OBE Update Failed", 'success');
//             }

//             if (this.stopSellOTA === true && this.stopSellOBE === true) {
//               this.presentToast("Stop sell OTA And OBE Update Failed", 'success');
//             }
//             this.isProgressing = false;
//           }
//         );
//     }
//   }

  onSubmit() {
    this.scrollToTop();
    this.isProgressing = true;
    let DateList = [];
    for (let i = 0; i < this.model.length; i++) {
      DateList.push(this.datepipe.transform(this.model[i], "yyyy-MM-dd"));
    }

    if (DateList.length != 0 && DateList.length === this.model.length) {
      if (this.stopSellOTA == true || this.stopSellOBE == true) {
      this.availabilityService
        .blockAvailability(
          DateList,
          this.roomId,
          this.stopSellOBE,
          this.stopSellOTA,
          this.travelAgencyName,
          this.daySelected
        )
        .subscribe(
          (resp) => {
            this.isProgressing = false;
            // localStorage.setItem("fromDate", this.datepipe.transform(this.fromDate, "yyyy-MM-dd"));
            // localStorage.setItem("toDate", this.datepipe.transform(this.toDate, "yyyy-MM-dd"));

            this.presentToast("Room Availability Update Successfully.", 'success');
            this.router.navigateByUrl('/stop-sell', { skipLocationChange: true }).then(() => {
                this.router.navigate(["rate-and-availability"]);
              });
            // this.dialogRef.close({ event: "update" });
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            //this.openErrorSnackBar(`Fail.`);
            this.presentToast("Failed to update room availability. Please try again.", "danger");
            this.isProgressing = false;
            // this.dialogRef.close({ event: "update" });
          }
        );

      }

      if (this.stopSellOBERelease == true || this.stopSellOTARelease == true) {
        this.availabilityService
        .unBlockAvailability(
          DateList,
          this.roomId,
          this.stopSellOBERelease,
          this.stopSellOTARelease,
          this.travelAgencyName,
          this.daySelected
        )
        .subscribe(
          (resp) => {
            this.isProgressing = false;
            // localStorage.setItem("fromDate", this.datepipe.transform(this.fromDate, "yyyy-MM-dd"));
            // localStorage.setItem("toDate", this.datepipe.transform(this.toDate, "yyyy-MM-dd"));
            
            this.presentToast("Room Availability Update Successfully.", 'success');
            this.router.navigateByUrl('/stop-sell', { skipLocationChange: true }).then(() => {
                this.router.navigate(["rate-and-availability"]);
              });
            // this.dialogRef.close({ event: "update" });
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            //this.openErrorSnackBar(`Fail.`);
            this.presentToast("Failed to update room availability. Please try again.", "danger");
            this.isProgressing = false;
            // this.dialogRef.close({ event: "update" });
          }
        );
      }
    }
  }

  onSubmitOne() {
    this.scrollToTop();
    this.isProgressing = true;
    let DateList = [];
    for (let i = 0; i < this.model.length; i++) {
      DateList.push(this.datepipe.transform(this.model[i], "yyyy-MM-dd"));
    }

    if (DateList.length != 0 && DateList.length === this.model.length) {
      if (this.blockRoom == true) {
      this.availabilityService
        .blockPropertyAvailability(
          DateList,
          this.propertyId,
          this.stopSellOBE,
          this.stopSellOTA,
          this.travelAgencyName,
          this.daySelected
        )
        .subscribe(
          (resp) => {
            this.isProgressing = false;
            // localStorage.setItem("fromDate", this.datepipe.transform(this.fromDate, "yyyy-MM-dd"));
            // localStorage.setItem("toDate", this.datepipe.transform(this.toDate, "yyyy-MM-dd"));

            this.presentToast("Property Availability Update Successfully.", 'success');
            this.router.navigateByUrl('/stop-sell', { skipLocationChange: true }).then(() => {
                this.router.navigate(["rate-and-availability"]);
              });
            // this.dialogRef.close({ event: "update" });
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            //this.openErrorSnackBar(`Fail.`);
            this.presentToast("Failed to update property availability. Please try again.", "danger");
            this.isProgressing = false;
            // this.dialogRef.close({ event: "update" });
          }
          
        );
        
      } else if (this.blockRoom == false) {
        this.availabilityService
        .UnblockPropertyAvailability(
          DateList,
          this.propertyId,
          this.stopSellOBERelease,
          this.stopSellOTARelease,
          this.travelAgencyName,
          this.daySelected
        )
        .subscribe(
          (resp) => {
            this.isProgressing = false;
            // localStorage.setItem("fromDate", this.datepipe.transform(this.fromDate, "yyyy-MM-dd"));
            // localStorage.setItem("toDate", this.datepipe.transform(this.toDate, "yyyy-MM-dd"));
            
            this.presentToast("Property Availability Update Successfully.", 'success');
            this.router.navigateByUrl('/stop-sell', { skipLocationChange: true }).then(() => {
                this.router.navigate(["rate-and-availability"]);
              });
            // this.dialogRef.close({ event: "update" });
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            //this.openErrorSnackBar(`Fail.`);
            this.presentToast("Failed to update property availability. Please try again.", "danger");
            this.isProgressing = false;
            // this.dialogRef.close({ event: "update" });
          }
        );
       
      }
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  onCancel(){
    this.navCtrl.back();
  }

  getDatesBetween = (startDate, endDate) => {
    let dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(Number(currentDate.getTime()));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

}
