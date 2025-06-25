import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, ToastController, NavController, AlertController } from '@ionic/angular';
import { Product } from 'src/app/model/product/product';
import { ProductVariationDto } from 'src/app/model/product/productVariation';
import { ProductService } from 'src/app/service/product/product.service';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-variation-list',
  templateUrl: './variation-list.page.html',
  styleUrls: ['./variation-list.page.scss'],
})
export class VariationListPage implements OnInit {

    product: Product;
    loader : boolean = false;
    productVariation: ProductVariationDto;
    productVariations: ProductVariationDto[];
    productVariationsFilter: ProductVariationDto[];
    businessServiceId: any;
    productGroupId: any;

    constructor(private productService: ProductService,
        public token: TokenStorage,
        public alertCtrl: AlertController,
        private acRoute: ActivatedRoute,
        private actionSheetController: ActionSheetController,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastController: ToastController,
        private navCtrl: NavController,
        private changeDetectorRefs: ChangeDetectorRef)  
        { 
            this.product = new Product();
        }

  ngOnInit() 
  {
    this.acRoute.queryParams.subscribe((params) => {
        if (params["data"] != undefined) {
            this.product = JSON.parse(params["data"]);
           // this.getAllProductVerfication(this.product.id);
        }

        if (params["serviceId"] != undefined) {
            this.businessServiceId = JSON.parse(params["serviceId"]);
        }

        if (params["groupId"] != undefined) {
            this.productGroupId = JSON.parse(params["groupId"]);
        }
    });
  }

  ionViewWillEnter() {

    if(this.product != undefined && this.product != null)
    {
        this.getAllProductVerfication(this.product.id);
    }

  }

  getAllProductVerfication(productId: number) {
    this.loader = true;
    this.productService.getVarificationList(productId).subscribe(data => {
      this.productVariations = data.body;
      this.productVariationsFilter =this.productVariations;
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

  this.productVariations = this.productVariationsFilter;
  this.productVariations = this.productVariations.filter((item) => {

    const searchResult = (
      String(item.id).indexOf(val.trim()) > -1 ||
      String(item.factorToProduct).indexOf(val.trim()) > -1 ||
      (item.name != null && item.name.toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) > -1) ||
      (item.code != null && item.code.toLowerCase().indexOf(val.toLowerCase().trim()) > -1));

    return searchResult;
  })
    

}

async viewdetail(variation) {

    const actionSheet = await this.actionSheetController.create({
      header: 'Variation Action',
      cssClass: 'action-sheets-basic-page',
      mode: "md",
      buttons:
        [
          {
            text: 'Edit',
            icon: 'create',
            handler: () => {
                
                this.onEdit(variation);
                }
          },
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
                
                this.presentAlert('Caution!', 'Do you want to delete '+variation.name+'.',variation);
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

onAdd()
{
    let navigationExtras: NavigationExtras = {
        queryParams: {
           // data: JSON.stringify(this.product),
           product: JSON.stringify(this.product),
        }
      };
  
    this.router.navigate(['create-variation'], navigationExtras);
}

onEdit(variation)
{
    let navigationExtras: NavigationExtras = {
        queryParams: {
           data: JSON.stringify(variation),
           product: JSON.stringify(this.product),
        }
      };
  
    this.router.navigate(['create-variation'], navigationExtras);
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
            this.deleteVeriation(data, this.product.id);
          }
        }
      ]
    });

    await alert.present();
  }


  deleteVeriation(productVariation: ProductVariationDto, productId: number) {
    this.loader = true;
    this.productService.deleteVariation(productVariation, productId).subscribe(data => {

      // Logger.log('data'+JSON.stringify(data));

      if (data.status === 200) {
        this.loader = false;
        this.presentToast('Product variation deleted successfully');
        this.getAllProductVerfication(productId);
      }
      else {
        this.loader = false;
        this.presentToast('Fail');
      }

    }, error => {
      //  Logger.log(JSON.stringify(error));
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

cancel()
{
  let navigationExtras: NavigationExtras = {
      queryParams: {
          //data: JSON.stringify(row),
          serviceId: JSON.stringify(this.businessServiceId),
          groupId: JSON.stringify(this.productGroupId),
      }
    };

  this.router.navigate(['manage-product'], navigationExtras);
 // this.navCtrl.navigateForward("manage-product");
//    this._location.back();
}


}
