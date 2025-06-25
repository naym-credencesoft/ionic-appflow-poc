import { Component, OnInit } from '@angular/core';
import { OTAChannelPropertyDTO } from '../../model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { DateService } from '../../service/DateService/date-service.service';
import { ExternalReservationService } from '../../service/ExternalReservation/external-reservation.service';
import { Logger } from '../../service/logger.service';
import { PropertyService } from '../../service/property/property.service';
import { Property } from "src/app/model/property/Property";
import { TokenStorage } from '../../token.storage';
import { ExternalReservation } from './../../model/ExternalReservation/ExternalReservation';
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-external-reservation',
  templateUrl: './external-reservation.page.html',
  styleUrls: ['./external-reservation.page.scss'],
})
export class ExternalReservationPage implements OnInit {
    property: Property;
  isProgressing: boolean = false;
  propertydetails: OTAChannelPropertyDTO;
  travelAgencies: any;
  rows: ExternalReservation[] = [];
  columns = [];
  temp: ExternalReservation[] = [];

  loader = false;
  p: number = 1;

  constructor(private service: ExternalReservationService,
    private token: TokenStorage,
    private propertyService: PropertyService,
    public dateService: DateService, public navCtrl: NavController, ) {
    this.propertydetails = new OTAChannelPropertyDTO();
    this.property = new Property();

    // tslint:disable-next-line: radix
    this.getConfiguredPropertyDetailsByPropertyId(parseInt(this.token.getPropertyId()));
  }

  ngOnInit() {
    // this.getListData();
    this.property = this.token.getProperty();
        console.log("property details", this.property)
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/home');
  }
  getConfiguredPropertyDetailsByPropertyId(propertyId: number) {
    this.isProgressing = true;
    this.loader = true;
    this.propertyService.getConfiguredPropertyDetailsByPropertyId(propertyId).subscribe(data => {
      this.propertydetails = data;
      this.travelAgencies = this.propertydetails.roomDtos[0].onlineTravelAgenciesDto;
      this.loader = false;
      this.isProgressing = false;
      this.columns = this.service.getDataConf();
      // tslint:disable-next-line: no-shadowed-variable
      this.service.getByOtaPropertyId(this.travelAgencies[0].propertyId).subscribe(data => {
        this.rows = this.temp = data.body;
        this.loader = false;
        this.isProgressing = false;
        Logger.log('OTA' + JSON.stringify(data.body));
      });
      Logger.log('OTA propertydetails ' + JSON.stringify(this.travelAgencies[0].propertyId));
    }, error => {
      this.isProgressing = false;
      this.loader = false;
    });
  }
  //   getListData()
  //   {
  //       this.isProgressing = true;
  //     this.service.getAllExternalReservationsByChannelId(2).subscribe(data => {
  //         this.rows =  data.body;
  //         this.searchOb = data.body;
  //         this.isProgressing = false;
  //         Logger.log('data.body : '+JSON.stringify(data.body));
  //       });
  //   }

  getItems(ev: any) {

    const val = ev.target.value;

    Logger.log('search -- ' + val);

    if (val === '') {
      this.getConfiguredPropertyDetailsByPropertyId(parseInt(this.token.getPropertyId()));
    }
    else {
      this.rows = this.temp;

      this.rows = this.rows.filter((item) => {

        const searchResult = (
          (item.firstName + ' ' + item.lastName).toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) > -1 ||
          item.status.toLowerCase().indexOf(val.toLowerCase().trim()) > -1 ||
          item.externalTransactionId.toLowerCase().indexOf(val.toLowerCase().trim()) > -1)

        return searchResult;
      })

    }

  }

  clear(event) {

  }

}
