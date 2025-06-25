export class Payment {
    id: number;
    firstName: string;
    lastName: string;
    referenceNumber: string;
    name: string;
    billNo: string;
    email: string;
    businessEmail: string;
    amount: number;
    currency: string;
    state: string;
    token: string;
    expYear: string;
    expMonth: string;
    cardNumber: string;
    companyName: string;
    cvv: string;
    description: string;
    status: string;
    creditSettled: boolean;
    receiptNumber: string;
    failureMessage: string;
    failureCode: string;
    paymentMode: string;
    externalReference: string;
    propertyId: number;
    orderId: number;
    expenseId: number;
    serviceId: number;
    sourceOfBooking: string;
    //
    date: string;
    swiftCode: string;
    transactionAmount: number;
    transactionChargeAmount: number;
    netReceivableAmount: number;
    otherChargesAmount: number;
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankReferenceNumber: string;
    branchName: string;
    channelCommissionAmount: number;
    roomNumber: string;
    taxAmount: number;
    serviceChargeAmount: number;
  
    deliveryChargeAmount: number;
    bookingCommissionAmount: number;
    businessServiceName: string;
  
    counterName: string;
    counterNumber: string;
    operatorName: string;
    convenienceFee: number;
  
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    chargeAbleToBooking: boolean;
  
    lastFourDigitCardNumber: number;
    customerName: string;
    startDate:string;
    endDate:string;
    userId:string;
    advancePayment: boolean;
    externalPaymentId:string;
    businessServiceId: number;
    constructor() {}
}
