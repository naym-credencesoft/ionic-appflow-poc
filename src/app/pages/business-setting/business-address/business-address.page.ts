import { Logger } from '../../../service/logger.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { City } from '../../../model/address-setup/city';
import { Country } from '../../../model/address-setup/country';
import { State } from '../../../model/address-setup/state';
import { Street } from '../../../model/address-setup/street';
import { Suburb } from '../../../model/address-setup/suburbDto';
import { CountryList } from '../../../model/Customer/country';
import { Customer } from '../../../model/Customer/customer';
import { AddressService } from '../../../service/address-setup/address.service';
import { CustomerService } from '../../../service/Customer/customer.service';
import { TokenStorage } from '../../../token.storage';
import { Property } from '../../../model/property/Property';
import { Address } from '../../../model/address-checker/Address';
import { PropertyService } from '../../../service/property/property.service';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-business-address',
  templateUrl: './business-address.page.html',
  styleUrls: ['./business-address.page.scss'],
})
export class BusinessAddressPage implements OnInit {

  searchresult: string;
  streets: Street[];
  streetsFilter: Street[];

  searchString: string;

  customer: Customer;
  cities: City[];
  city: City;

  citiesSearch: City[];
  citiesSearchFilter: City[];
  countries: Country[];
  suburbs: Suburb[];
  states: State[];

  street: Street;

  isCodeSelect = false;
  onAddressForm: FormGroup;
  CountryArray: CountryList;
  loader: boolean = false;
  property: Property;
  CodeNumber: string;
  address: Address;

  routeId: string;

  sububList: any;

  isAddressFound: boolean = true;
  isAddressSearch: boolean = false;
  isLoginFrom: boolean = false;
  isStreetSelect: boolean = false;
  isSearchItem: boolean = false;

  StreatNumber: FormControl = new FormControl();
  StreatName: FormControl = new FormControl();
  Locality: FormControl = new FormControl();

  Suburb: FormControl = new FormControl();
  City: FormControl = new FormControl();
  Postcode: FormControl = new FormControl();
  State: FormControl = new FormControl();
  Country: FormControl = new FormControl();
    isIndianCurrency: boolean;

  constructor(private token: TokenStorage,
    private formBuilder: FormBuilder,
    private _location: Location,
    private changeDetectorRefs: ChangeDetectorRef,
    private addressService: AddressService,
    private propertyService: PropertyService,
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public toastController: ToastController,
    private customerService: CustomerService,) {
    this.customer = new Customer();
    this.address = new Address();
    this.CountryArray = new CountryList();
    this.street = new Street();

    this.property = new Property();
    this.property = this.token.getProperty();

    if(this.property.localCurrency.toLowerCase() ==='inr')
    {
       this.isIndianCurrency = true;
    }
    else
    {
        this.isIndianCurrency = false;
    }

    this.routeId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.routeId === '0') {
      this.isLoginFrom = true;
      Logger.log('this.routeId t', +this.routeId);
    }
    else {
      this.isLoginFrom = false;
      Logger.log('this.routeId f', +this.routeId);
    }

    this.onAddressForm = this.formBuilder.group({

      StreatNumber: ['', Validators.compose([
        Validators.nullValidator
      ])],
      StreatName: ['', Validators.compose([
        Validators.nullValidator
      ])],
      Locality: ['', Validators.compose([
        Validators.nullValidator
      ])],
      Suburb: ['', Validators.compose([
        Validators.required
      ])],
      City: ['', Validators.compose([
        Validators.required
      ])],
      Postcode: ['', Validators.compose([
        Validators.nullValidator
      ])],
      State: ['', Validators.compose([
        Validators.required
      ])],
      Country: ['', Validators.compose([
        Validators.required
      ])],
    });

    this.getAllCity();
    this.getAllCountry();
    // this.getAllSuburbList();
    this.getAllState();

    //   this.customer = this.token.getCustomer();
    //   this.getCustomerDetail();

    if (this.property.address != null) {
      this.address = this.property.address;
      this.isStreetSelect = true;

    }
    else {
      this.isStreetSelect = true;
    }

  }

  ngOnInit() {

  }


  getSelectedCity(event) {
    // this.sububList = this.localityList.find(data =>
    //   data.city === this.address.city
    // );
  }

  countryCodePicker(event) {
    this.customer.email = null;
    if (this.CodeNumber != undefined) {
      Logger.log(this.CodeNumber);
      this.customer.mobile = this.CodeNumber;
      this.isCodeSelect = true;
    }

  }

  Update() {

    this.property.address = this.address;

    this.loader = true;
    this.propertyService.updateProperty(this.property).subscribe(res => {
      this.loader = false;
      this.token.saveProperty(this.property);
      this.presentToast('Business Address Update Successfully');
      this.Later();

    }, error => {
      this.loader = false;
      Logger.log('' + JSON.stringify(error));
    });
  }

  Later() {
    //   if(this.isLoginFrom === true)
    //   {
    //     this.navCtrl.navigateRoot('home');
    //   }
    //   else
    //   {
    //     this.navCtrl.navigateRoot('update-details');
    //   }
    this._location.back();
  }

  getSuburbBycity() {
    Logger.log('cityName' + this.address.city);

    this.getSuburbListByCityName(this.address.city);
  }

  selectCity() {
   

    this.city = new City();
    this.city = this.cities.find(data =>
        data.name === this.address.city
    );
    this.address.city = this.city.name;
    this.address.country = this.city.countryName;
    this.address.state = this.city.stateOrRegionName;

    this.getSuburbListByCityName(this.address.city);
  }

  getSuburbListByCityName(cityName: string) {
    this.loader = true;
    this.suburbs = [];
    this.addressService.getSuburbListByCityName(cityName).subscribe(data => {
      this.suburbs = data.body;

      this.loader = false;
      this.changeDetectorRefs.detectChanges();

    }, error => {
      this.loader = false;
    });
  }

  addresssChange() {
    //this.onAddressForm.reset();
  }

  getAllCity() {
    this.loader = true;
    this.addressService.getCityList().subscribe(data => {
      this.cities = data.body;
      this.loader = false;
      this.changeDetectorRefs.detectChanges();

    }, error => {
      this.loader = false;
    });
  }

  getAllCountry() {
    this.loader = true;
    this.addressService.getCountryList().subscribe(data => {
      this.countries = data.body;

      this.loader = false;
      this.changeDetectorRefs.detectChanges();

    }, error => {
      this.loader = false;
    });
  }

  getAllSuburbList() {
    this.loader = true;
    this.addressService.getSuburbList().subscribe(data => {
      this.suburbs = data.body;

      this.loader = false;
      this.changeDetectorRefs.detectChanges();

    }, error => {
      this.loader = false;
    });
  }

  getAllState() {
    this.loader = true;
    this.addressService.getStateList().subscribe(data => {
      this.states = data.body;

      this.loader = false;
      this.changeDetectorRefs.detectChanges();

    }, error => {
      this.loader = false;
    });
  }



  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

  onItemClick() {
    this.isSearchItem = true;
    this.navCtrl.navigateForward(['/street-filter']);
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/setting');
  }

  clearSearch(event: any) {
  }

  getItemsByCityName(ev: any)
  {
    const val = ev.target.value;

    this.searchString = val;

    if (this.searchString.length > 2) {
      debounceTime(1000);
      this.getCustomerAddressByCityName(val);
    } else if (this.searchString.length === 0) {
      this.citiesSearch = [];
      this.citiesSearchFilter = [];
      this.isAddressSearch = false;
      this.isAddressFound = true;
      this.changeDetectorRefs.detectChanges();
    }


    this.citiesSearch = this.citiesSearchFilter;

    this.citiesSearch = this.citiesSearch.filter((item) => {

      const searchResult = (
        (item.name != null && item.name != undefined && item.name.toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) > -1));

      return searchResult;
    });

    if (this.citiesSearch.length > 0) {
      this.isAddressSearch = true;
    }
 
  }

  getItems(ev: any) {

    const val = ev.target.value;

    this.searchString = val;

    if (this.searchString.length > 2) {
      debounceTime(1000);
      this.getCustomerAddress(val);
    } else if (this.searchString.length === 0) {
      this.streetsFilter = [];
      this.streets = [];
      this.isAddressSearch = false;
      this.isAddressFound = true;
      this.changeDetectorRefs.detectChanges();
    }


    this.streets = this.streetsFilter;

    this.streets = this.streets.filter((item) => {

      const searchResult = (
        (item.name != null && item.name.toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) > -1));

      return searchResult;
    });

    if (this.streets.length > 0) {
      this.isAddressSearch = true;
    }



  }

  clear(event) {

  }

  onSelectCity(event)
  {
    this.onAddressForm.reset();

    this.citiesSearch = [];
    this.citiesSearchFilter = [];
    this.isAddressSearch = false;
    this.isAddressFound = true;

    this.city = new City();
    this.city = event;

    this.address = new Address();

    this.address.city = this.city.name;
    this.address.country = this.city.countryName;
    this.address.state = this.city.stateOrRegionName;

    if(this.address.city != undefined && this.address.city != null)
    {
        this.getSuburbListByCityName(this.address.city);
    }


    this.isStreetSelect = true;
    this.searchresult = '';
    this.changeDetectorRefs.detectChanges();
  }

  onSelect(event) {
    this.onAddressForm.reset();

    this.streetsFilter = [];
    this.streets = [];
    this.isAddressSearch = false;
    this.isAddressFound = true;

    this.street = event;

    this.address = new Address();

    this.address.streetName = this.street.name;
    this.address.postcode = (this.street.postCode);

    this.address.suburb = this.street.suburbName;
    this.address.country = this.street.countryName;
    this.address.state = this.street.stateOrRegionName;
    this.address.city = this.street.cityName;
    this.isStreetSelect = true;
    this.searchresult = '';
    this.changeDetectorRefs.detectChanges();

  }

  getCustomerAddressByCityName(cityName: string)
  {
    this.addressService.getCityListByCityName(cityName).subscribe(response => {

        if (response.body.length > 0) {
            this.citiesSearch = response.body;
            this.citiesSearchFilter = response.body;
            this.isAddressSearch = true;
            this.streets.reverse();
          }
          else {
            this.isAddressSearch = false;
          }
    
          if (this.searchString.length > 2 && this.citiesSearch.length > 0) {
            this.isAddressFound = true;
            this.isStreetSelect = true;
          }
          else {
            this.isAddressFound = false;
            this.isStreetSelect = false;
          }
    
          this.changeDetectorRefs.detectChanges();
    
  
      }, error => {
        Logger.log('error ' + JSON.stringify(error));
      });
  }

  getCustomerAddress(streetName: string) {
    this.streets = [];
    this.streetsFilter = [];
    this.addressService.getSteetListByStreetName(streetName).subscribe(response => {

      if (response.body.length > 0) {
        this.streets = response.body;
        this.streetsFilter = response.body;
        this.isAddressSearch = true;
        this.streets.reverse();
      }
      else {
        this.isAddressSearch = false;
      }

      if (this.searchString.length > 2 && this.streets.length > 0) {
        this.isAddressFound = true;
        this.isStreetSelect = true;
      }
      else {
        this.isAddressFound = false;
        this.isStreetSelect = false;
      }

      this.changeDetectorRefs.detectChanges();

    }, error => {
      Logger.log('error ' + JSON.stringify(error));
    });
  }


}

