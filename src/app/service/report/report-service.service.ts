import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';
import { TokenStorage } from 'src/app/token.storage';
import { Payment } from 'src/app/model/manage-booking/Payment/Payment';
import { Order } from 'src/app/model/Order/order';

@Injectable({
  providedIn: 'root'
})
export class ReportService{
    constructor(private http: HttpClient,
      private countryConfig: CountryConfigService,
      private token: TokenStorage,
      
      ) { }
    
        getAllPaymentsByPropertyIdAndDateRange(
          propertyId: string,
          FromDate: string,
          ToDate: string,
          operatorName : string
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
              ToDate+operatorName,
            { headers: headers }
          );
        }

        getOrderReportsByPropertyIdAndDateRange(
          propertyId: string,
          FromDate: string,
          ToDate: string
        ) {
          return this.http.get<Order[]>(
            this.countryConfig.getCoreApiURL() +
              "/api/order/orderReports?PropertyId=" +
              propertyId +
              "&FromDate=" +
              FromDate +
              "&ToDate=" +
              ToDate,
            { observe: "response" }
          );
        }

        downloadOrderedProductReport(propertyId: string,
          FromDate: string,
          ToDate: string){
          return this.http.get<Blob>(
            this.countryConfig.getCoreApiURL() +
              "/api/order/download/orderedProductReport.xlsx?PropertyId=" +
              propertyId +
              "&FromDate=" +
              FromDate +
              "&ToDate=" +
              ToDate,
              { observe: 'response', responseType: 'blob' as 'json' }
          );
        }

        downloadOrderGSTReport(propertyId: string, FromDate: string, ToDate: string) {
          return this.http.get<Blob>(
            this.countryConfig.getCoreApiURL() +
              "/api/order/download/orderGSTReport.xlsx?PropertyId=" +
              propertyId +
              "&FromDate=" +
              FromDate +
              "&ToDate=" +
              ToDate,
            { observe: "response", responseType: "blob" as "json" }
          );
        }

        downloadOrderReport(propertyId: string, FromDate: string, ToDate: string) {
          return this.http.get<Blob>(
            this.countryConfig.getCoreApiURL() +
              "/api/order/download/orderReport.xlsx?PropertyId=" +
              propertyId +
              "&FromDate=" +
              FromDate +
              "&ToDate=" +
              ToDate,
            { observe: "response", responseType: "blob" as "json" }
          );
        }

        getOrderedProductReportByPropertyIdAndDateRange(
          propertyId: string,
          FromDate: string,
          ToDate: string
        ) {
          return this.http.get<any[]>(
            this.countryConfig.getCoreApiURL() +
              "/api/order/orderedProductReport?PropertyId=" +
              propertyId +
              "&FromDate=" +
              FromDate +
              "&ToDate=" +
              ToDate,
            { observe: "response" }
          );
        }
    
    }