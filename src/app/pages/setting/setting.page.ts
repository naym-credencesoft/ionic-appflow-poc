import { Component, OnInit } from '@angular/core';
import { Property } from '../../model/property/Property';
import { TokenStorage } from '../../token.storage';
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

    property : Property;

  constructor(private token : TokenStorage, public navCtrl: NavController) 
  {
    this.property = new Property();
    this.property = this.token.getProperty();
  }

  ngOnInit() {
    this.property = this.token.getProperty();
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/home');
  }

  ionViewWillEnter() {
    this.property = this.token.getProperty();
  }

}
