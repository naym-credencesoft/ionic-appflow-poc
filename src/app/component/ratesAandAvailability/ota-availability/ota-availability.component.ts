import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { RatesAndAvailability } from 'src/app/model/manage-booking/rateandavailability/rateandavailability';
import { OtaAvailability } from 'src/app/model/otaPropertyDTO/otaAvailability';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import {  Location } from "@angular/common";

import { NavController } from "@ionic/angular";
@Component({
  selector: 'app-ota-availability',
  templateUrl: './ota-availability.component.html',
  styleUrls: ['./ota-availability.component.scss'],
})
export class OtaAvailabilityComponent implements OnInit {
    @Input() rateAndAvailability: RatesAndAvailability[];
    
    rateAndAvailabilityList: any[] = [];
  
    OtaAvailabilities: OtaAvailability[] = [];
    otaAvailability: OtaAvailability;
    data: any;
  constructor(  public datepipe: DatePipe, private router: Router,public navCtrl: NavController,private acRoute:ActivatedRoute ,private _location: Location, private availabilityService : AvailabilityService,) {
    this.acRoute.queryParams.subscribe((params) => {
            if (params["data"] != undefined) {
                this.data = JSON.parse(params["data"]);
             
    
            }
          
      
        });
    
   }

  ngOnInit() {
    this.getRatesForRoomByDate();
  
  }

  getRatesForRoomByDate() {

    let rateAndAvailability = new RatesAndAvailability();
  
    // Check if this.data?.rate?.date is a valid date
    
      rateAndAvailability.fromDate = this.datepipe.transform(
        this.data.date,
        "yyyy-MM-dd"
      );
  
      let toDate = new Date(this.data.date);
      toDate.setDate(toDate.getDate() + 1);
  
      rateAndAvailability.toDate = this.datepipe.transform(
        toDate,
        "yyyy-MM-dd"
      );
   
  
    rateAndAvailability.propertyId = this.data.propertyId;
    rateAndAvailability.roomId = this.data.roomId;
  
    this.availabilityService
      .getAvailabilityForRoomByDate(rateAndAvailability)
      .subscribe((resp) => {
        if (resp.body.length === 0) {
          // Handle case when response is empty
        } else {
          this.rateAndAvailabilityList = resp.body;
  
          if (this.rateAndAvailabilityList != null && this.rateAndAvailabilityList.length > 0) {
            this.OtaAvailabilities = this.rateAndAvailabilityList[0].otaAvailabilityList;
          }
        }
      });
  }

  navigateToPage(item,i) {

        let navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify(item),
              
            }
          };
        this.router.navigate(['availability-update'], navigationExtras);

  }
  goback(){
    this._location.back(); 
  }
  
  
}
