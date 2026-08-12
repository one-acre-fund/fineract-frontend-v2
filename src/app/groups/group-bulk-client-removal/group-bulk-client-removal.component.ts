/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Custom Components */
import { SiteSelectorChange } from 'app/shared/site-selector/site-selector.component';
import {
  GroupRemovalReviewExceptions,
  GroupRemovalReviewRow,
} from 'app/shared/group-removal-review/group-removal-review.component';
import { GroupsService } from '../groups.service';
import { downloadCsvRows } from 'app/shared/group-removal-impact-requests.utils';
import {
  CreateGroupRemovalImpactRequestPayload,
  GroupRemovalImpactRequestDetail,
  GroupRemovalImpactTemplate,
} from 'app/shared/group-removal-impact-requests.models';

/**
 * Group Bulk Client Removal (Impact Preview) Component.
 *
 * Displays a preview of the impact of a bulk client group removal
 * before submitting the request for approval.
 */
@Component({
  selector: 'mifosx-group-bulk-client-removal',
  templateUrl: './group-bulk-client-removal.component.html',
  styleUrls: ['./group-bulk-client-removal.component.scss'],
})
export class GroupBulkClientRemovalComponent implements OnInit {
  /** Site selection passed via router state from the groups page. */
  siteSelection: SiteSelectorChange | null = null;
  impactTemplate: GroupRemovalImpactTemplate | null = null;
  requestDetail: GroupRemovalImpactRequestDetail | null = null;
  requestId: number | null = null;
  loading = false;
  submitting = false;
  showSubmitActions = false;
  reviewedBy: string | null = null;
  reviewComment: string | null = null;
  /** Scope breadcrumb (e.g. Country | Region | District) */
  scope: string[] = [];
  /** Summary statistics */
  groupsAffected = 0;
  clientsInScope = 0;
  toBeRemoved = 0;
  toBeSkipped = 0;
  /** Exceptions */
  exceptions: GroupRemovalReviewExceptions = {
    bannedClients: true,
    clientsWithActiveLoans: true,
    groupsWithActiveLoans: true,
  };

  /** Impact preview rows */
  groups: GroupRemovalReviewRow[] = [];

  /** Total number of groups affected (for footer note) */
  totalGroups = 0;

  skippedClientsCsvRows: Array<Record<string, string | number | boolean | null>> = [];
  removedClientsCsvRows: Array<Record<string, string | number | boolean | null>> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private snackBar: MatSnackBar
  ) {
    this.requestDetail =
      this.router.getCurrentNavigation()?.extras?.state?.['requestDetail'] ??
      history.state?.requestDetail ??
      null;
    this.requestId =
      this.router.getCurrentNavigation()?.extras?.state?.['requestId'] ??
      history.state?.requestId ??
      null;

    this.siteSelection =
      this.router.getCurrentNavigation()?.extras?.state?.['siteSelection'] ??
      history.state?.siteSelection ??
      null;
    this.impactTemplate =
      this.router.getCurrentNavigation()?.extras?.state?.['impactTemplate'] ??
      history.state?.impactTemplate ??
      null;
  }

  ngOnInit(): void {
    if (this.isRequestDetailPayload(this.requestDetail)) {
      this.showSubmitActions = false;
      this.bindRequestDetail(this.requestDetail);
      return;
    }

    if (this.requestId != null) {
      this.showSubmitActions = false;
      this.loadRequestById(this.requestId);
      return;
    }

    const templateFromState = this.isImpactTemplatePayload(this.impactTemplate)
      ? this.impactTemplate
      : this.isImpactTemplatePayload(this.requestDetail)
        ? this.requestDetail
        : null;

    if (!templateFromState) {
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }

    const selectionScope = [this.siteSelection?.regionName, this.siteSelection?.districtName].filter(
      (name): name is string => !!name
    );
    const templateScope = (templateFromState.scope || []).filter((name: string) => !!name);
    this.scope = selectionScope.length ? selectionScope : templateScope;

    this.showSubmitActions = true;
    this.bindImpactTemplate(templateFromState);
  }

  private loadRequestById(requestId: number): void {
    this.loading = true;
    this.groupsService.getGroupRemovalImpactRequestById(requestId).subscribe({
      next: (detail) => {
        this.loading = false;
        this.bindRequestDetail(detail);
      },
      error: (error) => {
        this.loading = false;
        if (error?.status === 404) {
          this.snackBar.open('Request not found.', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Failed to load request details.', 'Close', { duration: 3000 });
        }
        this.router.navigate(['../'], { relativeTo: this.route });
      },
    });
  }

  private bindRequestDetail(detail: GroupRemovalImpactRequestDetail): void {
    this.showSubmitActions = false;
    this.requestDetail = detail;
    this.requestId = detail.id;
    this.reviewedBy = detail.reviewedBy;
    this.reviewComment = detail.reviewComment;
    this.scope = [this.siteSelection?.regionName, this.siteSelection?.districtName].filter(
      (name): name is string => !!name
    );
    this.bindImpactTemplate(detail.impactTemplate);
  }

  /**
   * Downloads skipped or removed clients as CSV.
   * @param {('skipped' | 'removed')} type Type of clients to export.
   */
  downloadCsv(type: 'skipped' | 'removed') {
    if (!this.canDownloadCsv(type)) {
      return;
    }

    const backendRows = type === 'removed' ? this.removedClientsCsvRows : this.skippedClientsCsvRows;
    if (backendRows.length > 0) {
      downloadCsvRows(backendRows, `${type}-clients.csv`);
      return;
    }

    const escapeCsv = (value: string | number): string => {
      const text = String(value);
      const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${safeText.replace(/"/g, '""')}"`;
    };
    const rows = this.groups.map((g) =>
      [g.group, g.site, type === 'removed' ? g.toRemove : g.toSkip].map(escapeCsv).join(',')
    );
    const header = ['Group', 'Site', type === 'removed' ? 'To remove' : 'To skip'].join(',');
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-clients.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private bindImpactTemplate(template: GroupRemovalImpactTemplate): void {
    this.impactTemplate = template;
    this.groupsAffected = template.summary?.groupsAffected ?? 0;
    this.clientsInScope = template.summary?.clientsInScope ?? 0;
    this.toBeRemoved = template.summary?.toBeRemoved ?? 0;
    this.toBeSkipped = template.summary?.toBeSkipped ?? 0;

    this.exceptions = {
      ...this.exceptions,
      ...(template.exceptions || {}),
    };

    this.groups = (template.rows || []).map((row: any) => ({
      group: row.group,
      site: row.site,
      toRemove: row.toRemove,
      toSkip: row.toSkip,
    }));
    this.totalGroups = template.totalGroups ?? this.groups.length;

    this.skippedClientsCsvRows = template.skippedClientsCsvRows || [];
    this.removedClientsCsvRows = template.removedClientsCsvRows || [];
  }

  canDownloadCsv(type: 'skipped' | 'removed'): boolean {
    const backendRows = type === 'removed' ? this.removedClientsCsvRows : this.skippedClientsCsvRows;
    if (backendRows.length > 0) {
      return true;
    }

    if (type === 'removed') {
      return this.groups.some((group) => group.toRemove > 0);
    }

    return this.groups.some((group) => group.toSkip > 0);
  }

  onDownloadClicked(type: 'skipped' | 'removed'): void {
    this.downloadCsv(type);
  }

  get showReviewMeta(): boolean {
    return !this.showSubmitActions && (!!this.reviewedBy || !!this.reviewComment);
  }

  get canSubmitForApproval(): boolean {
    return this.showSubmitActions && this.toBeRemoved > 0;
  }

  /** Navigates back to the groups page. */
  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  /** Submits the bulk removal request for approval. */
  submitForApproval() {
    if (this.submitting || this.requestId != null) {
      return;
    }

    const payload = this.buildCreatePayload();
    if (!payload) {
      this.snackBar.open('Select at least one office and a valid district before submission.', 'Close', {
        duration: 3500,
      });
      return;
    }

    this.submitting = true;
    this.groupsService.createGroupRemovalImpactRequest(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open('Group removal request submitted for approval.', 'Close', { duration: 3000 });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (error) => {
        this.submitting = false;
        if (error?.status === 400) {
          this.snackBar.open('At least one office must be selected.', 'Close', { duration: 3500 });
          return;
        }
        this.snackBar.open('Failed to submit group removal request.', 'Close', { duration: 3500 });
      },
    });
  }

  private buildCreatePayload(): CreateGroupRemovalImpactRequestPayload | null {
    const officeIds = this.siteSelection?.siteIds?.length ? [...this.siteSelection.siteIds] : null;
    const secondLastHierarchyOfficeId = this.siteSelection?.districtId ?? null;

    if (!officeIds?.length || !secondLastHierarchyOfficeId || secondLastHierarchyOfficeId <= 0) {
      return null;
    }

    return {
      officeIds,
      secondLastHierarchyOfficeId,
    };
  }

  private isRequestDetailPayload(payload: unknown): payload is GroupRemovalImpactRequestDetail {
    return !!payload && typeof payload === 'object' && 'impactTemplate' in payload;
  }

  private isImpactTemplatePayload(payload: unknown): payload is GroupRemovalImpactTemplate {
    return !!payload && typeof payload === 'object' && 'summary' in payload && 'rows' in payload;
  }
}
