/** Angular Imports */
import { Injectable } from '@angular/core';

/** rxjs Imports */
import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { AddExternalServiceModel, GetExternalServiceModel } from './external-service.model';

/**
 * External service Configuration data service.
 */
@Injectable({
  providedIn: 'root',
})
export class ExternalServiceConfigurationService {
  public static readonly PAYMENT_PROVIDER_SERVICE_NAME: string = 'PAYMENT_PROVIDER';
  public static readonly ORDER_INTEGRATION_SERVICE: string = 'ORDER_SERVICE';
  public static readonly NOTIFICATION_SERVICE_NAME: string = 'NOTIFICATION';
  public static readonly AUTHENTICATION_TYPE = [
    { id: 'Basic', name: 'Basic Authentication' },
    { id: 'Bearer', name: 'Bearer Authentication' },
    { id: 'ApiKey', name: 'API Key Authentication' },
  ];

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
    if (countryId) {
      httpParams = httpParams.set('countryId', countryId);
    }
    return this.http.get(`/externalservice/template`, { params: httpParams });
  }

  addExternalServiceConfiguration(data: AddExternalServiceModel): Observable<any> {
    return this.http.post(`/externalservice`, data);
  }

  getExternalServicePropertyByName(countryExternalService: GetExternalServiceModel, name: string) {
    return countryExternalService.propertiesData.filter((property) => property.name === name)[0]?.value;
  }
}
