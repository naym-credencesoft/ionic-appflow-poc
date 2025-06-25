import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_ID } from '../app.component';
import { ApplicationUser } from '../model/user';
import { MessageDto } from '../pages/forgot-password/messageDto';
import { CountryConfigService } from './CountryConfig/countryConfig.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  // headers = new Headers();
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'APP_ID': APP_ID
  //   })
  // };

  constructor(private http: HttpClient, private countryConfig: CountryConfigService) { }

  findUserByEmail(email: string) {
    return this.http.get<any>(this.countryConfig.getCoreApiURL() + '/api/user/findByName/' + email + '/', { observe: 'response' });
  }

  authorisationToken(message: MessageDto): Observable<MessageDto[]> {
    let headers = new HttpHeaders({
      'APP_ID': APP_ID
    });
    return this.http.post<MessageDto[]>(this.countryConfig.getCoreApiURL() + '/api/message/authorisationToken', message, { headers: headers });
  }

  send(message: MessageDto) {
    return this.http.post<MessageDto[]>(this.countryConfig.getCoreApiURL() + '/api/message/send', message, { observe: 'response' });
  }

  verifyAuthorisationToken(message: MessageDto) {
    let headers = new HttpHeaders({
      'APP_ID': APP_ID
    });
    return this.http.post<MessageDto[]>(this.countryConfig.getCoreApiURL() + '/api/message/verifyAuthorisationToken', message, { headers: headers });
  }

  updatePassword(applicationUser: ApplicationUser) {
    return this.http.post<ApplicationUser>(this.countryConfig.getCoreApiURL() + '/api/user/updatePassword', applicationUser, { observe: 'response' });
  }
}
