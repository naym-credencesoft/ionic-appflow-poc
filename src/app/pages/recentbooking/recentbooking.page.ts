import { Component, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { TokenStorage } from './../../token.storage';
import { ToastController } from '@ionic/angular';
import { NavController } from "@ionic/angular";
import { Property } from "src/app/model/property/Property";

@Component({
  selector: 'app-recentbooking',
  templateUrl: './recentbooking.page.html',
  styleUrls: ['./recentbooking.page.scss'],
})
export class RecentbookingPage implements OnInit {
    property: Property;
  listName: string;

  constructor(

    private toastController: ToastController,
    private token: TokenStorage, public navCtrl: NavController,
  ) {
    this.listName = 'recentBooking';
    this.property = new Property();
  }

  ngOnInit() {
    this.property = this.token.getProperty();
    console.log("property details", this.property)
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/home');
  }

  //   getDetail()
  //   {
  //     this.isProgressing = true;
  //     this.bookingService.getCurrentAndFutureBookings(+this.token.getPropertyId()).subscribe(data => {
  //         this.bookings = data.body;
  //         this.bookingsId = data.body;
  //         Logger.log('booking object '+JSON.stringify(this.bookings));
  //         this.isProgressing = false;
  //       });
  //   }



}
