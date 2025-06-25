import { OnlineTravelAgencies } from '../otaPropertyDTO/onlineTravelAgencies';

export class OTAChannelRoomDTO {

  name: number;
  description: string;
  bookoneRoomId: number;
  onlineTravelAgencyRoomId: number;
  onlineTravelAgenciesDto: OnlineTravelAgencies[];

  constructor() {
   }
}