
export interface ExternalBookingSites {
  id : number;
  value: string;
  viewValue: string;
}

export class ExternalSiteList {

  externalBookingSites: ExternalBookingSites[] = [
    { id : -1, value: "Fit Frequent Individual Traveller", viewValue: "Fit Frequent Individual Traveller" },
    { id : -2, value: "Walkin", viewValue: "Walk In" },
    // { value: "Corporate", viewValue: "Corporate" },
    // { value: "Agoda", viewValue: "Agoda" },
    // { value: "AirBnB", viewValue: "AirBnB" },
    // { value: "BookABach", viewValue: "BookABach" },
    // { value: "Booking.com", viewValue: "Booking.com" },
    // { value: "goibibo", viewValue: "goibibo" },
    // { value: "Expedia", viewValue: "Expedia" },
    // { value: "Google", viewValue: "Google" },
    // { value: "Homes&Away", viewValue: "Homes&Away" },
    // { value: "MakeMyTrip", viewValue: "MakeMyTrip" },
    // { value: "OYO", viewValue: "OYO" },
     { id:-3, value: "WebSite", viewValue: "WebSite" },
     //{ id :-3, value: "Bookone Local", viewValue: "Bookone Local" },
     { id :-4 , value: "The Hotel Mate", viewValue: "The Hotel Mate" },
    // { value: "Others", viewValue: "Others" },
  ];

}
