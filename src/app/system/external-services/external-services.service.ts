/** Angular Imports */
import { Injectable } from '@angular/core';

/** rxjs Imports */
import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';

/**
 * External service Configuration data service.
 */
@Injectable({
  providedIn: 'root'
})
export class ExternalServiceConfigurationService {
  
  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * @param countryId Country ID.
   * @returns {Observable<any>}
   */
  getExternalServiceTemplate(countryId: number): Observable<any> {
    let httpParams = new HttpParams();
    if(countryId) {
      httpParams = httpParams.set('countryId', countryId);
    }
    return this.http.get(`/externalservice/template` , { params: httpParams });
  }
}
