import { Country } from './country';
import { Suburb } from './suburbDto';
import { State } from './state';


export class City {

  id : number;
  name : string;
  code : string;
  description : string;
  iconUrl : string;
  imageUrl : string;
  latitude : string;
  longitude : string;

  stateId : number;
  stateDto: State;

  suburbs : Suburb[];
  countryName : string;
  stateOrRegionName : string;
  countryDto : Country;
  constructor()
  { }
}
