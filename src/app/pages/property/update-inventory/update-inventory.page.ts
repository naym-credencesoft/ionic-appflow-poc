import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonDatetime, IonModal, LoadingController, ToastController } from '@ionic/angular';
import { Availability } from 'src/app/model/Availbility/availability';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { LoadDateService } from 'src/app/service/LoadDate/load-date.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { TokenStorage } from 'src/app/token.storage';
import { RateBundle } from 'src/app/model/Availbility/rate-bundle';

@Component({
  selector: 'app-update-inventory',
  templateUrl: './update-inventory.page.html',
  styleUrls: ['./update-inventory.page.scss'],
})
export class UpdateInventoryPage implements OnInit {
  @ViewChild('fromDateModal', { static: false }) fromDateModal!: IonDatetime;
 @ViewChild('fromDateBtn', { static: false, read: ElementRef }) fromDateBtn!: ElementRef;
 @ViewChild('fromModal', { static: false }) fromModal!: IonModal;
  @ViewChild('toModal', { static: false }) toModal!: IonModal;




  
    rateAndAvailFromDate: FormControl = new FormControl();
    rateAndAvailToDate: FormControl = new FormControl();
    noOfRooms: FormControl = new FormControl();
    price: FormControl = new FormControl();
    Booked: FormControl = new FormControl();
    Available: FormControl = new FormControl();
    Hold: FormControl = new FormControl();

    rateBundle: RateBundle;
    room: Room;
    property : Property;
    currency: string;

    loader: boolean = false;

    onUpdateInventoryForm : FormGroup;

    fromDateMin: string;
    fromDateMax: string;
    toMinDate: string;
    toMaxDate: string;

    isInventoryCreated : boolean = true;
    isFromSelected = false;
    isToSelected = false;
 isFromModalOpen = false;
isToModalOpen = false;


  constructor(private acRoute: ActivatedRoute,
    private router: Router,
    private token : TokenStorage,
    private propertyService : PropertyService,
    private changeDetectorRefs: ChangeDetectorRef,
    private locationBack: Location,
    public availabilityService : AvailabilityService,
    private dateService: DateService,
    public loadDateService : LoadDateService,
    public loadingCtrl: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder) 
  { 
      this.room = new Room();
      this.property = new Property();
      this.rateBundle = new RateBundle();

      this.property = this.token.getProperty();

      if(this.property.localCurrency != null && this.property.localCurrency != undefined)
      {
        this.currency = this.property.localCurrency.toUpperCase();
      }
  }

  ngOnInit() 
  {
    this.acRoute.queryParams.subscribe((params) => {
        if (params["room"] != undefined) {
            this.room = JSON.parse(params["room"]);

            this.rateBundle.roomId = this.room.id;
            this.rateBundle.propertyId = this.room.propertyId;
            this.rateBundle.price = this.room.roomOnlyPrice;
        
            this.currentDateFix(this.room.id);
        } 
    });

    this.onUpdateInventoryForm = this.formBuilder.group({
        rateAndAvailFromDate: ["", Validators.compose([Validators.required])],
        rateAndAvailToDate: ["", Validators.compose([Validators.required])],
        noOfRooms: ["", Validators.compose([Validators.required])],
        price: ["", Validators.compose([Validators.required])],
        Booked: ["", Validators.compose([Validators.required])],
        Available: ["", Validators.compose([Validators.required])],
        Hold: ["", Validators.compose([Validators.nullValidator])],
    });
    const selectedDate = new Date();
  const formattedFromDate = selectedDate.toISOString().split('T')[0];
  this.rateBundle.fromDate = formattedFromDate;


  // Calculate toDate = fromDate + 1 day
  const toDate = new Date(selectedDate);
  toDate.setDate(toDate.getDate() + 1);
  this.rateBundle.toDate = toDate.toISOString().split('T')[0]; // (optional if needed)
  }

   setFromDateOpen(isOpen: boolean) {
    this.isFromModalOpen = isOpen;
  }

  dismissFromDateModal() {
    this.isFromModalOpen = false;
  }

      setToDateOpen(isOpen: boolean) {
    this.isToModalOpen = isOpen;
  }

      dismissToDateModal() {
    this.isToModalOpen = false;
    }
  currentDateFix(roomId) {
    this.loader = true;
    this.loadDateService.maxLoadDate(roomId).subscribe(res => {

        if(res.body != undefined && res.body != null)
        {
            let fromMinDate = new Date();

            fromMinDate.setDate(fromMinDate.getDate() - 30);
            this.fromDateMin = this.getDate(fromMinDate);
            //...
            
            let fromMaxDate = new Date(this.dateService.convertMillisecondsToYYYMMDDFormat(res.body));
            this.fromDateMax = this.getDate(fromMaxDate);
            this.isInventoryCreated = true;
        }
        else
        {
            this.isInventoryCreated = false;
        }

      
      this.loader = false;
    }, error => {
      this.loader = false;
    });

  }
  openFromDatePicker() {
     this.fromDateBtn?.nativeElement?.click();
  }


//   fromDateChange(event:any) {
//      const selectedDate = new Date(event.detail.value);
//      const formattedDate = selectedDate.toISOString().split('T')[0];
//      this.rateBundle.fromDate = formattedDate;
//     let toDate = new Date(this.rateBundle.fromDate);
//     console.log('todate is',toDate);

//     toDate.setDate(toDate.getDate() + 1);
//     this.toMinDate = this.getDate(toDate);
//      console.log('toMinDate is',this.toMinDate);

//     toDate.setDate(toDate.getDate() + 90);
//     this.toMaxDate = this.getDate(toDate);
//        console.log('toMaxDate is',this.toMaxDate);
// //         if (this.fromModal) {
// //     this.fromModal.dismiss();
// //   }

// }


// toDateChange(event:any){
//   if (this.toModal) {
//     this.toModal.dismiss();
//   }
// }

isFromDateSelected: boolean = false;
isToDateSelected: boolean = false;

fromDateChange(event: any) {
  const selectedDate = new Date(event.detail.value);
  this.rateBundle.fromDate = selectedDate.toISOString().split('T')[0];
  this.isFromSelected = true;
this.isFromDateSelected = true;
  // Optional: Clear or adjust toDate if it's now before fromDate
  if (new Date(this.rateBundle.toDate) < new Date(this.rateBundle.fromDate)) {
    this.rateBundle.toDate = '';
  }
}

toDateChange(event: any) {
  const selectedDate = new Date(event.detail.value);
  const formattedDate = selectedDate.toISOString().split('T')[0];
  this.isToSelected = true;
this.isToDateSelected = true;
  // Optional: prevent unnecessary update
  if (this.rateBundle.toDate !== formattedDate) {
    this.rateBundle.toDate = formattedDate;
  }
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

  cancel()
  {
    this.locationBack.back();
  }

  submit()
  {
    let fromDate = new Date(this.rateBundle.fromDate);
    this.rateBundle.fromDate = this.getDate(fromDate);

    let toDate = new Date(this.rateBundle.toDate);
    this.rateBundle.toDate = this.getDate(toDate);

    this.loader = true;

    this.availabilityService.updateRate(this.rateBundle).subscribe(res => {
        this.loader = false;
        this.presentToast("Inventory Update successfully");
        this.cancel();
      }, error => {
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
