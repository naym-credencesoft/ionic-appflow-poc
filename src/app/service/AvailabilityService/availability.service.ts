import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Availability } from "src/app/model/Availbility/availability";
import { RateBundle } from "src/app/model/Availbility/rate-bundle";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { CountryConfigService } from "../CountryConfig/countryConfig.service";
import { Bed } from "./../../model/bed";
import { RatesAndAvailability } from "./../../model/manage-booking/rateandavailability/rateandavailability";
import { RoomDetails } from "./../../model/RoomDetails/RoomDetails";
import { OtaAvailability } from "src/app/pages/availability-update/otaAvailability";
import { OTAPlan } from "src/app/model/otaPlan/otaPlan";

@Injectable({
    providedIn: "root",
})
export class AvailabilityService {
    constructor(
        private http: HttpClient,
        private countryConfig: CountryConfigService
    ) {}

    getAvailableRoomsByDateAndRoomIdAndPropertyId(
        propertyId: string,
        booking: Booking
    ) {
        return this.http.get<any[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getAvailableRooms/" +
                propertyId +
                "/" +
                booking.roomId +
                "?FromDate=" +
                booking.fromDate +
                "&ToDate=" +
                booking.toDate,
            { observe: "response" }
        );
    }
    blockAvailability(
        date: any[],
        roomId: number,
        stopSellOBE: boolean,
        stopSellOTA: boolean,
        otaNames: string[],
        daySelected: string[]
      ) {
        return this.http.post(
            this.countryConfig.getCoreApiURL() +
            "/api/availability/blockRoomAvailability?roomId=" +
            roomId +
            "&stopSellOBE=" +
            stopSellOBE +
            "&stopSellOTA=" +
            stopSellOTA +
            "&otaNames=" +
            otaNames.toString() +
            "&weekList="+
            daySelected.toString(),
          date,
          { observe: "response" }
        );
      }

      blockPropertyAvailability(
        date: any[],
        propertyId: number,
        stopSellOBE: boolean,
        stopSellOTA: boolean,
        otaNames: string[],
        daySelected: string[]
      ) {
        return this.http.post(
            this.countryConfig.getCoreApiURL() +
            "/api/availability/blockPropertyAvailability?propertyId=" +
            propertyId +
            "&stopSellOBE=" +
            stopSellOBE +
            "&stopSellOTA=" +
            stopSellOTA +
            "&otaNames=" +
            otaNames.toString() +
            "&weekList="+
            daySelected.toString(),
          date,
          { observe: "response" }
        );
      }
      UnblockPropertyAvailability(
        date: any[],
        propertyId: number,
        stopSellOBE: boolean,
        stopSellOTA: boolean,
        otaNames: string[],
        daySelected: string[]
      ) {
        return this.http.post(
            this.countryConfig.getCoreApiURL() +
            "/api/availability/unBlockPropertyAvailability?propertyId=" +
            propertyId +
            "&stopSellOBE=" +
            stopSellOBE +
            "&stopSellOTA=" +
            stopSellOTA +
            "&otaNames=" +
            otaNames.toString() +
            "&weekList="+
            daySelected.toString(),
          date,
          { observe: "response" }
        );
      }
      unBlockAvailability(
        date: any[],
        roomId: number,
        stopSellOBE: boolean,
        stopSellOTA: boolean,
        otaNames: string[],
        daySelected: string[]
      ) {
        return this.http.post(
            this.countryConfig.getCoreApiURL() +
            "/api/availability/unBlockRoomAvailability?roomId=" +
            roomId +
            "&stopSellOBE=" +
            stopSellOBE +
            "&stopSellOTA=" +
            stopSellOTA +
            "&otaNames=" +
            otaNames.toString() +
            "&weekList="+
            daySelected.toString(),
          date,
          { observe: "response" }
        );
      }
    updateOTARoomPlan(plan: OTAPlan , roomId : number) {
        return this.http.post<OTAPlan>(
            this.countryConfig.getCoreApiURL()+ "/api/room/updateOtaPlan/room/"+roomId,
          plan,
          { observe: "response" }
        );
      }
      addOTARoomPlan(plan: OTAPlan , roomId : number) {
        return this.http.post<OTAPlan>(
            this.countryConfig.getCoreApiURL() + "/api/room/addOtaPlan/room/"+roomId,
          plan,
          { observe: "response" }
        );
      }
    fetchOtaPlanByPlanCode(roomId : number, planCode : string) {
        return this.http.post<OTAPlan[]>(
            this.countryConfig.getCoreApiURL() + "/api/room/getOtaPlan/room/"+roomId+"/planCode/"+planCode,
          { observe: "response" }
        );
      }

    getAvailableBookingRoomsByRoomId(booking: Booking, roomId: number) {
        return this.http.get<any[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getAvailableRooms/" +
                booking.propertyId +
                "/" +
                roomId +
                "?FromDate=" +
                booking.fromDate +
                "&ToDate=" +
                booking.toDate,
            { observe: "response" }
        );
    }

    getAvailableRooms(bookingId: number) {
        return this.http.get<RoomDetails[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getAvailableRooms/" +
                bookingId,
            { observe: "response" }
        );
    }

    getAvailableBeds(bookingId: number) {
        return this.http.get<Bed[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getAvailableBeds/" +
                bookingId,
            { observe: "response" }
        );
    }

    getAllRoomStatusForToday(propertyId: number) {
        return this.http.get<RoomDetails[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getAllRoomsOnCurrentDate/" +
                propertyId,
            { observe: "response" }
        );
    }
    bulkUpdateOfAvailability(
        otaAvailabilityList: OtaAvailability[],updateInPms:boolean
      ) {
        return this.http.post(
            this.countryConfig.getCoreApiURL() +
            "/api/availability/bulkOtaAvailabilityUpdate?applicableToPMS="+updateInPms,
            otaAvailabilityList,
          { observe: "response" }
        );
      }
    addOrUpdateOtaAvailability(
        otaAvailability: OtaAvailability,updateInPms:boolean
      ) {
        return this.http.post(
            this.countryConfig.getCoreApiURL()+
            "/api/availability/addOrUpdateOtaAvailability?applicableToPMS="+updateInPms,
          otaAvailability,
          { observe: "response" }
        );
      }

    getAvailabilityForPropertyAllNext7Days(propertyId: number) {
        return this.http.get<RatesAndAvailability[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getNext7daysRatesAndAvailabilityForProperty?PropertyId=" +
                propertyId,
            { observe: "response" }
        );
    }

    getAvailabilityForRoomAllNext7Days(propertyId: number, roomId: number) {
        return this.http.get<RatesAndAvailability[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getNext7daysRatesAndAvailabilityForRoom?PropertyId=" +
                propertyId +
                "&RoomId=" +
                roomId,
            { observe: "response" }
        );
    }

    updateRatesAvailability(rateAndAvailability: RatesAndAvailability) {
        return this.http.post<RatesAndAvailability>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/updateAvailability",
            rateAndAvailability,
            { observe: "response" }
        );
    }

    getAvailabilityForPropertyByDate(
        rateAndAvailability: RatesAndAvailability
    ) {
        return this.http.post<RatesAndAvailability[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getRatesAndAvailabilityForPropertyByDate",
            rateAndAvailability,
            { observe: "response" }
        );
    }

    getAvailabilityForRoomByDate(rateAndAvailability: RatesAndAvailability) {
        return this.http.post<any[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getRatesAndAvailabilityForRoomByDate",
            rateAndAvailability,
            { observe: "response" }
        );
    }

    getAvailabilityByDate(rateAndAvailability: RatesAndAvailability) {
        return this.http.post<RatesAndAvailability[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/getRatesAndAvailabilityByDate",
            rateAndAvailability,
            { observe: "response" }
        );
    }

    addRate(availability: Availability) {
        return this.http.post<Availability>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/addAvailabilityByRoomAndDateRange",
            availability,
            { observe: "response" }
        );
    }

    updateRate(rateBundle: RateBundle) {
        return this.http.post<RateBundle>(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/bulkAvailabilityUpdateByRoomAndDateRange",
            rateBundle,
            { observe: "response" }
        );
    }

    blockAndUnBlockAvailabilityForOTA(
        date: any[],
        roomId: number,
        stopSellOBE: boolean,
        stopSellOTA: boolean,
        otaNames: string[],
    ) {
        return this.http.post(
            this.countryConfig.getCoreApiURL() +
                "/api/availability/stopSellOTAAndOBE?roomId=" +
                roomId +
                "&stopSellOBE=" +
                stopSellOBE +
                "&stopSellOTA=" +
                stopSellOTA +  
                "&otaNames=" +
                otaNames.toString(),
            date, 
            { observe: "response" }
        );
    }
}
