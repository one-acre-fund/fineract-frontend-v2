import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';

@Component({
  selector: 'mifosx-edit-payment-provider',
  templateUrl: './edit-payment-provider.component.html',
  styleUrls: ['./edit-payment-provider.component.scss'],
})
export class EditPaymentProviderComponent implements OnInit {
  /** Payment Provider data */
  paymentProviderData: any;
  /** Payment Provider Form */
  addPaymentProviderForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private systemService: SystemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.data.subscribe((data: { smsConfiguration: any }) => {
      this.paymentProviderData = data.smsConfiguration;
    });
  }

  ngOnInit() {
    this.setPaymentProviderForm();
  }

  /**
   * Creates Payment Provider form.
   */
  setPaymentProviderForm() {
    this.addPaymentProviderForm = this.formBuilder.group({
      host_name: [this.paymentProviderData[0].value, Validators.required],
      port_number: [this.paymentProviderData[1].value, Validators.required],
      end_point: [this.paymentProviderData[2].value, Validators.required],
      tenant_app_key: [this.paymentProviderData[3].value, Validators.required],
    });
  }

  /**
   * Submits the Payment provider configuration and updates the Payment provider configuration,
   * if successful redirects to view Payment provider page.
   */
  submit() {
    this.systemService
      .updateExternalConfiguration('PAYMENT_PROVIDER', this.addPaymentProviderForm.value)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
