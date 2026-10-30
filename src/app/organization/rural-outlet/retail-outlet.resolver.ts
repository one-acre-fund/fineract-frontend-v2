import { Injectable } from '@angular/core';
import {
   Resolve,
} from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationService } from '../organization.service';
import { SettingsService } from 'app/settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class RetailOutletResolver implements Resolve<object> {
 /**
  * @param {OrganizationService} organizationService Organization service.
  * @param {SettingsService} settingsService Settings service.
  */
  constructor(private organizationService: OrganizationService, private settingsService: SettingsService) {}

  /**
   * Returns the rural retail outlets of the selected country.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    const countryId = this.settingsService.getSelectedCountry()?.id;
    return this.organizationService.getRuralRetailOutlets({ countryId });
  }
}
