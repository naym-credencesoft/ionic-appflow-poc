import { BusinessServiceTypes } from '../business-service/businessServiceTypes';
import { TaxDetails } from '../TaxDetail/TaxDetails';
import { ClosedDays } from './closeddays'
import { OpenDays } from './opendays';

export class BusinessService {

  id: number;
  priceInclusiveOfTax: boolean;

  businessLocationName : string;
  customerLocationName : string;
  bookingButtonLabelText : string;
  canChangeBusinessAddress : boolean;
  provideBusinessAndCustomerAddress : boolean;
  checkInTime: string;
  closedDays : ClosedDays[];
  openDays : OpenDays[];
  name : string;
  description: string;
  propertyId: number;
  twentyFourHoursCheckOut:boolean;
  maxLeadTime: number;
  minLeadTime: number;
  stdPrepTime: number;

  groupName : string;
  code : string;

    organisationId: number;
    checkOutTime: string;

  businessServiceTypes : BusinessServiceTypes[]; //businessOnboard
  businessServiceTypeList : BusinessServiceTypes[];

  businessTypeId: number;
  fontAwesomeUrl : string;
  imageUrl : string;


  businessTermLocation : string;
  businessTermResource : string;

  businessProductName: string;
  businessServiceName: string;

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

  taxDetails : TaxDetails[];
    gstNumber: any;
    includeService: boolean;

  constructor()
      { }
}
