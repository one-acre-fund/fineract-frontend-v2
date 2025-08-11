/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { AccountingService } from '../accounting.service';
import { GetOffices } from 'app/tasks/common-resolvers/getOffices.resolver';
import { OrganizationService } from 'app/organization/organization.service';
import { HttpParams } from '@angular/common/http';

/**
 * Lowest Offices data resolver.
 */
@Injectable()
export class LowestOfficesResolver implements Resolve<Object> {

  /**
   * @param {OrganizationService} organizationService Organization service.
   */
  constructor(private organizationService: OrganizationService) {}

  /**
   * Returns the offices data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    let httpParams = new HttpParams().set('retrieveOnlyLowestLevelOUs', 'true').set('includeOfficeHierarchyPath', 'true');
    return this.organizationService.searchOffices(httpParams);
  }

}
