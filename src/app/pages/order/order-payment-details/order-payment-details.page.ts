import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
    IonRouterOutlet,
    ModalController,
    ToastController,
    NavController,
    ActionSheetController,
} from "@ionic/angular";
import { Location } from "@angular/common";
import { CheckUserType } from "src/app/model/checkUserType";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { Order } from "src/app/model/Order/order";
import { Property } from "src/app/model/property/Property";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { DateService } from "src/app/service/DateService/date-service.service";
import { RecipeService } from "src/app/service/inventory/recipe.service";
import { OrderService } from "src/app/service/Order/order.service";
import { PaymentService } from "src/app/service/payment/payment.service";
import { TokenStorage } from "src/app/token.storage";
import { CollectPaymentModalComponent } from "src/app/model/collect-payment-modal/collect-payment-modal.component";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";

@Component({
    selector: "app-order-payment-details",
    templateUrl: "./order-payment-details.page.html",
    styleUrls: ["./order-payment-details.page.scss"],
})
export class OrderPaymentDetailsPage implements OnInit {
    loader: boolean = false;

    payments: Payment[] = [];
    paymentsFilter: Payment[] = [];
    paymentsPaid: Payment[] = [];
    paymentDTO: Payment;

    user: ApplicationUser;

    order: Order;

    checkUserType: CheckUserType;
    role: any[];

    isAdmin: boolean = false;
    propertyId: number;
    localCurrency: string;
    property: Property;

    isPropAdmin: boolean = false;
    bookoneOrderId: any;
    userData: ApplicationUser;
    booking: Booking;

    constructor(
        private orderService: OrderService,
        private routerOutlet: IonRouterOutlet,
        private paymentService: PaymentService,
        private recipeService: RecipeService,
        public token: TokenStorage,
        private locationBack: Location,
        private modalController: ModalController,
        private toastController: ToastController,
        private navCtrl: NavController,
        private acRoute: ActivatedRoute,
        private authService: AuthService,
        private actionSheetController: ActionSheetController,
        public dateService: DateService,
        private changeDetectorRefs: ChangeDetectorRef,
        private router: Router,
        private bookingService: BookingService,
    ) {
        this.userData = new ApplicationUser();
        this.checkUserType = new CheckUserType();
        this.property = new Property();
        this.order = new Order();
    }

    ngOnInit() {
        this.property = this.token.getProperty();

        const UserId = this.token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(data => {
          this.userData = data.body;
          this.loader = false;
          this.changeDetectorRefs.detectChanges();
    
        }, error => {
          this.loader = false;
        });

        if (
            this.property.localCurrency != null &&
            this.property.localCurrency != undefined
        ) {
            this.localCurrency = this.property.localCurrency.toUpperCase();
        }

        this.acRoute.queryParams.subscribe((params) => {
            if (params["id"] != undefined) {
                this.bookoneOrderId = JSON.parse(params["id"]);
                this.getOrderDetailsById(this.bookoneOrderId);
            }
        });
    }

    

    async openCollectPaymentModal() {
        const modal = await this.modalController.create({
          component: CollectPaymentModalComponent,
          componentProps: {
            data: this.order,  
          },
        });
        modal.onDidDismiss().then((data) => {
            this.getOrderDetailsById(this.bookoneOrderId);
                this.successDialogClose()

        });
        return await modal.present();
      }

      successDialogClose() {
        this.modalController.dismiss("done");
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

    close() {
        this.modalController.dismiss();
    }

    async getBookingById() {
        try {
            const response1 = await this.bookingService.findBooking(this.order.bookingId).toPromise();
            this.booking = response1.body;
            this.getPaymentDetailsByBooking();
        } catch (error) {
            console.error("Error:", error);
            this.loader = false;
        }
    }

    async getPaymentDetailsByBooking() {
        try {
            const res = await this.paymentService.findPaymentByReferenceNumber(this.booking.propertyReservationNumber).toPromise();
      
            this.payments = res.filter((item) => {
                const searchResult =
                  item.orderId != null &&
                  item.orderId === this.order.id;
      
                return searchResult;
            });
      
            this.paymentsPaid = this.payments.filter((item) => {
                const searchResult =
                  item.status != null &&
                  item.status.toLowerCase() === "paid";
      
                return searchResult;
            });
      
            // this.dataSource = new MatTableDataSource(this.payments);
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
        } catch (error) {
            console.error("Error:", error);
        }
      }

    getOrderDetailsById(id: number) {
        this.orderService
            .findById(id)
            .toPromise()
            .then((resp) => {
                this.order = resp.body;
                console.log("booking id", this.order.bookingId)

                // if (
                //     this.order.bookOneOrderId != null &&
                //     this.order.bookOneOrderId != undefined
                // ) {
                //     this.getPaymentByRevId(this.order.bookOneOrderId);
                // } 

                if (this.order.bookingId != null) {
                    this.getBookingById();
                  }
                  if (this.order.deliveryMethod != "Room Order")
                  {
                    if (
                      this.order.bookOneOrderId != null &&
                      this.order.bookOneOrderId != undefined
                    ) {
                      this.getPaymentByRevId(this.order.bookOneOrderId);
                    }
                  }

                

                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            })
            .catch((e) => {
                this.loader = false;
            });
    }

    onBack()
    { 
        this.locationBack.back(); 
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
                this.changeDetectorRefs.detectChanges();
            }
        );
    }

    outStandingAmount() {
        return this.getPaidAmount() - this.order.totalOrderAmount;
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

    ceckModeOfpayment(mode) {
        if (mode != null && mode != undefined && mode === "Credit") {
          return "BillToCompany";
        } else {
          return mode;
        }
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

    getPaidAmount() {
        let sum = 0;
        for (let i = 0; i < this.paymentsPaid.length; i++) {
            sum = sum + this.paymentsPaid[i].transactionAmount;
        }

        return sum;
    }

   

    async onPaymentOption(payment) {
        const buttons = [];
   
        // Check if the order status is not completed
        if (this.order.orderStatus !== 'Completed' && payment.status !== 'Paid') {
            buttons.push({
                text: "View",
                icon: "eye",
                handler: () => {
                    let navigationExtras: NavigationExtras = {
                        queryParams: {
                            paymentOb: JSON.stringify(payment),
                            permission: 1,
                        },
                    };
    
                    this.navCtrl.navigateForward(
                        ["manage-payment"],
                        navigationExtras
                    );
                },
            });
    
            buttons.push({
                text: "Close",
                icon: "close",
                role: "cancel",
                handler: () => {},
            });
        }
    
        // Create the action sheet only if buttons are present
        if (buttons.length > 0) {
            const actionSheet = await this.actionSheetController.create({
                header: "Payment option",
                buttons: buttons,
            });
    
            await actionSheet.present();
        }
    }
    
    
    
    
}
