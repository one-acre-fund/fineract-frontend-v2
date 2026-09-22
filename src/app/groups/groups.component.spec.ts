import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { GroupsComponent } from './groups.component';
import { GroupsService } from './groups.service';
import { SettingsService } from 'app/settings/settings.service';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { SiteSelectorChange } from 'app/shared/site-selector/site-selector.component';

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  let groupsService: jasmine.SpyObj<GroupsService>;
  const selection = (siteIds: number[] | null): SiteSelectorChange => ({
    regionId: 1,
    regionName: 'Region',
    districtId: 2,
    districtName: 'District',
    siteIds,
  });

  /** Office ids sent on the Nth groups listing request. */
  const officeIdsOfCall = (index: number): number[] =>
    groupsService.getGroupsByCountryId.calls.argsFor(index)[6] as number[];

  beforeEach(async () => {
    sessionStorage.setItem('selectedCountry', JSON.stringify({ id: 5 }));

    groupsService = jasmine.createSpyObj('GroupsService', [
      'getGroups',
      'getGroupsByCountryId',
      'getGroupRemovalImpactRequests',
      'getGroupRemovalImpactRequestsHistory',
      'getGroupRemovalImpactTemplate',
    ]);
    groupsService.getGroups.and.returnValue(of({ pageItems: [], totalFilteredRecords: 0 }));
    groupsService.getGroupsByCountryId.and.returnValue(of({ pageItems: [], totalFilteredRecords: 0 }));
    groupsService.getGroupRemovalImpactRequests.and.returnValue(of({ requests: [], totalFilteredRecords: 0 }));
    groupsService.getGroupRemovalImpactRequestsHistory.and.returnValue(of({ requests: [], totalFilteredRecords: 0 }));

    await TestBed.configureTestingModule({
      declarations: [GroupsComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
      ],
      providers: [
        { provide: GroupsService, useValue: groupsService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
        { provide: SettingsService, useValue: { getSelectedCountry: () => ({ id: 5 }) } },
        { provide: AuthenticationService, useValue: { getCredentials: () => ({ permissions: [] }) } },
      ],
    })
      .overrideComponent(GroupsComponent, {
        set: {
          template:
            '<mat-checkbox #showClosedGroups></mat-checkbox>' +
            '<table matSort></table>' +
            '<mat-paginator [pageSize]="10"></mat-paginator>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.removeItem('selectedCountry');
  });

  it('should load the listing once on init without an office filter', () => {
    expect(groupsService.getGroupsByCountryId).toHaveBeenCalledTimes(1);
    expect(officeIdsOfCall(0)).toEqual([]);
  });

  it('should not reload the listing when the site selection changes', () => {
    component.onSiteSelectionChange(selection([12, 19]));

    expect(component.siteSelection).toEqual(selection([12, 19]));
    expect(groupsService.getGroupsByCountryId).toHaveBeenCalledTimes(1);
  });

  it('should enable the filter only when lowest-level offices are selected', () => {
    expect(component.canApplyOfficeFilter).toBe(false);

    component.onSiteSelectionChange(selection(null));
    expect(component.canApplyOfficeFilter).toBe(false);

    component.onSiteSelectionChange(selection([]));
    expect(component.canApplyOfficeFilter).toBe(false);

    component.onSiteSelectionChange(selection([12]));
    expect(component.canApplyOfficeFilter).toBe(true);
  });

  it('should send the selected office ids when the filter is applied', () => {
    component.onSiteSelectionChange(selection([12, 19]));
    component.applyOfficeFilter();

    expect(groupsService.getGroupsByCountryId).toHaveBeenCalledTimes(2);
    expect(officeIdsOfCall(1)).toEqual([12, 19]);
  });

  it('should copy the selected ids so later selector edits do not mutate the applied filter', () => {
    const current = selection([12]);
    component.onSiteSelectionChange(current);
    component.applyOfficeFilter();

    current.siteIds.push(19);

    expect(component.appliedOfficeIds).toEqual([12]);
  });

  it('should reset to the first page when the filter is applied', () => {
    component.paginator.pageIndex = 3;
    component.onSiteSelectionChange(selection([12]));
    component.applyOfficeFilter();

    expect(component.paginator.pageIndex).toBe(0);
  });

  it('should do nothing when applying without a lowest-level office selection', () => {
    component.onSiteSelectionChange(selection(null));
    component.applyOfficeFilter();

    expect(groupsService.getGroupsByCountryId).toHaveBeenCalledTimes(1);
    expect(component.appliedOfficeIds).toEqual([]);
  });

  it('should keep the applied filter across sort and page changes', () => {
    component.onSiteSelectionChange(selection([12]));
    component.applyOfficeFilter();

    component.loadGroupsPage();

    expect(officeIdsOfCall(2)).toEqual([12]);
  });

  it('should drop the office ids when the filter is cleared', () => {
    component.onSiteSelectionChange(selection([12]));
    component.applyOfficeFilter();
    component.paginator.pageIndex = 2;

    expect(component.hasAppliedOfficeFilter).toBe(true);

    component.clearOfficeFilter();

    expect(component.hasAppliedOfficeFilter).toBe(false);
    expect(component.paginator.pageIndex).toBe(0);
    expect(officeIdsOfCall(2)).toEqual([]);
  });

  it('should do nothing when clearing with no filter applied', () => {
    component.clearOfficeFilter();

    expect(groupsService.getGroupsByCountryId).toHaveBeenCalledTimes(1);
  });

  it('should send the office ids to the non-country listing endpoint', () => {
    sessionStorage.removeItem('selectedCountry');
    component.onSiteSelectionChange(selection([12]));
    component.applyOfficeFilter();

    expect(groupsService.getGroups).toHaveBeenCalledTimes(1);
    expect(groupsService.getGroups.calls.argsFor(0)[5]).toEqual([12]);
  });

});
