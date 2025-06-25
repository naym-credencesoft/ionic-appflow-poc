import { SubscriptionList } from "../business-service/subscriptionList";
import { BusinessServiceDtoList } from "../business-service/businessServiceDtoList";
import { Address } from "../business-service/address";

export class BusinessProperties {
  name: string;
  id: number;
  businessDescription: string;
  businessShortDescription: string;
  businessName: string;
  businessType: string;
  businessTypeGroup: string;
  email: string;
  firstName: string;
  lastName: string;
  landphoneNumber: string;
  landphone: string;
  mobileNumber: string;
  organisationId: number;
  userStatus: string;
  username: string;
  password: string;
  confirmPassword: string;
  dashboardUrl: string;
  plan: string;
  newBusinessType: string;
  address: Address;
  facebook: string;
  instagram: string;
  twitter: string;
  gstNumber: string;
  imageUrl: string;
  longitude: string;
  latitude: string;
  seoFriendlyName: string;
  localCurrency: string;
  logoUrl: string;
  managerContactNo: string;
  managerEmailAddress: string;
  managerFirstName: string;
  managerLastName: string;
  maximumOccupancy: number;
  minimumOccupancy: number;
  mobile: string;
  noOfFloor: number;
  noOfRoomType: number;
  placeId: string;
  paymentGatewayApiKey: string;
  paymentGatewayApiToken: string;
  priceFortNight: number;
  priceMonthly: number;
  pricePerNight: number;
  pricePerWeek: number;
  propertyBarCode: string;
  propertyStatus: string;
  shortName: string;
  slogan: string;
  subscriptionList: SubscriptionList[];
  website: string;
  businessServiceDtoList: BusinessServiceDtoList[];
  taxDetails:  [
    {
      country: string,
      name: string,
      percentage: number,
      state: string,
      taxAmount: number,
      taxSlabsList: [
        {
          maxAmount: number,
          minAmount: number,
          percentage: number
        }
      ],
      taxableAmount: number
    }
  ];
  constructor() {}
}
