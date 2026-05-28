/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

import { CountryContextService } from 'app/shared/services/country-context.service';

/**
 * Search service.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /**
   * @param {HttpClient} http Http Client to send requests.
   * @param {CountryContextService} countryContext Country context service.
   */
  constructor(
    private http: HttpClient,
    private countryContext: CountryContextService
  ) {}

  /**
   * @param {string} query Query String
   * @param {string} resource Entity resource
   * @returns {Observable<any>} Search Results.
   */
  getSearchResults(query: string, resource: string): Observable<any> {
    const countryId = this.countryContext.getCountryId();

    let httpParams = new HttpParams()
      .set('exactMatch', 'false')
      .set('query', query)
      .set('resource', resource)
      .set('includeOfficeHierarchyPath', 'true');

    if (countryId != undefined) {
      httpParams = httpParams.set('countryId', countryId);
    }
    return this.http.get('/search', { params: httpParams });
  }
}
