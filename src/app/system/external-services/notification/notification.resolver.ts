/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { SystemService } from '../../system.service';

/**
 * Notification Configuration data resolver.
 */
@Injectable()
export class NotificationConfigurationResolver implements Resolve<Object> {

  /**
   * @param {SystemService} systemService System service.
   */
  constructor(private systemService: SystemService, private settingsService: SettingsService ) {}

  /**
   * Returns the Notification Configuration data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    const countryId = this.settingsService.getSelectedCountry()?.id;
    return this.systemService.searchExternalConfiguration('NOTIFICATION', countryId, null);
  }

}
