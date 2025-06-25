import { ProductVariationDto } from "./productVariation";

export class Product {
    id: number;
    name: string;
    productCode: string;
    shortDescription: string;
    description: string;
    sellUnitPrice: number;
    buyUnitPrice: number;
    unitsInStock: number;
    productGroupId: number;
    unitsInOrder: number;
    discountedPrice: number;
    imageList: any[];
    productVariationList: ProductVariationDto[];
    outOfStock: boolean;
    recipeId: number;
    inventoryLocation: string;
    inventoryId: number;
    // optional
    totalPriceProduct: number;
    maintainStock: boolean;

    constructor() {}
}
