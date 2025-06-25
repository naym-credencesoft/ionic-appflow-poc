import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Address } from 'src/app/model/address-checker/Address';
import { BusinessServiceDtoList } from 'src/app/model/business-service/businessServiceDtoList';
import { Order } from 'src/app/model/Order/order';
import { Property } from 'src/app/model/property/Property';
import { OrderService } from 'src/app/service/Order/order.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { KOT } from '../order/KOT';
import { OrderLineDto } from 'src/app/model/Order/orderLineDto';
import { CustomerService } from 'src/app/service/Customer/customer.service';
import { Payment } from 'src/app/model/manage-booking/Payment/Payment';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { OutOfStock_Status } from '../order/status';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { Customer } from 'src/app/model/Customer/customer';
// import { DateService } from 'src/app/service/DateService/date-service.service';A

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.page.html',
  styleUrls: ['./order-invoice.page.scss'],
})
export class OrderInvoicePage implements OnInit {
  orderId: any;
    propertyId: any;
    order: Order;
    total: number = 0;
    paymentDTO: Payment;
    customer: Customer;
    isPropertyLogoAdded: boolean = false;
    subTotalAmount: number = 0;
    payments: Payment[] = [];
    LogoURL: string;
    orderLine: OrderLineDto;
    OutOfStock_Status: string = OutOfStock_Status;
    paymentsPaid: Payment[] = [];
    paymentsFilter: Payment[] = [];
    orderLineList: OrderLineDto[] = [];
    currency: string="INR"
    // customerAddress: CustomerAddress;
    isPaidOrder: boolean = false;
    kotList: KOT[] = [];
    isPartiallyPaidOrder: boolean = false;
    propertyAddress: Address;
    isKotNoteAvailable:boolean = false;
    businessService: BusinessServiceDtoList;
    property: Property;
  constructor( private acRoute: ActivatedRoute,
    private orderService: OrderService,
    public dateService: DateService,

    private paymentService: PaymentService,
    private customerService: CustomerService,

    private propertyService: PropertyService,
  ) {
    this.order = new Order();
    this.paymentDTO = new Payment();
    this.customer = new Customer();
    // this.customerAddress = new CustomerAddress();
    // this.customerAddress = new CustomerAddress();
    this.propertyAddress = new Address();
   }

  ngOnInit() {
    this.acRoute.queryParams.subscribe((params) => {
       
        if (params["orderId"] != undefined) {
          this.orderId = JSON.parse(params["orderId"]);
          this.getOrderByOrderId(this.orderId);
        }
        if (params["propertyId"] != undefined) {
            this.propertyId = JSON.parse(params["propertyId"]);
          this.propertyDetails(this.propertyId);
        }
  
       
      });
  }
  printDocument() {
    window.print();
  }
  getTips()
  {
    return Math.abs(this.getBalanceAmount());
  }
  async getUserInfoById(customerID: string) {
    try {
        // this.loader = true;
        const response = await this.customerService.getCustomerById(customerID).toPromise();
  
        if (response.body != null) {
            this.customer = response.body;
            // this.loader = false;
            // this.changeDetectorRefs.detectChanges();
        }
    } catch (error) {
        console.error("Error:", error);
        // this.loader = false;
    }
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
  getTotalCreditBill() {
    return this.getTotalPaymentAmountByMOP("Credit");
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
  getBalanceAmount() {
    return this.order.totalOrderAmount - this.getTotalPaidPaymentAmount();
  }
  getTotalPaidPaymentAmount() {
    let sum = 0;

    if (
      this.getTotalPaidAmountData() != null &&
      this.getTotalPaidAmountData() != undefined &&
      this.getTotalPaidAmountData().length > 0
    ) {
      for (let i = 0; i < this.getTotalPaidAmountData().length; i++) {
        sum = sum + this.getTotalPaidAmountData()[i].transactionAmount;
      }
    }
    return sum;
  }
  getTotalPaidAmountData() {
    let orderData = [];
    if (
      this.paymentsFilter != null &&
      this.paymentsFilter != undefined &&
      this.paymentsFilter.length > 0
    ) {
      orderData = this.paymentsFilter.filter((item) => {
        const searchResult =
          item.paymentMode != null &&
          item.paymentMode != "BillToRoom" &&
          item.paymentMode != "Credit" &&
          item.status != null &&
          item.status === "Paid";

        return searchResult;
      });
    }

    return orderData;
  }
    async getOrderByOrderId(orderId: number) {
    try {
      
        const data = await this.orderService.getOrderByOrderId(orderId).toPromise();
        this.order = data.body;

        if (this.order != null && this.order != undefined) {
            await this.propertyDetails(this.propertyId);
        }

      if (this.order.kotDtoList != null && this.order.kotDtoList.length > 0) {
        this.kotList = this.order.kotDtoList
        .filter((k) => {
          return k.orderLines.some((ol) => {
            if (ol.notes != null && ol.notes != undefined) {
              this.isKotNoteAvailable = true;
            }
            return (ol.status == null || ol.status === "Available");
          });
        });
      }
        
        if (this.order.customerId != null && this.order.customerId != undefined) {
            // await this.getUserInfoById(this.order.customerId.toString());
        }

        if (this.order.customerId != null && this.order.customerId != undefined) {
            // await this.getCustomerAddress(String(this.order.customerId));
        }

        if (this.order.deliveryMethod != "Room Order") {
            if (this.order.bookOneOrderId != null && this.order.bookOneOrderId != undefined) {
                await this.getPaymentByRevId(this.order.bookOneOrderId);
            }
        } else {
            if (this.order.bookingId != null && this.order.bookingId != undefined) {
                // await this.getBookingById();
            }
        }

        this.orderLineList = [];

        for (let i = 0; i < this.order.orderLineDtoList.length; i++) {
            let itemLength = this.checkOrderLine(
                this.order.orderLineDtoList,
                this.order.orderLineDtoList[i].name,
                this.order.orderLineDtoList[i].productCode
            );
            if (itemLength > 1) {
                if (!this.orderLineList.some(line =>
                    line.name === this.order.orderLineDtoList[i].name &&
                    line.productCode === this.order.orderLineDtoList[i].productCode
                )) {
                    let lineItem = this.getOrderLine(
                        this.order.orderLineDtoList,
                        this.order.orderLineDtoList[i].name,
                        this.order.orderLineDtoList[i].productCode
                    );
                    this.orderLineList.push(lineItem);
                }
            } else {
                this.orderLineList.push(this.order.orderLineDtoList[i]);
            }
        }

       

       
    } catch (error) {
      
        // Handle error
    } 
}
checkOrderLine(orderLine, name, productCode) {
    let searchResult;
    let line = orderLine;
    line = line.filter((item) => {
      searchResult =
        item.name === name &&
        item.status === "Completed" &&
        item.productCode === productCode;

      return searchResult;
    });

    if (line != null && line != undefined) {
      return line.length;
    } else {
      return 0;
    }
  }
getOrderLine(orderLine, name, productCode) {
    let searchResult;
    let line = orderLine;
    line = line.filter((item) => {
      searchResult =
        item.name === name &&
        item.status === "Completed" &&
        item.productCode === productCode;

      return searchResult;
    });

    this.orderLine = new OrderLineDto();
    this.orderLine = line[0];

    let unit = 0;
    let total;

    for (let i = 0; i < line.length; i++) {
      unit = unit + line[i].unitsInOrder;
    }

    this.orderLine.unitsInOrder = unit;

    return this.orderLine;
  }

async  getPaymentByRevId(revId: string) {
    try {
    //   this.loader = true;
      const data = await this.paymentService.findPaymentByReferenceNumber(revId).toPromise();
          if (data.length > 0) {
            this.payments = data;
            this.payments = data.filter((item) => {
              const searchResult =
                item.orderId != null &&
                item.orderId === this.order.id;
    
              return searchResult;
          });
    
          this.paymentsFilter = this.payments;
            this.paymentsPaid = this.payments.filter((item) => {
              const searchResult =
              item.orderId != null &&
                item.orderId === this.order.id &&
                item.status != null && item.status.toLocaleLowerCase() === "paid";
    
              return searchResult;
            });
  
            // this.UIDetectChange();
  
            if (this.outStandingAmount() >= 0) {
              this.isPaidOrder = true;
            } else {
              this.isPaidOrder = false;
            }
          }
        } catch (error) {
  
        }
        finally {
        //   this.loader = false;
      }
  
  
    }


    outStandingAmount() {
        if (this.getPaidAmount() > 0) {
          this.isPartiallyPaidOrder = true;
        } else {
          this.isPartiallyPaidOrder = false;
        }
        return this.getPaidAmount() - this.order.totalOrderAmount;
      }
      getPaidAmount() {
        let sum = 0;
        for (let i = 0; i < this.paymentsPaid.length; i++) {
          sum = sum + this.paymentsPaid[i].transactionAmount;
        }
    
        return sum;
      }
      getGST() {
        if (
          this.businessService != null &&
          this.businessService != undefined &&
          this.businessService?.gstNumber != undefined &&
          this.businessService?.gstNumber != null &&
          this.businessService?.gstNumber != ""
        ) {
          return this.businessService.gstNumber;
        } else if (
          this.property?.gstNumber != undefined &&
          this.property?.gstNumber != null &&
          this.property?.gstNumber != ""
        ) {
          return this.property?.gstNumber;
        } else {
          return null;
        }
      }
      ceckModeOfpayment(mode) {
        if (mode != null && mode != undefined && mode === "Credit") {
          return "BillToCompany";
        } else {
          return mode;
        }
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
                this.order.orderLineDtoList[i].discountedPrice > 0
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
      calculateSubTotal() {
        let subTotal = 0;
        subTotal =
          this.total +
          this.order.serviceChargeAmount -
          this.order.discountAmount -
          this.getRefundAmount();
    
        this.order.subTotalAmount = subTotal;
        this.subTotalAmount = subTotal;
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
propertyDetails(propertyId: number) {
    console.log("propertyid"+propertyId)
    this.propertyService.getPropertyDetailsByPropertyId(propertyId).subscribe(
      (data) => {
        this.property = data;
        console.log(JSON.stringify(  this.property))
        this.businessService = new BusinessServiceDtoList();
        this.businessService = this.property.businessServiceDtoList.find(
          (data) => data.id === this.order.businessServiceId
        );
        console.log(JSON.stringify(  this.businessService))

        if (
          this.businessService != null &&
          this.businessService != undefined &&
          this.businessService.logoUrl != null &&
          this.businessService.logoUrl != undefined
        ) {
          this.LogoURL = this.businessService.logoUrl;
        } else {
          this.LogoURL = this.property.logoUrl;
        }

        if (
          this.property.address != null &&
          this.property.address != undefined
        ) {
          this.propertyAddress = this.property.address;
        }

    
     
        //Logger.log('property data: '+ JSON.stringify(data));
      },
      (error) => {
        // if (error instanceof HttpErrorResponse) {
        //   this.openErrorSnackBar(error.message);
        //   this.loader = false;
        // }
      }
    );
  }

}
