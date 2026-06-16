/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

/** Custom Services */
import { AuditService } from 'app/organization/audit-trails/audit.service';
import { SettingsService } from 'app/settings/settings.service';

/** Audit action configuration — extend this list to support new action types */
export const GROUP_AUDIT_ACTIONS = [
  { labelKey: 'labels.inputs.Select Action', value: '' },
  { labelKey: 'labels.inputs.Add_Members', value: 'ASSOCIATECLIENTS' },
  { labelKey: 'labels.inputs.Remove_Members', value: 'DISASSOCIATECLIENTS' },
  { labelKey: 'labels.inputs.Assign_Group_Leader', value: 'ASSIGNROLE' },
  { labelKey: 'labels.inputs.Unassign_Group_Leader', value: 'UNASSIGNROLE' }
];

/**
 * Groups Audit Tab Component.
 * Allows users to search group membership movement history by action and date.
 */
@Component({
  selector: 'mifosx-audit-tab',
  templateUrl: './audit-tab.component.html',
  styleUrls: ['./audit-tab.component.scss']
})
export class AuditTabComponent implements OnInit {

  /** Group ID from route */
  groupId: string;
  /** Available audit actions */
  auditActions = GROUP_AUDIT_ACTIONS;
  /** Search form */
  searchForm!: UntypedFormGroup;
  /** Whether a fetch is in progress */
  isLoading = false;
  /** Whether a search has been executed at least once */
  hasSearched = false;
  /** Table columns */
  displayedColumns: string[] = ['affectedClients', 'user', 'date'];
  /** Audit results */
  auditResults: any[] = [];
  /** Total number of filtered records for pagination */
  totalRecords = 0;
  /** Page size */
  pageSize = 50;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: UntypedFormBuilder,
    private readonly auditService: AuditService,
    private readonly settingsService: SettingsService
  ) {
    this.groupId = this.route.parent.snapshot.params['groupId'];
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      actionName: [GROUP_AUDIT_ACTIONS[0].value, Validators.required],
      startDate: [null],
      endDate: [null]
    }, { validators: this.endDateAfterStartDate });
  }

  /**
   * Cross-field validator: endDate must be after startDate.
   */
  private endDateAfterStartDate(group: import('@angular/forms').AbstractControl): { [key: string]: boolean } | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && new Date(end) < new Date(start)) {
      return { endDateBeforeStartDate: true };
    }
    return null;
  }

  /**
   * Formats a timestamp (milliseconds) to a human-readable string in local timezone.
   * Output example: 13/05/2026 10:21 AM
   */
  formatTimestamp(ms: number): string {
    if (!ms) { return ''; }
    const d = new Date(ms);
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = pad(d.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${pad(hours)}:${minutes} ${ampm}`;
  }

  /**
   * Formats a start date value (Date object) to "dd MMMM yyyy" string for the API.
   * Example: 15 April 2026
   */
  private formatDateForApi(date: Date): string {
    if (!date) { return ''; }
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  /**
   * Formats affected clients list into display lines.
   */
  affectedClientLines(clients: any[]): string[] {
    if (!clients || clients.length === 0) { return []; }
    return clients.map(c => `${c.accountNo} - ${c.displayName}`);
  }

  /**
   * Triggered when the user clicks "Fetch Audits".
   */
  fetchAudits(pageIndex: number = 0): void {
    if (this.searchForm.invalid || this.isLoading) { return; }
    this.isLoading = true;
    this.hasSearched = true;

    const { actionName, startDate, endDate } = this.searchForm.value;
    const offset = pageIndex * this.pageSize;

    const filterBy: any[] = [
      { type: 'groupId', value: String(this.groupId) },
      { type: 'actionName', value: actionName },
      { type: 'includeCommandData', value: 'true' },
    ];

    if (startDate) {
      filterBy.push({ type: 'startDate', value: this.formatDateForApi(startDate) });
    }

    if (endDate) {
      filterBy.push({ type: 'endDate', value: this.formatDateForApi(endDate) });
    }

    this.auditService.getAuditTrails(filterBy, 'id', 'DESC', offset, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.auditResults = response.pageItems || [];
          this.totalRecords = response.totalFilteredRecords || 0;
          this.isLoading = false;
        },
        error: () => {
          this.auditResults = [];
          this.totalRecords = 0;
          this.isLoading = false;
        }
      });
  }

  /**
   * Called when the paginator emits a page event.
   */
  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.fetchAudits(event.pageIndex);
  }
}
