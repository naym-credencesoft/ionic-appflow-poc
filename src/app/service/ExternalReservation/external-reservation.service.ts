import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OTAChannelPropertyDTO } from '../../model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';
import { ExternalReservation } from './../../model/ExternalReservation/ExternalReservation';

@Injectable({
  providedIn: 'root'
})
export class ExternalReservationService {
  constructor(private http: HttpClient, private countryConfig: CountryConfigService) { }
  getDataConf() {
    return [
      {
        prop: 'id'
      },
      {
        prop: 'channelId',
        name: 'Channel ID'
      },
      {
        prop: 'externalTransactionId',
        name: 'External Transaction ID'
      },
      {
        prop: 'bookoneReservationId',
        name: 'BookOne Reservation ID'
      },
      {
        prop: 'createdTimestamp',
        name: 'Created'
      },
      {
        prop: 'updatedTimestamp',
        name: 'Updated'
      },
      {
        prop: 'status',
        name: 'Status'
      },
      {
        prop: 'payloadType',
        name: 'Payload Type'
      }
    ];
  }
  getAllExternalReservationsByChannelId(channelId: number) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<ExternalReservation[]>(this.countryConfig.getChannelIntegrationApiURL() + '/api/external/reservation/getByOTAId/' + channelId, { observe: 'response' });
  }

  getConfiguredPropertyDetailsByPropertyId(propertyId: number): Observable<OTAChannelPropertyDTO> {
    return this.http.get<OTAChannelPropertyDTO>(this.countryConfig.getChannelIntegrationApiURL() + '/api/channelManager/property/' + propertyId);
  }

  getByOtaPropertyId(otaPropertyId: number) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<ExternalReservation[]>(this.countryConfig.getChannelIntegrationApiURL() + '/api/external/reservation/getByOtaPropertyId/' + otaPropertyId, { observe: 'response' });
  }
}
