import { BankAccount } from "src/app/pages/business-setting/bank-details/BankAccount";
import { Address } from "../address-checker/Address";
import { Subcription } from "../subscription/Subcription";
import { MobileWallet } from "../wallet/mobileWallet";
import { PropertyStatusType } from "./../enums/PropertyStatusType";
import { TaxDetails } from "./../TaxDetail/TaxDetails";
import { PropertyServiceDTO } from "./PropertyServices";

export class Property {
    id: number;
    name: string;
    email: string;
    managerName: string;
    fssaiRegNumber: string;
    address: Address;
    contactNumber: string;
    landphone: string;
    mobile: string;
    vatNumber: string;
    whatsApp: string;
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

    shortName: string;

    noOfFloor: number;
    noOfRoomType: number;
    placeId: string;

    bookonePropertyId: number;

    longitude: string;
    latitude: string;

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

    businessType: string;
    businessDescription: string;

    plan: string;

    twitter: string;
    instagram: string;
    facebook: string;
    seoFriendlyName: string;

    bookingCommissionPercentage: number;
    transactionFee: number;
    cardProcessingFeePercentage: number;

    paymentGatewayApiKey: string;
    paymentGatewayApiToken: string;

    businessServiceDtoList: any[];

    subscriptionList: Subcription[];

    bankAccount: BankAccount;
    mobileWallet: MobileWallet;

    bookOneRating: number;
    verified: boolean;

    propertyServicesList: PropertyServiceDTO[];

    constructor() {}
}
