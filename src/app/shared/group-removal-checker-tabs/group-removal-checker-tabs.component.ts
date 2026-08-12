/** Angular Imports */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  GroupRemovalCheckerTableRow,
  getStatusChipClass,
} from 'app/shared/group-removal-impact-requests.utils';

export interface GroupRemovalCheckerTabEvent {
  tab: 'requests' | 'history';
  groupId: number | null;
}

export interface GroupRemovalCheckerPageEvent {
  tab: 'requests' | 'history';
  offset: number;
  limit: number;
  groupId: number | null;
}

/**
 * Reusable tabs for bulk client removal checker requests and history.
 */
@Component({
  selector: 'mifosx-group-removal-checker-tabs',
  templateUrl: './group-removal-checker-tabs.component.html',
  styleUrls: ['./group-removal-checker-tabs.component.scss'],
})
export class GroupRemovalCheckerTabsComponent {
  @Input() title = 'Bulk Client Removal';
  @Input() showTitle = true;
  @Input() requests: GroupRemovalCheckerTableRow[] = [];
  @Input() history: GroupRemovalCheckerTableRow[] = [];
  @Input() loadingRequests = false;
  @Input() loadingHistory = false;
  @Input() requestsOffset = 0;
  @Input() requestsLimit = 10;
  @Input() requestsTotal = 0;
  @Input() historyOffset = 0;
  @Input() historyLimit = 10;
  @Input() historyTotal = 0;
  @Input() groupId: number | null = null;

  @Output() tabChanged = new EventEmitter<GroupRemovalCheckerTabEvent>();
  @Output() pageChanged = new EventEmitter<GroupRemovalCheckerPageEvent>();
  @Output() review = new EventEmitter<{ row: GroupRemovalCheckerTableRow; groupId: number | null }>();

  onTabChange(event: MatTabChangeEvent): void {
    this.tabChanged.emit({
      tab: event.index === 0 ? 'requests' : 'history',
      groupId: this.groupId,
    });
  }

  onReview(row: GroupRemovalCheckerTableRow): void {
    this.review.emit({ row, groupId: this.groupId });
  }

  onRequestsPageChange(event: PageEvent): void {
    this.pageChanged.emit({
      tab: 'requests',
      offset: event.pageIndex * event.pageSize,
      limit: event.pageSize,
      groupId: this.groupId,
    });
  }

  onHistoryPageChange(event: PageEvent): void {
    this.pageChanged.emit({
      tab: 'history',
      offset: event.pageIndex * event.pageSize,
      limit: event.pageSize,
      groupId: this.groupId,
    });
  }

  get requestsPageIndex(): number {
    return this.requestsLimit > 0 ? Math.floor(this.requestsOffset / this.requestsLimit) : 0;
  }

  get historyPageIndex(): number {
    return this.historyLimit > 0 ? Math.floor(this.historyOffset / this.historyLimit) : 0;
  }

  getStatusClass(status: GroupRemovalCheckerTableRow['status']): string {
    return getStatusChipClass(status);
  }

  formatExceptions(row: GroupRemovalCheckerTableRow): string {
    const list: string[] = [];
    if (row.exceptions?.bannedClients) {
      list.push('Banned Clients');
    }
    if (row.exceptions?.clientsWithActiveLoans) {
      list.push('Clients with Active Loans');
    }
    if (row.exceptions?.groupsWithActiveLoans) {
      list.push('Groups with Active Loans');
    }
    return list.length ? list.join(', ') : 'None';
  }
}
