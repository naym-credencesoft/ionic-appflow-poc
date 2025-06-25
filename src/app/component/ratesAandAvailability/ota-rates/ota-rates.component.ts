import { Token } from './../../../model/token';
import { Component, Input, OnInit } from '@angular/core';
import { RatesAndAvailability } from 'src/app/model/manage-booking/rateandavailability/rateandavailability';
import { OtaAvailability } from 'src/app/model/otaPropertyDTO/otaAvailability';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import { DatePipe,Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Property } from 'src/app/model/property/Property';
import { Plan } from 'src/app/pages/booking/plan';
import { OTAPlan } from 'src/app/model/otaPlan/otaPlan';
import { TokenStorage } from 'src/app/token.storage';
import { NavController } from "@ionic/angular";
@Component({
  selector: 'app-ota-rates',
  templateUrl: './ota-rates.component.html',
  styleUrls: ['./ota-rates.component.scss'],
})
export class OtaRatesComponent implements OnInit {
    @Input() rateAndAvailability: RatesAndAvailability[];
    
    rateAndAvailabilityList: any[] = [];
    property: Property;
  plan: Plan;
  otaPlanAvailableInRateAndAvailability:boolean = false;
  plans:Plan[];
  currency: string;
  loader:boolean = true
  otaPlans : OTAPlan[];
    OtaAvailabilities: OtaAvailability[] = [];
    otaAvailability: OtaAvailability;
    data: any;
  constructor( public datepipe: DatePipe,     private router: Router,public navCtrl: NavController, private availabilityService : AvailabilityService,private tokenStorage:TokenStorage,private _location:Location ,private acRoute:ActivatedRoute ,) { 
    this.acRoute.queryParams.subscribe((params) => {
        if (params["data"] != undefined) {
            this.data = JSON.parse(params["data"]);
         

        }
      
  
    });
    this.otaPlans = [];
      this.plan = new Plan();
      this.property = new Property();
      this.plans = [];
  }

  ngOnInit() {
    this.property = this.tokenStorage.getProperty();
    if (
      this.property.localCurrency != undefined &&
      this.property.localCurrency != null
    ) {
      this.currency = this.property
        .localCurrency.toUpperCase();
    }

    if (this.data.plan != null && this.data.plan != undefined) {
      this.plan = this.data.plan;
      this.getOtaPlan();
    }

    if(this.data != undefined){
      this.getRatesForRoomByDate();
    }
    // this.getRatesForRoomByDate();
    // console.log("ota availability:" + JSON.stringify(this.OtaAvailabilities))
  }

  
  navigateToPage(item,i) {
    if(this.otaPlanAvailableInRateAndAvailability == true){
        let plans = this.plans.filter((data) => (data.code == item.bookonePlanCode));
        this.plan = plans[0];
      } 
    let navigationExtras: NavigationExtras = {
        queryParams: {
            plan: JSON.stringify(this.plan),
            data: JSON.stringify(item),
            otaPlanAvailableInRateAndAvailability:this.otaPlanAvailableInRateAndAvailability,
            date:this.data?.date
        }
      };
    this.router.navigate(['edit-rates'], navigationExtras);
  
  }
  goback(){
    this._location.back(); 
  }
  getRatesForRoomByDate() {
    
    let rateAndAvailability = new RatesAndAvailability();

    let date = new Date(this.data?.date);

    rateAndAvailability.fromDate = this.datepipe.transform(
      date,
      "yyyy-MM-dd"
    );

    date.setDate(date.getDate()+1);

    rateAndAvailability.toDate = this.datepipe.transform(
      date,
      "yyyy-MM-dd"
    );

    rateAndAvailability.propertyId =this.data.propertyId;
    rateAndAvailability.roomId =this.data.roomId;

    this.availabilityService
      .getAvailabilityForRoomByDate(rateAndAvailability)
      .subscribe((resp) => {
        this.otaPlans = [];

        if (resp.body.length === 0) {

        } else {
          this.rateAndAvailabilityList = resp.body;

          if (this.rateAndAvailabilityList != null && this.rateAndAvailabilityList.length > 0)
          {
            this.plans = this.rateAndAvailabilityList[0].roomRatePlans;
          }

          for(let i = 0;i<this.plans.length;i++){
            for (let j = 0; j < this.plans[i].otaPlanList.length; j++) {
              this.otaPlans.push(this.plans[i].otaPlanList[j]);
            }
          }

          if (this.otaPlans.length > 0) {
            this.otaPlanAvailableInRateAndAvailability = true;
          }

        //   this.dataSource = new MatTableDataSource(this.otaPlans);
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        //   this.changeDetectorRefs.detectChanges();
        }
      });
  }

  getOtaPlan() {
    
    this.loader = true;
    this.otaPlans = [];
    this.availabilityService
      .fetchOtaPlanByPlanCode(this.plan.roomId, this.plan.code)
      .subscribe(
        (data) => {

          this.otaPlans = data;
          this.loader = false;
        //   this.dataSource = new MatTableDataSource(this.otaPlans);
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        //   this.changeDetectorRefs.detectChanges();
        },
        (error) => {
          this.loader = false;
        }
      );
  }

  
}
