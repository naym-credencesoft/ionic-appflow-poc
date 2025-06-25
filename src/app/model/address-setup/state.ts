import { Country } from './country';
import { City } from './city';


export class State{

  id : number;

  description : string;
  iconUrl : string;
  imageUrl : string;
  name : string;
  cities : City[];
  code : string;
  country : Country;

  constructor()
  { }
}
