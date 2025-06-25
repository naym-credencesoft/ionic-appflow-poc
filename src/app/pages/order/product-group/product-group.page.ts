import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { BusinessProperties } from '../../../model/Order/businessProperties';
import { OrderSaveData } from '../../../model/Order/ordersavedata';
import { OrderProduct } from '../../../model/Order/product';
import { productVariationDtoList } from '../../../model/Order/productVariation';
import { Product } from '../../../model/product/product';
import { Property } from '../../../model/property/Property';
import { Logger } from '../../../service/logger.service';
import { ProductService } from '../../../service/product/product.service';
import { TokenStorage } from '../../../token.storage';

export interface ProductGroupList {
  businessServiceId: number;
  productGroup: any;
}

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.page.html',
  styleUrls: ['./product-group.page.scss'],
})
export class ProductGroupPage implements OnInit {

  orderSaveData: OrderSaveData;
  productDetailList: any[] = [];

  property: Property;
  propertiesDto: BusinessProperties;

  isAddToCart = false;
  slotReservation: any;
  productGroupsList: ProductGroupList[] = [];
  loader = false;

  totalQuantity: number;

  totalPriceVariation = 0;
  quantityVariation = 0;

  totalPrice = 0;
  quantity = 0;

  businessServices: any[];
  businessService: any;

  orderProducts: any[];
  orderProduct: OrderProduct;
  products: Product[];
  timeIntevalSeconds = 90;

  isTimmerOff = false;
  permission: number;

  productGroupsListWithBusinessId: any;

  pGroupINumber = 0;
  isclickG = false;

  productVariations: productVariationDtoList[];
  productVariation: productVariationDtoList;

  isDataOnNgOnIt = false;
  indexNumber = 0;
  businessServiceId : number;
  BusinessService: FormControl = new FormControl();
  onProductForm: FormGroup;

constructor(
  private productService: ProductService,
  public token: TokenStorage,
  private acRoute: ActivatedRoute,
  private router: Router,
  private formBuilder: FormBuilder,
  private toastController: ToastController,
  private navCtrl: NavController,
  private changeDetectorRefs: ChangeDetectorRef)
  {
     this.property = new Property();
     this.propertiesDto = new BusinessProperties();
     this.businessServices = [];

     this.onProductForm = this.formBuilder.group({
        BusinessService: ["", Validators.compose([Validators.required])],
    });
  }

  ngOnInit()
  {
    this.isDataOnNgOnIt = true;
    this.orderProducts = [];
    this.property = this.token.getProperty();

    // if (this.token.getProductSelected() === undefined || this.token.getProductSelected() === null)
    // {
      this.getAllBusinessService(String(this.property.id));
      Logger.log('1');
    // }
    // else
    // {
    //   this.orderProducts = [];
    //   this.productGroupsList = [];
    //   this.businessServices = [];

    //   this.property = this.token.getProperty();
    // //  this.orderProducts = this.token.getAddToCartProduct().OrderData;
    //   this.businessServices.push(this.token.getAddToCartProduct().businessServiceData);
    //   this.productGroupsList = this.token.getProductSelected();

    //   this.changeDetectorRefs.detectChanges();
    //   Logger.log('2');
    // }


  }

  setService(businessServiceId : any)
  {
     Logger.log('businessServiceId '+ businessServiceId);
     this.orderProducts = [];
     this.productGroupsList = [];

     this.getAllGroupProduct(businessServiceId);
  }

  ionViewWillEnter()
  {
    if (this.token.getAddToCartProduct() != undefined &&  this.token.getProductSelected() != undefined)
    {
      Logger.log('menu tab t');

      this.orderProducts = [];
      this.productGroupsList = [];
      this.businessServices = [];
      this.property = this.token.getProperty();
      this.businessServices.push(this.token.getAddToCartProduct().businessServiceData);
      this.productGroupsList = this.token.getProductSelected();

      this.changeDetectorRefs.detectChanges();
    }
    // const refreshIntervalId = setInterval(() => {

    //   this.indexNumber = 0;

    //   if (this.token.getDataStored() != undefined && this.token.getDataStored() === 'true' || this.isDataOnNgOnIt === false)
    //   {

    //     if (this.token.getAddToCartProduct() != undefined &&  this.token.getProductSelected() != undefined)
    //     {
    //       Logger.log('menu tab t');

    //       this.orderProducts = [];
    //       this.productGroupsList = [];
    //       this.businessServices = [];
    //       this.property = this.token.getProperty();
    //       this.businessServices.push(this.token.getAddToCartProduct().businessServiceData);
    //       this.productGroupsList = this.token.getProductSelected();

    //       this.changeDetectorRefs.detectChanges();
    //     }
    //     else
    //     {
    //       Logger.log('menu tab f');
    //       this.orderProducts = [];
    //       this.productGroupsList = [];
    //       this.getAllBusinessService(String(this.property.id));
    //     }
    //   }
    //   }, this.timeIntevalSeconds * 10);
  }

  productGroupIndex(pg , productGroup)
  {

    this.pGroupINumber = pg;
    if (this.isclickG === false)
     {
      this.isclickG = true;
     }
     else
     {
      this.isclickG = false;
     }

  }


getAllGroupProduct(businessServiceId: number) {
  this.loader = true;
  this.productService
    .findProductsByBusinessServiceId(businessServiceId)
    .subscribe(
      (data) => {

          const productGroup: ProductGroupList = {
              businessServiceId :  (businessServiceId),
              productGroup : data.body,
          };

          this.productGroupsList.push(productGroup);
       
          this.loader = false;

        //   if (busnessserviceList.length == index + 1)
        //   {
        //       this.loader = false;
        //       Logger.log('5' + JSON.stringify(this.productGroupsList));
        //      // this.orderProducts = this.token.getAddToCartProduct().OrderData;
        //       // if(this.orderProducts.length >0)
        //       // {
        //       //   this.getProductFromAddToCart();
        //       // }
        //   }

          this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );
}

getProductFromAddToCart()
{
  //  for(let i =0 ; i< this.productGroupsList.length; i++)
  //  {
  //   for(let j =0 ; j< this.productGroupsList[i].productGroup.length; j++)
  //   {
  //     for(let k =0 ; k< this.productGroupsList[i].productGroup[j].productDtoList.length; k++)
  //     {

  //       for(let l =0 ; l< this.orderProducts.length; l++)
  //       {
  //         if(this.orderProducts[l].id ===this.productGroupsList[i].productGroup[j].productDtoList[k].id )
  //         {
  //           this.productGroupsList[i].productGroup[j].productDtoList[k] = this.orderProducts[l];
  //         }
  //       }

  //     }
  //   }
  //  }
  //  this.calculateQuantity();
}



getAllBusinessService(PropertyId: string) {
this.loader = true;
this.orderProducts = [];
this.productGroupsList = [];

this.productService.findByPropertyId(PropertyId).subscribe(data => {
   this.propertiesDto  = data.body;

   this.orderProducts = [];
   this.productGroupsList = [];

   Logger.log('3 id: ');
   this.loader = false;

   if (this.propertiesDto.businessServiceDtoList.length > 0)
   {
         this.businessServices.push(this.propertiesDto.businessServiceDtoList[0]);
         this.businessServiceId = this.propertiesDto.businessServiceDtoList[0].id;
        // this.changeDetectorRefs.detectChanges();
        // for (let i = 0; i < this.propertiesDto.businessServiceDtoList.length; i++)
        // {
        //     this.businessServices.push(this.propertiesDto.businessServiceDtoList[i]);
        // }
        // this.businessServiceId = this.propertiesDto.businessServiceDtoList[0].id
        // this.getAllGroupProduct(this.propertiesDto.businessServiceDtoList[0].id);
  
   }

   this.changeDetectorRefs.detectChanges();
}, error => {
  this.loader = false;
});
}

onProductMinus(product: any , p: number , productGroup: any, businessServiceId: number , i: number)
{
  if (this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true)
  {
    this.orderProduct = new OrderProduct();

    this.orderProduct = this.orderProducts.find(
        (cart) => cart.id === product.id
    );

    this.quantity = this.orderProduct.unitsInOrder;

    this.quantity = this.quantity - 1;
    this.totalPrice = this.orderProduct.sellUnitPrice * this.quantity;

    this.orderProduct.unitsInOrder = this.quantity;
    this.orderProduct.totalPrice = this.totalPrice;


    if ( this.orderProduct.unitsInOrder === 0)
    {
        const groupIndex = this.productGroupsList[i].productGroup.indexOf(productGroup);
       // this.orderProducts = this.orderProducts.filter(item => item.id !== this.orderProduct.id);
        this.productGroupsList[i].productGroup[groupIndex].productDtoList[p].unitsInOrder = null;

        this.orderProducts.splice(this.orderProducts.indexOf(product), 1);
    }
    else
    {

       // this.productGroupsList[i].productGroup[pg].productDtoList[p].unitsInOrder = this.orderProduct.unitsInOrder;
        this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
    }
  }
  else
  {
    this.orderProduct = new OrderProduct();
    this.orderProduct = product;
    this.orderProduct.businessServiceId = businessServiceId;
    this.orderProduct.productGroupName = productGroup.name;

    this.quantity = this.orderProduct.unitsInOrder;

    this.quantity = this.quantity - 1;
    this.totalPrice = this.orderProduct.sellUnitPrice * this.quantity;

    this.orderProduct.unitsInOrder = this.quantity;
    this.orderProduct.totalPrice = this.totalPrice;


    if ( this.orderProduct.unitsInOrder === 0)
      {
          const groupIndex = this.productGroupsList[i].productGroup.indexOf(productGroup);
          this.productGroupsList[i].productGroup[groupIndex].productDtoList[p].unitsInOrder = null;

          this.orderProducts.splice(this.orderProducts.indexOf(product), 1);
      }
      else
      {
          this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
      }
  }

}

onProductVariationMinus(product: any , p: number , productGroup: any , businessServiceId: number , i: number , variation: any , v: number)
{
  if (this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true)
  {
    this.orderProduct = new OrderProduct();
    this.orderProduct = this.orderProducts.find(
        (cart) => cart.id === product.id
    );


    this.productVariations = [];
    this.productVariation = new productVariationDtoList();
    this.productVariations = this.orderProduct.productVariationDtoList;


    if (this.productVariations.some((c) => c.code === variation.code) === true)
    {
        this.productVariation = this.productVariations.find(
        (list) => list.code === variation.code
        );

        this.quantityVariation = this.productVariation.unitsInOrder;
        this.quantityVariation = this.quantityVariation - 1;

        this.totalPriceVariation =
        this.quantityVariation * this.productVariation.sellUnitPrice;

        this.productVariation.discountedPrice = 0;
        this.productVariation.unitsInOrder = this.quantityVariation;
        this.productVariation.totalPrice = this.totalPriceVariation;

        if (this.productVariation.unitsInOrder === 0)
        {
            this.productVariation.unitsInOrder = null;
            this.productVariation.totalPrice = null;
        }
        else
        {
            this.productVariations[
                this.productVariations.indexOf(this.productVariation)
                ] = this.productVariation;

            this.orderProduct.productVariationDtoList = this.productVariations;

            this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
        }

    }
  }
  else
  {

    this.orderProduct = new OrderProduct();
    this.productVariations = [];

    this.productVariation = new productVariationDtoList();

    this.productVariations = product.productVariationDtoList;


    if (this.productVariations.some((c) => c.code === variation.code) === true)
    {
        this.productVariation = this.productVariations.find(
        (list) => list.code === variation.code
        );

        this.quantityVariation = this.productVariation.unitsInOrder;
        this.quantityVariation = this.quantityVariation - 1;

        this.totalPriceVariation =
        this.quantityVariation * this.productVariation.sellUnitPrice;

        this.productVariation.discountedPrice = 0;
        this.productVariation.unitsInOrder = this.quantityVariation;
        this.productVariation.totalPrice = this.totalPriceVariation;

        if (this.productVariation.unitsInOrder === 0)
        {
            this.productVariation.unitsInOrder = null;
            this.productVariation.totalPrice = null;
        }
        else
        {
            this.productVariations[
                this.productVariations.indexOf(this.productVariation)
                ] = this.productVariation;

            this.orderProduct.productVariationDtoList = this.productVariations;

            this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
        }

   }
  }

}

async presentToast(Message: string) {
  const toast = await this.toastController.create({
    message: Message,
    duration: 2000
  });
  toast.present();
}

onProductVariationAdd(product: any , p: number , productGroup: any, businessServiceId: number , i: number , variation: any , v: number)
{
  if (this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true)
  {
      this.orderProduct = new OrderProduct();

      this.orderProduct = this.orderProducts.find(
        (cart) => cart.id === product.id
      );

      this.productVariations = [];
      this.productVariation = new productVariationDtoList();

      this.productVariations = this.orderProduct.productVariationDtoList;

      if (this.productVariations.some((c) => c.code === variation.code) === true)
      {
        this.productVariation = this.productVariations.find(
          (list) => list.code === variation.code
        );

        this.quantityVariation = this.productVariation.unitsInOrder;
        this.quantityVariation = this.quantityVariation + 1;

        this.totalPriceVariation =
        this.quantityVariation * this.productVariation.sellUnitPrice;

        this.productVariation.discountedPrice = 0;
        this.productVariation.unitsInOrder = this.quantityVariation;
        this.productVariation.totalPrice = this.totalPriceVariation;

        this.productVariations[
          this.productVariations.indexOf(this.productVariation)
        ] = this.productVariation;

        this.orderProduct.productVariationDtoList = this.productVariations;

        this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
      }
  }
  else {

      this.orderProduct = new OrderProduct();
      this.orderProduct = product;
      this.orderProduct.productGroupName = productGroup.name;
      this.orderProduct.businessServiceId = businessServiceId;

      this.productVariation = new productVariationDtoList();
      this.productVariation = variation;

      this.productVariation.discountedPrice = 0;
      this.productVariation.totalPrice =  this.productVariation.sellUnitPrice;

      if (variation.unitsInOrder != undefined || variation.unitsInOrder != null)
      {
        this.productVariation.unitsInOrder = variation.unitsInOrder;
      }
      else
      {
        this.productVariation.unitsInOrder = 1;
      }

      this.productVariations = [];

      this.productVariations =  this.orderProduct.productVariationDtoList;

      this.productVariations[v] = this.productVariation;

      this.orderProduct.productVariationDtoList = this.productVariations;
      this.orderProducts.push(this.orderProduct);
    }

}

onProductAdd(product: any , p: number , productGroup: any , businessServiceId: number , i: number)
{
  if (this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true) {

      this.orderProduct = new OrderProduct();

      this.orderProduct = this.orderProducts.find(
        (cart) => cart.id === product.id
      );

      Logger.log('1' + JSON.stringify(this.orderProduct));


      this.quantity = this.orderProduct.unitsInOrder;

      this.quantity = this.quantity + 1;
      this.totalPrice = this.orderProduct.sellUnitPrice * this.quantity;

      this.orderProduct.unitsInOrder = this.quantity;
      this.orderProduct.totalPrice = this.totalPrice;

      // this.productGroupsList[i].productGroup[pg].productDtoList[p].unitsInOrder = this.orderProduct.unitsInOrder;

      this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
     } else {

      Logger.log(JSON.stringify(product));
      this.orderProduct = new OrderProduct();
      this.orderProduct = product;
      this.orderProduct.businessServiceId = businessServiceId;
      this.orderProduct.productGroupName = productGroup.name;
      if (product.unitsInOrder != undefined || product.unitsInOrder != null)
      {
        this.orderProduct.unitsInOrder = product.unitsInOrder;
      }
      else
      {
        this.orderProduct.unitsInOrder = 1;
      }
      this.orderProduct.totalPrice = product.sellUnitPrice;

     // this.productGroupsList[i].productGroup[pg].productDtoList[p].unitsInOrder = this.orderProduct.unitsInOrder;

      this.orderProducts.push(this.orderProduct);
    }
   // this.token.saveAddToCartProduct(this.orderProducts);
  // this.isTimmerOff = true;
}

calculateQuantity() {

  this.totalQuantity = 0;

  for(let pgl = 0 ; pgl < this.productGroupsList.length ; pgl++)
  {
    for (let pg = 0 ; pg < this.productGroupsList[pgl].productGroup.length ; pg++) {
      for (let i = 0 ; i < this.productGroupsList[pgl].productGroup[pg].productDtoList.length; i++) {

        this.productDetailList = this.productGroupsList[pgl].productGroup[pg].productDtoList;

        if (this.productDetailList[i].productVariationDtoList.length > 0) {
          for (let j = 0 ; j < this.productDetailList[i].productVariationDtoList.length ; j++) {

              if ( this.productDetailList[i].productVariationDtoList[j].unitsInOrder != null &&  this.productDetailList[i].productVariationDtoList[j].unitsInOrder > 0)
              {
                  this.totalQuantity = this.totalQuantity + 1;
              }
          }
        }
        else if ( this.productDetailList[i].unitsInOrder != null &&  this.productDetailList[i].unitsInOrder > 0)
        {
          this.totalQuantity = this.totalQuantity + 1;
        }

      }
    }
  }

  return this.totalQuantity;
}

onAddToCart()
{
  this.orderSaveData = new OrderSaveData();
  this.orderSaveData.OrderData = this.orderProducts;
  this.orderSaveData.businessServiceData = this.businessServices[0];

  this.token.saveAddToCartProduct(this.orderSaveData);
  this.token.saveProductSelected(this.productGroupsList);

  const navigationExtras: NavigationExtras = {
      queryParams: {
          data :  true,
      }
  };

  this.navCtrl.navigateForward(['/add-to-cart'] , navigationExtras);

   // this.router.navigate(['/add-to-cart']);
}

}
