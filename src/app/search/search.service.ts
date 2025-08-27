/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/**
 * Search service.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * @param {string} query Query String
   * @param {string} resource Entity resource
   * @returns {Observable<any>} Search Results.
   */
  getSearchResults(query: string, resource: string): Observable<any> {
    let countryId = undefined;
    const selectedCountry = sessionStorage.getItem("selectedCountry");
    if (selectedCountry) {
      countryId = JSON.parse(selectedCountry)?.id;
    }

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
