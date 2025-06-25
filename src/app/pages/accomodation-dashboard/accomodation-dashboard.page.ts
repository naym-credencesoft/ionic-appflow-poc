import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import { Property } from "src/app/model/property/Property";
import {
    ActionSheetController,
    IonRouterOutlet,
    MenuController,
    ModalController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { ActionBookingMenuComponent } from "src/app/component/booking-list/action-booking-menu/action-booking-menu.component";
import { RoomAvailability } from "src/app/model/RoomAvailability/RoomAvailability";
import { CheckUserType } from "src/app/model/checkUserType";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { RatesAndAvailability } from "src/app/model/manage-booking/rateandavailability/rateandavailability";
import { ApplicationUser } from "src/app/model/user";
import { AvailabilityService } from "src/app/service/AvailabilityService/availability.service";
import { DateService } from "src/app/service/DateService/date-service.service";
import { AuthService } from "src/app/service/auth.service";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { PropertyService } from "src/app/service/property/property.service";
import { TokenStorage } from "src/app/token.storage";

export interface RoomDetailsInterface {
    
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
    roomOb: any;
    roomSequenceNumber: number;
    checkoutBookingId: number;
}


@Component({
  selector: 'app-accomodation-dashboard',
  templateUrl: './accomodation-dashboard.page.html',
  styleUrls: ['./accomodation-dashboard.page.scss'],
})
export class AccomodationDashboardPage implements OnInit {
    property: Property;
    onDashBoardForm: FormGroup;
    ratesAndAvailabilities: any[];
    ratesAndAvailability: RatesAndAvailability = {
        id: 0,
        date: "",
        noOfAvailable: 0,
        noOfBooked: 0,
        noOfOnHold: 0,
        price: 0,
        propertyId: 0,
        propertyName: "",
        roomId: 0,
        roomName: "",
        totalNoRooms: 0,
        status: "",
        restriction: "",
        roomRatePlans: [],
        stopSellOBE: false,
        stopSellOTA: false,
    };

    TODAYS_ROOMS = [];
    TODAYS_ROOMS_FILTER = [];
    rommAvailability: RoomAvailability;
    isFontDeskExUser: boolean = false;
    role: any = [];
    checkUserType: CheckUserType;
    bookingURLOB: Booking;
    isProgressing: boolean;

    currentStatus: string = "All";
    StatusChangeControll: FormControl = new FormControl();
    bookingFromDate: FormControl = new FormControl();
    isDateChange: boolean = false;
    userData: ApplicationUser;

    constructor(
        private changeDetectorRefs: ChangeDetectorRef,
        private propertyService: PropertyService,
        private navCtrl: NavController,
        public datepipe: DatePipe,
        private menuCtrl: MenuController,
        private actionSheetController: ActionSheetController,
        private toastController: ToastController,
        private dateService: DateService,
        public availabilityService: AvailabilityService,
        private modalController: ModalController,
        private routerOutlet: IonRouterOutlet,
        private router: Router,
        private token: TokenStorage,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private bookingService: BookingService
    ) {
        this.checkUserType = new CheckUserType();
        this.rommAvailability = new RoomAvailability();
        this.userData = new ApplicationUser();
        this.property = new Property();
        this.onDashBoardForm = this.formBuilder.group({
            StatusChangeControll: [
                "",
                Validators.compose([Validators.required]),
            ],
            bookingFromDate: ["", Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.role = [];
        this.property = this.token.getProperty();
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });

        if (this.checkUserType.isFontDeskEx(this.role[0]) == true) {
            this.isFontDeskExUser = true;
        }

        this.rommAvailability.FromDate = this.datepipe.transform(
            new Date(),
            "yyyy-MM-dd"
        );
        this.filterDataByMenu();
        this.getUserData();
    }

    ionViewWillEnter(){
        this.filterDataByMenu();
    }

    getUserData() {
        const UserId = this.token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(data => {
          this.userData = data.body;
          this.changeDetectorRefs.detectChanges();
    
        }, error => {
        });
    
      }

    dateChnageOp() {
        if (this.isDateChange === false) {
            this.isDateChange = true;
            this.filterDataByMenu();
        }
    }

    async onMenu() {
        const actionSheet = await this.actionSheetController.create({
            header: "Switch Dashboard",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                {
                    text: "Accommodation Dashboard",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateForward("home");
                    },
                },
                {
                    text: "Service Dashboard",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateForward("service-dashboard");
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    resetFunction(){
        this.rommAvailability.FromDate = this.datepipe.transform(
            new Date(),
            "yyyy-MM-dd"
        );
        this.currentStatus = "All"
    }


    filterDataByMenu() {
        this.isProgressing = true;
        this.TODAYS_ROOMS = [];
        this.changeDetectorRefs.detectChanges();
       

        let toDate = new Date(this.rommAvailability.FromDate);
        this.rommAvailability.FromDate = this.getDate(toDate);

        toDate.setDate(toDate.getDate() + 1);
        this.rommAvailability.ToDate = this.getDate(toDate);

        this.rommAvailability.PropertyId = parseInt(this.token.getPropertyId());

        this.propertyService
            .getAllRoomsByDate(this.rommAvailability)
            .subscribe((data) => {
                this.convertObjectToArrayByCurrentDay(data.body);
                //  this.convertObjectToArraySingleDay(data.body);
                this.isDateChange = false;
                this.isProgressing = false;
                this.changeDetectorRefs.detectChanges();
            });
    }

    convertObjectToArrayByCurrentDay(roomData) {
        this.TODAYS_ROOMS = [];
        this.TODAYS_ROOMS_FILTER = [];

        for (let k = 0; k < parseInt(JSON.stringify(roomData.length)); k++) {
            for (
                let i = 0;
                i < parseInt(JSON.stringify(roomData[k].floors.length));
                i++
            ) {
                for (
                    let j = 0;
                    j <
                    parseInt(
                        JSON.stringify(roomData[k].floors[i].rooms.length)
                    );
                    j++
                ) {
                    let roominterterface: RoomDetailsInterface = {
                        date: roomData[k].date,
                        roomType: roomData[k].floors[i].rooms[j].roomType,
                        roomNumber: roomData[k].floors[i].rooms[j].roomNumber,
                        available: roomData[k].floors[i].rooms[j].available,
                        roomId: roomData[k].floors[i].rooms[j].roomId,
                        guestName: roomData[k].floors[i].rooms[j].guestName,
                        bookingId: roomData[k].floors[i].rooms[j].bookingId,
                        description: roomData[k].floors[i].rooms[j].description,
                        roomStatus: roomData[k].floors[i].rooms[j].roomStatus,
                        floorNumber: roomData[k].floors[i].rooms[j].floorNumber,
                        floorName: roomData[k].floors[i].rooms[j].floorName,
                        noOfBed: roomData[k].floors[i].rooms[j].noOfBed,
                        bedType: roomData[k].floors[i].rooms[j].bedType,
                        roomOb: roomData[k].floors[i].rooms[j],
                        roomSequenceNumber:
                            roomData[k].floors[i].rooms[j].roomSequenceNumber,
                        checkoutBookingId:
                            roomData[k].floors[i].rooms[j].checkoutBookingId,
                    };
                    this.TODAYS_ROOMS.push(roominterterface);

                    this.TODAYS_ROOMS = this.sortTodaysArray(this.TODAYS_ROOMS);
                    this.TODAYS_ROOMS_FILTER = this.TODAYS_ROOMS;
                }
            }
        }
        this.changeDetectorRefs.detectChanges();
    }

    getDate(date: Date) {
        let currentDay, currentMonth;
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

        return date.getFullYear() + "-" + currentMonth + "-" + currentDay;
    }

    sortTodaysArray(array) {
        let sequenceArray = [],
            nonSequenceArray = [];
        for (var i = 0; i < array.length; i++) {
            if (
                array[i].roomOb.roomSequenceNumber != null &&
                array[i].roomOb.roomSequenceNumber != undefined
            ) {
                sequenceArray.push(array[i]);
            } else {
                nonSequenceArray.push(array[i]);
            }
        }

        sequenceArray = this.sortArraySqToday(sequenceArray);
        nonSequenceArray = this.sortArrayNonSqToday(nonSequenceArray);

        for (let i = 0; i < nonSequenceArray.length; i++) {
            sequenceArray.push(nonSequenceArray[i]);
        }

        return sequenceArray;
    }

    sortArraySqToday(array) {
        var temp = 0;
        for (var i = 0; i < array.length; i++) {
            for (var j = i; j < array.length; j++) {
                if (
                    array[j].roomOb.roomSequenceNumber <
                    array[i].roomOb.roomSequenceNumber
                ) {
                    temp = array[j];
                    array[j] = array[i];
                    array[i] = temp;
                }
            }
        }
        return array;
    }
    sortArrayNonSqToday(array) {
        var temp = 0;
        for (var i = 0; i < array.length; i++) {
            for (var j = i; j < array.length; j++) {
                if (array[j].roomNumber < array[i].roomNumber) {
                    temp = array[j];
                    array[j] = array[i];
                    array[i] = temp;
                }
            }
        }
        return array;
    }

    isCheckoutBooking(room) {
        if (
            room.checkOutGuest != null &&
            room.checkOutGuest != undefined &&
            this.getCheckOutDate(room) != null &&
            this.datepipe.transform(this.getCheckOutDate(room), "yyyy-MM-dd") ==
                this.datepipe.transform(
                    this.rommAvailability.FromDate,
                    "yyyy-MM-dd"
                )
        ) {
            return true;
        } else {
            return false;
        }
    }

    getCheckOutDate(room) {
        if (room.checkoutTime != null) {
            return room.checkoutTime;
        } else if (room.toDateCheckoutGuest != null) {
            return room.toDateCheckoutGuest;
        } else if (room.toDate != null) {
            return room.toDate;
        } else {
            return null;
        }
    }

    isBookEnable() {
        let currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        if (
            (this.isFontDeskExUser === true &&
                new Date(this.rommAvailability.FromDate).getTime() >
                    currentDate.getTime()) ||
            this.isFontDeskExUser === false
        ) {
            return true;
        } else {
            return false;
        }
    }

    onBook(room) {
        let bookingURLOB = new Booking();
        bookingURLOB.businessEmail = this.token.getProperty().email;
        bookingURLOB.businessName = this.token.getProperty().businessName;
       // bookingURLOB.mobile = this.token.getProperty().mobile;
        bookingURLOB.roomBooking = true;
        (bookingURLOB.roomId = room.roomId), (bookingURLOB.noOfRooms = 1);
        bookingURLOB.fromDate = this.datepipe.transform(
            this.rommAvailability.FromDate,
            "yyyy-MM-dd"
        );

        if(this.datepipe.transform(
            this.rommAvailability.FromDate,
            "yyyy-MM-dd"
        ) === this.datepipe.transform(
            new Date(),
            "yyyy-MM-dd"
            ))
        { 
            bookingURLOB.bookingStatus = "CHECKEDIN";
        }
        else
        { 
            bookingURLOB.bookingStatus = "CONFIRMED";
        }


        bookingURLOB.toDate = this.getCheckoutDate(bookingURLOB.fromDate);

        bookingURLOB.roomDetails = [];
        bookingURLOB.roomDetails.push(room);

        let navigationExtras: NavigationExtras = {
            queryParams: {
                RoomBooking: JSON.stringify(bookingURLOB),
            },
        };

        this.router.navigate(["booking"], navigationExtras);
    }

    getCheckoutDate(checkedinDate) {
        let checkoutDate: Date = new Date(checkedinDate);
        checkoutDate.setDate(checkoutDate.getDate() + 1);

        return this.datepipe.transform(checkoutDate.getTime(), "yyyy-MM-dd");
    }

    PaymentDetails(bookingId) {
        let navigationExtras: NavigationExtras = {
                
            queryParams: {
                bookingId: JSON.stringify(bookingId),
            }
          };
        this.router.navigate(['/booking-list-details/paymentsTab'],navigationExtras);
    }

    checkBookingId(room) {
        
        if (room.bookingId != null && room.bookingId != undefined) {
            this.getBookingdetailsById(room.bookingId);
            
        } else if (
            room.checkoutBookingId != null &&
            room.checkoutBookingId != undefined &&
            room.checkOutGuest != null &&
            room.checkOutGuest != undefined &&
            room.checkOutGuest != ""
        ) {
            this.getBookingdetailsById(room.checkoutBookingId);
        } else {
            this.presentToast("No Booking Found");
            
            let navigationExtras: NavigationExtras = {
                
                queryParams: {
                    room: JSON.stringify(room),
                    
                    date: this.rommAvailability.FromDate
                }
              };
          
            this.router.navigate(['room-status-change'], navigationExtras);
        }
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    getBookingdetailsById(bookingId: number) {
        console.log("bookingId " + bookingId);
        if (bookingId != null && bookingId != undefined) {
            this.bookingService.findBooking(bookingId).subscribe(
                (response1) => {
                    this.isProgressing = false;
                    let row = response1.body;
                    this.viewdetail(row);
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {

                    this.changeDetectorRefs.detectChanges();
                }
            );
        }
    }

    async viewdetail(booking: any) {
        this.actionMenuModal(booking);
    }

    async actionMenuModal(booking: Booking) {
        const modal = await this.modalController.create({
            component: ActionBookingMenuComponent,
            cssClass: "my-custom-class",
            swipeToClose: true,
            componentProps: {
                booking: booking,
            },
            presentingElement: this.routerOutlet.nativeEl,
        });

        modal.onDidDismiss().then((data) => {
            console.log("list  modal dismissed", data);
            if (data != undefined && data != null && data.data === "done") {
                this.filterDataByMenu();
            } else if (
                data != undefined &&
                data != null &&
                data.data === "checkout"
            ) {
                this.getRatesAndAvailability(booking);
                this.filterDataByMenu();
            }
        });
        return await modal.present();
    }

    getRatesAndAvailability(row) {
        this.isProgressing = false;
        let currentDate: Date = new Date();
        let currentDateString =
            this.dateService.convertMillisecondsToYYYMMDDFormat(currentDate);

        this.ratesAndAvailability.fromDate = currentDateString;
        this.ratesAndAvailability.toDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(row.toDate);

        this.ratesAndAvailability.propertyId = this.token.getProperty().id;
        this.ratesAndAvailability.roomId = row.roomId;
        this.getRatesForRoomByDate(this.ratesAndAvailability);
    }

    getRatesForRoomByDate(rateAndAvailability: RatesAndAvailability) {
        this.ratesAndAvailabilities = [];

        this.availabilityService
            .getAvailabilityForRoomByDate(rateAndAvailability)
            .subscribe((resp) => {
                if (resp.body.length === 0) {
                } else {
                    //this.loader = true;
                    this.ratesAndAvailabilities = [];
                    for (let num = 0; num < resp.body.length; num++) {
                        const ratesAndAvailability: RatesAndAvailability = {
                            id: resp.body[num].id,
                            date: resp.body[num].date,
                            noOfAvailable: resp.body[num].noOfAvailable + 1,
                            noOfBooked: resp.body[num].noOfBooked - 1,
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
                        // this.ratesAndAvailabilities.push(ratesAndAvailability);

                        if (ratesAndAvailability.noOfBooked > -1) {
                            this.save(ratesAndAvailability);
                        }
                    }
                    this.isProgressing = false;
                    this.changeDetectorRefs.detectChanges();
                }
            });
    }

    save(ratesAndAvailability: RatesAndAvailability) {
        this.availabilityService
            .updateRatesAvailability(ratesAndAvailability)
            .subscribe(
                (response) => {},
                (error) => {
                    this.isProgressing = false;
                    this.changeDetectorRefs.detectChanges();
                }
            );
    }

    menuAction() {
        this.menuCtrl.toggle();
    }

    filterByStatus() {
        let searchResult;

        if (this.currentStatus === "All") {
            this.TODAYS_ROOMS = this.TODAYS_ROOMS_FILTER;
            this.changeDetectorRefs.detectChanges();
        } else {
            this.TODAYS_ROOMS = this.TODAYS_ROOMS_FILTER;
            this.TODAYS_ROOMS = this.TODAYS_ROOMS.filter((item) => {
                searchResult =
                    (this.currentStatus != "All" &&
                        item.roomStatus != null &&
                        item.roomStatus != undefined &&
                        item.roomStatus === this.currentStatus) ||
                    (this.currentStatus != "All" &&
                        this.currentStatus == "CHECKING_OUT" &&
                        this.isCheckoutBooking(item.roomOb) === true);

                return searchResult;
            });
        }
    }

    onNewBooking() {
        this.router.navigate(["booking"]);
    }

    onRoomEnquiry() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                status: "enquiry",
            },
        };
        this.router.navigate(["booking"], navigationExtras);
    }

    onManageBooking() {
        this.navCtrl.navigateForward("booking-list");
    }
}
