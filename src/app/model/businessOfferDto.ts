import { Address } from "./business-service/address";

export class BusinessOfferDto {
    address: Address;
    available: number;
    balance: number;
    businessType: string;
    couponCode: string;
    description: string;
    startDate: string;
    endDate: string;
    facebookPostUrl: string;
    highlights: string;
    id: number;
    imageList: [
      {
        description: string;
        id: string;
        mainImage: boolean;
        name: string;
        url: string;
      }
    ];
    discountPercentage: number;
    minimumOrderAmount: number;
    name: string;
    propertyId: number;
    restrictions: string;
    seoFriendlyName: string;
    shortName: string;
    specialNotes: string;
    total: number;
    videoUrl: string;
    constructor() {}
  }