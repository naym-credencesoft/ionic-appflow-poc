import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, ToastController, NavController, AlertController } from '@ionic/angular';
import { Product } from 'src/app/model/product/product';
import { ProductGroup } from 'src/app/model/product/productGroup';
import { BusinessService } from 'src/app/model/Reservation/businessServic';
import { ProductService } from 'src/app/service/product/product.service';
import { TokenStorage } from 'src/app/token.storage';
import { Property } from "src/app/model/property/Property";

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.page.html',
  styleUrls: ['./manage-product.page.scss'],
})
export class ManageProductPage implements OnInit {

    onProductForm: FormGroup;
    property: Property;
    productGroups: ProductGroup[] = [];
    productGroup: ProductGroup;
    businessServices: BusinessService[];
    businessService: BusinessService;
    loader : boolean = false;
    businessServiceId: number;
    productGroupId : number;

    products: Product[];
    productsFilter: Product[];

    isCreateRequest : boolean = false;

    constructor(private productService: ProductService,
        public token: TokenStorage,
        private acRoute: ActivatedRoute,
        private actionSheetController: ActionSheetController,
        private router: Router,
        public alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        private toastController: ToastController,
        private navCtrl: NavController,
        private changeDetectorRefs: ChangeDetectorRef) 
  { 
    this.businessService = new BusinessService();
    this.productGroup = new ProductGroup();
    this.property = new Property();
    this.onProductForm = this.formBuilder.group({
        BusinessService: ["", Validators.compose([Validators.required])],
        ProductGroupId: ["", Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {

    this.property = this.token.getProperty();
        console.log("property details", this.property)
    this.acRoute.queryParams.subscribe((params) => {
      
        if (params["serviceId"] != undefined) {
            this.businessService.id = JSON.parse(params["serviceId"]);
            this.isCreateRequest = true;
            this.getAllBusinessService();
            this.changeDetectorRefs.detectChanges();
        }

        if (params["groupId"] != undefined) {
            this.productGroup.id  = JSON.parse(params["groupId"]);
            this.products = [];

            this.productGroupId = this.productGroup.id ; 
            this.getAllProduct(this.productGroupId);
        }
    });

    if(this.isCreateRequest === false)
    {
        this.getAllBusinessService();
    }
   
    
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/service-dashboard');
  }

  ionViewWillEnter() {
    // this.productGroups = [];
    // this.businessServices = [];
    // this.products = [];
    // this.productsFilter = [];

    // this.getAllBusinessService();
  }

  setService(serviceId: number) {

    this.productGroups = [];
    this.products = [];
    this.productsFilter = [];

    //this.businessServiceId = serviceId;
    this.isCreateRequest = false;
    // this.businessService.id = serviceId;
    this.getAllGroupProduct(this.businessServiceId);
  }

  setProduct(productGroupId)
  { 
    this.products = [];

    //this.productGroupId = productGroupId; 
    this.isCreateRequest = false;
    this.getAllProduct(this.productGroupId);
  }

  getAllBusinessService() {
    this.loader = true;
    this.productService.getAllBusinessServiceByPropertyId(this.token.getPropertyId()).subscribe(data => {
      this.businessServices = data.body;
      this.loader = false;

      if (this.businessServices.length > 0) {

        if(this.isCreateRequest === false)
        {
            this.businessServiceId = this.businessServices[0].id;
           // this.getAllGroupProduct(this.businessServiceId);
        }
        else
        {
            this.businessServiceId = this.businessService.id;
            //this.getAllGroupProduct(this.businessServiceId);
        }
        
      }

      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
    });
  }

  getAllGroupProduct(businessServiceId: number) {
    this.loader = true;
    this.productGroups = [];
    this.productService.getProductGroupListByBusinessServiceId(businessServiceId).subscribe(data => {
      this.productGroups = data.body;

      if (this.productGroups.length > 0) {
          if(this.isCreateRequest === false)
          {
            this.productGroupId = this.productGroups[0].id;
            //this.getAllProduct(this.productGroupId);
          }
          else
          {
            this.productGroupId = this.productGroup.id;  
            //this.getAllProduct(this.productGroupId);
          }
       
      }

      this.loader = false;
      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
    });
  }

//   getAllGroupProductBySelection(businessServiceId: number) {
//     this.productGroups =[];
//     this.loader = true;
//     this.productService.getProductGroupListByBusinessServiceId(businessServiceId).subscribe(data => {
//       this.productGroups = data.body;

//       this.loader = false;
//       this.changeDetectorRefs.detectChanges();
//     }, error => {
//       this.loader = false;
//     });
//   }
  
  getAllProduct(groupId: number) {
    this.loader = true;
    this.products = [];
    this.productService.getProductList(groupId).subscribe(data => {
      this.products = data.body;
      this.productsFilter =  this.products;
      this.loader = false;
      this.changeDetectorRefs.detectChanges();

    }, error => {
      this.loader = false;
    });
  }
  clear(event) {

  }

  getItems(ev: any) {

    const val = ev.target.value;

    this.products = this.productsFilter;
    this.products = this.products.filter((item) => {

      const searchResult = (
        String(item.id).indexOf(val.trim()) > -1 ||
        (item.name != null && item.name.toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) > -1) ||
        (item.productCode != null && item.productCode.toLowerCase().indexOf(val.toLowerCase().trim()) > -1));

      return searchResult;
    })
      

  }

  async viewdetail(product) {

    const actionSheet = await this.actionSheetController.create({
      header: 'Product  Action',
      cssClass: 'action-sheets-basic-page',
      mode: "md",
      buttons:
        [
          {
            text: 'Edit',
            icon: 'create',
            handler: () => {
                
              this.onEditProduct(product);
    
                }
          },
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
                
                this.presentAlert('Caution!', 'Do you want to delete '+product.name+'.', product);
    
                }
          },
          {
            text: 'Variation List',
            icon: 'list',
            handler: () => {
                
                this.onVariation(product);
                }
          },
          {
            text: 'Close',
            role: 'cancel',
            icon: 'close',
            handler: () => {
   
              actionSheet.dismiss();
            }
          },
        ]
    });
    await actionSheet.present();
    }

    onCreateProduct()
    {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                //data: JSON.stringify(row),
                serviceId: JSON.stringify(this.businessServiceId),
                groupId: JSON.stringify(this.productGroupId),
            }
          };
      
        this.router.navigate(['create-product'], navigationExtras);
    }

    onVariation(row)
    {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify(row),
                serviceId: JSON.stringify(this.businessServiceId),
                groupId: JSON.stringify(this.productGroupId),
            }
          };
      
        this.router.navigate(['variation-list'], navigationExtras);
    }

    onEditProduct(product)
    {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify(product),
                serviceId: JSON.stringify(this.businessServiceId),
                groupId: JSON.stringify(this.productGroupId),
            }
          };
      
        this.router.navigate(['create-product'], navigationExtras);
    }

    async presentAlert(headerTitle : string, bodyText : string , data : any) {

        const alert = await this.alertCtrl.create({
          header: headerTitle,
          message: bodyText,
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                
              }
            }, {
              text: 'Yes',
              handler: () => {
                this.deleteProduct(data);
              }
            }
          ]
        });
    
        await alert.present();
      }

      deleteProduct(product: Product) {
        this.loader = true;
        this.productService.deleteProduct(product).subscribe(data => {
    
          //  Logger.log('data'+JSON.stringify(data));
    
          if (data.status === 200) {
            this.loader = false;
            this.presentToast('Product deleted successfully');
            this.getAllProduct(this.productGroupId);
          }
          else {
            this.loader = false;
            this.presentToast('Fail');
          }
    
        }, error => {
          //Logger.log(JSON.stringify(error));
          this.loader = false;
        });
      }
    
      async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

}
