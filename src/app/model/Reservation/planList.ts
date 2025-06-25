
export interface PlanListDTO {
  value: string;
  viewValue: string;
}

export class PlanList {


  planList: PlanListDTO[] = [
    { value: 'Business Starter', viewValue: 'Business Starter' },
    { value: 'Business Essentials', viewValue: 'Business Essentials' },
    { value: 'Business Premium', viewValue: 'Business Premium'},
  ];

  constructor()
      { }
}
