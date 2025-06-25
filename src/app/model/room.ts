import { Bed } from '../model/bed';
// import { MatTableDataSource } from '@angular/material';
import { RoomDetails } from '../model/RoomDetails/RoomDetails';
import { RatesAndAvailability } from './manage-booking/rateandavailability/rateandavailability';
// import { RateAndAvailability } from './rateAndAvailability';
import { RoomImage } from './RoomDetails/roomImage';
//import { RatesAndAvailability } from './../rates-availability/manage/manage-rates-availability.component';
export class Room {

    id: number;
    name: string;
    description: string;
    minimumOccupancy: number;
    maximumOccupancy: number;
    extraChargePerPerson: number;
    pricePerWeek: number;
    priceMonthly: number;
    propertyId: number;
    hsnCode	:string;
    roomOnlyPrice: number;
    totalPriceServices: number;
    totalPriceAmenities: number;
    totalPriceRoom: number;
    noOfPerson: number;
    shared: Boolean;
    noOfRooms: number ;
    beds: Bed[];
    roomDetails: RoomDetails[];
    imageList : RoomImage[];
    maximumLengthOfStay : number;
    minimumLengthOfStay : number;
  //  dataSource: MatTableDataSource<RatesAndAvailability> ;
  rateAndAvailabilityList: RatesAndAvailability[];
  
    constructor()
        { } 
}