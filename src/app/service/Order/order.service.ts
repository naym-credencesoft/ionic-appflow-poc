import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { PointOfSale } from "src/app/model/Pos/pointOfSale";
import { ProductGroup } from "src/app/model/product/productGroup";
import { Slots } from "../../model/business-service/slots";
import { Customer } from "../../model/Customer/customer";
import { Payment } from "../../model/manage-booking/Payment/Payment";
import { Notifications } from "../../model/Notification/notification";
import { BusinessProperties } from "../../model/Order/businessProperties";
import { Order } from "../../model/Order/order";
import { BusinessService } from "../../model/Reservation/businessServic";
import { SlotReservation } from "../../model/Reservation/slotReservation";
import { CountryConfigService } from "../CountryConfig/countryConfig.service";
import { KOT } from "src/app/pages/order/KOT";
import { WhatsappDto } from "src/app/model/whatsappDto";
import { Subcription } from "src/app/model/subscription/Subcription";
import { Service } from "src/app/model/manage-booking/Service/Service";

@Injectable({
    providedIn: "root",
})
export class OrderService {
    constructor(
        private http: HttpClient,
        private countryConfig: CountryConfigService
    ) {}

    findServicesByOrderId(orderId: number) {
        return this.http.get<Service[]>(
            this.countryConfig.getCoreApiURL() + "/api/order/findServicesByOrderId/" + orderId,
          { observe: "response" }
        );
      }

      createKots(kot:KOT[]) {
        return this.http.post<KOT[]>(
            this.countryConfig.getCoreApiURL() + "/api/kot/createKots" , kot,
          { observe: "response" }
        );
      }

      getOrderSequence(propertyId: number) {
        return this.http.get<any[]>(
            this.countryConfig.getCoreApiURL() + "/api/order/sequencePropertyOrder/propertyId/" + propertyId,
          { observe: "response" }
        );
      }

      printKOT(url: string,sqsEndPoint:string) {
        return this.http.get<any>(
          this.countryConfig.getCoreApiURL() + "/api/website/sendToSqsQueue?message=" + url+"&sqsEndPoint="+sqsEndPoint,
          { observe: "response" }
        );
      }

    updateOrderPaymentStatus(orderId: number, status: string) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/updateOrderStatus/" +
                orderId +
                "/PaymentStatus/" +
                status,
            { observe: "response" }
        );
    }
    whatsAppMsg(whatsappmsg: WhatsappDto) {
        // this.setApi();
        return this.http.post<WhatsappDto>(
            this.countryConfig.getscheduleApiURL() + '/api/whatsapp/sendMessage',
          whatsappmsg,
          { observe: 'response' }
        );
      }
    getOrderByPropertyRevId(revId: string) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
            "/api/order/findByPropertyReservationNumber?PropertyReservationNumber=" +
            revId,
          { observe: "response" }
        );
      }

      getOfferDetailsBySeoFriendlyName(seoName: string) {
        return this.http.get<any>(
            this.countryConfig.getPromotionApiURL() + "/api/offer/findBySeofriendlyName/" + seoName + "/",
          { observe: "response" }
        );
      }
     
    updateKotOrderLineItemStatus(kotId: number, status: string) {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/kot/" +
                kotId +
                "/updateStatus/" +
                status,
            { observe: "response" }
        );
    }

    findTotalCountOfOrders(
        propertyId: string,
        FromDate: string,
        ToDate: string
    ) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/totalCountByPropertyIdAndDateRange?PropertyId=" +
                propertyId +
                "&FromDate=" +
                FromDate +
                "&ToDate=" +
                ToDate,
            { observe: "response" }
        );
    }

    createKot(kot: KOT) {
        return this.http.post<KOT>(
            this.countryConfig.getCoreApiURL() + "/api/kot/create",
            kot,
            { observe: "response" }
        );
    }

    deleteKOTOrderLineId(kotId: number, productCode: string) {
        return this.http.post<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/kot/" +
                kotId +
                "/removeKOTOrderLine/" +
                productCode,
            { observe: "response" }
        );
    }

    removeKotItem(kotId: number, productCode: string) {
        return this.http.post<KOT>(
            this.countryConfig.getCoreApiURL() +
                "/api/kot/" +
                kotId +
                "/removeKOTOrderLine/" +
                productCode,
            { observe: "response" }
        );
    }

    updateKotLine(kotId: number, lines: any[]) {
        return this.http.post<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/kot/updateKOTOrderLine/" +
                kotId,
            lines,
            { observe: "response" }
        );
    }

    getOrderByOrderId(orderId: number) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/findById?OrderId=" +
                orderId,
            { observe: "response" }
        );
    }

    getOrderByPropertyIdAndDateRange(
        propertyId: string,
        FromDate: string,
        ToDate: string
    ) {
        return this.http.get<Order[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/orderByPropertyIdAndDateRange?PropertyId=" +
                propertyId +
                "&FromDate=" +
                FromDate +
                "&ToDate=" +
                ToDate,
            { observe: "response" }
        );
    }

    paginationOrderByPropertyIdAndDateRange(
        propertyId: string,
        FromDate: string,
        ToDate: string,
        pageNo: number,
        pageSize: number
    ) {
        return this.http.get<Order[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/orderByPropertyIdAndDateRange?PropertyId=" +
                propertyId +
                "&FromDate=" +
                FromDate +
                "&ToDate=" +
                ToDate +
                "&pageNo=" +
                pageNo +
                "&pageSize=" +
                pageSize,
            { observe: "response" }
        );
    }

    getGuestInHouseByPropertyId(propertyId: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getGuestCheckInForRoomOrder?PropertyId=" +
                propertyId,
            { observe: "response" }
        );
    }

    getNotificationForProperty(productId: number) {
        return this.http.get<Notifications[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/notification/property?PropertyId=" +
                productId,
            { observe: "response" }
        );
    }

    updateOrderStatus(orderId: number, status: string) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/updateOrderStatus/" +
                orderId +
                "/OrderStatus/" +
                status,
            { observe: "response" }
        );
    }

    updateOrderLineStatus(orderLineId: number, status: string) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/orderline/" +
                orderLineId +
                "/status/" +
                status +
                "/",
            { observe: "response" }
        );
    }

    findProductsByBusinessServiceId(businessServiceId: number) {
        return this.http.get<ProductGroup[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/website/getProductList/" +
                businessServiceId,
            { observe: "response" }
        );
    }

    getAllPointOfSale(propertyId: number): Observable<PointOfSale[]> {
        return this.http.get<PointOfSale[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/property/" +
                propertyId +
                "/pointOfSale"
        );
    }

    saveNotification(notification: Notifications) {
        return this.http.post<Notifications[]>(
            this.countryConfig.getCoreApiURL() + "/api/notification/",
            notification,
            { observe: "response" }
        );
    }

    deleteKotById(id) {
        return this.http.post<any>(
            this.countryConfig.getCoreApiURL() + "/api/kot/deleteKotById/" + id,
            { observe: "response" }
        );
    }

    order(order: Order) {
        return this.http.post<Order>(
            this.countryConfig.getCoreApiURL() + "/api/order",
            order,
            { observe: "response" }
        );
    }

    getAllBusinessServiceByPropertyId(propertyId: string) {
        return this.http.get<BusinessService[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/property/" +
                propertyId +
                "/businessServices",
            { observe: "response" }
        );
    }

    getOrderListByPropertyId(propertyId: number) {
        return this.http.get<Order[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/findByPropertyId?PropertyId=" +
                propertyId,
            { observe: "response" }
        );
    }

    getOrderListByOrderId(orderId: number) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/findById?OrderId=" +
                orderId,
            { observe: "response" }
        );
    }

    getConfirmOrderByOrderId(orderId: number) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/confirmOrder/" +
                orderId,
            { observe: "response" }
        );
    }

    getOrderCancelByOrderId(orderId: number) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/cancelOrder/" +
                orderId,
            { observe: "response" }
        );
    }

    findById(orderId: number) {
        return this.http.get<Order>(
            this.countryConfig.getCoreApiURL() +
                "/api/order/findById/?OrderId=" +
                orderId,
            { observe: "response" }
        );
    }

    getAddress(customerId: string) {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/customer/" +
                customerId +
                "/address",
            { observe: "response" }
        );
    }

    saveOrder(order: Order) {
        return this.http.post<Order>(
            this.countryConfig.getCoreApiURL() + "/api/order",
            order,
            { observe: "response" }
        );
    }

    getCustomerDetailsByEmail(email: string) {
        return this.http.get<Customer>(
            this.countryConfig.getCoreApiURL() +
                "/api/website/email/" +
                email +
                "/",
            { observe: "response" }
        );
    }

    savePayment(paymentDetails: Payment) {
        return this.http.post<Payment>(
            this.countryConfig.getCoreApiURL() + "/api/website/savePayment",
            paymentDetails,
            { observe: "response" }
        );
    }
    getCustomerDetailsByMobile(mobile: string) {
        return this.http.get<Customer>(
            this.countryConfig.getCoreApiURL() +
                "/api/website/mobile/" +
                mobile,
            { observe: "response" }
        );
    }

    processPayment(paymentDetails: Payment) {
        return this.http.post<Payment>(
            this.countryConfig.getCoreApiURL() + "/api/payment/process",
            paymentDetails,
            { observe: "response" }
        );
    }

    findByPropertyId(id: string) {
        return this.http.get<BusinessProperties>(
            this.countryConfig.getCoreApiURL() +
                "/api/website/findByPropertyId/" +
                id,
            { observe: "response" }
        );
    }

    getSlotsByBusinessServiceTypeAndDate(date, businessServiceTypeId) {
        return this.http.get<Slots>(
            this.countryConfig.getCoreApiURL() +
                "/api/website/" +
                businessServiceTypeId +
                "/slots?Date=" +
                date,
            { observe: "response" }
        );
    }

    book(slotReservation: SlotReservation) {
        return this.http.post<SlotReservation>(
            this.countryConfig.getCoreApiURL() +
                "/api/businessServiceType/book",
            slotReservation,
            { observe: "response" }
        );
    }

    calculateOutstandingAmount(orderId: number) {
        return this.http.get<number>(
            this.countryConfig.getCoreApiURL() + "/api/order/calculateOutstandingAmount/" + orderId,
          { observe: "response" }
        );
      }
}
