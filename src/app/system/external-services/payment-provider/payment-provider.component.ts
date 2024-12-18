import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';
import { ExternalServiceConfigurationService } from '../external-services.service';
import { SettingsService } from 'app/settings/settings.service';
import { GetExternalServiceModel } from '../external-service.model';

@Component({
  selector: 'mifosx-payment-provider',
  templateUrl: './payment-provider.component.html',
  styleUrls: ['./payment-provider.component.scss'],
})
export class PaymentProviderComponent implements OnInit {
  /** Payment provider configuration data. */
  paymentProviderData: GetExternalServiceModel[];
  /** Columns to be displayed in Payment provider configuration table. */
  displayedColumns: string[] = ['providerName', 'office', 'businessId', 'subEntityCode', 'actions'];
  /** Data source for Payment provider configuration table. */
  dataSource: MatTableDataSource<any>;

  countryOptions: any = [];
  countryId: any;

  /** Sorter for Payment provider configuration table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private externalServiceConfigurationService: ExternalServiceConfigurationService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.externalServiceConfigurationService.getExternalServiceTemplate(null).subscribe({
      next: (data) => {
        this.countryOptions = data.countryOptions;
        this.countryId = this.settingsService.getSelectedCountry()?.id;
        if (this.countryId) {
          this.setCountryPaymentProviders(this.countryId);
        }
      },
    });
  }

  onCountryChange(event: any) {
    this.setCountryPaymentProviders(event.id);
  }

  /**
   * Initializes the data source and sorter for payment provider table.
   */
  setCountryPaymentProviders(countryId: number) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.systemService.searchExternalConfiguration(ExternalServiceConfigurationService.PAYMENT_PROVIDER_SERVICE_NAME, countryId, null).subscribe({
      next: (data: any) => {
        this.paymentProviderData = data;
        data.forEach((element: GetExternalServiceModel) => {
          this.dataSource.data.push({
            id: element.id,
            office: element.office,
            serviceName: element.serviceName,
            providerName: element.propertiesData.filter((property) => property.name === 'provider_name')[0].value,
            businessId: element.propertiesData.filter((property) => property.name === 'business_id')[0].value,
            subEntityCode: element.propertiesData.filter((property) => property.name === 'sub_entity_code')[0].value,
          });
        });
        this.dataSource.sort = this.sort;
      },
    });
  }

  navigateToAdd() {
    if (this.countryId) {
      this.router.navigate([`add`], { relativeTo: this.route, state: { countryId: this.countryId } });
    }
  }

  /**
   * Edit country external service.
   */
  navigateToEditExternalService(countryExternalService: any) {
    console.log('countryExternalServiceId', countryExternalService);
    const selectedCountryExternalService = this.paymentProviderData.find((data) => data.id === countryExternalService.id);
    this.router.navigate([`edit`], { relativeTo: this.route, state: { countryExternalService: selectedCountryExternalService } });

    //Track Matomo event for undoing client charge
    // this.matomoTracker.trackEvent('clients', 'undoCharges', transactionId);
  }
}
