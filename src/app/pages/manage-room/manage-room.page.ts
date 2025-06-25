import { Logger } from '../../service/logger.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { BookingService } from '../../service/manage-booking/booking-service.service';
import { Booking } from './../../model/manage-booking/Booking/Booking';
import { Room } from './../../model/room';
import { RoomAvailability } from './../../model/RoomAvailability/RoomAvailability';
import { AvailabilityService } from './../../service/AvailabilityService/availability.service';
import { PropertyService } from './../../service/property/property.service';
import { TokenStorage } from './../../token.storage';
import { NavigationExtras, Router } from '@angular/router';
import { Property } from 'src/app/model/property/Property';

export interface SelectedDate {
  date: string;
  day: string;
  noOfAvailable: number;
  noOfBooked: number;
  noOfGuestCheckIn: number;
  noOfGuestCheckOut: number;
  noOfGuestInHouse: number;
}
export interface RoomDetails {
  date: string;
  roomType: string;
  roomNumber: number;
  available: boolean;
  roomId: number;
  guestName: string;
  bookingId: number;
  description: string;
  roomStatus: string;
  floorNumber: string;
  floorName: string;
  noOfBed: number;
  bedType: string;
}

export interface RoomInfo {
  roomNumber: string;
  date: string;
  guestFirstName: string;
  guestLastName: string;
}

export interface RoomNumber {
  roomNumber: string;
}

export interface FloorDetail {
  name: string;
  totalNumberRoom: number;
  noOfRoomsOccupied: number;
  noOfRoomsReady: number;
  noOfDirty: number;
  number: number;
}

export interface DialogData {
  date: string;
  roomNumber: number;
  available: boolean;
  roomId: number;
  guestName: string;
  bookingId: number;
  description: string;
  roomStatus: string;
  floorNumber: string;
  floorName: string;
  noOfBed: number;
  bedType: string;
}


@Component({
  selector: 'app-manage-room',
  templateUrl: './manage-room.page.html',
  styleUrls: ['./manage-room.page.scss'],
})

export class ManageRoomPage implements OnInit {
    property: Property;
  // host: Host;
  DATE_ARRAY: SelectedDate[] = [];
  ROOM_ARRAY: RoomInfo[] = [];
  FLOOR: FloorDetail[] = [];
  ROOM_NO_ARRAY: RoomNumber[] = [];

  rooms: Room[] = [];

  TODAYS_ROOMS = [];
  SUPER_ROOMS = [];
  NO_OF_ROOMS = [];
  NO_OF_DATES = [];
  Floor_Index = [];
  FloorNameSelected = [];
  roomData: any;
  floorData: any;
  roomDataObject: any;
  rommAvailability: RoomAvailability;

  currentDay: string;
  currentMonth: string;
  currentDate: string;
  isProgressing: boolean = true;
  booking: Booking;

  minDate: string;
  maxDate: string;
  onRoomForm: FormGroup;

  selectedIndex: number;
  isToggle: boolean = false;

  bookingFromDate: FormControl = new FormControl();
  dateTypeSelection: FormControl = new FormControl();

  dateSelected : string;
  selectionType : string;
  bookingURLOB : Booking;
  visibleCards: Boolean = false;

  constructor(private availabilityService: AvailabilityService,
    private toastController: ToastController,
    public navCtrl: NavController,
    private router: Router,
    private bookingService: BookingService,
    private changeDetectorRefs: ChangeDetectorRef,
    public actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder,
    private propertyService: PropertyService,
    private token: TokenStorage) {
        this.property = new Property();
    this.booking = new Booking();
    this.onRoomForm = this.formBuilder.group({
      'bookingFromDate': ['', Validators.compose([
        Validators.required
      ])],
    //   'dateTypeSelection': ['', Validators.compose([
    //     Validators.nullValidator
    //   ])],
    });

    this.rommAvailability = new RoomAvailability();
    this.setCurrentDate();
  }

  ngOnInit() {
    this.token.claerBookingDetal();
    this.initView();
    this.property = this.token.getProperty();
    console.log("property details", this.property)
  }
  navigateToPage() {
    this.navCtrl.navigateForward('/home');
  }

  showCards(){
    this.visibleCards = !this.visibleCards;
  }

  onDateSelected(date)
  {
      this.dateSelected = date;
    
  }

  ionViewDidEnter()
  {
    this.token.claerBookingDetal();
    this.initView(); 
  }

  indexvalue(index) {
    Logger.log('index ; ' + index);
    this.selectedIndex = index;

    if (this.isToggle === true) {
      this.isToggle = false;
    }
    else {
      this.isToggle = true;
    }
  }


  initView() {
    let date: Date = new Date();
    let todate: Date = new Date();

    todate.setDate(todate.getDate() + 7);

    this.rommAvailability.FromDate = this.getDate(date);
    this.rommAvailability.ToDate = this.getDate(todate);
    this.rommAvailability.PropertyId = parseInt(this.token.getPropertyId());
    // Logger.log('Property ID : '+this.token.getPropertyId());
    this.getAllRoomsByDate(this.rommAvailability);

    this.rooms = this.token.getRoomTypes();
  }


  getItems(ev: any) {
    // this.isProgressing = true;
    const val = ev.target.value;

    Logger.log('search -- ' + val);

    if (val === '') {
      this.initView();
    } else {
      this.roomData = this.roomDataObject;
      this.isProgressing = false;
      this.roomData.floors = this.roomData.floors.filter((item) => {

        const searchResult = (
          String(item.number).trim().indexOf(val.trim()) > -1 ||
          item.name.toLowerCase().indexOf(val.toLowerCase().trim()) > -1);

        return searchResult;
      });
    }

  }



  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

  setCurrentDate() {
    let currentDate: Date = new Date();
    this.minDate = this.getDate(new Date(currentDate.getTime() - 86400000 * 30 * 6));
    this.maxDate = this.getDate(new Date(currentDate.getTime() + 86400000 * 30 * 24));
  }

  getDate(date: Date): string {
    let currentDay: string;
    let currentMonth: string;

    if (date.getDate().toString().length === 1) {
        currentDay = '0' + date.getDate();
    } else {
        currentDay = '' + date.getDate();
    }

    if ((date.getMonth() + 1).toString().length === 1) {
        currentMonth = '0' + (date.getMonth() + 1);
    } else {
        currentMonth = '' + (date.getMonth() + 1);
    }

    return date.getFullYear() + '-' + currentMonth + '-' + currentDay;
}


  getAllRoomsByDate(availableroom: RoomAvailability) {
    this.FLOOR = [];
    this.DATE_ARRAY = [];
    this.SUPER_ROOMS = [];
    this.NO_OF_ROOMS = [];
    this.ROOM_NO_ARRAY = [];


    this.propertyService.getAllRoomsByDate(availableroom)
      .subscribe(data => {

        this.roomData = data.body;
        this.isProgressing = false;
        // this.floorData = this.roomData[0].floors;
        // this.floorData.sort((a, b) => a.rooms[0].roomNumber > b.rooms[0].roomNumber);
        this.roomDataObject = data.body;
        console.log("........", this.roomData, this.roomDataObject)

        if(this.roomData != null && this.roomData.length >0)
        {
            this.dateSelected = this.roomData[0].date;
        }


        // this.convertObjectToArray(data.body);
        this.changeDetectorRefs.detectChanges();
      });
  }

//   convertObjectToArray(roomdata) {
//     this.SUPER_ROOMS = [];
//     this.DATE_ARRAY = [];

//     for (let i = 0; i < parseInt(JSON.stringify(roomdata.length)); i++) {
//         let dateinterface: SelectedDate = {
//             date: roomdata[i].date,
//           day: roomdata[i].day,
//           noOfAvailable: (roomdata[i].noOfAvailable),
//           noOfBooked: (roomdata[i].noOfBooked),
//           noOfGuestCheckIn: (roomdata[i].noOfGuestCheckIn),
//           noOfGuestCheckOut: (roomdata[i].noOfGuestCheckOut),
//           noOfGuestInHouse: (roomdata[i].noOfGuestInHouse),
//         };
//         // Logger.log('dateinterface '+dateinterface);
//         this.DATE_ARRAY.push(dateinterface);
//       }

//     // for (let k = 0; k < parseInt(JSON.stringify(roomdata.length)); k++) {

//     //   for (let i = 0; i < parseInt(JSON.stringify(roomdata[k].floors.length)); i++) {
//     //     for (let j = 0; j < parseInt(JSON.stringify(roomdata[k].floors[i].rooms.length)); j++) {
//     //       let roominterterface: RoomDetails = {
//     //         date: roomdata[k].date,
//     //         roomType: roomdata[k].floors[i].rooms[j].roomType,
//     //         roomNumber: roomdata[k].floors[i].rooms[j].roomNumber,
//     //         available: roomdata[k].floors[i].rooms[j].available,
//     //         roomId: roomdata[k].floors[i].rooms[j].roomId,
//     //         guestName: roomdata[k].floors[i].rooms[j].guestName,
//     //         bookingId: roomdata[k].floors[i].rooms[j].bookingId,
//     //         description: roomdata[k].floors[i].rooms[j].description,
//     //         roomStatus: roomdata[k].floors[i].rooms[j].roomStatus,
//     //         floorNumber: roomdata[k].floors[i].rooms[j].floorNumber,
//     //         floorName: roomdata[k].floors[i].rooms[j].floorName,
//     //         noOfBed: roomdata[k].floors[i].rooms[j].noOfBed,
//     //         bedType: roomdata[k].floors[i].rooms[j].bedType,

//     //       };
//     //       this.SUPER_ROOMS.push(roominterterface);
//     //     }
//     //   }
//     // }

//     // Logger.log(' this.SUPER_ROOMS '+ JSON.stringify( this.SUPER_ROOMS));

//     this.changeDetectorRefs.detectChanges();
//   }

  DateChange() {
    this.isProgressing = true;
    let toDate = new Date(this.rommAvailability.FromDate);

    this.rommAvailability.FromDate = this.getDate(toDate);

    toDate.setDate(toDate.getDate() + 7);

    this.rommAvailability.ToDate = this.getDate(toDate);
    this.rommAvailability.PropertyId = parseInt(this.token.getPropertyId());

    //Logger.log('Property ID : '+JSON.stringify(this.rommAvailability));

    this.getAllRoomsByDate(this.rommAvailability);

    this.rooms = this.token.getRoomTypes();
  }

  async roomdetail2(room, dateOfBooking)
  {
    let toDate = new Date(room.date);

    this.booking.fromDate = this.getDate(toDate);
    toDate.setDate(toDate.getDate() + 1);
    this.booking.toDate = this.getDate(toDate);
    this.booking.roomType = room.roomType;
    this.booking.roomId = room.roomId;
    this.booking.id = room.bookingId;
    this.token.saveBookingDetal(this.booking);

    if(room.roomStatus === 'VACANT_READY')
    {
        this.Booked(room,dateOfBooking);
    }
    else
    {
        this.roomStatus(room);
    }
  }

  async roomdetail(room) {
    let toDate = new Date(room.date);

    this.booking.fromDate = this.getDate(toDate);
    toDate.setDate(toDate.getDate() + 1);
    this.booking.toDate = this.getDate(toDate);
    this.booking.roomType = room.roomType;
    this.booking.roomId = room.roomId;

    Logger.log('room.bookingId' + JSON.stringify(this.booking));

    //   if(room.available == true)
    //   {
    //     // this.token.saveBookingDetal(this.booking);
    //     // this.Booked(room);
    //   }
    //   else
    //   {
    this.booking.id = room.bookingId;
    this.token.saveBookingDetal(this.booking);
    this.service(room);
    //}
  }

  async roomStatus(room) {
   
    const actionSheet = await this.actionSheetController.create({
      header: 'Room no :' + room.roomNumber,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          icon: 'close',
          cssClass: 'actionsheet-close',
          handler: () => {
            Logger.log('apply the changes');

           // this.token.claerBookingStatus();
            actionSheet.dismiss();
          }
        },
        {
            text: 'Change Room Status',
            icon: 'swap-horizontal-outline',
            handler: () => {

                let navigationExtras: NavigationExtras = {
                    queryParams: {
                        room: JSON.stringify(room),
                        date:this.dateSelected
                    }
                  };
              
                this.router.navigate(['room-status-change'], navigationExtras);
    
            }
        }]
    });
    await actionSheet.present();
  }

  async service(room) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Room no :' + room.roomNumber,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          icon: 'close',
          cssClass: 'actionsheet-close',
          handler: () => {
            Logger.log('apply the changes');

          //  this.token.claerBookingStatus();
            actionSheet.dismiss();
          }
        },
        {
          text: 'Add Service',
          icon: 'cafe',
          handler: () => {
            this.navCtrl.navigateForward('user-service');
          }
        },
        {
            text: 'Change Room Status',
            icon: 'swap-horizontal-outline',
            handler: () => {
                let navigationExtras: NavigationExtras = {
                    queryParams: {
                        room: JSON.stringify(room),
                        date:this.dateSelected
                    }
                  };
              
                this.router.navigate(['room-status-change'], navigationExtras);
            }
        }]
    });
    await actionSheet.present();
  }
  async Booked(room,dateOfBooking) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Room Type :' + room.roomType,
      buttons: [
        {
            text: 'Change Room Status',
            icon: 'swap-horizontal-outline',
            handler: () => {

                let navigationExtras: NavigationExtras = {
                    queryParams: {
                        room: JSON.stringify(room),
                        date:this.dateSelected
                    }
                  };
              
                this.router.navigate(['room-status-change'], navigationExtras);
    
            }
        },
        {
          text: 'Close',
          role: 'cancel',
          icon: 'close',
          cssClass: 'actionsheet-close',
          handler: () => {
            Logger.log('apply the changes');

          //  this.token.claerBookingStatus();
            actionSheet.dismiss();
          }
        },
        {
          text: 'Add Booking',
          icon: 'bookmarks',
          handler: () => {
            this.onBook(room,dateOfBooking);
          }
        }]
    });
    await actionSheet.present();
  }

  onBook(room,dateOfBooking) {

    this.bookingURLOB = new Booking();
    // this.bookingURLOB.businessEmail = this.token.getProperty().email;
    // this.bookingURLOB.businessName = this.token.getProperty().businessName;
    // this.bookingURLOB.mobile = this.token.getProperty().mobile;
    this.bookingURLOB.fromDate = dateOfBooking;
    this.bookingURLOB.roomBooking = true;
    this.bookingURLOB.roomId = room.roomId,
      this.bookingURLOB.noOfRooms = 1;

    this.bookingURLOB.roomDetails = [];
    this.bookingURLOB.roomDetails.push(room);

    let navigationExtras: NavigationExtras = {
      queryParams: {
        RoomBooking: JSON.stringify(this.bookingURLOB),
        //status :'Copy',
      }
    };

    this.router.navigate(['booking'], navigationExtras);
  }


}
