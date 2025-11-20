/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** Custom Services */
import { SystemService } from 'app/system/system.service';

/**
 * Edit Notification Configuration Component.
 */
@Component({
  selector: 'mifosx-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrls: ['./edit-notification.component.scss']
})
export class EditNotificationComponent implements OnInit {

  /** Notification Configuration data */
  notificationConfigurationData: any;
  /** Notification Configuration Form */
  notificationConfigurationForm: UntypedFormGroup;
  countryExternalService: any;

  /**
   * Retrieves the Notification configuration data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {SystemService} systemService Accounting Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   */
  constructor(private formBuilder: UntypedFormBuilder,
    private systemService: SystemService,
    private route: ActivatedRoute,
    private router: Router) {
    this.countryExternalService = this.router.getCurrentNavigation()?.extras?.state?.countryExternalService;
    if (!this.countryExternalService) {
      console.error("No config provided to edit page");
    }
  }

  /**
   * Creates Notification configuration form.
   */
  ngOnInit() {
    this.setNotificationConfigurationForm();
  }

  private findValue(name: string) {
    const props = this.countryExternalService?.properties || this.countryExternalService?.propertiesData || [];
    const p = props.find((x: any) => x.name === name);
    return p ? p.value : null;
  }

  /**
   * Creates Notification configuration form.
   */
  setNotificationConfigurationForm() {
    this.notificationConfigurationForm = this.formBuilder.group({
      baseUrl: [this.findValue('baseUrl') || '', Validators.required],
      smsEndpoint: [this.findValue('smsEndpoint') || '', Validators.required],
      generalApiKey: [this.findValue('generalApiKey') || '', Validators.required],
      senderApiKey: [this.findValue('senderApiKey') || '', Validators.required],
      smsSender: [this.findValue('smsSender') || '', Validators.required],
      otpSmsTemplate: [this.findValue('otpSmsTemplate') || '', Validators.required],
      locale: [this.findValue('locale') || 'en-US', Validators.required],
      providerName: [this.findValue('providerName') || 'AwsSns', Validators.required],
      priority: [this.findValue('priority') || '', Validators.required],
      smsTemplate: [this.findValue('smsTemplate') || '', Validators.required],
      countryExternalServiceId: [this.countryExternalService?.id || null, Validators.required],
    });
  }

  /**
   * Submits the Notification configuration and updates the Notification configuration,
   * if successful redirects to view Notification configuration.
   */
  submit() {
    const formValue = { ...this.notificationConfigurationForm.value };
    formValue.countryExternalServiceId = this.countryExternalService.id;

    this.systemService
      .updateExternalConfiguration('NOTIFICATION', formValue)
      .subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

}
