import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';
import { GetExternalServiceModel } from '../../external-service.model';
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
  authenticationTypeOptions = [
    { id: 'Basic', name: 'Basic Authentication' },
    { id: 'Bearer', name: 'Bearer Authentication' },
    { id: 'ApiKey', name: 'API Key Authentication' },
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private systemService: SystemService,
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
    console.log('Inside edit payment provider form');
    const country = this.countryExternalService.country;
    const office = this.countryExternalService.office;
    this.countryOptions.push({ id: country?.id, name: country?.name });
    this.officeOptions.push({ id: office?.id, name: office?.name });
    this.editPaymentProviderForm = this.formBuilder.group({
      countryExternalServiceId: [this.countryExternalService.id],
      provider_name: [{ value: this.getExternalServiceProperty('provider_name'), disabled: true }, Validators.required],
      country_id: [{ value: country?.id, disabled: true }, Validators.required],
      office_id: [{ value: office?.id, disabled: true }],
      base_url: [this.getExternalServiceProperty('base_url'), Validators.required],
      account_creation_endpoint: [this.getExternalServiceProperty('account_creation_endpoint'), Validators.required],
      bank_code: [this.getExternalServiceProperty('bank_code'), Validators.required],
      authentication_endpoint: [this.getExternalServiceProperty('authentication_endpoint'), Validators.required],
      authentication_type: [this.getExternalServiceProperty('authentication_type'), Validators.required],
      business_id: [this.getExternalServiceProperty('business_id'), Validators.required],
      sub_entity_code: [this.getExternalServiceProperty('sub_entity_code'), Validators.required],
      username: [this.getExternalServiceProperty('username'), Validators.required],
      password: [this.getExternalServiceProperty('password'), Validators.required],
    });
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

  getExternalServiceProperty(name: string) {
    return this.countryExternalService.propertiesData.filter((property) => property.name === name)[0]?.value;
  }
}
