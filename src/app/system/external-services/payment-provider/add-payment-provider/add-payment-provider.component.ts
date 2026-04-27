import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalServiceConfigurationService } from '../../external-services.service';
import {
  AddExternalServiceModel,
  AddPaymentProviderPropertyModel,
  APIKEY,
  hasRequiredValidator
} from '../../external-service.model';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-add-payment-provider',
  templateUrl: './add-payment-provider.component.html',
  styleUrls: ['./add-payment-provider.component.scss'],
})
export class AddPaymentProviderComponent implements OnInit {
  /** Payment Provider Form */
  countryId: any;
  addPaymentProviderForm: UntypedFormGroup;

  officeOptions: any = [];
  countryOptions: any = [];
  authenticationTypeOptions = ExternalServiceConfigurationService.AUTHENTICATION_TYPE;
  /** Date formats. */
  dateFormats: string[] =  SettingsService.dateFormats;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private externalServiceConfigurationService: ExternalServiceConfigurationService,
    private matomoTracker: MatomoTracker
  ) {
    //set Matomo page info
    let title = document.title;
    this.matomoTracker.setDocumentTitle(`${title}`);
    this.countryId = this.router.getCurrentNavigation()?.extras?.state?.countryId || null;
    this.externalServiceConfigurationService.getExternalServiceTemplate(this.countryId).subscribe({
      next: (data) => {
        this.countryOptions = data.countryOptions;
        this.officeOptions = data.officeOptions;
      },
    });
  }

  ngOnInit() {
    this.setPaymentProviderForm();
  }

  onCountryChange() {
    this.externalServiceConfigurationService
      .getExternalServiceTemplate(this.addPaymentProviderForm.value.country_id)
      .subscribe({
        next: (data) => {
          this.officeOptions = data.officeOptions;
        },
      });
  }
  /**
   * Creates Payment Provider form.
   */
  setPaymentProviderForm() {
    this.addPaymentProviderForm = this.formBuilder.group({
      provider_name: [null, Validators.required],
      country_id: [this.countryId, Validators.required],
      office_id: [null],
      bank_code: [null],
      base_url: [null, Validators.required],
      account_creation_endpoint: [null, Validators.required],
      authentication_endpoint: [null],
      authentication_type: [null, Validators.required],
      business_id: [null, Validators.required],
      sub_entity_code: [null],
      paymentProviderDateFormat: [null, Validators.required],
      username: [null],
      password: [null, Validators.required]
    });

    this.handleAuthTypeChanges();
 }
  /**
   * Handles changes in authentication type and updates validators accordingly.
   */
  handleAuthTypeChanges() {
    this.addPaymentProviderForm.get('authentication_type')?.valueChanges.subscribe(authType => {
      const endpointControl = this.addPaymentProviderForm.get('authentication_endpoint');
      const usernameControl = this.addPaymentProviderForm.get('username');
      const passwordControl = this.addPaymentProviderForm.get('password');

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
    });
  }

  /**
   * Helper to check if a control has the required validator
   */
  hasRequiredValidator(controlName: string): boolean {
    return hasRequiredValidator(this.addPaymentProviderForm, controlName);
  }

  /**
   * Submits the Payment provider configuration and updates the Payment provider configuration,
   * if successful redirects to view Payment provider page.
   */
  submit() {
    const paymentProviderData: AddExternalServiceModel = new AddExternalServiceModel();
    paymentProviderData.serviceName = ExternalServiceConfigurationService.PAYMENT_PROVIDER_SERVICE_NAME;
    paymentProviderData.countryId = this.addPaymentProviderForm.value.country_id;
    const formValue = this.addPaymentProviderForm.value;
    const properties: AddPaymentProviderPropertyModel = {} as AddPaymentProviderPropertyModel;
    Object.keys(formValue).forEach(key => {
      if (formValue[key] != null) {
        properties[key] = formValue[key];
      }
    });
    paymentProviderData.values = [
      {
        officeId: this.addPaymentProviderForm.value.office_id,
        properties: properties,
      },
    ];
    this.matomoTracker.trackEvent('externalService', 'addPaymentProvider');
    this.externalServiceConfigurationService.addExternalServiceConfiguration(paymentProviderData).subscribe({
      next: (response) => {
        this.matomoTracker.trackEvent('externalService', 'addPaymentProviderSuccess', response.resourceId);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (error: any) => {
        console.log('Error while adding the payment provider: ', error);
      },
    });

  }
}
