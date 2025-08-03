import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
// import 'rxjs/add/operator/publish';
import { SESSION_APP_ID } from '../../app.component';
import { PushNotificationToken } from '../../model/pushNotificationToken';
import { TokenStorage } from '../../token.storage';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';

@Injectable({
  providedIn: 'root'
})

export class PushNotificationService {

  constructor(
    private http: HttpClient,
    private device: Device,
    private tokenStorage: TokenStorage,
    private countryConfig: CountryConfigService
  ) { }

  generatePushNotificationDto(): PushNotificationToken {
    const token = new PushNotificationToken();

    token.deviceId = this.device.uuid;
    token.appId = SESSION_APP_ID;
    token.deviceType = this.device.platform;
    token.token = this.tokenStorage.getPushNotificationToken();

    return token;
  }

  saveUserToken(token: PushNotificationToken) {
    return this.http.post<PushNotificationToken>(this.countryConfig.getCoreApiURL() + '/api/pushNotification/saveUserToken', token, { observe: 'response' });
  }

  removeUserToken(token: PushNotificationToken) {
    return this.http.post<Boolean>(this.countryConfig.getCoreApiURL() + '/api/pushNotification/deleteUserToken', token, { observe: 'response' });
  }
}
