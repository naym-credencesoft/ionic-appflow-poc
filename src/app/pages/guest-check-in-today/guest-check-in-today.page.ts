import { Logger } from "../../service/logger.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { BookingService } from "../../../app/service/manage-booking/booking-service.service";
import { CheckInGuestInfo } from "../../model/check-In/guestCheckInInfo";
import { TokenStorage } from "./../../token.storage";

@Component({
    selector: "app-guest-check-in-today",
    templateUrl: "./guest-check-in-today.page.html",
    styleUrls: ["./guest-check-in-today.page.scss"],
})
export class GuestCheckInTodayPage implements OnInit {
    checkInInfo: CheckInGuestInfo[] = [];

    isProgressing: boolean;

    p: number = 1;

    constructor(
        public navCtrl: NavController,
        private bookingService: BookingService,
        public token: TokenStorage
    ) {}

    ngOnInit() {
        this.getDetail();
        this.token.claerCheckInGuestInfo();
    }
    getDetail() {
        this.isProgressing = true;
        this.bookingService
            .getGuestChekingInToday(+this.token.getPropertyId())
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
        this.token.saveCheckInGuestInfo(checkinInfo);
    }
}
