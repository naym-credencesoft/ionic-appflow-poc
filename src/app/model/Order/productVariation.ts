// import { ProductGroup } from "app/views/product/model/productGroup";

import { ProductGroup } from "../product/productGroup";

export class productVariationDtoList {
  id: number;
  buyUnitPrice: number;
  code: string;
  discountedPrice: number;
  productId: number;
  sellUnitPrice: number;
  unitsInOrder: number;
  unitsInStock: number;
  name: string;
  quantityVariation: number;
  totalPrice: number;
  isNotesChecked: boolean = false;
  maintainStock: boolean;
  status: string;
  inventoryId: number;
  recipeId: number;
  factorToProduct: number;
  extraUnitInOrder: number;

  extraProductGroupId: number;
  extraProductGroup: ProductGroup;
  minNoOfFreeItem: number;
  toppingProductGroupId: number;
  addOnProductGroup: ProductGroup;
  outOfStock: boolean;
  discountInPercentage: number;
  isNewItem: boolean;
  shiftVariation:boolean;

  constructor() {}
}
