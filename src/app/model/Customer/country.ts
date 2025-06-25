
export interface CountryListInterFace {
  value: string;
  viewValue: string;
  countryCode: string;
}

export class CountryList {

  countries: CountryListInterFace[] = [
    { value: 'Austrilia', viewValue: 'Austrilia' , countryCode : '+61' },
    { value: 'Bangladesh', viewValue: 'Bangladesh', countryCode: '+88' },
    { value: 'Canada', viewValue: 'Canada', countryCode: '+1' },
    { value: 'France', viewValue: 'France', countryCode: '+33' },
    { value: 'Germany', viewValue: 'Germany', countryCode: '+49' },
    { value: 'India', viewValue: 'India' , countryCode: '+91' },
    { value: 'Italy', viewValue: 'Italy', countryCode: '+39' },
    { value: 'New Zealand', viewValue: 'New Zealand', countryCode: '+64' },
    { value: 'South Africa', viewValue: 'South Africa' , countryCode : '+27' },
    { value: 'Spain', viewValue: 'Spain', countryCode: '+34' },
    { value: 'Sri Lanka', viewValue: 'Sri Lanka', countryCode: '+94' },
    { value: 'Thailand', viewValue: 'Thailand', countryCode: '+66' },
    { value: 'United Arab Emirates', viewValue: 'United Arab Emirates', countryCode: '+971' },
    { value: 'United Kingdom', viewValue: 'United Kingdom', countryCode: '+44' },
    { value: 'United States', viewValue: 'United States', countryCode: '+1' },
  ];


  constructor() {
   }
}
