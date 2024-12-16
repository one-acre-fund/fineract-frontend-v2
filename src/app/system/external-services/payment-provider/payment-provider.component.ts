import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';
import { ExternalServiceConfigurationService } from '../external-services.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-payment-provider',
  templateUrl: './payment-provider.component.html',
  styleUrls: ['./payment-provider.component.scss'],
})
export class PaymentProviderComponent implements OnInit {
  /** Payment provider configuration data. */
  paymentProviderConfigurationData: any;
  /** Columns to be displayed in Payment provider configuration table. */
  displayedColumns: string[] = ['name', 'value'];
  /** Data source for Payment provider configuration table. */
  dataSource: MatTableDataSource<any>;

  countryOptions: any = [];
  countryId: any;
  private readonly serviceName: string = 'PAYMENT_PROVIDER';

  /** Sorter for Payment provider configuration table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private externalServiceConfigurationService: ExternalServiceConfigurationService,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    this.externalServiceConfigurationService.getExternalServiceTemplate(null).subscribe({
      next: (data) => {
        this.countryOptions = data.countryOptions;
        this.countryId = this.settingsService.getSelectedCountry()?.id;
      },
    });
  }

  onCountryChange(event: any) {
    this.setCountryPaymentProviders(event.id);
    this.systemService.searchExternalConfiguration(this.serviceName, event.id, null).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
      },
    });
  }

  /**
   * Initializes the data source and sorter for payment provider table.
   */
  setCountryPaymentProviders(countryId: number) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
  }

  navigateToAdd(){
    if(this.countryId){
      this.router.navigate([`add`], { relativeTo: this.route, state: { countryId: this.countryId } });
    }
  }
}
