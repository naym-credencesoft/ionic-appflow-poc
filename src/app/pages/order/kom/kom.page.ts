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


@Component({
  selector: 'app-kom',
  templateUrl: './kom.page.html',
  styleUrls: ['./kom.page.scss'],
})
export class KomPage implements OnInit {

    kotSelectionName: string = "Confirmed";

    loader: boolean = false;

    items = [];

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
        date.setDate(date.getDate() - 2);

        let fromdate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(date);

        let todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date()
        );
        this.getOrderByPropertyIdAndDateRange(propertyId, todate, todate);
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

                    this.currentDate =
                        this.dateService.convertMillisecondsToYYYMMDDFormat(
                            new Date()
                        );

                    // this.orders = this.orders.filter((item) => {
                    //     const searchResult = (
                    //       (item.orderedDate != null && this.dateService.convertMillisecondsToYYYMMDDFormat(item.orderedDate).indexOf( this.currentDate.trim()) > -1)
                    //       ||
                    //       (item.requiredDate != null && this.dateService.convertMillisecondsToYYYMMDDFormat(item.requiredDate).indexOf( this.currentDate.trim()) > -1)
                    //     )

                    //     return searchResult;
                    //   })

                    this.items = this.orders;
                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    onChangeStatusByIndex(index: number, orderOb: any) {
        if (index === 0) {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "Confirmed");
        } else if (index === 1) {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "InProgress");
        } else if (index === 2) {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "ReadyToServe");
        } else if (index === 3) {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "Served");
        } else if (index === 4) {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "OutForDelivery");
        } else if (index === 5) {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "Shipped");
        } else if (index === 6) {
            this.order = orderOb;
            this.orderCompleteDialog();
            // this.updateOrderStatus2(this.order, "Completed");
        }
    }

    onChangeStatusByStatus(currentStatus: string, orderOb: any) {
        if (currentStatus === "Confirmed") {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "InProgress");
        } else if (currentStatus === "InProgress") {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "ReadyToServe");
        } else if (currentStatus === "ReadyToServe") {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "Served");
        } else if (currentStatus === "Served") {
            this.order = orderOb;
            this.orderCompleteDialog();
            //this.updateOrderStatus2(this.order, "Completed");
        } else if (currentStatus === "Completed") {
            this.order = orderOb;
            this.updateOrderStatus2(this.order, "Confirmed");
        }
    }

    updateOrderStatus2(order: Order, orderStatus: string) {
        this.loader = true;
        this.orderService.updateOrderStatus(order.id, orderStatus).subscribe(
            (data) => {
                this.loader = false;

                this.presentToast("Order status change successfully");
                this.getCurrentTwoDaysOrder(Number(this.token.getPropertyId()));
                if (orderStatus != "Completed") {
                    this.kotSelectionName = orderStatus;
                }

                if (orderStatus === "Completed") {
                    this.orderLineReceipeInvetoryUpdate(this.order);
                }

                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    // updateOrderStatus(orderId: number, orderStatus : string) {
    //   this.loader = true;
    //   this.orderService.updateOrderStatus(orderId, orderStatus).subscribe(data => {
    //     this.loader = false;
    //     this.presentToast('Order status update successfully');
    //     this.changeDetectorRefs.detectChanges();
    //   }, error => {
    //     this.loader = false;
    //   });
    // }

    change() {}

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

    isMatch(item, status) {
        if (item.orderStatus.toLowerCase() === status.toLowerCase()) {
            return true;
        } else {
            return false;
        }
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

    orderLineReceipeInvetoryUpdate(order: Order) {
        this.recipes = [];
        if (
            order.orderLineDtoList != null &&
            order.orderLineDtoList != undefined &&
            order.orderLineDtoList.length > 0
        ) {
            for (let i = 0; i < order.orderLineDtoList.length; i++) {
                if (
                    order.orderLineDtoList[i].recipeId != null &&
                    order.orderLineDtoList[i].recipeId != undefined
                ) {
                    this.recipe = new Recipe();
                    this.recipe.id = order.orderLineDtoList[i].recipeId;
                    this.recipe.quantity =
                        order.orderLineDtoList[i].unitsInOrder;
                    this.recipes.push(this.recipe);
                } else if (
                    order.orderLineDtoList[i].inventoryId != null &&
                    order.orderLineDtoList[i].inventoryId != undefined
                ) {
                    this.recipe = new Recipe();
                    this.recipe.inventoryId =
                        order.orderLineDtoList[i].inventoryId;
                    this.recipe.quantity =
                        order.orderLineDtoList[i].unitsInOrder;
                    this.recipes.push(this.recipe);
                }
            }
        }

        if (this.recipes.length > 0) {
            this.loader = true;
            this.recipeService.updateInventoryByReceipe(this.recipes).subscribe(
                (data) => {
                    this.loader = false;
                    this.presentToast("Recipe inventory updated successfully");
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
        }
    }
}
