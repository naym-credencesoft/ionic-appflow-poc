

export class InvoiceLine {

    createdBy: string;
    createdDate: number;
    lastModifiedBy: string;
    lastModifiedDate: number;
    id: number;
    productCode: string;
    unitShipped: number;
    lineNumber: number;
    unitPrice: number;
    quantity: number;
    beforeTaxAmount: number;
    taxPercentage: number;
    taxAmount: number;
    afterTaxAmount: number;
    paidAmount: number;
    balanceAmount: number;
    description: string;
    businessServiceName: string;
    discountAmount: number;
    bookingId: number;
    roomBillAmount: number;
    creditBillAmount: number;
    creditBillSettledAmount: number;

  constructor()
  {

  }
}
