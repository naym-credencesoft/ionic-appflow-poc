import { Logger } from "../../service/logger.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { BookingService } from "../../../app/service/manage-booking/booking-service.service";
import { TokenStorage } from "./../../token.storage";
import { Booking } from "../../model/manage-booking/Booking/Booking";

@Component({
    selector: "app-in-house-guest",
    templateUrl: "./in-house-guest.page.html",
    styleUrls: ["./in-house-guest.page.scss"],
})
export class InHouseGuestPage implements OnInit {
    checkInInfo: Booking[] = [];
    isProgressing: boolean;

    p: number = 1;

    constructor(
        public navCtrl: NavController,
        private bookingService: BookingService,
        public token: TokenStorage
    ) {}

    ngOnInit() {
        this.getDetail();
    }

    getDetail() {
        this.isProgressing = true;
        this.bookingService
            .getGuestInHouseToday(+this.token.getPropertyId())
            .subscribe((data) => {
                this.checkInInfo = data.body;
                this.isProgressing = false;
                Logger.log(
                    "checkin object " + JSON.stringify(this.checkInInfo)
                );
            });
    }

    guestDetail(checkinInfo: any) {
        Logger.log("detail checkin:" + JSON.stringify(checkinInfo));
        //this.token.saveCheckInGuestInfo(checkinInfo);
    }
}
