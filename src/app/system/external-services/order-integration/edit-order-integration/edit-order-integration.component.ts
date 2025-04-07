import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';
import { GetExternalServiceModel } from '../../external-service.model';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { ExternalServiceConfigurationService } from '../../external-services.service';

@Component({
  selector: 'mifosx-edit-order-integration',
  templateUrl: './edit-order-integration.component.html',
  styleUrls: ['./edit-order-integration.component.scss'],
})
export class EditOrderIntegrationComponent implements OnInit {
  /** Order Integration Configuration data */
  orderIntegrationConfigurationData: any;
  /** Order Integration Configuration Form */
  orderIntegrationConfigurationForm: UntypedFormGroup;

  countryExternalService: GetExternalServiceModel;
  authenticationTypeOptions = ExternalServiceConfigurationService.AUTHENTICATION_TYPE;

  /**
   * Retrieves the Order Integration configuration data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {SystemService} systemService Accounting Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   */
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
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.countryExternalService = navigation.extras.state.countryExternalService;
    } else {
      console.error('Navigation state missing required data');
    }
  }

  /**
   * Creates Order Integration configuration form.
   */
  ngOnInit() {
    this.setOrderIntegrationConfigurationForm();
  }

  /**
   * Creates Order Integration configuration form.
   */
  setOrderIntegrationConfigurationForm() {
    this.orderIntegrationConfigurationForm = this.formBuilder.group({
      base_url: [
        this.externalServiceConfigurationService.getExternalServicePropertyByName(
          this.countryExternalService,
          'base_url'
        ),
        Validators.required,
      ],
      get_order_endpoint: [
        this.externalServiceConfigurationService.getExternalServicePropertyByName(
          this.countryExternalService,
          'get_order_endpoint'
        ),
        Validators.required,
      ],
      authentication_type: [
        this.externalServiceConfigurationService.getExternalServicePropertyByName(
          this.countryExternalService,
          'authentication_type'
        ),
        Validators.required,
      ],
      authentication_endpoint: [
        this.externalServiceConfigurationService.getExternalServicePropertyByName(
          this.countryExternalService,
          'authentication_endpoint'
        ),
        Validators.required,
      ],
      username: [
        this.externalServiceConfigurationService.getExternalServicePropertyByName(
          this.countryExternalService,
          'username'
        ),
        Validators.required,
      ],
      password: [
        this.externalServiceConfigurationService.getExternalServicePropertyByName(
          this.countryExternalService,
          'password'
        ),
        Validators.required,
      ],
    });
  }

  /**
   * Submits the Order Integration configuration and updates the Order Integration configuration,
   * if successful redirects to view Order Integration configuration.
   */
  submit() {
    this.matomoTracker.trackEvent('externalService', 'editOrderIntegration');

    this.systemService
      .updateExternalConfiguration(
        ExternalServiceConfigurationService.ORDER_INTEGRATION_SERVICE,
        this.orderIntegrationConfigurationForm.value
      )
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error: any) => {
          console.error('Error updating order integration configuration:', error);
        },
      });
  }
}
