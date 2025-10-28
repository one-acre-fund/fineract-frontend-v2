import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseCheckerInboxComponent } from 'app/tasks/common-directives/base-checker-inbox.component';
import { TasksService } from '../../tasks.service';
import { SettingsService } from 'app/settings/settings.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-client-pending-reverification-checker-inbox',
  templateUrl: './client-pending-reverification-checker-inbox.component.html',
  styleUrls: ['./client-pending-reverification-checker-inbox.component.scss']
})
export class ClientPendingReVerificationCheckerInboxComponent extends BaseCheckerInboxComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('includeOUPath', { static: false }) includeOUPath!: MatCheckbox;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    dialog: MatDialog,
    router: Router,
    fb: UntypedFormBuilder,
    tasks: TasksService,
    settings: SettingsService,
    dateUtils: Dates
  ) {
    super(dialog, router, fb, tasks, settings, dateUtils);

    this.route.data
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: { clientPendingReVerificationResource: any }) => {
      this.searchData = data.clientPendingReVerificationResource?.pageItems || [];
      this.dataSource.data = this.searchData;
      this.checkerData = this.searchData.length > 0;
      this.totalElements = this.searchData.length;
    });
  }

  ngOnInit(): void {
    this.createMakerCheckerSearchForm();
  }

  ngAfterViewInit(): void {
    if (!this.sort || !this.paginator) return;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.includeOUPath.change
    )
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.pageIndex = this.paginator.pageIndex;
          this.pageSize = this.paginator.pageSize;
          this.loadCheckerData();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createMakerCheckerSearchForm(): void {
    this.makerCheckerSearchForm = this.formBuilder.group({
      dateFrom: [''],
      dateTo: [''],
      clientSubStatus: ['clientSubStatusType.pending_re_verification'],
      includeClientHierarchyPath: true,
      clientAccountNo: [''],
      officeName: [''],
      clientOfficeHierarchyPath: [''],
      displayName: ['']
    });
  }
}
