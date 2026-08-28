/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'app/settings/settings.service';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/** Custom Services */
import { GroupsService } from './groups.service';

/** Custom Components */
import { SiteSelectorChange } from 'app/shared/site-selector/site-selector.component';
import {
  GroupRemovalCheckerTabEvent,
  GroupRemovalCheckerPageEvent,
} from 'app/shared/group-removal-checker-tabs/group-removal-checker-tabs.component';
import {
  GroupRemovalCheckerTableRow,
  mapRequestToCheckerTableRow,
} from 'app/shared/group-removal-impact-requests.utils';
import {
  CreateGroupRemovalImpactRequestPayload,
  GroupRemovalImpactRequestListItem,
} from 'app/shared/group-removal-impact-requests.models';

/** Custom Data Source */
import { GroupsDataSource } from './groups.datasource';

/**
 * Groups component.
 */
@Component({
  selector: 'mifosx-app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit, AfterViewInit {
  @ViewChild('showClosedGroups', { static: true }) showClosedGroups: MatCheckbox;

  /** Name form control. */
  name = new UntypedFormControl();
  /** Columns to be displayed in groups table. */
  displayedColumns = ['name', 'accountNo', 'status', 'officeName','officeHierarchyPath'];
  /** Data source for groups table. */
  dataSource: GroupsDataSource;
  /** Groups filter. */
  filterGroupsBy = [
    {
      type: 'name',
      value: '',
    },
  ];

  /** Paginator for groups table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for groups table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /** Current site selector selection. */
  siteSelection: SiteSelectorChange | null = null;

  /** Optional group context id for group-specific checker queries. */
  groupContextId: number | null = null;

  /** Currently selected country id for checker list queries. */
  selectedCountryId: number | null = null;

  /** Removal checker requests data. */
  removalCheckerRequests: GroupRemovalCheckerTableRow[] = [];

  /** Removal checker history data. */
  removalCheckerHistory: GroupRemovalCheckerTableRow[] = [];

  loadingRequests = false;
  loadingHistory = false;
  requestsOffset = 0;
  requestsLimit = 10;
  requestsTotal = 0;
  historyOffset = 0;
  historyLimit = 10;
  historyTotal = 0;

  /**
   * @param {GroupsService} groupsService Groups Service
   */
  constructor(
    private groupsService: GroupsService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    const groupIdParam = this.route.snapshot.paramMap.get('groupId');
    this.groupContextId = groupIdParam ? Number(groupIdParam) : null;
    this.selectedCountryId = this.getSelectedCountryId();
    this.getGroups();
    this.loadRemovalRequests(this.requestsOffset, this.requestsLimit);
  }

  /**
   * Subscribes to all search filters:
   * Name
   * sort change and page change.
   */
  ngAfterViewInit() {
    this.name.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'name');
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadGroupsPage()))
      .subscribe();
  }

  changeShowClosedGroups() {
    this.loadGroupsPage();
  }

  /**
   * Loads a page of groups.
   */
  loadGroupsPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    this.dataSource.getGroups(
      this.filterGroupsBy,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      !this.showClosedGroups.checked
    );
  }

  /**
   * Filters data in groups table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
  applyFilter(filterValue: string, property: string) {
    this.paginator.pageIndex = 0;
    const findIndex = this.filterGroupsBy.findIndex((filter) => filter.type === property);
    this.filterGroupsBy[findIndex].value = filterValue;
    this.loadGroupsPage();
  }

  /**
   * Initializes the data source for groups table and loads the first page.
   */
  getGroups() {
    this.dataSource = new GroupsDataSource(this.groupsService);
    this.dataSource.getGroups(
      this.filterGroupsBy,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  /**
   * Stores the latest site selector selection.
   */
  onSiteSelectionChange(selection: SiteSelectorChange) {
    this.siteSelection = selection;
  }

  /**
   * Navigates to the bulk client group removal impact preview page.
   */
  bulkRemoval() {
    if (!this.siteSelection?.regionId || !this.siteSelection?.districtId) {
      const firstLevelLabel = this.siteSelection?.firstLevelLabel || this.translateService.instant('labels.commons.Region');
      const secondLevelLabel = this.siteSelection?.secondLevelLabel || this.translateService.instant('labels.oaf.District');
      this.snackBar.open(
        `Select ${firstLevelLabel} / ${secondLevelLabel}`,
        this.translateService.instant('labels.buttons.Close'),
        { duration: 3000 }
      );
      return;
    }

    const officeIds = this.buildSelectedOfficeIds(this.siteSelection);
    const secondLastHierarchyOfficeId = this.buildSecondLastHierarchyOfficeId(this.siteSelection);

    if (!officeIds.length || secondLastHierarchyOfficeId <= 0) {
      this.snackBar.open(
        'Select at least one last hierarchy office and a valid second-last hierarchy office.',
        this.translateService.instant('labels.buttons.Close'),
        { duration: 3500 }
      );
      return;
    }

    const payload: CreateGroupRemovalImpactRequestPayload = {
      officeIds,
      secondLastHierarchyOfficeId,
    };

    this.groupsService.getGroupRemovalImpactTemplate(payload).subscribe({
      next: (impactTemplate: any) => {
        this.router.navigate(['bulk-client-removal'], {
          relativeTo: this.route,
          state: { siteSelection: this.siteSelection, impactTemplate },
        });
      },
      error: (error) => {
        if (error?.status === 400) {
          this.snackBar.open('At least one office must be selected.', this.translateService.instant('labels.buttons.Close'), {
            duration: 3500,
          });
          return;
        }

        this.snackBar.open('Failed to create group removal request.', this.translateService.instant('labels.buttons.Close'), {
          duration: 3500,
        });
      },
    });
  }

  private loadRemovalRequests(offset: number, limit: number): void {
    this.loadingRequests = true;
    this.groupsService.getGroupRemovalImpactRequests(this.selectedCountryId, offset, limit).subscribe({
      next: (response) => {
        this.removalCheckerRequests = (response?.requests || []).map((request: GroupRemovalImpactRequestListItem) =>
          mapRequestToCheckerTableRow(request)
        );
        this.requestsOffset = offset;
        this.requestsLimit = limit;
        this.requestsTotal = response?.totalFilteredRecords || 0;
        this.loadingRequests = false;
      },
      error: () => {
        this.loadingRequests = false;
        this.snackBar.open('Failed to load pending requests.', this.translateService.instant('labels.buttons.Close'), {
          duration: 3000,
        });
      },
    });
  }

  private loadRemovalHistory(offset: number, limit: number): void {
    this.loadingHistory = true;
    this.groupsService.getGroupRemovalImpactRequestsHistory(this.selectedCountryId, offset, limit).subscribe({
      next: (response) => {
        this.removalCheckerHistory = (response?.requests || []).map((request: GroupRemovalImpactRequestListItem) =>
          mapRequestToCheckerTableRow(request)
        );
        this.historyOffset = offset;
        this.historyLimit = limit;
        this.historyTotal = response?.totalFilteredRecords || 0;
        this.loadingHistory = false;
      },
      error: () => {
        this.loadingHistory = false;
        this.snackBar.open('Failed to load request history.', this.translateService.instant('labels.buttons.Close'), {
          duration: 3000,
        });
      },
    });
  }

  private buildSelectedOfficeIds(selection: SiteSelectorChange): number[] {
    return selection.siteIds?.length ? [...selection.siteIds] : [];
  }

  private buildSecondLastHierarchyOfficeId(selection: SiteSelectorChange): number {
    return selection.districtId || 0;
  }

  private getSelectedCountryId(): number | null {
    return this.settingsService.getSelectedCountry()?.id ?? null;
  }

  onRemovalCheckerTabChanged(event: GroupRemovalCheckerTabEvent): void {
    if (event.tab === 'requests') {
      this.loadRemovalRequests(this.requestsOffset, this.requestsLimit);
      return;
    }

    this.loadRemovalHistory(this.historyOffset, this.historyLimit);
  }

  onRemovalCheckerPageChanged(event: GroupRemovalCheckerPageEvent): void {
    if (event.tab === 'requests') {
      this.loadRemovalRequests(event.offset, event.limit);
      return;
    }

    this.loadRemovalHistory(event.offset, event.limit);
  }

  onRemovalCheckerReview(event: { row: GroupRemovalCheckerTableRow; groupId: number | null }): void {
    this.router.navigate(['bulk-client-removal'], {
      relativeTo: this.route,
      state: {
        siteSelection: this.siteSelection,
        requestId: event.row.id,
        groupId: event.groupId,
      },
    });
  }
}
