import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/publish';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Msg } from '../../model/manage-booking/Msg/Msg';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private _notification: BehaviorSubject<string> = new BehaviorSubject(null);
  readonly notification$: Observable<string> = this._notification.asObservable().publish().refCount();
  constructor(private http: HttpClient, private countryConfig: CountryConfigService) { }

  sendTextMessage(message: Msg) {
    return this.http.post<Msg>(this.countryConfig.getCoreApiURL() + '/api/message/send', message, { observe: 'response' });
  }

  notify(message) {
    this._notification.next(message);
    setTimeout(() => this._notification.next(null), 3000);
  }
}
