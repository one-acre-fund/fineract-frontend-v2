import { CountryResponseModel, OfficeDataModel } from 'app/organization/offices/office.model';
import {AbstractControl, FormGroup} from '@angular/forms';

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

export const APIKEY = 'apikey';

export function hasRequiredValidator(form: FormGroup, controlName: string): boolean {
  const control = form.get(controlName);
  if (!control || !control.validator) return false;

  const validatorFn = control.validator;

  // Call the validator with a dummy control
  const result = validatorFn({} as AbstractControl);

  return !!(result && result['required']);
}

