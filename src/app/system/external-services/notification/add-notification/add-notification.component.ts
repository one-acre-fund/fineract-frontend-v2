import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalServiceConfigurationService } from '../../external-services.service';

@Component({
  selector: 'mifosx-add-notification-service',
  templateUrl: './add-notification.component.html',
})
export class AddNotificationComponent implements OnInit {

  addNotificationForm: UntypedFormGroup;
  countryOptions: any[] = [];
  officeOptions: any[] = [];
  countryId: number;

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private externalServiceConfigService: ExternalServiceConfigurationService
  ) {
    const nav = this.router.getCurrentNavigation()?.extras?.state;
    this.countryId = nav?.countryId || null;

    if (this.countryId) {
      this.externalServiceConfigService
        .getExternalServiceTemplate(this.countryId)
        .subscribe(data => {
          this.countryOptions = data.countryOptions;
          this.officeOptions = data.officeOptions;
        });
    }
  }

  ngOnInit() {
    this.initializeForm();
    this.handleCountryChanges();
  }

  /**
   * Build the form with STATIC keys (per backend payload)
   */
  initializeForm() {
    this.addNotificationForm = this.fb.group({
      country_id: [this.countryId, Validators.required],
      office_id: [null, Validators.required],
      baseUrl: ['', Validators.required],
      smsEndpoint: ['', Validators.required],
      generalApiKey: ['', Validators.required],
      senderApiKey: ['', Validators.required],
      smsSender: ['', Validators.required],
      otpSmsTemplate: [''],
      locale: ['en-US', Validators.required],
      providerName: ['AwsSns', Validators.required],
      priority: ['medium'],
      smsTemplate: ['']
    });
  }

  /**
   * When user selects another country - update office list
   */
  handleCountryChanges() {
    this.addNotificationForm.get('country_id')?.valueChanges.subscribe(countryId => {
      if (!countryId) return;

      this.officeOptions = [];
      this.addNotificationForm.patchValue({ office_id: null });

      this.externalServiceConfigService
        .getExternalServiceTemplate(countryId)
        .subscribe(data => {
          this.officeOptions = data.officeOptions;
        });
    });
  }

  /**
   * Submit payload in the format the backend expects (add a new property whenever required)
   */
  submit() {
    const form = this.addNotificationForm.value;

    const payload = {
      serviceName: 'NOTIFICATION',
      countryId: form.country_id,
      values: [
        {
          officeId: form.office_id,
          properties: {
            baseUrl: form.baseUrl,
            smsEndpoint: form.smsEndpoint,
            generalApiKey: form.generalApiKey,
            senderApiKey: form.senderApiKey,
            smsSender: form.smsSender,
            otpSmsTemplate: form.otpSmsTemplate,
            locale: form.locale,
            providerName: form.providerName,
            priority: form.priority,
            smsTemplate: form.smsTemplate,
            authentication_type: "apiKey",
            password: "xxxxx"
          }
        }
      ]
    };
    // Investigate the backend why some keys are required (authentication_type, password)

    this.externalServiceConfigService
      .addExternalServiceConfiguration(payload)
      .subscribe({
        next: () => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: err => console.error('Error adding notification service:', err)
      });
  }
}
