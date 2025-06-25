import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, ToastController, NavController, LoadingController } from '@ionic/angular';
import { ProductGroup } from 'src/app/model/product/productGroup';
import { BusinessService } from 'src/app/model/Reservation/businessServic';
import { ProductService } from 'src/app/service/product/product.service';
import { TokenStorage } from 'src/app/token.storage';
import { Property } from "src/app/model/property/Property";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
})
export class CreateGroupPage implements OnInit {

    onProductGroupForm: FormGroup;
    property: Property;
    productGroup: ProductGroup;
    businessServices: BusinessService[];
    businessService: BusinessService;
    loader : boolean = false;
    businessServiceId: number;
    serviceId: string;

    ButtonLabel : string = "Create";
    isUpdateRequest : boolean = false;
    
    constructor(private productService: ProductService,
        public token: TokenStorage,
        private acRoute: ActivatedRoute,
        public loadingCtrl: LoadingController,
        private actionSheetController: ActionSheetController,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastController: ToastController,
        private navCtrl: NavController,
        private changeDetectorRefs: ChangeDetectorRef) 
  { 
      this.businessService = new BusinessService();
      this.productGroup = new ProductGroup();
      this.property = new Property();
    this.onProductGroupForm = this.formBuilder.group({
        BusinessService: ["", Validators.compose([Validators.required])],
        Name : ["", Validators.compose([Validators.required])],
        productCode : ["", Validators.compose([Validators.required])],
        ShortDescription : ["", Validators.compose([Validators.nullValidator])],
        Description : ["", Validators.compose([Validators.nullValidator])],
    });

    this.getAllBusinessService();
  }

  ngOnInit() 
  {
    this.property = this.token.getProperty();
        console.log("property details", this.property)
    this.acRoute.queryParams.subscribe((params) => {
        if (params["data"] != undefined) {
            this.productGroup = JSON.parse(params["data"]);
            this.ButtonLabel = "Update";
            this.isUpdateRequest = true;
        }

        if (params["serviceId"] != undefined) {
            this.businessService.id = JSON.parse(params["serviceId"]);
            this.serviceId = params["serviceId"]
            console.log("......", this.serviceId);
            this.changeDetectorRefs.detectChanges();
        }
    });

   
  }

  navigateToPage() {
    this.navCtrl.navigateForward('product-group-list?serviceId='+this.serviceId);
  }

  getAllBusinessService() {
    this.loader = true;
    this.productService.getAllBusinessServiceByPropertyId(this.token.getPropertyId()).subscribe(data => {
      this.businessServices = data.body;

      this.businessServiceId = this.businessService.id;
      this.loader = false;

      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
    });
  }

  setService(serviceId: number) {
  
    this.businessService = this.businessServices.find((data) => data.id === serviceId);
    this.businessServiceId = serviceId;
  }

  async update()
  {
    const loader = await this.loadingCtrl.create({
        duration: 5000,
    });

    loader.present();

    this.productService.updateProductGroup(this.productGroup).subscribe(
        (response) => {
            loader.dismiss();

            // tslint:disable-next-line: align
            if (response.status === 200) {
               
              this.presentToast("Product Group updated successfully");  
             this.cancel();
            }
        },
        (error) => {
            loader.dismiss();
        }
    );
  }

  async onSubmit()
  {
      if(this.isUpdateRequest === true)
      {
        this.update();
      }
      else
      {
        this. create();
      }
  }

  async create()
  {
    const loader = await this.loadingCtrl.create({
        duration: 5000,
    });

    loader.present();

    this.productService.CreateProductGroup(this.productGroup, this.businessServiceId).subscribe(
        (response) => {
            loader.dismiss();

            // tslint:disable-next-line: align
            if (response.status === 200) {
               
              this.presentToast("Product Group created successfully");  
             this.cancel();
            }
        },
        (error) => {
            loader.dismiss();
        }
    );
  }

  cancel()
  {
   // this.navCtrl.navigateRoot("product-group-list");
    let navigationExtras: NavigationExtras = {
        queryParams: {
            //data: JSON.stringify(row),
            serviceId: JSON.stringify(this.businessServiceId),
        }
      };
  
    this.router.navigate(['product-group-list'], navigationExtras);
  }

  
  async presentToast(Message: string) {
    const toast = await this.toastController.create({
        message: Message,
        duration: 2000,
    });
    toast.present();
}

}
