import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewRef,
} from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { NavigationExtras } from "@angular/router";
import {
    ActionSheetController,
    IonModal,
    IonRouterOutlet,
    LoadingController,
    MenuController,
    ModalController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { ActionOrderMenuComponent } from "src/app/component/Order/action-order-menu/action-order-menu.component";
import { Recipe } from "src/app/model/inventory/recipe";
import { RecipeService } from "src/app/service/inventory/recipe.service";
import { Order } from "../../../model/Order/order";
import { DateService } from "../../../service/DateService/date-service.service";
import { Logger } from "../../../service/logger.service";
import { OrderService } from "../../../service/Order/order.service";
import { TokenStorage } from "../../../token.storage";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { Property } from "src/app/model/property/Property";
import { LocationModel } from "src/app/model/Reservation/location";
import { Resource } from "src/app/model/Reservation/resource";
import { ReservationService } from "src/app/service/ReservationService/reservation-service.service";
import { BusinessServiceDtoList } from "src/app/model/business-service/businessServiceDtoList";

@Component({
    selector: "app-manage-order",
    templateUrl: "./manage-order.page.html",
    styleUrls: ["./manage-order.page.scss"],
})
export class ManageOrderPage implements OnInit {
    @ViewChild("checkInModal", { static: false }) checkInModal: IonModal;
    @ViewChild("checkOutModal", { static: false }) checkOutModal: IonModal;
    checkInSelected: boolean = false;
    loader = false;
    property: Property;

    recipe: Recipe;
    recipes: Recipe[] = [];

    orders: Order[];
    OrderSearchObject: Order[];
    PageNo = 1;
    PageSize: number = 5;
    TotalItem: number;

    OrderFilterName = "Today";
    propertyId: number;
    currency: string;
    onFindOrderForm: FormGroup;
    onFindOrderIdForm: FormGroup;
    onFilterForm: FormGroup;
    fromDateString: string;
    toDateString: string;
    toMinDate: string;
    toMaxDate: string;
    currentDay: string;
    currentMonth: string;
    userData: ApplicationUser;

    propertyReservationNumberFirstPart: string;
    reservationNumber: string;

    isFilterVisible: boolean = false;

    ModeOfPayment: string = "All";
    OrderStatus: string = "All";
    DeliveryMethod: string = "All";
    LocationName: string = "All";
    ResourceName: string = "All";
    bserviceid: any = "0";

    locations: LocationModel[];
    resources: Resource[];

    businessService: BusinessServiceDtoList;
    businessServiceList: BusinessServiceDtoList[] = [];

    propertiesDto: any;
    serviceName: string;
    serviceSelected = false;
    BusinesService: FormControl = new FormControl();
    orderSequenceList: any[] = [];

    constructor(
        private orderService: OrderService,
        public loadingCtrl: LoadingController,
        private routerOutlet: IonRouterOutlet,
        private recipeService: RecipeService,
        public token: TokenStorage,
        private modalController: ModalController,
        private toastController: ToastController,
        private reservationService: ReservationService,
        public menuCtrl: MenuController,
        private navCtrl: NavController,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private actionSheetController: ActionSheetController,
        public dateService: DateService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.userData = new ApplicationUser();
        this.property = new Property();

        this.onFindOrderForm = this.formBuilder.group({
            bookingFromDate: [
               "",
                Validators.compose([Validators.required]),
            ],
            bookingToDate: [
               "",
                Validators.compose([Validators.required]),
            ],
        });

        this.onFilterForm = this.formBuilder.group({
            OrderStatusFilter: ["", Validators.compose([Validators.required])],
            DeliveryMethodFilter: [
                "",
                Validators.compose([Validators.required]),
            ],
            BusinesService: ["", Validators.compose([Validators.required])],
            LocationController: ["", Validators.compose([Validators.required])],
            ResourceController: ["", Validators.compose([Validators.required])],
        });

        this.onFindOrderIdForm = this.formBuilder.group({
            PropertyReservationNumberFirstPart: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            PropertyReservationNumber: [
                "",
                Validators.compose([Validators.required]),
            ],
        });
    }

    ngOnInit() {
        
        this.property = this.token.getProperty();
        this.setOrderSearchReservationId();
        this.fetchSequenceOrder();

        if (
            this.token.getBusinessProperties() === null ||
            this.token.getBusinessProperties() === undefined
        ) {
            this.getAllBusinessService(this.token.getPropertyId());
        } else {
            this.propertiesDto = this.token.getBusinessProperties();

            this.businessServiceList = [];

            if (this.propertiesDto.businessServiceDtoList.length > 0) {
                this.businessServiceList =
                    this.propertiesDto.businessServiceDtoList;
            }
        }

        this.getUserData();
    }

    ionViewWillEnter() {
        this.refresh();
        if (this.onFindOrderForm) {
            this.findOrder();
        } else if (this.onFindOrderIdForm) {
            this.getReservationOrderData();
        }
    }

    setService(bserviceid) {
        this.businessService = this.businessServiceList.find(
            (data) => data.id === bserviceid
        );
        this.serviceName = this.businessService.name;
        this.filterByDropdown();
        this.serviceSelected = !!bserviceid;
    }
    onGetResourceAndLocationByService() {
        if (this.bserviceid != null && this.bserviceid != undefined) {
            this.getAllLocation(String(this.bserviceid));
            this.getAllResource(String(this.bserviceid));
        }
        this.filterByDropdown();
    }

    resetReservation() {
        // this.onFindOrderIdForm.reset();
        this.reservationNumber = "";
    }

    getBalance(value) {
        return Math.abs(value);
    }

    getAllResource(businessServiceId: string) {
        this.loader = true;
        this.resources = [];
        this.reservationService.getResources(businessServiceId).subscribe(
            (data) => {
                this.resources = data.body;

                //   Logger.log(' this.locations: '+JSON.stringify( this.resources));
                this.loader = false;
                this.UIDetectChange();
            },
            (error) => {
                this.loader = false;
                //   Logger.log(JSON.stringify(error));
            }
        );
    }

    getAllLocation(businessServiceId: string) {
        this.loader = true;
        this.locations = [];
        this.reservationService.getLocations(businessServiceId).subscribe(
            (data) => {
                this.locations = data.body;

                this.loader = false;
                this.UIDetectChange();
            },
            (error) => {
                this.loader = false;
                //  Logger.log(JSON.stringify(error));
            }
        );
    }
    fetchSequenceOrder() {
        this.orderService
            .getOrderSequence(Number(this.token.getPropertyId()))
            .subscribe((data) => {
                if (data.body != null && data.body.length > 0) {
                    for (let i = 0; i < data.body.length; i++) {
                        if (
                            data.body[i].propertyShortName != null &&
                            data.body[i].propertyShortName != undefined &&
                            data.body[i].propertyShortName.trim() != ""
                        ) {
                            data.body[i].propertyShortName =
                                data.body[i].propertyShortName + "-O-";
                            this.orderSequenceList.push(data.body[i]);
                        }
                    }
                }
            });
    }

    setOrderSearchReservationId() {
        if (
            this.property.shortName != null &&
            this.property.shortName != undefined
        ) {
            this.propertyReservationNumberFirstPart =
                this.property.shortName + "-O-";
        }

        if (
            this.orderSequenceList != null &&
            this.orderSequenceList.length > 0
        ) {
            for (let i = 0; i < this.orderSequenceList.length; i++) {
                if (
                    this.propertyReservationNumberFirstPart !=
                    this.orderSequenceList[i].propertyShortName
                ) {
                    this.propertyReservationNumberFirstPart =
                        this.orderSequenceList[0].propertyShortName;
                }
            }
        }
    }

    getUserData() {
        this.loader = true;
        const UserId = this.token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(
            (data) => {
                this.userData = data.body;
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    findTotalCountOfOrders(
        propertyId: string,
        formDate: string,
        toDate: string,
        pageNo: number,
        pageSize: number
    ) {
        this.orderService
            .findTotalCountOfOrders(propertyId, formDate, toDate)
            .subscribe(
                (data) => {
                    if (
                        data.body != null &&
                        data.body != undefined &&
                        data.body.totalCount != null &&
                        data.body.totalCount != undefined
                    ) {
                        this.TotalItem = data.body.totalCount;

                        this.loader = true;
                        this.orders = [];
                        this.OrderSearchObject = [];
                        // this.orderFilterData = [];
                        this.orderService
                            .paginationOrderByPropertyIdAndDateRange(
                                propertyId,
                                formDate,
                                toDate,
                                pageNo - 1,
                                pageSize
                            )
                            .subscribe(
                                (data) => {
                                    this.OrderSearchObject = data.body;
                                    this.orders = data.body;

                                    // this.orders.reverse();

                                    // this.orderFilterData =  this.orders;
                                    // this.filterByDropdown();
                                    this.loader = false;
                                    this.changeDetectorRefs.detectChanges();
                                },
                                (error) => {
                                    this.loader = false;
                                }
                            );
                    }
                },
                (error) => {}
            );
    }

    onChange(event): void {
        this.PageNo = event;
        this.refresh();
    }

    changePage() {
        this.PageNo = 1;
        this.refresh();
    }

    async getAllBusinessService(PropertyId: string) {
        this.loader = true;
        // const loader = await this.loadingCtrl.create({});
        // loader.present();
        this.orderService.findByPropertyId(PropertyId).subscribe(
            (data) => {
                this.token.saveBusinessProperties(data.body);
                this.loader = false;
                this.propertiesDto = data.body;

                this.businessServiceList = [];

                if (this.propertiesDto.businessServiceDtoList.length > 0) {
                    this.businessServiceList =
                        this.propertiesDto.businessServiceDtoList;
                }

                // loader.dismiss();
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            }
        );
    }

    getAllBusinessServiceOne(PropertyId: string) {
        this.loader = true;
        this.orderService.findByPropertyId(PropertyId).subscribe(
            (data) => {
                this.propertiesDto = data.body;

                this.loader = false;

                this.businessServiceList = [];

                if (this.propertiesDto.businessServiceDtoList.length > 0) {
                    this.businessServiceList =
                        this.propertiesDto.businessServiceDtoList;
                    // this.bserviceid =  this.businessServiceList[0].id;
                    // this.businessService = this.businessServiceList[0];
                    let businessServiceRestaurant = [];
                    let searchResult;

                    businessServiceRestaurant = this.businessServiceList;
                    businessServiceRestaurant =
                        businessServiceRestaurant.filter((item) => {
                            searchResult =
                                item.name != null &&
                                item.name != undefined &&
                                item.name.toLowerCase() === "restaurants" &&
                                item.active != null &&
                                item.active != undefined &&
                                item.active === true;

                            return searchResult;
                        });

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

                this.UIDetectChange();

                this.todaysOrder();
            },
            (error) => {
                this.loader = false;
                this.UIDetectChange();
            }
        );
    }

 fromDateChange(event: any) {
  const selectedDateStr = event.detail?.value;

  if (selectedDateStr) {
    // Update fromDateString
    this.fromDateString = selectedDateStr;

    // Set form control
    this.onFindOrderForm.get('bookingFromDate')?.setValue(selectedDateStr);
    this.checkInSelected = true;
  } else {
    this.checkInSelected = false;
    return;
  }

  // Set min date for To Date = selected From Date
  const toDate = new Date(this.fromDateString);
  this.toMinDate = this.getDate(toDate);

  // Set max date = +1 month from From Date
  toDate.setMonth(toDate.getMonth() + 1);
  this.toMaxDate = this.getDate(toDate);
}

toDateChange(event: any) {
  const selectedDateStr = event.detail?.value;

  if (selectedDateStr) {
    const selectedDate = new Date(selectedDateStr);
    this.toDateString = selectedDate.toISOString().split("T")[0];
  } else {
    this.toDateString = null;
  }

  setTimeout(() => this.checkOutModal?.dismiss(), 100);
}

getDate(date: Date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}


    refresh() {
        this.propertyId = Number(this.token.getPropertyId());
        // if (this.OrderFilterName === "AllOrder") {
        //     //this.getOrderListByPropertyId(Number(this.token.getPropertyId()));
        //     this.findOrder();
        // } else
        if (this.OrderFilterName === "Today") {
            this.todaysOrder();
        } else if (this.OrderFilterName === "next7days") {
            this.next7DaysOrder();
        } else if (this.OrderFilterName === "last7days") {
            this.last7DaysOrder();
        } else if (this.OrderFilterName === "AllOrder") {
            this.onFindOrderForm
                .get("bookingFromDate")
                .setValue(new Date().toISOString().split("T")[0]);
            this.onFindOrderForm
                .get("bookingToDate")
                .setValue(new Date().toISOString().split("T")[0]);
            this.fromDateString =
                this.onFindOrderForm.get("bookingFromDate").value;
            this.toDateString = this.onFindOrderForm.get("bookingToDate").value;
        }

        // this.getAllBusinessService(String( this.propertyId));
        this.currency = this.token.getProperty().localCurrency.toUpperCase();
    }

    ResetAllField() {
        this.onFindOrderForm.reset();
        this.isFilterVisible = false;
        // this.onFilterForm.reset();
        this.reservationNumber = null;
        this.setOrderSearchReservationId();
        this.orders = [];
        this.OrderSearchObject = [];

        this.bserviceid = "0";
        this.OrderStatus = "All";
        this.DeliveryMethod = "All";
        this.LocationName = "All";
        this.ResourceName = "All";
        this.ModeOfPayment = "All";
    }

    getReservationOrderData() {
        if (
            this.reservationNumber != null &&
            this.reservationNumber != undefined
        ) {
            this.orders = [];
            this.OrderSearchObject = [];
            let bookOneOrderId =
                this.propertyReservationNumberFirstPart +
                this.reservationNumber;

            this.orderService.getOrderByPropertyRevId(bookOneOrderId).subscribe(
                (data) => {
                    this.orders = [];
                    this.OrderSearchObject = [];
                    this.orders.push(data.body);
                    this.OrderSearchObject = this.orders;

                    this.loader = false;
                    this.UIDetectChange();
                },
                (error) => {
                    this.loader = false;
                }
            );
        }
    }

    findOrder() {
        this.loader = true;
        this.orders = [];
        this.OrderSearchObject = [];

        if (
            this.fromDateString != null &&
            this.fromDateString != undefined &&
            this.toDateString != null &&
            this.toDateString != undefined
        ) {
            this.fromDateString =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.fromDateString
                );
            this.toDateString =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.toDateString
                );
            this.findTotalCountOfOrders(
                this.token.getPropertyId(),
                this.fromDateString,
                this.toDateString,
                this.PageNo,
                this.PageSize
            );

            this.orderService
                .getOrderByPropertyIdAndDateRange(
                    this.token.getPropertyId(),
                    this.fromDateString,
                    this.toDateString
                )
                .subscribe(
                    (res) => {
                        this.OrderSearchObject = res.body;
                        this.orders = res.body;

                        //  this.orders.reverse();
                        this.loader = false;
                        this.changeDetectorRefs.detectChanges();
                    },
                    (error) => {
                        this.loader = false;
                        this.changeDetectorRefs.detectChanges();
                    }
                );
        }
    }

    todaysOrder() {
        const date = new Date();
        date.setDate(date.getDate() + 1);

        const fromdate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date().getTime()
        );
        const todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            date.getTime()
        );
        this.getOrderByPropertyIdAndDateRange(
            String(this.propertyId),
            fromdate,
            todate
        );
    }

    last7DaysOrder() {
        const date = new Date();
        date.setDate(date.getDate() - 7);

        const todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date().getTime()
        );
        const fromdate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            date.getTime()
        );
        this.getOrderByPropertyIdAndDateRange(
            String(this.propertyId),
            fromdate,
            todate
        );
    }

    next7DaysOrder() {
        const date = new Date();
        date.setDate(date.getDate() + 7);

        const fromdate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            new Date().getTime()
        );
        const todate = this.dateService.convertMillisecondsToYYYMMDDFormat(
            date.getTime()
        );
        this.getOrderByPropertyIdAndDateRange(
            String(this.propertyId),
            fromdate,
            todate
        );
    }

    getOrderByPropertyIdAndDateRange(
        propertyId: string,
        formDate: string,
        toDate: string
    ) {
        this.findTotalCountOfOrders(
            propertyId,
            formDate,
            toDate,
            this.PageNo,
            this.PageSize
        );
    }

    getOrderListByPropertyId(propertyId: number) {
        this.loader = true;
        this.orderService.getOrderListByPropertyId(propertyId).subscribe(
            (data) => {
                this.OrderSearchObject = data.body;
                this.orders = data.body;
                this.orders.reverse();
                this.OrderSearchObject.reverse();
                this.loader = false;

                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    onDetails(row) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                order: JSON.stringify(row),
            },
        };

        this.navCtrl.navigateForward(["order-details"], navigationExtras);
    }

    // async onMenu(row) {
    //     const modal = await this.modalController.create({
    //         component: ActionOrderMenuComponent,
    //         cssClass: "my-custom-class",
    //         swipeToClose: true,
    //         componentProps: {
    //             order: row,
    //         },
    //         presentingElement: this.routerOutlet.nativeEl,
    //     });

    //     modal.onDidDismiss().then((data) => {
    //         if (data != undefined && data != null && data.data === "done") {
    //             this.refresh();
    //         }
    //     });
    //     return await modal.present();
    // }
    bookingChanged() {
        throw new Error("Method not implemented.");
    }
    getRatesAndAvailability(booking: any) {
        throw new Error("Method not implemented.");
    }

    getItems(ev: any) {
        const val = ev.target.value;

        if (
            this.OrderSearchObject != null &&
            this.OrderSearchObject != undefined &&
            this.OrderSearchObject.length > 0
        ) {
            this.orders = this.OrderSearchObject;
            this.orders = this.orders.filter((item) => {
                const searchResult =
                    (item.firstName != null &&
                        item.lastName &&
                        (item.firstName + " " + item.lastName)
                            .toLowerCase()
                            .trim()
                            .indexOf(val.trim().toLowerCase().trim()) > -1) ||
                    (item.orderStatus != null &&
                        item.orderStatus
                            .toLowerCase()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.email != null &&
                        item.email
                            .toLowerCase()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.deliveryMethod != null &&
                        item.deliveryMethod
                            .toLowerCase()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.id != null &&
                        String(item.id).indexOf(val.toLowerCase().trim()) >
                            -1) ||
                    (item.invoiceId != null &&
                        String(item.invoiceId).indexOf(
                            val.toLowerCase().trim()
                        ) > -1) ||
                    (item.modeOfPayment != null &&
                        item.modeOfPayment
                            .toLowerCase()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.resourceName != null &&
                        item.resourceName
                            .toLowerCase()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.locationName != null &&
                        item.locationName
                            .toLowerCase()
                            .indexOf(val.toLowerCase().trim()) > -1) ||
                    (item.roomNo != null &&
                        item.roomNo.indexOf(val.trim()) > -1) ||
                    (item.mobile != null &&
                        String(item.mobile).indexOf(val.toLowerCase().trim()) >
                            -1) ||
                    (item.bookOneOrderId != null &&
                        item.bookOneOrderId != undefined &&
                        this.returnOrderidNumber(item.bookOneOrderId).indexOf(
                            this.returnOrderidNumber(val)
                        ) > -1) ||
                    (item.orderedDate != null &&
                        this.dateService
                            .convertMillisecondsToDateFormat(item.orderedDate)
                            .indexOf(val.trim()) > -1) ||
                    (item.requiredDate != null &&
                        this.dateService
                            .convertMillisecondsToDateFormat(item.requiredDate)
                            .indexOf(val.trim()) > -1);

                return searchResult;
            });
        }
    }

    returnOrderidNumber(bookoneOrderId) {
        var res = bookoneOrderId.replace(/\D/g, "");
        return res;
    }

    clear(event) {}

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    dashboard() {
        this.navCtrl.navigateRoot("order-dashboard");
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

    onHome() {
        this.navCtrl.navigateRoot(["service-dashboard"]);
    }

    menuAction() {
        this.menuCtrl.toggle();
    }

    async onMenu() {
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
                    text: "KOT",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("kot-list");
                    },
                },
                {
                    text: "Order Dashboard",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("order-dashboard");
                    },
                },
            ],
        });
        await actionSheet.present();
    }
    goToKotPage(){
        this.navCtrl.navigateRoot("kot-list");
    }

    filterByDropdown() {
        // Logger.log('sddd'+this.OrderStatus+'All '+ this.ModeOfPayment +' All ' + this.DeliveryMethod);
        let searchResult;

        if (
            this.OrderStatus === "All" &&
            this.ModeOfPayment === "All" &&
            this.DeliveryMethod === "All" &&
            this.bserviceid === "0" &&
            this.ResourceName === "All" &&
            this.LocationName === "All"
        ) {
            this.orders = this.OrderSearchObject;
            this.UIDetectChange();
        } else {
            this.orders = this.OrderSearchObject;
            this.orders = this.orders.filter((item) => {
                searchResult =
                    (this.OrderStatus === "All" ||
                        (this.OrderStatus != "All" &&
                            item.orderStatus != null &&
                            item.orderStatus != undefined &&
                            item.orderStatus.toLowerCase() ===
                                this.OrderStatus.toLowerCase())) &&
                    (this.ModeOfPayment === "All" ||
                        (item.modeOfPayment != null &&
                            item.modeOfPayment != undefined &&
                            this.ModeOfPayment != "All" &&
                            item.modeOfPayment.toLowerCase() ===
                                this.ModeOfPayment.toLowerCase())) &&
                    (this.ResourceName === "All" ||
                        (item.resourceName != null &&
                            item.resourceName != undefined &&
                            this.ResourceName != "All" &&
                            item.resourceName
                                .split(",")
                                .includes(this.ResourceName) === true)) &&
                    (this.LocationName === "All" ||
                        (item.locationName != null &&
                            item.locationName != undefined &&
                            this.LocationName != "All" &&
                            item.locationName
                                .split(",")
                                .includes(this.LocationName) === true)) &&
                    (this.bserviceid === "0" ||
                        (item.businessServiceId != null &&
                            item.businessServiceId != undefined &&
                            this.bserviceid != "0" &&
                            item.businessServiceId === this.bserviceid)) &&
                    (this.DeliveryMethod === "All" ||
                        (this.DeliveryMethod != "All" &&
                            item.deliveryMethod != null &&
                            item.deliveryMethod != undefined &&
                            item.deliveryMethod.toLowerCase() ===
                                this.DeliveryMethod.toLowerCase()));

                return searchResult;
            });

            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
            this.UIDetectChange();
        }
    }
}
