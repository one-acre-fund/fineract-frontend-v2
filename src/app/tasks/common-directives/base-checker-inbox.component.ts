import { AfterViewInit, Directive, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { forkJoin, merge, of, Subscription } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from 'app/settings/settings.service';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { TasksService } from '../tasks.service';
import { ClientDetailsDialogComponent } from '../check-inbox-dialog/client-details-dialog/client-details-dialog.component';

@Directive()
export abstract class BaseCheckerInboxComponent implements OnDestroy, AfterViewInit {
  searchData: any[] = [];
  noSearchedData = false;
  checkerData = false;
  makerCheckerSearchForm!: UntypedFormGroup;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  displayedColumns: string[] = [
    'select',
    'id',
    'clientName',
    'clientAccountNo',
    'clientExternalId',
    'clientOfficeName',
    'clientOfficeHierarchyPath',
    'action'
  ];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('includeOUPath', { static: false }) includeOUPath!: MatCheckbox;

  private _listSub?: Subscription;

  constructor(
    protected dialog: MatDialog,
    protected router: Router,
    protected formBuilder: UntypedFormBuilder,
    protected tasksService: TasksService,
    protected settingsService: SettingsService
  ) { }

  ngAfterViewInit() {
    if (!this.sort || !this.paginator) return;
    const includeOUChange$ = this.includeOUPath ? this.includeOUPath.change : of({});
    this._listSub = merge(
      this.sort.sortChange.pipe(tap(() => (this.paginator.pageIndex = 0))),
      this.paginator.page,
      includeOUChange$
    )
      .pipe(
        startWith({}),
        tap(() => this.loadCheckerData())
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._listSub?.unsubscribe();
  }

  abstract createMakerCheckerSearchForm(): void;

  loadCheckerData() {
    const cleanForm = Object.entries(this.makerCheckerSearchForm.value)
      .filter(([_, v]) => v !== '' && v != null)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    const pageIndex = this.paginator ? this.paginator.pageIndex : this.pageIndex;
    const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;

    const params = {
      ...cleanForm,
      paged: true,
      offset: pageIndex * pageSize,
      limit: pageSize,
      sortBy: this.sort?.active || undefined,
      sortOrder: this.sort?.direction || undefined,
      includeClientHierarchyPath: this.includeOUPath ? this.includeOUPath.checked : true,
    };

    this.tasksService.getMakerCheckerData(params).subscribe((response: any) => {
      this.searchData = response?.pageItems || response || [];
      this.totalElements = response?.totalFilteredRecords ?? this.searchData.length;
      this.noSearchedData = this.searchData.length === 0;
      this.dataSource.data = this.searchData;
      this.selection.clear();
    });
  }

  search() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.sort.active = '';
    this.loadCheckerData();
  }

  viewClient(clientId: string, auditId: string) {
    const dialogRef = this.dialog.open(ClientDetailsDialogComponent, { data: { clientId, auditId } });
    dialogRef.afterClosed().subscribe(result => result === 'confirmed' && this.reload());
  }

  approveChecker() {
    this.confirmAndRun('Approve Checker', 'Are you sure you want to approve checker?', 'approve');
  }

  rejectChecker() {
    this.confirmAndRun('Reject Checker', 'Are you sure you want to reject checker?', 'reject');
  }

  deleteChecker() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: 'Delete Checker', dialogContext: 'Are you sure you want to delete checker?' },
    });
    dialogRef.afterClosed().subscribe(res => res.confirm && this.bulkDeleteChecker());
  }

  confirmAndRun(title: string, message: string, action: string) {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: title, dialogContext: message },
    });
    ref.afterClosed().subscribe((res: { confirm: boolean }) => res.confirm && this.bulkCheckerApproveorReject(action));
  }

  bulkCheckerApproveorReject(action: string) {
    const selected = this.selection.selected;
    if (selected.length === 0) return;
    const requests = selected.map(el =>
      this.tasksService.executeMakerCheckerAction(el.id, action)
    );
    forkJoin(requests).subscribe({
      next: () => this.reload(),
      error: (err) => console.error('Bulk Approve maker checker action failed:', err)
    });
  }

  bulkDeleteChecker() {
    const selected = this.selection.selected;
    if (selected.length === 0) return;
    const requests = selected.map(el =>
      this.tasksService.deleteMakerChecker(el.id)
    );
    forkJoin(requests).subscribe({
      next: () => this.reload(),
      error: (err) => console.error('Bulk Delete maker checker action failed:', err)
    });
  }

  applyFilter(filterValue: string = '') {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  reload() {
    const url = this.router.url;
    this.router.navigateByUrl(`/checker-inbox-and-tasks`, { skipLocationChange: true })
      .then(() => this.router.navigate([url]));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    return numSelected === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    return !row
      ? `${this.isAllSelected() ? 'select' : 'deselect'} all`
      : `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }
}
