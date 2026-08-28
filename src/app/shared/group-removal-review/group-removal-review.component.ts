/** Angular Imports */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

export interface GroupRemovalReviewExceptions {
  bannedClients: boolean;
  clientsWithActiveLoans: boolean;
  groupsWithActiveLoans: boolean;
}

export interface GroupRemovalReviewRow {
  group: string;
  site: string;
  toRemove: number;
  toSkip: number;
}

/**
 * Reusable bulk removal review body used by multiple parent flows.
 */
@Component({
  selector: 'mifosx-group-removal-review',
  templateUrl: './group-removal-review.component.html',
  styleUrls: ['./group-removal-review.component.scss'],
})
export class GroupRemovalReviewComponent implements OnChanges {
  @Input() heading = 'Review';
  @Input() scope: string[] = [];

  @Input() groupsAffected = 0;
  @Input() clientsInScope = 0;
  @Input() toBeRemoved = 0;
  @Input() toBeSkipped = 0;

  @Input() exceptions: GroupRemovalReviewExceptions = {
    bannedClients: true,
    clientsWithActiveLoans: true,
    groupsWithActiveLoans: true,
  };

  @Input() rows: GroupRemovalReviewRow[] = [];
  @Input() totalGroups = 0;

  @Input() canDownloadSkipped = false;
  @Input() canDownloadRemoved = false;

  @Output() closeClicked = new EventEmitter<void>();
  @Output() downloadClicked = new EventEmitter<'skipped' | 'removed'>();

  displayedColumns: string[] = ['group', 'site', 'toRemove', 'toSkip'];
  pageSize = 10;
  pageIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.pageIndex = 0;
    }
  }

  onClose(): void {
    this.closeClicked.emit();
  }

  onDownload(type: 'skipped' | 'removed'): void {
    this.downloadClicked.emit(type);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get pagedRows(): GroupRemovalReviewRow[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.rows.slice(start, end);
  }

  get shownRows(): number {
    return this.pagedRows.length;
  }
}
