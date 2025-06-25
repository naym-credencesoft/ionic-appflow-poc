
import { OrderProduct } from '../Order/product';

export class ProductGroup {

  id: number;
  name: string;
  description: string;
  productCode: string;
  shortDescription: string;
  productDtoList: OrderProduct[];

  imageUrl: string;
  businessServiceId: number;
  isSubGroup: boolean;
  category: string;
  type: string;
  nonGstItem: boolean;
  groupKot: boolean;
  printerName: string;
  constructor() { }
}
