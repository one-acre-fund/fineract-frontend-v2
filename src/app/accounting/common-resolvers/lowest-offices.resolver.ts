/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { OrganizationService } from 'app/organization/organization.service';
import { HttpParams } from '@angular/common/http';
import { CountryContextService } from 'app/shared/services/country-context.service';

/**
 * Lowest Offices data resolver.
 */
@Injectable({
  providedIn: 'root'
})
export class LowestOfficesResolver implements Resolve<Object> {
  constructor(
    private organizationService: OrganizationService,
    private countryContext: CountryContextService
  ) {}

  /**
   * Returns the offices data.
   * @param {ActivatedRouteSnapshot} route Route Snapshot
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let httpParams = new HttpParams()
      .set('retrieveOnlyLowestLevelOUs', 'true')
      .set('includeOfficeHierarchyPath', 'true');

    const countryId = this.countryContext.getCountryId(route);

    if (countryId) {
      httpParams = httpParams.set('countryId', countryId);
    }

    return this.organizationService.searchOffices(httpParams);
  }
}
