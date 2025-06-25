import { Logger } from "../../../service/logger.service";
import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Room } from "../../../model/room";
import { RatesAndAvailability } from "../../../model/manage-booking/rateandavailability/rateandavailability";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { ToastController } from "@ionic/angular";
import { AvailabilityService } from "../../../service/AvailabilityService/availability.service";
import { DateService } from "../../../service/DateService/date-service.service";
import { TokenStorage } from "src/app/token.storage";

@Component({
    selector: "app-edit-item",
    templateUrl: "./edit-item.component.html",
    styleUrls: ["./edit-item.component.scss"],
})
export class EditItemComponent implements OnInit {
    isRequested: boolean = false;
    room: Room;
    rate: RatesAndAvailability;
    onEditRateForm: FormGroup;

    price: FormControl = new FormControl();
    total: FormControl = new FormControl();
    booked: FormControl = new FormControl();
    hold: FormControl = new FormControl();
    Available: FormControl = new FormControl();

    constructor(
        public token: TokenStorage,
        private modalcntrler: ModalController,
        private navParams: NavParams,
        public dateService: DateService,
        private availabilityService: AvailabilityService,
        private toastController: ToastController,
        private formBuilder: FormBuilder
    ) {
        this.onEditRateForm = this.formBuilder.group({
            price: ["", Validators.compose([Validators.required])],
            total: ["", Validators.compose([Validators.required])],
            booked: ["", Validators.compose([Validators.nullValidator])],
            hold: ["", Validators.compose([Validators.nullValidator])],
            Available: ["", Validators.compose([Validators.nullValidator])],
        });

        this.room = new Room();
        this.rate = new RatesAndAvailability();
    }

    ngOnInit() {
        let RoomOb = this.navParams.get("Room");
        let RateOb = this.navParams.get("Rate");

        this.room = RoomOb;
        this.rate = RateOb;
    }

    valuechangeAvailable(available) {
        if (parseInt(available) > this.rate.totalNoRooms) {
            this.rate.noOfBooked = 0;
            this.rate.noOfAvailable = this.rate.totalNoRooms;
        } else {
            this.rate.noOfBooked = this.rate.totalNoRooms - parseInt(available);
        }
    }

    valuechange(bookvalue) {
        if (parseInt(bookvalue) > this.rate.totalNoRooms) {
            this.rate.noOfBooked = this.rate.totalNoRooms;
            this.rate.noOfAvailable = 0;
        } else {
            this.rate.noOfAvailable = this.rate.totalNoRooms - bookvalue;
        }
    }

    submit() {
        this.isRequested = true;
        Logger.log("submit " + JSON.stringify(this.rate));

        //  this.availabilityService.updateRatesAvailability(this.rate).subscribe(response => {

        //     this.isRequested = false ;
        //     Logger.log('success '+ JSON.stringify( response.body));
        //     this.rate = response.body ;
        //     this.rate.noOfAvailable = response.body.noOfAvailable ;
        //     this.rate. price = response.body.price ;
        //     this.presentToast(`Rates & Availabilities Updated`);
        //     this.close();

        // }
        // ,error=>{
        //     this.isRequested = false;
        // });
    }

    close() {
        this.modalcntrler.dismiss();
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
}
