import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';
import { ExternalServiceConfigurationService } from '../../external-services.service';

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
  ]

  constructor(
    private formBuilder: UntypedFormBuilder,
    private systemService: SystemService,
    private route: ActivatedRoute,
    private router: Router, 
    private externalServiceConfigurationService: ExternalServiceConfigurationService
  ) {
    this.countryId = this.router.getCurrentNavigation().extras.state.countryId  || null;
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

  onCountryChange(event: any) {
    this.externalServiceConfigurationService.getExternalServiceTemplate(event.id).subscribe({
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
      base_url: ['', Validators.required],
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
    this.systemService.updateExternalConfiguration('PAYMENT_PROVIDER', this.addPaymentProviderForm.value).subscribe({
      next: () => this.router.navigate(['../'], { relativeTo: this.route }),
      error: (error: any) => {
        console.log('Error: ', error);
      },
    });
  }
}
