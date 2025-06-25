import { Logger } from '../../service/logger.service';
import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Customer } from '../../model/Customer/customer';
import { TranslateProvider } from '../../providers';
import { TokenStorage } from './../../token.storage';
import { NavController } from '@ionic/angular';
import { KYC_IdentityDocumentType } from '../../model/Customer/kycITEM';
import { Kyc } from '../../model/Customer/kyc';
import { CustomerService } from '../../service/Customer/customer.service';
import { ToastController } from '@ionic/angular';
import { FileService } from 'src/app/service/file.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageModel } from 'src/app/model/imageFile';
import {  Location } from "@angular/common";

@Component({
  selector: 'app-customer-kyc',
  templateUrl: './customer-kyc.page.html',
  styleUrls: ['./customer-kyc.page.scss'],
})
export class CustomerKycPage implements OnInit {

  kyc: Kyc;
  kycList: Kyc[] = [];
  loader: boolean = false;

  kyc_IdentityDocumentType: KYC_IdentityDocumentType;

  documentType: FormControl = new FormControl();
  documentNumber: FormControl = new FormControl();


  onKYCForm: FormGroup;

  componentModel: string;
  isCustomerDisable: boolean = false;
  isAddressDisable: boolean = true;
  customerData: string;

  customer: Customer;
  isDetails: boolean = false;
    receiptFileName: any;
    formData: FormData;
    imagedataModel: ImageModel;
    index: any;

  constructor(private formBuilder: FormBuilder,
    private token: TokenStorage,
    private navCtrl: NavController,
    private locationBack: Location,
    private fileService : FileService,
    private changeDetectorRefs: ChangeDetectorRef,
    private acRoute: ActivatedRoute,
    private toastController: ToastController,
    private customerService: CustomerService,
    private translate: TranslateProvider) {
    this.customer = new Customer();
    this.kyc = new Kyc();
    this.kyc_IdentityDocumentType = new KYC_IdentityDocumentType();
    this.imagedataModel = new ImageModel();

    this.onKYCForm = this.formBuilder.group({
      'documentType': ['', Validators.compose([
        Validators.required
      ])],
      'documentNumber': ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  ngOnInit() {
    
    this.acRoute.queryParams.subscribe(params => {

      if (params["customerOb"] != undefined) {
        this.customer = JSON.parse(params["customerOb"]);

        if (
            this.customer.kycList != null &&
            this.customer.kycList != undefined &&
            this.customer.kycList.length > 0
          ) {
            this.kycList = this.customer.kycList;
            console.log("kyc identitynymber", this.kycList[0].identityDocumentType)
    console.log("kyc identitynymber type", this.kycList[0].identityDocumentNumber)
          }
      }

      if (params["kyc"] != undefined) {
        this.kyc = JSON.parse(params["kyc"]);

        //this.getCustomerKYC(String(this.customer.id));
      }

      if (params["isDetails"] != undefined) {
        this.isDetails = JSON.parse(params["isDetails"]);

      }

      if (params["index"] != undefined) {
        this.index = JSON.parse(params["index"]);
        console.log("index", this.index)
      }

    });
  }

  uploadFile(event, file: ElementRef, type : number) {
    const file1 = event.target.files[0];

    let fileType = file1.type.split('/')[0];
    let fileSizeInMB = file1.size/1024/1024;
    console.log('file1 '+ file1.size/1024/1024);

    if(fileSizeInMB >5)
    {
      this.presentToast("You have exceeded the limit (Max limit 5 MB)");
    }
    else
    {
      if(fileType === 'application')
      {
        this.loader = true;
        file['value'] = (file1) ? file1.name : '';
        this.receiptFileName = file1.name;
        this.formData = new FormData();
        this.formData.append('file', file1, this.receiptFileName);
         this.fileService.fileUploadToCloud(this.formData).subscribe(fileUploadResponse => {
           console.log('fileUploadResponse'+ JSON.stringify(fileUploadResponse));
          // if (fileUploadResponse.status === 200) {
            if(type === 1){
                this.kyc.kycDocUrl = fileUploadResponse.url;
            }
            else if(type === 2){
                this.kyc.kycDocBackPageUrl = fileUploadResponse.url;
            }
         
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
            this.presentToast(`File Uploaded Successfully`);
          // } else {
          //   this.openErrorSnackBar(`File upload Error`);
          // }
        });
      }
      else  if(fileType === 'image')
      {
        console.log('img ');
        this.onImageUpload(event,type);
      }
    }
  }

  onDeleteFile()
  {
    this.kyc.kycDocUrl = undefined;
  }

  onDeleteBackFile()
  {
    this.kyc.kycDocBackPageUrl = undefined;
  }

  onImageUpload(event, type) {
    const image = event.target.files[0];
   
    this.uploadImage(event,type);

  }

  uploadImage(event,type) {

    this.loader = true;
    const file1 = event.target.files[0];
    //const file1 = this.uploadedImage

    // file['value'] = (file1) ? file1.name : '';
    this.imagedataModel.receiptFileName = file1.name;
    this.formData = new FormData();
    this.formData.append('file', file1, this.imagedataModel.receiptFileName);

    this.fileService.fileUploadToCloud(this.formData).subscribe(fileUploadResponse => {
      this.loader = false;
    
      this.imagedataModel.receiptUrl = fileUploadResponse.url;
      this.imagedataModel.receiptFileName = fileUploadResponse.name;
     
      if(type === 1)
      {
        this.kyc.kycDocUrl = fileUploadResponse.url;
      }
      else if(type === 2)
      {
        this.kyc.kycDocBackPageUrl = fileUploadResponse.url;
      }

      this.presentToast(`Uploaded Successfully`);

    }, (error) => {

      Logger.log('error : ' + JSON.stringify(error));

      if (error instanceof HttpErrorResponse) {
        this.loader = false;
      }
    });

   
  }


  onSubmit() {
    this.loader = true;

    if (this.index > -1) {
        this.kycList[this.index] = this.kyc;
        this.customer.kycList = this.kycList;
    } else {
        this.kycList.push(this.kyc);
        this.customer.kycList = this.kycList;
    }

    if (this.index === 0 || this.kycList.length === 0) {
        this.customerService.updateKYC(String(this.customer.id), this.kyc).subscribe(res => {
            this.loader = false;
      
            this.presentToast('KYC update successfully');
            this.cancel();
      
          }, error => {
            this.loader = false;
            Logger.log('' + JSON.stringify(error));
          });
    }
    else
    {
        this.updateCustomer(this.customer);
    }
  }

  updateCustomer(customer: Customer) {
    this.customerService.createCustomer(customer).subscribe(
      (res) => {
        this.loader = false;
        this.customer = res.body;
        this.presentToast("KYC update successfully");
        this.cancel();
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  cancel() {
    // this.navCtrl.navigateForward('customer-details');
    this.locationBack.back();
  }

  onEdit() {
    this.isDetails = false;
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

}
