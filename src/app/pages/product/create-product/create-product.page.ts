import { RecipeService } from './../../../service/inventory/recipe.service';
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
    LoadingController,
    ActionSheetController,
    ToastController,
    NavController,
} from "@ionic/angular";
import { ImageModel } from "src/app/model/imageFile";
import { Product } from "src/app/model/product/product";
import { ProductGroup } from "src/app/model/product/productGroup";
import { BusinessService } from "src/app/model/Reservation/businessServic";
import { RoomImage } from "src/app/model/RoomDetails/roomImage";
import { Location } from "@angular/common";
import { FileService } from "src/app/service/file.service";
import { Logger } from "src/app/service/logger.service";
import { ProductService } from "src/app/service/product/product.service";
import { TokenStorage } from "src/app/token.storage";
import { ProductVariationDto } from "src/app/model/product/productVariation";
import { Recipe } from "src/app/model/inventory/recipe";
import { Property } from "src/app/model/property/Property";
import { GroceryProduct } from 'src/app/model/inventory/Groceryproduct';

@Component({
    selector: "app-create-product",
    templateUrl: "./create-product.page.html",
    styleUrls: ["./create-product.page.scss"],
})
export class CreateProductPage implements OnInit {
    onProductForm: FormGroup;
    property: Property;
    productVariation: ProductVariationDto;
    productVariations: ProductVariationDto[];
    productGroups: ProductGroup[] = [];
    productGroup: ProductGroup;
    businessServices: BusinessService[];
    businessService: BusinessService;
    loader: boolean = false;
    businessServiceId: number;
    productGroupId: number;

    product: Product;

    ButtonLabel: string = "Create";
    propertyLogo: any;

    imagedataModel: ImageModel;
    formData: FormData;
    imageList: RoomImage[] = [];
    image: RoomImage;

    isUpdateRequest: boolean = false;
    productSellUnitPrice: number;
    isPriceChange: boolean = false;
    finalSellAmount: any;
    stockType: string;

    isShowRecipeList: boolean = false;
    recipeList: Recipe[];
    recipeListFilter: Recipe[];
    recipe: Recipe;
    recipeSearchResult: string;
    inventorySearchResult: string;
    searchResult: string;

    inventoryList: GroceryProduct[];
    inventory: GroceryProduct;
    inventoryListFilter: GroceryProduct[];
    isShowInventoryList: boolean = false;

    constructor(
        private productService: ProductService,
        public token: TokenStorage,
        private recipeService : RecipeService,
        private acRoute: ActivatedRoute,
        public loadingCtrl: LoadingController,
        private actionSheetController: ActionSheetController,
        private router: Router,
        private _location: Location,
        private formBuilder: FormBuilder,
        private fileService: FileService,
        private toastController: ToastController,
        private navCtrl: NavController,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.property = new Property();
        this.businessService = new BusinessService();
        this.product = new Product();
        this.productVariation = new ProductVariationDto();
        this.productGroup = new ProductGroup();
        this.imagedataModel = new ImageModel();
    }

    ngOnInit() {
        this.property = this.token.getProperty();
        console.log("property details", this.property)
        this.onProductForm = this.formBuilder.group({
            BusinessService: ["", Validators.compose([Validators.required])],
            ProductGroupId: ["", Validators.compose([Validators.required])],
            Name: ["", Validators.compose([Validators.required])],
            productCode: ["", Validators.compose([Validators.required])],
            ShortDescription: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            Description: ["", Validators.compose([Validators.nullValidator])],
            SellUnitPrice: ["", Validators.compose([Validators.required])],
            DiscountedPrice: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            OutOfStock: ["", Validators.compose([Validators.nullValidator])],
            MaintaInStock: ["", Validators.compose([Validators.nullValidator])],
            StockType: ["", Validators.compose([Validators.nullValidator])],
            searchControl: ["", Validators.compose([Validators.nullValidator])],
            recipeIdControl: ["", Validators.compose([Validators.nullValidator])],
            nameSearchController: ["", Validators.compose([Validators.nullValidator])],
            InventoryControl: ["", Validators.compose([Validators.nullValidator])],
        });

        this.acRoute.queryParams.subscribe((params) => {
            if (params["data"] != undefined) {
                this.product = JSON.parse(params["data"]);
                this.ButtonLabel = "Update";
                this.isUpdateRequest = true;

                if (
                    this.product.imageList != undefined &&
                    this.product.imageList.length > 0
                ) {
                    this.propertyLogo = this.product.imageList[0].url;
                    this.imageList = this.product.imageList;
                }
                this.variationFactorCheck();
            }

            if (params["serviceId"] != undefined) {
                this.businessService.id = JSON.parse(params["serviceId"]);
                this.getAllBusinessService();
                // this.getAllGroupProduct(this.businessService.id);
                this.changeDetectorRefs.detectChanges();
            }

            if (params["groupId"] != undefined) {
                this.productGroup.id = JSON.parse(params["groupId"]);
            }
        });

        this.getRecipeList(this.token.getProperty().id);
        this.getListOfGroceryProducts(this.token.getProperty().id);
    }

    
  getListOfGroceryProducts(propertyId: number) {
    this.inventoryList = [];
    this.inventoryListFilter = [];
    this.recipeService
      .getGroceryProductListByPropertyId(propertyId)
      .subscribe(
        (response) => {
          this.inventoryList = response.body;
          this.inventoryListFilter = response.body;
          this.changeDetectorRefs.detectChanges();
        },
        (error) => {
          this.loader = false;
        }
      );
  }
    
    onRecipeSelected(data) {
        this.recipeSearchResult = "";
        this.product.recipeId = data.id;
        this.product.inventoryLocation = data.storeLocation;
        this.isShowRecipeList = false;
    }
    setReceipe(recipeId: number) {
        this.recipe = new Recipe();
        if (this.recipeList != undefined && this.recipeList != null) {
          this.recipe = this.recipeList.find((data) => data.id === recipeId);
          this.product.inventoryLocation = this.recipe.storeLocation;
        }
      }
    
  getRecipeList(propertyId: number) {
    this.recipeList = [];
    this.recipeListFilter = [];
    this.loader = true;
    this.recipeService.getAllRecipeByPropertyId(propertyId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.loader = false;

          this.recipeList = data.body;
          this.recipeListFilter = data.body;
        } else {
          this.loader = false;
        }
      },
      (error) => {
        this.loader = false;
      }
    );
  }

    getAllBusinessService() {
        this.loader = true;
        this.productService
            .getAllBusinessServiceByPropertyId(this.token.getPropertyId())
            .subscribe(
                (data) => {
                    this.businessServices = data.body;
                    this.loader = false;

                    if (this.businessServices.length > 0) {
                        this.businessServiceId = this.businessService.id;
                    }

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    setService(serviceId: number) {
        this.businessServiceId = serviceId;
        if (this.businessServiceId != undefined) {
            this.getAllGroupProduct(this.businessServiceId);
        }
    }

    setProduct(productGroupId) {}

    getAllGroupProduct(businessServiceId: number) {
        this.loader = true;
        this.productGroups = [];
        this.productService
            .getProductGroupListByBusinessServiceId(businessServiceId)
            .subscribe(
                (data) => {
                    this.productGroups = data.body;
                    this.productGroupId = this.productGroup.id;
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    async onImageSelect(event) {
        this.imageList = [];
        const loader = await this.loadingCtrl.create({
            duration: 2000,
        });
        loader.present();

        this.loader = true;

        const file1 = event.target.files[0];
        //const file1 = this.uploadedImage

        // file['value'] = (file1) ? file1.name : '';
        this.imagedataModel.receiptFileName = file1.name;
        this.formData = new FormData();
        this.formData.append(
            "file",
            file1,
            this.imagedataModel.receiptFileName
        );

        this.fileService.fileUploadToCloud(this.formData).subscribe(
            (fileUploadResponse) => {
                Logger.log(
                    "fileUploadResponse.status : " +
                        JSON.stringify(fileUploadResponse)
                );
                this.loader = false;
                loader.dismiss();

                this.propertyLogo = fileUploadResponse.url;
                this.image = new RoomImage();
                this.image.url = fileUploadResponse.url;
                this.image.name = fileUploadResponse.name;
                this.image.description = this.product.description;
                this.image.mainImage = false;
                //   this.isImageUploaded = true;

                this.imageList.push(this.image);
            },
            (error) => {
                Logger.log("error : " + JSON.stringify(error));

                if (error instanceof HttpErrorResponse) {
                    this.loader = false;
                    loader.dismiss();
                }
            }
        );
    }

    getAllProductVerfication(productId: number) {
        this.loader = true;
        this.productService.getVarificationList(productId).subscribe(
            (data) => {
                this.productVariations = data.body;
                this.loader = false;

                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    variationFactorCheck() {
        this.productSellUnitPrice = this.product.sellUnitPrice;
        this.getAllProductVerfication(this.product.id);
    }

    sellUnitPriceChange(sellUnitPrice) {
        if (this.productSellUnitPrice != this.product.sellUnitPrice) {
            this.isPriceChange = true;
        }
    }

    update() {
        this.product.imageList = this.imageList;
        if (this.isPriceChange === true) {
            if (
                this.productVariations != null &&
                this.productVariations != undefined &&
                this.productVariations.length > 0
            ) {
                // this.variationNumber = this.productVariations.length;
                for (let i = 0; i < this.productVariations.length; i++) {
                    if (this.product.sellUnitPrice === 0) {
                        this.productVariations[i].factorToProduct = 1;
                        this.finalSellAmount =
                            this.productVariations[i].factorToProduct *
                            this.product.sellUnitPrice;
                        this.productVariations[i].sellUnitPrice =
                            this.finalSellAmount.toFixed(2);
                    } else {
                        this.finalSellAmount =
                            this.productVariations[i].factorToProduct *
                            this.product.sellUnitPrice;
                        this.productVariations[i].sellUnitPrice =
                            this.finalSellAmount.toFixed(2);
                    }
                }

                Logger.log(
                    "  this.productVariations[i] " +
                        JSON.stringify(this.productVariations)
                );

                this.updateProductVeriation(
                    this.productVariations,
                    this.product.id
                );
            } else {
                this.updateProduct(this.product);
            }
        } else {
            this.updateProduct(this.product);
        }
    }

    updateProductVeriation(
        productVariations: ProductVariationDto[],
        productId: number
    ) {
        this.loader = true;
        this.productService
            .updateVariationArrayByProductId(productId, productVariations)
            .subscribe(
                (data) => {
                    Logger.log("data" + JSON.stringify(data));

                    if (data.status === 201) {
                        this.updateProduct(this.product);
                    } else {
                        this.presentToast("Fail");
                    }
                },
                (error) => {
                    // Logger.log(JSON.stringify(error));
                    this.loader = false;
                }
            );
    }

    updateProduct(product: Product) {
        this.loader = true;
        this.productService.updateProduct(product).subscribe(
            (data) => {
                Logger.log("data" + JSON.stringify(data));

                if (data.status === 200) {
                    this.loader = false;
                    this.presentToast("Product updated successfully");
                    this.cancel();
                } else {
                    this.loader = false;
                    this.presentToast("Fail");
                }
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    submit() {
        this.product.imageList = this.imageList;
        this.creatProduct(this.product, this.productGroup.id);
    }

    creatProduct(product: Product, productGroupId: number) {
        this.loader = true;
        this.productService.CreateProduct(product, productGroupId).subscribe(
            (data) => {
                //  Logger.log('data'+JSON.stringify(data));

                if (data.status === 200) {
                    this.loader = false;
                    this.presentToast("Product created successfully");
                    // this.ProductForm.reset();
                    this.cancel();
                } else {
                    this.loader = false;
                    this.presentToast("Fail");
                }
            },
            (error) => {
                // Logger.log(JSON.stringify(error));
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
    cancel() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                //data: JSON.stringify(row),
                serviceId: JSON.stringify(this.businessServiceId),
                groupId: JSON.stringify(this.productGroupId),
            },
        };

        this.router.navigate(["manage-product"], navigationExtras);
        // this.navCtrl.navigateForward("manage-product");
        //    this._location.back();
    }

    clear(event) { }
    applyFilterInventory(ev: any) {
        let filterValue = ev.target.value;
    
        if (filterValue === "") {
          this.inventoryList = this.inventoryListFilter;
          this.isShowInventoryList = false;
          this.changeDetectorRefs.detectChanges();
        } else {
          this.isShowInventoryList = true;
          this.inventoryList = this.inventoryListFilter;
          this.inventoryList = this.inventoryList.filter((item) => {
            const searchResult =
              (item.name != null &&
                item.name.toLowerCase().indexOf(filterValue) > -1) ||
              (item.productCode != null &&
                item.productCode.toLowerCase().indexOf(filterValue) > -1) ||
              (item.catagory != null &&
                item.catagory.toLowerCase().indexOf(filterValue) > -1);
    
            return searchResult;
          });
    
          this.changeDetectorRefs.detectChanges();
        }
      }
    applyFilter(ev: any) {
        let filterValue = ev.target.value;
    
        if (filterValue === "") {
          this.recipeList = this.recipeListFilter;
          this.isShowRecipeList = false;
    
          this.changeDetectorRefs.detectChanges();
        } else {
          this.isShowRecipeList = true;
          this.recipeList = this.recipeListFilter;
    
          this.recipeList = this.recipeList.filter((item) => {
            const searchResult =
              (item.name != null &&
                item.name.toLowerCase().indexOf(filterValue) > -1) ||
              (item.type != null &&
                item.type.toLowerCase().indexOf(filterValue) > -1);
    
            return searchResult;
          });
    
          this.changeDetectorRefs.detectChanges();
        }
    }
    
    onInventorySelected(data) {
        this.inventorySearchResult = "";
        this.product.inventoryId = data.inventoryId;
        this.product.inventoryLocation = data.storeLocation;
        this.isShowInventoryList = false;
    }

    
      setInventory(inventoryId: number) {
        this.inventory = new GroceryProduct();
        if (this.inventoryList != undefined && this.inventoryList != null) {
          this.inventory = this.inventoryList.find(
            (data) => data.inventoryId === inventoryId
          );
          this.product.inventoryLocation = this.inventory.storeLocation;
        }
      }
}
