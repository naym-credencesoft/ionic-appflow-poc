import { Kyc } from './kyc';
import { Address } from './address';
export class Customer {
  id: number; // private Long id;
  firstName: string; // private String firstName;
  lastName: string; // private String lastName;
  company: string; //   private String company;
  email: string; // private String email;
  mobile: string; // private String mobile;
  customerStatus: string;
  gender: string;  //  private String gender;
  language: string;  //  private String language;
  birthday: string; //  private Date birthday;
  anniversaryDate: string;  // private Date anniversaryDate;
  noOfKids: number;  // private int   noOfKids;
  noOfPets: number;  // private int noOfPets;
  propertyId:number;
  taxIdNumber : string;
  kycList: Kyc[];
  address: Address;
  kyc: Kyc;
  constructor() {
  }
}
