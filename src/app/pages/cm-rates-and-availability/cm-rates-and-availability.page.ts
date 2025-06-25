import { Component, OnInit } from '@angular/core';
import { Property } from "../../model/property/Property";
import { TokenStorage } from "./../../token.storage";
import { NavController, LoadingController, MenuController, ActionSheetController } from "@ionic/angular";
import { Logger } from "../../service/logger.service";
import { Location } from '@angular/common';
import { NavigationExtras, Router } from "@angular/router";
import { CheckSubscription } from 'src/app/checkSubscription';

@Component({
    selector: 'app-cm-rates-and-availability',
    templateUrl: './cm-rates-and-availability.page.html',
    styleUrls: ['./cm-rates-and-availability.page.scss'],
})
export class CmRatesAndAvailabilityPage implements OnInit {
    property: Property;
    isChannelManager: boolean;
    constructor(public token: TokenStorage,
        private menuCtrl: MenuController,
        private actionSheetController: ActionSheetController,
        public navCtrl: NavController,
       private _location: Location,
       private checkSubscription: CheckSubscription,
       private router: Router,) { }

    ngOnInit() {
        this.property = this.token.getProperty();
        this.isChannelManager = this.checkSubscription.isSubscriptionMatch(
            this.checkSubscription.getChannelManagement(),
            this.token.getProperty().subscriptionList
          );
    }


    menuAction() {
        this.menuCtrl.toggle();
    }
    goback() {
        this._location.back()
    }
    onback(){

        this.router.navigateByUrl('/cm-rates-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["master-rates-and-availability"]);
          });
    }
    navigatetonextpage(){
        this.router.navigateByUrl('/cm-rates-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["availability-update"]);
          });
    }
    masterrateupdatepage(){
        this.router.navigateByUrl('/cm-rates-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["master-rates-update"]);
          });

    }
    stopSell(){
        this.router.navigateByUrl('/cm-rates-and-availability', { skipLocationChange: true }).then(() => {
            this.router.navigate(["stop-sell"]);
          });
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


}
