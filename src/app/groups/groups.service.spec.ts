import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupsService],
    });

    service = TestBed.inject(GroupsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call create group removal impact request endpoint', () => {
    service.createGroupRemovalImpactRequest({ officeIds: [101, 201], secondLastHierarchyOfficeId: 99 }).subscribe();

    const req = httpMock.expectOne((request) =>
      request.method === 'POST' && request.url === '/groups/groupRemovalRequests'
    );

    expect(req.request.body).toEqual({ officeIds: [101, 201], secondLastHierarchyOfficeId: 99 });
    req.flush({});
  });

  it('should call pending list endpoint', () => {
    service.getGroupRemovalImpactRequests(null, 20, 25).subscribe();

    const req = httpMock.expectOne((request) =>
      request.method === 'GET' &&
      request.url === '/groups/groupRemovalRequests' &&
      request.params.get('offset') === '20' &&
      request.params.get('limit') === '25'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ requests: [], totalFilteredRecords: 0 });
  });

  it('should call history endpoint', () => {
    service.getGroupRemovalImpactRequestsHistory(null, 0, 50).subscribe();

    const req = httpMock.expectOne((request) =>
      request.method === 'GET' &&
      request.url === '/groups/groupRemovalRequests/history' &&
      request.params.get('offset') === '0' &&
      request.params.get('limit') === '50'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ requests: [], totalFilteredRecords: 0 });
  });

  it('should call review endpoint with command', () => {
    service.reviewGroupRemovalImpactRequest(12, 'approve', { comment: 'ok' }).subscribe();

    const req = httpMock.expectOne((request) =>
      request.method === 'POST' &&
      request.url === '/groups/groupRemovalRequests/12' &&
      request.params.get('command') === 'approve'
    );

    expect(req.request.body).toEqual({ comment: 'ok' });
    req.flush({});
  });
});
