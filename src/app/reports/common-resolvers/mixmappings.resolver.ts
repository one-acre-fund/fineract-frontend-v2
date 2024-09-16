/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { ReportsService } from '../reports.service';

/**
 * Mix Mappings data resolver.
 */
@Injectable()
export class MixMappingsResolver  {

  /**
   * @param {ReportsService} reportsService Reports service.
   */
  constructor(private reportsService: ReportsService) {}

  /**
   * Returns Mix Mappings.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.reportsService.getMixMappings();
  }

}
