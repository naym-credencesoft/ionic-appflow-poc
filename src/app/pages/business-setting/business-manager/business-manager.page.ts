import { Logger } from '../../../service/logger.service';
import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { Property } from '../../../model/property/Property';
import { FileService } from '../../../service/file.service';
import { PropertyService } from '../../../service/property/property.service';
import { TokenStorage } from '../../../token.storage';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-business-manager',
  templateUrl: './business-manager.page.html',
  styleUrls: ['./business-manager.page.scss'],
})
export class BusinessManagerPage implements OnInit {

  loader: boolean = false;
  property: Property;

  ManagerForm: FormGroup;
  fname: FormControl = new FormControl();
  lname: FormControl = new FormControl();
  email: FormControl = new FormControl();
  phone: FormControl = new FormControl();

  formData: FormData;

  constructor(private toastController: ToastController,
    private _location: Location,
    private fileService: FileService,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    private propertyService: PropertyService,
    private token: TokenStorage) {
    this.property = new Property();
    this.property = this.token.getProperty();

  }

  ngOnInit() {
    this.ManagerForm = this.formBuilder.group({
      'fname': ['', Validators.compose([
        Validators.required
      ])],
      'lname': ['', Validators.compose([
        Validators.required
      ])],
      'email': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'phone': ['', Validators.compose([
        Validators.nullValidator
      ])],
    });
  }

  onSubmit() {
    this.loader = true;

    this.propertyService.updateProperty(this.property).subscribe(res => {
      this.loader = false;
      this.token.saveProperty(this.property);
      this.presentToast('Business Manager Information Update Successfully');
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
