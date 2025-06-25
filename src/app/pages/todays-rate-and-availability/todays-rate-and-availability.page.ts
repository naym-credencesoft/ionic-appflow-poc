import { Logger } from "../../service/logger.service";
import { Component, OnInit } from "@angular/core";
import { Room } from "../../model/room";
import { TokenStorage } from "./../../token.storage";
import { FormBuilder } from "@angular/forms";
import { LoadingController, NavController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";
import { AvailabilityService } from "../../service/AvailabilityService/availability.service";
import { AlertController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { Property } from "../../model/property/Property";
import { RatesAndAvailability } from "../../model/manage-booking/rateandavailability/rateandavailability";
import { Plan } from "../booking/plan";
import { NavigationExtras } from "@angular/router";
import { OtaAvailability } from "../availability-update/otaAvailability";

export interface RatesAndAvailabilityInterface {
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
    otaAvailabilityList?: OtaAvailability[];
}

@Component({
    selector: "app-todays-rate-and-availability",
    templateUrl: "./todays-rate-and-availability.page.html",
    styleUrls: ["./todays-rate-and-availability.page.scss"],
})
export class TodaysRateAndAvailabilityPage implements OnInit {
    selectedIndexNumber: number;

    ratesAndAvailabilitieOb: RatesAndAvailability;
    ratesAndAvailabilities: RatesAndAvailability[] = [];
    ratesAndAvailabilitiesProperties: RatesAndAvailability[] = [];

    isListToggle: boolean = false;
    isPropertyClick: boolean = false;
    isResetButtonClick: boolean = false;

    toMinDate: string;
    toMaxDate: string;
    currentMonth: string;
    currentDay: string;

    rooms: Room[] = [];
    roomsWithData: Room[] = [];
    property: Property;
    pageTitle: string;
    propertyId: number;
    isProgressing: boolean;

    constructor(
        public token: TokenStorage,
        private toastController: ToastController,
        private formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        private alertCtrl: AlertController,
        private modalController: ModalController,
        private availabilityService: AvailabilityService
    ) {}

    ngOnInit() {
        this.ratesAndAvailabilitieOb = new RatesAndAvailability();
        this.propertyId = +this.token.getPropertyId();
        this.property = this.token.getProperty();

        this.rooms = this.token.getRoomTypes();

        if(this.rooms != null && this.rooms != undefined && this.rooms.length >0)
        {
            this.rooms.sort(this.token.roomSequenceByRanking(true));
        }
    

        this.getRatesAndAvailability();
    }

    getRatesAndAvailability() {
        this.isListToggle = false;
        this.isPropertyClick = false;
        this.ratesAndAvailabilitiesProperties = [];
        this.ratesAndAvailabilities = [];
        this.isProgressing = true;

        let date: Date = new Date();
        let currentDate = this.getDate(date);

        Logger.log("currentDate : " + currentDate);

        date.setDate(date.getDate() + 1);
        let toDate = this.getDate(date);
        Logger.log("currentDate : " + toDate);

        this.ratesAndAvailabilitieOb.fromDate = currentDate;
        this.ratesAndAvailabilitieOb.toDate = toDate;
        this.ratesAndAvailabilitieOb.propertyId = this.propertyId;
        this.getRatesForPropertyByDate(this.ratesAndAvailabilitieOb);
        this.findRatesAndAvailabilityForAllRoomsByDate(
            this.ratesAndAvailabilitieOb
        );
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

        return (
            date.getFullYear() + "-" + this.currentMonth + "-" + this.currentDay
        );
    }

    findRatesAndAvailabilityForAllRoomsByDate(
        ratesAndAvailability: RatesAndAvailability
    ) {
        this.roomsWithData = [];
        if(this.rooms != null && this.rooms != undefined && this.rooms.length >0)
        {
            this.rooms.sort(this.token.roomSequenceByRanking(true));
            for (let num = 0; num < this.rooms.length; num++) {
                const room = this.rooms[num];
                ratesAndAvailability.roomId = room.id;
                this.getRatesForRoomByDate(room, ratesAndAvailability);
            }
        }
        this.isProgressing = false;
    }

    listToggle(index) {
        this.selectedIndexNumber = index;
        if (this.isListToggle === true) {
            this.isListToggle = false;
        } else {
            this.isListToggle = true;
        }
    }

    getRatesForRoomByDate(
        room: Room,
        rateAndAvailability: RatesAndAvailability
    ) {
        this.availabilityService
            .getAvailabilityForRoomByDate(rateAndAvailability)
            .subscribe((resp) => {
                if (resp.body.length === 0) {
                    this.presentToast(
                        `Rates And Availability not setup for the dates,please load the rates.`
                    );
                } else {
                    // this.ratesAndAvailabilities = [] ;
                    for (let num = 0; num < resp.body.length; num++) {
                        const ratesAndAvailability: RatesAndAvailabilityInterface = {
                            id: resp.body[num].id,
                            date: resp.body[num].date,
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
                    this.roomsWithData.push(room);
                    this.roomsWithData.sort(this.token.roomSequenceByRanking(true));
                }
            });

            this.roomsWithData.sort(this.token.roomSequenceByRanking(true));
    }
    getRatesForPropertyByDate(rateAndAvailability: RatesAndAvailability) {
        this.ratesAndAvailabilitiesProperties = [];
        this.availabilityService
            .getAvailabilityForPropertyByDate(rateAndAvailability)
            .subscribe((resp) => {
                if (resp.body.length === 0) {
                    this.presentToast(
                        `Rates And Availability not setup for the dates,please load the rates.`
                    );
                } else {
                    for (let num = 0; num < resp.body.length; num++) {
                        const ratesAndAvailability: RatesAndAvailabilityInterface = {
                            id: resp.body[num].id,
                            date: resp.body[num].date,
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
                        this.ratesAndAvailabilitiesProperties.push(
                            ratesAndAvailability
                        );
                    }
                    // Logger.log('By Date this.ratesAndAvailabilities : '+JSON.stringify(this.ratesAndAvailabilitiesProperties));
                }
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

    async EditItemRoom(rate: any, room: any) {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            Room: JSON.stringify(room),
            Rate: JSON.stringify(rate),
          }
        };
    
        this.navCtrl.navigateForward(['edit-rate'], navigationExtras);
      }

    propertyClick() {
        if (this.isPropertyClick == false) {
            this.isPropertyClick = true;
        } else {
            this.isPropertyClick = false;
        }
    }
}
