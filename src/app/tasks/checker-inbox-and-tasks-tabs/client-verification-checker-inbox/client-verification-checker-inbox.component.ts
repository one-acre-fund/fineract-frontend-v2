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
@Component({
  selector: 'mifosx-client-verification-checker-inbox',
  templateUrl: './client-verification-checker-inbox.component.html',
  styleUrls: ['./client-verification-checker-inbox.component.scss']
})
export class ClientVerificationCheckerInboxComponent extends BaseCheckerInboxComponent implements OnInit, OnDestroy, AfterViewInit {

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
    settings: SettingsService
  ) {
    super(dialog, router, fb, tasks, settings);

    this.route.data
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: { clientVerificationResource: any }) => {
      this.searchData = data.clientVerificationResource || [];
      this.dataSource.data = this.searchData;
      this.checkerData = this.searchData.length > 0;
      this.totalElements = this.searchData.length;
    });
  }

  ngOnInit(): void {
    this.createMakerCheckerSearchForm();
  }

  ngAfterViewInit(): void {
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
      makerDateTimeFrom: [''],
      makerDateTimeto: [''],
      entityName: ['CLIENT'],
      resourceId: [''],
      clientSubStatus: ['clientSubStatusType.auto_verified'],
      includeClientHierarchyPath: true,
      clientAccountNo: [''],
      officeName: [''],
      clientOfficeHierarchyPath: ['']
    });
  }
}
