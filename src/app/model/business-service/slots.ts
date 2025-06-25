import { LocationModel } from '../Reservation/location';
import { Resource } from '../Reservation/resource';
import { ResourceList } from './resourceList';

export class Slots {
  date: string;
  duration: number;
  available: boolean;
  count: number;
  day: string;
  beforeTax: number;
  tax: number;
  price: number;
  businessServiceId: number;
  businessServiceTypeId: number;
  resourceList: ResourceList[];

  location: LocationModel;
  resource: Resource;
  constructor() { }
}
