import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.page.html',
  styleUrls: ['./product-dashboard.page.scss'],
})
export class ProductDashboardPage implements OnInit {

  constructor( private navCtrl: NavController,) { }

  ngOnInit() {
  }

  onManageProductGroup()
  {
    this.navCtrl.navigateForward("product-group-list");
  }

  onManageProduct()
  {
    this.navCtrl.navigateForward("manage-product");
  }

}
