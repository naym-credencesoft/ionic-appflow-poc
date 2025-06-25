export class ProductVariationDto {
    id: number;
    buyUnitPrice: number;
    code: string;
    discountedPrice: number;
    productId: number;
    sellUnitPrice: number;
    unitsInOrder: number;
    unitsInStock: number;
    name: string;
    factorToProduct: number;
    outOfStock: boolean;
    // optional
    totalPriceVariation: number;

    constructor() {}
}
