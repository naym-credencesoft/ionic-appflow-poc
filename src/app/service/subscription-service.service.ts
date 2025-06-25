import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Subcription } from '../Subcription';
// import { this.countryConfig.getCoreApiURL()  } from './../../../app.component';
// import { TokenStorage } from './../../../token.storage';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subcription } from '../model/subscription/Subcription';
import { CountryConfigService } from './CountryConfig/countryConfig.service';
import { TokenStorage } from '../token.storage';

@Injectable({
  providedIn: 'root'
})
export class AddSubscriptionService {

 
  onboardingHeaderUserId: number;

  headers = new Headers();
  httpOptions = {
    headers: new HttpHeaders({
      'USER_ID': this.token.getUserId()
    })
  };
//   onBoardingHttpOptions = {
//     headers: new HttpHeaders({
//       'USER_ID': this.token.getOnBoardingUserId()
//     })
//   };

  constructor(private http: HttpClient, private token: TokenStorage,
    private countryConfig: CountryConfigService
  ) {
    // Logger.log('userID '+this.token.getUserId());
  }

  createSubcription(subcription: Subcription): Observable<Subcription> {
    return this.http.post<Subcription>(this.countryConfig.getCoreApiURL()  + '/api/subscription', subcription, this.httpOptions);
  }
  getSubcription() {
    return this.http.get<Subcription[]>(this.countryConfig.getCoreApiURL()  + '/api/subscription', { observe: 'response' });
  }
  getSubcriptionById(subscriptionId: string) {
    return this.http.get<Subcription>(this.countryConfig.getCoreApiURL()  + '/api/subscription/' + subscriptionId, { observe: 'response' });
  }

  getOrganizationSubcriptionById(subscriptionId: string, organizationId: string) {
    return this.http.get<Subcription>(this.countryConfig.getCoreApiURL()  + '/api/organisation/' + organizationId + '/subscription/' + subscriptionId, this.httpOptions);
  }

  addSubcription(subcription: Subcription, propertyId: number) {
    return this.http.post<Subcription>(this.countryConfig.getCoreApiURL()  + '/api/property/' + propertyId + '/addSubscription', subcription, this.httpOptions);
  }

  createOrganizationSubcription(subcription: Subcription, organizationId: string): Observable<Subcription> {
    return this.http.post<Subcription>(this.countryConfig.getCoreApiURL()  + '/api/organisation/' + organizationId + '/subscription', subcription, this.httpOptions);
  }
  updateOrganizationSubcription(subcription: Subcription): Observable<Subcription> {
    return this.http.post<Subcription>(this.countryConfig.getCoreApiURL()  + '/api/organisation/updateSubscription', subcription, this.httpOptions);
  }
  getOrganizationSubcription(organizationId: string) {
    return this.http.get<Subcription[]>(this.countryConfig.getCoreApiURL()  + '/api/organisation/' + organizationId + '/subscriptions', this.httpOptions);
  }
  getPropertySubcription(propertyId: string) {
    return this.http.get<Subcription[]>(this.countryConfig.getCoreApiURL()  + '/api/property/' + propertyId + '/subscriptions', this.httpOptions);
  }


  findPropertiesByOrganisation(organizationId: string) {
    return this.http.get<Subcription[]>(this.countryConfig.getCoreApiURL()  + '/api/organisation/' + organizationId + '/properties', this.httpOptions);
  }
}
