import { Customer } from './../Customer/customer';

import { BusinessServiceTypes } from '../business-service/businessServiceTypes';
import { ShipToAddress } from '../Order/address';
import { LocationModel } from './location';
import { Resource } from './resource';
import { ServiceCustomer } from './serviceCustomer';
import { Slots } from '../business-service/slots';

export class SlotReservation {

  id: number;
  slotId: number;
  businessServiceId : number;
  date: string;
  bookingStatus: string;
  companyName: string;
  afterTaxAmount: number;
  beforeTaxAmount: number;
  businessName: string;
  businessReservationNumber: string;
  businessServiceTypeId : number;


  businessTypeId: number;
  businessTypeName: string;
  slotTimingId: number;
  serviceAddress: ShipToAddress;
  notes: string;
  duration: number;
  email: string;
  firstName: string;
  lastName: string;
  fromTime: string;
  toTime: string;
  startTime: string;
  finishTime: string;
  offeringName: string;
  locationName: string;
  mobile: string;
  modeOfPayment: string;
  propertyId: number;
  noOfPerson: number;
  resourceName: string;
  totalAmount: number;
  taxAmount: number;
  currency: string;
  paymentId: number;
  businessServiceTypes: BusinessServiceTypes[];
  customerDtoList: Customer[];
  slotReservationDtos: SlotReservation[];

    // my defined
    canChangeBusinessAddress : boolean;
    provideBusinessAndCustomerAddress : boolean;
  
    businessTermLocation : string;
    businessTermResource : string;
  
    businessLocationName : string;
    customerLocationName : string;

    businessProductName : string;
    businessServiceName : string;
  constructor()
      { }
}
