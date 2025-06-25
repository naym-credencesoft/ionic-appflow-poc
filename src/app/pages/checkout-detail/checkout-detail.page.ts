import { Logger } from "../../service/logger.service";
import { Component, OnInit } from "@angular/core";
import { TokenStorage } from "./../../token.storage";
import { BookingService } from "../../service/manage-booking/booking-service.service";
import { ToastController } from "@ionic/angular";
import { NavController } from "@ionic/angular";
import { Booking } from "./../../model/manage-booking/Booking/Booking";
import { NavigationExtras, Router } from "@angular/router";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";

@Component({
    selector: "app-checkout-detail",
    templateUrl: "./checkout-detail.page.html",
    styleUrls: ["./checkout-detail.page.scss"],
})
export class CheckoutDetailPage implements OnInit {
    booking: Booking;

    isPayment: boolean = false;
    userData: ApplicationUser;

    constructor(
        public token: TokenStorage,
        private router: Router,
        private authService: AuthService,
        private bookingService: BookingService,
        public navCtrl: NavController,
        private toastController: ToastController
    ) {
        this.booking = new Booking();
        this.userData = new ApplicationUser();
    }

    ngOnInit() {
        this.authService
        .getUserByUserId(this.token.getUserId())
        .subscribe((resp) => {
            this.userData = resp.body;
        });
    }

    ionViewWillEnter() {
        this.onBalanceCalculate();
      }

    onBalanceCalculate()
    {

      this.bookingService.checkOutStandingAmountByBookingId(this.token.getBookingId()).subscribe(response1 => {
  
        if(response1.status ===200)
        {
            this.getBookingInfoByID();
        }
      });
    }

    getBookingInfoByID() {
        Logger.log("ID " + this.token.getBookingId());
        this.bookingService
            .findBooking((this.token.getBookingId()))
            .subscribe((response1) => {
                this.booking = response1.body;
            });
    }

    onBackBookingPage() {
        // let navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         bookinglistStatus: "success",
        //     }
        // };

        this.navCtrl.navigateForward(["booking-list"]);
    }

    onpayment() {
        //this.isPayment = true;

        let navigationExtras: NavigationExtras = {
            queryParams: {
                status :'checkoutPayment',
            }
          };
      
        this.router.navigate(['tab-payments'], navigationExtras);

    }
}
