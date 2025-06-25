import { OtaAvailability } from "src/app/pages/availability-update/otaAvailability";
import { Plan } from "src/app/pages/booking/plan";

export class RatesAndAvailability {
    id?: number;
    date?: string;
    noOfAvailable?: number;
    noOfBooked?: number;
    noOfOnHold?: number;
    price?: number;
    propertyId?: number;
    propertyName?: string;
    roomId?: number;
    roomName?: string;
    totalNoRooms?: number;
    fromDate?: string ;
    toDate?: string ;
    status: string;
    restriction: string;
    roomRatePlans: Plan[];
    stopSellOBE: boolean;
    stopSellOTA: boolean;
    otaAvailabilityList?:OtaAvailability[];
  }