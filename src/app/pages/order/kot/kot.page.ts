import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { NavController, ToastController } from "@ionic/angular";
import { Recipe } from "src/app/model/inventory/recipe";
import { Order } from "src/app/model/Order/order";
import { DateService } from "src/app/service/DateService/date-service.service";
import { RecipeService } from "src/app/service/inventory/recipe.service";
import { Logger } from "src/app/service/logger.service";
import { OrderService } from "src/app/service/Order/order.service";
import { PaymentService } from "src/app/service/payment/payment.service";
import { TokenStorage } from "src/app/token.storage";

export interface KOTStatus {
    name: string;
    value: number;
  }

@Component({
    selector: "app-kot",
    templateUrl: "./kot.page.html",
    styleUrls: ["./kot.page.scss"],
})
export class KotPage implements OnInit {

    statusList: KOTStatus[] = [
        { name: 'Confirmed', value: 0 },
        { name: 'Cooking', value: 1 },
        { name: 'Ready to Serve', value: 2 },
    ];
    
    kotSelectionName: string = "Confirmed";

    loader: boolean = false;

    items = [];

    item2 = [];
  
    item3 = [];

    orders: Order[];
    ordersFilter: Order[];

    recipe: Recipe;
    recipes: Recipe[] = [];
    order: Order;
    currentDate: string;

    constructor(
        private orderService: OrderService,
        private token: TokenStorage,
        private recipeService: RecipeService,
        private toastController: ToastController,
        private paymentService: PaymentService,
        public datepipe: DatePipe,
        private navCtrl: NavController,
        private dateService: DateService,
        private router: Router,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.order = new Order();
    }

    ngOnInit() {}
    ionViewWillEnter() {
        this.getCurrentTwoDaysOrder(Number(this.token.getPropertyId()));
    }

    getCurrentTwoDaysOrder(propertyId: number) {
        let date = new Date();
        date.setDate(date.getDate() - 1);
    
        let fromdate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
        let todate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
        this.getOrderByPropertyIdAndDateRange(propertyId, fromdate, todate);
    }

    getOrderByPropertyIdAndDateRange(
        propertyId: number,
        formDate: string,
        toDate: string
    ) {
        this.loader = true;
        this.orderService
            .getOrderByPropertyIdAndDateRange(
                String(propertyId),
                formDate,
                toDate
            )
            .subscribe(
                (data) => {
                    this.orders = data.body;
                    this.ordersFilter = data.body;

                    this.orders = this.orders.filter((item) => {

                        const searchResult =
                          item.orderStatus != null &&
                          (item.orderStatus === "Confirmed" ||
                          item.orderStatus === "InProgress" ||
                          item.orderStatus === "ReadyToServe") &&
                          item.kotDtoList != null && item.kotDtoList != undefined && item.kotDtoList.length >0;
             
                       return searchResult;
                     });

                    this.items = this.orders;

                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();
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

    details(row) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(row),
                isUpdateAble: false,
            },
        };

        this.navCtrl.navigateForward(["order-details"], navigationExtras);
    }

   

    onHome() {
        this.navCtrl.navigateRoot(["home"]);
    }

    orderCompleteDialog() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                id: JSON.stringify(this.order.id),
            },
        };
        this.router.navigate(["order-complete"], navigationExtras);
    }

    paymentDetail(order) {
        if (order.deliveryMethod === "Room Order") {
            if (order.paymentId != null && order.paymentId != undefined) {
                this.getPaymentById(order.paymentId);
            }
        } else {
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    id: JSON.stringify(order.id),
                    state: 0,
                },
            };
            this.router.navigate(["order-payment-details"], navigationExtras);
        }
    }

    getPaymentById(id: number) {
        this.loader = true;
        this.paymentService.findPaymentById(id).subscribe(
            (data) => {
                this.loader = false;
                if (data.body != null) {
                    this.onPaymentDetail(data.body);
                }
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    onPaymentDetail(payment) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                paymentOb: JSON.stringify(payment),
                permission: 3,
            },
        };

        this.navCtrl.navigateForward(["manage-payment"], navigationExtras);
    }

    getKotList(kotDtoList,index)
    {
      if (kotDtoList != null && kotDtoList != undefined && kotDtoList.length > 0)
      {
          if (index === 0)
          {
            return this.items =  kotDtoList.filter((item) => {
  
                const searchResult =
                  this.getKotOrderLinebyStatus(item.orderLines,index).length > 0;
  
                return searchResult;
              });
          }else  if (index === 1)
          {
            return this.item2 =  kotDtoList.filter((item) => {
  
              const searchResult =
                this.getKotOrderLinebyStatus(item.orderLines,index).length > 0;
  
              return searchResult;
            });
          }
          else  if (index === 2)
          {
            return this.item3 =  kotDtoList.filter((item) => {
  
              const searchResult =
                this.getKotOrderLinebyStatus(item.orderLines,index).length > 0;
  
              return searchResult;
            });
          }
      }
      else
      {
        return [];
      }
    }

    getKotOrderLinebyStatus(orderLinesItem, index)
    {
      if (orderLinesItem != null && orderLinesItem != undefined && orderLinesItem.length > 0)
      {
  
        if (index === 0)
        {
           return orderLinesItem.filter((item) => {
  
              const searchResult =
                this.checkStatus(item).indexOf("Available") > -1;
  
              return searchResult;
            });
        }else  if (index === 1)
        {
           return orderLinesItem.filter((item) => {
  
              const searchResult =
                this.checkStatus(item).indexOf("Cooking") > -1;
  
              return searchResult;
            });
        }
        else  if (index === 2)
        {
           return orderLinesItem.filter((item) => {
  
              const searchResult =
                this.checkStatus(item).indexOf("Ready to Serve") > -1;
  
              return searchResult;
            });
        }
        else  if (index === 3)
        {
           return orderLinesItem.filter((item) => {
  
              const searchResult =
                this.checkStatus(item).indexOf("Served") > -1;
  
              return searchResult;
            });
        }
  
      }
      else
      {
        return [];
      }
    }

    checkStatus(product) {
        if (
          product.status === null ||
          product.status === undefined ||
          product.status === ""
        ) {
          return (product.status = "Available");
        }
    
        return product.status;
      }
  
}
