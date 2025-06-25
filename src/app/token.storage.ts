import { Injectable } from "@angular/core";
import { Slots } from "./model/business-service/slots";
import { CheckInGuestInfo } from "./model/check-In/guestCheckInInfo";
import { Booking } from "./model/manage-booking/Booking/Booking";
import { Host } from "./model/manage-booking/Host/Host";
import { BusinessProperties } from "./model/Order/businessProperties";
import { OrderSaveData } from "./model/Order/ordersavedata";
import { ProductGroup } from "./model/product/productGroup";
import { Property } from "./model/property/Property";
import { BusinessService } from "./model/Reservation/businessServic";
import { SlotReservation } from "./model/Reservation/slotReservation";
import { Room } from "./model/room";
import { TaxDetails } from "./model/TaxDetail/TaxDetails";
import { ReservationData } from "./pages/master-service/service-dashboard/service-dashboard.page";
import { RateRoute } from "./pages/rate-and-availability/rate_route";
import { Logger } from "./service/logger.service";

const TOKEN_KEY = "AuthToken";
const USER_ID = "UserId";
const USER_NAME = "UserName";
const PROPERTY_ID = "PropertyId";
const ROOM_TYPES = "RoomDetails";
const PROPERTY_DETAILS = "PropertyDetails";
const ROLES = "Roles";
const CHECKIN_GUEST_INFO = "GuestInfo";
const BOOKING_DETAIL = "bookingdetail";

const PRODUCT_ADD_TO_CART = "productList";
const PRODUCT_SELECTED = "productselected";

const LOGIN_EMAIL = "loginemail";
const LOGIN_PASSWORD = "loginpassword";
const RESERVATION_DATA = "reservationdata";
const BOOKSLOTDATA = "slotbookdata";

const PUSH_NOTIFICATION_TOKEN = "pushNotificationToken";

const SELECTED_COUNTRY = "selectedCountry";

const ORDER_PRODUCT_LIST = "orderproductlist";
const ORDER_BUSINESS_PROPERTIES = "orderbusinessservice";
const ORDER_SLOT_DATA = "orderslotdata";
const PROPERTY_SUBSCRIPTION = "subscriptions";
const FIND_BOOKING_VALUE = "findbooking";
const ALL_BOOKING_VALUE = "allbooking";
const RATE_ROUTE = "rateroute";
const ORGANIZATION_ID = "OrganizationId";

@Injectable()
export class TokenStorage {
    rooms: Room[];
    booking: Booking;

    constructor() {}

    signOut() {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_ID);
        window.localStorage.removeItem(USER_NAME);
        window.localStorage.removeItem(PROPERTY_ID);
        window.sessionStorage.removeItem(ROOM_TYPES);
        window.localStorage.removeItem(ROLES);
        window.sessionStorage.removeItem(BOOKSLOTDATA);
        window.sessionStorage.removeItem(RESERVATION_DATA);
        window.sessionStorage.removeItem(PROPERTY_DETAILS);
        window.sessionStorage.removeItem(CHECKIN_GUEST_INFO);
        window.sessionStorage.removeItem(BOOKING_DETAIL);
        window.sessionStorage.removeItem(PRODUCT_SELECTED);
        window.sessionStorage.removeItem(PRODUCT_ADD_TO_CART);
        window.sessionStorage.removeItem(ORDER_PRODUCT_LIST);
        window.sessionStorage.removeItem(ORDER_BUSINESS_PROPERTIES);
        window.sessionStorage.removeItem(ORDER_SLOT_DATA);
        window.sessionStorage.removeItem(PROPERTY_SUBSCRIPTION);
        window.sessionStorage.removeItem(FIND_BOOKING_VALUE);
        window.sessionStorage.removeItem(ALL_BOOKING_VALUE);
        window.sessionStorage.removeItem(RATE_ROUTE);
        // window.sessionStorage.clear();
    }

    public saveRateRoute(data: RateRoute) {
        window.sessionStorage.removeItem(RATE_ROUTE);
        if (data !== null || data !== undefined) {
            window.sessionStorage.setItem(
                RATE_ROUTE,
                JSON.stringify(data)
            );
        } else {
            window.sessionStorage.setItem(RATE_ROUTE, null);
        }
    }

    public getARateRoute(): RateRoute {
        return JSON.parse(sessionStorage.getItem(RATE_ROUTE));
    }

    public clearRateRoute() {
        window.sessionStorage.removeItem(RATE_ROUTE);
    }

    public getOrganizationId(): string {
        return sessionStorage.getItem(ORGANIZATION_ID);
      }

      remove(key: string) {
        localStorage.removeItem(key); // Remove from localStorage
      }

    public saveAllBookingData(data: Host) {
        window.sessionStorage.removeItem(ALL_BOOKING_VALUE);
        if (data !== null || data !== undefined) {
            window.sessionStorage.setItem(
                ALL_BOOKING_VALUE,
                JSON.stringify(data)
            );
        } else {
            window.sessionStorage.setItem(ALL_BOOKING_VALUE, null);
        }
    }

    public getAllBookingData(): Host {
        return JSON.parse(sessionStorage.getItem(ALL_BOOKING_VALUE));
    }

    public clearAllBookingData() {
        window.sessionStorage.removeItem(ALL_BOOKING_VALUE);
    }

    //

    public saveFindBookingData(data: Booking) {
        window.sessionStorage.removeItem(FIND_BOOKING_VALUE);
        if (data !== null || data !== undefined) {
            window.sessionStorage.setItem(
                FIND_BOOKING_VALUE,
                JSON.stringify(data)
            );
        } else {
            window.sessionStorage.setItem(FIND_BOOKING_VALUE, null);
        }
    }

    public getFindBookingData(): Booking {
        return JSON.parse(sessionStorage.getItem(FIND_BOOKING_VALUE));
    }

    public clearFindBookingData() {
        window.sessionStorage.removeItem(FIND_BOOKING_VALUE);
    }

    public saveSubscriptionList(subscription: any[]) {
        window.sessionStorage.removeItem(PROPERTY_SUBSCRIPTION);
        if (subscription !== null || subscription !== undefined) {
            window.sessionStorage.setItem(
                PROPERTY_SUBSCRIPTION,
                JSON.stringify(subscription)
            );
        } else {
            window.sessionStorage.setItem(PROPERTY_SUBSCRIPTION, null);
        }
    }

    public getSubscriptionList(): any[] {
        return JSON.parse(sessionStorage.getItem(PROPERTY_SUBSCRIPTION));
    }

    public getORDER_SLOT_DATA(): Slots {
        return JSON.parse(sessionStorage.getItem(ORDER_SLOT_DATA));
    }

    public saveORDER_SLOT_DATA(data: Slots) {
        window.sessionStorage.removeItem(ORDER_SLOT_DATA);
        window.sessionStorage.setItem(ORDER_SLOT_DATA, JSON.stringify(data));
    }

    public getBusinessProperties(): BusinessProperties {
        return JSON.parse(sessionStorage.getItem(ORDER_BUSINESS_PROPERTIES));
    }

    public saveBusinessProperties(data: BusinessProperties) {
        window.sessionStorage.removeItem(ORDER_BUSINESS_PROPERTIES);
        window.sessionStorage.setItem(
            ORDER_BUSINESS_PROPERTIES,
            JSON.stringify(data)
        );
    }

    public saveOrderProductList(productGroup: ProductGroup[]) {
        window.sessionStorage.removeItem(ORDER_PRODUCT_LIST);
        if (productGroup !== null || productGroup !== undefined) {
            window.sessionStorage.setItem(
                ORDER_PRODUCT_LIST,
                JSON.stringify(productGroup)
            );
        } else {
            window.sessionStorage.setItem(ORDER_PRODUCT_LIST, null);
        }
    }

    public getOrderProductList(): ProductGroup[] {
        return JSON.parse(sessionStorage.getItem(ORDER_PRODUCT_LIST));
    }

    getTaxPercentageByTaxDetail(amount: number, taxdetails: TaxDetails) {
        Logger.log("amount " + amount);
        if (taxdetails != null && taxdetails != undefined) {
            let taxSlabList = taxdetails.taxSlabsList;
            if (
                taxSlabList != null &&
                taxSlabList != undefined &&
                taxSlabList.length > 0
            ) {
                let sizeOfTaxArray = taxSlabList.length;
                for (let i = 0; i < sizeOfTaxArray; i++) {
                    let minAmount = taxSlabList[i].minAmount;
                    let maxAmount = taxSlabList[i].maxAmount;
                    let taxSlab = taxSlabList[i];
                    if (amount >= minAmount && amount <= maxAmount) {
                        return taxSlab.percentage;
                        break;
                    }
                }
            } else {
                return taxdetails.percentage;
            }
        }
    }

    getTaxDetails(businessService: any, property: Property) {
        if (
            businessService.taxDetails != null &&
            businessService.taxDetails != undefined &&
            businessService.taxDetails.length > 0
        ) {
            let taxDetails = businessService.taxDetails[0].taxSlabsList;
            if (
                taxDetails != null &&
                taxDetails != undefined &&
                businessService.taxDetails.length > 0
            ) {
                return businessService.taxDetails;
            }
        } else {
            let taxDetails = property.taxDetails[0].taxSlabsList;
            if (
                taxDetails != null &&
                taxDetails != undefined &&
                property.taxDetails.length > 0
            ) {
                return property.taxDetails;
            }
        }
    }

    getTaxPercentage(amount: number) {
        let taxDetails = this.getProperty().taxDetails[0].taxSlabsList;
        if (
            taxDetails != null &&
            taxDetails != undefined &&
            this.getProperty().taxDetails.length > 0
        ) {
            let taxSlabList = this.getProperty().taxDetails[0].taxSlabsList;
            if (
                taxSlabList != null &&
                taxSlabList != undefined &&
                taxSlabList.length > 0
            ) {
                let sizeOfTaxArray = taxSlabList.length;
                for (let i = 0; i < sizeOfTaxArray; i++) {
                    let minAmount = taxSlabList[i].minAmount;
                    let maxAmount = taxSlabList[i].maxAmount;
                    let taxSlab = taxSlabList[i];
                    if (amount >= minAmount && amount <= maxAmount) {
                        return taxSlab.percentage;
                        break;
                    }
                }
            } else {
                return this.getProperty().taxDetails[0].percentage;
            }
        }
    }

    public clearADDToSlotCart() {
        return window.sessionStorage.removeItem(BOOKSLOTDATA);
    }
    public clearReservationData() {
        return window.sessionStorage.removeItem(RESERVATION_DATA);
    }

    public saveSlotBookData(slotData: SlotReservation) {
        window.sessionStorage.removeItem(BOOKSLOTDATA);
        if (slotData !== null || slotData !== undefined) {
            window.sessionStorage.setItem(
                BOOKSLOTDATA,
                JSON.stringify(slotData)
            );
        } else {
            window.sessionStorage.setItem(BOOKSLOTDATA, null);
        }
    }

    public getSlotBookData(): SlotReservation {
        return JSON.parse(sessionStorage.getItem(BOOKSLOTDATA));
    }

    public saveReservationData(data: ReservationData) {
        window.sessionStorage.removeItem(RESERVATION_DATA);
        window.sessionStorage.setItem(RESERVATION_DATA, JSON.stringify(data));
    }
    public getReservationData(): ReservationData {
        return JSON.parse(sessionStorage.getItem(RESERVATION_DATA));
    }

    public saveToken(token: string) {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string {
        return localStorage.getItem(TOKEN_KEY);
    }

    public getRole(): string {
        return localStorage.getItem(ROLES);
    }

    public saveRole(roles: string[]) {
        window.localStorage.removeItem(ROLES);
        window.localStorage.setItem(ROLES, JSON.stringify(roles));
    }

    public saveUserName(username: string) {
        window.localStorage.removeItem(USER_NAME);
        window.localStorage.setItem(USER_NAME, username);
    }

    public saveLoginInfo(username: string, password: string) {
        window.localStorage.removeItem(LOGIN_EMAIL);
        window.localStorage.setItem(LOGIN_EMAIL, username);

        window.localStorage.removeItem(LOGIN_PASSWORD);
        window.localStorage.setItem(LOGIN_PASSWORD, password);
    }

    public getLoginUserEmail(): string {
        return localStorage.getItem(LOGIN_EMAIL);
    }
    public getLoginPassword(): string {
        return localStorage.getItem(LOGIN_PASSWORD);
    }

    clearRememberMe() {
        window.localStorage.removeItem(LOGIN_PASSWORD);
        window.localStorage.removeItem(LOGIN_EMAIL);
    }

    public getUserName(): string {
        return sessionStorage.getItem(USER_NAME);
    }

    public saveUserId(userId: number) {
        Logger.log(`User ID Inside Token Stoarge` + userId);
        window.localStorage.removeItem(USER_ID);
        window.localStorage.setItem(USER_ID, userId.toString());
    }
    public getUserId(): string {
        return localStorage.getItem(USER_ID);
    }
    public getPropertyId(): string {
        return localStorage.getItem(PROPERTY_ID);
    }
    public getRoomTypes(): Room[] {
        return JSON.parse(sessionStorage.getItem(ROOM_TYPES));
    }
    public getProperty(): Property {
        return JSON.parse(sessionStorage.getItem(PROPERTY_DETAILS));
    }
    public savePropertyId(propertyId: number) {
        Logger.log(`User ID Inside Token Stoarge` + propertyId);
        window.localStorage.removeItem(PROPERTY_ID);
        if (propertyId != null) {
            window.localStorage.setItem(PROPERTY_ID, propertyId.toString());
        } else {
            window.localStorage.setItem(PROPERTY_ID, null);
        }
    }
    public saveRoomTypes(roomTypes: Room[]) {
        Logger.log(roomTypes);
        window.sessionStorage.removeItem(ROOM_TYPES);
        if (roomTypes !== null || roomTypes !== undefined) {
            window.sessionStorage.setItem(
                ROOM_TYPES,
                JSON.stringify(roomTypes)
            );
        } else {
            window.sessionStorage.setItem(ROOM_TYPES, null);
        }
    }
    public saveProperty(property: Property) {
        window.sessionStorage.removeItem(PROPERTY_DETAILS);
        if (property != null) {
            window.sessionStorage.setItem(
                PROPERTY_DETAILS,
                JSON.stringify(property)
            );
        } else {
            window.sessionStorage.setItem(PROPERTY_DETAILS, null);
        }
    }

    // check info
    public getCheckInGuestInfo(): CheckInGuestInfo {
        return JSON.parse(sessionStorage.getItem(CHECKIN_GUEST_INFO));
    }
    public saveCheckInGuestInfo(checkinInfo: CheckInGuestInfo) {
        window.sessionStorage.removeItem(CHECKIN_GUEST_INFO);
        if (checkinInfo != null) {
            window.sessionStorage.setItem(
                CHECKIN_GUEST_INFO,
                JSON.stringify(checkinInfo)
            );
        } else {
            window.sessionStorage.setItem(CHECKIN_GUEST_INFO, null);
        }
    }
    public claerCheckInGuestInfo() {
        window.sessionStorage.removeItem(CHECKIN_GUEST_INFO);
    }

    // .......booking detal

    public getBookingDetal(): Booking {
        return JSON.parse(sessionStorage.getItem(BOOKING_DETAIL));
    }
    public saveBookingDetal(booking: Booking) {
        window.sessionStorage.removeItem(BOOKING_DETAIL);
        if (booking != null) {
            window.sessionStorage.setItem(
                BOOKING_DETAIL,
                JSON.stringify(booking)
            );
        } else {
            window.sessionStorage.setItem(BOOKING_DETAIL, null);
        }
    }
    public claerBookingDetal() {
        window.sessionStorage.removeItem(BOOKING_DETAIL);
    }

    public getBookingId(){
        this.booking = new Booking();
        this.booking = this.getBookingDetal();

        if(this.booking != null && this.booking != undefined)
        {
            return this.booking.id;
        }
        else
        {
            return null;
        }
    }

    // ..

    public saveAddToCartProduct(product: OrderSaveData) {
        window.sessionStorage.removeItem(PRODUCT_ADD_TO_CART);
        if (product !== null || product !== undefined) {
            window.sessionStorage.setItem(
                PRODUCT_ADD_TO_CART,
                JSON.stringify(product)
            );
        } else {
            window.sessionStorage.setItem(PRODUCT_ADD_TO_CART, null);
        }
    }

    public getAddToCartProduct(): OrderSaveData {
        return JSON.parse(sessionStorage.getItem(PRODUCT_ADD_TO_CART));
    }

    public clearADDToCart() {
        return window.sessionStorage.removeItem(PRODUCT_ADD_TO_CART);
    }

    public saveProductSelected(product: any) {
        window.sessionStorage.removeItem(PRODUCT_SELECTED);
        if (product != null) {
            window.sessionStorage.setItem(
                PRODUCT_SELECTED,
                JSON.stringify(product)
            );
        } else {
            window.sessionStorage.setItem(PRODUCT_SELECTED, null);
        }
    }

    public getProductSelected(): any {
        return JSON.parse(sessionStorage.getItem(PRODUCT_SELECTED));
    }

    public clearProductSelected() {
        return window.sessionStorage.removeItem(PRODUCT_SELECTED);
    }

    public savePushNotificationToken(token: string) {
        window.localStorage.setItem(PUSH_NOTIFICATION_TOKEN, token);
    }

    public getPushNotificationToken(): string | null {
        return window.localStorage.getItem(PUSH_NOTIFICATION_TOKEN);
    }

    public saveSelectedCountry(countryCode: string) {
        window.localStorage.setItem(SELECTED_COUNTRY, countryCode);
    }

    public getSelectedCountry(): string {
        return window.localStorage.getItem(SELECTED_COUNTRY) || "IN";
    }

    roomSequenceByRanking(ascending) {
        return function (a, b) {
          // equal items sort equally
          if (a.ranking === b.ranking) {
              return 0;
          }
    
          // nulls sort after anything else
          if (a.ranking === null) {
              return 1;
          }
          if (b.ranking === null) {
              return -1;
          }
    
          if (a.ranking === 0) {
            return 1;
          }
          if (b.ranking === 0) {
              return -1;
          }
    
          // otherwise, if we're ascending, lowest sorts first
          if (ascending) {
              return a.ranking < b.ranking ? -1 : 1;
          }
    
          // if descending, highest sorts first
          return a.ranking < b.ranking ? 1 : -1;
        };
      }
    
}
