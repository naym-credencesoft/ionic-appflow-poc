import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { OrderProduct } from '../Order/product';
import { ProductGroup } from '../product/productGroup';
import { Product } from '../product/product';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-open-product',
  templateUrl: './open-product.component.html',
  styleUrls: ['./open-product.component.scss'],
})
export class OpenProductComponent implements OnInit {
  ProductForm: FormGroup;
  name: FormControl = new FormControl();
  sellUnitPrice: FormControl = new FormControl();
  Quantity: FormControl = new FormControl();
  isUpdateRequest: boolean = false;
  orderProducts: any[];
  orderProduct: OrderProduct;
  isProductGroupAvailable: boolean = false;
  quantity: number = 1;
  loader: boolean = false;
  productGroup: ProductGroup;
  product: Product;
  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private toastController: ToastController,
    private productService: ProductService,
  ) {
    this.productGroup = new ProductGroup();
    this.product = new Product();
    this.ProductForm = this.formBuilder.group({
    name: ['', [Validators.required]], 
    sellUnitPrice: ['', [Validators.required]], 
    Quantity: ['', [Validators.required, Validators.min(0)]] 
  }); }

  ngOnInit() {
    this.orderProducts = this.navParams.get('orderProducts');
    console.log('Order:', this.orderProducts);
    this.productGroup = this.navParams.get('productGroup');
    console.log('product:', this.productGroup);
    this.orderProducts = this.orderProducts;
    this.productGroup = this.productGroup;
    
    
  }

  onSubmit() {
    this.loader = true;
    this.productService.CreateProduct(this.product, this.productGroup.id).subscribe(
      (data) => {
        this.product = data.body;
        if (data.status === 200) {

          this.orderProduct = new OrderProduct();
          this.orderProduct.businessServiceId = this.productGroup.businessServiceId;
          this.orderProduct.productGroupName = this.productGroup.name;
          this.orderProduct.productGroupId = this.productGroup.id;
          this.orderProduct.unitsInOrder = this.quantity;
          let totalPrice = this.product.sellUnitPrice * this.quantity;
          this.orderProduct.totalPrice = totalPrice;
          this.orderProduct.nonGstItem = this.productGroup.nonGstItem;
          this.orderProduct.name = this.product.name;
          this.orderProduct.sellUnitPrice = this.product.sellUnitPrice;
          this.orderProduct.productCode = this.product.productCode;
          this.orderProduct.discountedPrice = null;
          this.orderProduct.discountInPercentage = null;
          this.orderProduct.outOfStock = this.product.outOfStock;
          this.orderProduct.id = this.product.id;
          this.orderProduct.groupName = this.productGroup.name;
          this.orderProduct.maintainStock = this.product.maintainStock;
          this.orderProducts.push(this.orderProduct);
          
          this.loader = false;
          // this.openSuccessSnackBar("Product save successfully");
          this.dismiss();
        } else {
          this.loader = false;
          this.presentToast("Error");
        }
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
        message: Message,
        duration: 2000,
    });
    toast.present();
}


  dismiss() {
    this.modalController.dismiss();
  }
}
