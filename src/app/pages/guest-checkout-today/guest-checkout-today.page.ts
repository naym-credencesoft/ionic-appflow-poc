import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { BookingService } from "../../../app/service/manage-booking/booking-service.service";
import { Booking } from "../../model/manage-booking/Booking/Booking";
import { Logger } from "../../service/logger.service";
import { TokenStorage } from "./../../token.storage";

@Component({
    selector: "app-guest-checkout-today",
    templateUrl: "./guest-checkout-today.page.html",
    styleUrls: ["./guest-checkout-today.page.scss"],
})
export class GuestCheckoutTodayPage implements OnInit {
    checkInInfo: Booking[] = [];
    isProgressing: boolean;

    p: number = 1;
    
    constructor(
        public navCtrl: NavController,
        public bookingService: BookingService,
        public token: TokenStorage
    ) {}

    ngOnInit() {
        this.getDetail();
    }
    onMobileDail(mobileNumber) {
        Logger.log('mobileNumber' + mobileNumber);
    
      }
    
    getDetail() {
        this.isProgressing = true;
        this.bookingService
            .getGuestChekingOutToday(+this.token.getPropertyId())
            .subscribe((data) => {
                this.checkInInfo = data.body;
                this.isProgressing = false;
                Logger.log(
                    "checkOut object " + JSON.stringify(this.checkInInfo)
                );
            });
    }

    guestDetail(ob) {}
}
