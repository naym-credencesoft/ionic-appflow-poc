import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Order } from '../../../model/Order/order';
import { OrderSaveData } from '../../../model/Order/ordersavedata';
import { OrderProduct } from '../../../model/Order/product';
import { productVariationDtoList } from '../../../model/Order/productVariation';
import { BusinessService } from '../../../model/Reservation/businessServic';
import { Logger } from '../../../service/logger.service';
import { TokenStorage } from '../../../token.storage';
import { ProductGroupList } from '../product-group/product-group.page';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.page.html',
  styleUrls: ['./add-to-cart.page.scss'],
})
export class AddToCartPage implements OnInit {
  orderSaveData: OrderSaveData;

  productGroupsList: ProductGroupList[] = [];
  loader = false;
  order: Order;
  slotReservation: any;
  totalQuantity: number;
  pGroupINumber: number = 0;
  isclickG = false;

  productDetailList: any[] = [];

  totalPriceVariation = 0;
  quantityVariation = 0;

  totalPrice = 0;
  quantity = 0;
  total = 0;
  taxPercentage = 0;

  businessService: BusinessService;

  orderProducts2: OrderProduct[];
  orderProducts: OrderProduct[];
  orderSelectedProducts: OrderProduct[];
  orderProduct: OrderProduct;

  productVariationSelected: any[];
  productVariations: productVariationDtoList[];
  productVariation: productVariationDtoList;

  businessServiceId: number;

  isCartFromMenu: boolean = true;

  constructor(
    public token: TokenStorage,
    private acRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private router: Router,
    private _location: Location,
    private navCtrl: NavController,
    private changeDetectorRefs: ChangeDetectorRef
  ) {


  }

  ngOnInit() {

    this.acRoute.queryParams.subscribe(params => {

      if (params["data"] != undefined) {
        this.isCartFromMenu = false;
      }

    });

    this.orderProducts = [];
    this.orderProducts2 = [];

    this.order = new Order();
    this.orderProduct = new OrderProduct();
    this.businessService = new BusinessService();
    this.orderSaveData = new OrderSaveData();

    this.orderSaveData = this.token.getAddToCartProduct();
    this.productGroupsList = this.token.getProductSelected();


    if (this.token.getProperty() != undefined || this.token.getProperty() != null) {
      this.order.propertyId = Number(this.token.getProperty().id);
      //this.taxPercentage = this.token.getProperty().taxDetails[0].percentage;
    }


    if (this.orderSaveData != null || this.orderSaveData != undefined) {
      this.businessService = this.orderSaveData.businessServiceData;
      this.order.businessServiceId = this.businessService.id;
      this.calculatePrice();
    }

  }


  productGroupIndex(pg, productGroup) {

    this.pGroupINumber = pg;
    if (this.isclickG === false) {
      this.isclickG = true;
    }
    else {
      this.isclickG = false;
    }

  }


  backClicked() {
    this._location.back();
  }



  menu() {
    this.menuCtrl.toggle();
  }

  onProductVariationAdd(product: any, p: number, productGroup: any, businessServiceId: number, i: number, variation: any, v: number) {
    if (this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true) {
      this.orderProduct = new OrderProduct();

      this.orderProduct = this.orderProducts.find(
        (cart) => cart.id === product.id
      );

      this.productVariations = [];
      this.productVariation = new productVariationDtoList();

      this.productVariations = this.orderProduct.productVariationDtoList;

      if (this.productVariations.some((c) => c.code === variation.code) === true) {
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
      this.productVariation.totalPrice = this.productVariation.sellUnitPrice;

      if (variation.unitsInOrder != undefined || variation.unitsInOrder != null) {
        this.productVariation.unitsInOrder = variation.unitsInOrder;
      }
      else {
        this.productVariation.unitsInOrder = 1;
      }

      this.productVariations = [];

      this.productVariations = this.orderProduct.productVariationDtoList;

      this.productVariations[v] = this.productVariation;

      this.orderProduct.productVariationDtoList = this.productVariations;
      this.orderProducts.push(this.orderProduct);
    }

    // this.token.saveProductSelected(this.productGroupsList);

    this.calculatePrice();
  }

  onProductAdd(product: any, p: number, productGroup: any, businessServiceId: number, i: number) {
    // Logger.log(JSON.stringify(productGroup));
    if (this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true) {

      this.orderProduct = new OrderProduct();

      this.orderProduct = this.orderProducts.find(
        (cart) => cart.id === product.id
      );

      this.quantity = this.orderProduct.unitsInOrder;

      this.quantity = this.quantity + 1;
      this.totalPrice = this.orderProduct.sellUnitPrice * this.quantity;

      this.orderProduct.unitsInOrder = this.quantity;
      this.orderProduct.totalPrice = this.totalPrice;


      this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
    } else {

      this.orderProduct = new OrderProduct();
      this.orderProduct = product;
      this.orderProduct.businessServiceId = businessServiceId;
      this.orderProduct.productGroupName = productGroup.name;

      if (product.unitsInOrder != undefined || product.unitsInOrder != null) {
        this.orderProduct.unitsInOrder = product.unitsInOrder;
      }
      else {
        this.orderProduct.unitsInOrder = 1;
      }

      this.orderProduct.totalPrice = product.sellUnitPrice;

      this.orderProducts.push(this.orderProduct);
    }

    // this.token.saveProductSelected(this.productGroupsList);
    this.calculatePrice();
  }

  onProductMinus(product: any, p: number, productGroup: any, businessServiceId: number, i: number) {

    if (this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true) {
      this.orderProduct = new OrderProduct();

      this.orderProduct = this.orderProducts.find(
        (cart) => cart.id === product.id
      );

      this.quantity = this.orderProduct.unitsInOrder;

      this.quantity = this.quantity - 1;
      this.totalPrice = this.orderProduct.sellUnitPrice * this.quantity;

      this.orderProduct.unitsInOrder = this.quantity;
      this.orderProduct.totalPrice = this.totalPrice;


      if (this.orderProduct.unitsInOrder === 0) {
        const groupIndex = this.productGroupsList[i].productGroup.indexOf(productGroup);
        // this.orderProducts = this.orderProducts.filter(item => item.id !== this.orderProduct.id);
        this.productGroupsList[i].productGroup[groupIndex].productDtoList[p].unitsInOrder = null;

        this.orderProducts.splice(this.orderProducts.indexOf(product), 1);
      }
      else {

        // this.productGroupsList[i].productGroup[pg].productDtoList[p].unitsInOrder = this.orderProduct.unitsInOrder;
        this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
      }
    }
    else {
      this.orderProduct = new OrderProduct();
      this.orderProduct = product;
      this.orderProduct.businessServiceId = businessServiceId;
      this.orderProduct.productGroupName = productGroup.name;

      this.quantity = this.orderProduct.unitsInOrder;

      this.quantity = this.quantity - 1;
      this.totalPrice = this.orderProduct.sellUnitPrice * this.quantity;

      this.orderProduct.unitsInOrder = this.quantity;
      this.orderProduct.totalPrice = this.totalPrice;


      if (this.orderProduct.unitsInOrder === 0) {
        const groupIndex = this.productGroupsList[i].productGroup.indexOf(productGroup);
        this.productGroupsList[i].productGroup[groupIndex].productDtoList[p].unitsInOrder = null;

        this.orderProducts.splice(this.orderProducts.indexOf(product), 1);
      }
      else {
        this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
      }

    }
    // this.token.saveProductSelected(this.productGroupsList);
    this.calculatePrice();
  }

  onProductVariationMinus(product: any, p: number, productGroup: any, businessServiceId: number, i: number, variation: any, v: number) {
    if (this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true) {
      this.orderProduct = new OrderProduct();
      this.orderProduct = this.orderProducts.find(
        (cart) => cart.id === product.id
      );


      this.productVariations = [];
      this.productVariation = new productVariationDtoList();
      this.productVariations = this.orderProduct.productVariationDtoList;


      if (this.productVariations.some((c) => c.code === variation.code) === true) {
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

        if (this.productVariation.unitsInOrder === 0) {
          this.productVariation.unitsInOrder = null;
          this.productVariation.totalPrice = null;
        }
        else {

          Logger.log('step 1');
          this.productVariations[
            this.productVariations.indexOf(this.productVariation)
          ] = this.productVariation;

          this.orderProduct.productVariationDtoList = this.productVariations;

          this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
        }

      }
    }
    else {

      this.orderProduct = new OrderProduct();
      this.productVariations = [];

      this.productVariation = new productVariationDtoList();

      this.productVariations = product.productVariationDtoList;


      if (this.productVariations.some((c) => c.code === variation.code) === true) {
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

        if (this.productVariation.unitsInOrder === 0) {
          this.productVariation.unitsInOrder = null;
          this.productVariation.totalPrice = null;
        }
        else {
          Logger.log('step 2');
          this.productVariations[
            this.productVariations.indexOf(this.productVariation)
          ] = this.productVariation;

          this.orderProduct.productVariationDtoList = this.productVariations;

          this.orderProducts[this.orderProducts.indexOf(product)] = this.orderProduct;
        }

      }
    }
    // this.token.saveProductSelected(this.productGroupsList);
    this.calculatePrice();
  }

  calculatePrice() {
    this.total = 0;
    this.orderSelectedProducts = [];

    for (let pgl = 0; pgl < this.productGroupsList.length; pgl++) {
      for (let pg = 0; pg < this.productGroupsList[pgl].productGroup.length; pg++) {
        for (let i = 0; i < this.productGroupsList[pgl].productGroup[pg].productDtoList.length; i++) {

          this.productDetailList = this.productGroupsList[pgl].productGroup[pg].productDtoList;

          if (this.productDetailList[i].productVariationDtoList.length > 0) {

            for (let j = 0; j < this.productDetailList[i].productVariationDtoList.length; j++) {

              if (this.productDetailList[i].productVariationDtoList[j].totalPrice != null && this.productDetailList[i].productVariationDtoList[j].totalPrice > 0) {
                this.total =
                  this.total +
                  this.productDetailList[i].productVariationDtoList[j].totalPrice;
              }
            }

          }
          else if (this.productDetailList[i].unitsInOrder != null && this.productDetailList[i].unitsInOrder > 0) {
            this.total = this.total + this.productDetailList[i].totalPrice;
          }

        }
      }
    }
    this.order.discountAmount = 0;
    // this.order.netAmount = this.total;
    this.order.taxAmount = 0;
    this.order.totalOrderAmount = this.total;

    if (this.total === 0) {
      this.productGroupsList = [];
      this.token.clearADDToCart();
      this.token.clearProductSelected();
      //  this.token.clearProperty();
    }
    else {
      this.token.saveProductSelected(this.productGroupsList);
    }

    return this.total;
  }

  onRemoveVariation(variation, i, pg, p, v) {
    variation.unitsInOrder = null;
    variation.totalPrice = null;
    this.productGroupsList[i].productGroup[pg].productDtoList[p].productVariationDtoList[v] = variation;

    //  this.token.saveProductSelected(this.productGroupsList);
    this.calculatePrice();
  }

  onRemoveProduct(product) {
    product.unitsInOrder = null;
    product.totalPrice = null;

    // this.token.saveProductSelected(this.productGroupsList);
    this.calculatePrice();
  }



  onCheckout() {

    this.calculateCheckOutyDTO();
    // Logger.log(JSON.stringify(this.orderSelectedProducts));
  }

  calculateCheckOutyDTO() {
    this.orderSelectedProducts = [];

    for (let pgl = 0; pgl < this.productGroupsList.length; pgl++) {
      for (let pg = 0; pg < this.productGroupsList[pgl].productGroup.length; pg++) {
        for (let i = 0; i < this.productGroupsList[pgl].productGroup[pg].productDtoList.length; i++) {

          this.productDetailList = this.productGroupsList[pgl].productGroup[pg].productDtoList;

          if (this.productDetailList[i].productVariationDtoList.length > 0) {

            this.productVariationSelected = [];

            for (let j = 0; j < this.productDetailList[i].productVariationDtoList.length; j++) {

              if (this.productDetailList[i].productVariationDtoList[j].totalPrice != null && this.productDetailList[i].productVariationDtoList[j].totalPrice > 0) {
                this.productVariationSelected.push(this.productDetailList[i].productVariationDtoList[j]);
              }
            }

            if (this.productVariationSelected.length > 0) {
              this.productDetailList[i].productVariationDtoList = this.productVariationSelected;
              this.orderSelectedProducts.push(this.productDetailList[i]);
            }

          }
          else if (this.productDetailList[i].unitsInOrder != null && this.productDetailList[i].unitsInOrder > 0) {
            this.orderSelectedProducts.push(this.productDetailList[i]);
          }

        }
      }
    }

    this.order.productDtoList = this.orderSelectedProducts;

    this.orderSaveData = new OrderSaveData();
    this.orderSaveData.OrderData = this.order;
    this.orderSaveData.businessServiceData = this.businessService;

    this.token.saveAddToCartProduct(this.orderSaveData);
    this.router.navigate(['/checkout']);


  }


}
