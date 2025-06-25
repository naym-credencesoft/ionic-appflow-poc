import { BankAccount } from 'src/app/pages/business-setting/bank-details/BankAccount';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/model/business-service/address';
import { Invoice } from 'src/app/model/invoice/invoice';
import { Order } from 'src/app/model/Order/order';
import { Property } from 'src/app/model/property/Property';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { InvoiceService } from 'src/app/service/invoice/invoice.service';
import { Logger } from 'src/app/service/logger.service';
import { OrderService } from 'src/app/service/Order/order.service';
import { TokenStorage } from 'src/app/token.storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.page.html',
  styleUrls: ['./invoice-details.page.scss'],
})
export class InvoiceDetailsPage implements OnInit {

    invoice : Invoice;
    loader = false;
    data: number;
    invoiceId: any;
    customerInfo: any;
    clientAddress: any;

    property : Property;
    address : any;
    bankAccount : BankAccount;
    propertyLogo: any;

    constructor(
        private navCtrl: NavController,
      private acRoute: ActivatedRoute,
      public token: TokenStorage,
      private invoiceService: InvoiceService,
      private changeDetectorRefs: ChangeDetectorRef,
      public dateService: DateService,
      private router: Router) {

      this.invoice = new Invoice();

      this.property = new Property();
      this.property = this.token.getProperty();
      this.invoice = new Invoice();
      this.bankAccount = new BankAccount();
  
      if (this.property.bankAccount != null || this.property.bankAccount != undefined) {
        this.bankAccount = this.property.bankAccount;
      }
  
    //   if (this.property.logoUrl === null || this.property.logoUrl === undefined) {
    //     this.propertyLogo =  DEFAULT_LOGO;
    //   }
    //   else {
    //     this.propertyLogo = this.property.logoUrl;
    //   }
  
      if (this.property.address != null || this.property.address != undefined) {
        this.address = this.property.address;
      }
  
    }
  
  
    ngOnInit() {
      this.acRoute.queryParams.subscribe(params => {
  
        if (params['id'] != undefined) {
          this.invoiceId = JSON.parse(params['id']);
          this.getInvoiceDetailById( this.invoiceId);
        // //   this.address = this.token.getProperty().address;
        Logger.log('invoiceId' + this.invoiceId);
        }
      });
    }

    navigateToPage() {
        this.navCtrl.navigateForward('/invoice-list');
      }

    getInvoiceDetailById(id: number) {

        this.loader = true;
        this.invoiceService.getInvoiceDetailsById(id).subscribe(data => {
    
          this.invoice = data.body;
    
          Logger.log(JSON.stringify(this.invoice));
    
          if (this.invoice.customerDto != null || this.invoice.customerDto != undefined) {
            this.customerInfo = this.invoice.customerDto;
    
            if (this.customerInfo.address != null || this.customerInfo.address != undefined) {
              this.clientAddress = this.customerInfo.address;
            }
          }

    
        //   this.dataSource = new MatTableDataSource(this.invoice.invoiceLinesDto);
          this.loader = false;
    
    
          this.changeDetectorRefs.detectChanges();
        }, error => {
          this.loader = false;
        });
    
      }
    
  
  }
  