import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CountryConfigService } from "../CountryConfig/countryConfig.service";
import { Payment } from "./../../model/manage-booking/Payment/Payment";
import { TokenStorage } from "./../../token.storage";
import { PropertyPayment } from "src/app/model/PropertyPayment/propertyPayment";

@Injectable({
    providedIn: "root",
})
export class PaymentService {
    headers = new Headers();
    httpOptions = {
        headers: new HttpHeaders({
            USER_ID: this.token.getUserId(),
        }),
    };

    currentUser: any;

    constructor(
        private http: HttpClient,
        private token: TokenStorage,
        private countryConfig: CountryConfigService
    ) {}

    findPaymentByServiceId(serviceId: number) {
        return this.http.get<Payment[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/payment/findByServiceId/" +
                serviceId,
            { observe: "response" }
        );
    }

    getAllPaymentBypropertyId(propertyId): Observable<any[]> {
        return this.http.get<PropertyPayment[]>(
            this.countryConfig.getCoreApiURL()  + "/api/propertyPayment/getAllByPropertyId/"+propertyId
        );
      }

    processPayment(paymentDetails: Payment) {
        return this.http.post<Payment>(
            this.countryConfig.getCoreApiURL() + "/api/payment/process",
            paymentDetails,
            { observe: "response" }
        );
    }

    deletePaymentById(id: number) {
        return this.http.post<Payment>(
            this.countryConfig.getCoreApiURL() +
                "/api/payment/deleteById/" +
                id,
            { observe: "response" }
        );
    }

    findPaymentById(id: number) {
        return this.http.get<Payment>(
            this.countryConfig.getCoreApiURL() + "/api/payment/findById/" + id,
            { observe: "response" }
        );
    }
    findAllPaymentsForUser() {
        return this.http.get<Payment[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/payment/findAllByBusinessEmail",
            this.httpOptions
        );
    }
    savePayment(paymentDetails: Payment) {
        return this.http.post<Payment>(
            this.countryConfig.getCoreApiURL() + "/api/payment/savePayment",
            paymentDetails,
            { observe: "response" }
        );
    }
    findPaymentByReferenceNumber(referenceNumber: string) {
        return this.http.get<Payment[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/payment/findPaymentByBookingId/" +
                referenceNumber,
            this.httpOptions
        );
    }
    findPaymentSummaryByPropertyId(propertyId: number): Observable<any> {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/payment/findPaymentSummaryByPropertyId/" +
                propertyId,
            this.httpOptions
        );
    }
    findPaymentByPropertyId(propertyId: string): Observable<any> {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/payment/findAllByPropertyId/" +
                propertyId,
            this.httpOptions
        );
    }

    getAllPaymentsByPropertyIdAndDateRange(
        propertyId: string,
        FromDate: string,
        ToDate: string
    ) {
        let headers = new HttpHeaders({
            USER_ID: this.token.getUserId(),
        });

        return this.http.get<Payment[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/payment/findAllByPropertyIdAndDateRange/" +
                propertyId +
                "?startDate=" +
                FromDate +
                "&endDate=" +
                ToDate,
            { headers: headers }
        );
    }
}
