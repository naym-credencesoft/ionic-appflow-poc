import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Availability } from 'src/app/model/Availbility/availability';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';

@Injectable({
  providedIn: 'root'
})
export class LoadDateService {

    constructor(
        private http: HttpClient,
        private countryConfig: CountryConfigService) { }


        minLoadDate(roomId :string) {
            return this.http.get<Availability>(this.countryConfig.getCoreApiURL() + '/api/availability/minLoadDate?RoomId='+roomId,  { observe: 'response' });
          }
        
          maxLoadDate(roomId :string) {
            return this.http.get<Availability>(this.countryConfig.getCoreApiURL() + '/api/availability/maxLoadDate?RoomId='+roomId,  { observe: 'response' });
          }
}
