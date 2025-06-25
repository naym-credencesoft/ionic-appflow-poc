export interface Expense {
    id: number ;
    billNo: string;
    date: string;
    propertyId: number;
    name: string;
    description: string;
    amount: number;
    receiptNumber: string;
    notes: string;
    submittedBy: string;
    receiptUrl: string;
    bookingId: number;
    receiptFileName: string;
    department : string;
    businessEmail: string;
    externalReference: string;
    email: string ;
    roomId: number;
    roomNumber	:string;
    status:string;
    expenseStatus : string;
    orderId : number;
    paymentMode : string;
  }