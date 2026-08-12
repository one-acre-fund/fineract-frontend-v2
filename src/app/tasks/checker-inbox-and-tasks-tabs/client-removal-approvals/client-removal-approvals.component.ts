/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupsService } from 'app/groups/groups.service';
import { SettingsService } from 'app/settings/settings.service';
import {
  GroupRemovalCheckerTabEvent,
  GroupRemovalCheckerPageEvent,
} from 'app/shared/group-removal-checker-tabs/group-removal-checker-tabs.component';
import {
  GroupRemovalCheckerTableRow,
  mapRequestToCheckerTableRow,
} from 'app/shared/group-removal-impact-requests.utils';
import { GroupRemovalImpactRequestListItem } from 'app/shared/group-removal-impact-requests.models';

/**
 * Client Removal Approvals Component
 */
@Component({
  selector: 'mifosx-client-removal-approvals',
  templateUrl: './client-removal-approvals.component.html',
  styleUrls: ['./client-removal-approvals.component.scss']
})
export class ClientRemovalApprovalsComponent implements OnInit {
  selectedCountryId: number | null = null;
  requests: GroupRemovalCheckerTableRow[] = [];
  history: GroupRemovalCheckerTableRow[] = [];
  loadingRequests = false;
  loadingHistory = false;
  requestsOffset = 0;
  requestsLimit = 10;
  requestsTotal = 0;
  historyOffset = 0;
  historyLimit = 10;
  historyTotal = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.selectedCountryId = this.getSelectedCountryId();
    this.loadPendingRequests(this.requestsOffset, this.requestsLimit);
  }

  onTabChanged(_event: GroupRemovalCheckerTabEvent): void {
    if (_event.tab === 'requests') {
      this.loadPendingRequests(this.requestsOffset, this.requestsLimit);
      return;
    }
    this.loadHistoryRequests(this.historyOffset, this.historyLimit);
  }

  onPageChanged(event: GroupRemovalCheckerPageEvent): void {
    if (event.tab === 'requests') {
      this.loadPendingRequests(event.offset, event.limit);
      return;
    }
    this.loadHistoryRequests(event.offset, event.limit);
  }

  onReviewClicked(event: { row: GroupRemovalCheckerTableRow; groupId: number | null }): void {
    this.router.navigate(['../client-removal-approvals/review', event.row.id], {
      relativeTo: this.route,
    });
  }

  private loadPendingRequests(offset: number, limit: number): void {
    this.loadingRequests = true;
    this.groupsService.getGroupRemovalImpactRequests(this.selectedCountryId, offset, limit).subscribe({
      next: (response) => {
        this.requests = (response?.requests || []).map((request: GroupRemovalImpactRequestListItem) =>
          mapRequestToCheckerTableRow(request)
        );
        this.requestsOffset = offset;
        this.requestsLimit = limit;
        this.requestsTotal = response?.totalFilteredRecords || 0;
        this.loadingRequests = false;
      },
      error: () => {
        this.loadingRequests = false;
        this.snackBar.open('Failed to load pending requests.', 'Close', { duration: 3000 });
      },
    });
  }

  private loadHistoryRequests(offset: number, limit: number): void {
    this.loadingHistory = true;
    this.groupsService.getGroupRemovalImpactRequestsHistory(this.selectedCountryId, offset, limit).subscribe({
      next: (response) => {
        this.history = (response?.requests || []).map((request: GroupRemovalImpactRequestListItem) =>
          mapRequestToCheckerTableRow(request)
        );
        this.historyOffset = offset;
        this.historyLimit = limit;
        this.historyTotal = response?.totalFilteredRecords || 0;
        this.loadingHistory = false;
      },
      error: () => {
        this.loadingHistory = false;
        this.snackBar.open('Failed to load request history.', 'Close', { duration: 3000 });
      },
    });
  }

  private getSelectedCountryId(): number | null {
    return this.settingsService.getSelectedCountry()?.id ?? null;
  }
}
