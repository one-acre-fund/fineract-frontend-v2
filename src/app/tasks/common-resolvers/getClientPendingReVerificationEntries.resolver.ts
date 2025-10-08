/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { TasksService } from '../tasks.service';

/**
 * Client Verification Data resolver.
 */
@Injectable()
export class GetClientPendingReVerificationEntries implements Resolve<Object> {

  /**
   * @param {TasksService} tasksService Tasks service.
   */
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Returns the maker checker data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    const searchData = {
      actionName: "VERIFY",
      entityName: "CLIENT",
      clientSubStatus: "clientSubStatusType.pending_re_verification",
      includeClientHierarchyPath: true,
      paged: true,
      offset: 0,
      limit: 10
    };
    return this.tasksService.getMakerCheckerData(searchData);
  }

}
