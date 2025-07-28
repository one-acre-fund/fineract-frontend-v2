import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';
import {APIKEY, GetExternalServiceModel, hasRequiredValidator} from '../../external-service.model';
import { ExternalServiceConfigurationService } from '../../external-services.service';
import { MatomoTracker } from '@ngx-matomo/tracker';

@Component({
  selector: 'mifosx-edit-payment-provider',
  templateUrl: './edit-payment-provider.component.html',
  styleUrls: ['./edit-payment-provider.component.scss'],
})
export class EditPaymentProviderComponent implements OnInit {
  countryExternalService: GetExternalServiceModel;
  /** Payment Provider Form */
  editPaymentProviderForm: UntypedFormGroup;

  officeOptions: any = [];
  countryOptions: any = [];
  authenticationTypeOptions = ExternalServiceConfigurationService.AUTHENTICATION_TYPE;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private systemService: SystemService,
    private externalServiceConfigurationService: ExternalServiceConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private matomoTracker: MatomoTracker
  ) {
    let title = document.title;
    this.matomoTracker.setDocumentTitle(`${title}`);
    this.countryExternalService = this.router.getCurrentNavigation().extras.state.countryExternalService;
  }

  ngOnInit() {
    this.setPaymentProviderForm();
  }

  /**
   * Creates Payment Provider form.
   */
  setPaymentProviderForm() {
    console.debug('Inside edit payment provider form');
    const country = this.countryExternalService.country;
    const office = this.countryExternalService.office;
    this.countryOptions.push({ id: country?.id, name: country?.name });
    this.officeOptions.push({ id: office?.id, name: office?.name });

    const getProp = (name: string) =>
      this.externalServiceConfigurationService.getExternalServicePropertyByName(this.countryExternalService, name);

    this.editPaymentProviderForm = this.formBuilder.group({
      countryExternalServiceId: [this.countryExternalService.id],
      provider_name: [{ value: getProp('provider_name'), disabled: true }, Validators.required],
      country_id: [{ value: country?.id, disabled: true }, Validators.required],
      office_id: [{ value: office?.id, disabled: true }],
      base_url: [getProp('base_url'), Validators.required],
      account_creation_endpoint: [getProp('account_creation_endpoint'), Validators.required],
      bank_code: [getProp('bank_code'), Validators.required],
      authentication_endpoint: [getProp('authentication_endpoint')],
      authentication_type: [getProp('authentication_type'), Validators.required],
      business_id: [getProp('business_id'), Validators.required],
      sub_entity_code: [getProp('sub_entity_code')],
      username: [getProp('username')],
      password: [getProp('password')],
    });
    this.applyAuthTypeConditionalValidators();
  }

  /**
   * Applies conditional validators based on the authentication type selected.
   */
  private applyAuthTypeConditionalValidators(): void {
    const authTypeControl = this.editPaymentProviderForm.get('authentication_type');
    const endpointControl = this.editPaymentProviderForm.get('authentication_endpoint');
    const usernameControl = this.editPaymentProviderForm.get('username');
    const passwordControl = this.editPaymentProviderForm.get('password');

    const updateValidators = (authType: string) => {
      if (authType?.toLowerCase() === APIKEY) {
        endpointControl?.clearValidators();
        usernameControl?.clearValidators();
        endpointControl?.updateValueAndValidity();
        usernameControl?.updateValueAndValidity();
      } else {
        endpointControl?.setValidators([Validators.required]);
        usernameControl?.setValidators([Validators.required]);
        endpointControl?.updateValueAndValidity();
        usernameControl?.updateValueAndValidity();
      }
      // Password is always required
      passwordControl?.setValidators([Validators.required]);
      passwordControl?.updateValueAndValidity();
    };
    updateValidators(authTypeControl?.value);
    authTypeControl?.valueChanges.subscribe(updateValidators);
  }

  /**
   * Helper to check if a control has the required validator
   */
  hasRequiredValidator(controlName: string): boolean {
    return hasRequiredValidator(this.editPaymentProviderForm, controlName);
  }

  /**
   * Submits the Payment provider configuration and updates the Payment provider configuration,
   * if successful redirects to view Payment provider page.
   */
  submit() {
    this.matomoTracker.trackEvent('externalService', 'addPaymentProvider');
    this.systemService
      .updateExternalConfiguration(
        ExternalServiceConfigurationService.PAYMENT_PROVIDER_SERVICE_NAME,
        this.editPaymentProviderForm.value
      )
      .subscribe((response: any) => {
        this.matomoTracker.trackEvent('externalService', 'addPaymentProviderSuccess', response.resourceId);
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }


}
