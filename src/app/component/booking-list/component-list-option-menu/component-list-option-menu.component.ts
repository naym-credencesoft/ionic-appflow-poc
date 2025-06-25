import { Logger } from '../../../service/logger.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Property } from 'src/app/model/property/Property';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-component-list-option-menu',
  templateUrl: './component-list-option-menu.component.html',
  styleUrls: ['./component-list-option-menu.component.scss'],
})
export class ComponentListOptionMenuComponent implements OnInit {

  property : Property;

  constructor(private navCtrl :NavController,
    private token : TokenStorage,
    private popover: PopoverController) 
    { 
        this.property = new Property();
    }

  ngOnInit() 
  {
    this.property = this.token.getProperty();
  }

  detail() {
    // this.popover.dismiss();
    // this.navCtrl.navigateForward('booking-list-details');
  }
  onCreateBooking() {
    this.popover.dismiss();
    Logger.log('create booking');
    this.navCtrl.navigateForward('booking');
  }
  onManageRateAvailbility() {
    this.popover.dismiss();
    Logger.log('onManageRateAvailbility');
    this.navCtrl.navigateForward('rate-and-availability');
  }
  onManagePayment() {
    this.popover.dismiss();
    Logger.log('payment-list');
    this.navCtrl.navigateForward('payment-list');
  }
  onManageExpence() {
    this.popover.dismiss();
    Logger.log('expence-list');
    this.navCtrl.navigateForward('expence-list');
  }

}
