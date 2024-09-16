/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { ReportsService } from '../reports.service';

/**
 * Mix Taxononmy data resolver.
 */
@Injectable()
export class MixTaxonomyResolver  {

  /**
   * @param {ReportsService} reportsService Reports service.
   */
  constructor(private reportsService: ReportsService) {}

  /**
   * Returns the Mix Taxonomy data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.reportsService.getMixTaxonomyArray();
  }

}
