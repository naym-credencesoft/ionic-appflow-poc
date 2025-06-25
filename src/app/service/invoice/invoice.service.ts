import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Invoice } from "../../model/invoice/invoice";
import { CountryConfigService } from "../CountryConfig/countryConfig.service";

@Injectable({
    providedIn: "root",
})
export class InvoiceService {
    headers = new Headers();
    httpOptions = {
        headers: new HttpHeaders({
            timeout: `${60000}`,
        }),
    };

    constructor(
        private http: HttpClient,
        private countryConfig: CountryConfigService
    ) {}

    createInvoice(invoice: Invoice) {
        return this.http.post<Invoice>(
            this.countryConfig.getCoreApiURL() + "/api/invoice",
            invoice,
            { observe: "response" }
        );
    }

    getInvoiceListByPropertyId(propertyId: number) {
        return this.http.get<Invoice[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/invoice/findByPropertyId?PropertyId=" +
                propertyId,
            { observe: "response" }
        );
    }

    getInvoiceListByPropertyIdandDateRange(
        propertyId: number,
        FromDate: string,
        ToDate: string
    ) {
        return this.http.get<Invoice[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/invoice/findByPropertyId?PropertyId=" +
                propertyId +
                "&FromDate=" +
                FromDate +
                "&ToDate=" +
                ToDate,
            { observe: "response" }
        );
    }

    getInvoiceDetailsById(id: number) {
        return this.http.get<Invoice>(
            this.countryConfig.getCoreApiURL() +
                "/api/invoice/findByInvoiceId?InvoiceId=" +
                id,
            { observe: "response" }
        );
    }

    downloadInvoice(propertyId: string, invoiceId: string) {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/invoice/download?PropertyId=" +
                propertyId +
                "&InvoiceId=" +
                invoiceId,
            { observe: "response" }
        );
    }

    getEmailInvoice(propertyId: string, invoiceId: string) {
        return this.http.get<Invoice>(
            this.countryConfig.getCoreApiURL() +
                "/api/invoice/email?PropertyId=" +
                propertyId +
                "&InvoiceId=" +
                invoiceId,
            { observe: "response" }
        );
    }
}
