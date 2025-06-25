import { SlotTiming } from "./SlotTiming";
import { LocationModel } from './location';
import { Resource } from './resource';

export class SlotDate {

  id: number;
  date : string;
  slotTimingDtos : SlotTiming[];
  location: LocationModel;
  resource: Resource;

  constructor()
      { }
}
