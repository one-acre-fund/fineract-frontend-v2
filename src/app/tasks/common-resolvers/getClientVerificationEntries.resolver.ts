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
export class GetClientVerificationEntries implements Resolve<Object> {

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
      clientSubStatus: 'clientSubStatusType.auto_verified',
      includeClientHierarchyPath: true,
      paged: true,
      offset: 0,
      limit: 10
    };
    return this.tasksService.getClientKYCApprovals(searchData);
  }
}
