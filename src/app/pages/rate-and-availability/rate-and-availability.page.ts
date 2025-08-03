import { Logger } from "../../service/logger.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Room } from "../../model/room";
import { DatePipe, Location } from "@angular/common";
import { TokenStorage } from "./../../token.storage";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { NavController, LoadingController, MenuController, ActionSheetController } from "@ionic/angular";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
// import { RatesAndAvailability } from "../../model/manage-booking/rateandavailability/rateandavailability";
import { AvailabilityService } from "../../service/AvailabilityService/availability.service";
import { AlertController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { DateService } from "../../service/DateService/date-service.service";
import { Property } from "../../model/property/Property";
import { Plan } from "../booking/plan";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { RatesAndAvailability } from "src/app/model/manage-booking/rateandavailability/rateandavailability";
import { CheckSubscription } from "src/app/checkSubscription";

export interface RatesAvailabilityInterface {
    id?: number;
    date?: string;
    noOfAvailable?: number;
    noOfBooked?: number;
    noOfOnHold?: number;
    price?: number;
    propertyId?: number;
    propertyName?: string;
    roomId?: number;
    roomName?: string;
    totalNoRooms?: number;
    fromDate?: string;
    toDate?: string;
    status: string;
    restriction: string;
    roomRatePlans: Plan[];
    stopSellOBE: boolean;
    stopSellOTA: boolean;
}

@Component({
    selector: "app-rate-and-availability",
    templateUrl: "./rate-and-availability.page.html",
    styleUrls: ["./rate-and-availability.page.scss"],
})
export class RateAndAvailabilityPage implements OnInit {
    onRateAvailabilityForm: FormGroup;
    isOpen = false;
    isChannelManager: boolean;
    rateAndAvailFromDate: FormControl = new FormControl();
    rateAndAvailToDate: FormControl = new FormControl();
    isProgressing: boolean = true;

    ratesAndAvailabilitieOb: RatesAndAvailability;
    ratesAndAvailabilities: RatesAvailabilityInterface[] = [];
    ratesAndAvailabilitiesFilter: RatesAvailabilityInterface[] = [];
    ratesAndAvailabilitiesProperties: RatesAvailabilityInterface[] = [];
    ratesAndAvailabilitiesProperty: RatesAvailabilityInterface;

    isListToggle: boolean = false;

    isResetButtonClick: boolean = false;

    fromMinDate: string;
    fromMaxDate: string;
    toMinDate: string;
    toMaxDate: string;
    currentMonth: string;
    currentDay: string;
    propertyData: RatesAndAvailability[];

    rooms: Room[] = [];
    roomSelected: Room;
    roomsWithData: Room[] = [];
    property: Property;
    pageTitle: string;
    propertyId: number;

    selectedIndexNumber: number;
    segmentIndex: number = 0;
    isPropertyDateSelected: boolean = false;
    currency: string;

    userData: ApplicationUser;
    roomnames: any;
    expandedIndex: number | null = null; // Track the currently expanded section
    selectedRoomData: any = null;
    propertyShown: boolean;

    isFromDateSelected = false;
    isToDateSelected = false;

 isFromModalOpen = false;
isToModalOpen = false;
    constructor(
        public token: TokenStorage,
        private toastController: ToastController,
        private formBuilder: FormBuilder,
        private router: Router,
        private actionSheetController: ActionSheetController,
        private alertCtrl: AlertController,
        public navCtrl: NavController,
        public dateService: DateService,
        private menuCtrl: MenuController,
        private authService: AuthService,
        public loadingCtrl: LoadingController,
        private modalController: ModalController,
        private availabilityService: AvailabilityService,
        private _location: Location,
        private changeDetectorRefs: ChangeDetectorRef,
        private route: ActivatedRoute,
        private checkSubscription: CheckSubscription,
    ) {
this.roomnames =[]
        this.userData = new ApplicationUser();
        this.onRateAvailabilityForm = this.formBuilder.group({
            rateAndAvailFromDate: [
                "",
                Validators.compose([Validators.required]),
            ],
            rateAndAvailToDate: ["", Validators.compose([Validators.required])],
        });

        this.currentDate();
    }

    ngOnInit() {

        this.authService
        .getUserByUserId(this.token.getUserId())
        .subscribe((resp) => {
            this.userData = resp.body;
        });

        this.segmentIndex = 0;
        this.ratesAndAvailabilitieOb = new RatesAndAvailability();
        this.propertyId = +this.token.getPropertyId();
        this.property = this.token.getProperty();
        this.isChannelManager = this.checkSubscription.isSubscriptionMatch(
            this.checkSubscription.getChannelManagement(),
            this.token.getProperty().subscriptionList
          );
        this.rooms = this.token.getRoomTypes();
        if(localStorage.getItem("fromDate") != null ) {
            this.ratesAndAvailabilitieOb.fromDate = localStorage.getItem("fromDate") || "";
            this.ratesAndAvailabilitieOb.toDate = localStorage.getItem("toDate") || "";
    
        }
     
        
        if (
            this.property.localCurrency != null &&
            this.property.localCurrency != undefined
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }

        //this.getRatesAndAvailability();
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

    toggleRateUpdate() {
        this.isOpen = !this.isOpen;
        this.selectedRoomData = null;
        this.expandedIndex = null;
      }

      toggleExpand(index: number, room: any): void {
        // Prevent rapid toggling
        if (this.expandedIndex === index) {
            this.expandedIndex = null;
            this.selectedRoomData = null;
        } else {
            this.expandedIndex = index;
            this.selectedRoomData = room;
        }
    
        this.propertyShown = false;
        this.isOpen = false;
    }
    
    trackByRoomId(index: number, room: any): any {
        // Ensure each room has a unique identifier for efficient rendering
        return room?.id || index;
    }

    toggleExpandOne(property) {

        this.expandedIndex = null;
        this.propertyShown = true;
    }

    onCancel(){
        this.navCtrl.back();
        this.token.remove("fromDate");
        this.token.remove("toDate");
      }

      goBack(){
        this.router.navigateByUrl('/rate-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["master-rates-and-availability"]);
          });
        // this.router.navigate(["master-rates-and-availability"]);
        this.token.remove("fromDate");
        this.token.remove("toDate");
      }
    
    menuAction() {
        this.menuCtrl.toggle();
    }

    getResponceFromRoomRateComponent(data: string) {
        if (data === "update-room") {
            this.getRatesAndAvailability();
        }
    }

    ionViewDidEnter() {
        this.Reset();
        this.expandedIndex = null;
        if(localStorage.getItem("fromDate") != null ) {
            this.ratesAndAvailabilitieOb.fromDate = localStorage.getItem("fromDate") || "";
            this.ratesAndAvailabilitieOb.toDate = localStorage.getItem("toDate") || "";
    
        }
        this.getRatesAndAvailability();
    }

    currentDate() {
        let fromDate = new Date();

        fromDate.setDate(fromDate.getDate() - 30);
        this.fromMinDate = this.getDate(fromDate);

        fromDate.setFullYear(fromDate.getFullYear() + 5);
        this.fromMaxDate = this.getDate(fromDate);
    }

    onUpdatePlan(plan) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                room: JSON.stringify(this.roomSelected),
                plan: JSON.stringify(plan),
                isInventoryPlanUpdate: true,
            },
        };
        this.token.remove("fromDate");
        this.token.remove("toDate");
        this.router.navigateByUrl('/rate-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["add-room-plan"], navigationExtras);
          });
        
    }
    navigatetonextpage(){
     
        // let navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         room: JSON.stringify( this.roomnames),
               
        //     },
        // };
        this.token.remove("fromDate");
        this.token.remove("toDate");
        this.router.navigateByUrl('/rate-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["availability-update"]);
          });
        // this.router.navigate(["availability-update"]);
    }
    goback(){
        this.token.remove("fromDate");
        this.token.remove("toDate");
        this.router.navigateByUrl('/rate-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["master-rates-and-availability"]);
          });
        // this.router.navigate(["master-rates-and-availability"]);
      }
    masterrateupdatepage(){
        this.token.remove("fromDate");
        this.token.remove("toDate");
        // let navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         room: JSON.stringify( this.roomnames),
               
        //     },
        // };
        this.router.navigateByUrl('/rate-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["master-rates-update"]);
          });
        // this.router.navigate(["master-rates-update"]);
    }

    navigatetostopSell(){
        this.token.remove("fromDate");
        this.token.remove("toDate");
        this.router.navigateByUrl('/rate-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["stop-sell"]);
          });
        // this.router.navigate(["stop-sell"]);
    }

    // segmentChanged(event) {
    //     Logger.log("segmentIndex " + this.segmentIndex);
    // }

    onPropertyDaterateClick(propertyRateDto) {
        this.ratesAndAvailabilitiesProperty = propertyRateDto;
        if (this.isPropertyDateSelected === true) {
            this.isPropertyDateSelected = false;
        } else {
            this.isPropertyDateSelected = true;
        }
    }

    onAddOrUpdatePlanEdit(row, rateInfo) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                room: JSON.stringify(this.roomSelected),
                permission: 5,
                plan: JSON.stringify(row),
                date: JSON.stringify(rateInfo.date),
            },
        };
        this.router.navigateByUrl('/rate-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["add-or-update-plan"], navigationExtras);
          });
        // this.router.navigate(["add-or-update-plan"], navigationExtras);
    }

    onSelectedType(segmentIndex)
    { 
        if (segmentIndex === 0)
        { 
            this.roomSelected = new Room();
        }
        else
        { 
            let room = this.roomsWithData.find(data => data.id === segmentIndex);
            this.onRoomSelected(room);
        }
    }

    onRoomSelected(room) {
        this.roomSelected = new Room();
        this.roomSelected = room;

        this.roomSelected.rateAndAvailabilityList = [];

        this.ratesAndAvailabilitiesFilter = [];
        this.ratesAndAvailabilitiesFilter = this.ratesAndAvailabilities;

        this.ratesAndAvailabilitiesFilter =
            this.ratesAndAvailabilitiesFilter.filter((item) => {
                const searchResult =
                    item.roomId != null &&
                    String(item.roomId).indexOf(
                        String(this.roomSelected.id).trim()
                    ) > -1;

                return searchResult;
            });

        this.roomSelected.rateAndAvailabilityList =
            this.ratesAndAvailabilitiesFilter;
    }

    listToggle(index) {
        this.selectedIndexNumber = index;
        if (this.isListToggle === true) {
            this.isListToggle = false;
        } else {
            this.isListToggle = true;
        }
    }

    Reset() {
    
        this.isResetButtonClick = true;
        this.ratesAndAvailabilitiesProperties = [];
        this.ratesAndAvailabilities = [];
        this.roomsWithData = [];

        this.onRateAvailabilityForm.reset();
        this.ratesAndAvailabilitieOb = null;

        this.isListToggle = false;
        this.segmentIndex = 0;

        this.ratesAndAvailabilitieOb = new RatesAndAvailability();
       
    }

    ResetOne(){
        this.token.remove("fromDate");
        this.token.remove("toDate");
        this.isResetButtonClick = true;
        this.ratesAndAvailabilitiesProperties = [];
        this.ratesAndAvailabilities = [];
        this.roomsWithData = [];

        this.onRateAvailabilityForm.reset();
        this.ratesAndAvailabilitieOb = null;

        this.isListToggle = false;
        this.segmentIndex = 0;

        this.ratesAndAvailabilitieOb = new RatesAndAvailability();
        this.getRatesAndAvailability();
        
    }


fromDateChange() {
  const fromDate = this.onRateAvailabilityForm.get('rateAndAvailFromDate')?.value;

  if (!fromDate) {
    console.warn('fromDate is undefined or empty.');
    return;
  }
 this.isFromDateSelected = !!fromDate;
  // Calculate min and max dates
  const from = new Date(fromDate);

  // Disable all dates before the selected fromDate
  this.toMinDate = this.formatDate(from);

  // Example: limit to 16 days after fromDate
//   const max = new Date(from);
//   max.setDate(max.getDate() + 16);
//   this.toMaxDate = this.formatDate(max);

  // Clear toDate if it's invalid (before min)
  const toDate = this.onRateAvailabilityForm.get('rateAndAvailToDate')?.value;
  if (toDate && new Date(toDate) < new Date(this.toMinDate)) {
    this.onRateAvailabilityForm.patchValue({ rateAndAvailToDate: '' });
  }
}

toDateChange() {
  const toDate = this.onRateAvailabilityForm.get('rateAndAvailToDate')?.value;
  this.isToDateSelected = !!toDate;
}
formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // yyyy-MM-dd
}

    // fromDateChange() {
    // const fromDate =  this.onRateAvailabilityForm.get('rateAndAvailFromDate')?.value;

    // if (!fromDate) {
    //     Logger.warn('fromDate is undefined or empty.');
    //     return;
    // }

    // Logger.log('From date changed:', fromDate);

    // const from = new Date(fromDate);

    // const minToDate = new Date(from);
    // minToDate.setDate(minToDate.getDate() + 1);
    // this.toMinDate = this.getDate(minToDate); 

    // const maxToDate = new Date(from);
    // maxToDate.setDate(maxToDate.getDate() + 16);
    // this.toMaxDate = this.getDate(maxToDate);

    // Logger.log(`toMinDate set to: ${this.toMinDate}`);
    // Logger.log(`toMaxDate set to: ${this.toMaxDate}`);
    // }

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

        return (
            date.getFullYear() + "-" + this.currentMonth + "-" + this.currentDay
        );
    }

    getRatesAndAvailability() {
        this.isProgressing = true;
        if (
            this.ratesAndAvailabilitieOb.fromDate === undefined ||
            this.ratesAndAvailabilitieOb.toDate === undefined
        ) {
            setTimeout(() => {
                this.getRatesForPropertyNextSevenDays();
            this.getRatesAndAvailabilityForAllRoomsForNextSevenDays();
            }, 1000);
            
            this.isProgressing = false;
        } else {
            this.isListToggle = false;

            this.ratesAndAvailabilitiesProperties = [];
            this.ratesAndAvailabilities = [];
            this.ratesAndAvailabilitieOb.fromDate = this.getUTCDateToDate(
                this.ratesAndAvailabilitieOb.fromDate
            );
            this.ratesAndAvailabilitieOb.toDate = this.getUTCDateToDate(
                this.ratesAndAvailabilitieOb.toDate
            );
            this.ratesAndAvailabilitieOb.propertyId = this.propertyId;
            this.getRatesForPropertyByDate(this.ratesAndAvailabilitieOb);
            this.findRatesAndAvailabilityForAllRoomsByDate(
                this.ratesAndAvailabilitieOb
            );
            this.isProgressing = false;
        }
    }

    trackByRoomIdOne(index: number, room: any): number {
        return room.id; // Ensure each room has a unique ID
      }
      

    findRatesAndAvailabilityForAllRoomsByDate(
        ratesAndAvailability: RatesAndAvailability
      ) {
        this.roomsWithData = [];
        if (this.rooms.length > 0) {
          for (let num = 0; num < this.rooms.length; num++) {
            const room = this.rooms[num];
            ratesAndAvailability.roomId = room.id;
            this.getRatesForRoomByDate(room, ratesAndAvailability,num);
          }
        }
      }

    toggleSegment() {
        // Toggle segmentIndex to show/hide the <app-rate-update> component
        this.segmentIndex = this.segmentIndex === 0 ? null : 0;
      }

      getRatesForRoomByDate(room: Room, rateAndAvailability: RatesAndAvailability, index : number) {
        this.isProgressing = true;
        room.rateAndAvailabilityList = [];
        this.availabilityService
          .getAvailabilityForRoomByDate(rateAndAvailability)
          .subscribe((resp) => {
            if (resp.body.length === 0) {
                this.isProgressing = false;
              this.presentToast(
                `Rates And Availability not setup for the dates,please load the rates.`
              );
            } else {
              room.rateAndAvailabilityList = resp.body;
              this.isProgressing = false;
              this.roomsWithData.push(room);
              this.roomsWithData.sort(this.token.roomSequenceByRanking(true));
              this.changeDetectorRefs.detectChanges();
            }
    
          });
      }
    getRatesForPropertyByDate(rateAndAvailability: RatesAndAvailability) {
        this.isProgressing = true;
        this.propertyData = [];
        this.availabilityService
          .getAvailabilityForPropertyByDate(rateAndAvailability)
          .subscribe((resp) => {
            if (resp.body.length === 0) {
                this.isProgressing = false;
              this.presentToast(
                `Rates And Availability not setup for the dates,please load the rates.`
              );
            } else {
              this.propertyData = resp.body;
              this.changeDetectorRefs.detectChanges();
              this.isProgressing = false;
              // Logger.log(this.ratesAndAvailabilities);
            }
          });
      }

      back(){
        
      }

    getRatesAndAvailabilityForAllRoomsForNextSevenDays() {
        this.roomsWithData = [];
        this.ratesAndAvailabilities = [];
        if (
            this.rooms != null &&
            this.rooms != undefined &&
            this.rooms.length > 0
        ) {
            this.rooms.sort(this.token.roomSequenceByRanking(true));
            this.rooms.sort(this.token.roomSequenceByRanking(true));
            for (let num = 0; num < this.rooms.length; num++) {
                const room = this.rooms[num];

                this.getRatesForRoomNextSevenDays(room,num);
            }
        }
    }

    getRatesForPropertyNextSevenDays() {
        this.isProgressing = true;
        this.propertyData = [];
        this.availabilityService
          .getAvailabilityForPropertyAllNext7Days(this.propertyId)
          .subscribe((resp) => {
            if (resp.body.length === 0) {
                this.isProgressing = false;
              this.presentToast(
                `Rates And Availability not setup for the dates,please load the rates.`
              );
            } else {
              this.propertyData = resp.body;
              this.isProgressing = false;
              this.changeDetectorRefs.detectChanges();
            }
          });
      }

    getRatesForRoomNextSevenDays(room: Room, index : number) {
        this.isProgressing = true;
        room.rateAndAvailabilityList = [];
        this.availabilityService
          .getAvailabilityForRoomAllNext7Days(this.propertyId, room.id)
          .subscribe((resp) => {
            if (resp.body.length === 0) {
                this.isProgressing = false;
              this.presentToast(
                `Rates And Availability not setup for the dates,please load the rates.`
              );
            } else {
              room.rateAndAvailabilityList = resp.body;
              this.isProgressing = false;
              this.roomsWithData.push(room);
              this.roomsWithData.sort(this.token.roomSequenceByRanking(true));
              
            }
            this.isProgressing = false;
          });
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    getUTCDateToDate(dateString: string) {
        var yearAndMonth = dateString.split("-", 3);
        Logger.log(yearAndMonth + " --" + yearAndMonth[2].split("T", 1));

        return (
            yearAndMonth[0] +
            "-" +
            yearAndMonth[1] +
            "-" +
            yearAndMonth[2].split("T", 1)
        );
    }

    async EditItemProperty(rate: any) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                Room: JSON.stringify(this.property),
                Rate: JSON.stringify(rate),
            },
        };
        this.token.remove("fromDate");
        this.token.remove("toDate");

        this.navCtrl.navigateForward(["edit-rate"], navigationExtras);
        // const modal = await this.modalController.create({
        //     component: EditItemComponent,

        //     componentProps: {
        //       'Rate': rate,
        //       'Room': this.property
        //     }

        //   });
        //   return await modal.present();
    }

    async EditItemRoom(rate: any, room: any) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                Room: JSON.stringify(room),
                Rate: JSON.stringify(rate),
            },
        };

        this.navCtrl.navigateForward(["edit-rate"], navigationExtras);
        // const modal = await this.modalController.create({
        //     component: EditItemComponent,

        //     componentProps: {
        //       'Rate': rate,
        //       'Room': room
        //     }

        //   });
        //   return await modal.present();
    }
}
