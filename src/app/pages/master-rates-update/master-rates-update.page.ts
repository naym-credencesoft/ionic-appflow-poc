
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, JsonPipe, Location } from "@angular/common";
import { IonContent, NavController, ToastController } from '@ionic/angular';
import { Room } from 'src/app/model/room';
import { TokenStorage } from 'src/app/token.storage';
import { PropertyService } from 'src/app/service/property/property.service';
import { OTAChannelPropertyDTO } from 'src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { PropertiesOnlineTravelAgencies } from 'src/app/model/Booking/propertiesOTA';
import { Plan } from '../booking/plan';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { OTANames } from 'src/app/model/OTANames';
import { ActivatedRoute } from '@angular/router';
import { OTAPlan } from 'src/app/model/otaPlan/otaPlan';

@Component({
  selector: 'app-master-rates-update',
  templateUrl: './master-rates-update.page.html',
  styleUrls: ['./master-rates-update.page.scss'],
})
export class MasterRatesUpdatePage implements OnInit {
 @ViewChild(IonContent) content!: IonContent;
  noOfAvailbale= 0;
  rooms: Room[] = [];
  planToBeUpdated: Plan[];
  plan: Plan;
  fromDateToString: string = '';
  toDateToString: string = '';
  decreaseRate: number = 0;
  increaseRate:number = 0;
  form: FormGroup;
  showCheckboxes = false;
  planNames:any[] = [];
  isProgressing: boolean = false
  maxToDate: string = ""; 

  otaPlans :any;
 
  loader: boolean = false;
  selectedOption: string | null = '';

    rateAndAvailFromDate: FormControl = new FormControl("", [
        Validators.required,
      ]);
      rateAndAvailToDate: FormControl = new FormControl("", [
        Validators.required,
      ]);

      
      RoomName: FormControl = new FormControl("", [
        Validators.required,
      ]);
  
      PlanAmount: FormControl = new FormControl("");
      OtaControll: FormControl = new FormControl();
      PlanUpdateType: FormControl = new FormControl("");
      DecreaseRate: FormControl = new FormControl("");
      IncreaseRate: FormControl = new FormControl("");
      DayChangeType: FormControl = new FormControl("");
      PlanName: FormControl = new FormControl("", [
        Validators.nullValidator,
      ]);
      CustomAmount: FormControl = new FormControl("");
      masterPlanUpdateForm: FormGroup = new FormGroup({
        rateAndAvailFromDate: this.rateAndAvailFromDate,
        rateAndAvailToDate: this.rateAndAvailToDate,
        RoomName: this.RoomName,
        PlanUpdateType: this.PlanUpdateType,
        IncreaseRate: this.IncreaseRate,
        DecreaseRate: this.DecreaseRate,
        DayChangeType: this.DayChangeType,
        PlanName: this.PlanName,
        CustomAmount: this.CustomAmount,
      });
    
  daysList = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
    otaList: any[];
    isBookoneChannelManager:boolean = false;
    roomName: any;
    roomnames: any;
  singleDateToBeUpdate:string;

    propertyId: number;
    propertydetails: OTAChannelPropertyDTO;
    propertyOTA: PropertiesOnlineTravelAgencies[];
    applicableToOta: boolean = false;
    applicableToPMS: boolean = false;
    roomnamesone: Room[];
    selectedOtaNames: string[];
    data: Plan[];
    plans:Plan[];
    plansFilter: Plan[];
    selectedotaname: any;
    customAmount: number = 0;
    icon:string;
    showPlanDetails:boolean = false;
    editMode:boolean = false;
    selectedRow: number;
    otaplan:any;
  amount2: number;
  planName2: string;
  disableOta:boolean = false;

  subscriptionSelected: any[];
  updateType:string = "customRate";
  isBookingjiniSubscription:boolean = false;
  isAirbnbSubscription:boolean = false;
  isBookingDotcomSubscription:boolean = false;
  isChannexSubscription:boolean = false;
  shouldSetRoomId: boolean = true;
  noOfRooms:number = 0;
  noOfDays: number | null = null;
  otaNames:OTANames;
  otaPlan:OTAPlan;
  planList: Plan[];
    roomDetails: any;
    disableColumns: boolean = false;
    otaPlanslist: Plan;
    otaPlanDetails: any;
    dayChange:string="custom";
  isView: boolean = false;
  isViewOnly: boolean = false;
  myForm = new FormGroup({
    dayChange: new FormControl('') // Default value can be set here
  });
    daySelected: any[] = [];
    roomTypeId: any;
    showdiv: boolean = false;
    otaName: any;
    otaInventoryCount: any;
  constructor(public navCtrl: NavController,
    public token: TokenStorage,   private propertyService: PropertyService,
    private _location: Location,
     private toastController: ToastController,   public datepipe: DatePipe,
     private bookingService: BookingService,private route:ActivatedRoute,
   private changeDetectorRefs: ChangeDetectorRef) { 

    this.otaList = [];
    this.otaPlans =[];
    this.plans = [];
    this.otaPlanDetails =[];
    this.plan = new Plan();
    this.otaPlanslist = new Plan();
    this.roomnamesone = this.token.getRoomTypes();
    this.route.queryParams.subscribe(params => {
        if (params['room']) {
            try {
                this.roomDetails = JSON.parse(decodeURIComponent(params['room']));
                this.showdiv = true
                this.noOfRooms = this.roomDetails?.noOfRooms || 0;
            } catch (error) {
                console.error('Error parsing room details:', error);
                // Handle invalid JSON, e.g., set default values
            }
        }
        
        const date = decodeURIComponent(params['date']);
        if (date) {
            this.fromDateToString =this.datepipe.transform(
                date,
                "yyyy-MM-dd"
              );
            
             this.toDateToString = this.datepipe.transform(
                date,
                "yyyy-MM-dd"
              )
        } else {
            console.error('Invalid date format:', date);
            // Handle invalid date
        }
        
        this.otaPlanDetails = []; // Initialize the details array
        if (params['otaplan']) {
        // Decode the 'otaplan' parameter
        this.otaplan = decodeURIComponent(params['otaplan']);
        
        // If 'otaplan' is a stringified JSON, parse it
        try {
          this.otaplan = JSON.parse(this.otaplan);
        } catch (e) {
          console.error('Failed to parse otaplan:', e);
        }
        // Iterate through the roomRatePlans and push otaPlanList into otaPlanDetails
        this.otaPlanDetails.push(this.otaplan);
    }
    if (params['otaName']) {
       this.otaName = decodeURIComponent(params['otaName'])
    }

    if (params['otaInventoryCount']) {
        this.otaInventoryCount = decodeURIComponent(params['otaInventoryCount'])
     }
        
    });

    this.rooms = this.token.getRoomTypes();
    this.propertyId = this.token.getProperty().id;
    this.PlanUpdateType.setValue(this.updateType);
    this.otaNames = new OTANames();
  }

  ngOnInit() {
    if (this.otaplan != null && this.otaplan != undefined) {
        this.otaPlan = this.otaplan;
    }
    if (this.roomDetails && this.roomDetails.id) {
        this.plan.roomTypeId = this.roomDetails.id; 
        this.roomTypeId = this.roomDetails.id; // or RoomName = this.roomDetails.id;
      }
      if (this.otaName != null && this.otaName != undefined) {
        this.otaselected(true,this.otaName);
      }
      if(this.dayChange == "custom"){
        this.daySelected = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
      }
      if(this.propertyId != null && this.propertyId != undefined && this.roomTypeId != null && this.roomTypeId != undefined){
        this.getPlan(String(this.propertyId),String(this.roomTypeId));
      }
      
      this.disableOta = true;
    
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
  scrollToTop() {
    this.content.scrollToTop(500); // Scrolls to top with animation (500ms)
  }
  radioChange(event: CustomEvent){
    
    this.updateType = event.detail.value;
    this.changeDetectorRefs.detectChanges();
    if(this.updateType == 'customRate'){
      this.disableColumns = false;
      this.increaseRate = 0;
      this.decreaseRate = 0;
      this.customAmount = 0;
    } else if (this.updateType == 'increaseRate' || this.updateType == 'decreaseRate') {
      this.disableColumns = true;
      this.increaseRate = 0;
      this.decreaseRate = 0;
      this.customAmount = 0;
    } else if (this.updateType == 'customerRateUpdate') {
        this.disableColumns = true;
        this.increaseRate = 0;
        this.decreaseRate = 0;
        this.customAmount = 0;
      }
    // this.onPlanChange();
    // this.getConfiguredPropertyDetailsByPropertyId(this.propertyId);
   
  }
  dayTypeChange(event: any){
    this.dayChange = event.detail.value;
    if (this.dayChange == 'toDay') {
        this.fromDateToString = this.datepipe.transform(
        new Date(),
        "yyyy-MM-dd"
      );
      this.toDateToString = this.datepipe.transform(
        new Date(),
        "yyyy-MM-dd"
      );
      const today = new Date().getDay() - 1;
      this.daySelected = [this.daysList[today]];
      this.isView = true;
      this.isViewOnly = false;
    }else if(this.dayChange == 'custom'){
      this.fromDateToString = undefined;
     this.toDateToString = undefined;
      this.daySelected = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
      this.isView = false;
      this.isViewOnly = false;
    }else if(this.dayChange == 'weekDays'){
      const weekDates = this.getCurrentWeekDates();
      this.fromDateToString = weekDates.fromDate;
      this.toDateToString = weekDates.toDate;
      this.daySelected = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"];
      this.isView = true;
      this.isViewOnly = false;
    }else if(this.dayChange == 'weekend'){
      const weekendDates = this.getCurrentWeekend();
      this.fromDateToString = weekendDates.saturday;
      this.toDateToString = weekendDates.sunday;
      this.daySelected = ["SATURDAY","SUNDAY"];
      this.isView = true;
      this.isViewOnly = false;
    }
  }
   onPlanChange(){
    this.loader = true;

    let searchResult;
      this.plans = this.plansFilter;
      this.plans = this.plans?.filter((item)=>{
        searchResult =
        (this.planNames === null ||
          this.planNames === undefined ||
          this.planNames.length === 0 ||
          (this.planNames != null &&
            this.planNames != undefined &&
            this.planNames.length > 0 &&
            item.name != null &&
            item.name != undefined &&
            this.planNames.some(
              (m) => m.toLowerCase() === item.name.toLowerCase()
            ) === true &&
            this.planNames.filter((m) => this.checkPlans(m))));
            return searchResult;
      });


    if(this.planNames.length > 0 && this.plans.length > 0){
      this.extractOtaPlanFromBasePlan();
    } else {
      this.otaPlans = [];
    //   this.dataSource = new MatTableDataSource(this.otaPlans);
    }
    this.loader = false;

  }
  
  extractOtaPlanFromBasePlan(){
    this.otaPlans = [];
    for (let index = 0; index < this.plans.length; index++) {
      const element = this.plans[index];
      if (this.planNames.length < this.plans.length) {
        this.planNames.push(element.name);
      }

      element.otaPlanList.forEach((e) => this.otaPlans.push(e));
      if (this.otaPlan != null && this.otaPlan != undefined) {
        this.otaPlans = this.otaPlans.filter(e => (e.planName == this.otaPlan.planName && e.otaName == this.otaPlan.otaName));
        //single plan update
        if (this.singleDateToBeUpdate != undefined && this.singleDateToBeUpdate != null && this.otaPlans.length > 0) {
          this.otaPlans.forEach((ota)=>{
            ota.price = this.otaPlan.price;
          });
        }
      }
    }
    // this.dataSource = new MatTableDataSource(this.otaPlans);
  }
    checkPlans(data){
    return (
      this.plans.some(
        (m) =>
          m.name != null &&
          m.name != undefined &&
          m.name.toLowerCase() === data.toLowerCase()
      ) === true
    );
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
  calculateDaysDifference() {
    if (this.fromDateToString) {
        const startDate = new Date(this.fromDateToString);
        const maxDate = new Date(startDate);
        maxDate.setMonth(maxDate.getMonth() + 3); // Add 3 months
        this.maxToDate = maxDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    if (this.fromDateToString && this.toDateToString) {
        const startDate = new Date(this.fromDateToString);
        const endDate = new Date(this.toDateToString);

        if (startDate && endDate) {
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            this.noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } else {
            this.noOfDays = 0;
        }
    } else {
        this.noOfDays = 0;
    }
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


  ionViewWillEnter(){
    this.propertyId =this.token.getProperty().id;
    this.getConfiguredPropertyDetailsByPropertyId(this.propertyId);
    this.getSubscriptionForProperty(this.propertyId);
    this.shouldSetRoomId = true;
  }

  onCheckboxChange(option: string) {
    if (option == "updateAllOTAs") {
      //Add all the plans in the otaplan list
      this.otaPlans = [];
      if (this.plans.length > 0) {
          for (let index = 0; index < this.plans.length; index++) {
        const element = this.plans[index];
        element?.otaPlanList
          .filter((e) => this.propertyOTA.some(ota => ota.onlineTravelAgencyName === e.otaName))
          .forEach((filteredPlan) => this.otaPlans?.push(filteredPlan));
      }

      this.propertyOTA?.forEach(ele => {
        this.otaList.push(ele.onlineTravelAgencyName);
      });
      }
    
    } else{
      this.otaPlans = [];
      this.otaList = [];
    }

    if (this.selectedOption === option) {
     
      this.selectedOption = null;
    } else {

      this.selectedOption = option;
      this.showCheckboxes = false; 
    }

  }

  resetSelection() {
    this.selectedOption = ''; 
    this.showCheckboxes = false; 
  }

  onCheckboxReset(option: string) {
    if (this.selectedOption === option) {
     
      this.selectedOption = null;
    } else {

        this.selectedOption = null;
    }
  }
  
  getSubscriptionForProperty(propertyId: number) {
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
            for (let i = 0; i < this.subscriptionSelected.length; i++) {
              if (
                this.subscriptionSelected[i].name === "Bookone channel manager"
              ) {
                this.isBookoneChannelManager = true;
              }
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
          
        },
        (error) => {}
      );
  }

  toggleCheckboxes() {
    this.showCheckboxes = !this.showCheckboxes;
  }

  goback(){
    this._location.back(); 
  }
  getConfiguredPropertyDetailsByPropertyId(propertyId: number) {
    this.loader = true;
    this.propertyService
      .getConfiguredPropertyDetailsByPropertyId(propertyId)
      .subscribe(
        (data) => {
          this.propertydetails = data;

          this.propertyOTA =
          data.propertiesOnlineTravelAgencies.filter(element => {
            return this.otaNames.bookoneCMOTANames.map(name => name.toLocaleLowerCase())
            .includes(element.onlineTravelAgencyName.toLocaleLowerCase());
          });

          this.loader = false;
        
        },
        (error) => {
          this.loader = false;
        
        }
      );
  }

  getOtaImageUrl(otaName: String) {
    let otaLogoUrl = null;
    for (let i = 0; i < this.propertydetails?.propertiesOnlineTravelAgencies.length; i++) {
      if (this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyName.toLocaleLowerCase() == otaName.toLocaleLowerCase()) {
        if (this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyLogoUrl != null &&
          this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyLogoUrl != " "
        ) {
          otaLogoUrl = this.propertydetails?.propertiesOnlineTravelAgencies[i]?.onlineTravelAgencyLogoUrl;
        }
        
      }
    }
    return otaLogoUrl;
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

  isDisabled() {
    if (
      this.masterPlanUpdateForm.valid == true &&
      ((this.otaList.length >= 1 && this.isBookoneChannelManager === true))
    ) {
      return false;
    } else {
      return true;
    }
  }

  setRoomId(roomId){
    this.noOfRooms = 0;
    this.noOfRooms = this.rooms.find((room)=> room.id == roomId).noOfRooms;
   
    if (this.shouldSetRoomId) {
      this.getPlan(String(this.propertyId), String(roomId));
    }
    this.getConfiguredPropertyDetailsByPropertyId(this.propertyId);
    // this.resetSelection();
  }

  getPlan(propertyId:string,roomId:string) {
    this.loader = true;
    this.propertyService
      .getPlan(propertyId, roomId)
      .subscribe(
        (data) => {
          this.data = data.body;
          this.plans = this.data.filter((plan)=>plan.otaPlanList?.length > 0);
          this.loader = false;
          if (this.otaPlan != null && this.otaPlan.bookonePlanCode != null) {
            this.plans = this.plans.filter(plan => plan.code == this.otaPlan.bookonePlanCode);
          }
          this.plansFilter = this.plans;
          this.planList = this.plans;

          this.extractOtaPlanFromBasePlan();


          this.changeDetectorRefs.detectChanges();
        },
        (error) => {
          this.loader = false;
        }
      );
  }
  reset() {
    this.masterPlanUpdateForm.reset();
    this.plans = [];
    this.otaList = [];
    this.otaPlans = [];
    this.propertyOTA = [];
    this.OtaControll.reset();
    this.resetSelection();
    this.noOfRooms = 0;
  }
  otaselected(isChecked: boolean, item: string) {
    if (isChecked) {
        if (!this.otaList.includes(item)) {
            this.otaList.push(item);
        }
    } else {
        const index = this.otaList.indexOf(item);
        if (index > -1) {
            this.otaList.splice(index, 1);
        }
    }

    // Alternative to `flatMap()`
    this.otaPlans = this.plans.reduce((acc, plan) => {
        const filteredPlans = plan.otaPlanList.filter(e => this.otaList.includes(e.otaName));
        return acc.concat(filteredPlans);
    }, []);

    this.selectedotaname = item;
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


  toggleDetails(data) {
  
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'caret-down-outline';
    } else {
      data.showDetails = true;
      data.icon = 'caret-up-outline';
    }
  }

  editPlan(row,index){
    this.editMode = true;
    this.selectedRow = index;
    this.planName2 = row.planName;
    this.amount2 = row.price;
  }

  updatePlan(row,index){
    this.editMode = false;
    this.selectedRow = index;
    row.planName = this.planName2;
    row.price = this.amount2;
    this.otaPlans[index] = row;
  }

  getStyle(index: number) {
    const style: any = {};
    if (index === 0) {
      style['border-radius'] = '20px 20px 0 0';
    } else if (index === this.otaPlans.length - 1) {
      style['border-radius'] = '0 0 20px 20px';
    }

    return style;
  }

  
  onSubmit() {
    this.scrollToTop();
    this.planToBeUpdated = [];
    this.isProgressing = true;
    this.shouldSetRoomId = false;
    
    for (let i = 0; i < this.plans.length; i++) {
      let planUpdate = new Plan();
      planUpdate = this.plans[i];
    
      planUpdate.dayOfTheWeekList = this.daySelected;
      planUpdate.effectiveDate = this.datepipe.transform(
        this.fromDateToString,
        "yyyy-MM-dd"
      );
      planUpdate.expiryDate = this.datepipe.transform(
        this.toDateToString,
        "yyyy-MM-dd"
      );
      if (this.otaList.length > 0) {
        planUpdate.otaPlanList = [];
        for (let ota of this.otaList) {
          for (let otaPlan of this.otaPlans) {
            if (
              ota === otaPlan.otaName &&
              this.plans[i].code == otaPlan.bookonePlanCode
            ) {
              planUpdate.otaPlanList.push(otaPlan);
            }
          }
        }
        this.applicableToOta = true;
      }
      if (planUpdate?.otaPlanList?.length > 0) {
        this.planToBeUpdated.push(planUpdate);
      }
      this.isProgressing = false;
    }

    //update plans api call
    this.isProgressing = true;
    this.propertyService
      .masterRateUpdate(
        this.planToBeUpdated,
        this.applicableToOta,
        false,
        this.increaseRate,
        this.decreaseRate,
        this.customAmount
      )
      .subscribe(
        (res) => {
          if (res.status == 200) {
            
            this.presentToast("Master Plan Updated successfully" ,"success");
            // this.dialogRef.close({ event: "submit" });
            this.isProgressing = false;
            this.reset();
            this.navCtrl.navigateForward("rate-and-availability");
            this.shouldSetRoomId = true;
            
          }
        },
        (error) => {
          this.presentToast("Master Plan Update Failed", "danger");
          this.isProgressing = false;
          this.reset();
          this.shouldSetRoomId = true;
          
        }
      );
  }

  onCancel(){
    this.navCtrl.back();
  }
}
