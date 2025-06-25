import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AlertController, IonRouterOutlet, ModalController, NavController, ToastController } from "@ionic/angular";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { OrderService } from "src/app/service/Order/order.service";
import { PaymentService } from "src/app/service/payment/payment.service";
import { Order } from "../../../model/Order/order";
import { DateService } from "../../../service/DateService/date-service.service";
import { Logger } from "../../../service/logger.service";
import { TokenStorage } from "../../../token.storage";
import {
    Available_Status,
    CompletedStatus,
    Cooking_Status,
    OutOfStock_Status,
    PaidButOutOfStock_Status,
    ReadytoServe_Status,
    ServedStatus,
} from "../status";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { ActionOrderMenuComponent } from "src/app/component/Order/action-order-menu/action-order-menu.component";

@Component({
    selector: "app-order-details",
    templateUrl: "./order-details.page.html",
    styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit {
    Available_Status: string = Available_Status;
    OutOfStock_Status: string = OutOfStock_Status;
    PaidButOutOfStock_Status: string = PaidButOutOfStock_Status;
    Cooking_Status: string = Cooking_Status;
    ReadytoServe_Status: string = ReadytoServe_Status;
    ServedStatus: string = ServedStatus;
    CompletedStatus: string = CompletedStatus;

    order: Order;
    address: any;
    loader = false;
    data: number;
    payments: Payment[] = [];
    paymentsFilter: Payment[] = [];
    paymentDTO: Payment;
    paymentDetails: any = {};
    customerAddress: any;
    isPaidOrder: boolean = false;
    isCalculatePriceAvailable: boolean = false;
    currency: any;
    userData: ApplicationUser;
    isProductStatusDisabled: boolean = false;
    total: number = 0;
    subTotalAmount: number = 0;
    constructor(
        private acRoute: ActivatedRoute,
        private toastController: ToastController,
        public token: TokenStorage,
        private paymentService: PaymentService,
        private navCtrl: NavController,
        private locationBack: Location,
        private orderService: OrderService,
        private routerOutlet: IonRouterOutlet,
        public alertController: AlertController,
        private changeDetectorRefs: ChangeDetectorRef,
        public dateService: DateService,
        private authService: AuthService,
        private modalController: ModalController,
        private router: Router
    ) {
        this.userData = new ApplicationUser();
        this.order = new Order();
        this.paymentDTO = new Payment();
    }

    ngOnInit() {
        this.getUserData();
        this.acRoute.queryParams.subscribe((params) => {
            this.currency = this.token
                .getProperty()
                .localCurrency.toUpperCase();

            if (params["order"] != undefined) {
                this.order = JSON.parse(params["order"]);
                this.address = this.token.getProperty().address;

                this.getOrderDetailsById(this.order.id);
            } else if (params["orderId"] != undefined) {
                this.loader = true;

                this.order.id = params["orderId"];
                this.getOrderDetailsById(this.order.id);
            }

            if (params["isUpdateAble"] != undefined) {
                // this.order = JSON.parse(params['isUpdateAble']);
                Logger.log("order update able");
                this.isProductStatusDisabled = true;
            }
        });

       
  
    }

    getUserData() {
        this.loader = true;
        const UserId = this.token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(data => {
          this.userData = data.body;
          this.loader = false;
          this.changeDetectorRefs.detectChanges();
    
        }, error => {
          this.loader = false;
        });
    
      }

    isShowToKitchen(product) {
        if (
            this.checkStatus(product) === this.OutOfStock_Status ||
            this.checkStatus(product) === this.PaidButOutOfStock_Status
        ) {
            return false;
        } else {
            return true;
        }
    }

    async changeStatus(product) {
        if (this.isPaidOrder === false) {
            this.onChangeStatusNotPaid(product);
        } else if (this.isPaidOrder === true) {
            this.onChangeStatusPaid(product);
        }
    }

    async changeStatusKitchen(product) {
        const alert = await this.alertController.create({
            cssClass: "my-custom-class",
            header: "Change Status",
            inputs: [
                {
                    name: this.Cooking_Status,
                    type: "radio",
                    label: this.Cooking_Status,
                    value: this.Cooking_Status,
                    handler: () => {
                        Logger.log("Radio 2 selected");
                    },
                },
                {
                    name: this.ReadytoServe_Status,
                    type: "radio",
                    label: this.ReadytoServe_Status,
                    value: this.ReadytoServe_Status,
                    handler: () => {
                        Logger.log("Radio 2 selected");
                    },
                },
                {
                    name: this.ServedStatus,
                    type: "radio",
                    label: this.ServedStatus,
                    value: this.ServedStatus,
                    handler: () => {
                        Logger.log("Radio 2 selected");
                    },
                },
                {
                    name: this.CompletedStatus,
                    type: "radio",
                    label: this.CompletedStatus,
                    value: this.CompletedStatus,
                    handler: () => {
                        Logger.log("Radio 2 selected");
                    },
                },
            ],
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {
                        Logger.log("Confirm Cancel");
                    },
                },
                {
                    text: "Ok",
                    handler: (data) => {
                        Logger.log(
                            "OK clicked. Data -> " + JSON.stringify(data)
                        );
                        product.status = data;

                        this.productStatusChangeKitchen(product);
                    },
                },
            ],
        });

        await alert.present();
    }

    async onChangeStatusNotPaid(product) {
        const alert = await this.alertController.create({
            cssClass: "my-custom-class",
            header: "Change Status",
            inputs: [
                {
                    name: "AVAILABLE",
                    type: "radio",
                    label: this.Available_Status,
                    value: this.Available_Status,
                    handler: () => {
                        Logger.log("Radio 1 selected");
                    },
                    checked: true,
                },
                {
                    name: "OUTOFSLOCT",
                    type: "radio",
                    label: this.OutOfStock_Status,
                    value: this.OutOfStock_Status,
                    handler: () => {
                        Logger.log("Radio 2 selected");
                    },
                },
            ],
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {
                        Logger.log("Confirm Cancel");
                    },
                },
                {
                    text: "Ok",
                    handler: (data) => {
                        Logger.log(
                            "OK clicked. Data -> " + JSON.stringify(data)
                        );
                        product.status = data;

                        this.productStatusChange(product);
                    },
                },
            ],
        });

        await alert.present();
    }
    async onChangeStatusPaid(product) {
        const alert = await this.alertController.create({
            cssClass: "my-custom-class",
            header: "Change Status",
            inputs: [
                {
                    name: "AVAILABLE",
                    type: "radio",
                    label: this.Available_Status,
                    value: this.Available_Status,
                    handler: () => {
                        Logger.log("Radio 1 selected");
                    },
                    checked: true,
                },
                {
                    name: "OUTOFSLOCTPaid",
                    type: "radio",
                    label: this.PaidButOutOfStock_Status,
                    value: this.PaidButOutOfStock_Status,
                    handler: () => {
                        Logger.log("Radio 2 selected");
                    },
                },
            ],
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {
                        Logger.log("Confirm Cancel");
                    },
                },
                {
                    text: "Ok",
                    handler: (data) => {
                        Logger.log(
                            "OK clicked. Data -> " + JSON.stringify(data)
                        );
                        product.status = data;

                        this.productStatusChange(product);
                    },
                },
            ],
        });

        await alert.present();
    }

    getOrderDetailsById(id: number) {
        this.orderService
            .findById(id)
            .toPromise()
            .then((resp) => {
                this.order = resp.body;


                if (this.order.deliveryMethod != "Room Order") {
                    if (
                      this.order.bookOneOrderId != null &&
                      this.order.bookOneOrderId != undefined
                    ) {
                      this.getPaymentByRevId(this.order.bookOneOrderId);
                    }
                  } else {
                    if (
                      this.order.paymentId != null &&
                      this.order.paymentId != undefined
                    ) {
                      this.getPaymentById(this.order.paymentId);
                    }
                  }
                this.customerAddress = this.order.shipToAddress;

                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            })
            .catch((e) => {
                this.loader = false;
                Logger.error("Error getting Order by ID", id, e);
                this.router.navigate(["manage-order"]);
            });
    }

    getPaymentByRevId(revId: string) {
        this.loader = true;
        this.paymentService.findPaymentByReferenceNumber(revId).subscribe(
            (data) => {
                if (data.length > 0) {
                    this.payments = data;
                    
                    this.paymentsFilter = data;
   
                    this.paymentDTO = data[data.length - 1];
                    console.log("payments",this.paymentDTO.paymentMode)
                    this.paymentDetails = this.paymentDTO.paymentMode;
                    this.loader = false;
                    if (this.paymentDTO.status === "Paid") {
                        this.isPaidOrder = true;
                    } else {
                        this.isPaidOrder = false;
                    }
                    this.changeDetectorRefs.detectChanges();
                }
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    ceckModeOfpayment(mode) {
        if (mode != null && mode != undefined && mode === "Credit") {
          return "BillToCompany";
        } else {
          return mode;
        }
      }

    getPaymentById(id: number) {
        this.loader = true;
        this.paymentService.findPaymentById(id).subscribe(
          (data) => {
            this.loader = false;
    
            this.payments = [];
            this.paymentsFilter = [];
    
            if (data.body != null) {
              this.paymentDTO = data.body;
    
              this.payments.push(this.paymentDTO);
              this.paymentsFilter.push(this.paymentDTO);
    
              if (this.paymentDTO.status === "Paid") {
                this.isPaidOrder = true;
              } else {
                this.isPaidOrder = false;
              }
            }
          },
          (error) => {
            this.loader = false;
          }
        );
      }

      calculateTotalProductAmount() {
        let total = 0;
        if (
          this.order.orderLineDtoList != null &&
          this.order.orderLineDtoList != undefined
        ) {
          for (let i = 0; i < this.order.orderLineDtoList.length; i++) {
            if (
              this.order.orderLineDtoList[i].status === undefined ||
              this.order.orderLineDtoList[i].status === null ||
              this.order.orderLineDtoList[i].status != this.OutOfStock_Status
              // (this.order.orderLineDtoList[i].status !=
              // this.PaidButOutOfStock_Status ||
              // this.order.orderLineDtoList[i].status ===
              // this.PaidButOutOfStock_Status)
            ) {
              if (
                this.order.orderLineDtoList[i].discountedPrice != null &&
                this.order.orderLineDtoList[i].discountedPrice != undefined &&
                this.order.orderLineDtoList[i].discountedPrice >= 0 &&
                this.order.orderLineDtoList[i].discountInPercentage > 0
              ) {
                total =
                  total +
                  this.order.orderLineDtoList[i].discountedPrice *
                  this.order.orderLineDtoList[i].unitsInOrder;
              } else {
                total =
                  total +
                  this.order.orderLineDtoList[i].sellUnitPrice *
                  this.order.orderLineDtoList[i].unitsInOrder;
              }
            }
          }
        }
    
        this.total = total;
        this.calculateSubTotal();
        return total;
      }

    getCustomerAddress(customerID: string) {
        this.orderService.getAddress(customerID).subscribe(
            (response) => {
                if (response.body != null) {
                    this.customerAddress = response.body;

                    this.changeDetectorRefs.detectChanges();
                }
            },
            (error) => {
                Logger.log("error " + JSON.stringify(error));
            }
        );
    }

    // calculateSubTotal() {
    //     let subTotal = 0;
    //     if (
    //         this.order.orderLineDtoList != null &&
    //         this.order.orderLineDtoList != undefined
    //     ) {
    //         for (let i = 0; i < this.order.orderLineDtoList.length; i++) {
    //             if (
    //                 this.order.orderLineDtoList[i].status === undefined ||
    //                 this.order.orderLineDtoList[i].status === null ||
    //                 this.order.orderLineDtoList[i].status ===
    //                     this.Available_Status ||
    //                 this.order.orderLineDtoList[i].status ===
    //                     this.PaidButOutOfStock_Status
    //             ) {
    //                 if (
    //                     this.order.orderLineDtoList[i].discountedPrice !=
    //                         null &&
    //                     this.order.orderLineDtoList[i].discountedPrice !=
    //                         undefined &&
    //                     this.order.orderLineDtoList[i].discountedPrice > 0
    //                 ) {
    //                     subTotal =
    //                         subTotal +
    //                         this.order.orderLineDtoList[i].discountedPrice *
    //                             this.order.orderLineDtoList[i].unitsInOrder;
    //                 } else {
    //                     subTotal =
    //                         subTotal +
    //                         this.order.orderLineDtoList[i].sellUnitPrice *
    //                             this.order.orderLineDtoList[i].unitsInOrder;
    //                 }
    //             }
    //         }
    //     }

    //     this.order.subTotalAmount = subTotal;

    //     return subTotal;
    // }

    calculateSubTotal() {
    
        let subTotal = 0;
        subTotal =
          this.total +
          this.order.serviceChargeAmount -
          this.order.discountAmount -
          this.getRefundAmount();
    
        this.order.subTotalAmount = subTotal;
        this.subTotalAmount = Math.round(subTotal);
       // this.calculateTaxSlab();
        return this.subTotalAmount;
      }

      getRefundAmount() {
        if (
          this.order.refundAmount != null &&
          this.order.refundAmount != undefined
        ) {
          return this.order.refundAmount;
        } else {
          return 0;
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

    productStatusChange(product) {
        this.updateOrderLineStatus(product.id, product.status);
    }

    updateOrderLineStatus(orderLineId: number, orderStatus: string) {
        this.loader = true;
        this.orderService
            .updateOrderLineStatus(orderLineId, orderStatus)
            .subscribe(
                (data) => {
                    this.loader = false;
                    this.isCalculatePriceAvailable = true;
                    this.getOrderDetailsById(this.order.id);
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    productStatusChangeKitchen(product) {
        this.updateOrderLineStatusKitchen(product.id, product.status);
    }

    updateOrderLineStatusKitchen(orderLineId: number, orderStatus: string) {
        this.loader = true;
        this.orderService
            .updateOrderLineStatus(orderLineId, orderStatus)
            .subscribe(
                (data) => {
                    this.loader = false;
                    //this.getOrderDetailsById(this.order.id);
                    this.locationBack.back();
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    onBack()
    { 
        this.locationBack.back(); 
    }
    
    UpdateOrder() {
        this.isCalculatePriceAvailable = false;
        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(this.order),
                itemUpdate: true,
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
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

    onUpdate() {

        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(this.order),
                orderStatusone: "Update",
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }

    onConvert() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(this.order),
                isConvertOrder : true,
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }

    onConfirmOrder() {
        this.getConfirmOrderByTimeId(this.order.id);
    }

    getConfirmOrderByTimeId(orderId: number) {
        this.loader = true;
        this.orderService.getConfirmOrderByOrderId(orderId).subscribe(
            (data) => {
                this.loader = false;

                if (
                    data.body != null &&
                    data.body != undefined &&
                    data.body.message != null
                ) {
                    this.presentToast(data.body.message);
                } else {
                    this.presentToast("Order confirmed successfully");
                }

                this.getOrderDetailsById(this.order.id);

                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    async onMenu(row) {
        const modal = await this.modalController.create({
            component: ActionOrderMenuComponent,
            cssClass: "my-custom-class",
            swipeToClose: true,
            componentProps: {
                order: row,
            },
            presentingElement: this.routerOutlet.nativeEl,
        });

        modal.onDidDismiss().then((data) => {
            if (data != undefined && data != null && data.data === "done") {
                this.getOrderDetailsById(this.order.id);
            }
        });
        return await modal.present();
    }

    getTotalRoomBill() {
        return this.getTotalPaymentAmountByMOP("BillToRoom");
    }

    getTotalPaymentAmountByMOP(paymentMode: string) {
        let sum = 0;
    
        if (
          this.getPaymentDataByModeOfPayment(paymentMode) != null &&
          this.getPaymentDataByModeOfPayment(paymentMode) != undefined &&
          this.getPaymentDataByModeOfPayment(paymentMode).length > 0
        ) {
          for (
            let i = 0;
            i < this.getPaymentDataByModeOfPayment(paymentMode).length;
            i++
          ) {
            sum =
              sum +
              this.getPaymentDataByModeOfPayment(paymentMode)[i].transactionAmount;
          }
        }
        return sum;
    }

    getPaymentDataByModeOfPayment(paymentMode: string) {
        let orderData = [];
        if (
          this.paymentsFilter != null &&
          this.paymentsFilter != undefined &&
          this.paymentsFilter.length > 0
        ) {
          orderData = this.paymentsFilter.filter((item) => {
            const searchResult =
              item.paymentMode != null && item.paymentMode === paymentMode;
    
            return searchResult;
          });
        }
    
        return orderData;
    }
    
    getTotalCreditBill() {
        return this.getTotalPaymentAmountByMOP("Credit");
      }
    
    

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
}
