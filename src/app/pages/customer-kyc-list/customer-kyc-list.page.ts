import { Kyc } from './../../model/Customer/kyc';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Customer } from 'src/app/model/Customer/customer';
import { KYC_IdentityDocumentType } from 'src/app/model/Customer/kycITEM';
import { Property } from 'src/app/model/property/Property';
import { CustomerService } from 'src/app/service/Customer/customer.service';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-customer-kyc-list',
  templateUrl: './customer-kyc-list.page.html',
  styleUrls: ['./customer-kyc-list.page.scss'],
})
export class CustomerKycListPage implements OnInit {

    customer : Customer;
    kyc: Kyc;
    kycList: Kyc[] = [];
    property: Property;
    kycdata: any;
  
    kyc_IdentityDocumentType: KYC_IdentityDocumentType;
  
    loader: boolean = false;
    identityDocType: string;
  
    constructor(private acRoute : ActivatedRoute,
      private customerService: CustomerService,
      public token: TokenStorage,
      public bookingService: BookingService,
      private changeDetectorRefs: ChangeDetectorRef,
      private navCtrl :NavController) 
    { 
      this.customer = new Customer();
      this.kyc = new Kyc();
      this.property = new Property();
      this.kyc_IdentityDocumentType = new KYC_IdentityDocumentType();
    }
  

  ngOnInit() {

    this.acRoute.queryParams.subscribe(params => {
     
        if(params["customerOb"] != undefined)
        {
            this.customer = JSON.parse(params["customerOb"]);

            this.getUserInfoById(String(this.customer.id));
            this.getKYC(String(this.customer.id)); 
        }
       
    });
  }

  addKYC(){
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : false,
            index : -1,
        }
    };
    
    this.navCtrl.navigateForward(['customer-kyc'] , navigationExtras); 
  }

  updateKYC(row, index){
    // this.getKYCIdentityName(name)
    
    console.log("kyc details", row, index )
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : false,
            kyc : JSON.stringify(row),
            index : index,
        }
    };
    
    this.navCtrl.navigateForward(['customer-kyc'] , navigationExtras); 
  }

  updateKYCList(row, index,name){
    this.getKYCIdentityName(name)
    console.log("kyc details", row, index, name )
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : false,
            kyc : JSON.stringify(row),
            index : index,
        }
    };
    
    this.navCtrl.navigateForward(['customer-kyc'] , navigationExtras); 
  }

  getKYC(customerID: string) {
    this.loader = true;
    this.customerService.getKYC(customerID).subscribe((response) => {
      if (response.body != null) {
        this.kyc = response.body;
        console.log("dfghjk",this.kyc, this.kyc.identityDocumentType, this.kyc.identityDocumentNumber, this.kyc_IdentityDocumentType)

        for (let i = 0; i < this.kyc_IdentityDocumentType.kycList.length; i++) {
          if (
            this.kyc_IdentityDocumentType.kycList[i].value ===
            this.kyc.identityDocumentType
          ) {
            this.identityDocType =
              this.kyc_IdentityDocumentType.kycList[i].viewValue;
          }
        }
        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      }
    }),
      (error) => {
        this.loader = false;
      };
  }


  getUserInfoById(customerID: string) {
    this.loader = true;
    this.customerService.getCustomerById(customerID).subscribe((response) => {
      if (response.body != null) {
        this.customer = response.body;

        if (
          this.customer.kycList != null &&
          this.customer.kycList != undefined &&
          this.customer.kycList.length > 0
        ) {
          this.kycList = this.customer.kycList;
          console.log("kyclist", this.kycList, this.kycList[0].identityDocumentType);
        }

        if (this.customer.kyc != null && this.customer.kyc != undefined) {
          this.kyc = this.customer.kyc;
        }

        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      }
    }),
      (error) => {
        this.loader = false;
      };
  }


  getKYCIdentityName(name) {
    for (let i = 0; i < this.kyc_IdentityDocumentType.kycList.length; i++) {
      if (this.kyc_IdentityDocumentType.kycList[i].value === name) {
        return this.kyc_IdentityDocumentType.kycList[i].viewValue;
      }
    }
  }


}
