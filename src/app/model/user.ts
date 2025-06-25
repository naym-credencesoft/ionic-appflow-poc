import { UserRole } from '../../app/model/role';
import { Address } from './Customer/address';


export class ApplicationUser {

    id: number;
    businessName: string;
    address: Address;
    email: string;
    logoUrl : string;
    confirmEmail: string;
    includeServicePermission:boolean;
    password: string;
    uuid : string;
    resetStatus : boolean;
    passwordResetLink : string;
    confirmPassword: string;
    username: string;
    mobileNumber : string;
    landphoneNumber: string;
    disableGstService: boolean;
    maxOrderDiscountPercentage: number;
    maxOrderItemDiscountPercentage: number;

    firstName: string; // firstname
    lastName:string; // lastname
    
    roles:Array<UserRole>;
    maxBookingDiscountPercentage:number;

    constructor() 
    {
    
    }
}