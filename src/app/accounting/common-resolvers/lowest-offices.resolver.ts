/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
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
   * @param {ActivatedRouteSnapshot} route Route Snapshot
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let httpParams = new HttpParams()
      .set('retrieveOnlyLowestLevelOUs', 'true')
      .set('includeOfficeHierarchyPath', 'true');

    // Try to get countryId from route params or query params
    let countryId = route.queryParamMap.get('countryId') || route.paramMap.get('countryId');

    // If not present, default to sessionStorage value
    if (!countryId) {
      const selectedCountry = sessionStorage.getItem("selectedCountry");
      if (selectedCountry) {
        countryId = JSON.parse(selectedCountry)?.id;
      }
    }

    if (countryId) {
      httpParams = httpParams.set('countryId', countryId);
    }

    return this.organizationService.searchOffices(httpParams);
  }

}
