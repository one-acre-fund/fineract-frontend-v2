export type GroupRemovalRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface GroupRemovalImpactSummary {
  groupsAffected: number;
  clientsInScope: number;
  toBeRemoved: number;
  toBeSkipped: number;
}

export interface GroupRemovalImpactExceptions {
  bannedClients: boolean;
  clientsWithActiveLoans: boolean;
  groupsWithActiveLoans: boolean;
}

export interface GroupRemovalImpactRow {
  group: string;
  site: string;
  toRemove: number;
  toSkip: number;
}

export type GroupRemovalCsvRow = Record<string, string | number | boolean | null>;

export interface GroupRemovalImpactTemplate {
  summary: GroupRemovalImpactSummary;
  exceptions: GroupRemovalImpactExceptions;
  scope?: string[];
  rows: GroupRemovalImpactRow[];
  totalGroups: number;
  skippedClientsCsvRows: GroupRemovalCsvRow[];
  removedClientsCsvRows: GroupRemovalCsvRow[];
}

export interface GroupRemovalImpactRequestDetail {
  id: number;
  status: GroupRemovalRequestStatus;
  officeIds: number[];
  impactTemplate: GroupRemovalImpactTemplate;
  createdOn: string;
  createdBy: string;
  reviewedOn: string | null;
  reviewedBy: string | null;
  reviewComment: string | null;
}

export interface GroupRemovalImpactRequestListItem {
  id: number;
  status: GroupRemovalRequestStatus;
  officeIds: number[];
  secondLastHierarchyOfficeName: string;
  lastHierarchyOfficesCount: number;
  clientsToRemoveCount: number;
  clientsToSkipCount: number;
  requesterEmail: string;
  summary: GroupRemovalImpactSummary;
  exceptions: GroupRemovalImpactExceptions;
  totalGroups: number;
  createdOn: string;
  createdBy: string;
  reviewedOn: string | null;
  reviewedBy: string | null;
  reviewComment: string | null;
}

export interface GroupRemovalImpactRequestListResponse {
  requests: GroupRemovalImpactRequestListItem[];
  totalFilteredRecords: number;
}

export interface CreateGroupRemovalImpactRequestPayload {
  officeIds: number[];
  secondLastHierarchyOfficeId: number;
}

export interface ReviewGroupRemovalImpactRequestPayload {
  comment: string;
}
