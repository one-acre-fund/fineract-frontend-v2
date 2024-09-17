import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { OrganizationService } from '../organization.service';

@Injectable({
  providedIn: 'root'
})
export class RetailOutletResolver  {
 /*** @param {OrganizationService} organizationService Organization service.*/
  constructor(private organizationService: OrganizationService) {}

  /**
   * Returns the manage funds data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.organizationService.getRuralRetailOutlets();
  }
}
