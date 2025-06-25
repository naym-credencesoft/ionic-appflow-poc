export class Address {

  streetNumber: string;
  streetName: string;
  locality: string;
  suburb: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  constructor() {
  }
  public static isNull(address: Address): boolean {
      return address.streetNumber === null;
  }
}