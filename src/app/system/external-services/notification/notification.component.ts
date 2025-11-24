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

  // Country instances (one per service instance)
  countryInstances: any[] = [];
  dataSourceCountry = new MatTableDataSource<any>();
  displayedColumnsCountry: string[] = ['id', 'serviceName', 'providerName', 'actions'];

  // Global properties flattened to name/value rows
  globalProperties: any[] = [];
  dataSourceGlobal = new MatTableDataSource<any>();
  displayedColumnsGlobalNameValue: string[] = ['name', 'value', 'actions'];

  countryOptions: any[] = [];
  countryId: number | null = null;

  @ViewChild('countrySort', { static: true }) countrySort: MatSort;
  @ViewChild('globalSort', { static: true }) globalSort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private externalServiceConfigurationService: ExternalServiceConfigurationService,
    private settingsService: SettingsService,
    private alertService: AlertService
  ) {
    this.route.data.subscribe((data: { notificationConfiguration: any }) => {
      const raw = data.notificationConfiguration?.notificationConfiguration ?? data.notificationConfiguration;
      if (raw) {
        const grouped = this.groupByInstance(raw);
        this.globalProperties = this.flattenGlobalFromInstances(grouped.filter(i => !i.country));
        this.setGlobalTable();
      }
    });
  }

  ngOnInit() {
    this.externalServiceConfigurationService.getExternalServiceTemplate(null).subscribe({
      next: (data) => {
        this.countryOptions = data.countryOptions || [];
        this.countryId = this.settingsService.getSelectedCountry()?.id ?? null;

        this.loadGlobalInstances();
        if (this.countryId) this.loadCountryInstances(this.countryId);
      },
      error: err => console.error(err)
    });
  }

  private groupByInstance(rawList: any[]): any[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => ({
      id: item.id,
      serviceName: item.serviceName,
      country: item.country ?? null,
      providerName: this.getPropValue(item.propertiesData, 'providerName'),
      priority: this.getPropValue(item.propertiesData, 'priority'),
      properties: item.propertiesData ?? []
    }));
  }

  private getPropValue(props: any[] = [], key: string) {
    if (!Array.isArray(props)) return null;
    const p = props.find(x => x.name === key);
    return p ? p.value : null;
  }

  loadCountryInstances(countryId: number) {
    this.dataSourceCountry = new MatTableDataSource();
    this.countryInstances = [];

    this.systemService
      .searchExternalConfiguration(ExternalServiceConfigurationService.NOTIFICATION_SERVICE_NAME, countryId, null)
      .subscribe({
        next: (data: any) => {
          const raw = data.notificationConfiguration ?? data;
          this.countryInstances = this.groupByInstance(raw);
          this.setCountryTable();
        },
        error: err => {
          console.error('Error loading country instances', err);
          this.setCountryTable();
        }
      });
  }

  loadGlobalInstances() {
    this.dataSourceGlobal = new MatTableDataSource();
    this.globalProperties = [];

    this.systemService
      .searchExternalConfiguration(ExternalServiceConfigurationService.NOTIFICATION_SERVICE_NAME, null, null)
      .subscribe({
        next: (data: any) => {
          const raw = data.notificationConfiguration ?? data;
          const instances = this.groupByInstance(raw).filter(i => !i.country);
          this.globalProperties = this.flattenGlobalFromInstances(instances);
          this.setGlobalTable();
        },
        error: err => {
          console.error('Error loading global instances', err);
          this.setGlobalTable();
        }
      });
  }

  private flattenGlobalFromInstances(instances: any[]): any[] {
    const props: any[] = [];
    instances.forEach(inst => {
      (inst.properties || []).forEach((p: any) => {
        props.push({
          name: p.name,
          value: p.value,
          serviceId: inst.id,
          fullService: inst
        });
      });
    });
    return props;
  }

  onCountryChange(event: any) {
    const countryId = event?.value ?? event;
    if (countryId == null) return;
    this.countryId = countryId;
    this.loadCountryInstances(countryId);
  }

  private setCountryTable() {
    this.dataSourceCountry = new MatTableDataSource(this.countryInstances || []);
    if (this.countrySort) this.dataSourceCountry.sort = this.countrySort;
  }

  private setGlobalTable() {
    this.dataSourceGlobal = new MatTableDataSource(this.globalProperties || []);
    if (this.globalSort) this.dataSourceGlobal.sort = this.globalSort;
  }

  navigateToEditService(serviceInstance: any) {
    this.router.navigate(['edit'], { relativeTo: this.route, state: { countryExternalService: serviceInstance } });
  }

  navigateToAdd() {
    if (!this.countryId) {
      this.alertService.alert({ type: 'error', message: 'Please select a country first.' });
      return;
    }

    this.router.navigate(['add'], { relativeTo: this.route, state: { countryId: this.countryId } });
  }
}
