import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { FileService } from 'src/app/service/file.service';
import { TokenStorage } from 'src/app/token.storage';
import {Location} from '@angular/common';
import { Property } from 'src/app/model/property/Property';
import { BankAccount } from './BankAccount';
import { PropertyService } from 'src/app/service/property/property.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.page.html',
  styleUrls: ['./bank-details.page.scss'],
})
export class BankDetailsPage implements OnInit {

    property : Property;
    loader : boolean = false;
    bankAccount : BankAccount;

    BankDetailsForm:FormGroup;  
    BankNameFC : FormControl = new FormControl();
    BranchNameFC : FormControl = new FormControl();
    AccountNameFC : FormControl = new FormControl();
    AccountNumberFC : FormControl = new FormControl();
    SwiftCodeFC : FormControl = new FormControl();

    constructor(private toastController: ToastController,
        private _location: Location,
        public navCtrl: NavController,
        private propertyService : PropertyService,
        public loadingCtrl: LoadingController,
        private changeDetectorRefs: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private token : TokenStorage) 
        {
            this.property = new Property();
            this.bankAccount = new BankAccount();

            this.property = this.token.getProperty();
            this.findPropertyDetailsById(String(this.property.id));
        }

  ngOnInit() 
  {
    this.BankDetailsForm = this.formBuilder.group({
        'BankNameFC': ['', Validators.compose([
          Validators.required
        ])],
        'BranchNameFC': ['', Validators.compose([
          Validators.nullValidator
        ])],
        'AccountNameFC': ['', Validators.compose([
          Validators.required
        ])],
        'AccountNumberFC': ['', Validators.compose([
            Validators.required
        ])],
        'SwiftCodeFC': ['', Validators.compose([
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

        if (this.property.bankAccount != null || this.property.bankAccount != undefined) {
          this.bankAccount = this.property.bankAccount;
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

    this.property.bankAccount = this.bankAccount;

    this.propertyService.updatePropertyOnBoarding(this.property).subscribe(
    resp1 => {
        this.property = resp1;

        this.token.saveProperty(this.property);

        this.presentToast('Bank Details Update Successfully');

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
