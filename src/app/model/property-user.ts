import { UserRole } from "./role";

export class PropertyUser {
  id: number;
  businessName: string;
  address: string;
  email: string;
  confirmEmail: string;
  password: string;
  uuid: string;
  resetStatus: boolean;
  passwordResetLink: string;
  confirmPassword: string;
  username: string;
  mobileNumber: string;
  landphoneNumber: string;
  firstName: string; // firstname
  lastName: string; // lastname
  maxBookingDiscountPercentage: number;
  maxdiscountPercentageOrder: number;
  roleNames: any[];
  pin: number;
  roles: Array<UserRole>;
  //roleNames : UserRole;
  // propertie :GroupUser;
  propertyId: number;
  organisationId: number;
  constructor() {}
}
