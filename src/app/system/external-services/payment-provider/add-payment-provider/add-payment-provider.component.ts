import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';

@Component({
  selector: 'mifosx-add-payment-provider',
  templateUrl: './add-payment-provider.component.html',
  styleUrls: ['./add-payment-provider.component.scss'],
})
export class AddPaymentProviderComponent implements OnInit {
  /** Payment Provider Form */
  addPaymentProviderForm: UntypedFormGroup;

  officeOptions: any = [];
  countryOptions: any = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private systemService: SystemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.data.subscribe((data: { paymentProviderOptions: any }) => {
      this.countryOptions = data?.paymentProviderOptions;
    });
  }

  ngOnInit() {
    this.setPaymentProviderForm();
  }

  onCountryChange(event: any) {
    
  }
  /**
   * Creates Payment Provider form.
   */
  setPaymentProviderForm() {
    this.addPaymentProviderForm = this.formBuilder.group({
      provider_name: ['', Validators.required],
      country_id: [null, Validators.required],
      office_id: [null, Validators.required],
      base_url: ['', Validators.required],
      authentication_endpoint: ['', Validators.required],
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
