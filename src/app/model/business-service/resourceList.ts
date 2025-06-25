import { SlotTiming } from "../Reservation/SlotTiming";
import { LocationList } from "../Reservation/locationList";



export class ResourceList {

  name: string;
  desc: string;
  imageUrl : string;
  availableTimings: SlotTiming[];
  bookedTimings: SlotTiming[];
  locationList: LocationList[];

  constructor()
      { }
}
