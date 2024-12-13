import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SystemService } from 'app/system/system.service';

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

  constructor(private route: ActivatedRoute, private systemService: SystemService) {
    this.route.data.subscribe((data: { paymentProviderConfiguration: any }) => {
      this.paymentProviderConfigurationData = data.paymentProviderConfiguration;
      console.log('Inside PaymentProviderComponent. ', this.paymentProviderConfigurationData);
      this.countryOptions = this.paymentProviderConfigurationData;
    });
  }

  ngOnInit(): void {}

  onCountryChange(event: any) {
    this.setCountryPaymentProviders(event.id);
    this.systemService.searchExternalConfiguration(this.serviceName, event.id, null).subscribe({
      next: (data: any) => {
        console.log('Payment Provider Configuration Data: ', data);
        this.dataSource.data = data;
      },
    });
  }

  /**
   * Initializes the data source and sorter for payment provider table.
   */
  setCountryPaymentProviders(countryId: number) {
    console.log('Calling payment provider for Country: ', countryId);
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
  }
}
