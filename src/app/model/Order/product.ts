import { ProductGroup } from '../product/productGroup';
import { productVariationDtoList } from './productVariation';
export class OrderProduct {

  buyUnitPrice: number;
  category: string;
  description: string;
  discountedPrice: number;
  id: number;
  imageList: [
    {
      name: string;
      description: string;
      id: string;
      mainImage: boolean;
      url: string;
    }
  ];
  maintainStock: boolean;
  name: string;
  notes: string;
  productCode: string;
  productGroupId: number;
  productVariationDtoList: productVariationDtoList[];
  sellUnitPrice: number;
  shortDescription: string;
  status: string;
  supplierId: number;
  quantityProduct: number;
  unitsInOrder: number;
  unitsInStock: number;
  totalPrice: number;
  businessServiceId: number;
  productGroupName: string;
  isNotesChecked: boolean = false;
  inventoryId: number;
  recipeId: number;
  shiftVariation: boolean;
  variationDtoList:any[];

  groupName: string;
  inventoryLocation: string;
  extraUnitInOrder: number;

  extraProductGroupId: number;
  extraProductGroupDto: ProductGroup;
  minNoOfFreeItem: number;
  toppingProductGroupId: number;
  addOnProductGroup: ProductGroup;
  outOfStock: boolean;
  discountInPercentage: boolean;
  nonGstItem: boolean;
  isNewItem: boolean;
  constructor() {}
}
