import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { BusinessServiceDtoList } from 'src/app/model/business-service/businessServiceDtoList';
import { BusinessUser } from 'src/app/model/businessUser';
import { Booking } from 'src/app/model/manage-booking/Booking/Booking';
import { Payment } from 'src/app/model/manage-booking/Payment/Payment';
import { BusinessProperties } from 'src/app/model/Order/businessProperties';
import { Order } from 'src/app/model/Order/order';
import { PointOfSale } from 'src/app/model/Pos/pointOfSale';
import { Property } from 'src/app/model/property/Property';
import { ExpenseService, ExpenseSummary } from 'src/app/service/ExpenseService/expense-service.service';
import { OrderService } from 'src/app/service/Order/order.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { ReportService } from 'src/app/service/report/report-service.service';
import { TokenStorage } from 'src/app/token.storage';
import { BookingData } from '../order/checkout/checkout.page';
import { ReservationService } from 'src/app/service/ReservationService/reservation-service.service';

@Component({
  selector: 'app-service-order-report',
  templateUrl: './service-order-report.page.html',
  styleUrls: ['./service-order-report.page.scss'],
})
export class ServiceOrderReportPage implements OnInit {
  // @ViewChild('circleCanvas') circleCanvas;
  @ViewChild("circleCanvas", { static: false }) circleCanvas: ElementRef;
  property: Property;
  businessServiceList: BusinessServiceDtoList[] = [];
  businessService: BusinessServiceDtoList;
  bserviceid: number;
  serviceName: string;
  orderFilterData: Order[];
  orders: Order[];
  paymentRecordsFilterByBusinessService: Payment[] = [];
  paymentRecordsFilterObjs: Payment[] = [];
  dyneInOrders: Order[];
  takeAwayOrders: Order[];
  roomOrders: Order[];
  homeDeliveryOrders: Order[];
  cancelledOrders: Order[];
  BusinesService: FormControl = new FormControl();
  FromDateController: FormControl = new FormControl();
  loader: boolean = false;
  propertiesDto: BusinessProperties;
  selectedDateString: string;
  paymentRecords: Payment[] = [];
  propertyId: number;
  expenseSummaries: ExpenseSummary[] = [];
  totalExpense: number = 0;
  currency: string;
  pointOfSaleList: PointOfSale[];
  serviceSelected = false;
  booking: Booking;
  bookings: Booking[] = [];

  bookingdata: BookingData[];
  bookingFilter: any[] = [];
  allBusinessDetails: any[] ;


  constructor(
    public token: TokenStorage,
    public menuCtrl: MenuController,
    private changeDetectorRefs: ChangeDetectorRef,
    private orderService: OrderService,
    private reportService: ReportService,
    private expenseService: ExpenseService,
    private propertyService: PropertyService,
    public datepipe: DatePipe,
    private reservationService: ReservationService,
    private navCtrl: NavController,
  ) {
    this.property = new Property();
    this.propertiesDto = new BusinessProperties();
    this.businessService = new BusinessServiceDtoList();
  }

  ngOnInit() {
    this.property = this.token.getProperty();
    this.propertyId = this.token.getProperty().id;
    if (
      this.property.localCurrency != null &&
      this.property.localCurrency != undefined
    ) {
      this.currency = this.property.localCurrency.toUpperCase();
    }

    this.getAllBusinessService(String(this.propertyId));
    this.getPOSInformation(this.propertyId);
    this.createPieChart();
  }

  ngAfterViewInit() {
    this.createPieChart();
    // console.log("l3")

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.createPieChart();
    }, 2000);

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

  allOperatorsHaveZeroAmount(pos: any): boolean {
    return pos.operatorName.every((op: any) => this.getTotalOperatorPaymentAmount(op) === 0);
  }

  allOperatorsHavecounter(): boolean {
    return this.pointOfSaleList.every((pos: any) => this.getTotalCounterPaymentAmount(pos.counterName) === 0);
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
    this.createPieChart();
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
  filterByDropdownOne() {
    // Logger.log('sddd'+this.OrderStatus+'All '+ this.ModeOfPayment +' All ' + this.DeliveryMethod);
    let searchResult;

    if (
      this.orderFilterData != null &&
      this.orderFilterData != undefined &&
      this.orderFilterData.length > 0
    ) {
      this.orders = this.orderFilterData;

      console.log ("order datassss", JSON.stringify(this.orders) )
      this.orders = this.orders.filter((item) => {
        searchResult =
          item.businessServiceId != null &&
          item.businessServiceId != undefined && 
          
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
            item.businessServiceId != null 

          return searchResult;
        });
    }

    this.filterByOrderMethod();
    this.UIDetectChange();
  }


  setService(bserviceid) {
    this.resetExpenseData();
    // this.businessService = this.businessServiceList.find(
    //   (data) => data.id === bserviceid
    // );
    // console.log("services",JSON.stringify(this.businessService) )
    // this.serviceName = this.businessService.name;
    // this.filterByDropdown();
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
    this.createPieChart();
    this.serviceSelected = !!bserviceid;
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
        this.createPieChart();
        this.UIDetectChange();


        this.todaysOrder();
      },
      (error) => {
        this.loader = false;
        this.UIDetectChange();
      }
    );
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

  getGuestsInHouseToday(propertyId: number) {
    this.bookings = [];
    this.bookingFilter = [];
    this.booking.propertyId = propertyId;
    this.reservationService
      .getGuestInHouseForRoomOrder(propertyId)
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
              for (let j = 0; j < this.bookings[i].roomDetails.length; j++) {
                const data: BookingData = {
                  id: this.bookings[i].id,
                  firstName: this.bookings[i].firstName,
                  lastName: this.bookings[i].lastName,
                  email: this.bookings[i].email,
                  mobile: this.bookings[i].mobile,
                  propertyReservationNumber:
                    this.bookings[i].propertyReservationNumber,
                  roomName: this.bookings[i].roomName,
                  roomNumber: this.bookings[i].roomDetails[j].roomNumber,
                  customerId: this.bookings[i].customerId,
                  isGroupBooking: false,
                  bookingOb: this.bookings[i],
                };
                this.bookingdata.push(data);
              }
            } else {
              for (let j = 0; j < this.bookings[i].roomDetails.length; j++) {
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
                      this.bookings[i].propertyReservationNumber,
                    roomName: this.bookings[i].roomName,
                    roomNumber: this.bookings[i].roomDetails[j].roomNumber,
                    isGroupBooking: true,
                    customerId: this.bookings[i].roomDetails[j].customerId,
                    bookingOb: this.bookings[i],
                  };
                  this.bookingdata.push(data);
                  this.createPieChart();
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
          this.createPieChart();
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
        this.createPieChart();

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

    if (
      this.orderFilterData != null &&
      this.orderFilterData != undefined &&
      this.orderFilterData.length > 0
    ) {
      this.orders = this.orderFilterData;
      console.log ("order data", JSON.stringify(this.orders) )
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

  menuAction() {
    this.navCtrl.navigateForward(['/order-reports']);
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
  shouldShowPieChart(): boolean {
    const totalPaid = this.getTotalPaymentAmountByStatus('Paid');
    const totalNotPaid = this.getTotalPaymentAmountByStatus('NotPaid');
    const totalAmount = totalPaid + totalNotPaid;
    const values = [totalPaid, totalNotPaid];

    if (!values.every((value) => value === 0)) {
      setTimeout(() => {
        this.createPieChart();
      }, 0);
    }

    return !values.every((value) => value === 0);
  }

  createPieChart() {
    const totalPaid = this.getTotalPaymentAmountByStatus('Paid');
    const totalNotPaid = this.getTotalPaymentAmountByStatus('NotPaid');
    // console.log("total paid", totalPaid);
    // console.log("not total paid", totalNotPaid);
    if (
      totalPaid > 0 ||
      totalNotPaid > 0
    ) {
      
      const canvas: HTMLCanvasElement = this.circleCanvas?.nativeElement;
      // console.log("canvas: " + canvas);

      const ctx: CanvasRenderingContext2D = canvas?.getContext("2d");
      const values = [totalPaid, totalNotPaid];
      const colors = ["#5AB3CF", "#D16562"];
      const total = values.reduce((acc, val) => acc + val, 0);
      // console.log("total values" + total)
      canvas.width = canvas.height = 200;
      let startAngle = 0;

      for (let i = 0; i < values.length; i++) {
        values[i] = Math.max(values[i], 0);
        const percentage = values[i] / total;
        const endAngle = startAngle + 2 * Math.PI * percentage;
        const midAngle = startAngle + (endAngle - startAngle) / 2;

        // Outer circle
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2,
          startAngle,
          endAngle
        );
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.closePath();

        // Draw number in the middle of the segment
        const textX =
          canvas.width / 2 + (canvas.width / 3) * Math.cos(midAngle);
        const textY =
          canvas.height / 2 + (canvas.width / 2.5) * Math.sin(midAngle);
        if (values[i] !== 0) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(values[i].toString(), textX, textY);
        }

        startAngle = endAngle;
      }

      // Inner circle (to create space)
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 4,  // Adjust this value to change the inner circle size
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }


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

}
