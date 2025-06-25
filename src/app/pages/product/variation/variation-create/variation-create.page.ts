import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ActionSheetController, ToastController, NavController } from '@ionic/angular';
import { Product } from 'src/app/model/product/product';
import { ProductVariationDto } from 'src/app/model/product/productVariation';
import { FileService } from 'src/app/service/file.service';
import { ProductService } from 'src/app/service/product/product.service';
import { Location } from '@angular/common';
import { TokenStorage } from 'src/app/token.storage';
import { Logger } from 'src/app/service/logger.service';

@Component({
  selector: 'app-variation-create',
  templateUrl: './variation-create.page.html',
  styleUrls: ['./variation-create.page.scss'],
})
export class VariationCreatePage implements OnInit {

    product: Product;
    loader : boolean = false;
    productVariation: ProductVariationDto;
    productVariations : ProductVariationDto[]=[];
    ButtonLabel: string ="Create";

    onProductVariationForm: FormGroup;

    isfactorAvailable : boolean = false;
    selllPriceDec: number;
    factorDec: number;

    isUpdateRequest : boolean = false; 

    constructor(private productService: ProductService,
        public token: TokenStorage,
        private acRoute: ActivatedRoute,
        private _location: Location,
        public loadingCtrl: LoadingController,
        private actionSheetController: ActionSheetController,
        private router: Router,
        private formBuilder: FormBuilder,
        private fileService: FileService,
        private toastController: ToastController,
        private navCtrl: NavController,
        private changeDetectorRefs: ChangeDetectorRef)  
        { 
            this.product = new Product();
            this.productVariation = new ProductVariationDto();
        }

  ngOnInit() 
  {
    this.onProductVariationForm = this.formBuilder.group({
        Name : ["", Validators.compose([Validators.required])],
        productCode : ["", Validators.compose([Validators.required])],
        SellUnitPrice : ["", Validators.compose([Validators.required])],
        DiscountedPrice : ["", Validators.compose([Validators.nullValidator])],
        FactortoProduct: ["", Validators.compose([Validators.required])],
        OutOfStock: ["", Validators.compose([Validators.nullValidator])],
    });


    this.acRoute.queryParams.subscribe((params) => {
        if (params["data"] != undefined) {
            this.productVariation = JSON.parse(params["data"]);
            this.ButtonLabel = "Update";
            this.isUpdateRequest = true;
        }

        if (params["product"] != undefined) {
            this.product = JSON.parse(params["product"]);
            this.variationFactorCheck();
            this.changeDetectorRefs.detectChanges();
        }
    });

    if(this.isUpdateRequest === false)
    {
        this.variationPriceCheck();
    }


    this.getAllProductVerfication(this.product.id);
  }

  variationPriceCheck()
  {
    this.productVariation.discountedPrice = 0;
    if(this.product.sellUnitPrice === null || this.product.sellUnitPrice === undefined || this.product.sellUnitPrice === 0)
    {
      this.productVariation.sellUnitPrice = 0;
      this.productVariation.factorToProduct = 1;
      this.isfactorAvailable = false;
    }
    else
    {
      this.productVariation.sellUnitPrice = this.product.sellUnitPrice;
      this.productVariation.factorToProduct = 1;
      this.isfactorAvailable = true;
    }
  }

  variationFactorCheck()
  {
    this.productVariation.discountedPrice = 0;
    if(this.product.sellUnitPrice === null || this.product.sellUnitPrice === undefined || this.product.sellUnitPrice === 0)
    {
      this.isfactorAvailable = false;
    }
    else
    {
      this.isfactorAvailable = true;
    }
  }

  priceToFactorRow(row)
  {
      Logger.log('priceToFactorRow');
    if(this.isfactorAvailable === true)
    {
      this.factorDec =  this.productVariation.sellUnitPrice / this.product.sellUnitPrice;
      row.factorToProduct = (Number(this.factorDec).toFixed(2));
    }
  }

  factorTopriceRow(row)
  {
    if(this.isfactorAvailable === true)
    {
      this.selllPriceDec = (this.productVariation.factorToProduct * this.product.sellUnitPrice);
      row.sellUnitPrice = parseFloat(Number(this.selllPriceDec).toFixed(2));
    }
  }


  priceToFactor()
  {
    if(this.isfactorAvailable === true)
    {
        this.productVariation.factorToProduct = this.productVariation.sellUnitPrice / this.product.sellUnitPrice;
    }
  }
  factorToprice(factorNumber)
  {
    if(this.isfactorAvailable === true)
    {
      //this.selllPriceDec = (this.productVariation.factorToProduct * this.product.sellUnitPrice);
      this.productVariation.sellUnitPrice = (this.productVariation.factorToProduct * this.product.sellUnitPrice);
    }
  }


  getAllProductVerfication(productId: number) {
    this.loader = true;
    this.productService.getVarificationList(productId).subscribe(data => {
      this.productVariations = data.body;
      this.loader = false;

      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
    });
  }

  submit()
  {
      if(this.isUpdateRequest === false)
      {
        if (this.productVariations.some(person => person.code === this.productVariation.code) === false) {

            this.selllPriceDec = this.productVariation.sellUnitPrice;

            this.productVariation.sellUnitPrice = parseFloat(Number(this.selllPriceDec).toFixed(2));
      
            this.factorDec = this.productVariation.factorToProduct;
            this.productVariation.factorToProduct = parseFloat(Number(this.factorDec).toFixed(2));
      
            this.creatProductVerification(this.productVariation, this.product.id);
          }
          else {
            this.presentToast('Product variation code already exist');
          }
      }
      else
      {
        this.selllPriceDec = this.productVariation.sellUnitPrice;
       
        this.productVariation.sellUnitPrice = parseFloat(Number(this.selllPriceDec).toFixed(2));
       
        this.factorDec = this.productVariation.factorToProduct;
        this.productVariation.factorToProduct = parseFloat(Number(this.factorDec).toFixed(2));
    
         this.updateProductVeriation(this.productVariation, this.product.id);
      }
  }

  
  updateProductVeriation(productVariation: ProductVariationDto, productId: number) {
    this.loader = true;
    this.productService.UpdateVeriation(productId, productVariation).subscribe(data => {

      // Logger.log('data'+JSON.stringify(data));

      if (data.status === 200) {
        this.loader = false;
        this.presentToast('Product variation updated successfully');
        this.cancel();
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


  creatProductVerification(productVariationDto: ProductVariationDto, productId: number) {
    this.loader = true;
    this.productService.createVariation(productVariationDto, productId).subscribe(data => {

      if (data.status === 201) {
        this.loader = false;
        this.presentToast('Product variation created successfully');

        this.cancel();
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
  cancel()
  {
    this._location.back();
  }
}
