import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Invoice } from "src/app/model/invoice/invoice";
import { PointOfSale } from "src/app/model/Pos/pointOfSale";
import { RoomDetailStatus } from "src/app/model/RoomDetails/RoomDetailStatus";
import { ApplicationUser } from "src/app/model/user";
import { Plan } from "src/app/pages/booking/plan";
import { TokenStorage } from "src/app/token.storage";
import { Logger } from "../../service/logger.service";
import { CountryConfigService } from "../CountryConfig/countryConfig.service";
import { CheckInGuestInfo } from "./../../model/check-In/guestCheckInInfo";
import { Booking } from "./../../model/manage-booking/Booking/Booking";
import { Host } from "./../../model/manage-booking/Host/Host";
import { Payment } from "./../../model/manage-booking/Payment/Payment";
import { Service } from "./../../model/manage-booking/Service/Service";
import { Subcription } from "src/app/model/subscription/Subcription";
import { Todos } from "src/app/pages/todos/todos";
import { OTAPlan } from "src/app/model/otaPlan/otaPlan";
import { BusinessService } from "src/app/model/Reservation/businessServic";
import { PropertyServiceDTO } from "src/app/model/property/PropertyServices";

@Injectable({
    providedIn: "root",
})
export class BookingService {
    constructor(
        private http: HttpClient,
        private countryConfig: CountryConfigService,
        private token: TokenStorage
    ) { }

    undoCheckout(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/undoCheckout/" + booking.id,
          { observe: "response" }
        );
    }

    updateBulkService(bookingId: number, service: Service[]) {
        return this.http.post<Service[]>(
            this.countryConfig.getCoreApiURL() + "/api/booking/update/services/" + bookingId,
          service,
          { observe: "response" }
        );
    }

    groupRoomAllocation(roomDetail: any) {
        return this.http.post<any>(
            this.countryConfig.getCoreApiURL() + "/api/booking/group/allocateRoom",
          roomDetail,
          { observe: "response" }
        );
      }
    
    
    saveBookingService(bookingId: number,planPropertyServicesList: PropertyServiceDTO[] ) {
        return this.http.post<Booking>( this.countryConfig.getCoreApiURL() + "/api/booking/add/services/"+bookingId, planPropertyServicesList, {
          observe: "response",
        });
    }

    changeRoomCategoryWithInventoryUpdate(fromDate: any, toDate: any, roomDetails: any, inventoryUpdate) {
        return this.http.post<any>(
            this.countryConfig.getCoreApiURL() +
            "/api/room/changeCategory?fromDate=" +
            fromDate +
            "&toDate=" +
            toDate+"&inventoryUpdate="+inventoryUpdate,
          roomDetails,
          { observe: "response" }
        );
      }
    
    getOtaPlanRoomIdAndOtaPlanId(roomId: number, otaPlanId : string) {
        return this.http.get<OTAPlan>(
            this.countryConfig.getCoreApiURL() + "/api/room/getOtaPlan/room/"+roomId+"/otaPlanId/"+otaPlanId,
          { observe: "response" }
        );
      }

    accommodationAudit(propertyId: number, date: string) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/report/accommodationAudit?PropertyId=" +
                propertyId +
                "&Date=" +
                date,
            { observe: "response" }
        );
    }

    getAllBusinessServiceByPropertyId(propertyId: string) {
        return this.http.get<BusinessService[]>(
            this.countryConfig.getCoreApiURL() + "/api/property/" + propertyId + "/businessServices",
          { observe: "response" }
        );
      }

    getTodosById(id: number) {
        return this.http.get<Todos>(
            this.countryConfig.getCoreApiURL() + "/api/todo/" + id,
            { observe: "response" }
        );
    }

    saveTodos(todos: Todos) {
        return this.http.post<Todos>(
            this.countryConfig.getCoreApiURL() + "/api/todo",
            todos,
            { observe: "response" }
        );
    }

    updateBookingStatus(bookingId: number, status: string) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/updateBookingStatus/" +
                bookingId +
                "/PaymentStatus/" +
                status,
            { observe: "response" }
        );
    }

    updateBookingStatusByBookingId(
        bookingId: number,
        status: string,
        checkoutTime: string
    ) {
        return this.http.get<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/updateBooking/" +
                bookingId +
                "/status/" +
                status +
                "/checkoutTime/" +
                checkoutTime,
            { observe: "response" }
        );
    }

    updateRoomDetailStatus(roomstatus: RoomDetailStatus) {
        return this.http.post<RoomDetailStatus>(
            this.countryConfig.getCoreApiURL() + "/api/roomDetails/status",
            roomstatus,
            { observe: "response" }
        );
    }

    findBookingByGroupBookingId(groupBookingId: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/findByGroupBookingId?GroupBookingId=" +
                groupBookingId,
            { observe: "response" }
        );
    }

    getAllPaymentsByPropertyIdAndDateRange(
        propertyId: string,
        FromDate: string,
        ToDate: string
    ) {
        let headers = new HttpHeaders({
            USER_ID: this.token.getUserId(),
        });

        return this.http.get<Payment[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/payment/findAllByPropertyIdAndDateRange/" +
                propertyId +
                "?startDate=" +
                FromDate +
                "&endDate=" +
                ToDate,
            { headers: headers }
        );
    }

    roomRealeseByGroupBookingId(groupBookingId: number) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/releaseRoom/" +
                groupBookingId,
            { observe: "response" }
        );
    }

    updateInvoiceInBookingsByGroupBookingId(
        groupBookingId: number,
        invoiceNumber: string,
        invoiceId: number
    ) {
        return this.http.get<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/updateInvoiceInBooking/" +
                groupBookingId +
                "?invoiceNumber=" +
                invoiceNumber +
                "&invoiceId=" +
                invoiceId,
            { observe: "response" }
        );
    }

    createInvoice(invoice: Invoice) {
        return this.http.post<Invoice>(
            this.countryConfig.getCoreApiURL() + "/api/invoice",
            invoice,
            { observe: "response" }
        );
    }

    updateBookingStatusByGroupBookingId(
        groupBookingId: number,
        status: string,
        checkoutTime: string
    ) {
        return this.http.get<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/updateBookingStatus/" +
                groupBookingId +
                "/BookingStatus/" +
                status +
                "/checkoutTime/" +
                checkoutTime,
            { observe: "response" }
        );
    }

    addRoomPlan(plan: Plan) {
        return this.http.post<Plan>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/addOrUpdatePlan",
            plan,
            { observe: "response" }
        );
    }

    sendBookingConfirmation(bookingId: number) {
        return this.http.get<boolean>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/sendBookingConfirmation/" +
                bookingId,
            { observe: "response" }
        );
    }

    checkOutStandingAmountByBookingId(bookingId) {
        return this.http.get(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/calculateOutstandingAmount/" +
                bookingId,
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

    processPayPalPayment(payment: Payment) {
        return this.http.post(
            this.countryConfig.getCoreApiURL() + "/api/payment/create",
            payment,
            { observe: "response" }
        );
    }
    getAllBookingsByHost(host: Host) {
        return this.http.post<Booking[]>(
            this.countryConfig.getCoreApiURL() + "/api/booking/findAll",
            host,
            { observe: "response" }
        );
    }
    getCurrentAndFutureBookings(propertyId: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getCurrentAndFutureBookings/" +
                propertyId,
            { observe: "response" }
        );
    }
    getCurrentAndFutureBookingsOne(propertyId: number, pageNo: number,
        pageSize: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getCurrentAndFutureBookings/" +
                propertyId+
                "?pageNo=" +
                pageNo +
                "&pageSize=" +
                pageSize,
            { observe: "response" }
        );
    }
    saveBooking(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/save",
            booking,
            { observe: "response" }
        );
    }

    saveEnquire(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/enquire",
            booking,
            {
                observe: "response",
            }
        );
    }
    checkAvailability(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/checkAvailability",
            booking,
            { observe: "response" }
        );
    }
    getAllServicesByBooking(bookingId: number) {
        return this.http.get<Service[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/findAllServices/" +
                bookingId,
            { observe: "response" }
        );
    }
    addServiceTOBooking(bookingId: number, service: Service) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/add/service/" +
                bookingId,
            service,
            { observe: "response" }
        );
    }
    deleteService(serviceId: number) {
        return this.http.get(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/delete/service/" +
                serviceId,
            { observe: "response" }
        );
    }
    updateService(bookingId: number, service: Service) {
        return this.http.post<Service>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/update/service/" +
                bookingId,
            service,
            { observe: "response" }
        );
    }
    checkin(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/checkin",
            booking,
            { observe: "response" }
        );
    }
    checkout(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/checkout",
            booking,
            { observe: "response" }
        );
    }
    cancel(bookingId: number) {
        return this.http.get<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/cancel/" +
                bookingId,
            { observe: "response" }
        );
    }
    getNoOfGuestChekingInToday(propertyId: number) {
        return this.http.get<number>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getNoOfGuestCheckInToday/" +
                propertyId,
            { observe: "response" }
        );
    }
    getNoOfGuestChekingOutToday(propertyId: number) {
        return this.http.get<number>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getNoOfGuestCheckOutToday/" +
                propertyId,
            { observe: "response" }
        );
    }
    getNoOfGuestInHouseToday(propertyId: number) {
        return this.http.get<number>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getNoOfGuestInHouseToday/" +
                propertyId,
            { observe: "response" }
        );
    }
    getGuestChekingInToday(propertyId: number) {
        return this.http.get<CheckInGuestInfo[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getGuestsCheckInToday/" +
                propertyId,
            { observe: "response" }
        );
    }
    getGuestChekingInTodayOne(propertyId: number, pageNo: number, pageSize: number) {
        return this.http.get<CheckInGuestInfo[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getGuestsCheckInToday/" +
                propertyId +
                "?pageNo=" +
                pageNo +
                "&pageSize=" +
                pageSize,
            { observe: "response" }
        );
    }
    getGuestChekingOutToday(propertyId: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getGuestsCheckOutToday/" +
                propertyId,
            { observe: "response" }
        );
    }
    getGuestChekingOutTodayOne(propertyId: number,pageNo: number,
        pageSize: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getGuestsCheckOutToday/" +
                propertyId +
                "?pageNo=" +
                pageNo +
                "&pageSize=" +
                pageSize,
            { observe: "response" }
        );
    }
    getGuestInHouseToday(propertyId: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getGuestsInHouseToday/" +
                propertyId,
            { observe: "response" }
        );
    }

    getGuestInHouseTodayOne(propertyId: number,pageNo: number,
        pageSize: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getGuestsInHouseToday/" +
                propertyId +
                "?pageNo=" +
                pageNo +
                "&pageSize=" +
                pageSize,
            { observe: "response" }
        );
    }

    getAdvanceBookings(propertyId: number, todayDate: string) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
            "/api/booking/getAdvanceBookings/" +
            propertyId +
            "/todayDate/" +
            todayDate,
          { observe: "response" }
        );
      }

      getAdvanceBookingsOne(propertyId: number, pageNo: number,
        pageSize: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
            "/api/booking/getAdvanceBookingToday/" +
            propertyId +
            "?pageNo=" +
            pageNo +
            "&pageSize=" +
            pageSize,
          { observe: "response" }
        );
      }
    sendPaymentLink(bookingId: number) {
        return this.http.get<boolean>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/requestPayment/" +
                bookingId,
            { observe: "response" }
        );
    }
    modifyDate(booking: Booking) {
        Logger.log(booking);
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/dateAmendment",
            booking,
            { observe: "response" }
        );
    }
    modifyRoom(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/roomAmendment",
            booking,
            { observe: "response" }
        );
    }
    modifyGuestNumber(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/guestAmendment",
            booking,
            { observe: "response" }
        );
    }
    findBookings(booking: Booking) {
        return this.http.post<Booking[]>(
            this.countryConfig.getCoreApiURL() + "/api/booking/findBookings",
            booking,
            { observe: "response" }
        );
    }
    populateCalenderBookings(propertyId: number) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/getCalenderBookings/" +
                propertyId,
            { observe: "response" }
        );
    }
    findBooking(bookingId: number) {
        return this.http.get<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/findById?BookingId=" +
                bookingId,
            { observe: "response" }
        );
    }

    roomAllocation(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/allocateRoom",
            booking,
            { observe: "response" }
        );
    }
    roomRealese(booking: Booking) {
        return this.http.post<Booking>(
            this.countryConfig.getCoreApiURL() + "/api/booking/releaseRoom",
            booking,
            { observe: "response" }
        );
    }

    getPlan(propertyId: string, roomId: string) {
        return this.http.get<Plan[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/room/property/" +
                propertyId +
                "/room/" +
                roomId +
                "/roomPlan",
            { observe: "response" }
        );
    }

    VoidBooking(bookingId: number) {
        return this.http.get<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/void/" +
                bookingId,
            { observe: "response" }
        );
    }
    noShowBooking(bookingId: number) {
        return this.http.get<Booking>(
            this.countryConfig.getCoreApiURL() +
                "/api/booking/noShow/" +
                bookingId,
            { observe: "response" }
        );
    }

    getUserByUserId(userId: string) {
        return this.http.get<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/api/user/findById/" + userId,
            { observe: "response" }
        );
    }

    nightAudit(propertyId: number, date: string) {
        return this.http.get<Booking[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/report/nightAudit?PropertyId=" +
                propertyId +
                "&Date=" +
                date,
            { observe: "response" }
        );
    }

    getPropertySubcription(propertyId: string) {
        let headers = new HttpHeaders({
            USER_ID: this.token.getUserId(),
        });

        return this.http.get<Subcription[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/property/" +
                propertyId +
                "/subscriptions",
            { headers: headers }
        );
    }
}
