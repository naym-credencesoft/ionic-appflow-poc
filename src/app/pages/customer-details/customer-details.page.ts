import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { ActivatedRoute } from "@angular/router";
import { Customer } from '../../model/Customer/customer';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import { CustomerService } from 'src/app/service/Customer/customer.service';
import { TokenStorage } from 'src/app/token.storage';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { ApplicationUser } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.page.html',
  styleUrls: ['./customer-details.page.scss'],
})
export class CustomerDetailsPage implements OnInit {

  userData: ApplicationUser;
  customer : Customer;
  isDetails : boolean = false;
    fromBookingTab: any;


  constructor(private acRoute : ActivatedRoute,
    private customerService: CustomerService,
    public token: TokenStorage,
    private authService: AuthService,
    private location: Location,
    public bookingService: BookingService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    
    private navCtrl :NavController) 
  { 
    this.customer = new Customer();
    this.userData = new ApplicationUser();
  }

  ngOnInit() 
  {

    this.authService
    .getUserByUserId(this.token.getUserId())
    .subscribe((resp) => {
        this.userData = resp.body;
    });
    this.acRoute.queryParams.subscribe(params => {
     
        if(params["customerOb"] != undefined)
        {
            this.customer = JSON.parse(params["customerOb"]);
        }
        if(params["booking"] != undefined)
            {
               this.fromBookingTab = params["booking"];
            //    console.log("booking tab" +   this.fromBookingTab)
            }

        if(params["isDetails"] != undefined)
        {
            this.isDetails = JSON.parse(params["isDetails"]);
        }
       
    });

    if (
        this.customer.id == undefined && 
        this.token.getBookingId() != null &&
        this.token.getBookingId() != undefined
    ) {
        this.getBookingById();
    }
  }

  getBookingById() {
    this.bookingService
        .findBooking(Number(this.token.getBookingId()))
        .subscribe(
            (response1) => {

                let booking = response1.body;

                if (
                    booking.customerId != null && booking.customerId != undefined
                ) {
                    this.getUserInfoById(String(booking.customerId));
                }
            },
            (error) => {
      
                this.changeDetectorRefs.detectChanges();
            }
        );
}


  getUserInfoById(userId: string) {

    this.customerService.getCustomerById(userId).subscribe(response => {
      if (response.body != null) {
        this.customer = response.body;
        this.changeDetectorRefs.detectChanges();
        // Logger.log('Application user : '+JSON.stringify( response ));
      }

    });
  }

  onPersonalInfo()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : true,
        }
    };
    
    this.navCtrl.navigateForward(['add-customer-details'] , navigationExtras);  
  }

  onAddressDetails()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : true,
        }
    };
    
    this.navCtrl.navigateForward(['add-customer-address'] , navigationExtras);  
  }

  onKYC()
  {

    let navigationExtras: NavigationExtras = {
    queryParams: {
        customerOb: JSON.stringify(this.customer),
    }
    };
    
    this.navCtrl.navigateForward(['customer-kyc-list'] , navigationExtras); 
  }

  back() {
    if (this.fromBookingTab != null &&  this.fromBookingTab != undefined) {
        this.navCtrl.navigateForward(['booking-list-details/bookingTab'] )
    } else {
        // this.navCtrl.navigateForward(['manage-customer'] )
       this.navCtrl.navigateBack(['manage-customer']);
       
    }
    
    // 
    // this.navCtrl.navigateForward(['booking-list-details/bookingTab'] )
}

  onStatus()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : true,
        }
    };
    
    this.navCtrl.navigateForward(['customer-status'] , navigationExtras);  
  }
  onLoyality()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : true,
        }
    };
    
    this.navCtrl.navigateForward(['customer-loyality'] , navigationExtras);  
  }

  onNextStay()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : true,
        }
    };
    
    this.navCtrl.navigateForward(['customer-nextstay'] , navigationExtras);  
  }
  onLastStay()
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            customerOb: JSON.stringify(this.customer),
            isDetails : true,
        }
    };
    
    this.navCtrl.navigateForward(['customer-laststay'] , navigationExtras); 
  }

}
