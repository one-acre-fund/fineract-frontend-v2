/** Angular Imports. */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientsDataSource } from './clients.datasource';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Custom Services */
import { ClientsService } from './clients.service';
import { SearchService } from '../search/search.service';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit, AfterViewInit {
  @ViewChild('showClosedAccounts', { static: true }) showClosedAccounts: MatCheckbox;

  displayedColumns = ['name', 'clientno', 'externalid', 'status', 'office', 'officeHierarchyPath'];
  dataSource: ClientsDataSource;
  /** Get the required filter value. */
  searchValue = '';

  existsClientsToFilter = false;
  notExistsClientsToFilter = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  /**
   * Fetches paginated client list
   * @param {ClientsService} clientsService Clients Service
   * @param {SearchService} searchService Search service
   * @param {MatomoTracker} matomoTracker Matomo tracker service
   */
  constructor(
    private clientsService: ClientsService,
    private searchService: SearchService,
    private matomoTracker: MatomoTracker,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    //set Matomo page info
    let title = document.title;
    this.matomoTracker.setDocumentTitle(`${title}`);

    this.getClients();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page, this.showClosedAccounts.change)
      .pipe(tap(() => this.loadClientsPage()))
      .subscribe();
  }

  /**
   * Loads a page of journal entries.
   */
  loadClientsPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    //Matomo log activity
    this.matomoTracker.trackEvent('clients', 'list', this.sort.active, this.paginator.pageIndex); // change to track right info

    if (this.searchValue !== '') {
      this.applyFilter(this.searchValue);

      //Track client search in Matomo
      this.matomoTracker.trackSiteSearch(this.searchValue, 'clients');
    } else {
      this.dataSource.getClients(
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.showClosedAccounts.checked
      );
    }
  }

  /**
   * Initializes the data source for clients table and loads the first page.
   */
  getClients() {
    this.dataSource = new ClientsDataSource(this.clientsService, this.searchService, this.settingsService);
    this.dataSource.getClients(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.showClosedAccounts.checked
    );
    this.dataSource.records$.subscribe((totalRecords) => {
      this.existsClientsToFilter = totalRecords > 0;
      this.notExistsClientsToFilter = !this.existsClientsToFilter;
    });
  }

  /**
   * Filter Client Data
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string = '') {
    this.searchValue = filterValue;
    this.dataSource.filterClients(
      filterValue.trim().toLowerCase(),
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.showClosedAccounts.checked
    );
  }
  /**
   * Search Client Data
   * @param {string} searchValue Value to filter data.
   */
  applySearch(searchValue: string = '') {
    if (searchValue.length > 0) {
      this.dataSource = new ClientsDataSource(this.clientsService, this.searchService, this.settingsService);
      this.searchValue = searchValue;
      this.dataSource.searchClients(this.searchValue, this.showClosedAccounts.checked);
    } else {
      //TODO after the search filter is cleared/empty, there's no trigger to reset
    }
  }
}
