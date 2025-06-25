import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TokenStorage } from '../../token.storage';

@Injectable({
  providedIn: 'root'
})

export class CountryConfigService {

  constructor(
    private tokenStorage: TokenStorage
  ) { }

  getAllCountries(): any {
    return environment.countries;
  }

  getStoredCountry(): any {
    let selectedCountry = this.tokenStorage.getSelectedCountry();
    if (selectedCountry == null || selectedCountry == undefined || selectedCountry == '') {
      selectedCountry = 'NZ';
    }

    return environment.countries.find(c => c.code == selectedCountry);
  }

  setCountry(countryCode: string) {
    this.tokenStorage.saveSelectedCountry(countryCode || 'NZ');

  }

  getCoreApiURL() {
    const countryData = this.getStoredCountry();
    return countryData.url.coreApi;
  }
  getscheduleApiURL() {
    const countryData = this.getStoredCountry();
    return countryData.url.scheduleApiUrl;
  }

  getEmpApiURL() {
    const countryData = this.getStoredCountry();
    return countryData.url.apiUrlEms;
  }


  getPromotionApiURL() {
    const countryData = this.getStoredCountry();
    return countryData.url.promotionApi;
  }

  getPromotionApiURLs() {
    const countryData = this.getStoredCountry();
    return countryData.url.promotionApis;
  }

  getAddressApiURL() {
    const countryData = this.getStoredCountry();
    return countryData.url.addressApi;
  }

  getInventoryApiURL() {
    const countryData = this.getStoredCountry();
    return countryData.url.apiUrlInventory;
  }

  getChannelIntegrationApiURL() {
    const countryData = this.getStoredCountry();
    return countryData.url.channelIntegrationApi;
  }
}
