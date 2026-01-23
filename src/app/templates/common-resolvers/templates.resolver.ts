/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { TemplatesService } from '../templates.service';
import { SettingsService } from 'app/settings/settings.service';

/**
 * Templates data resolver.
 */
@Injectable()
export class TemplatesResolver implements Resolve<Object> {

  /**
   * @param {TemplatesService} templatesService Templates service.
   */
  constructor(private templatesService: TemplatesService, private settingService: SettingsService) {}

  /**
   * Returns the templates data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.templatesService.getTemplates({ countryId: this.settingService.getSelectedCountry()?.id || undefined });
  }

}
