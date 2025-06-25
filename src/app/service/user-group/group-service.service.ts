import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Property } from 'src/app/model/property/Property';
import { TokenStorage } from 'src/app/token.storage';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';
import { PropertyUser } from 'src/app/model/property-user';
import { GroupUser } from 'src/app/model/group';
import { RoomFacilities } from 'src/app/model/roomFacilities';
import { ServiceTypeList } from 'src/app/model/serviceType';
import { PropertySequence } from 'src/app/pages/booking/propertySequence';

@Injectable({
  providedIn: 'root'
})
export class GroupServiceService {

  constructor(private http: HttpClient,
     private token: TokenStorage,
     private countryConfig: CountryConfigService) { }

  headers = new Headers();
  httpOptions = {
    headers: new HttpHeaders({
      USER_ID: this.token.getUserId(),
    }),
  };

  getPropertyDetailsByPropertyId(propertyId: number): Observable<Property> {
    return this.http.get<Property>(
      this.countryConfig.getCoreApiURL() + "/api/property/findById/" + propertyId,
      this.httpOptions
    );
  }

  // getRoomDetail(propertyId: number): Observable <Property> {
  //   return this.http.get<Property>(API_URL + '/api/property/findById/' + propertyId, this.httpOptions);
  // }

  createOrganization(group: GroupUser) {
    return this.http.post<GroupUser>(this.countryConfig.getCoreApiURL() + "/api/organisation", group, {
      observe: "response",
    });
  }

  createOrgService(servieType: ServiceTypeList) {
    return this.http.post<ServiceTypeList>(
      this.countryConfig.getCoreApiURL() + "/api/property/service",
      servieType,
      { observe: "response" }
    );
  }

  createOrgRoomFacilities(room: RoomFacilities) {
    return this.http.post<RoomFacilities>(
      this.countryConfig.getCoreApiURL() + "/api/room/facilities",
      room,
      { observe: "response" }
    );
  }

  getOrgServiceByOrgId(organizationId: number) {
    return this.http.get<ServiceTypeList[]>(
      this.countryConfig.getCoreApiURL() + "/api/property/service/organisation/" + organizationId,
      { observe: "response" }
    );
  }

  getPropertySequence(propertyId: number) {
    return this.http.get<PropertySequence[]>(
      this.countryConfig.getCoreApiURL() + "/api/property/sequence/" + propertyId,
      { observe: "response" }
    );
  }

  updatePropertySequence(squence: PropertySequence) {
    return this.http.post<PropertySequence>(
      this.countryConfig.getCoreApiURL() + "/api/property/sequence/" + squence.propertyId,
      squence,
      { observe: "response" }
    );
  }

  getOrgServiceByOrgIdAndServiceType(
    organizationId: number,
    serviceType: string
  ) {
    return this.http.get<ServiceTypeList[]>(
      this.countryConfig.getCoreApiURL() +
        "/api/property/service/organisation/" +
        organizationId +
        "/businessType/" +
        serviceType +
        "/",
      { observe: "response" }
    );
  }

  getOrgRoomFacilitiesByOrgId(organizationId: number) {
    return this.http.get<RoomFacilities[]>(
      this.countryConfig.getCoreApiURL() + "/api/room/facilities/organisation/" + organizationId,
      { observe: "response" }
    );
  }

  getPropertiesCountByPlan(organizationId: number) {
    return this.http.get<any>(
      this.countryConfig.getCoreApiURL() +
        "/api/organisation/" +
        organizationId +
        "/propertiesCountByPlan",
      { observe: "response" }
    );
  }

  getOrganizationPropertiesCount() {
    return this.http.get<any>(
      this.countryConfig.getCoreApiURL() + "/api/website/getTotalRegisteredProperty",
      { observe: "response" }
    );
  }

  getAllOrganization(): Observable<GroupUser[]> {
    return this.http.get<GroupUser[]>(this.countryConfig.getCoreApiURL() + "/api/organisation");
  }
  getOrganizationById(organisationId: string): Observable<GroupUser> {
    return this.http.get<GroupUser>(
      this.countryConfig.getCoreApiURL() + "/api/organisation/" + organisationId
    );
  }

  getPropertyByOrganizationId(
    organisationId: string,
    businessType: string
  ): Observable<Property[]> {
    return this.http.get<Property[]>(
      this.countryConfig.getCoreApiURL() + "/api/organisation/" + organisationId + "/properties",
      this.httpOptions
    );
  }

  getPropertytotalCountByOrganizationId(
    organisationId: string
  ): Observable<Property> {
    return this.http.get<Property>(
      this.countryConfig.getCoreApiURL() + "/api/organisation/" + organisationId + "/totalCount",
      this.httpOptions
    );
  }

  getPaginationPropertyByOrganizationId(
    organisationId: string,
    pageNo: number,
    pageSize: number
  ): Observable<Property[]> {
    return this.http.get<Property[]>(
      this.countryConfig.getCoreApiURL() +
        "/api/organisation/" +
        organisationId +
        "/properties?pageNo=" +
        pageNo +
        "&pageSize=" +
        pageSize,
      this.httpOptions
    );
  }

findPropertiesByName(
    name: string
  ): Observable<Property[]> {
    return this.http.get<Property[]>(
      this.countryConfig.getCoreApiURL() +
        "/api/property/findByName?name=" +
        name+"&organisationId="+this.token.getOrganizationId()
    );
  }

  getPropertyByOrganizationIdAndBusinesType(
    organisationId: string,
    businessType: string
  ): Observable<Property[]> {
    return this.http.get<Property[]>(
      this.countryConfig.getCoreApiURL() +
        "/api/organisation/" +
        organisationId +
        "/properties?businessType=" +
        businessType,
      this.httpOptions
    );
  }

  getOrganizationUserByOrganizationId(
    organizationId: string
  ): Observable<PropertyUser[]> {
    //  Logger.log(this.countryConfig.getCoreApiURL() + '/api/user/organisation/3405');
    return this.http.get<PropertyUser[]>(
      this.countryConfig.getCoreApiURL() + "/api/user/organisation/" + organizationId
    );
  }

  deActivateProperty(propertyId: string) {
    return this.http.get<any>(
      this.countryConfig.getCoreApiURL() + "/api/property/deactivateBusiness/" + propertyId
    );
  }

  activateProperty(propertyId: string) {
    return this.http.get<any>(
      this.countryConfig.getCoreApiURL() + "/api/property/activateBusiness/" + propertyId
    );
  }
}
