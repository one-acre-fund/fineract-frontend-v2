/** Angular Imports */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Subject } from 'rxjs';

/** Custom Services */
import { SettingsService } from 'app/settings/settings.service';
import { MatSort } from '@angular/material/sort';
import { ClientsService } from 'app/clients/clients.service';
import { SearchService } from 'app/search/search.service';
import { takeUntil, tap } from 'rxjs/operators';
import { ClientDetailsDialogComponent } from 'app/tasks/check-inbox-dialog/client-details-dialog/client-details-dialog.component';
import { ClientFailedKYCDataSource } from 'app/tasks/checker-inbox-and-tasks-tabs/client-failed-kyc/client-failed-kyc.datasource';



@Component({
  selector: 'mifosx-client-failed-kyc',
  templateUrl: './client-failed-kyc.component.html',
  styleUrls: ['./client-failed-kyc.component.scss']
})
export class ClientFailedKycComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['name', 'clientno', 'externalid', 'status', 'office', 'officeHierarchyPath', 'action'];
  dataSource: ClientFailedKYCDataSource;
  /** Get the required filter value. */
  searchValue = '';
  isMakerChecker: boolean = true;
  existsClientsToFilter = false;
  notExistsClientsToFilter = false;

  subStatus: string = 'clientSubStatusType.kyc_failed';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private readonly destroy$ = new Subject<void>();

  /**
   * Fetches paginated client list
   * @param {ClientsService} clientsService Clients Service
   * @param {SearchService} searchService Search service
   */
  constructor(
    private readonly dialog: MatDialog,
    private readonly clientsService: ClientsService,
    private readonly searchService: SearchService,
    private readonly settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.getClients();
  }

  ngAfterViewInit() {
    this.sort.sortChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.loadClientsPage())
      )
      .subscribe();
  }

  /**
   * Loads a page of entries.
   */
  loadClientsPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    if (this.searchValue == '') {
      this.dataSource.getClients(
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize,
      );
    } else {
      this.applyFilter(this.searchValue);
    }
  }

  /**
   * Initializes the data source for clients table and loads the first page.
   */
  getClients() {

    this.dataSource = new ClientFailedKYCDataSource(this.clientsService, this.searchService, this.settingsService);
    this.dataSource.getClients(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      // this.subStatus,
    );

    this.dataSource.records$
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalRecords) => {
        this.existsClientsToFilter = totalRecords > 0;
        this.notExistsClientsToFilter = !this.existsClientsToFilter;
      });

  }

  /**
   * Filter Client Data
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string = '') {
    const normalized = filterValue.trim().toLowerCase();

    if (this.searchValue !== normalized) {
      this.searchValue = normalized;
      this.paginator.firstPage();
    } else {
      this.searchValue = normalized;
    }
    this.dataSource.filterClients(
      this.searchValue,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  viewClient(clientId: string) {
    this.dialog.open(ClientDetailsDialogComponent, {
      data: { clientId, auditId: null, canRequestMoreInfo: false }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
