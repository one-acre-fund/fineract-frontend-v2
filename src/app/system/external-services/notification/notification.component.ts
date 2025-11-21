import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SystemService } from 'app/system/system.service';
import { ExternalServiceConfigurationService } from '../external-services.service';
import { SettingsService } from 'app/settings/settings.service';
import { AlertService } from 'app/core/alert/alert.service';

@Component({
  selector: 'mifosx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  /** Notification configuration data. */
  notificationConfigurationData: any[] = [];
  /** Columns to be displayed in Notification configuration table. */
  displayedColumns: string[] = ['id', 'providerName', 'priority', 'actions'];
  /** Data source for Notification configuration table. */
  dataSource: MatTableDataSource<any>;

  countryOptions: any[] = [];
  countryId: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private externalServiceConfigurationService: ExternalServiceConfigurationService,
    private settingsService: SettingsService,
    private alertService: AlertService,

  ) {
    // If route resolver provided initial data, group it
    this.route.data.subscribe((data: { notificationConfiguration: any }) => {
      const raw = data.notificationConfiguration?.notificationConfiguration ?? data.notificationConfiguration;
      if (raw) {
        this.notificationConfigurationData = this.groupByInstance(raw);
      }
    });
  }

  ngOnInit() {
    this.externalServiceConfigurationService.getExternalServiceTemplate(null).subscribe({
      next: (data) => {
        this.countryOptions = data.countryOptions || [];
        this.countryId = this.settingsService.getSelectedCountry()?.id || null;
        if (this.countryId) {
          this.setCountryNotificationConfig(this.countryId);
        } else {
          this.setNotificationConfiguration();
        }
      }
    });
  }

  // Convert API response (list of instances with propertiesData) into grouped array of instances
  private groupByInstance(rawList: any[]): any[] {
    return rawList.map(item => ({
      id: item.id,
      serviceName: item.serviceName,
      country: item.country,
      providerName: this.getPropValue(item.propertiesData, 'providerName'),
      priority: this.getPropValue(item.propertiesData, 'priority'),
      properties: item.propertiesData || []
    }));
  }

  private getPropValue(props: any[] = [], key: string) {
    const p = props.find(x => x.name === key);
    return p ? p.value : null;
  }

  setCountryNotificationConfig(countryId: number) {
    this.dataSource = new MatTableDataSource(); // clear while loading
    this.notificationConfigurationData = [];
    this.systemService
      .searchExternalConfiguration(ExternalServiceConfigurationService.NOTIFICATION_SERVICE_NAME, countryId, null)
      .subscribe({
        next: (data: any) => {
          const raw = data.notificationConfiguration ?? data;
          this.notificationConfigurationData = this.groupByInstance(raw);
          this.setNotificationConfiguration();
        },
        error: err => {
          console.error('Error fetching notification configs:', err);
          this.setNotificationConfiguration();
        }
      });
  }

  onCountryChange(event: any) {
    if (event && event.value != null) {
      this.setCountryNotificationConfig(event.value);
    }
  }

  setNotificationConfiguration() {
    this.dataSource = new MatTableDataSource(this.notificationConfigurationData || []);
    if (this.sort) { this.dataSource.sort = this.sort; }
  }

  navigateToEditExternalService(serviceInstance: any) {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      state: { countryExternalService: serviceInstance }
    });
  }

  navigateToAdd() {
    if (!this.countryId) {
      this.alertService.alert({
        type: 'error',
        message: 'Failed to find a valid country: ',
      });
      return;
    }

    this.router.navigate(['add'], { relativeTo: this.route, state: { countryId: this.countryId } });
  }
}
