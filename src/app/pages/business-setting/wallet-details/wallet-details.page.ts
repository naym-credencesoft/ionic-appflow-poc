import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { Property } from 'src/app/model/property/Property';
import { PropertyService } from 'src/app/service/property/property.service';
import { TokenStorage } from 'src/app/token.storage';
import { BankAccount } from '../bank-details/BankAccount';
import {Location} from '@angular/common';
import { MobileWallet } from 'src/app/model/wallet/mobileWallet';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.page.html',
  styleUrls: ['./wallet-details.page.scss'],
})
export class WalletDetailsPage implements OnInit {
    property : Property;
    loader : boolean = false;
    mobileWallet : MobileWallet;

    walletDetailsForm:FormGroup;  
    FName : FormControl = new FormControl();
    LName : FormControl = new FormControl();
    PhoneNumber : FormControl = new FormControl();
    WalletProvider : FormControl = new FormControl();
    WalletUrl : FormControl = new FormControl();

    constructor(private toastController: ToastController,
        private _location: Location,
        private propertyService : PropertyService,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private changeDetectorRefs: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private token : TokenStorage) 
        {
            this.property = new Property();
            this.mobileWallet = new MobileWallet();

            this.property = this.token.getProperty();
            this.findPropertyDetailsById(String(this.property.id));
        }

  ngOnInit() 
  {
    this.walletDetailsForm = this.formBuilder.group({
        'FName': ['', Validators.compose([
          Validators.required
        ])],
        'LName': ['', Validators.compose([
          Validators.required
        ])],
        'PhoneNumber': ['', Validators.compose([
          Validators.required
        ])],
        'WalletProvider': ['', Validators.compose([
            Validators.required
        ])],
        'WalletUrl': ['', Validators.compose([
            Validators.nullValidator
        ])],
      });

   
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/setting');
  }

  findPropertyDetailsById(propertyId: string) {

    this.loader = true;
    if (propertyId !== null && propertyId !== undefined) {
      this.propertyService.getPropertyDetailsByPropertyId(Number(propertyId)).subscribe(data => {

        this.property = data;
       
        this.loader = false;

        if (this.property.mobileWallet != null && this.property.mobileWallet != undefined) {
            this.mobileWallet = this.property.mobileWallet;
        }

        this.changeDetectorRefs.detectChanges();
      });
    }
  }

  onSubmit()
  {
      this. onSaveProperty();
  }

  onSaveProperty() {
    this.loader = true;

    this.property.mobileWallet = this.mobileWallet;

    this.propertyService.updatePropertyOnBoarding(this.property).subscribe(
    resp1 => {
        this.property = resp1;

        this.token.saveProperty(this.property);

        this.presentToast('Wallet Details Update Successfully');

        this.loader = false;
        this.changeDetectorRefs.detectChanges();
        }
      ), error => {
        this.loader = false;
      }
  }

  async presentToast(Message :string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
    }

}
