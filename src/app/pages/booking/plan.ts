import { OTAPlan } from "src/app/model/otaPlan/otaPlan";
import { PropertyServiceDTO } from "src/app/model/property/PropertyServices";

export class Plan {
    id: number;
    code: string;
    name: string;
    effectiveDate: string;
    expiryDate: string;
    description: string;
    active: boolean;
    isApplicableToOta: boolean;
    planExist: boolean;
    roomId: number;
    amount: number;
    propertyId: number;
    roomTypeId: number;
    currencyCode: string;

    maximumLengthOfStay: number;
    minimumLengthOfStay: number;
    otaPlanList: OTAPlan[];
    deviationFromStandardPlan: number;
    propertyServicesList: PropertyServiceDTO[];
    status: string;
    restriction: string;

    channelManagerUpdateType: string;
    checkoutPeriod: number;
    extraChargePerPerson: number;
    minimumOccupancy: number;
    maximumOccupancy: number;

    extraChargePerChild: number;
    noOfChildren: number;

    dayOfTheWeekList: any[] = [];
    onedayPlan: boolean;

    constructor() {}
}
