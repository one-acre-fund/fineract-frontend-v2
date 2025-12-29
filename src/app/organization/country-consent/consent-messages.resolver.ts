/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { OrganizationService } from '../organization.service';

/**
 * Consent messages data resolver.
 */
@Injectable()
export class ConsentMessagesResolver implements Resolve<Object> {

  /**
   * @param {OrganizationService} organizationService Organization service.
   */
  constructor(private organizationService: OrganizationService) {}

  /**
   * Returns the consent messages data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.organizationService.getCountryConsentMessages({});
  }

}
