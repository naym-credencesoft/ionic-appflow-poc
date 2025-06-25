
export class OrderLineDto {

    buyUnitPrice : number;
    discountedPrice : number;
    id : number;
    lineNumber : number;
    orderId : number;
    productCode : string;
    quantity : number;
    sellUnitPrice :number;
    unitsInOrder : number;
    unitsInStock : number;
    name : string;
    notes : string;
  extraProductGroupId: number;

    toppingProductGroupId: number;
    status : string;
    inventoryId : number;
    recipeId : number;
    discountInPercentage: number;
  constructor()
      { }
}
