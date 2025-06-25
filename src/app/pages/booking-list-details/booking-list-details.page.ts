import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import {
    NavController,
    MenuController,
    LoadingController,
} from "@ionic/angular";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { TriggerService } from "src/app/service/trigger/trigger.service";
import { TokenStorage } from "src/app/token.storage";
import { Location } from "@angular/common";

@Component({
    selector: "app-booking-list-details",
    templateUrl: "./booking-list-details.page.html",
    styleUrls: ["./booking-list-details.page.scss"],
})
export class BookingListDetailsPage implements OnInit {

    userData: ApplicationUser;
    
    constructor(
        private navCtrl: NavController,
        private _location: Location,
        private authService: AuthService,
        private token : TokenStorage,
        private triggerEventService: TriggerService
    ) {
        this.userData = new ApplicationUser();
    }

    setLocation(location: string) {
        // this.triggerEventService.newEvent(location);
    }

    ngOnInit() {
        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.userData = resp.body;
            });
    }

    back() {
        this._location.back();
    }

}
