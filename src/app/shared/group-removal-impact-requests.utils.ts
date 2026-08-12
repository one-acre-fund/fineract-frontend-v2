import {
  GroupRemovalCsvRow,
  GroupRemovalImpactExceptions,
  GroupRemovalImpactRequestListItem,
  GroupRemovalRequestStatus,
} from './group-removal-impact-requests.models';

export interface GroupRemovalCheckerTableRow {
  id: number;
  requesterEmail: string;
  createdOn: string;
  secondLastHierarchyOfficeName: string;
  lastHierarchyOfficesCount: number;
  createdBy: string;
  groupsAffected: number;
  clientsInScope: number;
  toRemove: number;
  toSkip: number;
  exceptions: GroupRemovalImpactExceptions;
  totalGroups: number;
  status: GroupRemovalRequestStatus;
  reviewedBy: string | null;
  reviewedOn: string | null;
  reviewComment: string | null;
}

export function mapRequestToCheckerTableRow(request: GroupRemovalImpactRequestListItem): GroupRemovalCheckerTableRow {
  return {
    id: request.id,
    requesterEmail: request.requesterEmail || request.createdBy,
    createdBy: request.createdBy,
    createdOn: request.createdOn,
    secondLastHierarchyOfficeName: request.secondLastHierarchyOfficeName || '-',
    lastHierarchyOfficesCount: request.lastHierarchyOfficesCount ?? request.officeIds?.length ?? 0,
    groupsAffected: request.summary?.groupsAffected || 0,
    clientsInScope: request.summary?.clientsInScope || 0,
    toRemove: request.clientsToRemoveCount ?? request.summary?.toBeRemoved ?? 0,
    toSkip: request.clientsToSkipCount ?? request.summary?.toBeSkipped ?? 0,
    exceptions: request.exceptions,
    totalGroups: request.totalGroups || 0,
    status: request.status,
    reviewedBy: request.reviewedBy,
    reviewedOn: request.reviewedOn,
    reviewComment: request.reviewComment,
  };
}

export function getStatusChipClass(status: GroupRemovalRequestStatus): string {
  switch (status) {
    case 'APPROVED':
      return 'status-chip status-approved';
    case 'REJECTED':
      return 'status-chip status-rejected';
    case 'PENDING':
    default:
      return 'status-chip status-pending';
  }
}

export function createCsvContent(rows: GroupRemovalCsvRow[]): string {
  if (!rows.length) {
    return '';
  }

  const headerOrder = rows.reduce((headers: string[], row) => {
    Object.keys(row).forEach((key) => {
      if (!headers.includes(key)) {
        headers.push(key);
      }
    });
    return headers;
  }, []);

  const escapeCsvValue = (value: string | number | boolean | null): string => {
    const normalized = value == null ? '' : String(value);
    const sanitized = /^[=+\-@]/.test(normalized) ? `'${normalized}` : normalized;
    return `"${sanitized.replace(/"/g, '""')}"`;
  };

  const lines = [
    headerOrder.join(','),
    ...rows.map((row) => headerOrder.map((header) => escapeCsvValue(row[header] ?? null)).join(',')),
  ];

  return lines.join('\n');
}

export function downloadCsvRows(rows: GroupRemovalCsvRow[], filename: string): void {
  const csv = createCsvContent(rows);
  if (!csv) {
    return;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}
