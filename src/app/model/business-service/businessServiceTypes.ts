import { Slots } from './slots';


export class BusinessServiceTypes {
    id: number;
    name: string;
    description: string;
    capacityPerSlot: number;

    effectiveDate: string;
    expiryDate: string;

    serviceTags: string;
    serviceTagList: [];
    businessTermLocation: string;
    businessTermResource: string;
    startDate: Date;
    endDate: Date;

    durationInMinutes: number;
    slotAvailabilityDto: any;
    slotPricingDto: {
      id: number;
      afterTaxAmount: number;
      beforeTaxAmount: number;
      taxAmount: number;
      currency: string;
    };
    businessTypeId: number;
    slots: Slots[];

    bookable : boolean;
    constructor() {}
}
