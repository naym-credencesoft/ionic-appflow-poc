import { Brand } from "./brand";
import { Supplier } from "./supplier";

export class GroceryProduct {
    // toLowerCase() {
    //   throw new Error('Method not implemented.');
    // }
    inventoryId: number;
    name: string;
    imageUrl: string;
    catagory:string;
    productCode: string;
    description: string;
    shortDescription: string;
    notes: string;
    buyUnitPrice: number;
    sellUnitPrice: number;
    discountedPrice: number;
    unitInOrder:number;
    unitInStock:number;
    productUnit:string;
    productSize:number;
    maintainStock:boolean;
    status:string;
    suplierId:number;
    productGroupId:number;
    serialNo: number;
    propertyId: number;
    businessServiceId: number;
    organisationId: number;
    brand:Brand;
    supplier: Supplier;
    storeLocation: string;
}
