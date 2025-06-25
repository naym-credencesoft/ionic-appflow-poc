import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
    IonRouterOutlet,
    ModalController,
    ToastController,
    NavController,
    ActionSheetController,
} from "@ionic/angular";
import { CheckUserType } from "src/app/model/checkUserType";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { Order } from "src/app/model/Order/order";
import { Property } from "src/app/model/property/Property";
import { ApplicationUser } from "src/app/model/user";
import { DateService } from "src/app/service/DateService/date-service.service";
import { RecipeService } from "src/app/service/inventory/recipe.service";
import { OrderService } from "src/app/service/Order/order.service";
import { PaymentService } from "src/app/service/payment/payment.service";
import { TokenStorage } from "src/app/token.storage";
import { Location } from "@angular/common";
import { Recipe } from "src/app/model/inventory/recipe";
import { CUSTOMER_APP_URL, SMS_NUMBER } from "src/app/app.component";
import { Msg } from "src/app/model/manage-booking/Msg/Msg";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "src/app/service/NotificationService/notification.service";
import { InvoiceService } from "src/app/service/invoice/invoice.service";
import { Invoice } from "src/app/model/invoice/invoice";
import { ServedStatus } from "../status";
import { Components } from "src/app/model/components";
import { LanguageService } from "src/app/model/language";
import { Para } from "src/app/model/parameters";
import { Images } from "src/app/model/image";
import { Template } from "src/app/model/template";
import { WhatsappDto } from "src/app/model/whatsappDto";
import { SubscriptionList } from "src/app/model/business-service/subscriptionList";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";


@Component({
    selector: "app-order-complete",
    templateUrl: "./order-complete.page.html",
    styleUrls: ["./order-complete.page.scss"],
})
export class OrderCompletePage implements OnInit {
    loader: boolean = false;

    payments: Payment[] = [];
    paymentsFilter: Payment[] = [];
    paymentsPaid: Payment[] = [];
    paymentDTO: Payment;

    user: ApplicationUser;
    subscriptionSelected: any[];
    order: Order;

    checkUserType: CheckUserType;
    role: any[];

    isAdmin: boolean = false;
    propertyId: number;
    localCurrency: string;
    property: Property;

    isPropAdmin: boolean = false;
    bookoneOrderId: any;
    components:Components[];
    language:LanguageService;
      parametertype:Para;
      parametertype2:Para;
     images:Images;
      template :Template;
     componentstype:Components;
     componentstype2:Components;
    whatsappForm:WhatsappDto;
    parameterss:Para[];
    parameterss2:Para[];
    isSendWpInvoice: boolean;
    recipe: Recipe;
    recipes: Recipe[] = [];
    invoice: Invoice;

    constructor(
        private orderService: OrderService,
        private routerOutlet: IonRouterOutlet,
        private router: Router,
        private invoiceService : InvoiceService,
        private notificationService: NotificationService,
        private paymentService: PaymentService,
        private recipeService: RecipeService,
        private locationBack: Location,
        private bookingService :BookingService,
        public token: TokenStorage,
        private modalController: ModalController,
        private toastController: ToastController,
        private navCtrl: NavController,
        private acRoute: ActivatedRoute,
        
        private actionSheetController: ActionSheetController,
        public dateService: DateService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.checkUserType = new CheckUserType();
        this.property = new Property();
        this.order = new Order();
        this.paymentDTO = new Payment();
        this.invoice = new Invoice();
        this.template =new Template()
        this.language = new LanguageService();
        this.componentstype2 = new Components();
        this.images = new Images();
        this.components = [];
    
        this.parameterss =[];
        this.parameterss2 =[];
        this.parametertype = new Para();
        this.parametertype2 = new Para();
        this.componentstype = new Components();
        this.whatsappForm = new WhatsappDto();
    }

    ngOnInit() {
        this.propertyId = Number(this.token.getPropertyId());
        this.getSubscriptionForProperty(this.propertyId);
        this.acRoute.queryParams.subscribe((params) => {
            if (params["id"] != undefined) {
                this.bookoneOrderId = JSON.parse(params["id"]);
                this.getOrderDetailsById(this.bookoneOrderId);
            }
        });
       
    }
     

    // navigateToPage() {
    //     this.navCtrl.navigateForward('/home');
    //   }

    cancel() {
        this.locationBack.back();
    }
    getSubscriptionForProperty(propertyId: number) {
        this.bookingService
          .getPropertySubcription(String(propertyId))
          .subscribe(
            (data) => {
              this.subscriptionSelected = data;
    
              if (
                this.subscriptionSelected != null &&
                this.subscriptionSelected != undefined &&
                this.subscriptionSelected.length > 0
              ) {
                for (let i = 0; i < this.subscriptionSelected.length; i++) {
                  if (
                    this.subscriptionSelected[i].name === "WhatsApp Order Invoices"
                  ) {
                    this.isSendWpInvoice = true;
                  }
    
                }
              }
    
              this.changeDetectorRefs.detectChanges();
            },
            (error) => {}
          );
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

                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            })
            .catch((e) => {
                this.loader = false;
            });
    }

    getPaymentById(id: number) {
        this.loader = true;
        this.paymentService.findPaymentById(id).subscribe(
            (data) => {
                this.loader = false;
                if (data.body != null) {
                    this.paymentDTO = data.body;
                }
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    getPaymentByRevId(revId: string) {
        this.loader = true;
        this.paymentService.findPaymentByReferenceNumber(revId).subscribe(
            (data) => {
                if (data.length > 0) {
                    this.payments = data;
                    this.paymentsFilter = data;

                    this.paymentsPaid = this.payments.filter((item) => {
                        const searchResult =
                            item.status != null &&
                            item.status.toLocaleLowerCase() === "paid";

                        return searchResult;
                    });
                }
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    getPaidAmount() {
        let sum = 0;

        if (this.order.deliveryMethod === "Room Order") {
            if (this.paymentDTO.status === "Paid") {
                sum = this.paymentDTO.transactionAmount;
            } else {
                sum = 0;
            }
        } else {
            for (let i = 0; i < this.paymentsPaid.length; i++) {
                sum = sum + this.paymentsPaid[i].transactionAmount;
            }
        }

        return sum;
    }

    getBillToCompanyAmount() {
        let sum = 0;
        for (let i = 0; i < this.payments.length; i++) {
            if (
                this.payments[i].paymentMode === "Credit" &&
                this.payments[i].status != null &&
                this.payments[i].status.toLowerCase() === "paid"
            ) {
                sum = sum + this.payments[i].transactionAmount;
            }
        }

        return sum;
    }

    getBillToRoomAmount() {
        let sum = 0;
        for (let i = 0; i < this.payments.length; i++) {
            if (
                this.payments[i].paymentMode === "BillToRoom" &&
                this.payments[i].status != null &&
                this.payments[i].status.toLowerCase() === "paid"
            ) {
                sum = sum + this.payments[i].transactionAmount;
            }
        }

        return sum;
    }

    outStandingAmount() {
        return this.getPaidAmount() - this.order.totalOrderAmount;
    }

    onComplete() {
        // this.loader = true;
        // this.orderService
        //     .updateOrderStatus(this.order.id, "Completed")
        //     .subscribe(
        //         (data) => {
        //             this.loader = false;

        //             this.presentToast("Order status updated successfully");

        //             this.order.invoiceId = data.body.invoiceId;
        //             this.orderLineReceipeInvetoryUpdate(this.order);
        //             this.cancel();
        //         },
        //         (error) => {
        //             this.loader = false;
        //         }
        //     );
        if (this.order.orderPaymentStatus != "Paid") {
            if (this.outStandingAmount() >= 0) {
                this.order.orderPaymentStatus = "Paid";
                this.orderService
                    .updateOrderPaymentStatus(
                        this.order.id,
                        this.order.orderPaymentStatus
                    )
                    .subscribe((res) => {
                        this.completeOrder();
                    });
            } else {
                this.completeOrder();
            }
        } else {
            this.completeOrder();
        }
    }

    completeOrder() {
        this.orderService
            .updateOrderStatus(this.order.id, "Completed")
            .subscribe(
                (data) => {
                    this.loader = false;
                    this.orderService
                        .getOrderByOrderId(this.order.id)
                        .subscribe(
                            (data) => {
                                this.order = data.body;
                                if(data.status === 200 && this.isSendWpInvoice === true && (this.order.mobile != null && this.order.mobile != undefined)){
                                this.sendOrderInvoiceToWp(this.order)
                                }
                                this.presentToast(
                                    "Order status updated successfully"
                                );
                                this.updateKOTLineStatus(
                                    this.order.id,
                                    ServedStatus
                                );
                                this.order.invoiceId = data.body.invoiceId;

                                if (
                                    this.order.deliveryMethod === "Room Order"
                                ) {
                                    if (
                                        this.paymentDTO.paymentMode ===
                                            "BillToRoom" ||
                                        this.paymentDTO.paymentMode === "Credit"
                                    ) {
                                        if (
                                            this.order.invoiceId != null &&
                                            this.order.invoiceId != undefined
                                        ) {
                                            this.getInvoiceDetailById(
                                                this.order.invoiceId
                                            );
                                        }
                                    }
                                } else {
                                    if (this.outStandingAmount() < 0) {
                                        if (
                                            this.order.invoiceId != null &&
                                            this.order.invoiceId != undefined
                                        ) {
                                            this.getInvoiceDetailById(
                                                this.order.invoiceId
                                            );
                                        }
                                    }
                                }

                                this.order.invoiceId = data.body.invoiceId;
                                this.orderLineReceipeInvetoryUpdate(this.order);
                                
                              

                      
                                setTimeout(() => {
                                    this.navCtrl.navigateForward('/manage-order');
                                  }, 3000);
                            },
                            (error) => {
                                this.loader = false;
                            }
                        );
                },
                (error) => {
                    this.loader = false;
                }
            );
    }
    sendOrderInvoiceToWp(row){
        this.whatsappForm.messaging_product = 'whatsapp';
        this.whatsappForm.recipient_type ='individual';
        this.template.name = " ";
        this.template.name = "order_invoice_testing";
        this.language.code = 'en',
        this.template.language = this.language;
       
        this.componentstype2.type= 'body',
         this.componentstype2.index ="0";
       
        this.parametertype2 = new Para()
        this.parametertype2.type = 'text'
        if ( row.firstName != null && row.firstName != undefined) {
          this.parametertype2.text = row.firstName;
        }else if((row.firstName === null || row.firstName === undefined) && row.customerName !== 'undefined'){
          this.parametertype2.text = row.customerName;
        }
        this.parameterss2.push(this.parametertype2);
        this.parametertype2 = new Para()
        this.parametertype2.type = 'text',
        this.parametertype2.text = this.token.getProperty().name;
        this.parameterss2.push(this.parametertype2);
        this.parametertype2 = new Para();
        this.parametertype2.type = 'text',
        this.parametertype2.text = row.bookOneOrderId,
        this.parameterss2.push(this.parametertype2);
        this.parametertype2 = new Para();
        this.parametertype2.type = 'text',
        this.parametertype2.text =  this.dateService.convertMillisecondsToDateFormat(
          row.orderedDate
        );
        this.parameterss2.push(this.parametertype2);
       
        // this.parametertype2 = new Para();
        // this.parametertype2.type = 'text',
        // this.parametertype2.text = this.token.getProperty().id.toString();
        // this.parameterss2.push(this.parametertype2);
        this.parametertype2 = new Para();
        this.parametertype2.type = 'text',
        this.parametertype2.text = this.order.totalOrderAmount.toString();
        this.parameterss2.push(this.parametertype2);
        this.componentstype2.parameters =this.parameterss2;
        this.components.push(this.componentstype2);
        this.componentstype.type= 'button',
        this.componentstype.sub_type ='url',
        this.componentstype.index ='0',
        this.parametertype.type = 'text',
     this.parametertype.text = String("#/order-invoice?orderId=" + row.id + "&propertyId=" + this.propertyId);
        this.parameterss.push(this.parametertype);
        this.componentstype.parameters =this.parameterss;
        this.components.push(this.componentstype);
        this.template.components = this.components;
        this.whatsappForm.template =this.template;
        // this.whatsappForm.to = row.mobile,
        this.whatsappForm.to = row.mobile,
    console.log("order details" + JSON.stringify( this.whatsappForm))
        this.whatsappForm.type = 'template',
        console.log(JSON.stringify(this.whatsappForm))
          this.orderService.whatsAppMsg(this.whatsappForm).subscribe((response) => {
    
          }, error => {
    
          });
      }
    updateKOTLineStatus(OrderId: number, status: string) {

        this.loader = true;
        this.orderService.updateKotOrderLineItemStatus(OrderId, status).subscribe(
          (data) => {
            this.loader = false;

          },
          (error) => {
            this.loader = false;
          }
        );
      }
    

    getInvoiceDetailById(id: number) {
        this.loader = true;
        this.invoiceService.getInvoiceDetailsById(id).subscribe(
          (data) => {
            this.invoice = data.body;
            this.loader = false;
    
            if (this.order.deliveryMethod === "Room Order")
            {
              this.invoice.roomBillAmount = this.invoice.totalAmount;
              this.invoice.paidAmount = 0;
              this.invoice.balanceAmount = this.invoice.roomBillAmount;
            }
            else
            {
              this.invoice.roomBillAmount = this.getBillToRoomAmount();
              this.invoice.creditBillAmount = this.getBillToCompanyAmount();
              this.invoice.paidAmount = this.getPaidAmount();
              this.invoice.balanceAmount = this.invoice.totalAmount - this.getPaidAmount();
            }
    
    
            this.createInvoice(this.invoice);
            this.changeDetectorRefs.detectChanges();
          },
          (error) => {
            this.loader = false;
          }
        );
    }
    
    createInvoice(invoice: Invoice) {
        this.loader = true;
        this.invoiceService.createInvoice(invoice).subscribe(
          (response) => {
            //  Logger.log('response.body : '+JSON.stringify(response));
            this.loader = false;
          },
          (error) => {
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
          }
        );
      }

    sendConfirmationMessage(order: Order) {
        let Url =
            CUSTOMER_APP_URL +
            "invoice-details/" +
            order.invoiceId +
            "/" +
            this.token.getProperty().id;
        let msg = new Msg();
        msg.fromNumber = SMS_NUMBER;
        msg.toNumber = order.mobile;

        msg.message = `Dear ${order.firstName}, Rsvn# ${order.bookOneOrderId}, Delivery Method: ${order.deliveryMethod}, Amount :${order.totalOrderAmount}. Please check details invoice from below link ${Url}`;

        this.notificationService.sendTextMessage(msg).subscribe(
            (response1) => {
                msg = response1.body;
                if (msg.sid !== undefined || msg.sid !== null) {
                    this.presentToast("Confirmation SMS Sent.");
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    this.presentToast("Error in sending sms");
                }
            }
        );
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
                },
                (error) => {
                    this.loader = false;
                }
            );
        }
    }
    outStandingAmountWithCredit() {
        return this.getPaidWIthCreditAmount() - this.order.totalOrderAmount;
    }

    getPaidWIthCreditAmount() {
        let sum = 0;

        if (this.order.deliveryMethod === "Room Order") {
            if (this.paymentDTO.status === "Paid") {
                sum = this.paymentDTO.transactionAmount;
            } else {
                sum = 0;
            }
        } else {
            for (let i = 0; i < this.payments.length; i++) {
                if (
                    this.payments[i].status != null &&
                    this.payments[i].status.toLowerCase() === "paid"
                )
                    sum = sum + this.payments[i].transactionAmount;
            }
        }

        return sum;
    }

    paymentDetail() {
        if (this.order.deliveryMethod === "Room Order") {
            if (
                this.order.paymentId != null &&
                this.order.paymentId != undefined
            ) {
                this.loader = true;
                this.paymentService
                    .findPaymentById(this.order.paymentId)
                    .subscribe(
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

    onPaymentDetail(payment) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                paymentOb: JSON.stringify(payment),
                permission: 3,
            },
        };

        this.navCtrl.navigateForward(["manage-payment"], navigationExtras);
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
}
