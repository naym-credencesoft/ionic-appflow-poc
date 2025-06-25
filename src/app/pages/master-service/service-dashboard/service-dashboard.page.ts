import { ChangeDetectorRef, Component, OnInit, ViewRef } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import {
    ActionSheetController,
    MenuController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { BusinessServiceTypes } from "src/app/model/business-service/businessServiceTypes";
import { Property } from "src/app/model/property/Property";
import { Order } from "../../../model/Order/order";
import { BusinessService } from "../../../model/Reservation/businessServic";
import { Slot } from "../../../model/Reservation/slot";
import { SlotReservation } from "../../../model/Reservation/slotReservation";
import { DateService } from "../../../service/DateService/date-service.service";
import { Logger } from "../../../service/logger.service";
import { OrderService } from "../../../service/Order/order.service";
import { ReservationService } from "../../../service/ReservationService/reservation-service.service";
import { TokenStorage } from "../../../token.storage";
import { CheckUserType } from "src/app/model/checkUserType";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { FormControl } from "@angular/forms";
import { ExpenseService, ExpenseSummary } from "src/app/service/ExpenseService/expense-service.service";
import { BusinessServiceDtoList } from "src/app/model/business-service/businessServiceDtoList";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { BusinessProperties } from "src/app/model/Order/businessProperties";
import { DatePipe } from "@angular/common";
import { ReportService } from "src/app/service/report/report-service.service";
import { PointOfSale } from "src/app/model/Pos/pointOfSale";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { BookingData } from "../../order/checkout/checkout.page";
import { PropertyService } from "src/app/service/property/property.service";

export class ReservationData {
    slot: any;
    date: any;
    slotTime: any;
}

@Component({
    selector: "app-service-dashboard",
    templateUrl: "./service-dashboard.page.html",
    styleUrls: ["./service-dashboard.page.scss"],
})
export class ServiceDashboardPage implements OnInit {
    property: Property;
    businessServiceList: BusinessServiceDtoList[] = [];
  businessService: BusinessServiceDtoList;
    slotDateLists: any[] = [];
    dateNotFound: boolean = false;
    selectedIndex: number = 0;
    reservationData: ReservationData;
    selectedTab: string = 'none';
    homeDeliveryOrders: Order[];
    cancelledOrders: Order[];
    dyneInOrders: Order[];
    takeAwayOrders: Order[];
    cookingOrders: Order[];
    roomOrders: Order[];
    roomOrder: Order;
    selectedCol: string = '';
    bserviceid: number;


    BusinesService: FormControl = new FormControl();
    FromDateController: FormControl = new FormControl();

    slot: Slot;
    loader: boolean = false;
    businessServiceIdValue: number;
    service: any;
    dateSelected: string;

    isServiceSelected: boolean = false;
    isDateFound: boolean = false;
    isDateSelected: boolean = false;
    minDate: string;
    maxDate: string;

    orders: Order[];
    OrderSearchObject: Order[];
    segment = 1;
    p: number = 1;
    q: number = 1;

    iIndex: any;
    plan: string;

    isNewReservation: boolean = false;
    isNewOrder: boolean = false;
    isBookingManagement: boolean = false;
    isKOT: boolean = false;
    isBusinessProfile: boolean = false;
    isPropertyManagement: boolean = false;
    isRoomManagement: boolean = false;
    isRateAndAvailability: boolean = false;
    isServiceManagement: boolean = false;
    isProductManagement: boolean = false;
    isPaymentManagement: boolean = false;
    isExpenseManagement: boolean = false;
    isCustomerManagement: boolean = false;
    isInvoiceManagement: boolean = false;
    isReport: boolean = false;
    isFoodGroceryReports: boolean = false;
    isExternalReservation: boolean = false;
    isAccomodationDashboard: boolean = false;
    isCaseManagement: boolean = false;
    isSupplier: boolean = false;
    isInventory: boolean = false;
    isPurchaseOrder: boolean = false;
    isBusinessLead: boolean = false;
    isBusinessPromotion: boolean = false;
    isHRM: boolean = false;
    expenseSearchSelection: string = "";
    checkUserType: CheckUserType;
    role: any[];
    roleArray: any;
    businessType: string;
    businessPlan: string;

    subscriptionSelected: any[];
    userData: ApplicationUser;
    propertyId: number;
    expenseSummaries: ExpenseSummary[] = [];
  totalExpense: number = 0;

  serviceName: string;
  paymentRecordsFilterByBusinessService: Payment[] = [];
  serviceSelected = false;
  paymentRecords: Payment[] = [];
  propertiesDto: BusinessProperties;
  selectedDateString: string;
  paymentRecordsFilterObjs: Payment[] = [];
  orderFilterData: Order[];
  currency: string;

  pointOfSaleList: PointOfSale[];

  booking: Booking;
  bookings: Booking[] = [];

  bookingdata: BookingData[];
  bookingFilter: any[] = [];
  allBusinessDetails: any[] ;


    constructor(
        private reservationService: ReservationService,
        private orderService: OrderService,
        public token: TokenStorage,
        public menuCtrl: MenuController,
        private navCtrl: NavController,
        public dateService: DateService,
        private bookingService: BookingService,
        private toastController: ToastController,
        private actionSheetController: ActionSheetController,
        private authService: AuthService,
        private changeDetectorRefs: ChangeDetectorRef,
        public datepipe: DatePipe,
        private expenseService: ExpenseService,
        private reportService: ReportService,
        private propertyService: PropertyService,
        private router: Router,
    ) {
        this.slot = new Slot();
        this.businessService = new BusinessServiceDtoList();
        this.property = new Property();
        this.checkUserType = new CheckUserType();
        this.userData = new ApplicationUser();
        this.propertiesDto = new BusinessProperties();
        
    }

    ngOnInit() {

        this.property = this.token.getProperty();
        this.propertyId = this.token.getProperty().id;
        // this.plan = this.token.getProperty().plan;
        this.getAllBusinessService(String(this.propertyId));
        if (
            this.property.localCurrency != null &&
            this.property.localCurrency != undefined
          ) {
            this.currency = this.property.localCurrency.toUpperCase();
          }

        this.role = [];
        console.log("qwertyuiop", this.dyneInOrders);
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });

        const filters = {
            roles: (roles) =>
                roles.find((x) => this.roleArray.includes(x.toUpperCase())),
        };

        if (this.token.getProperty() !== null) {
            this.businessType = this.token.getProperty().businessType;
            this.businessPlan = this.token.getProperty().plan;

            if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
                this.getSubscriptionFormTokenStorage(
                    String(this.token.getProperty().id)
                );
                this.propAdminAccess();
            } else if (this.checkUserType.isFontDesk(this.role[0]) == true) {
                this.fontDeskAccess();
            } else if (
                this.checkUserType.isServiceRestaurant(this.role[0]) == true
            ) {
                this.restaurantServiceAccess();
            } else if (this.checkUserType.isManager(this.role[0]) == true) {
                this.propManagerAccess();
            } else if (this.checkUserType.isPropFinance(this.role[0]) == true) {
                this.propFinenceAccess();
            } else if (
                this.checkUserType.isHouseKeeping(this.role[0]) == true
            ) {
                this.houseKeeingAccess();
            } else if (
                this.checkUserType.isMarketingManager(this.role[0]) == true
            ) {
                this.MarketingManagerAccess();
            } else if (this.checkUserType.isFontDeskEx(this.role[0]) == true) {
                this.FontDeskExecutiveAccess();
            } else if (
                this.checkUserType.isSeviceExecutive(this.role[0]) == true
            ) {
                this.serviceExecutiveAccess();
            }

            if (
                this.checkUserType.isSoftwareConsulting(this.businessType) ===
                true
            ) {
                this.isCaseManagement = true;
            }
        }

        this.getUserData();
        this.getPOSInformation(this.propertyId);
        // this.getOrderListByPropertyId(Number(this.token.getPropertyId()));
    }
    

    ionViewWillEnter() {

      this.selectedCol = '';
      this.refresh();
      this.menuCtrl.enable(true, 'start');
  }
  ionViewDidEnter() {
    this.refresh();
    this.menuCtrl.enable(true, 'start');
  }

  ngAfterViewInit() {
    // Ensure menu is properly initialized
    this.menuCtrl.enable(true, 'start');
  }


  refresh(){
    this.getAllBusinessService(String(this.propertyId));
      this.totalOrder();
      this.totalTableOrder();
      this.totalTAOrder();
      this.totalRoomOrder();
      this.totalTableOrderPrice();
      this.totalTableOrderPrice();
     this.getTotalRoomAmount();
      this.getTotalTAAmount();
      this.getTotalSalesAmount();
  }

    allOperatorsHaveZeroAmount(pos: any): boolean {
        return pos.operatorName.every((op: any) => this.getTotalOperatorPaymentAmount(op) === 0);
      }
    
      allOperatorsHavecounter(): boolean {
        return this.pointOfSaleList.every((pos: any) => this.getTotalCounterPaymentAmount(pos.counterName) === 0);
      }
      serviceDashboard() {
        this.debounce(() => {
          this.navCtrl.navigateForward('service-dashboard');
        }, 300)();
      }

    
      getTotalCounterPaymentAmount(counterName: string) {
        let sum = 0;
    
        if (
          this.getCounter(counterName) != null &&
          this.getCounter(counterName) != undefined &&
          this.getCounter(counterName).length > 0
        ) {
          for (let i = 0; i < this.getCounter(counterName).length; i++) {
            sum = sum + this.getCounter(counterName)[i].totalOrderAmount;
          }
        }
        return sum;
      }
    
      getCounter(counterName: string) {
        let orderData = [];
        if (
          this.orders != null &&
          this.orders != undefined &&
          this.orders.length > 0
        ) {
          orderData = this.orders.filter((item) => {
            const searchResult =
              item.counterName != null && item.counterName === counterName;
    
            return searchResult;
          });
        }
    
        return orderData;
      }
    
    
      dateChange() {
        this.resetExpenseData();
        let date = new Date(this.selectedDateString);
        //date.setDate(date.getDate() + 1);
    
        let fromdate = this.datepipe.transform(new Date(this.selectedDateString).getTime(), "yyyy-MM-dd");
        let todate = this.datepipe.transform(date.getTime(), "yyyy-MM-dd");
    
        this.getOrderByPropertyIdAndDateRange(
          String(this.propertyId),
          fromdate,
          todate
        );

        // this.getGuestsInHouseToday(this.propertyId);
        this.getAllPaymentsByPropertyIdAndDateRange(
          String(this.propertyId),
          fromdate,
          todate
        );
        this.getBookingExpense(this.propertyId.toString(), fromdate, todate);
    
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
    
      totalTableOrderPrice() {
        this.loader= true;
        let sum = 0;
        if (
          this.dyneInOrders != null &&
          this.dyneInOrders != undefined &&
          this.dyneInOrders.length > 0
        ) {
          for (let i = 0; i < this.dyneInOrders.length; i++) {
            sum = sum + this.getValue(this.dyneInOrders[i].totalOrderAmount);
          }
        }
        this.loader= false;
        return sum;
      }
    
      getValue(value) {
        if (value != null && value != undefined) {
          return value;
        }
        else {
          return 0;
        }
    
      }
    
      getTotalSalesAmount(): number {
        let dineInOrInstore = 0;
      
        if (this.checkRestaurantService() === true) {
          dineInOrInstore = this.totalTableOrderPrice();  // Dine In
        } else {
          dineInOrInstore = this.totalTableOrderPrice();  // Instore
        }
      
        const room = this.getTotalRoomAmount();
        const takeaway = this.getTotalTAAmount();
        // const delivery = this.getTotalHDAmount();
      
        return dineInOrInstore + room + takeaway ;
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
    
      getDyneINText() {
        if (this.checkRestaurantService() === true) {
          return "Dine In";
        } else {
          return "Instore";
        }
      }
    
      checkRestaurantService() {
        if (
          (this.businessService != null &&
            this.businessService != undefined &&
            this.businessService.name != null &&
            this.businessService.name != undefined &&
            this.businessService.name.toLocaleLowerCase() === "restaurants") ||
          (this.businessService != null &&
            this.businessService != undefined &&
            this.businessService.name != null &&
            this.businessService.name != undefined &&
            this.businessService.name.toLocaleLowerCase() === "cafes") ||
          (this.businessService != null &&
            this.businessService != undefined &&
            this.businessService.name != null &&
            this.businessService.name != undefined &&
            this.businessService.name.toLocaleLowerCase() === "bar")
        ) {
          return true;
        } else {
          return false;
        }
      }
    
    
    
      setService(bserviceid) {
        this.resetExpenseData();
       

        if (this.bserviceid == 0){
          this.allBusinessDetails = this.businessServiceList;
          console.log("service id", this.bserviceid)
          this.filterByDropdownOne();
        } else{
          this.businessService = this.businessServiceList.find(
            (data) => data.id === bserviceid
          );
          this.filterByDropdown();
          
        }
        this.serviceName = this.businessService?.name;
        this.serviceSelected = !!bserviceid;
      }
    

    getPOSInformation(propertyId: number) {
        this.loader = true;
        this.pointOfSaleList = [];
        this.propertyService.getAllPointOfSale(propertyId).subscribe(
          (data) => {
            this.pointOfSaleList = data;
            this.loader = false;
    
            this.UIDetectChange();
          },
          (error) => {
            this.loader = false;
          }
        );
      }

    selectCol(col: string) {
        this.selectedCol = this.selectedCol === col ? '' : col;
    }

    getUserData() {
        const UserId = this.token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(
            (data) => {
                this.userData = data.body;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => { }
        );
    }

    resetExpenseData() {
        this.totalExpense = 0;
        this.expenseSummaries = [];
        this.dyneInOrders =[];
        this.roomOrders =[];
        this.takeAwayOrders=[];
        this.homeDeliveryOrders = [];
        this.paymentRecordsFilterByBusinessService = [];
      }



      getAllBusinessService(PropertyId: string) {
        this.loader = true;
        this.orderService.findByPropertyId(PropertyId).subscribe(
          (data) => {
            this.propertiesDto = data.body;
    
            this.loader = false;
    
            this.businessServiceList = [];
    
            if (this.propertiesDto.businessServiceDtoList.length > 0) {
              this.businessServiceList = this.propertiesDto.businessServiceDtoList;
              // this.bserviceid =  this.businessServiceList[0].id;
              // this.businessService = this.businessServiceList[0];
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
                this.bserviceid = this.propertiesDto.businessServiceDtoList[0].id;
                this.setService(this.propertiesDto.businessServiceDtoList[0].id);
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


      todaysOrder() {
        let date = new Date();
        //date.setDate(date.getDate() + 1);
        let fromdate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
        let todate = this.datepipe.transform(date.getTime(), "yyyy-MM-dd");
    
        this.selectedDateString = fromdate;
    
        this.getOrderByPropertyIdAndDateRange(
          String(this.propertyId),
          fromdate,
          todate
        );
        // this.getGuestsInHouseToday(this.propertyId);
        this.getAllPaymentsByPropertyIdAndDateRange(
          String(this.propertyId),
          fromdate,
          todate
        );
        // this.getBookingExpense(this.propertyId.toString(), fromdate, todate);
      }

      getAllPaymentsByPropertyIdAndDateRange(
        propertyId: string,
        formDate: string,
        toDate: string
      ) {
        this.loader = true;
        this.paymentRecordsFilterByBusinessService = [];
        this.paymentRecords = [];
        this.paymentRecordsFilterObjs = [];
        this.reportService
          .getAllPaymentsByPropertyIdAndDateRange(propertyId, formDate, toDate, "")
          .subscribe(
            (data) => {
              this.paymentRecords = data;
              this.paymentRecordsFilterObjs = data;
    
              this.filterByDropdown();
              this.loader = false;
              this.changeDetectorRefs.detectChanges();
    
            },
            (error) => {
              this.loader = false;
            }
          );
      }

      getBookingExpense(propertyId: string, formDate: string, toDate: string) {
        this.loader = true;
        this.resetExpenseData();
        this.expenseService
          .findByPropertyIdAndDateRange(propertyId, formDate, toDate)
          .subscribe(
            (data) => {
              for (let num = 0; num < data.length; num++) {
                const expenseSummary: ExpenseSummary = {
                  name: data[num].name,
                  amount: data[num].amount,
                };
                this.expenseSummaries.push(expenseSummary);
              }
    
              this.getTotalExpense();
    
              this.loader = false;
              this.changeDetectorRefs.detectChanges();
            },
            (error) => {
              this.loader = false;
            }
          );
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
          this.paymentRecordsFilterByBusinessService != null &&
          this.paymentRecordsFilterByBusinessService != undefined &&
          this.paymentRecordsFilterByBusinessService.length > 0
        ) {
          orderData = this.paymentRecordsFilterByBusinessService.filter((item) => {
            const searchResult =
              item.paymentMode != null && item.paymentMode === paymentMode;
    
            return searchResult;
          });
        }
    
        return orderData;
      }
    
      getTotalExpense() {
    
        this.totalExpense = this.expenseSummaries
          .map((t) => t.amount)
          .reduce((acc, value) => acc + value, 0);
        // this.totalExpenseEmit.emit(this.totalExpense);
        return this.totalExpense;
      }
    
      getTotalOperatorPaymentAmount(operatorName: string) {
        let sum = 0;
    
        if (
          this.getOperatorName(operatorName) != null &&
          this.getOperatorName(operatorName) != undefined &&
          this.getOperatorName(operatorName).length > 0
        ) {
          for (let i = 0; i < this.getOperatorName(operatorName).length; i++) {
            sum = sum + this.getOperatorName(operatorName)[i].totalOrderAmount;
          }
        }
        return sum;
      }
    
      getOperatorName(operatorName: string) {
        let orderData = [];
        if (
          this.orders != null &&
          this.orders != undefined &&
          this.orders.length > 0
        ) {
          orderData = this.orders.filter((item) => {
            const searchResult =
              item.operatorName != null && item.operatorName === operatorName;
    
            return searchResult;
          });
        }
    
        return orderData;
      }
    
    
      getOrderByPropertyIdAndDateRange(
        propertyId: string,
        formDate: string,
        toDate: string
      ) {
        this.loader = true;
        this.UIDetectChange();
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
    
      filterByDropdownOne() {
        // Logger.log('sddd'+this.OrderStatus+'All '+ this.ModeOfPayment +' All ' + this.DeliveryMethod);
        let searchResult;
    
        if (
          this.orderFilterData != null &&
          this.orderFilterData != undefined &&
          this.orderFilterData.length > 0
        ) {
          this.orders = this.orderFilterData;

          
          this.orders = this.orders.filter((item) => {
            searchResult =
              item.businessServiceId != null &&
              item.businessServiceId != undefined && 
              
              item.orderStatus != null &&
              item.orderStatus.indexOf("Cancelled") == -1;
    
            return searchResult;
          });
 
        }
        this.paymentRecordsFilterByBusinessService = [];
        if (
          this.paymentRecordsFilterObjs != null &&
          this.paymentRecordsFilterObjs != undefined &&
          this.paymentRecordsFilterObjs.length > 0
        ) {
          this.paymentRecordsFilterByBusinessService =
            this.paymentRecordsFilterObjs;
          this.paymentRecordsFilterByBusinessService =
            this.paymentRecordsFilterByBusinessService.filter((item) => {
              const searchResult =
                item.businessServiceId != null 
    
              return searchResult;
            });
        }
    
        this.filterByOrderMethod();
        this.UIDetectChange();
      }
      filterByDropdown() {
        // Logger.log('sddd'+this.OrderStatus+'All '+ this.ModeOfPayment +' All ' + this.DeliveryMethod);
        let searchResult;
    
        if (
          this.orderFilterData != null &&
          this.orderFilterData != undefined &&
          this.orderFilterData.length > 0
        ) {
          this.orders = this.orderFilterData;
         
          this.orders = this.orders.filter((item) => {
            searchResult =
              item.businessServiceId != null &&
              item.businessServiceId != undefined && 
              this.bserviceid != null &&
              this.bserviceid != undefined && 
              item.businessServiceId === this.bserviceid &&
              item.orderStatus != null &&
              item.orderStatus.indexOf("Cancelled") == -1;
    
            return searchResult;
          });
    
          console.log ("search result",JSON.stringify(searchResult))
        }
        this.paymentRecordsFilterByBusinessService = [];
        if (
          this.paymentRecordsFilterObjs != null &&
          this.paymentRecordsFilterObjs != undefined &&
          this.paymentRecordsFilterObjs.length > 0
        ) {
          this.paymentRecordsFilterByBusinessService =
            this.paymentRecordsFilterObjs;
          this.paymentRecordsFilterByBusinessService =
            this.paymentRecordsFilterByBusinessService.filter((item) => {
              const searchResult =
                item.businessServiceId != null &&
                item.businessServiceId === this.bserviceid;
    
              return searchResult;
            });
        }
    
        this.filterByOrderMethod();
        this.UIDetectChange();
      }
    
      getExpenseData() {
        this.resetExpenseData();
        this.expenseService
          .findExpenseSummaryByPropertyId(+this.token.getPropertyId())
          .subscribe((resp1) => {
            for (let num = 0; num < resp1.length; num++) {
              const expenseSummary: ExpenseSummary = {
                name: resp1[num][1],
                amount: resp1[num][0],
              };
              this.expenseSummaries.push(expenseSummary);
            }
            this.getTotalExpense();
          });
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
          this.cancelledOrders = this.orderFilterData.filter((item) => {
            const searchResult =
              item.deliveryMethod != null &&
              item.orderStatus.indexOf("Cancelled") > -1;
    
            return searchResult;
          });
        }
      }
    
      getTotalPaymentAmountByStatus(status: string) {
        let sum = 0;
    
        if (
          this.getPaymentDataByStatus(status) != null &&
          this.getPaymentDataByStatus(status) != undefined &&
          this.getPaymentDataByStatus(status).length > 0
        ) {
          for (let i = 0; i < this.getPaymentDataByStatus(status).length; i++) {
            sum = sum + this.getPaymentDataByStatus(status)[i].transactionAmount;
          }
        }
        return sum;
      }
    
      getTotalAmount() {
        let sum = 0;
        if (
          this.paymentRecordsFilterByBusinessService != null &&
          this.paymentRecordsFilterByBusinessService != undefined &&
          this.paymentRecordsFilterByBusinessService.length > 0
        ) {
          for (
            let i = 0;
            i < this.paymentRecordsFilterByBusinessService.length;
            i++
          ) {
            if (
              this.paymentRecordsFilterByBusinessService[i].transactionAmount !=
              null &&
              this.paymentRecordsFilterByBusinessService[i].transactionAmount !=
              undefined
            ) {
              sum =
                sum +
                this.paymentRecordsFilterByBusinessService[i].transactionAmount;
            }
    
      
          }
        }
        return sum;
      }

      
  getPaymentDataByStatus(status: string) {
    let orderData = [];
    if (
      this.paymentRecordsFilterByBusinessService != null &&
      this.paymentRecordsFilterByBusinessService != undefined &&
      this.paymentRecordsFilterByBusinessService.length > 0
    ) {
      orderData = this.paymentRecordsFilterByBusinessService.filter((item) => {
        const searchResult = item.status != null && item.status === status;

        return searchResult;
      });
    }

    return orderData;
  }

  getTotalAmountStatusAndMode(status: string, paymentMode: string) {
    let sum = 0;

    if (
      this.getPaymentDataByStatusAndMode(status, paymentMode) != null &&
      this.getPaymentDataByStatusAndMode(status, paymentMode) != undefined &&
      this.getPaymentDataByStatusAndMode(status, paymentMode).length > 0
    ) {
      for (
        let i = 0;
        i < this.getPaymentDataByStatusAndMode(status, paymentMode).length;
        i++
      ) {
        sum =
          sum +
          this.getPaymentDataByStatusAndMode(status, paymentMode)[i]
            .transactionAmount;
      }
    }
    return sum;
  }

  getPaymentDataByStatusAndMode(status: string, paymentMode: string) {
    let orderData = [];
    if (
      this.paymentRecordsFilterByBusinessService != null &&
      this.paymentRecordsFilterByBusinessService != undefined &&
      this.paymentRecordsFilterByBusinessService.length > 0
    ) {
      orderData = this.paymentRecordsFilterByBusinessService.filter((item) => {
        const searchResult =
          item.status != null &&
          item.status === status &&
          item.paymentMode != null &&
          item.paymentMode === paymentMode;

        return searchResult;
      });
    }

    return orderData;
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
    expenseChanged() {
        if (this.expenseSearchSelection === "findExpese") {
            // this.expenses = [];
            // this.expensesSearchObject = [];
            // this.currentExpense();
        } else if (this.expenseSearchSelection === "allExpense") {
            // this.findExpense();
        }
    }

    getSubscriptionFormTokenStorage(propertyId: string) {
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
                        if (
                            this.subscriptionSelected != null &&
                            this.subscriptionSelected != undefined &&
                            this.subscriptionSelected.length > 0
                        ) {
                            for (
                                let i = 0;
                                i < this.subscriptionSelected.length;
                                i++
                            ) {
                                if (
                                    this.subscriptionSelected[i].name ===
                                    "Guest Management"
                                ) {
                                }
                                if (
                                    this.subscriptionSelected[i].name ===
                                    "Service Management"
                                ) {
                                }
                                if (
                                    this.subscriptionSelected[i].name ===
                                    "Business Setup"
                                ) {
                                }
                                if (
                                    this.subscriptionSelected[i].name === "HRM"
                                ) {
                                    this.isHRM = true;
                                }

                                if (
                                    this.subscriptionSelected[i].name ===
                                    "Accommodation Reports" ||
                                    this.subscriptionSelected[i].name ===
                                    "Food & Grocery Reports"
                                ) {
                                    this.isFoodGroceryReports = true;
                                }
                            }
                        }
                    }
                },
                (error) => { }
            );
    }

    serviceExecutiveAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = false;
        this.isBookingManagement = false;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = false;
        this.isRateAndAvailability = false;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = false;
        this.isExpenseManagement = false;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = false;
        this.isHRM = false;
        this.isAccomodationDashboard = false;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }
    MarketingManagerAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = false;
        this.isNewOrder = false;
        this.isKOT = false;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = false;
        this.isRateAndAvailability = true;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = false;
        this.isExpenseManagement = false;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = false;
        this.isReport = false;
        this.isHRM = false;
        this.isAccomodationDashboard = false;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = true;
        this.isBusinessLead = true;
    }
    houseKeeingAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = false;
        this.isNewOrder = false;
        this.isKOT = false;
        this.isBookingManagement = false;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = true;
        this.isRateAndAvailability = false;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = false;
        this.isExpenseManagement = false;
        this.isCustomerManagement = false;
        this.isInvoiceManagement = false;
        this.isReport = true;
        this.isHRM = false;
        this.isAccomodationDashboard = true;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }
    propFinenceAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = true;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = true;
        this.isRoomManagement = true;
        this.isRateAndAvailability = true;
        this.isServiceManagement = true;
        this.isProductManagement = true;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = true;
        this.isHRM = true;
        this.isAccomodationDashboard = true;
        this.isSupplier = true;
        this.isInventory = true;
        this.isPurchaseOrder = true;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }
    propManagerAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = true;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = true;
        this.isRoomManagement = true;
        this.isRateAndAvailability = true;
        this.isServiceManagement = true;
        this.isProductManagement = true;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = true;
        this.isHRM = true;
        this.isAccomodationDashboard = true;
        this.isSupplier = true;
        this.isInventory = true;
        this.isPurchaseOrder = true;
        this.isBusinessPromotion = false;
        this.isBusinessLead = true;
    }
    restaurantServiceAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = true;
        this.isBookingManagement = false;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = false;
        this.isRateAndAvailability = false;
        this.isServiceManagement = true;
        this.isProductManagement = true;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = false;
        this.isReport = true;
        this.isHRM = false;
        this.isAccomodationDashboard = false;
        this.isSupplier = true;
        this.isInventory = true;
        this.isPurchaseOrder = true;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }
    fontDeskAccess() {
        this.isCaseManagement = true;
        this.isNewReservation = false;
        this.isNewOrder = true;
        this.isKOT = false;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = true;
        this.isRoomManagement = true;
        this.isRateAndAvailability = true;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = true;
        this.isHRM = false;
        this.isAccomodationDashboard = true;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }

    FontDeskExecutiveAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = false;
        this.isNewOrder = true;
        this.isKOT = false;
        this.isBookingManagement = true;
        this.isBusinessProfile = false;
        this.isPropertyManagement = false;
        this.isRoomManagement = false;
        this.isRateAndAvailability = true;
        this.isServiceManagement = false;
        this.isProductManagement = false;
        this.isPaymentManagement = false;
        this.isExpenseManagement = false;
        this.isCustomerManagement = false;
        this.isInvoiceManagement = false;
        this.isReport = true;
        this.isHRM = false;
        this.isAccomodationDashboard = true;
        this.isSupplier = false;
        this.isInventory = false;
        this.isPurchaseOrder = false;
        this.isBusinessPromotion = false;
        this.isBusinessLead = false;
    }

    propAdminAccess() {
        this.isCaseManagement = false;
        this.isNewReservation = true;
        this.isNewOrder = true;
        this.isKOT = true;
        this.isBookingManagement = true;
        this.isBusinessProfile = true;
        this.isPropertyManagement = true;
        this.isRoomManagement = true;
        this.isRateAndAvailability = true;
        this.isServiceManagement = true;
        this.isProductManagement = true;
        this.isPaymentManagement = true;
        this.isExpenseManagement = true;
        this.isCustomerManagement = true;
        this.isInvoiceManagement = true;
        this.isReport = true;
        this.isHRM = true;
        this.isAccomodationDashboard = true;
        this.isSupplier = true;
        this.isInventory = true;
        this.isPurchaseOrder = true;
        this.isBusinessPromotion = false;
        this.isBusinessLead = true;
    }



  
    onTabSelected(event: any) {
        const selectedButton = event.target;
        selectedButton.style.background = 'orange';
    }




    async onMenuOrder(row) {
        const actionSheet = await this.actionSheetController.create({
            header: "Manage Order",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                // {
                //     text: 'Close',
                //     role: 'cancel',
                //     icon :'close',
                //     handler: () => {

                //         actionSheet.dismiss();
                //     }
                // },
                {
                    text: "Details",
                    icon: "document",
                    handler: () => {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                orderId: row.id,
                            },
                        };

                        this.navCtrl.navigateForward(
                            ["order-details"],
                            navigationExtras
                        );
                    },
                },
                {
                    text: "Confirm Order",
                    icon: "checkmark",
                    handler: () => {
                        if (
                            row.orderStatus != "Confirmed" &&
                            row.orderStatus != "Cancelled"
                        ) {
                        } else {
                            this.presentToast(
                                "You can not confirm this order this moment"
                            );
                        }
                    },
                },
                {
                    text: "Cancel Order",
                    icon: "close",
                    handler: () => {
                        if (row.orderStatus != "Cancelled") {
                        } else {
                            this.presentToast(
                                "You can not cancel this order this moment"
                            );
                        }
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
    async onMenu() {
        const actionSheet = await this.actionSheetController.create({
            header: "Switch Dashboard",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                {
                    text: "Accommodation Dashboard",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("home");
                    },
                },
            ],
        });
        await actionSheet.present();
    }




  

    onNewReservation() {
        this.navCtrl.navigateForward("add-reservation");
    }
    onReservationList() {
        this.navCtrl.navigateForward("reservation-list");
    }
    onManageProductGroup() {
        this.navCtrl.navigateForward("product-group-list");
    }

    onManageProduct() {
        this.navCtrl.navigateForward("manage-product");
    }
    onMangeGuest() {
        this.navCtrl.navigateForward("manage-customer");
    }

    onMangeInvoice() {
        this.navCtrl.navigateForward("invoice-list");
    }

    onOrderList() {
        this.navCtrl.navigateForward("manage-order");
    }

    onOrderReport() {
        this.navCtrl.navigateForward("order-reports");
    }

    onNewOrder() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                // paymentOb: JSON.stringify(payment),
                permission: 1,
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }
    menuAction() {
      this.menuCtrl.toggle('start');
    }


    acDashboard() {
        this.navCtrl.navigateForward("home");
    }

    debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            fn.apply(this, args);
          }, delay);
        };
      }

    onNewBooking() {
        Logger.log("onNewBooking");
        // this.navCtrl.navigateForward('booking');
        this.debounce(() => {
            this.router.navigate(["booking"]);
          }, 300)();
        
    }

  

  
  
}
