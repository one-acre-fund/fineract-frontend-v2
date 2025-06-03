import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'app/system/system.service';
import { ExternalServiceConfigurationService } from '../external-services.service';
import { GetExternalServiceModel } from '../external-service.model';

@Component({
  selector: 'mifosx-order-integration',
  templateUrl: './order-integration.component.html',
  styleUrls: ['./order-integration.component.scss'],
})
export class OrderIntegrationComponent implements OnInit {
  /** Order Integration configuration data. */
  orderIntegrationConfigurationData: any;
  /** Columns to be displayed in Order Integration configuration table. */
  displayedColumns: string[] = ['name', 'value'];
  /** Data source for Order Integration configuration table. */
  dataSource: MatTableDataSource<any>;

  /** Sorter for Order Integration configuration table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private systemService: SystemService) {}

  ngOnInit() {
    this.setOrderIntegrationConfiguration();
  }

  /**
   * Initializes the data source and sorter for Order Integration configuration table.
   */
  setOrderIntegrationConfiguration() {
    this.dataSource = new MatTableDataSource();
    this.systemService
      .searchExternalConfiguration(ExternalServiceConfigurationService.ORDER_INTEGRATION_SERVICE, null, null)
      .subscribe({
        next: (data: any) => {
          this.orderIntegrationConfigurationData = data;
          this.orderIntegrationConfigurationData.forEach((element: GetExternalServiceModel) => {
            element.propertiesData.forEach((property: any) => {
              this.dataSource.data.push(property);
            });
          });
          this.dataSource.sort = this.sort;
        },
        error: (error: any) => {
          console.error('Error retrieving order integration configuration:', error);
        },
      });
  }

  /**
   * Edit country external service.
   */
  navigateToEditExternalService() {
    if (!this.orderIntegrationConfigurationData || this.orderIntegrationConfigurationData.length === 0) {
      console.error('No order integration configuration found to edit');
      return;
    }
    this.router.navigate([`edit`], {
      relativeTo: this.route,
      state: { countryExternalService: this.orderIntegrationConfigurationData[0] },
    });
  }
}
