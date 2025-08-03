import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Availability } from 'src/app/model/Availbility/availability';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { TokenStorage } from 'src/app/token.storage';
import { DatePipe, Location } from '@angular/common';
import { LoadDateService } from 'src/app/service/LoadDate/load-date.service';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.page.html',
  styleUrls: ['./add-inventory.page.scss'],
})
export class AddInventoryPage implements OnInit {


    rateAndAvailFromDate: FormControl = new FormControl();
    rateAndAvailToDate: FormControl = new FormControl();
    noOfRooms: FormControl = new FormControl();
    price: FormControl = new FormControl();

    availability: Availability;
    room: Room;
    property : Property;
    currency: string;

    loader: boolean = false;

    onAddInventoryForm : FormGroup;

    fromDateMin: string;
    fromDateMax: string;
    toMinDate: string;
    toMaxDate: string;
    isBackDateInventory: boolean = false;
    currentMonth: string;
    currentDay: string;
    isModalOpenfromDate: boolean = false;
    isModalOpentoDate: boolean = false;
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
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private datePipe: DatePipe
) 
  { 
      this.room = new Room();
      this.property = new Property();
      this.availability = new Availability();

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

            this.availability.roomId = this.room.id;
            this.availability.propertyId = this.room.propertyId;
            this.availability.price = this.room.roomOnlyPrice;
            this.availability.noOfRooms = this.room.noOfRooms;
        
            this.currentDateFix(this.room.id);
        } 
    });

    this.onAddInventoryForm = this.formBuilder.group({
        rateAndAvailFromDate: ["", Validators.compose([Validators.required])],
        rateAndAvailToDate: ["", Validators.compose([Validators.required])],
        noOfRooms: ["", Validators.compose([Validators.required])],
        price: ["", Validators.compose([Validators.required])],
    });
  }

  onInputChange() {
    this.currentDateFix(this.room.id);
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

  fromDateChange(event) {
    this.availability.fromDate = this.datePipe.transform(this.availability.fromDate,'yyyy-MM-dd');
    let toDate = new Date(this.availability.fromDate);

    toDate.setDate(toDate.getDate() + 1);
    this.toMinDate = this.getDate(toDate);

    toDate.setMonth(toDate.getMonth() + 12);
    this.toMaxDate = this.getDate(toDate);
    
 this.isFromSelected = true;
    //   Logger.log('date change :'+this.availability.fromDate+'--'+this.toMinDate+'--'+this.toMaxDate);
  }

  toDateChange(event){
    const selectedDate = event.detail.value;
 this.availability.toDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
 this.isToSelected = true;
}

  currentDateFix(roomId) {
    if (this.isBackDateInventory === false) {
      this.loader = true;
      this.loadDateService.maxLoadDate(roomId).subscribe(
        (res) => {
          if (res.body != undefined && res.body != null) {
            let toDate = new Date(
              this.dateService.convertMillisecondsToYYYMMDDFormat(res.body)
            );

            toDate.setDate(toDate.getDate() + 1);
            this.fromDateMin = this.getDate(toDate);
            //...
            toDate.setMonth(toDate.getMonth() + 12);
            this.fromDateMax = this.getDate(toDate);
          } else {
            let toDate = new Date();

            toDate.setDate(toDate.getDate());
            toDate.setFullYear(toDate.getFullYear());
            this.fromDateMin = this.getDate(toDate);
            //...
            // toDate.setDate(toDate.getDate() + 91);
            toDate.setFullYear(toDate.getFullYear() + 6);
            this.fromDateMax = this.getDate(toDate);
          }

          this.loader = false;
        },
        (error) => {
          this.loader = false;
        }
      );
    } else {
      this.loader = true;
      this.loadDateService.minLoadDate(roomId).subscribe(
        (res) => {
          if (res.body != undefined && res.body != null) {
            let toDate = new Date(
              this.dateService.convertMillisecondsToYYYMMDDFormat(res.body)
            );

            toDate.setDate(toDate.getDate() - 1);
            this.fromDateMax = this.getDate(toDate);

            toDate.setMonth(toDate.getMonth() - 12);
            this.fromDateMin = this.getDate(toDate);
            //...
          } else {
            let toDate = new Date();

            toDate.setDate(toDate.getDate());
            toDate.setFullYear(toDate.getFullYear() - 1);
            this.fromDateMin = this.getDate(toDate);
            //...
            // toDate.setDate(toDate.getDate() + 91);
            toDate.setFullYear(toDate.getFullYear() + 6);
            this.fromDateMax = this.getDate(toDate);
          }

          this.loader = false;
        },
        (error) => {
          this.loader = false;
        }
      );
    }
  }

  getDate(date: Date) {
    if (date.getDate().toString().length == 1) {
      this.currentDay = "0" + date.getDate();
    } else {
      this.currentDay = "" + date.getDate();
    }

    if ((date.getMonth() + 1).toString().length == 1) {
      this.currentMonth = "0" + (date.getMonth() + 1);
    } else {
      this.currentMonth = "" + (date.getMonth() + 1);
    }

    return date.getFullYear() + "-" + this.currentMonth + "-" + this.currentDay;
  }



  cancel()
  {
    this.locationBack.back();
  }

  submit()
  {
    let fromDate = new Date(this.availability.fromDate);
    this.availability.fromDate = this.getDate(fromDate);

    let toDate = new Date(this.availability.toDate);
    this.availability.toDate = this.getDate(toDate);

    // Logger.log('submit'+JSON.stringify(this.availability));

    this.loader = true;

    this.availabilityService.addRate(this.availability).subscribe(res => {
      // Logger.log(JSON.stringify(res));
      this.loader = false;
      this.presentToast("Inventory added successfully");
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

  closeDateTimePicker() {
    this.isModalOpenfromDate = false;
  }

  async closeModalSeven() {
    await this.modalController.dismiss();
  }
    openDateTimePicker() {
    this.isModalOpenfromDate = true;
  }
   openDateTimePickerOne() {
    this.isModalOpentoDate = true;
  }

   closeDateTimePickerOne() {
    this.isModalOpentoDate = false;
  }


}
