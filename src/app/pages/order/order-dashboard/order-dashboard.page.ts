import { ChangeDetectorRef, Component, OnInit, ViewRef } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import {
    ToastController,
    NavController,
    ActionSheetController,
    ModalController,
    IonRouterOutlet,
    MenuController,
} from "@ionic/angular";
import { ActionOrderMenuComponent } from "src/app/component/Order/action-order-menu/action-order-menu.component";
import { BusinessServiceDtoList } from "src/app/model/business-service/businessServiceDtoList";
import { Recipe } from "src/app/model/inventory/recipe";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { BusinessProperties } from "src/app/model/Order/businessProperties";
import { Order } from "src/app/model/Order/order";
import { Property } from "src/app/model/property/Property";
import { DateService } from "src/app/service/DateService/date-service.service";
import { RecipeService } from "src/app/service/inventory/recipe.service";
import { OrderService } from "src/app/service/Order/order.service";
import { TokenStorage } from "src/app/token.storage";
import { BookingData } from "../checkout/checkout.page";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";

@Component({
    selector: "app-order-dashboard",
    templateUrl: "./order-dashboard.page.html",
    styleUrls: ["./order-dashboard.page.scss"],
})
export class OrderDashboardPage implements OnInit {
    recipe: Recipe;
    recipes: Recipe[] = [];

    loader: boolean = false;
    propertiesDto: BusinessProperties;
    businessServiceList: BusinessServiceDtoList[] = [];

    bserviceid: number;
    businessService: BusinessServiceDtoList;

    homeDeliveryOrders: Order[];
    cancelledOrders: Order[];
    dyneInOrders: Order[];
    takeAwayOrders: Order[];
    roomOrders: Order[];
    roomOrder: Order;
    orders: Order[];
    ordersData: Order[];
    orderFilterData: Order[];

    order: Order;
    propertyId: number;
    property: Property;
    currency: string;
    booking: Booking;
    bookings: Booking[] = [];

    bookingdata: BookingData[];
    bookingFilter: any[] = [];
    segment1: string = "data";
    segment2: string = "DineIn";
    userData: ApplicationUser;

    constructor(
        private orderService: OrderService,
        public token: TokenStorage,
        private modalController: ModalController,
        private routerOutlet: IonRouterOutlet,
        private toastController: ToastController,
        private navCtrl: NavController,
        public menuCtrl: MenuController,
        private recipeService: RecipeService,
        private actionSheetController: ActionSheetController,
        public dateService: DateService,
        private authService: AuthService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.userData = new ApplicationUser();
        this.propertiesDto = new BusinessProperties();
        this.property = new Property();
        this.businessService = new BusinessServiceDtoList();
        this.order = new Order();
        this.booking = new Booking();
    }

    ngOnInit() {
        this.getUserData();
        this.property = this.token.getProperty();
        this.propertyId = this.token.getProperty().id;

        if (
            this.property.localCurrency != null &&
            this.property.localCurrency != undefined
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }

        if (
            this.token.getBusinessProperties() != null &&
            this.token.getBusinessProperties() != undefined
        ) {
            this.propertiesDto = this.token.getBusinessProperties();
            this.businessServiceSetup();
        } else {
            this.getAllBusinessService(String(this.property.id));
        }

        this.todaysOrder();
    }

    ionViewWillEnter() {
        this.getUserData();
        this.todaysOrder();
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

    addRoomOrder(row) {
        this.roomOrder = new Order();
        this.roomOrder.bookingId = row.id;
        this.roomOrder.firstName = row.firstName;
        this.roomOrder.lastName = row.lastName;
        this.roomOrder.email = row.email;
        this.roomOrder.mobile = row.mobile;
        this.roomOrder.customerName = row.firstName + row.lastName;
        this.roomOrder.roomNo = row.roomNumber;
        this.roomOrder.deliveryMethod = "Room Order";
        this.roomOrder.customerId = row.bookingOb.customerId;

        let navigationExtras: NavigationExtras = {
            queryParams: {
                roomOrder: JSON.stringify(this.roomOrder),
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }

    addQuickDyneInOrder(slot) {
        this.roomOrder = new Order();
        this.roomOrder.deliveryMethod = "Dine In";
        this.roomOrder.businessServiceId = slot.businessServiceId;
        this.roomOrder.resourceName = slot.resource.resourceName;
        this.roomOrder.locationName = slot.location.locationName;
        this.roomOrder.orderedDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(new Date());
        // this.roomOrder.orderedTime =
        // this.roomOrder.orderedDate =
        this.roomOrder.businessServiceTypeId = slot.businessServiceTypeId;

        let navigationExtras: NavigationExtras = {
            queryParams: {
                quickDyneInOrder: JSON.stringify(this.roomOrder),
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }

    addDyneInOrder(slot, serviceType) {
        this.roomOrder = new Order();
        this.roomOrder.deliveryMethod = "Dine In";
        this.roomOrder.businessServiceId = slot.businessServiceId;
        this.roomOrder.resourceName = slot.resource.resourceName;
        this.roomOrder.locationName = slot.location.locationName;
        this.roomOrder.orderedDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(new Date());
        // this.roomOrder.orderedTime =
        // this.roomOrder.orderedDate =
        this.roomOrder.businessServiceTypeId = slot.businessServiceTypeId;

        let navigationExtras: NavigationExtras = {
            queryParams: {
                // dyneInOrder: JSON.stringify(this.roomOrder),
                quickDyneInOrder: JSON.stringify(this.roomOrder)
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }

    filterByLocAndRec(LocationName: string, ResourceName: string) {
        let searchResult;

        if (
            this.dyneInOrders != null &&
            this.dyneInOrders != undefined &&
            this.dyneInOrders.length > 0
        ) {
            this.ordersData = this.dyneInOrders;
            this.ordersData = this.ordersData.filter((item) => {
                searchResult =
                    item.locationName != null &&
                    item.locationName != undefined &&
                    LocationName != null &&
                    LocationName != undefined &&
                    item.locationName.toLocaleLowerCase().trim() ===
                        LocationName.toLocaleLowerCase().trim() &&
                    item.resourceName != null &&
                    item.resourceName != undefined &&
                    ResourceName != null &&
                    ResourceName != undefined &&
                    item.resourceName.split(",").indexOf(ResourceName) > -1 &&
                    item.orderStatus != null &&
                    item.orderStatus.indexOf("Completed") === -1 &&
                    item.orderStatus != null &&
                    item.orderStatus.indexOf("Cancelled") === -1;

                return searchResult;
            });
        } else {
            this.ordersData = [];
        }

        return this.ordersData;
    }

    getOrderByPropertyIdAndDateRange(
        propertyId: string,
        formDate: string,
        toDate: string
    ) {
        this.loader = true;
        this.orders = [];
        this.orderFilterData = [];
        this.takeAwayOrders = [];
        this.roomOrders = [];
        this.dyneInOrders = [];
        this.homeDeliveryOrders = [];
        this.cancelledOrders = [];
        this.orderService
            .getOrderByPropertyIdAndDateRange(propertyId, formDate, toDate)
            .subscribe(
                (data) => {
                    this.orders = data.body;
                    this.orderFilterData = this.orders;

                    this.filterByDropdown();

                    this.loader = false;
                    this.UIDetectChange();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    filterByDropdown() {
        // Logger.log('sddd'+this.OrderStatus+'All '+ this.ModeOfPayment +' All ' + this.DeliveryMethod);
        let searchResult;
        this.orders = this.orderFilterData;

        if (
            this.orders != null &&
            this.orders != undefined &&
            this.orders.length > 0
        ) {
            this.orders = this.orders.filter((item) => {
                searchResult =
                    item.businessServiceId != null &&
                    item.businessServiceId != undefined &&
                    this.bserviceid != null &&
                    this.bserviceid != undefined &&
                    item.businessServiceId === this.bserviceid;

                return searchResult;
            });
        }

        this.filterByOrderMethod();
        this.UIDetectChange();
    }

    filterByOrderMethod() {
        // this.orders = this.orderFilterData;
        if (
            this.orders != null &&
            this.orders != undefined &&
            this.orders.length > 0
        ) {
            this.takeAwayOrders = this.orders.filter((item) => {
                const searchResult =
                    item.deliveryMethod != null &&
                    item.deliveryMethod.indexOf("Take Away") > -1;

                return searchResult;
            });

            //  this.orders = this.orderFilterData;
            this.roomOrders = this.orders.filter((item) => {
                const searchResult =
                    item.deliveryMethod != null &&
                    item.deliveryMethod.indexOf("Room Order") > -1;

                return searchResult;
            });

            // this.orders = this.orderFilterData;
            this.dyneInOrders = this.orders.filter((item) => {
                const searchResult =
                    item.deliveryMethod != null &&
                    item.deliveryMethod.indexOf("Dine In") > -1;

                return searchResult;
            });

            // this.orders = this.orderFilterData;
            this.homeDeliveryOrders = this.orders.filter((item) => {
                const searchResult =
                    item.deliveryMethod != null &&
                    item.deliveryMethod.indexOf("Home Delivery") > -1;

                return searchResult;
            });
            this.cancelledOrders = this.orders.filter((item) => {
                const searchResult =
                    item.deliveryMethod != null &&
                    item.orderStatus.indexOf("Cancelled") > -1;

                return searchResult;
            });
        }
    }

    totalOrder() {
        let sum = 0;
        if (
            this.orders != null &&
            this.orders != undefined &&
            this.orders.length > 0
        ) {
            sum = this.orders.length;
        }

        return sum;
    }

    totalTableOrder() {
        let sum = 0;
        if (
            this.dyneInOrders != null &&
            this.dyneInOrders != undefined &&
            this.dyneInOrders.length > 0
        ) {
            sum = this.dyneInOrders.length;
        }

        return sum;
    }

    totalRoomOrder() {
        let sum = 0;
        if (
            this.roomOrders != null &&
            this.roomOrders != undefined &&
            this.roomOrders.length > 0
        ) {
            sum = this.roomOrders.length;
        }

        return sum;
    }

    totalHDOrder() {
        let sum = 0;
        if (
            this.homeDeliveryOrders != null &&
            this.homeDeliveryOrders != undefined &&
            this.homeDeliveryOrders.length > 0
        ) {
            sum = this.homeDeliveryOrders.length;
        }

        return sum;
    }

    getTotalCancelledOrder() {
        let sum = 0;
        if (
            this.cancelledOrders != null &&
            this.cancelledOrders != undefined &&
            this.cancelledOrders.length > 0
        ) {
            sum = this.cancelledOrders.length;
        }

        return sum;
    }

    getTotalHDAmount() {
        //return this.orders.map(t => t.totalOrderAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;

        if (
            this.homeDeliveryOrders != null &&
            this.homeDeliveryOrders != undefined &&
            this.homeDeliveryOrders.length > 0
        ) {
            for (let i = 0; i < this.homeDeliveryOrders.length; i++) {
                if (
                    this.homeDeliveryOrders[i].totalOrderAmount != null &&
                    this.homeDeliveryOrders[i].totalOrderAmount != undefined
                ) {
                    sum = sum + this.homeDeliveryOrders[i].totalOrderAmount;
                }
            }
        }
        return sum;
    }

    getTotalTAAmount() {
        //return this.orders.map(t => t.totalOrderAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;

        if (
            this.takeAwayOrders != null &&
            this.takeAwayOrders != undefined &&
            this.takeAwayOrders.length > 0
        ) {
            for (let i = 0; i < this.takeAwayOrders.length; i++) {
                if (
                    this.takeAwayOrders[i].totalOrderAmount != null &&
                    this.takeAwayOrders[i].totalOrderAmount != undefined
                ) {
                    sum = sum + this.takeAwayOrders[i].totalOrderAmount;
                }
            }
        }
        return sum;
    }

    totalTAOrder() {
        let sum = 0;
        if (
            this.takeAwayOrders != null &&
            this.takeAwayOrders != undefined &&
            this.takeAwayOrders.length > 0
        ) {
            sum = this.takeAwayOrders.length;
        }

        return sum;
    }

    getTotalRoomAmount() {
        //return this.orders.map(t => t.totalOrderAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;

        if (
            this.roomOrders != null &&
            this.roomOrders != undefined &&
            this.roomOrders.length > 0
        ) {
            for (let i = 0; i < this.roomOrders.length; i++) {
                if (
                    this.roomOrders[i].totalOrderAmount != null &&
                    this.roomOrders[i].totalOrderAmount != undefined
                ) {
                    sum = sum + this.roomOrders[i].totalOrderAmount;
                }
            }
        }
        return sum;
    }

    getTotalTableAmount() {
        //return this.orders.map(t => t.totalOrderAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;

        if (
            this.dyneInOrders != null &&
            this.dyneInOrders != undefined &&
            this.dyneInOrders.length > 0
        ) {
            for (let i = 0; i < this.dyneInOrders.length; i++) {
                if (
                    this.dyneInOrders[i].totalOrderAmount != null &&
                    this.dyneInOrders[i].totalOrderAmount != undefined
                ) {
                    sum = sum + this.dyneInOrders[i].totalOrderAmount;
                }
            }
        }
        return sum;
    }

    getTotalAmount() {
        //return this.orders.map(t => t.totalOrderAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;

        if (
            this.orders != null &&
            this.orders != undefined &&
            this.orders.length > 0
        ) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].totalOrderAmount != null &&
                    this.orders[i].totalOrderAmount != undefined
                ) {
                    sum = sum + this.orders[i].totalOrderAmount;
                }
            }
        }
        return sum;
    }

    UIDetectChange() {
        setTimeout(() => {
            if (
                this.changeDetectorRefs &&
                !(this.changeDetectorRefs as ViewRef).destroyed
            ) {
                this.changeDetectorRefs.detectChanges();
            }
        });
    }

    setService(bserviceid) {
        this.businessService = this.businessServiceList.find(
            (data) => data.id === bserviceid
        );
        this.filterByDropdown();
    }

    getAllBusinessService(PropertyId: string) {
        this.loader = true;
        this.orderService.findByPropertyId(PropertyId).subscribe(
            (data) => {
                this.propertiesDto = data.body;

                this.loader = false;
                this.token.saveBusinessProperties(this.propertiesDto);
                this.businessServiceSetup();
            },
            (error) => {
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            }
        );
    }

    businessServiceSetup() {
        this.businessServiceList = [];

        if (this.propertiesDto.businessServiceDtoList.length > 0) {
            if (
                this.propertiesDto.businessServiceDtoList != undefined &&
                this.propertiesDto.businessServiceDtoList != null
            ) {
                this.businessServiceList =
                    this.propertiesDto.businessServiceDtoList;

                let businessServiceRestaurant = [];
                let searchResult;

                businessServiceRestaurant = this.businessServiceList;
                businessServiceRestaurant = businessServiceRestaurant.filter(
                    (item) => {
                        searchResult =
                            item.name != null &&
                            item.name != undefined &&
                            item.name.toLowerCase() === "restaurants" &&
                            item.active != null &&
                            item.active != undefined &&
                            item.active === true;

                        return searchResult;
                    }
                );

                if (
                    businessServiceRestaurant != null &&
                    businessServiceRestaurant != undefined &&
                    businessServiceRestaurant.length > 0
                ) {
                    this.bserviceid = businessServiceRestaurant[0].id;
                    this.setService(businessServiceRestaurant[0].id);
                } else {
                    this.bserviceid =
                        this.propertiesDto.businessServiceDtoList[0].id;
                    this.setService(
                        this.propertiesDto.businessServiceDtoList[0].id
                    );
                }
            }
        }
        this.changeDetectorRefs.detectChanges();
    }

    todaysOrder() {
        let date = new Date();
        date.setDate(date.getDate() + 1);

        let fromdate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date().getTime()
        );
        let todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            date.getTime()
        );
        this.getOrderByPropertyIdAndDateRange(
            String(this.propertyId),
            fromdate,
            todate
        );
        this.getGuestsInHouseToday(this.propertyId);
    }

    getGuestsInHouseToday(propertyId: number) {
        this.bookings = [];
        this.bookingFilter = [];
        this.booking.propertyId = propertyId;
        this.orderService
            .getGuestInHouseByPropertyId(propertyId)
            .subscribe((data) => {
                this.bookings = data.body;

                this.bookingdata = [];
                for (let i = 0; i < this.bookings.length; i++) {
                    if (
                        this.bookings[i].roomDetails != null &&
                        this.bookings[i].roomDetails != undefined &&
                        this.bookings[i].roomDetails.length > 0
                    ) {
                        if (this.bookings[i].groupBooking === false) {
                            for (
                                let j = 0;
                                j < this.bookings[i].roomDetails.length;
                                j++
                            ) {
                                const data: BookingData = {
                                    id: this.bookings[i].id,
                                    firstName: this.bookings[i].firstName,
                                    lastName: this.bookings[i].lastName,
                                    email: this.bookings[i].email,
                                    mobile: this.bookings[i].mobile,
                                    propertyReservationNumber:
                                        this.bookings[i]
                                            .propertyReservationNumber,
                                    roomName: this.bookings[i].roomName,
                                    roomNumber:
                                        this.bookings[i].roomDetails[j]
                                            .roomNumber,
                                    customerId: this.bookings[i].customerId,
                                    isGroupBooking: false,
                                    bookingOb: this.bookings[i],
                                };
                                this.bookingdata.push(data);
                            }
                        } else {
                            for (
                                let j = 0;
                                j < this.bookings[i].roomDetails.length;
                                j++
                            ) {
                                if (
                                    this.bookings[i].firstName +
                                        " " +
                                        this.bookings[i].lastName ===
                                    this.bookings[i].roomDetails[j].guestName
                                ) {
                                    const data: BookingData = {
                                        id: this.bookings[i].id,
                                        firstName: this.bookings[i].firstName,
                                        lastName: this.bookings[i].lastName,
                                        email: this.bookings[i].email,
                                        mobile: this.bookings[i].mobile,
                                        propertyReservationNumber:
                                            this.bookings[i]
                                                .propertyReservationNumber,
                                        roomName: this.bookings[i].roomName,
                                        roomNumber:
                                            this.bookings[i].roomDetails[j]
                                                .roomNumber,
                                        isGroupBooking: true,
                                        customerId:
                                            this.bookings[i].roomDetails[j]
                                                .customerId,
                                        bookingOb: this.bookings[i],
                                    };
                                    this.bookingdata.push(data);
                                }
                            }
                        }
                    }
                }

                this.loader = false;
                this.UIDetectChange();
            }),
            (error) => {
                this.loader = false;
            };
    }

    filterByBookingId(bookingId: number) {
        let searchResult;

        if (
            this.roomOrders != null &&
            this.roomOrders != undefined &&
            this.roomOrders.length > 0
        ) {
            this.ordersData = this.roomOrders;
            this.ordersData = this.ordersData.filter((item) => {
                searchResult =
                    item.bookingId != null &&
                    item.bookingId != undefined &&
                    bookingId != null &&
                    bookingId != undefined &&
                    item.bookingId === bookingId;

                return searchResult;
            });
        } else {
            this.ordersData = [];
        }

        return this.ordersData;
    }

    onDetails(row) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(row),
            },
        };

        this.navCtrl.navigateForward(["order-details"], navigationExtras);
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    onHome() {
        this.navCtrl.navigateRoot(["service-dashboard"]);
    }

    createOrder() {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                // paymentOb: JSON.stringify(payment),
                permission: 0,
            },
        };

        // this.navCtrl.navigateForward(["product-group"], navigationExtras);
        this.navCtrl.navigateForward(["checkout"]);
    }

    manageOrder() {
        this.navCtrl.navigateRoot('manage-order');
    }

    async onHeaderMenu() {
        const actionSheet = await this.actionSheetController.create({
            header: "Switch Dashboard",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                {
                    text: "New Order",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("checkout");
                    },
                },
                {
                    text: "Manage Order",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("manage-order");
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    menuAction() {
        this.menuCtrl.toggle();
    }

}
