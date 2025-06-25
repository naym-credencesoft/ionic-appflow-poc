import { Logger } from '../../service/logger.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Customer } from '../../model/Customer/customer';
import { TranslateProvider } from '../../providers';
import { TokenStorage } from './../../token.storage';
import { NavController } from '@ionic/angular';
import { CustomerService } from '../../service/Customer/customer.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";
import { NavigationExtras } from '@angular/router';
import { DateService } from '../../service/DateService/date-service.service';
import { Property } from "src/app/model/property/Property";
import { CountryCode } from 'src/app/model/countryCode';
import {DatePipe, Location} from '@angular/common';

@Component({
  selector: 'app-add-customer-details',
  templateUrl: './add-customer-details.page.html',
  styleUrls: ['./add-customer-details.page.scss'],
})
export class AddCustomerDetailsPage implements OnInit {
    property: Property;
  componentModel: string;
  isCustomerDisable: boolean = false;
  isAddressDisable: boolean = true;
  customerData: string;
  CodeNumber: string;
  countryCode: CountryCode;


  customer: Customer;
  isView: boolean = false;
  loader: boolean = false;
  isDetails: boolean = false;

  onCustomerForm: FormGroup;
  onCustomerFormOne: FormGroup;
  headerTitle: string = "Add Customer";
  submitTitle: string = "Submit";

  Isphone: Boolean;
  firstName: FormControl = new FormControl();
  lastName: FormControl = new FormControl();
  email: FormControl = new FormControl();
  Phone: FormControl = new FormControl();
  gender: FormControl = new FormControl();
  language: FormControl = new FormControl();
  noOfKids: FormControl = new FormControl();
  noOfPets: FormControl = new FormControl();
  company: FormControl = new FormControl();
  birthday: FormControl = new FormControl();
  anniversaryDate: FormControl = new FormControl();
  TaxIdNumber: FormControl = new FormControl();

  constructor(private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private token: TokenStorage,
    private navCtrl: NavController,
    private acRoute: ActivatedRoute,
    private dateService: DateService,
    private toastController: ToastController,
    private customerService: CustomerService,
    private _location: Location,
    private translate: TranslateProvider) {
    this.componentModel = "customer";
    this.property = new Property();
    this.customer = new Customer();

    this.onCustomerForm = this.formBuilder.group({
      'firstName': ['', Validators.compose([
        Validators.required
      ])],
      'lastName': ['', Validators.compose([
        Validators.required
      ])],
      'email': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      countryCodeC: ["", Validators.compose([Validators.required])],
      'Phone': ['', Validators.compose([
        Validators.required
      ])],
      'gender': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'language': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'noOfKids': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'noOfPets': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'company': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'birthday': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'anniversaryDate': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'TaxIdNumber': ['', Validators.compose([
        Validators.nullValidator,
      ])],
    });

    this.onCustomerFormOne = this.formBuilder.group({
      'firstName': ['', Validators.compose([
        Validators.required
      ])],
      'lastName': ['', Validators.compose([
        Validators.required
      ])],
      'email': ['', Validators.compose([
        Validators.nullValidator,
      ])],
     
      'Phone': ['', Validators.compose([
        Validators.required
      ])],
      'gender': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'language': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'noOfKids': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'noOfPets': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'company': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'birthday': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'anniversaryDate': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'TaxIdNumber': ['', Validators.compose([
        Validators.nullValidator,
      ])],
    });
  
  }

  ngOnInit() {
    
    this.countryCode = new CountryCode();
    this.property = this.token.getProperty();
        console.log("property details", this.property)
    this.acRoute.queryParams.subscribe(params => {

      if (params["customerOb"] != undefined) {
        this.customer = JSON.parse(params["customerOb"]);

        if (this.customer.anniversaryDate != null) {
          this.customer.anniversaryDate = this.dateService.convertMillisecondsToYYYMMDDFormat(this.customer.anniversaryDate);
        }
        if (this.customer.birthday != null) {
          this.customer.birthday = this.dateService.convertMillisecondsToYYYMMDDFormat(this.customer.birthday);
        }
      }

      if (params["isDetails"] != undefined) {
        this.isDetails = JSON.parse(params["isDetails"]);

        if (this.isDetails === true) {
          this.isView = true;
          this.headerTitle = "Customer Details";
          this.submitTitle = "Update";
        }

      }

      if (params["customerOb"]) {
        this.Isphone = true;
      } else {
        this.Isphone = false;
      }


    });
  }

  customerDetail(event) {
    Logger.log('customer : ' + JSON.stringify(event));
    this.customerData = "info customer";
    this.isCustomerDisable = true;
    this.isAddressDisable = false;
    this.componentModel = "address";
  }

  countryCodePicker(event) {
    if (this.CodeNumber != undefined) {
        Logger.log(this.CodeNumber);
        this.customer.mobile = undefined;
    }
}

setMobileNumberByCode(phoneNumber) {
  let countryOb = this.countryCode.countries.find(
      (data) => data.code === phoneNumber.substring(0, data.code.length)
  );

  if (countryOb != undefined) {
      this.CodeNumber = countryOb.code;
      this.customer.mobile = phoneNumber.substring(
          this.CodeNumber.length
      );
      this.changeDetectorRefs.detectChanges();
  }
}

checkDefaultCountryCode() {
        if (
            this.property.address != undefined &&
            this.property.address != null &&
            this.property.address.country != null &&
            this.property.address.country != undefined
        ) {
            let code = this.countryCode.countries.find(
                (data) =>
                    data.name.toLowerCase() ===
                    this.property.address.country.toLowerCase()
            ).code;

            if (code != undefined) {
                this.CodeNumber = code;
            }
        }
    }

clear(e) {}

  onAddressUpdate(customer) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        customerOb: JSON.stringify(customer),
        isDetails: true,
      }
    };

    this.navCtrl.navigateForward(['add-customer-address'], navigationExtras);
  }

  onSubmit() {

    if (this.Isphone) {
      if (this.customer.anniversaryDate != null) {
        this.customer.anniversaryDate = this.getUTCDateToDate(this.customer.anniversaryDate);
      }
      if (this.customer.birthday != null) {
        this.customer.birthday = this.getUTCDateToDate(this.customer.birthday);
      }
  
      Logger.log('customer ' + JSON.stringify(this.customer));
      this.loader = true;
      this.customerService.createCustomer(this.customer).subscribe(res => {
        this.loader = false;
        this.customer = res.body;
  
        this.reset();
        this.presentToast('Customer information updated successfully');
        this.cancel();
      }, error => {
        this.loader = false;
      });
  } else {
    const phoneNumber = this.onCustomerForm.get('Phone').value;
    this.customer.propertyId = parseInt(this.token.getPropertyId());
    this.customer.mobile = this.CodeNumber + phoneNumber;

    if (this.customer.anniversaryDate != null) {
      this.customer.anniversaryDate = this.getUTCDateToDate(this.customer.anniversaryDate);
    }
    if (this.customer.birthday != null) {
      this.customer.birthday = this.getUTCDateToDate(this.customer.birthday);
    }

    Logger.log('customer ' + JSON.stringify(this.customer));
    this.loader = true;
    this.customerService.createCustomer(this.customer).subscribe(res => {
      this.loader = false;
      this.customer = res.body;

      this.reset();
      this.presentToast('Customer information updated successfully');
      this.cancel();
    }, error => {
      this.loader = false;
    });
  
    
  }
  }

  cancel() {
    // if (this.isView === true) {
    //   this.navCtrl.navigateForward('customer-details');
    // }
    // else {
    //   this.navCtrl.navigateBack('manage-customer');
    // }
    this._location.back(); 

  }

  reset() {
    this.onCustomerForm.reset();
    this.onCustomerFormOne.reset();
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

  getUTCDateToDate(dateString: string) {
    var yearAndMonth = dateString.split("-", 3);
    Logger.log(yearAndMonth + ' --' + yearAndMonth[2].split("T", 1));

    return yearAndMonth[0] + '-' + yearAndMonth[1] + '-' + yearAndMonth[2].split("T", 1);
  }

  onEdit() {
    this.isDetails = false;
  }

  navigateToPage() {
    this._location.back(); 
  }

}
