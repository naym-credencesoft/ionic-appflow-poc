import { Logger } from '../../../service/logger.service';
import { TokenStorage } from './../../../token.storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../../../service/property/property.service';
import { Property } from '../../../model/property/Property';
import { NavController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.page.html',
  styleUrls: ['./business-profile.page.scss'],
})
export class BusinessProfilePage implements OnInit {

  loader: boolean = false;

  onBusinessForm: FormGroup;
  name: FormControl = new FormControl();
  slogan: FormControl = new FormControl();
  shortName: FormControl = new FormControl();
  gst: FormControl = new FormControl();
  landphone: FormControl = new FormControl();
  mobile: FormControl = new FormControl();
  website: FormControl = new FormControl();
  currency: FormControl = new FormControl();

  property: Property;

  constructor(private formBuilder: FormBuilder,
    public navCtrl: NavController,
    private propertyService: PropertyService,
    private toastController: ToastController,
    private _location: Location,
    private token: TokenStorage) {
    this.property = new Property();
    this.property = this.token.getProperty();
  }

  ngOnInit() {
    this.onBusinessForm = this.formBuilder.group({
      'name': ['', Validators.compose([
        Validators.required
      ])],
      'slogan': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'shortName': ['', Validators.compose([
        Validators.required
      ])],
      'gst': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'landphone': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'mobile': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'website': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'currency': ['', Validators.compose([
        Validators.required
      ])],

    });
  }

  onSubmit() {
    this.loader = true;

    this.propertyService.updateProperty(this.property).subscribe(res => {
      this.loader = false;
      this.token.saveProperty(this.property);
      this.presentToast('Business information update successfully');
      this.back();

    }, error => {
      this.loader = false;
      Logger.log('' + JSON.stringify(error));
    });
  }
  back() {
    this._location.back();
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/setting');
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

}
