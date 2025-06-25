import { Component, OnInit } from '@angular/core';
import { Property } from "../../model/property/Property";
import { TokenStorage } from "./../../token.storage";
import { NavController, LoadingController, MenuController, ActionSheetController } from "@ionic/angular";
import { Logger } from "../../service/logger.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-rates-and-availability',
  templateUrl: './master-rates-and-availability.page.html',
  styleUrls: ['./master-rates-and-availability.page.scss'],
})
export class MasterRatesAndAvailabilityPage implements OnInit {
    property: Property;

  constructor(public token: TokenStorage,
    private menuCtrl: MenuController,
    private router: Router,
    private actionSheetController: ActionSheetController,
    public navCtrl: NavController,) { }

  ngOnInit() {
    this.property = this.token.getProperty();
  }

  menuAction() {
    this.menuCtrl.toggle();
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
PMSRateAndAvailability() {
    Logger.log("PMSRateAndAvailability");
    this.router.navigateByUrl('/master-rates-and-availability', { skipLocationChange: true }).then(() => {
        this.router.navigate(["rate-and-availability"]);
      });
}

CMRateAndAvailability() {
    Logger.log("CMRateAndAvailability");
    this.navCtrl.navigateForward("cm-rates-and-availability");
}

back() {
    this.navCtrl.navigateForward("home");
}

}
