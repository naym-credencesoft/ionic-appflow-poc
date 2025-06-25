import { GroceryProduct } from "./Groceryproduct";
import { Ingredients } from "./ingredients";

export class Recipe {
  id: number;
  name: string;
  type: string;
  NoOfServingPerson: number;
  quantity : number;
  inventoryId : number;
  description: string;
  noOfServingPerson: number;
  shortDescription: string;
  propertyId:number;
  ingredients: Ingredients[];
    inventoryItem: GroceryProduct;
    storeLocation:string;
}
