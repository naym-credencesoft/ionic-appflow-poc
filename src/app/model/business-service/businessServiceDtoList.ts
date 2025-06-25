import { ClosedDays } from './closedDays';
import { OpenDays } from './openDays';
import { BusinessServiceTypes } from './businessServiceTypes';
import { TaxDetails } from '../TaxDetail/TaxDetails';

export class BusinessServiceDtoList {
  id: number;
  closedDays: ClosedDays[];
  openDays: OpenDays[];
  name: string;
  gstNumber: string;
  logoEnabled: boolean;
  phoneNumber: string;
  brandSlogan: string;
  maxLeadTime	 : number;
  minLeadTime	: number;
  stdPrepTime	: number;
  brandName:string;
  canChangeBusinessAddress : boolean;
  provideBusinessAndCustomerAddress : boolean;

  businessTermLocation : string;
  businessTermResource : string;

  businessProductName: string;
  businessServiceName: string;
  
  description: string;
  propertyId: number;
  businessServiceTypes: BusinessServiceTypes[];
  serviceCloseList: [
    {
      day: string;
    }
  ];
  serviceOpenList: [
    {
      breakFromTime: string;
      breakToTime: string;
      closingTime: string;
      day: string;
      openingTime: string;
    }
  ];

  serviceChargePercentage : number;

  taxDetails : TaxDetails[];
  active : boolean;
  businessTypeId : number;
  businessLocationName : string;
  customerLocationName : string;
  serviceReservation : boolean;
  priceInclusiveOfTax: boolean;
  kotQueueUrl: string;
  printerName: string;
  logoUrl: string;
  constructor() {}
}
