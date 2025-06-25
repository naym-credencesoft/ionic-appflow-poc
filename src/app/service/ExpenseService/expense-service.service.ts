import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PropertyExpenseList } from "src/app/model/property/propertyExpense";
import { Expense } from "../../model/Expense/Expense";
import { CountryConfigService } from "../CountryConfig/countryConfig.service";
import { TokenStorage } from "./../../token.storage";

export interface ExpenseSummary {
    name: string;
    amount: number;
}

@Injectable({
    providedIn: "root",
})
export class ExpenseService {
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

    saveExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(
            this.countryConfig.getCoreApiURL() + "/api/expense/add",
            expense,
            this.httpOptions
        );
    }
    findByPropertyIdAndDateRange(
        propertyId: string,
        fromDate: string,
        toDate: string
    ): Observable<Expense[]> {
        return this.http.get<Expense[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/expense/findByPropertyAndDateRange/" +
                propertyId +
                "?FromDate=" +
                fromDate +
                "&ToDate=" +
                toDate,
            this.httpOptions
        );
    }
    findPropertyExpenseByPropertyId(propertyId: number) {
        return this.http.get<PropertyExpenseList[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/expenseList/propertyId/" +
                propertyId,
            { observe: "response" }
        );
    }
    findAllExpensesByUser(submittedBy: string): Observable<Expense[]> {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/expense/findByUser/" +
                submittedBy,
            this.httpOptions
        );
    }
    findAllExpensesByBookingId(bookingId: number): Observable<Expense[]> {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/expense/findByBookingId/" +
                bookingId,
            this.httpOptions
        );
    }
    findExpenseSummaryByPropertyId(
        propertyId: number
    ): Observable<ExpenseSummary[]> {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/expense/findExpenseSummaryByPropertyId/" +
                propertyId,
            this.httpOptions
        );
    }

    findAllExpensesByPropertyId(propertyId: string): Observable<Expense[]> {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/expense/findByProperty/" +
                propertyId,
            this.httpOptions
        );
    }

    updateExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(
            this.countryConfig.getCoreApiURL() + "/api/expense/update",
            expense,
            this.httpOptions
        );
    }
}
