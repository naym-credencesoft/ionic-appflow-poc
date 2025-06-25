import { Subscription } from "rxjs";
import { Subcription } from "./model/subscription/Subcription";

const BOOKING_ENGINE = "Booking Engine";
const CHANNEL_MANAGEMENT = "Channel Management";
const BOOKONE_CHANNEL_MANAGER = "Bookone channel manager";
export class CheckSubscription {
  public getBookingEngine() {
    return BOOKING_ENGINE;
  }

  public getChannelManagement() {
    return CHANNEL_MANAGEMENT;
  }
  public getBookoneChannelManager() {
    return BOOKONE_CHANNEL_MANAGER;
  }

  isSubscriptionMatch(type: string, subscriptions: Subcription[]) {
    if (
      subscriptions != null &&
      subscriptions.length > 0 &&
      subscriptions.some((data) => data.name != null && data.name === type) ==
        true
    ) {
      return true;
    } else {
      return false;
    }
  }
}
