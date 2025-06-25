import { Component, OnInit } from '@angular/core';
import {DatePipe, Location} from '@angular/common';
import { Room } from 'src/app/model/room';
import { Plan } from 'src/app/pages/booking/plan';
import { OtaAvailability } from 'src/app/pages/availability-update/otaAvailability';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OTAChannelPropertyDTO } from 'src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { PropertiesOnlineTravelAgencies } from 'src/app/model/Booking/propertiesOTA';
import { TokenStorage } from 'src/app/token.storage';
import { PropertyService } from 'src/app/service/property/property.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import { OTAPlan } from 'src/app/model/otaPlan/otaPlan';
import { Property } from 'src/app/model/property/Property';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
@Component({
  selector: 'app-edit-rates',
  templateUrl: './edit-rates.component.html',
  styleUrls: ['./edit-rates.component.scss'],
})
export class EditRatesComponent implements OnInit {
   
  loader: boolean = false;
  isProgressing: boolean = false;

  property: Property;
  plan: Plan;
  currency: string;
  propertydetails: OTAChannelPropertyDTO;
  propertyOTA: PropertiesOnlineTravelAgencies[];

  OTAList: FormControl = new FormControl("", Validators.required);
  Price: FormControl = new FormControl("", Validators.required);
  PlanName: FormControl = new FormControl("", Validators.required);
  OtaPlanId: FormControl = new FormControl("", Validators.required);

  addrateForm: FormGroup = new FormGroup({
    OTAList: this.OTAList,
    Price: this.Price,
    PlanName: this.PlanName,
    OtaPlanId : this.OtaPlanId,
  });

  otaPlan: OTAPlan;
  otaPlans: OTAPlan[];

  isReadOnly: boolean = false;
  isNewCreated: boolean = false;
  otaPlanAvailableInRateAndAvailability:boolean = false;
  otaRateDate:string;
  subscriptionSelected: any[];
  isBookoneChannelManager:boolean = false;
    data: any;
    roomId: number;
    otaUpdatedate:string;
    increasePercentage: number =0;
    decreasePercentage: number =0;
    customAmount: number = 0;

    constructor( private bookingservice:BookingService,
      public navCtrl: NavController,   private token: TokenStorage,private availabilityupdate:AvailabilityService,   private propertyService: PropertyService,private acRoute:ActivatedRoute, private formBuilder: FormBuilder,private _location: Location, private toastController: ToastController,   public datepipe: DatePipe,private availabilityService: AvailabilityService,) { 
  
        this.otaPlan = new OTAPlan();
        this.propertydetails = new OTAChannelPropertyDTO();
        this.plan = new Plan();
        this.property = new Property();
  
      this.acRoute.queryParams.subscribe((params) => {
          if (params["data"] != undefined) {
              this.data = JSON.parse(params["data"]);

  
          }
          if (params["plan"] != undefined) {
  
          this.plan = JSON.parse(params["plan"]);
// console.log("plan are " + this.plan.roomId) 

        }
        if (params["date"] != undefined) {
  
          this.otaUpdatedate = JSON.parse(params["date"]);

        }
        if (params["otaPlanAvailableInRateAndAvailability"] != undefined) {
  
            this.otaPlanAvailableInRateAndAvailability = Boolean(params["otaPlanAvailableInRateAndAvailability"]);
          }
        
        
    
      });
    }
  
    ngOnInit() {
   
        this.property = this.token.getProperty();

        if (
          this.property.localCurrency != undefined &&
          this.property.localCurrency != null
        ) {
          this.currency = this.property
            .localCurrency.toUpperCase();
        }
    
        if (this.plan != null && this.plan != undefined) {
          this.plan = this.plan;
        }
    
        this.roomId = this.plan.roomId;
   


          this.otaPlan.price = this.plan.amount;
          this.otaPlan.bookonePlanCode = this.plan.code;
    
         
    
          this.otaPlan = this.data;
       
        
       
          this.otaPlan = this.data;
          this.isReadOnly = false;
          this.isNewCreated = false;
          if(this.data.otaPlanAvailableInRateAndAvailability != null && this.data.otaPlanAvailableInRateAndAvailability != undefined){
            this.otaPlanAvailableInRateAndAvailability = this.data.otaPlanAvailableInRateAndAvailability;
          }
          if (this.data.date != null && this.data.date != undefined) {
            this.otaRateDate = this.data.date;
          }
    
        
    
        this.getConfiguredPropertyDetailsByPropertyId(
          this.property.id
        );
    
        this.getSubscriptionForProperty(this.property.id);
    }
    goback(){
        this._location.back(); 
      }
    getSubscriptionForProperty(propertyId: number) {
        this.bookingservice
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
                    this.subscriptionSelected[i].name === "Bookone Channel Manager"
                  ) {
                    this.isBookoneChannelManager = true;
                  }
                }
              }
            //   this.changeDetectorRefs.detectChanges();
            },
            (error) => {}
          );
      }
    
      getOtaPlan() {
        this.loader = true;
        this.availabilityupdate
          .fetchOtaPlanByPlanCode(this.plan.roomId, this.plan.code)
          .subscribe(
            (data) => {
    
              this.otaPlans = data;
            //   console.log("OTA PLANS " + JSON.stringify(this.otaPlans))
    
              if (this.otaPlans != null && this.otaPlans != undefined && this.otaPlans.length > 0)
              {
                if (this.data.permission === "0")
                {
                  this.removeOTAPlan();
                }
                else
                {
                  if (this.otaPlan.otaName != null && this.otaPlan.otaName != undefined)
                  {
                    let index = this.otaPlans.findIndex(data => data.otaName === this.otaPlan.otaName);
    
                    if (index > -1) {
                      this.otaPlans.splice(index, 1);
                    }
                  }
                  this.removeOTAPlan();
                }
    
              }
              this.loader = false;
            //   this.changeDetectorRefs.detectChanges();
            },
            (error) => {
              this.loader = false;
            }
          );
      }
    
      removeOTAPlan()
      {
        for (let i = 0; i < this.otaPlans.length; i++)
        {
          let index = this.propertyOTA.findIndex(data => data.onlineTravelAgencyName === this.otaPlans[i].otaName);
    
          if (index > -1) {
            this.propertyOTA.splice(index, 1);
          }
        }
      }
    
      getNumber(number) {
        if (number != null && number != undefined)
        {
          return Number(number);
        }
        else
        {
          return -1
        }
    
      }
    
      getOTAPropertyDetails() {
        // if (this.otaPlan.otaName != null && this.otaPlan.otaName != undefined ) {
        //    let propertyOTADetails = this.propertyOTA.find(
        //     (data) => data.id === Number(this.otaPlan.otaName)
        //   );
        //   this.otaPlan.otaName = propertyOTADetails.onlineTravelAgencyName;
        // }
      }
    
    
      getConfiguredPropertyDetailsByPropertyId(propertyId: number) {
        this.loader = true;
        this.propertyOTA = [];
        this.propertyService
          .getConfiguredPropertyDetailsByPropertyId(propertyId)
          .subscribe(
            (data) => {
              this.propertydetails = data;
              this.propertyOTA =
                this.propertydetails.propertiesOnlineTravelAgencies;
              this.loader = false;
    
              this.getOtaPlan();
            //   this.UIDetectChange();
            },
            (error) => {
              this.loader = false;
            //   this.UIDetectChange();
            }
          );
      }
    
    //   UIDetectChange() {
    //     setTimeout(() => {
    //       if (
    //         this.changeDetectorRefs &&
    //         !(this.changeDetectorRefs as ViewRef).destroyed
    //       ) {
    //         this.changeDetectorRefs.detectChanges();
    //       }
    //     });
    //   }
    
    //   cancel() {
    //     this.dialogRef.close();
    //   }
      onSubmit()
      {

this.isProgressing = true;
        if(this.otaPlanAvailableInRateAndAvailability == true){
          let plansToBeUpdated:Plan[] = [];
          this.plan.effectiveDate = this.datepipe.transform(
            this.otaUpdatedate,
            "yyyy-MM-dd"
          );
          this.plan.expiryDate = this.datepipe.transform(
            this.otaUpdatedate,
            "yyyy-MM-dd"
          );
        //   this.plan.otaPlanList = [];
        //   this.plan.otaPlanList.push(this.otaPlan);
          for(let i=0;i<this.plan.otaPlanList.length;i++){
            if(this.plan.otaPlanList[i].otaPlanId == this.otaPlan.otaPlanId){
              this.plan.otaPlanList[i].bookonePlanCode = this.otaPlan.bookonePlanCode;
              this.plan.otaPlanList[i].otaName = this.otaPlan.otaName;
              this.plan.otaPlanList[i].otaPlanId = this.otaPlan.otaPlanId;
              this.plan.otaPlanList[i].planName = this.otaPlan.planName;
              this.plan.otaPlanList[i].price = this.otaPlan.price;
            }
          }
          plansToBeUpdated.push(this.plan);
          let applicableToOta:boolean = true;
          let applicableToPMS:boolean = false;
          this.updateMasterPlan(plansToBeUpdated,applicableToOta,applicableToPMS);
          this.isProgressing = false;
        }
        else if (this.isNewCreated === false && this.otaPlanAvailableInRateAndAvailability == false)
        {
          this.availabilityService.updateOTARoomPlan(this.otaPlan,this.plan.roomId).subscribe(
            (res) => {
              this.presentToast("OTA plan rate create successfully","Success");
              this.isProgressing = false;
              
            //   this.dialogRef.close({ event: "update" });
            },
            (error) => {
              this.isProgressing = false;
            }
          );
        }
        else
        {
          this.availabilityService.addOTARoomPlan(this.otaPlan,this.plan.roomId).subscribe(
            (res) => {
              this.presentToast("OTA plan rate create successfully","Success");
              this.isProgressing = false;
            //   this.dialogRef.close({ event: "update" });
            },
            (error) => {
              this.isProgressing = false;
            }
          );
        }
      }
    
      updateMasterPlan(planToBeUpdated:Plan[],applicableToOta:boolean,applicableToPMS:boolean){
        this.isProgressing = true;
        this.propertyService
          .masterRateUpdate(
            planToBeUpdated,
            applicableToOta,
            applicableToPMS,
            this.increasePercentage,
            this.decreasePercentage,
            this.customAmount
          )
          .subscribe(
            (res) => {
              if (res.status == 200) {
                this.presentToast("OTA Plan Updated successfully","Success");
                // this.dialogRef.close({ event: "submit" });
                this.isProgressing = false;
                this.navCtrl.navigateForward("rate-and-availability");
              }
            },
            (error) => {

                this.presentToast("OTA Plan Update Failed","Danger");
              this.isProgressing = false;
            }
          );
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
  
}
