/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { ProductsService } from '../products.service';
import { SettingsService } from 'app/settings/settings.service';

@Injectable()
export class LoanProductsTemplateResolver implements Resolve<Object> {

  constructor(private productsService: ProductsService, private settingsService: SettingsService) {}

  /**
   * Returns the loan products template data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    const countryId = this.settingsService.getSelectedCountry()?.id;
    return this.productsService.getLoanProductsTemplate(countryId);
  }

}
