import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorage } from './../token.storage';
import { CountryConfigService } from './CountryConfig/countryConfig.service';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  headers = new Headers();
  httpOptions = {
    headers: new HttpHeaders({
      'USER_ID': this.token.getUserId()
    })
  };
  constructor(private http: HttpClient, private token: TokenStorage, private countryConfig: CountryConfigService) { }

  fileUploadToCloud(formData: any): Observable<any> {
    return this.http.post<any>(this.countryConfig.getCoreApiURL() + '/api/file/fileUploadCloudBookingApp', formData, this.httpOptions);
  }

  kotFileUploadToCloud(formData: any,bucket:string): Observable<any> {
    return this.http.post<any>(
      this.countryConfig.getCoreApiURL() + "/api/website/kotFileUpload?invoiceBucket="+bucket,
      formData,
      this.httpOptions
    );
  }
 
}
