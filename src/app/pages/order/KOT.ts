import { OrderLineDto } from "src/app/model/Order/orderLineDto";

export class KOT {
  id: number;
  date: string;
  kotNo: string;
  priority: number;
  operatorName: string;
  orderLines: OrderLineDto[];
  propertyId: number;
  tableNo: string;
    version: string;
  time: string;
  orderNo: string;
  orderType: string;
  productGroupName: string;
  printerName: string;
  constructor() {}
}
