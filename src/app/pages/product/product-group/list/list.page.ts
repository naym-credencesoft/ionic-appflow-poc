import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController, NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { ProductGroup } from 'src/app/model/product/productGroup';
import { BusinessService } from 'src/app/model/Reservation/businessServic';
import { ProductService } from 'src/app/service/product/product.service';
import { TokenStorage } from 'src/app/token.storage';
import { Property } from "src/app/model/property/Property";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
    property: Property;
    productGroups: ProductGroup[] = [];
    productGroupsFilter : ProductGroup[] = [];
    businessServices: BusinessService[];
    businessService: BusinessService;
    loader : boolean = false;
    businessServiceId: number;

    onProductForm: FormGroup;

    isSelected : boolean = false;

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
        this.property = new Property();

        this.onProductForm = this.formBuilder.group({
            BusinessService: ["", Validators.compose([Validators.required])],
        });
    }

  ngOnInit() 
  {
    this.property = this.token.getProperty();
    console.log("property details", this.property)
    this.acRoute.queryParams.subscribe((params) => {
        if (params["serviceId"] != undefined) {
            this.businessService.id = JSON.parse(params["serviceId"]);
            this.isSelected = true;
            this.getAllBusinessServiceBySelected();
            this.getAllGroupProduct( this.businessService.id);
        }
    });
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/service-dashboard');
  }

  ionViewWillEnter() {
      if(this.isSelected === false)
      {
        this.getAllBusinessService();
      }
  }

  setService(serviceId: number) {
    // Logger.log('serviceId : '+serviceId);
   // this.businessService.id = serviceId;
   // this.businessServiceId = serviceId;
    this.getAllGroupProduct(this.businessServiceId);
  }

  getAllBusinessServiceBySelected() {
    this.loader = true;
    this.productService.getAllBusinessServiceByPropertyId(this.token.getPropertyId()).subscribe(data => {
      this.businessServices = data.body;
      this.loader = false;

      if (this.businessServices.length > 0) {
        this.businessServiceId = this.businessService.id;
        //this.getAllGroupProduct(this.businessServiceId);
      }

      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
    });
  }

  getAllBusinessService() {
    this.loader = true;
    this.productService.getAllBusinessServiceByPropertyId(this.token.getPropertyId()).subscribe(data => {
      this.businessServices = data.body;
      this.loader = false;

      if (this.businessServices.length > 0) {
        this.businessServiceId = this.businessServices[0].id;
        //this.getAllGroupProduct(this.businessServiceId);
      }

      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
    });
  }

  getAllGroupProduct(businessServiceId: number) {
    this.loader = true;
    this.productGroups = [];
    this.productGroupsFilter = [];
    this.productService.getProductGroupListByBusinessServiceId(businessServiceId).subscribe(data => {
      this.productGroups = data.body;
      this.productGroupsFilter = data.body;

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

    this.productGroups = this.productGroupsFilter;
    this.productGroups = this.productGroups.filter((item) => {

      const searchResult = (
        String(item.id).indexOf(val.trim()) > -1 ||
        (item.name != null && item.name.toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) > -1) ||
        (item.productCode != null && item.productCode.toLowerCase().indexOf(val.toLowerCase().trim()) > -1));

      return searchResult;
    })
    //}  

  }

  async viewdetail(productGroup) {

    const actionSheet = await this.actionSheetController.create({
      header: 'Product Group Action',
      cssClass: 'action-sheets-basic-page',
      mode: "md",
      buttons:
        [
          {
            text: 'Edit',
            icon: 'create',
            handler: () => {
                
                this.editGroup(productGroup);
    
                }
          },
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
                
                this.presentAlert('Caution!', 'Do you want to delete '+productGroup.name+'.',productGroup);
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

    async presentAlert(headerTitle : string, bodyText : string, data : any) {

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
                this.deleteProductGroup(data);
              }
            }
          ]
        });
    
        await alert.present();
      }

    onCreateGroup()
    {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                //data: JSON.stringify(row),
                serviceId: JSON.stringify(this.businessServiceId),
            }
          };
      
        this.router.navigate(['product-group-create'], navigationExtras);
    }

    editGroup(row)
    {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify(row),
                serviceId: JSON.stringify(this.businessServiceId),
            }
          };
      
        this.router.navigate(['product-group-create'], navigationExtras);
    }

    deleteProductGroup(product: ProductGroup) {
        this.loader = true;
        this.productService.deleteProductGroup(product).subscribe(data => {
    
          // Logger.log('data'+JSON.stringify(data));
    
          if (data.status === 200) {
            this.loader = false;
            this.presentToast('Product group deleted successfully');
            this.getAllGroupProduct(this.businessServiceId);
          }
          else {
            this.loader = false;
            this.presentToast('Fail');
          }
    
        }, error => {
          // Logger.log(JSON.stringify(error));
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
