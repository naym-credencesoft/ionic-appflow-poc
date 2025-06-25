 import { Room } from '../model/room';
 import { Property } from './property/Property';

 export interface Token {
    token: string;
    userId: number;
    propertyId: number;
    rooms: Room[];
    property: Property;
    roles: string [];
  }
