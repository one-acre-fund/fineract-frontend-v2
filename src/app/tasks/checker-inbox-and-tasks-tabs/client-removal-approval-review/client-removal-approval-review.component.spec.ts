import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClientRemovalApprovalReviewComponent } from './client-removal-approval-review.component';
import { GroupsService } from 'app/groups/groups.service';

describe('ClientRemovalApprovalReviewComponent', () => {
  let component: ClientRemovalApprovalReviewComponent;
  let fixture: ComponentFixture<ClientRemovalApprovalReviewComponent>;
  let groupsService: jasmine.SpyObj<GroupsService>;

  beforeEach(async () => {
    groupsService = jasmine.createSpyObj<GroupsService>('GroupsService', [
      'getGroupRemovalImpactRequestById',
      'reviewGroupRemovalImpactRequest',
    ]);

    groupsService.getGroupRemovalImpactRequestById.and.returnValue(
      of({
        id: 12,
        status: 'PENDING',
        officeIds: [1],
        impactTemplate: {
          summary: { groupsAffected: 1, clientsInScope: 2, toBeRemoved: 1, toBeSkipped: 1 },
          exceptions: { bannedClients: true, clientsWithActiveLoans: true, groupsWithActiveLoans: false },
          rows: [{ group: 'G1', site: 'S1', toRemove: 1, toSkip: 1 }],
          totalGroups: 1,
          skippedClientsCsvRows: [],
          removedClientsCsvRows: [],
        },
        createdOn: '2026-08-10T15:24:10Z',
        createdBy: 'maker',
        reviewedOn: null,
        reviewedBy: null,
        reviewComment: null,
      } as any)
    );
    groupsService.reviewGroupRemovalImpactRequest.and.returnValue(of({ status: 'APPROVED' } as any));

    await TestBed.configureTestingModule({
      declarations: [ClientRemovalApprovalReviewComponent],
      providers: [
        { provide: GroupsService, useValue: groupsService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['requestId', '12']]) } } },
        { provide: MatSnackBar, useValue: { open: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientRemovalApprovalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load request details on init', () => {
    expect(groupsService.getGroupRemovalImpactRequestById).toHaveBeenCalledWith(12);
    expect(component.rows.length).toBe(1);
  });

  it('should submit approve action with comment', () => {
    component.reviewForm.patchValue({ comment: 'Validated and approved' });
    component.approve();

    expect(groupsService.reviewGroupRemovalImpactRequest).toHaveBeenCalledWith(
      12,
      'approve',
      { comment: 'Validated and approved' }
    );
  });
});
