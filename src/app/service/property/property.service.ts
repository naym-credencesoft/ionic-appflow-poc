import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomDetails } from 'src/app/model/RoomDetails/RoomDetails';
import { Plan } from 'src/app/pages/booking/plan';
import { OTAPropertyMapping } from '../../model/otaProperty';
import { OTAChannelPropertyDTO } from '../../model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { OTARoomMapping } from '../../model/otaRoom';
import { Property } from '../../model/property/Property';
import { RoomDetailStatus } from '../../model/RoomDetails/RoomDetailStatus';
import { Logger } from '../../service/logger.service';
import { CountryConfigService } from '../CountryConfig/countryConfig.service';
import { Room } from './../../model/room';
import { RoomAvailability } from './../../model/RoomAvailability/RoomAvailability';
import { TokenStorage } from './../../token.storage';
import { PropertySequence } from 'src/app/pages/booking/propertySequence';
import { Audit } from '../audit';
import { PointOfSale } from 'src/app/model/Pos/pointOfSale';
import { PropertyPayment } from 'src/app/model/PropertyPayment/propertyPayment';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {
  headers = new Headers();
  httpOptions = {
    headers: new HttpHeaders({
      'USER_ID': this.token.getUserId()
    })
  };

  constructor(private http: HttpClient, private token: TokenStorage, private countryConfig: CountryConfigService) {
    Logger.log('userID ' + this.token.getUserId());
  }
  getAllPaymentBypropertyId(propertyId): Observable<any[]> {
    return this.http.get<PropertyPayment[]>(
      this.countryConfig.getCoreApiURL() + "/api/propertyPayment/getAllByPropertyId/"+propertyId
    );
  }
  getRoomDetailsByPropertyId(propertyId: number): Observable <Room[]> {
    return this.http.get<Room[]>(this.countryConfig.getCoreApiURL() + '/api/property/'+propertyId+'/rooms');
  }
  getAllAuditReportByBookingId(bookingId){
    return this.http.get<Audit[]>(
        this.countryConfig.getCoreApiURL()  + "/api/auditReports/getByBookingId?bookingId="+bookingId
    );
  }
  getAllPointOfSale(propertyId: number): Observable<PointOfSale[]> {
    return this.http.get<PointOfSale[]>(
      this.countryConfig.getCoreApiURL() + "/api/property/" + propertyId + "/pointOfSale"
    );
  }
  createAuditReport(audit: Audit) {
    // Logger.log(booking);
    return this.http.post<Audit>(
        this.countryConfig.getCoreApiURL()  + "/api/auditReports/",
      audit,
      { observe: "response" }
    );
  }

  addPlan(plan: Plan, propertyId: string, roomId: string) {
    return this.http.post<Plan>(this.countryConfig.getCoreApiURL() + '/api/room/property/'+propertyId+'/room/'+roomId+'/roomPlan', plan, { observe: 'response' });
  }
  masterRateUpdate(plans: Plan[],applicableToOta:boolean,applicableToPMS:boolean,increaseRate:number,decreaseRate:number,customAmount:number) {
    return this.http.post<Plan[]>(
        this.countryConfig.getCoreApiURL()+ "/api/availability/bulkUpdatePlan?applicableToOta="+applicableToOta+"&applicableToPMS="+applicableToPMS+"&increaseRate="+increaseRate+"&decreaseRate="+decreaseRate +"&customAmount="+customAmount,
      plans,
      { observe: "response" }
    );
  }

  getPlan( propertyId: string, roomId: string) {
    return this.http.get<Plan[]>(this.countryConfig.getCoreApiURL() + '/api/room/property/'+propertyId+'/room/'+roomId+'/roomPlan',{ observe: 'response' });
  }

  createProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.countryConfig.getCoreApiURL() + '/api/property/user/add/property', property, this.httpOptions);
  }

  updateProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.countryConfig.getCoreApiURL() + '/api/property/user/update/property', property, this.httpOptions);
  }
  getAllAuditReportByOrderId(OrderId){
    return this.http.get<Audit[]>(
        this.countryConfig.getCoreApiURL()  + "/api/auditReports/getOrderId?orderId="+OrderId
    );
  }

  getPropertiesDetailsByUserId(userId: string): Observable<Property[]> {
    return this.http.get<Property[]>(this.countryConfig.getCoreApiURL() + '/api/property/findByUserId/' + userId);
  }

  addRoomToProperty(propertyId: number, room: Room): Observable<Room> {
    return this.http.post<Room>(this.countryConfig.getCoreApiURL() + '/api/property/' + propertyId + '/user/add/room', room, this.httpOptions);
  }

  addYearlyRatesForProperty(property: Property) {
    return this.http.post<any>(this.countryConfig.getCoreApiURL() + '/api/property/addYearlyRates', property, this.httpOptions);
  }

  getPropertySequence(propertyId: number) {
    return this.http.get<PropertySequence[]>(
        this.countryConfig.getCoreApiURL() + "/api/property/sequence/" + propertyId,
      { observe: "response" }
    );
  }
  addYearlyRatesForRoom(room: Room) {
    return this.http.post<any>(this.countryConfig.getCoreApiURL() + '/api/room/addYearlyRates', room, this.httpOptions);
  }

  findAllRoomsForProperty(propertyId: number) {
    Logger.log('User ID from Token' + this.token.getUserId());
    Logger.log('HTTP Options' + this.httpOptions);
    return this.http.get<any>(this.countryConfig.getCoreApiURL() + '/api/property/' + propertyId + '/user/findAll/rooms', this.httpOptions);
  }

  getPropertyDetailsByPropertyId(propertyId: number): Observable<Property> {
    return this.http.get<Property>(this.countryConfig.getCoreApiURL() + '/api/property/findById/' + propertyId, this.httpOptions);
  }

  getAllRoomsByDate(roomavailability: RoomAvailability) {
    return this.http.get<any>(this.countryConfig.getCoreApiURL() + '/api/availability/getAllRoomsByDate?PropertyId=' + roomavailability.PropertyId + '&FromDate=' + roomavailability.FromDate + '&ToDate=' + roomavailability.ToDate, { observe: 'response' });
  }

  updateRoomDetailStatus(roomstatus: RoomDetailStatus) {
    return this.http.post<RoomDetailStatus>(this.countryConfig.getCoreApiURL() + '/api/roomDetails/status', roomstatus, { observe: 'response' });
  }

  propertyMapping(channelId: number, otaPropertyMapping: OTAPropertyMapping) {
    return this.http.post<OTAPropertyMapping>(this.countryConfig.getChannelIntegrationApiURL() + '/api/channelManager/' + channelId + '/add/property', otaPropertyMapping, { observe: 'response' });
  }

  roomMapping(channelId: number, propertyId: number, otaRoomMapping: OTARoomMapping) {
    return this.http.post<OTARoomMapping>(this.countryConfig.getChannelIntegrationApiURL() + '/api/channelManager/' + channelId + '/bookOneproperty/' + propertyId + '/add/room', otaRoomMapping, { observe: 'response' });
  }

  getConfiguredPropertyDetailsByOrganizationId(organizationId: number): Observable<OTAChannelPropertyDTO[]> {
    return this.http.get<OTAChannelPropertyDTO[]>(this.countryConfig.getChannelIntegrationApiURL() + '/api/channelManager/organisation/' + organizationId);
  }

  getConfiguredPropertyDetailsByPropertyId(propertyId: number): Observable<OTAChannelPropertyDTO> {
    return this.http.get<OTAChannelPropertyDTO>(this.countryConfig.getChannelIntegrationApiURL() + '/api/channelManager/property/' + propertyId);
  }
  updatePropertyOnBoarding(property: Property): Observable<Property> {
    // Logger.log('user ID inside update property onboarding'+this.token.getOnBoardingUserId());
    return this.http.post<Property>(this.countryConfig.getCoreApiURL() + '/api/property/user/update/property', property, this.httpOptions);
  }

  addRoomPlan(plan: Plan) {
    return this.http.post<Plan>(this.countryConfig.getCoreApiURL() + '/api/availability/addOrUpdatePlan', plan, { observe: 'response' });
  }

  updateRoomDetailStatusInCheckedInFrom(roomstatus: RoomDetails) {
    return this.http.post<RoomDetails>(this.countryConfig.getCoreApiURL() + '/api/roomDetails/status', roomstatus, { observe: 'response' });
  }



}
