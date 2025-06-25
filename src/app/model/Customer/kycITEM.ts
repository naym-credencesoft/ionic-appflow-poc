

export interface KYCItem {
  value: string;
  viewValue: string;
}

export class KYC_IdentityDocumentType
{
  kycList: KYCItem[] = [
    { value: 'Passport', viewValue: 'Passport' },
    { value: 'Driving_License', viewValue: 'Driving License' },
    { value: 'University_ID_Card', viewValue: 'University ID Card' },
    { value: 'Tax_ID', viewValue: 'Tax Id' },
    { value: 'Nationa_ID_Card', viewValue: 'National ID Card' },
    { value: 'OverSeas_Passport', viewValue: 'Overseas Passport' },
    { value: 'Overseas_Driving_License', viewValue: 'Overseas Driving License' },
    { value: 'OTHER', viewValue: 'Other Id' },
  ];

}
