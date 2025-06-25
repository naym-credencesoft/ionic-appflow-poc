import { MobileWallet } from "./wallet/mobileWallet";
import { Address } from "./business-service/address";
import { BusinessServiceDtoList } from "./business-service/businessServiceDtoList";
import { PropertyStatusType } from "./enums/PropertyStatusType";
import { TaxDetails } from "./TaxDetail/TaxDetails";
import { Subcription } from "./subscription/Subcription";
import { BankAccount } from "../pages/business-setting/bank-details/BankAccount";
import { BusinessImage } from "./businessImage";
import { DetailedView } from "./detailesView";
import { PropertyServiceDTO } from "./property/PropertyServices";

export class BusinessUser {
  bookonePropertyId: number;
  id: number;
  name: string;
  email: string;
  managerName: string;

  longitude: string;
  latitude: string;

  address: Address;
  contactNumber: string;
  landphone: string;
  mobile: string;
  status: PropertyStatusType;
  gstNumber: string;
  userId: string;
  propertyBarCode: Uint8Array[];
  logoUrl: string;
  imageUrl: string;
  website: string;
  slogan: string;

  localCurrency: string;
  propertyStatus: string;
  pricePerNight: string;
  pricePerWeek: string;
  priceFortNight: string;
  priceMonthly: string;
  minimumOccupancy: string;
  maximumOccupancy: string;

  managerFirstName: string;
  managerLastName: string;
  managerContactNo: string;
  managerEmailAddress: string;

  taxDetails: TaxDetails[];

  noOfFloor: number;
  noOfRoomType: number;
  placeId: string;
  organisationId: number;

  businessName: string;

  confirmEmail: string;
  password: string;
  uuid: string;
  resetStatus: boolean;
  passwordResetLink: string;
  confirmPassword: string;
  username: string;
  mobileNumber: string;
  landphoneNumber: string;
  firstname: string; // firstname
  lastname: string; // lastname
  // propertie :GroupUser;
  propertyId: number;
  createdBy: string;
  shortName: string;

  businessType: string;
  businessTypeGroup: string;
  businessDescription: string;
  newBusinessType: string;
  plan: string;

  twitter: string;
  instagram: string;
  facebook: string;
  seoFriendlyName: string;
  subscriptionList: Subcription[];

  bookingCommissionPercentage: number;
  transactionFee: number;
  cardProcessingFeePercentage: number;

  paymentGateway: string;
  paymentGatewayApiKey: string;
  paymentGatewayApiToken: string;
  paymentGatewayPublicKey: string;

  businessServiceDtoList: BusinessServiceDtoList[];

  imageList: BusinessImage[];

  bankName: string;
  branchName: string;
  verified: boolean;
  bankAccount: BankAccount;
  featuredBusiness: boolean;

  socialMediaLinks: any[];

  numberOfRooms: number;

  mobileWallet: MobileWallet;
  detailedView: DetailedView;
  whatsApp: string;
  videoLink: string;
  businessSubtype: string;

  propertyServicesList: PropertyServiceDTO[];
  paymentGatewayCallbackUrl: string;
  udyamRegistrationNumber: string;
  fssaiRegNumber: string;
  sacCode: string;
  propertyInvoicePrintHeader: boolean;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  constructor() {}
}
