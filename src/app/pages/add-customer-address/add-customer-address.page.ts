import { Logger } from '../../service/logger.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Customer } from '../../model/Customer/customer';
import { TranslateProvider } from '../../providers';
import { TokenStorage } from './../../token.storage';
import { NavController } from '@ionic/angular';
import { CustomerService } from '../../service/Customer/customer.service';
import { ToastController } from '@ionic/angular';
import { Address } from '../../model/Customer/address';
import { CountryList } from '../../model/Customer/country';
import { DateService } from '../../service/DateService/date-service.service';
import { ActivatedRoute } from "@angular/router";
import { Location} from '@angular/common';

@Component({
  selector: 'app-add-customer-address',
  templateUrl: './add-customer-address.page.html',
  styleUrls: ['./add-customer-address.page.scss'],
})
export class AddCustomerAddressPage implements OnInit {

  CountryArray: CountryList;
  address: Address;
  customer: Customer;
  isView: boolean = false;

  loader: boolean = false;
  isDetails: boolean = false;

  onAddressForm: FormGroup;

  StreetNumber: FormControl = new FormControl();
  streetName: FormControl = new FormControl();
  locality: FormControl = new FormControl();
  suburb: FormControl = new FormControl();
  city: FormControl = new FormControl();
  postcode: FormControl = new FormControl();
  state: FormControl = new FormControl();
  country: FormControl = new FormControl();
  addressLine1: FormControl = new FormControl();
  addressLine2: FormControl = new FormControl();


  constructor(private formBuilder: FormBuilder,
    private token: TokenStorage,
    private navCtrl: NavController,
    private acRoute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
    private dateService: DateService,
    private toastController: ToastController,
    private _location: Location,
    private customerService: CustomerService,
    private translate: TranslateProvider) {
    this.address = new Address();
    this.CountryArray = new CountryList();
    this.customer = new Customer();

    this.onAddressForm = this.formBuilder.group({
      'StreetNumber': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'streetName': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'locality': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'suburb': ['', Validators.compose([
        Validators.required
      ])],
      'city': ['', Validators.compose([
        Validators.required
      ])],
      'postcode': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'state': ['', Validators.compose([
        Validators.required
      ])],
      'country': ['', Validators.compose([
        Validators.required,
      ])],
      'addressLine1': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'addressLine2': ['', Validators.compose([
        Validators.nullValidator,
      ])]
    });

    this.acRoute.queryParams.subscribe(params => {

      if (params["customerOb"] != undefined) {
        this.customer = JSON.parse(params["customerOb"]);

        this.getCustomerAddress(String(this.customer.id));
      }

      if (params["isDetails"] != undefined) {
        this.isDetails = JSON.parse(params["isDetails"]);

      }
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

  }

  getCustomerAddress(customerID: string) {
    this.loader = true;
    this.customerService.getAddress(customerID).subscribe(response => {
      this.loader = false;
      if (response.body != null) {
        this.address = response.body;

        this.changeDetectorRefs.detectChanges();

      }

    }, error => {
      Logger.log('error ' + JSON.stringify(error));
      this.loader = false;
      this.changeDetectorRefs.detectChanges();

    });
  }



  onSubmit() {
    this.loader = true;
    Logger.log(String(this.customer.id) + ' address ' + JSON.stringify(this.address));
    this.customerService.updateAddress(this.address, String(this.customer.id)).subscribe(res => {
      this.loader = false;

      this.presentToast('Address update successfully');
      this.cancel();

    }, error => {
      this.loader = false;
      Logger.log('' + JSON.stringify(error));
    });
  }
  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

  onEdit() {
    this.isDetails = false;
  }

  cancel() {
    this._location.back(); 
  }

}
