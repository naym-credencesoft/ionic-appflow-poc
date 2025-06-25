
import {RoomDetails} from './../../model/RoomDetails/RoomDetails';
import {BedDetails} from './../../model/BedDetails/BedDetails';

export class CheckInGuestInfo {

    id: number;
    referenceNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    fromDate: string;
    fromDateCal: Date;
    toDate: string;
    roomType: string;
    roomPrice: string;
    airportShuttlePrice: string;
    businessEmail: string;
    businessName: string;
    notes: string;
    externalBookingId: string;
    externalSite: string;
    commissionAmount: string;
    gstAmount: string;
    paymentSurcharge: string;
    netAmount: string;
    airportService: string;
    accomodationType: string;
    roomId: number;
    propertyId: number;
    available: Boolean ;
    modeOfPayment: string;
    cardNumber: number;
    expMonth: number;
    expYear: number;
    cvv: number;
    currency: string;
    token: string ;
    bookingAmount: number ;
    payableAmount: number ;
    roomName: string ;
    totalServiceAmount: number ;
    totalExpenseAmount: number ;
    totalPaymentAmount: number ;
    outstandingAmount: number ;
    discountAmount: number;
    totalAmount: number;
    bookingStatus: string;
    invoiceUrl: string ;
    noOfRooms: number;
    noOfPersons: number;
    checkinTime: Date ;
    checkoutTime: Date ;
    bookingUrl: string;
    extraPersonCharge: number;
    noOfExtraPerson: number ;
    roomDetails: RoomDetails[] ;
    bedDetails: BedDetails[] ;
    createdBy: string ;
    paymentUrl: string;
    createdDate: Date ;
    lastModifiedBy: string ;
    lastModifiedDate: Date ;
    changeType: string;
    beforeTaxAmount:number;
    message: string;
    noOfNights: number ;
    amendmentType: string;
    valid : boolean;
    
    constructor() { }
}
