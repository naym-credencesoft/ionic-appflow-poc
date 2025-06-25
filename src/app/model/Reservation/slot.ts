
import { LocationModel } from './location';
import { Resource } from './resource';
import { ServiceCustomer } from './serviceCustomer';
import { SlotDate } from './SlotDate';

export class Slot {

  id: number;

  currency: string;
  frequency : string;
  beforeTax : number;
  tax : number;
  finishDate: string;
  startDate : string;

  totalCapacity : number;
  available : boolean;
  duration: string;
  businessServiceId : number;
  businessServiceTypeId: number;
  companyName : string;
  date : string;
  dietaryRequirements :  string;
  email :  string;
  finishTime : string;
  firstName : string;
  lastName : string;
  location: LocationModel;

  mobile : string;
  modeOfPayment : string;
  noOfAvailable : number;
  noOfBooked : number;
  noToBeBooked : number;
  price : number;
  propertyId : number;
  propertyReservationNumber : string;
  resource: Resource;
  startTime :string;

  slotDateList : SlotDate[];

  constructor()
      { }
}
