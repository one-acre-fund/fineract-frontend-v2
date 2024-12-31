import { CountryResponseModel, OfficeDataModel } from 'app/organization/offices/office.model';

export class AddExternalServiceModel {
  serviceName: string;
  countryId: number;
  values: AddExternalServiceValueModel[];
}

export class AddExternalServiceValueModel {
  officeId: number;
  properties: any;
}

export class AddPaymentProviderPropertyModel {
  provider_name: string;
  base_url: string;
  account_creation_endpoint: string;
  bank_code: string;
  authentication_endpoint: string;
  authentication_type: string;
  business_id: string;
  sub_entity_code: string;
  username: string;
  password: string;
}

export class GetExternalServiceModel {
  id: number;
  serviceName: string;
  country: CountryResponseModel;
  office?: OfficeDataModel;
  propertiesData: GetExternalServicePropertyModel[];
}

export class GetExternalServicePropertyModel {
  name: string;
  value: string;
}
