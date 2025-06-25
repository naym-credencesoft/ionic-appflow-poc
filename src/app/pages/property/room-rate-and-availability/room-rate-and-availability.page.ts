import { DateService } from './../../../service/DateService/date-service.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Availability } from 'src/app/model/Availbility/availability';
import { RatesAndAvailability } from 'src/app/model/manage-booking/rateandavailability/rateandavailability';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import { Logger } from 'src/app/service/logger.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { TokenStorage } from 'src/app/token.storage';
import { RatesAvailabilityInterface } from '../../rate-and-availability/rate-and-availability.page';

@Component({
  selector: 'app-room-rate-and-availability',
  templateUrl: './room-rate-and-availability.page.html',
  styleUrls: ['./room-rate-and-availability.page.scss'],
})
export class RoomRateAndAvailabilityPage implements OnInit {

    room: Room;
    ratesAndAvailability: RatesAndAvailability;
    property : Property;
    currency: string;

    loader: boolean = false;

    onFindRateForm : FormGroup;
    toMinDate: string;
    toMaxDate: string;

    fromMinDate: string;
    fromMaxDate: string;

    rooms: Room[] = [];

    ratesAndAvailabilities: RatesAvailabilityInterface[] = [];

    selectedIndexNumber: number;
    isListToggle: boolean = false;
    

  constructor(private acRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    public navCtrl: NavController,
    private dateService : DateService,
    private toastController: ToastController,
    private availabilityService : AvailabilityService,
    private propertyService : PropertyService,
    private changeDetectorRefs: ChangeDetectorRef,
    private token : TokenStorage,) 
  { 
      this.room = new Room();
      this.property = new Property();
      this.ratesAndAvailability = new RatesAndAvailability();

      this.property = this.token.getProperty();

      if(this.property.localCurrency != null && this.property.localCurrency != undefined)
      {
        this.currency = this.property.localCurrency.toUpperCase();
      }

      this. currentDate();
  }

  ngOnInit() 
  {
    this.acRoute.queryParams.subscribe((params) => {
        if (params["room"] != undefined) {
            this.room = JSON.parse(params["room"]);
        } 
    });

    this.onFindRateForm = this.formBuilder.group({
        rateAndAvailFromDate: ["", Validators.compose([Validators.required])],
        rateAndAvailToDate: ["", Validators.compose([Validators.required])],
    });

    this.getRatesAndAvailability();
  }

  ionViewWillEnter() {
    this.getRatesAndAvailability();
  }


  currentDate() {
    let fromDate = new Date();

    fromDate.setDate(fromDate.getDate() - 30);
    this.fromMinDate = this.getDate(fromDate);

    fromDate.setFullYear(fromDate.getFullYear() + 5);
    this.fromMaxDate = this.getDate(fromDate);
 }

  listToggle(index) {
    
    this.selectedIndexNumber = index;
    if (this.isListToggle === true) {
        this.isListToggle = false;
      }
      else {
        this.isListToggle = true;
      }
  }

  onUpdatePlan(plan)
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            room: JSON.stringify(this.room),
            plan: JSON.stringify(plan),
            isInventoryPlanUpdate : true,
        }
      };
  
    this.router.navigate(['add-room-plan'], navigationExtras);
  }

  async EditItemRoom(rate: any, room: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        Room: JSON.stringify(room),
        Rate: JSON.stringify(rate),
      }
    };

    this.navCtrl.navigateForward(['edit-rate'], navigationExtras);
  }

  getUTCDateToDate(dateString: string) {
    var yearAndMonth = dateString.split("-", 3);
    return yearAndMonth[0] + '-' + yearAndMonth[1] + '-' + yearAndMonth[2].split("T", 1);
  }


  getRatesAndAvailability() {

    this.ratesAndAvailabilities = [] ;
    this.room.rateAndAvailabilityList = [];

    if (this.ratesAndAvailability.fromDate === undefined || this.ratesAndAvailability.toDate === undefined) {
        setTimeout(() => {
          this.getRatesForRoomNextSevenDays(this.room);
        }, 1000);
        
    } else {

      this.isListToggle = false;
      this.ratesAndAvailabilities = [];
      this.ratesAndAvailability.fromDate = this.getUTCDateToDate(this.ratesAndAvailability.fromDate);
      this.ratesAndAvailability.toDate = this.getUTCDateToDate(this.ratesAndAvailability.toDate);
      this.ratesAndAvailability.propertyId = this.property.id;
      this.ratesAndAvailability.roomId = this.room.id;
      this.getRatesForRoomByDate(this.room, this.ratesAndAvailability);
    }
  }

  getRatesForRoomByDate(room: Room, rateAndAvailability: RatesAndAvailability) {
    room.rateAndAvailabilityList = [];
    this.availabilityService.getAvailabilityForRoomByDate(rateAndAvailability).subscribe(resp => {
      if (resp.body.length === 0) {
        this.presentToast(`Rates And Availability not setup for the dates,please load the rates.`);
      } else {
        this.ratesAndAvailabilities = [] ;
        for (let num = 0; num < resp.body.length; num++) {
          const ratesAndAvailability: RatesAndAvailability = {
            id: resp.body[num].id,
            date: (resp.body[num].date),
            noOfAvailable: resp.body[num].noOfAvailable,
            noOfBooked: resp.body[num].noOfBooked,
            noOfOnHold: resp.body[num].noOfOnHold,
            price: resp.body[num].price,
            propertyId: resp.body[num].propertyId,
            propertyName: resp.body[num].propertyName,
            roomId: resp.body[num].roomId,
            roomName: resp.body[num].roomName,
            totalNoRooms: resp.body[num].totalNoRooms,
            status: resp.body[num].status,
            restriction: resp.body[num].restriction,
            roomRatePlans: resp.body[num].roomRatePlans,
            stopSellOBE: resp.body[num].stopSellOBE,
            stopSellOTA: resp.body[num].stopSellOTA,
            otaAvailabilityList: resp.body[num].otaAvailabilityList,
          };
          this.ratesAndAvailabilities.push(ratesAndAvailability);
        }
        room.rateAndAvailabilityList = this.ratesAndAvailabilities;
      }
    });
  }


  getRatesForRoomNextSevenDays(room: Room) {
    room.rateAndAvailabilityList = [];
    this.availabilityService.getAvailabilityForRoomAllNext7Days(this.property.id, room.id).subscribe(resp => {
      if (resp.body.length === 0) {
        this.presentToast(`Rates And Availability not setup for the dates,please load the rates.`);
      } else {
        this.ratesAndAvailabilities = [] ;
        for (let num = 0; num < resp.body.length; num++) {
         
          const ratesAndAvailability: RatesAndAvailability = {
            id: resp.body[num].id,
            date: (resp.body[num].date),
            noOfAvailable: resp.body[num].noOfAvailable,
            noOfBooked: resp.body[num].noOfBooked,
            noOfOnHold: resp.body[num].noOfOnHold,
            price: resp.body[num].price,
            propertyId: resp.body[num].propertyId,
            propertyName: resp.body[num].propertyName,
            roomId: resp.body[num].roomId,
            roomName: resp.body[num].roomName,
            totalNoRooms: resp.body[num].totalNoRooms,
            status: resp.body[num].status,
            restriction: resp.body[num].restriction,
            roomRatePlans: resp.body[num].roomRatePlans,
            stopSellOBE: resp.body[num].stopSellOBE,
            stopSellOTA: resp.body[num].stopSellOTA,
            otaAvailabilityList: resp.body[num].otaAvailabilityList,
          };
          this.ratesAndAvailabilities.push(ratesAndAvailability);

        }

        room.rateAndAvailabilityList = this.ratesAndAvailabilities;
        // // Logger.log('ratesAndAvailabilities -- : '+JSON.stringify(this.ratesAndAvailabilities))
        // this.roomsWithData.push(room);
      }
    });
  }



  onAddInventory()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            room: JSON.stringify(this.room),
        }
      };
  
    this.router.navigate(['add-inventory'], navigationExtras);
  }

  onAddOrUpdatePlan()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            room: JSON.stringify(this.room),
            permission : 0,
        }
      };
    this.router.navigate(['add-or-update-plan'], navigationExtras);
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

  getDayNumber(date: string) {
    if (date != null && date != "") {
      return new Date(date).getDay();
    } else {
      return -1;
    }
  }



  onUpdateInventory()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            room: JSON.stringify(this.room),
        }
      };
  
    this.router.navigate(['update-inventory'], navigationExtras);
  }

  
  fromDateChange() {
    let toDate = new Date(this.ratesAndAvailability.fromDate);

    toDate.setDate(toDate.getDate() + 1);
    this.toMinDate = this.getDate(toDate);

    toDate.setDate(toDate.getDate() + 15);
    this.toMaxDate = this.getDate(toDate);
 }

getDate(date: Date) {
    
    let currentDay, currentMonth;

    if (date.getDate().toString().length == 1) {
    currentDay = '0' + date.getDate();
    }
    else {
    currentDay = '' + date.getDate();
    }

    if ((date.getMonth() + 1).toString().length == 1) {
    currentMonth = '0' + (date.getMonth() + 1);
    }
    else {
    currentMonth = '' + (date.getMonth() + 1);
    }

    return date.getFullYear() + '-' + currentMonth + '-' + currentDay;
}

async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

fiundRates()
{
    this.room = { ...this.room }; 
    this.getRatesAndAvailability();
}

reset()
{

    this.ratesAndAvailabilities = [];

    this.onFindRateForm.reset();
    this.isListToggle = false;

    this.ratesAndAvailability = new RatesAndAvailability();
    this.getRatesAndAvailability();
}

getResponceFromRoomRateComponent(data: string) {
    if (data === "update-room") {
        this.getRatesAndAvailability();
    }
  }


}
