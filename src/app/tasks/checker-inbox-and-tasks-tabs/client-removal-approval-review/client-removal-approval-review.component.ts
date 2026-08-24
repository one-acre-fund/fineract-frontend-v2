/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupsService } from 'app/groups/groups.service';

/** Custom Models */
import {
  GroupRemovalReviewExceptions,
  GroupRemovalReviewRow,
} from 'app/shared/group-removal-review/group-removal-review.component';
import {
  GroupRemovalImpactRequestDetail,
} from 'app/shared/group-removal-impact-requests.models';
import { downloadCsvRows } from 'app/shared/group-removal-impact-requests.utils';

@Component({
  selector: 'mifosx-client-removal-approval-review',
  templateUrl: './client-removal-approval-review.component.html',
  styleUrls: ['./client-removal-approval-review.component.scss'],
})
export class ClientRemovalApprovalReviewComponent implements OnInit {
  requestId: number | null = null;
  loading = false;
  detailLoaded = false;
  submitting = false;
  notFound = false;
  isPending = true;
  status: string | null = null;
  reviewedBy: string | null = null;
  reviewComment: string | null = null;
  actionResult: string | null = null;

  scope: string[] = [];
  groupsAffected = 0;
  clientsInScope = 0;
  toBeRemoved = 0;
  toBeSkipped = 0;

  exceptions: GroupRemovalReviewExceptions = {
    bannedClients: true,
    clientsWithActiveLoans: true,
    groupsWithActiveLoans: true,
  };

  rows: GroupRemovalReviewRow[] = [];
  skippedClientsCsvRows: Array<Record<string, string | number | boolean | null>> = [];
  removedClientsCsvRows: Array<Record<string, string | number | boolean | null>> = [];

  totalGroups = 0;
  reviewForm: UntypedFormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private groupsService: GroupsService,
    private snackBar: MatSnackBar
  ) {
    this.reviewForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  ngOnInit(): void {
    const requestIdParam = this.route.snapshot.paramMap.get('requestId');
    this.requestId = requestIdParam ? Number(requestIdParam) : null;

    if (!this.requestId) {
      this.notFound = true;
      return;
    }

    this.loadRequestDetail(this.requestId);
  }

  private loadRequestDetail(requestId: number): void {
    this.loading = true;
    this.notFound = false;
    this.detailLoaded = false;
    this.groupsService.getGroupRemovalImpactRequestById(requestId).subscribe({
      next: (detail) => {
        this.loading = false;
        this.bindDetail(detail);
        this.detailLoaded = true;
      },
      error: (error) => {
        this.loading = false;
        this.notFound = error?.status === 404;
        this.detailLoaded = false;
        const message = this.notFound ? 'Request not found.' : 'Failed to load request details.';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      },
    });
  }

  private bindDetail(detail: GroupRemovalImpactRequestDetail): void {
    this.groupsAffected = detail.impactTemplate?.summary?.groupsAffected || 0;
    this.clientsInScope = detail.impactTemplate?.summary?.clientsInScope || 0;
    this.toBeRemoved = detail.impactTemplate?.summary?.toBeRemoved || 0;
    this.toBeSkipped = detail.impactTemplate?.summary?.toBeSkipped || 0;
    this.exceptions = {
      ...this.exceptions,
      ...(detail.impactTemplate?.exceptions || {}),
    };
    this.rows = detail.impactTemplate?.rows || [];
    this.totalGroups = detail.impactTemplate?.totalGroups || this.rows.length;
    this.skippedClientsCsvRows = detail.impactTemplate?.skippedClientsCsvRows || [];
    this.removedClientsCsvRows = detail.impactTemplate?.removedClientsCsvRows || [];
    this.scope = [`Request #${detail.id}`, detail.createdBy];
    this.status = detail.status;
    this.isPending = detail.status === 'PENDING';
    this.reviewedBy = detail.reviewedBy;
    this.reviewComment = detail.reviewComment;
    this.actionResult = detail.actionResult || null;
    this.reviewForm.patchValue({ comment: detail.reviewComment || '' });
    if (!this.isPending) {
      this.reviewForm.disable();
    } else {
      this.reviewForm.enable();
    }
  }

  get showReviewMeta(): boolean {
    return !this.isPending && (this.isFailed || !!this.reviewedBy || !!this.reviewComment || !!this.actionResult);
  }

  get isFailed(): boolean {
    return (this.status || '').toUpperCase() === 'FAILED';
  }

  canDownloadCsv(type: 'skipped' | 'removed'): boolean {
    const backendRows = type === 'removed' ? this.removedClientsCsvRows : this.skippedClientsCsvRows;
    return backendRows.length > 0;
  }

  onDownloadClicked(type: 'skipped' | 'removed'): void {
    const rows = type === 'removed' ? this.removedClientsCsvRows : this.skippedClientsCsvRows;
    if (!rows.length) {
      return;
    }
    downloadCsvRows(rows, `${type}-clients.csv`);
  }

  back(): void {
    this.router.navigate(['/checker-inbox-and-tasks/client-removal-approvals']);
  }

  approve(): void {
    this.submitReviewAction('approve');
  }

  reject(): void {
    this.submitReviewAction('reject');
  }

  private submitReviewAction(command: 'approve' | 'reject'): void {
    if (!this.requestId || !this.isPending || this.submitting || this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.groupsService
      .reviewGroupRemovalImpactRequest(this.requestId, command, {
        comment: this.reviewForm.value.comment,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open(
            command === 'approve' ? 'Request approved successfully.' : 'Request rejected successfully.',
            'Close',
            {
              duration: 3000,
            }
          );
          this.back();
        },
        error: (error) => {
          this.submitting = false;
          if (error?.status === 400) {
            this.snackBar.open('Invalid review comment.', 'Close', { duration: 3000 });
            return;
          }
          const domainMessage = error?.error?.errors?.[0]?.defaultUserMessage;
          this.snackBar.open(domainMessage || 'Failed to submit review action.', 'Close', { duration: 3000 });
        },
      });
  }
}
