export class PropertyServiceDTO {
    id: number;
    businessType: string;
    description: string;
    imageUrl: string;
    logoUrl: string;
    name: string;
    organisationId: number;
    serviceType: string;
    afterTaxAmount: number;
    beforeTaxAmount: number;
    taxAmount: number;
    taxPercentage: number;
    count: number;
    servicePrice: number;
    date: string;
    autoExtend: boolean;
    applicableToAdult: boolean;
    applicableToChild: boolean;
    discountAmount:number;
    discountPercentage:number;
    constructor() {}
}
