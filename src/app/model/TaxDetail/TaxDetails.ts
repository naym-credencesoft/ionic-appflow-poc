import { TaxSubList } from './TaxSubList';

export class TaxDetails {


  name : string;
  percentage : number;
  country : string;
  state : string;
  taxableAmount  : number;
  taxAmount:number;

  taxSlabsList : TaxSubList[];


  constructor() {
   }
}
