import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../../model/address-setup/city';
import { Country } from '../../model/address-setup/country';
import { State } from '../../model/address-setup/state';
import { Street } from '../../model/address-setup/street';
import { Suburb } from '../../model/address-setup/suburbDto';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient,
    private countryConfig: CountryConfigService) { }

  createCountry(country: Country) {
    return this.http.post<Country>(this.countryConfig.getAddressApiURL() + '/api/countries', country, { observe: 'response' });
  }

  getCountryList() {
    return this.http.get<Country[]>(this.countryConfig.getAddressApiURL() + '/api/countries', { observe: 'response' });
  }

  getCountryListById(countryId: string) {
    return this.http.get<Country>(this.countryConfig.getAddressApiURL() + '/api/countries/' + countryId, { observe: 'response' });
  }

  deleteCountryById(countryId: string) {
    return this.http.delete<Country>(this.countryConfig.getAddressApiURL() + '/api/countries/' + countryId, { observe: 'response' });
  }

  // state

  createState(state: State) {
    return this.http.post<State>(this.countryConfig.getAddressApiURL() + '/api/region', state, { observe: 'response' });
  }

  getStateList() {
    return this.http.get<State[]>(this.countryConfig.getAddressApiURL() + '/api/region', { observe: 'response' });
  }

  geStateListById(stateId: string) {
    return this.http.get<State>(this.countryConfig.getAddressApiURL() + '/api/region/' + stateId, { observe: 'response' });
  }

  deleteStateById(stateId: string) {
    return this.http.delete<State>(this.countryConfig.getAddressApiURL() + '/api/region/' + stateId, { observe: 'response' });
  }

  // city

  createCity(city: City) {
    return this.http.post<City>(this.countryConfig.getAddressApiURL() + '/api/city', city, { observe: 'response' });
  }

  getCityList() {
    return this.http.get<City[]>(this.countryConfig.getAddressApiURL() + '/api/city', { observe: 'response' });
  }

  geCityListById(cityId: string) {
    return this.http.get<City>(this.countryConfig.getAddressApiURL() + '/api/city/' + cityId, { observe: 'response' });
  }

  deleteCityById(cityId: string) {
    return this.http.delete<State>(this.countryConfig.getAddressApiURL() + '/api/city/' + cityId, { observe: 'response' });
  }

  // suburb

  createSubrub(suburb: Suburb) {
    return this.http.post<Suburb>(this.countryConfig.getAddressApiURL() + '/api/suburb', suburb, { observe: 'response' });
  }

  getSuburbList() {
    return this.http.get<Suburb[]>(this.countryConfig.getAddressApiURL() + '/api/suburb', { observe: 'response' });
  }

  getSuburbListByCityName(cityName: string) {
    return this.http.get<Suburb[]>(this.countryConfig.getAddressApiURL() + '/api/suburb?cityName=' + cityName, { observe: 'response' });
  }

  getCityListByCityName(cityName: string) {
    return this.http.get<City[]>(this.countryConfig.getAddressApiURL() + '/api/city/findByName?cityName=' + cityName, { observe: 'response' });
  }


  geSuburbListById(id: string) {
    return this.http.get<Suburb>(this.countryConfig.getAddressApiURL() + '/api/suburb/' + id, { observe: 'response' });
  }

  deleteSuburbById(suburbId: string) {
    return this.http.delete<Suburb>(this.countryConfig.getAddressApiURL() + '/api/suburb/' + suburbId, { observe: 'response' });
  }

  // steet

  createStreet(steet: Street) {
    return this.http.post<Suburb>(this.countryConfig.getAddressApiURL() + '/api/street', steet, { observe: 'response' });
  }

  getSteetListByStreetName(streetName: string) {
    return this.http.get<Street[]>(this.countryConfig.getAddressApiURL() + '/api/street?streetName=' + streetName, { observe: 'response' });
  }

  getStreetListById(StreetId: string) {
    return this.http.get<Street>(this.countryConfig.getAddressApiURL() + '/api/street/' + StreetId, { observe: 'response' });
  }

  deleteSteetById(steetId: string) {
    return this.http.delete<Street>(this.countryConfig.getAddressApiURL() + '/api/street/' + steetId, { observe: 'response' });
  }
  SteetfileUpload(formData: any): Observable<any> {
    return this.http.post<any>(this.countryConfig.getAddressApiURL() + '/api/street/upload/file', formData, { observe: 'response' });
  }
}
