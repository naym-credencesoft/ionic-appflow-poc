import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Address } from "../../model/Customer/address";
import { Customer } from "../../model/Customer/customer";
import { Kyc } from "../../model/Customer/kyc";
import { CountryConfigService } from "../CountryConfig/countryConfig.service";
import { TokenStorage } from "./../../token.storage";

@Injectable({
    providedIn: "root",
})
export class CustomerService {
    constructor(
        private http: HttpClient,
        private token: TokenStorage,
        private countryConfig: CountryConfigService
    ) {}

    getAllCustomerByPropertyId(propertyId: number) {
        return this.http.get<Customer[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/customer/property/" +
                propertyId,
            { observe: "response" }
        );
    }

    getCustomerDetailsByFirstNameAndPropertyId(
        firstName: string,
        propertyId: number
    ) {
        return this.http.get<Customer[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/customer/firstName/" +
                firstName +
                "/propertyId/" +
                propertyId,
            { observe: "response" }
        );
    }

    getCustomerDetailsByLastNameAndPropertyId(
        lastName: string,
        propertyId: number
    ) {
        return this.http.get<Customer[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/customer/lastName/" +
                lastName +
                "/propertyId/" +
                propertyId,
            { observe: "response" }
        );
    }

    getCustomerDetailsByEmail(email: string) {
        return this.http.get<Customer>(
            this.countryConfig.getCoreApiURL() +
                "/api/website/email/" +
                email +
                "/",
            { observe: "response" }
        );
    }
    getCustomerDetailsByMobile(mobile: string) {
        return this.http.get<Customer>(
            this.countryConfig.getCoreApiURL() +
                "/api/website/mobile/" +
                mobile,
            { observe: "response" }
        );
    }
    getCustomerById(id: string) {
        return this.http.get<Customer>(
            this.countryConfig.getCoreApiURL() + "/api/customer/" + id,
            { observe: "response" }
        );
    }

    createCustomer(customer: Customer) {
        return this.http.post<Customer>(
            this.countryConfig.getCoreApiURL() + "/api/customer",
            customer,
            { observe: "response" }
        );
    }

    updateAddress(address: Address, customerId: string) {
        return this.http.post<Address>(
            this.countryConfig.getCoreApiURL() +
                "/api/customer/" +
                customerId +
                "/address",
            address
        );
    }

    getAddress(customerId: string) {
        return this.http.get<Address>(
            this.countryConfig.getCoreApiURL() +
                "/api/customer/" +
                customerId +
                "/address",
            { observe: "response" }
        );
    }

    getKYC(customerId: string) {
        return this.http.get<Kyc>(
            this.countryConfig.getCoreApiURL() +
                "/api/customer/" +
                customerId +
                "/kyc",
            { observe: "response" }
        );
    }

    updateKYC(customerId: string, kyc: Kyc) {
        return this.http.post<Kyc>(
            this.countryConfig.getCoreApiURL() +
                "/api/customer/" +
                customerId +
                "/kyc",
            kyc,
            { observe: "response" }
        );
    }
}
