/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { OrganizationService } from '../organization.service';
import { SettingsService } from 'app/settings/settings.service';

/**
 * Consent messages data resolver.
 */
@Injectable()
export class ConsentMessagesResolver implements Resolve<Object> {

  /**
   * @param {OrganizationService} organizationService Organization service.
   */
  constructor(private settingsService: SettingsService,
    private organizationService: OrganizationService) {}

  /**
   * Returns the consent messages data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    const params: any = {
            pageNumber: 0,
            pageSize: 10
          };
    let countryId = this.settingsService.getSelectedCountry()?.id;
    if (countryId) {
      params.countryId = countryId;
    }
    return this.organizationService.getCountryConsentMessages(params);
  }

}
