export class ExternalReservation {
    id: number;
    channelId: number;
    externalTransactionId: string;
    bookoneReservationId: string;
    createdTimestamp: string;
    updatedTimestamp: string;
    payload: string;
    status: string;
    otaName:string;
    propertyName:string;
    checkoutDate : string;
    checkinDate:string;
    propertyId:number;
    firstName:string;
    lastName:string;
    email:string;
    paidAmount: number;
    totalAmount: number;
    modeOfPayment:string;
    bookingStatus:string;
    contactNumber:string;
    noOfPerson:number;
    propertyBusinessEmail:string;
    otaReservationId :string;
    payloadType: string;
    constructor() { }
}
