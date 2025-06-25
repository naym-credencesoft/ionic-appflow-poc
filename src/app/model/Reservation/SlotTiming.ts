import { SlotAvailability } from "./SlotAvailability";
import { SlotPricing } from "./SlotPricing";


export class SlotTiming {

  id: number;
  duration : string;
  finishTime : string;
  startTime : string;
  slotAvailabilityDto : SlotAvailability;
  slotPricingDto : SlotPricing;
  notes : string;
  ischecked : boolean = false;

  constructor()
      { }
}
