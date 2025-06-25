import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { PropertyService } from 'src/app/service/property/property.service';
import { TokenStorage } from 'src/app/token.storage';
import { Plan } from '../../booking/plan';
import { DatePipe, Location } from '@angular/common';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { Logger } from 'src/app/service/logger.service';

@Component({
  selector: 'app-add-room-plan',
  templateUrl: './add-room-plan.page.html',
  styleUrls: ['./add-room-plan.page.scss'],
})
export class AddRoomPlanPage implements OnInit {

    daysList = ["MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY"];


    onPlanForm: FormGroup;

    room: Room;
    property : Property;
    currency: string;
    loader: boolean = false;
    plan : Plan;

    daySelected: any[]=[];

    Name: FormControl = new FormControl();
    PlanCode: FormControl = new FormControl();
    Description: FormControl = new FormControl();
    MinimumOccupancy: FormControl = new FormControl();
    MaximumOccupancy: FormControl = new FormControl();
    ExtraChargePerPerson : FormControl = new FormControl();
    ExtraChargePerChild : FormControl = new FormControl();
    NoOfChildren : FormControl = new FormControl();
    EffectiveDate : FormControl = new FormControl();
    ExpiryDate : FormControl = new FormControl();
    CurrencyCode : FormControl = new FormControl();
    DiscountAmount: FormControl = new FormControl();
    Amount : FormControl = new FormControl();
    applicableToOta : FormControl = new FormControl();
    RoomStandardPrice : FormControl = new FormControl();

    isView: boolean = false;

    minDate: string;
    maxDate: string;
    toMinDate: string;
    toMaxDate: string;

    roomStandardPrice  : number;
    planStandardrateheaderTitle: string = "More than standard rate";
    discountAmount: number = 0;
    isInventoryPlanUpdate: boolean = false;

  constructor(private acRoute: ActivatedRoute,
    private propertyService : PropertyService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private locationBack: Location,
    private dateService: DateService,
    private actionSheetController: ActionSheetController,
    public loadingCtrl: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private token : TokenStorage,) 
  { 
      this.room = new Room();
      this.property = new Property();
      this.plan = new Plan();

      this.property = this.token.getProperty();

      if(this.property.localCurrency != null && this.property.localCurrency != undefined)
      {
        this.currency = this.property.localCurrency.toUpperCase();
      }

      this.setCalenderDateLimit();
  }

  ngOnInit() 
  {
    this.acRoute.queryParams.subscribe((params) => {
        if (params["room"] != undefined) {
            this.room = JSON.parse(params["room"]);
            this.roomStandardPrice = this.room.roomOnlyPrice;
        } 

        if (params["plan"] != undefined) {
            this.plan = JSON.parse(params["plan"]);

            this.daySelected = [];
            if(this.plan.dayOfTheWeekList != undefined && this.plan.dayOfTheWeekList != null)
            {
              this.daySelected = this.plan.dayOfTheWeekList;
            }

            this.amountChange(this.plan.amount);

            Logger.log(' this.plan '+ JSON.stringify( this.plan ));

            // this.discountAmount = (this.plan.deviationFromStandardPlan);

            // Logger.log(' this.discountAmount  '+ this.discountAmount );

            this.plan.effectiveDate = this.dateService.convertMillisecondsToYYYMMDDFormat(this.plan.effectiveDate);
            this.plan.expiryDate = this.dateService.convertMillisecondsToYYYMMDDFormat(this.plan.expiryDate);

            this.fromDateChange();
        } 

        if (params["isInventoryPlanUpdate"] != undefined) {
            
            this.isInventoryPlanUpdate = true;

            this.plan.channelManagerUpdateType = 'ROOM_RATE_PLAN';

            if (this.plan.restriction === null || this.plan.restriction === undefined) {
                this.plan.restriction = 'None';
            }

            if (this.plan.status === 'Open' || this.plan.restriction === undefined) {
                this.plan.status = 'None';
            }
    
        } 
    });

    this.onPlanForm = this.formBuilder.group({
        Name: ["", Validators.compose([Validators.required])],
        PlanCode: ["", Validators.compose([Validators.required])],
        MinimumOccupancy: ["", Validators.compose([Validators.nullValidator])],
        MaximumOccupancy: ["", Validators.compose([Validators.nullValidator])],
        ExtraChargePerPerson: ["", Validators.compose([Validators.required])],
        ExtraChargePerChild: ["", Validators.compose([Validators.required])],
        NoOfChildren : ["", Validators.compose([Validators.required])],
        Description: ["", Validators.compose([Validators.nullValidator])],
        EffectiveDate: ["", Validators.compose([Validators.nullValidator])],
        ExpiryDate: ["", Validators.compose([Validators.nullValidator])],
        CurrencyCode: ["", Validators.compose([Validators.required])],
        DiscountAmount: ["", Validators.compose([Validators.nullValidator])],
        Amount : ["", Validators.compose([Validators.nullValidator])],
        applicableToOta : ["", Validators.compose([Validators.nullValidator])],
        RoomStandardPrice: ["", Validators.compose([Validators.nullValidator])],
    });
  }

  setCalenderDateLimit() {
    let date: Date = new Date();
    date.setDate(date.getDate()-30);
    this.minDate = this.getDate(date);
    date.setFullYear(date.getFullYear() + 6);
    this.maxDate = this.getDate(date);
}

getDate(date: Date) {

    let currentDay,currentMonth;
    if (date.getDate().toString().length == 1) {
        currentDay = "0" + date.getDate();
    } else {
        currentDay = "" + date.getDate();
    }

    if ((date.getMonth() + 1).toString().length == 1) {
        currentMonth = "0" + (date.getMonth() + 1);
    } else {
        currentMonth = "" + (date.getMonth() + 1);
    }

    return (
        date.getFullYear() + "-" + currentMonth + "-" + currentDay
    );
}

fromDateChange() {
    let toDate = new Date(this.plan.effectiveDate);

    toDate.setDate(toDate.getDate() + 1);
    this.toMinDate = this.getDate(toDate);

    toDate.setFullYear(toDate.getFullYear() + 5);
    this.toMaxDate = this.getDate(toDate);
}


  checkWeekDays(day)
  {
    let check : boolean = false;
    if (this.daySelected.indexOf(day) != -1)
    {
      check = true;
    }
    return check;
  }

  daySelection(day)
  {
    if(this.isInventoryPlanUpdate ===  false)
    {
      if (
        this.daySelected.indexOf(
          day) != -1
        )
        {
          this.daySelected.splice(this.daySelected.indexOf(day),1);
        }
        else
        {
          this.daySelected.push(day);
        }
    }
  }

  discountAmountChange(event) {
    if (event >= 0) {
      this.planStandardrateheaderTitle = "More than standard rate";
    }
    else {
      this.planStandardrateheaderTitle = "Less than standard rate";
    }
    if (event === undefined) {
      this.plan.amount = Number(this.roomStandardPrice) + (Number(this.roomStandardPrice) / 100) * 0;
      //  this.plan.amount.toFixed(2);

    }
    else {
      this.plan.amount = Number(this.roomStandardPrice) + (Number(this.roomStandardPrice) / 100) * event;
      // this.plan.amount.toFixed(2);
    }
  }

  amountChange(event) {
    if (this.plan.amount != undefined && this.roomStandardPrice != undefined) {
      this.discountAmount = (((Number(this.plan.amount) - Number(this.roomStandardPrice)) * 100) / Number(this.roomStandardPrice));
      //  this.discountAmount.toFixed(2);
    }

  }

  cancel()
  {
    this.locationBack.back();
  }

  AddOrUpdateInventory()
  {
    let effectiveDate = new Date(this.plan.effectiveDate);
    this.plan.effectiveDate = this.getDate(effectiveDate);
    this.plan.active = true;

    let expiryDate = new Date(this.plan.expiryDate);
    this.plan.expiryDate = this.getDate(expiryDate);
    this.plan.propertyId = this.room.propertyId;
    this.plan.roomTypeId = this.room.id;
    this.plan.deviationFromStandardPlan = Number(this.discountAmount);
    this.plan.dayOfTheWeekList = this.daySelected;
    this.loader = true;

    this.propertyService.addRoomPlan(this.plan).subscribe(res => {

      if (res.status === 200 || res.status === 201) {
    
        this.presentToast("Rate update successfully");
        this.loader = false;
        this.cancel();
      }
      else if (res.status === 226) {
        this.presentToast("Plan already exist");
        this.loader = false;
      }

    }, error => {
      // Logger.log('error' + JSON.stringify(error));
      this.loader = false;
    });
  }

  submit()
  {
    let effectiveDate = new Date(this.plan.effectiveDate);
    this.plan.effectiveDate = this.getDate(effectiveDate);
    this.plan.active = true;

    let expiryDate = new Date(this.plan.expiryDate);
    this.plan.expiryDate = this.getDate(expiryDate);
    this.plan.propertyId = this.room.propertyId;
    this.plan.roomTypeId = this.room.id;
    this.plan.deviationFromStandardPlan = Number(this.discountAmount);
    this.plan.dayOfTheWeekList = this.daySelected;
    this.loader = true;

    this.propertyService.addPlan(this.plan, String(this.plan.propertyId), String(this.room.id)).subscribe(res => {

      if (res.status === 200 || res.status === 201) {
        if(this.plan.id != null && this.plan.id != undefined)
        {
          this.presentToast("Plan created successfully");
        }
        else
        {
          this.presentToast("Plan updated successfully");
        }

        this.loader = false;
        this.cancel();
      }
      else if (res.status === 226) {
        this.presentToast("Plan already exist");
        this.loader = false;
      }

    }, error => {
      // Logger.log('error' + JSON.stringify(error));
      this.loader = false;
    });
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
        message: Message,
        duration: 2000,
    });
    toast.present();
}


}
