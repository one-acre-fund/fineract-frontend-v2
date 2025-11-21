/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, FormControl } from '@angular/forms';

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

  notificationConfigurationForm: UntypedFormGroup;
  countryExternalService: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private systemService: SystemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.countryExternalService =
      this.router.getCurrentNavigation()?.extras?.state?.countryExternalService;

    if (!this.countryExternalService) {
      console.error("No config provided to edit page");
    }
  }

  ngOnInit() {
    this.setDynamicForm();
  }

  /** Build form dynamically based on properties */
  setDynamicForm() {
    this.notificationConfigurationForm = this.formBuilder.group({});

    const props = this.countryExternalService?.properties || [];

    props.forEach((prop: any) => {
      const value = prop.value ?? '';
      this.notificationConfigurationForm.addControl(
        prop.name,
        new FormControl(value)
      );
    });

    this.notificationConfigurationForm.addControl(
      'countryExternalServiceId',
      new FormControl(this.countryExternalService.id)
    );
  }

  /** Submit updated properties */
  submit() {
    const formValue = { ...this.notificationConfigurationForm.value };
      formValue.countryExternalServiceId = this.countryExternalService.id;

    const isCountryConfig = !!this.countryExternalService.country;

    if (isCountryConfig) {
      const keysToRemove = [
        'authentication_type',
        'authentication_endpoint',
        'username',
        'password'
      ];

      keysToRemove.forEach(key => delete formValue[key]);
    }

    this.systemService
      .updateExternalConfiguration('NOTIFICATION', formValue)
      .subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

}
