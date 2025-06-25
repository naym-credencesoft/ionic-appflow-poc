import { InvoiceLine } from "./invoiceLines";


export class Invoice {

    invoiceTo: string;
    invoiceToPropertyId: number;
    createdBy: string;
    createdDate: number;
    lastModifiedBy: string;
    lastModifiedDate: number;
    id: number;
    paymentId: number;
    propertyId: number;
    invoiceNo: string;
    invoiceDate: string;
    dueDate: string;
    bookingId: number;
    propertyReservationId: string;
    totalAmount: number;
    taxableAmount: number;
    netAmount: number;
    paymentMode: string;
    paymentStatus: string;
    paidAmount: number;
    balanceAmount: number;
    customerId: number;
    invoiceUrl: string;
    orderId: number;
    reservationId: number;
    invoiceStatus: string;
    invoiceLinesDto: InvoiceLine[];
    serviceChargeAmount: number;
    customerName: string;
    customerDto: any;
    partialPayment: boolean;
  
    notes: string;
    deliveryChargeAmount: number;
    discountAmount: number;
    roomBillAmount: number;
    creditBillAmount: number;
    creditBillSettledAmount: number;
    gstNumber: any;
  constructor()
  { }
}
