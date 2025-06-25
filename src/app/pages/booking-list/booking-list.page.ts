import { Logger } from '../../service/logger.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, MenuController, NavController } from '@ionic/angular';
import { TokenStorage } from './../../token.storage';
import { ToastController } from '@ionic/angular';
import { ApplicationUser } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { Location } from "@angular/common";
import { Property } from "src/app/model/property/Property";

import { NavigationExtras, Router } from "@angular/router";

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.page.html',
  styleUrls: ['./booking-list.page.scss'],
})
export class BookingListPage implements OnInit {

  isLoaded: boolean = false;
    listName: string;
    property: Property;
    userData: ApplicationUser;

  constructor(
    public navCtrl: NavController,
      private token: TokenStorage,
      private _location: Location,
      private authService: AuthService,
    private toastController: ToastController, 
    private actionSheetController: ActionSheetController,
    private menuCtrl: MenuController,
    private router: Router,) {
      //this.listName ="bookingList";
      this.userData = new ApplicationUser();
      this.property = new Property();
  }

  ionViewWillEnter() {
    Logger.log('ng view enter booking list');
    this.listName = 'bookingList';
    this.isLoaded = true;
  }

  ionViewWillLeave() {
    Logger.log('will leave');
    this.isLoaded = false;
  }



    ngOnInit() {
        this.property = this.token.getProperty();
        console.log("property details", this.property)
      
        this.authService
        .getUserByUserId(this.token.getUserId())
        .subscribe((resp) => {
            this.userData = resp.body;
        });

  }

  onNewBooking() {
    this.router.navigate(["booking"]);
}
menuAction() {
    this.menuCtrl.toggle();
}

  back() {
    this.navCtrl.navigateRoot("home");
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




  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }


}
