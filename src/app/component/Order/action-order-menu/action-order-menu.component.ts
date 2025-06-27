import { PaymentService } from "src/app/service/payment/payment.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import {
    ModalController,
    LoadingController,
    NavController,
    ToastController,
    AlertController,
    IonRouterOutlet,
} from "@ionic/angular";
import { Order } from "src/app/model/Order/order";
import { OrderService } from "src/app/service/Order/order.service";
import { TokenStorage } from "src/app/token.storage";
import { AUDIT_ORDER_CANCEL, AUDIT_ORDER_DELETE } from "src/app/app.component";
import { DateService } from "src/app/service/DateService/date-service.service";
import { PropertyService } from "src/app/service/property/property.service";
import { Audit } from "src/app/service/audit";
import { CancelOrderModalComponent } from "../../cancel-order-modal/cancel-order-modal.component";
import { OrderEventsService } from "src/app/service/order-events.service";

@Component({
    selector: "app-action-order-menu",
    templateUrl: "./action-order-menu.component.html",
    styleUrls: ["./action-order-menu.component.scss"],
})
export class ActionOrderMenuComponent implements OnInit {
    loader: boolean = false;
    order: Order;
    role: any[];
     audit: Audit;

    constructor(
        public modalController: ModalController,
        private router: Router,
        private paymentService: PaymentService,
        private changeDetectorRefs: ChangeDetectorRef,
        private orderService: OrderService,
        private token: TokenStorage,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        private toastController: ToastController,
        private alertCtrl: AlertController,
        private dateService: DateService,
        private propertyService: PropertyService,
        private modalCtrl: ModalController,
          private orderEvents: OrderEventsService
    ) {
        this.order = new Order();
        this.audit = new Audit();
    }

    ngOnInit() {}

    close() {
        this.modalController.dismiss();
    }

    closeSuccessDialog() {
        this.modalController.dismiss("done");
    }

    onDetails() {
        this.close();
        const navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(this.order),
            },
        };

        this.navCtrl.navigateForward(["order-details"], navigationExtras);
    }

    onConvert() {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(this.order),
                isConvertOrder : true,
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }

    onUpdate() {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(this.order),
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }

    onConfirmOrder() {
        this.getConfirmOrderByTimeId(this.order.id);
    }

    onCancel() {
        this.getCancelOrderByTimeId(this.order);
    }

    orderCompleteDialog() {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                id: JSON.stringify(this.order.id),
            },
        };
        this.router.navigate(["order-complete"], navigationExtras);
    }

    onAuditReportClick() {
        
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(this.order.id),
                
            },
        };

        this.router.navigate(["audit-report-order"], navigationExtras);
        this.close();
    }

    paymentDetail() {
        this.close();
        if (this.order.deliveryMethod === "Room Order") {
            if (
                this.order.paymentId != null &&
                this.order.paymentId != undefined
            ) {
                this.getPaymentById(this.order.paymentId);
            }
        } else {
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    id: JSON.stringify(this.order.id),
                    state: 0,
                },
            };
            this.router.navigate(["order-payment-details"], navigationExtras);
        }
    }
        getCancelOrderByTimeId(order: Order) {
        this.loader = true;
        this.orderService.getOrderCancelByOrderId(order.id).subscribe(
            (data) => {
                this.loader = false;
                this.presentToast("Order Cancelled successfully");
                this.createAuditReport(order, AUDIT_ORDER_CANCEL);
                this.closeSuccessDialog();
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
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
                id: JSON.stringify(this.order.id),
                state: 0,
            },
        };

        this.navCtrl.navigateForward(["order-payment-details"], navigationExtras);
    }

    onChangeStatus(index: number) {
        if (index === 0) {
            this.updateOrderStatus(this.order.id, "Confirmed");
        } else if (index === 1) {
            this.updateOrderStatus(this.order.id, "InProgress");
        } else if (index === 2) {
            this.updateOrderStatus(this.order.id, "ReadyToServe");
        } else if (index === 3) {
            this.updateOrderStatus(this.order.id, "Served");
        } else if (index === 4) {
            this.updateOrderStatus(this.order.id, "OutForDelivery");
        } else if (index === 5) {
            this.updateOrderStatus(this.order.id, "Shipped");
        } else if (index === 6) {
            this.updateOrderStatus(this.order.id, "Completed");
        }
    }

    updateOrderStatus(orderId: number, orderStatus: string) {
        this.loader = true;
        this.orderService.updateOrderStatus(orderId, orderStatus).subscribe(
            (data) => {
                this.loader = false;

                this.presentToast("Order status updated successfully");
                //   if(orderStatus ==='Completed')
                //   {
                //     this.order.invoiceId = data.body.invoiceId;
                //     this.orderLineReceipeInvetoryUpdate(this.order);
                //     if(this.order.invoiceId != null && this.order.mobile != null)
                //     {
                //       this.sendConfirmationMessage(this.order);
                //     }
                //   }
                this.closeSuccessDialog();
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    // getCancelOrderByTimeId(order: Order) {
    //     this.loader = true;
    //     this.orderService.getOrderCancelByOrderId(order.id).subscribe(
    //         (data) => {
    //             this.loader = false;
    //             this.presentToast("Order Cancelled successfully");
    //             this.createAuditReport(order, AUDIT_ORDER_CANCEL);
    //             this.closeSuccessDialog();
    //             this.changeDetectorRefs.detectChanges();
    //         },
    //         (error) => {
    //             this.loader = false;
    //         }
    //     );
    // }
async openCancelModal(order: any) {
       this.close();
  const modal = await this.modalCtrl.create({
    component: CancelOrderModalComponent,
    componentProps: {
      order: order,
       updatedBy: this.order.operatorName,
    },
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();

  if (data?.reason) {
    this.getCancelOrderById(order);

  }
  this.close();
}

  getCancelOrderById(row) {
    this.loader = true;
    this.orderService.getOrderCancelByOrderId(row.id).subscribe(
      (data) => {
        this.loader = false;
                this.presentToast("Order cancelled successfully");
        // this.openSuccessSnackBar("Order cancelled successfully");
                        this.orderEvents.notifyOrderUpdated(); // ✅ Notify;
        this.createAuditReport(row, AUDIT_ORDER_CANCEL);
             this.closeSuccessDialog();
                this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );

  }
    createAuditReport(currentOrder : Order, operationType : string)
  {
    this.role = [];
    JSON.parse(this.token.getRole()).forEach((item) => {
      this.role.push(item);
    });

    let audit = new Audit();

    audit.auditType = operationType;
    audit.orderId = currentOrder.id;
    audit.propertyId = currentOrder.propertyId;
    audit.role = this.role[0];
    audit.updatedAt = new Date().getTime().toString();
    audit.updatedBy = this.audit.updateType;
    audit.reservationId = currentOrder.bookOneOrderId;

    if (AUDIT_ORDER_CANCEL === operationType)
    {
      audit.previousValue = "";
      audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount}.`;
      audit.operatorNotes = currentOrder.operatorNotes;
      audit.updateType = "Order Cancel";
    }
    else  if (AUDIT_ORDER_DELETE === operationType)
    {
      audit.previousValue = "";
      audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount}.`;
      audit.operatorNotes = this.audit.operatorNotes;
      audit.updateType = "Order Delete";
    }

    this.loader = true;
    this.propertyService.createAuditReport(audit).subscribe(
      (data) => {
        this.loader = false;
        // this.dialogRef.close({ event: "success" });
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );
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

                this.closeSuccessDialog();

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
}
