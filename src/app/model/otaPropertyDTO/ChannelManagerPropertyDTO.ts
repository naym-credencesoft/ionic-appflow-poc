import { OnlineTravelAgencies } from '../otaPropertyDTO/onlineTravelAgencies';
import { OTAChannelRoomDTO } from '../otaPropertyDTO/channelManagerRoom';
import { PropertiesOnlineTravelAgencies } from '../Booking/propertiesOTA';

export class OTAChannelPropertyDTO {

    bookingCommissionFee: number;
    bookingCommissionFeeType: string;
    bookonePropertyId: number;
    convenienceFee: number;
    convenienceFeeType: string;
    name: string;
    email: string;
    id: number;
    onlineTravelAgencies: OnlineTravelAgencies[];
    onlineTravelAgencyPropertyId: number;
    organisationId: number;
    roomDtos: OTAChannelRoomDTO[];
    propertiesOnlineTravelAgencies : PropertiesOnlineTravelAgencies[];
  


    constructor() {
     }
}
