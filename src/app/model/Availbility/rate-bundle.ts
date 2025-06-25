
export class RateBundle {

  roomId: number;
  propertyId: number;
  fromDate: string;
  toDate: string;
  price: number;
  totalNoRooms : number;
  noOfBooked : number;
  noOfAvailable : number;
  noOfOnHold : number;
  status : string;
  restriction : string;
  channelManagerUpdateType : string;

  constructor() {
   }
}
