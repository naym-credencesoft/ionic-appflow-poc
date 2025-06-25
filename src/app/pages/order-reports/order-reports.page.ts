import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Property } from 'src/app/model/property/Property';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-order-reports',
  templateUrl: './order-reports.page.html',
  styleUrls: ['./order-reports.page.scss'],
})
export class OrderReportsPage implements OnInit {
  property: Property;
  propertyId: number;
  currency: string;
  constructor(public menuCtrl: MenuController,
    public token: TokenStorage,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.property = this.token.getProperty();
    this.propertyId = this.token.getProperty().id;
    if (
      this.property.localCurrency != null &&
      this.property.localCurrency != undefined
    ) {
      this.currency = this.property.localCurrency.toUpperCase();
    }
  }
  menuAction() {
    this.menuCtrl.toggle();
  }

  navOrderReport(){
    this.navCtrl.navigateForward(['/order-report-dashboard'] );
 
  }

  navOrder(){
    this.navCtrl.navigateForward(['/service-order-report'] );
  }
}
