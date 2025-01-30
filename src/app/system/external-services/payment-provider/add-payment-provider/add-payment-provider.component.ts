import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalServiceConfigurationService } from '../../external-services.service';
import { AddExternalServiceModel, AddPaymentProviderPropertyModel } from '../../external-service.model';
import { MatomoTracker } from '@ngx-matomo/tracker';

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
  authenticationTypeOptions = [
    { id: 'Basic', name: 'Basic Authentication' },
    { id: 'Bearer', name: 'Bearer Authentication' },
    { id: 'ApiKey', name: 'API Key Authentication' },
  ];

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
    this.countryId = this.router.getCurrentNavigation().extras.state.countryId || null;
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
      provider_name: ['', Validators.required],
      country_id: [this.countryId, Validators.required],
      office_id: [null],
      bank_code: ['', Validators.required],
      base_url: ['', Validators.required],
      account_creation_endpoint: ['', Validators.required],
      authentication_endpoint: ['', Validators.required],
      authentication_type: ['', Validators.required],
      business_id: ['', Validators.required],
      sub_entity_code: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Submits the Payment provider configuration and updates the Payment provider configuration,
   * if successful redirects to view Payment provider page.
   */
  submit() {
    const paymentProviderData: AddExternalServiceModel = new AddExternalServiceModel();
    paymentProviderData.serviceName = ExternalServiceConfigurationService.PAYMENT_PROVIDER_SERVICE_NAME;
    paymentProviderData.countryId = this.addPaymentProviderForm.value.country_id;
    const properties: AddPaymentProviderPropertyModel = this.addPaymentProviderForm.value;
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
