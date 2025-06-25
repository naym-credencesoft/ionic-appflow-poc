import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Slots } from 'src/app/model/business-service/slots';
import { Booking } from 'src/app/model/manage-booking/Booking/Booking';
import { DeliveryOption } from 'src/app/model/Order/deliveryOption';
import { Order } from 'src/app/model/Order/order';
import { Payment } from '../../model/manage-booking/Payment/Payment';
import { BusinessService } from '../../model/Reservation/businessServic';
import { Slot } from '../../model/Reservation/slot';
import { SlotReservation } from '../../model/Reservation/slotReservation';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';
import { Resource } from 'src/app/model/Reservation/resource';
import { LocationModel } from 'src/app/model/Reservation/location';
import { ServiceCharge } from 'src/app/model/serviceCharge';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient, private countryConfig: CountryConfigService) { }

  getBusinessServiceByServiceId(serviceId: string) {
    return this.http.get<BusinessService>(this.countryConfig.getCoreApiURL() + '/api/businessService/' + serviceId, { observe: 'response' });
  }

  getGuestInHouseByPropertyId(propertyId: number) {
    return this.http.get<Booking[]>(this.countryConfig.getCoreApiURL() + '/api/booking/getGuestCheckInForRoomOrder?PropertyId='+ propertyId, { observe: 'response' });
    }
    
    getResources(businessServiceId: string) {
        return this.http.get<Resource[]>(
            this.countryConfig.getCoreApiURL() + "/api/businessService/" + businessServiceId + "/resources",
          { observe: "response" }
        );
    }

    getServiceCharge(businessServiceId: number) {
      return this.http.get<ServiceCharge[]>(
        this.countryConfig.getCoreApiURL() + "/api/businessService/" + businessServiceId + "/serviceCharges",
        { observe: "response" }
      );
    }

    getGuestInHouseForRoomOrder(propertyId: number) {
      return this.http.get<Booking[]>(
        this.countryConfig.getCoreApiURL() +
          "/api/booking/getGuestCheckInForRoomOrder?PropertyId=" +
          propertyId,
        { observe: "response" }
      );
    }
    
    getLocations(businessServiceId: string) {
        return this.http.get<LocationModel[]>(
            this.countryConfig.getCoreApiURL() + "/api/businessService/" + businessServiceId + "/locations",
          { observe: "response" }
        );
      }
    


  order(order: Order) {
    return this.http.post<Order>(this.countryConfig.getCoreApiURL() + '/api/order', order, { observe: 'response' });
  }

  
  roomOrder(order: Order) {
    return this.http.post<Order>(this.countryConfig.getCoreApiURL() + '/api/order/updateRoomNumber', order, { observe: 'response' });
  }

  savePayment(paymentDetails: Payment) {
    return this.http.post<Payment>(this.countryConfig.getCoreApiURL() + '/api/payment/savePayment', paymentDetails, { observe: 'response' });
  }


  getDeliveryOption(businessServiceId : number){
    return this.http.get<DeliveryOption[]>(this.countryConfig.getCoreApiURL() + '/api/businessService/'+businessServiceId+'/deliveryOptions' , { observe: 'response' });
  }

  getGuestInHouseToday(propertyId: number ,date : string) {
    return this.http.get<Booking[]>(this.countryConfig.getCoreApiURL() + '/api/booking/getAllCheckedInGuests?PropertyId='+ propertyId+'&Date='+date, { observe: 'response' });
  }

  getSlotDataByDate(slot: Slots, serviceTypeId: string) {
    return this.http.get<Slots>(this.countryConfig.getCoreApiURL() + '/api/businessServiceType/' + serviceTypeId + '/slots?Date=' + slot.date, { observe: 'response' });
  }

  getAllBusinessServiceByPropertyId(propertyId: string) {
    return this.http.get<BusinessService[]>(this.countryConfig.getCoreApiURL() + '/api/property/' + propertyId + '/businessServices', { observe: 'response' });
  }

  cancelReservation(reservationId: string) {
    return this.http.get<any>(this.countryConfig.getCoreApiURL() + '/api/businessServiceType/cancel/' + reservationId, { observe: 'response' });
  }

  checkSlotAvailability(slot: Slot) {
    return this.http.post<Slot>(this.countryConfig.getCoreApiURL() + '/api/businessServiceType/checkAvailability', slot, { observe: 'response' });
  }
  getReservationByReservationId(reservationId) {
    return this.http.get<SlotReservation>(this.countryConfig.getCoreApiURL() + '/api/businessServiceType/slotReservation/findById/' + reservationId, { observe: 'response' });
  }
  book(slotReservation: SlotReservation) {

    return this.http.post<SlotReservation>(this.countryConfig.getCoreApiURL() + '/api/businessServiceType/book', slotReservation, { observe: 'response' });
  }

  processPayment(paymentDetails: Payment) {
    return this.http.post<Payment>(this.countryConfig.getCoreApiURL() + '/api/payment/process', paymentDetails, { observe: 'response' });
  }


  getAllSlotReservationByPropertyId(propertyId: string) {
    return this.http.get<SlotReservation[]>(this.countryConfig.getCoreApiURL() + '/api/businessServiceType/slotReservation/findByProperty/' + propertyId, { observe: 'response' });
  }


}
