import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from "@angular/common";
import { OtaAvailability } from './otaAvailability';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import { NavController, ToastController } from '@ionic/angular';
import { Room } from 'src/app/model/room';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from 'src/app/service/property/property.service';
import { PropertiesOnlineTravelAgencies } from 'src/app/model/Booking/propertiesOTA';
import { OTAChannelPropertyDTO } from 'src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { OTANames } from 'src/app/model/OTANames';


@Component({
  selector: 'app-availability-update',
  templateUrl: './availability-update.page.html',
  styleUrls: ['./availability-update.page.scss'],
})
export class AvailabilityUpdatePage implements OnInit {
  noOfAvailbale = 0;
  rooms: Room[] = [];
  isProgressing: boolean = false

  checkbox1: boolean = false;
  checkbox2: boolean = false;
  selectAllCheckbox: boolean = false;
  updateInPMSCheckbox: boolean = false;
  otaOne: any[];
  otaTwo: boolean = false;
  otaThree: boolean = false;
  otaFour: boolean = false;
  loader: boolean = false;
  otaFive: boolean = false;
  updateInPms: boolean = false;
  otaAvailability: OtaAvailability;
  otaAvailabilityList: OtaAvailability[];
  rateAndAvailFromDateone: string
  onAvailabilityTabForm: FormGroup;
  RoomType: FormControl = new FormControl();
  bookingToDate: FormControl = new FormControl();
  PlanControll: FormControl = new FormControl();
  bookingFromDate: FormControl = new FormControl();
  //externalSite: FormControl = new FormControl();
  externalBookingID: FormControl = new FormControl();
  notes: FormControl = new FormControl();
  ExtraPersonChange: FormControl = new FormControl();
  ExtraChildChange: FormControl = new FormControl();
  PersonNo: FormControl = new FormControl();
  ChildrenNo: FormControl = new FormControl();
  RoomNo: FormControl = new FormControl();

  rateAndAvailFromDate: FormControl = new FormControl("", [
    Validators.required,
  ]);
  rateAndAvailToDate: FormControl = new FormControl("", [
    Validators.required,
  ]);
  expandedIndex: number | null = null; // Track the currently expanded section

  RoomName: FormControl = new FormControl("", [
    Validators.required,
  ]);
  NoOfAvailable: FormControl = new FormControl("", [
    Validators.required,
  ]);
  AllOTAADDED: FormControl = new FormControl("", [
    Validators.required,
  ]);
  UpdateInPms: FormControl = new FormControl("");
  updatedOtaName: FormControl = new FormControl("");

  addOrUpdateOTAAvailability: FormGroup = new FormGroup({
    rateAndAvailFromDate: this.rateAndAvailFromDate,
    rateAndAvailToDate: this.rateAndAvailToDate,
    roomName: this.RoomName
  });
  otaList: any[];
  isBookoneChannelManager: boolean = false;
  roomName: any;
  roomnames: any;
  propertyId: number;
  otaNames:OTANames;
  propertydetails: OTAChannelPropertyDTO;
  propertyOTA: PropertiesOnlineTravelAgencies[];
  isAllOTAAdded: boolean;
  roomnamesone: Room[];
  selectedOtaNames: string[];
  issingleotaselected: boolean;
  otalist: any[];
  selectedotaname: any;
  // selectAllCheckbox: boolean = false;
  highestNoOfRooms: number;
  subscriptionSelected: any[];
  maxToDate: string = "";
  isBookingjiniSubscription:boolean = false;
  isAirbnbSubscription:boolean = false;
  isBookingDotcomSubscription:boolean = false;
  isChannexSubscription:boolean = false;
  preselectedOtaName:string;
  fromDate: FormControl = new FormControl("", [
    Validators.required,
  ]);

  toDate: FormControl = new FormControl("", [
    Validators.required,
  ]);

  constructor(public navCtrl: NavController, public token: TokenStorage, private propertyService: PropertyService, 
    private bookingService: BookingService,private acRoute: ActivatedRoute, private formBuilder: FormBuilder, private _location: Location, private toastController: ToastController, public datepipe: DatePipe, private availabilityService: AvailabilityService,
    private cdr: ChangeDetectorRef) {

    this.otaAvailabilityList = [];
    this.otaAvailability = new OtaAvailability();
    this.otaList = [];
    this.otaNames = new OTANames();
    this.roomnamesone = this.token.getRoomTypes();
  

    this.acRoute.queryParams.subscribe((params) => {
      if (params["data"] != undefined) {
        this.otaAvailability = JSON.parse(params["data"]);
        this.otaAvailability.fromDate = this.datepipe.transform(
          this.otaAvailability.fromDate,
          "yyyy-MM-dd"
        );
        this.otaAvailability.toDate = this.datepipe.transform(
          this.otaAvailability.fromDate,
          "yyyy-MM-dd"
        );
        this.noOfAvailbale = this.otaAvailability.noOfAvailable;
      }
      let room = this.roomnamesone.filter((res) => res.id === this.otaAvailability.roomId);
      this.roomName = room[0]?.name;
      this.highestNoOfRooms = room[0]?.noOfRooms;
      this.preselectedOtaName = this.otaAvailability.otaName;
      if(this.preselectedOtaName != null){
        this.selectAllCheckbox = true;
      }
      
    });
  }

  ngOnInit() {
    this.rooms = this.token.getRoomTypes();
    this.propertyId = this.token.getProperty().id;
    this.getConfiguredPropertyDetailsByPropertyId(this.propertyId);
    this.getSubscriptionForProperty(this.propertyId);
    
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

  updateMaxToDate() {
    if (this.otaAvailability.fromDate) {
        const startDate = new Date(this.otaAvailability.fromDate);
        const maxDate = new Date(startDate);
        maxDate.setMonth(maxDate.getMonth() + 3); // Add 3 months
        this.maxToDate = maxDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
}

ionViewWillEnter(){
    if(this.acRoute.queryParams){
        this.acRoute.queryParams.subscribe((params) => {
            if (params["data"] != undefined) {
              this.otaAvailability = JSON.parse(params["data"]);
              this.otaAvailability.fromDate = this.datepipe.transform(
                this.otaAvailability.fromDate,
                "yyyy-MM-dd"
              );
              this.otaAvailability.toDate = this.datepipe.transform(
                this.otaAvailability.fromDate,
                "yyyy-MM-dd"
              );
              this.noOfAvailbale = this.otaAvailability.noOfAvailable;
            }
            let room = this.roomnamesone.filter((res) => res.id === this.otaAvailability.roomId);
            this.roomName = room[0]?.name;
            this.highestNoOfRooms = room[0]?.noOfRooms;
            this.preselectedOtaName = this.otaAvailability.otaName;
            if(this.preselectedOtaName != null){
              this.selectAllCheckbox = true;
            }
            
          });
    } else {
        this.addOrUpdateOTAAvailability.reset();
        this.rooms = this.token.getRoomTypes();
        this.propertyId = this.token.getProperty().id;
        this.getConfiguredPropertyDetailsByPropertyId(this.propertyId);
        this.getSubscriptionForProperty(this.propertyId);
    
    }
   
}



  updateCounter(value: number) {
    this.noOfAvailbale += value;
  }

  logCheckboxValues() {

  }
  selectAllCheckboxes() {
    this.checkbox1 = true;
    // Set other checkboxes as needed
  }
  toggleExpand(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
  onback(){
    
  }
  updateCheckboxes() {

    if (this.selectAllCheckbox) {
      // If "Add / Update In All OTA" is checked, enable all checkboxes
      this.otaOne = Array(this.propertyOTA.length).fill(true);
      this.otaList = this.propertyOTA?.filter((_, index) => this?.otaOne[index])
        .map(item => item?.onlineTravelAgencyName);
    } else {
      this.otaList = [];
      // If "Add / Update In All OTA" is not checked, disable all checkboxes
      this.otaOne = Array(this.propertyOTA.length).fill(false);
    }
    this.cdr.detectChanges();

  }
  updateCheckboxesone(updateInPMSCheckbox) {
    this.updateInPMSCheckbox = updateInPMSCheckbox;
  }
  goback() {
    this._location.back();
  }
  getConfiguredPropertyDetailsByPropertyId(propertyId: number) {
    this.loader = true;
    this.propertyService
      .getConfiguredPropertyDetailsByPropertyId(propertyId)
      .subscribe(
        (data) => {
          this.propertydetails = data;
          if(this.preselectedOtaName == null){
            this.propertyOTA =
            data.propertiesOnlineTravelAgencies.filter(element => {
                return this.otaNames.bookoneCMOTANames.map(name => name.toLocaleLowerCase())
                .includes(element.onlineTravelAgencyName.toLocaleLowerCase());
            });
            this.selectAllCheckbox = true;
            this.otaOne = Array(this.propertyOTA.length).fill(true);
            this.otaList = this.propertyOTA?.filter((_, index) => this?.otaOne[index])
              .map(item => item?.onlineTravelAgencyName);
          } else {
            this.propertyOTA =
            this.propertydetails.propertiesOnlineTravelAgencies.filter(element => {
              return (element.onlineTravelAgencyName === this.preselectedOtaName);
            });
            this.updateCheckboxes();
          }
          
          this.isAllOTAAdded = true;
          // this.selectAllOta(true);
          this.loader = false;
          //   this.UIDetectChange();
        },
        (error) => {
          this.loader = false;
          //   this.UIDetectChange();
        }
      );
  }
  createOrUpdateOtaAvailability() {
    this.isProgressing = true;
    this.otaAvailability.fromDate = this.datepipe.transform(
      this.otaAvailability.fromDate,
      "yyyy-MM-dd"
    );

    this.otaAvailability.toDate = this.datepipe.transform(
      this.otaAvailability.toDate,
      "yyyy-MM-dd"
    );
    this.otaAvailability.noOfAvailable = this.noOfAvailbale

    this.availabilityService
      .addOrUpdateOtaAvailability(this.otaAvailability, this.updateInPMSCheckbox)
      .subscribe(
        (res) => {
          // Logger.log(JSON.stringify(res));
          this.loader = false;
          this.presentToast("Property Availability Updated Successfully", 'success');
          this.isProgressing = false;
          this.navCtrl.navigateForward("rate-and-availability");
        },
        (error) => {
          this.isProgressing = false;
        }
      );
  }
  isDisabled() {

    if (
      this.addOrUpdateOTAAvailability.valid === true && this.selectAllCheckbox === true &&
      ((this.otaList.length >= 1 && this.isBookoneChannelManager === true) || this.updateInPMSCheckbox === true || (this.otaAvailability.otaName != null || this.otaAvailability.otaName != undefined  ))
    ) {
      return false;
    } else {
      return true;
    }
  }
  setRoomId(roomId) {
    let room = this.roomnamesone.filter((res) => res.id === roomId);
    this.roomName = room[0].name;
    this.highestNoOfRooms = room[0].noOfRooms;
  }


  onSubmit() {
    this.isProgressing = true;
    // console.log("otalist :" + this.otaList)
    // debugger
    if (this.otaList.length == 0 && this.updateInPMSCheckbox === true) {
      //update availability in pms
      this.createOrUpdateOtaAvailability();
      this.isProgressing = false;
    } else if (this.otaList != null && this.otaList.length > 0) {
      //Multiple ota create or update
      this.otaAvailabilityList = [];
      for (let i = 0; i < this.otaList.length; i++) {
        let otaAvailabilityData = new OtaAvailability();
        otaAvailabilityData.roomId = this.otaAvailability.roomId;

        otaAvailabilityData.noOfAvailable =
          this.noOfAvailbale;
        otaAvailabilityData.fromDate = this.datepipe.transform(
          this.otaAvailability.fromDate,
          "yyyy-MM-dd"
        );
        otaAvailabilityData.toDate = this.datepipe.transform(
          this.otaAvailability.toDate,
          "yyyy-MM-dd"
        );

        otaAvailabilityData.otaName = this.otaList[i];

        this.otaAvailabilityList.push(otaAvailabilityData);
      }
      this.updateAvailabilityAllOTA(this.otaAvailabilityList);
      this.isProgressing = false;
    } else if (this.otaAvailabilityList != null && this.otaAvailabilityList.length == 1) {
      //For single ota update which is already created
      this.updateAvailabilityAllOTA(this.otaAvailabilityList);
      this.isProgressing = false;
    }

  }

  updateAvailabilityAllOTA(otaAvailabilityList) {
    this.isProgressing = true;

    this.availabilityService
      .bulkUpdateOfAvailability(otaAvailabilityList, this.updateInPMSCheckbox)
      .subscribe(
        (res) => {
          this.presentToast("Add or Update OTA Availability successfully", 'success');
          this.isProgressing = false;
          this.navCtrl.navigateForward("rate-and-availability");
        },
        (error) => {
          this.isProgressing = false;
          this.presentToast("Failed to Update. Please try again.", "danger");
        }
      );

  }
  otaselected(item) {
    if (this.otaList?.indexOf(item) > -1) {
      const index: number = this.otaList?.indexOf(item);
      if (index !== -1) {
        this.otaList?.splice(index, 1);
        if (this.otaList.length >= 1) {
          this.issingleotaselected = false
        } else {
          this.isAllOTAAdded = false;
          this.issingleotaselected = true
        }
      }
    } else {
      this.otaList?.push(item);
    }

    this.selectedotaname = item
    this.issingleotaselected = true
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

}
